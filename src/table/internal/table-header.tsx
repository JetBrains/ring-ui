/* eslint-disable no-nested-ternary, max-lines */
import {type ComponentPropsWithRef, type Context, use, useCallback, useRef, useState, type PointerEvent} from 'react';
import classNames from 'classnames';
import arrowDownIcon from '@jetbrains/icons/arrow-12px-down';
import arrowUpIcon from '@jetbrains/icons/arrow-12px-up';
import dragIcon from '@jetbrains/icons/drag-12px';
import settingsIcon from '@jetbrains/icons/settings-12px';
import trashIcon from '@jetbrains/icons/trash-12px';
import unsortedIcon from '@jetbrains/icons/unsorted-12px';

import {type TableProps} from '../table-props';
import {ColumnAnimationContext, TablePropsContext} from '../table-const';
import {type ExpectColumnReorder} from './column-animation';
import Icon from '../../icon';
import {useComposedRef} from '../../global/compose-refs';
import {isWithinInteractiveElement} from '../../global/is-within-interactive-element';
import {parseCssDuration} from '../../global/parse-css-duration';

import styles from '../table.css';

export function TableHeader<T>({expectColumnReorder}: {expectColumnReorder: ExpectColumnReorder}) {
  const {columns, noHeader, stickyHeader, columnEditing, onColumnEditingRequest, theadClassName, theadTrClassName} =
    use(TablePropsContext as Context<TableProps<T>>);

  const [localColumnEditing, setLocalColumnEditing] = useState(false);
  const effectiveColumnEditing = columnEditing ?? localColumnEditing;

  const toggleColumnEditing = useCallback(
    (source: 'header' | 'edit-button') => {
      let newColumnEditing: boolean;
      if (columnEditing == null) {
        newColumnEditing = !localColumnEditing;
        setLocalColumnEditing(newColumnEditing);
      } else {
        newColumnEditing = !columnEditing;
      }

      onColumnEditingRequest?.(newColumnEditing, source);
    },
    [columnEditing, localColumnEditing, onColumnEditingRequest],
  );

  const handleTheadClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (window.matchMedia('(hover: none)').matches && !isWithinInteractiveElement(e.target)) {
        toggleColumnEditing('header');
      }
    },
    [toggleColumnEditing],
  );

  const handleEditColumnsButtonClick = useCallback(() => {
    toggleColumnEditing('edit-button');
  }, [toggleColumnEditing]);

  if (noHeader) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <thead
      className={classNames(
        theadClassName,
        effectiveColumnEditing && styles.theadColumnEditing,
        stickyHeader && styles.stickyHeader,
      )}
      onClick={handleTheadClick}
    >
      <tr className={theadTrClassName}>
        {columns.map((column, columnIndex) => (
          <TableHeaderCell
            key={column.key}
            columnIndex={columnIndex}
            columnEditing={effectiveColumnEditing}
            handleEditColumnsButtonClick={handleEditColumnsButtonClick}
            expectColumnReorder={expectColumnReorder}
          />
        ))}
      </tr>
    </thead>
  );
}

function TableHeaderCell<T>({
  columnIndex,
  columnEditing,
  handleEditColumnsButtonClick,
  expectColumnReorder,
}: {
  columnIndex: number;
  columnEditing: boolean;
  handleEditColumnsButtonClick: () => void;
  expectColumnReorder: ExpectColumnReorder;
}) {
  const {columns, columnEditButton} = use(TablePropsContext as Context<TableProps<T>>);
  const {key, name, renderHeader, sortOrder, deletable, canReorder, thClassName} = columns[columnIndex];

  const animatedColumn = use(ColumnAnimationContext);
  const children = renderHeader ? renderHeader() : (name ?? String(key));

  return (
    <th
      className={classNames(
        styles.headerCell,
        animatedColumn?.columnIndex === columnIndex && animatedColumn.cellClassName,
        thClassName,
      )}
      scope='col'
      aria-sort={sortOrder}
    >
      <div className={styles.headerCellInnerWrapper}>
        <div className={styles.sortAndHeader}>
          {canReorder && <ColumnReorderHandle columnIndex={columnIndex} expectColumnReorder={expectColumnReorder} />}
          {sortOrder ? (
            <SortButton columnIndex={columnIndex} aria-description={`Sort order: ${sortOrder}`}>
              {children}
            </SortButton>
          ) : (
            children
          )}
          {canReorder && <ColumnReorderHandleMirror />}
        </div>

        <div className={styles.rightButtons}>
          {deletable && <DeleteColumnButton columnIndex={columnIndex} />}
          {columnIndex === columns.length - 1 && columnEditButton && (
            <EditColumnsButton columnEditing={columnEditing} onClick={handleEditColumnsButtonClick} />
          )}
        </div>
      </div>
    </th>
  );
}

function SortButton<T>({
  columnIndex,
  className,
  children,
  onClick,
  ...restProps
}: {columnIndex: number} & ComponentPropsWithRef<'button'>) {
  const tableProps = use(TablePropsContext as Context<TableProps<T> | null>);
  const column = tableProps?.columns[columnIndex];

  const sortOrder = column?.sortOrder;
  const glyph =
    sortOrder === 'none'
      ? unsortedIcon
      : sortOrder === 'ascending'
        ? arrowUpIcon
        : sortOrder === 'descending'
          ? arrowDownIcon
          : undefined;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        const nextOrder = sortOrder === 'ascending' ? 'descending' : sortOrder === 'descending' ? 'none' : 'ascending';
        tableProps!.onSort?.(columnIndex, nextOrder, tableProps!.columns);
      }
    },
    [columnIndex, onClick, sortOrder, tableProps],
  );

  if (!tableProps || !column) {
    return null;
  }

  return (
    <button type='button' className={classNames(styles.headerButton, className)} onClick={handleClick} {...restProps}>
      {children} <Icon glyph={glyph} aria-hidden />
    </button>
  );
}

function DeleteColumnButton<T>({
  columnIndex,
  className,
  onClick,
  ...restProps
}: {columnIndex: number} & ComponentPropsWithRef<'button'>) {
  const tableProps = use(TablePropsContext as Context<TableProps<T> | null>);
  const column = tableProps?.columns[columnIndex];

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        tableProps!.onColumnDelete?.(columnIndex, tableProps!.columns);
      }
    },
    [columnIndex, onClick, tableProps],
  );

  if (!tableProps || !column) {
    return null;
  }

  const hint = `Delete column ${column.name ?? String(column.key)}.`;

  return (
    <button
      type='button'
      className={classNames(styles.headerButton, styles.deleteColumnButton, className)}
      onClick={handleClick}
      aria-label={hint}
      title={hint}
      {...restProps}
    >
      <Icon glyph={trashIcon} aria-hidden='true' />
    </button>
  );
}

function EditColumnsButton({columnEditing, ...props}: {columnEditing: boolean} & ComponentPropsWithRef<'button'>) {
  const {className, ...restProps} = props;
  const hint = columnEditing ? 'Hide column controls.' : 'Show column controls.';
  return (
    <button
      type='button'
      className={classNames(styles.headerButton, styles.editColumnsButton, className)}
      aria-pressed={columnEditing}
      aria-label={hint}
      title={hint}
      {...restProps}
    >
      <Icon glyph={settingsIcon} aria-hidden='true' />
    </button>
  );
}

function ColumnReorderHandle<T>({
  columnIndex,
  expectColumnReorder,
  ref: userRef,
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  onKeyDown,
  ...restProps
}: {columnIndex: number; expectColumnReorder: ExpectColumnReorder} & ComponentPropsWithRef<'button'>) {
  const tableProps = use(TablePropsContext as Context<TableProps<T> | null>);
  const column = tableProps?.columns[columnIndex];
  const canReorder = column?.canReorder;
  const canReorderCb = useCallback(
    (index: number) =>
      canReorder === true || (typeof canReorder === 'function' && canReorder(index, tableProps!.columns)),
    [canReorder, tableProps],
  );

  const localRef = useRef<HTMLButtonElement>(null);
  const composedRef = useComposedRef(localRef, userRef);

  const activeDragRef = useRef<{
    state: 'is-dragging' | 'ended-with-no-change';
    startColumnIndex: number;
    startClientX: number;
    headerTopClientY: number;
    columnsClientX: {l: number; r: number}[];
    indicatorHeight: string;
    cleanup: () => void;
  }>(null);

  const getDragFrame = useCallback(() => {
    return document.body.querySelector(`.${styles.columnDragFrame}`) as HTMLDivElement | null;
  }, []);

  const renderDragFrame = useCallback(
    (clientX: number) => {
      const {startColumnIndex, startClientX, headerTopClientY, columnsClientX, indicatorHeight} =
        activeDragRef.current!;
      const {l, r} = columnsClientX[startColumnIndex];

      let dragFrame = getDragFrame();
      if (!dragFrame) {
        dragFrame = document.createElement('div');
        dragFrame.className = styles.columnDragFrame;
        dragFrame.style.setProperty('top', `calc(max(0px, ${headerTopClientY - 2}px))`);
        dragFrame.style.setProperty('width', `${r - l}px`);
        dragFrame.style.setProperty('height', indicatorHeight);
        document.body.appendChild(dragFrame);
      }

      dragFrame.style.setProperty('left', `${l + clientX - startClientX}px`);
    },
    [getDragFrame],
  );

  const translateXButton = useCallback((clientX: number) => {
    if (!localRef.current || !activeDragRef.current) return;

    const {startClientX} = activeDragRef.current;
    localRef.current.style.setProperty('transform', `translateX(${clientX - startClientX}px)`);
  }, []);

  const getClosestInsertionPoint = useCallback(
    (clientX: number) => {
      let bestDistance = Infinity;
      let index = -1;
      let after = false;
      activeDragRef.current?.columnsClientX.forEach(({l, r}, i) => {
        const distanceToLeft = Math.abs(l - clientX);
        const distanceToRight = Math.abs(r - clientX);
        if (distanceToLeft < bestDistance && canReorderCb(i)) {
          bestDistance = distanceToLeft;
          index = i;
          after = false;
        }
        if (distanceToRight < bestDistance && canReorderCb(i + 1)) {
          bestDistance = distanceToRight;
          index = i;
          after = true;
        }
      });
      return {index, after};
    },
    [canReorderCb],
  );

  const getInsertionIndicator = useCallback(() => {
    return document.body.querySelector(`.${styles.columnInsertionIndicator}`) as HTMLDivElement | null;
  }, []);

  const renderInsertionIndicator = useCallback(
    (insertionPoint: ReturnType<typeof getClosestInsertionPoint>) => {
      const {index, after} = insertionPoint;
      const {headerTopClientY, columnsClientX, indicatorHeight} = activeDragRef.current!;
      const {l, r} = columnsClientX[index];

      let indicator = getInsertionIndicator();
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = styles.columnInsertionIndicator;
        indicator.style.setProperty('top', `${headerTopClientY}px`);
        indicator.style.setProperty('height', indicatorHeight);
        document.body.appendChild(indicator);
      }

      indicator.style.setProperty('left', `${(after ? r : l) - 1}px`);
    },
    [getInsertionIndicator],
  );

  const cleanupDrag = useCallback(() => {
    if (activeDragRef.current) {
      activeDragRef.current.cleanup();
      activeDragRef.current = null;
    }

    const btn = localRef.current;
    if (btn) {
      btn.style.removeProperty('transform');
      btn.style.removeProperty('transition');
    }

    getDragFrame()?.remove();
    getInsertionIndicator()?.remove();
  }, [getDragFrame, getInsertionIndicator]);

  const animateNoChangeThenCleanup = useCallback(() => {
    if (activeDragRef.current?.state === 'is-dragging') {
      activeDragRef.current.state = 'ended-with-no-change';
      activeDragRef.current.cleanup();
      activeDragRef.current.cleanup = () => {};

      const dragFrame = getDragFrame();
      if (dragFrame) {
        const {columnsClientX, startColumnIndex} = activeDragRef.current;
        dragFrame.style.left = `${columnsClientX[startColumnIndex].l}px`;
        dragFrame.style.opacity = '0';
        dragFrame.style.transition = 'left var(--ring-ease), opacity var(--ring-ease)';
      }

      const indicator = getInsertionIndicator();
      if (indicator) {
        indicator.style.opacity = '0';
        indicator.style.transition = 'opacity var(--ring-ease)';
      }

      const btn = localRef.current;
      if (btn) {
        btn.style.transform = 'translateX(0)';
        btn.style.transition = 'transform var(--ring-ease)';
      }
    }

    const ringEaseMs = parseCssDuration(
      window.getComputedStyle(document.documentElement).getPropertyValue('--ring-ease'),
    );
    setTimeout(cleanupDrag, ringEaseMs);
  }, [cleanupDrag, getDragFrame, getInsertionIndicator]);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented) return;

      const {clientX: startClientX, pointerId, currentTarget} = e;
      const thead = currentTarget.closest('thead');
      const table = thead?.closest('table');
      if (!thead || !table) return;

      const headerTopClientY = thead.getBoundingClientRect().top;

      const columnsClientX = [...thead.querySelectorAll('th')].map(th => {
        const rect = th.getBoundingClientRect();
        return {l: rect.x, r: rect.x + rect.width};
      });

      const {bottom} = table.getBoundingClientRect();
      const visibleTableHeight = bottom - headerTopClientY;
      const viewportBottomRelativeToHeaderTop = window.innerHeight - headerTopClientY;
      const indicatorHeight = `min(${visibleTableHeight}px, calc(${viewportBottomRelativeToHeaderTop}px - .5rem))`;

      currentTarget.setPointerCapture(pointerId);
      function keydownListener(keyEvent: KeyboardEvent) {
        if (keyEvent.key === 'Escape') {
          animateNoChangeThenCleanup();
          keyEvent.stopPropagation();
          keyEvent.preventDefault();
        }
      }
      document.addEventListener('keydown', keydownListener); // In Safari, the button is not focused
      currentTarget.style.cursor = 'grabbing';

      activeDragRef.current = {
        state: 'is-dragging',
        startColumnIndex: columnIndex,
        startClientX,
        headerTopClientY,
        columnsClientX,
        indicatorHeight,
        cleanup: () => {
          document.removeEventListener('keydown', keydownListener);
          currentTarget.releasePointerCapture(pointerId);
          currentTarget.style.removeProperty('cursor');
        },
      };

      renderDragFrame(startClientX);

      e.preventDefault();
    },
    [animateNoChangeThenCleanup, columnIndex, onPointerDown, renderDragFrame],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(e);
      if (e.defaultPrevented || activeDragRef.current?.state !== 'is-dragging') return;

      const {clientX} = e;
      renderDragFrame(clientX);
      translateXButton(clientX);

      const insertionPoint = getClosestInsertionPoint(clientX);
      if (insertionPoint) renderInsertionIndicator(insertionPoint);
    },
    [getClosestInsertionPoint, translateXButton, onPointerMove, renderDragFrame, renderInsertionIndicator],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerUp?.(e);
      if (e.defaultPrevented || activeDragRef.current?.state !== 'is-dragging') return;

      const table = e.currentTarget.closest('table');
      if (!table) {
        cleanupDrag();
        return;
      }

      const {index, after} = getClosestInsertionPoint(e.clientX);
      const insertionIndex = after ? index + 1 : index;
      if (insertionIndex === columnIndex || insertionIndex === columnIndex + 1) {
        animateNoChangeThenCleanup();
        return;
      }

      cleanupDrag();
      expectColumnReorder({fromIndex: columnIndex, insertionIndex});

      tableProps!.onColumnReorder?.(columnIndex, insertionIndex, tableProps!.columns);
    },
    [
      animateNoChangeThenCleanup,
      cleanupDrag,
      columnIndex,
      expectColumnReorder,
      getClosestInsertionPoint,
      onPointerUp,
      tableProps,
    ],
  );

  const handlePointerCancel = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerCancel?.(e);
      if (e.defaultPrevented) return;

      animateNoChangeThenCleanup();
    },
    [animateNoChangeThenCleanup, onPointerCancel],
  );

  const handleLostPointerCapture = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onLostPointerCapture?.(e);
      if (e.defaultPrevented) return;

      animateNoChangeThenCleanup();
    },
    [animateNoChangeThenCleanup, onLostPointerCapture],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || !tableProps) return;

      const left = e.key === 'ArrowLeft';
      const right = e.key === 'ArrowRight';
      if (!left && !right) return;

      const initialInsertionIndex = left ? columnIndex - 1 : columnIndex + 2;
      const step = left ? -1 : 1;
      // eslint-disable-next-line yoda
      for (let i = initialInsertionIndex; 0 <= i && i <= tableProps.columns.length; i += step) {
        if (canReorderCb(i)) {
          expectColumnReorder({fromIndex: columnIndex, insertionIndex: i});
          tableProps.onColumnReorder?.(columnIndex, i, tableProps.columns);
          e.preventDefault();
          return;
        }
      }
    },
    [canReorderCb, columnIndex, expectColumnReorder, onKeyDown, tableProps],
  );

  if (!tableProps || !column) {
    return null;
  }

  const hint = `Reorder column ${column.name ?? String(column.key)}.`;
  const description = 'Use Left and Right arrow keys to move the column.';

  return (
    // eslint-disable-next-line jsx-a11y/role-supports-aria-props
    <button
      ref={composedRef}
      type='button'
      className={classNames(styles.headerButton, styles.columnReorderHandle, className)}
      aria-label={hint}
      aria-description={description}
      aria-keyshortcuts='ArrowLeft ArrowRight'
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
      {...restProps}
    >
      <Icon glyph={dragIcon} aria-hidden='true' />
    </button>
  );
}

/**
 * Reserves the space for the reorder handle and prevents layout shift when the handle appears on hover.
 */
function ColumnReorderHandleMirror() {
  return <span className={styles.columnReorderHandleMirror} aria-hidden='true' />;
}
