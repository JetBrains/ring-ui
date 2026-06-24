/* eslint-disable no-nested-ternary, max-lines */
import {type ComponentPropsWithRef, type Context, type PointerEvent, use, useCallback, useRef} from 'react';
import classNames from 'classnames';
import arrowDownIcon from '@jetbrains/icons/arrow-12px-down';
import arrowUpIcon from '@jetbrains/icons/arrow-12px-up';
import dragIcon from '@jetbrains/icons/drag-12px';
import settingsIcon from '@jetbrains/icons/settings-12px';
import trashIcon from '@jetbrains/icons/trash-12px';
import unsortedIcon from '@jetbrains/icons/unsorted-12px';

import Icon from '../icon/icon';
import {stdAnimationTimeout, TablePropsContext} from './table-const';
import {keyboardFocusableAttrName} from './table-row-focus';
import {setExpectedColumnReorder} from './table-animated-column';
import {useComposedRef} from '../global/compose-refs';

import type {TableProps} from './table';

import styles from './table.css';

export function SortButton<T>({
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

export function DeleteColumnButton<T>({
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

  const hint = `Delete column ${column.name ?? String(column.key)}`;

  return (
    <button
      type='button'
      className={classNames(styles.headerButton, styles.deleteColumnButton, className)}
      onClick={handleClick}
      aria-label={hint}
      title={hint}
      {...restProps}
    >
      <Icon glyph={trashIcon} />
    </button>
  );
}

export function EditColumnsButton(props: ComponentPropsWithRef<'button'>) {
  const {className, ...restProps} = props;
  const hint = 'Show columns controls';
  return (
    <button
      type='button'
      className={classNames(styles.headerButton, styles.editColumnsButton, className)}
      aria-label={hint}
      title={hint}
      {...restProps}
    >
      <Icon glyph={settingsIcon} />
    </button>
  );
}

export function ColumnReorderHandle<T>({
  columnIndex,
  ref: userRef,
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  ...restProps
}: {columnIndex: number} & ComponentPropsWithRef<'button'>) {
  const tableProps = use(TablePropsContext as Context<TableProps<T> | null>);
  const column = tableProps?.columns[columnIndex];
  const canReorder = column?.canReorder;

  const localRef = useRef<HTMLButtonElement>(null);
  const composedRef = useComposedRef(localRef, userRef);

  const activeDragRef = useRef<{
    state: 'is-dragging' | 'ended-with-no-change';
    startColumnIndex: number;
    startClientX: number;
    tableTopClientY: number;
    columnsClientX: {l: number; r: number}[];
    indicatorHeight: string;
    cleanup: () => void;
  }>(null);

  const getDragFrame = useCallback(() => {
    return document.body.querySelector(`.${styles.columnDragFrame}`) as HTMLDivElement | null;
  }, []);

  const renderDragFrame = useCallback(
    (clientX: number) => {
      const {startColumnIndex, startClientX, tableTopClientY, columnsClientX, indicatorHeight} = activeDragRef.current!;
      const {l, r} = columnsClientX[startColumnIndex];

      let dragFrame = getDragFrame();
      if (!dragFrame) {
        dragFrame = document.createElement('div');
        dragFrame.className = styles.columnDragFrame;
        dragFrame.style.setProperty('top', `${tableTopClientY}px`);
        dragFrame.style.setProperty('width', `${r - l - 1}px`);
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
        if (typeof canReorder === 'function' && !canReorder(i, tableProps!.columns)) return;

        const distanceToLeft = Math.abs(l - clientX);
        const distanceToRight = Math.abs(r - clientX);
        if (distanceToLeft < bestDistance || distanceToRight < bestDistance) {
          bestDistance = Math.min(distanceToLeft, distanceToRight);
          index = i;
          after = distanceToRight < distanceToLeft;
        }
      });
      return {index, after};
    },
    [canReorder, tableProps],
  );

  const getInsertionIndicator = useCallback(() => {
    return document.body.querySelector(`.${styles.columnInsertionIndicator}`) as HTMLDivElement | null;
  }, []);

  const renderInsertionIndicator = useCallback(
    (insertionPoint: ReturnType<typeof getClosestInsertionPoint>) => {
      const {index, after} = insertionPoint;
      const {tableTopClientY, columnsClientX, indicatorHeight} = activeDragRef.current!;
      const {l, r} = columnsClientX[index];

      let indicator = getInsertionIndicator();
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = styles.columnInsertionIndicator;
        indicator.style.setProperty('top', `${tableTopClientY}px`);
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

    setTimeout(cleanupDrag, stdAnimationTimeout);
  }, [cleanupDrag, getDragFrame, getInsertionIndicator]);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented) return;

      const {clientX: startClientX, pointerId, currentTarget} = e;
      const thead = currentTarget.closest('thead');
      const table = thead?.closest('table');
      if (!thead || !table) return;

      const tableTopClientY = table.getBoundingClientRect().top;

      const columnsClientX = [...thead.querySelectorAll('th')].map(th => {
        const rect = th.getBoundingClientRect();
        return {l: rect.x, r: rect.x + rect.width};
      });

      const {top, height} = table.getBoundingClientRect();
      const tableVisibleBottomViewportY = Math.min(window.innerHeight, top + height);
      const tableVisibleBottomOffsetFromTableTop = tableVisibleBottomViewportY - top;
      const viewportBottomRelativeToTableTop = window.innerHeight - top;
      const indicatorHeight = `min(${tableVisibleBottomOffsetFromTableTop}px, calc(${viewportBottomRelativeToTableTop}px - .5rem))`;

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
        tableTopClientY,
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
      setExpectedColumnReorder(table, [columnIndex, insertionIndex]);

      tableProps!.onColumnReorder?.(columnIndex, insertionIndex, tableProps!.columns);
    },
    [animateNoChangeThenCleanup, cleanupDrag, columnIndex, getClosestInsertionPoint, onPointerUp, tableProps],
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

  if (!tableProps || !column) {
    return null;
  }

  const hint = `Reorder column ${column.name ?? String(column.key)}`;

  return (
    <button
      ref={composedRef}
      type='button'
      className={classNames(styles.headerButton, styles.columnReorderHandle, className)}
      aria-label={hint}
      title={hint}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
      {...restProps}
    >
      <Icon glyph={dragIcon} />
    </button>
  );
}

/**
 * Reserves the space for the reorder handle and prevents layout shift when the handle appears on hover.
 */
export function ColumnReorderHandleMirror() {
  return <span className={styles.columnReorderHandleMirror} />;
}

export interface TableRowProps {
  /**
   * @see DefaultItemRendererProps.keyboardFocusable
   */
  keyboardFocusable?: boolean;
}

/**
 * A helper `<tr>` component for a custom {@link TableProps.renderItem} implementations.
 * Applies the standard row classnames.
 */
export function TableRow(props: TableRowProps & ComponentPropsWithRef<'tr'>) {
  const {keyboardFocusable, className, ...restProps} = props;
  const classes = classNames(styles.row, className);
  const trRestProps = keyboardFocusable ? {[keyboardFocusableAttrName]: '', ...restProps} : restProps;
  return <tr className={classes} {...trRestProps} />;
}

/**
 * A helper `<td>` component for a custom {@link TableProps.renderItem} implementations.
 * Applies the standard cell classnames, but not data-dependent `tdClassName`.
 */
export function TableCell(props: ComponentPropsWithRef<'td'>) {
  const {className, ...restProps} = props;
  const classes = classNames(styles.cell, className);
  return <td className={classes} {...restProps} />;
}
