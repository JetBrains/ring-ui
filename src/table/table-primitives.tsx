/* eslint-disable max-lines */
import {type ComponentPropsWithRef, type Context, type PointerEvent, use, useCallback, useRef} from 'react';
import classNames from 'classnames';
import arrowDownIcon from '@jetbrains/icons/arrow-12px-down';
import arrowUpIcon from '@jetbrains/icons/arrow-12px-up';
import dragIcon from '@jetbrains/icons/drag-12px';
import trashIcon from '@jetbrains/icons/trash-12px';
import unsortedIcon from '@jetbrains/icons/unsorted-12px';

import Icon from '../icon/icon';
import {ColumnIndexContext, stdAnimationTimeout, TablePropsContext} from './table-const';
import {keyboardFocusableAttrName} from './table-row-focus';
import {setExpectedColumnReorder} from './table-animated-column';

import type {SortOrder, TableProps} from './table';

import styles from './table.css';

/**
 * Include it in a column header to make the column sortable.
 * Handle clicks with {@link TableProps.onSort}.
 */
export function SortButton<T>({className, children, onClick, ...restProps}: ComponentPropsWithRef<'button'>) {
  const tableProps = use(TablePropsContext as Context<TableProps<T> | null>);
  const columnIndex = use(ColumnIndexContext);
  const column = tableProps?.columns[columnIndex];

  const sortOrder = column?.sortOrder ?? 'none';
  // eslint-disable-next-line no-nested-ternary, prettier/prettier
  const glyph = sortOrder === 'none' ? unsortedIcon
    : sortOrder === 'ascending' ? arrowUpIcon
    : arrowDownIcon;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        const sequence = ['none', 'ascending', 'descending'] satisfies SortOrder[];
        const nextOrder = sequence[(sequence.indexOf(sortOrder) + 1) % sequence.length];
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

/**
 * Include it in a column header to make the column deletable.
 * Beware that `column.name ?? String(column.key)` is used in the aria-label.
 * Handle clicks with {@link TableProps.onColumnDelete}.
 */
export function DeleteColumnButton<T>({className, onClick, ...restProps}: ComponentPropsWithRef<'button'>) {
  const tableProps = use(TablePropsContext as Context<TableProps<T> | null>);
  const columnIndex = use(ColumnIndexContext);
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

  return (
    <button
      type='button'
      className={classNames(styles.headerButton, styles.deleteColumnButton, className)}
      onClick={handleClick}
      aria-label={`Delete column ${column.name ?? String(column.key)}`}
      {...restProps}
    >
      <Icon glyph={trashIcon} />
    </button>
  );
}

/**
 * Include it in a column header to allow users to reorder the column.
 * Do not include the space between the handle and the text - the handle
 * already includes the right margin.
 *
 * Beware that `column.name ?? String(column.key)` is used in the aria-label.
 *
 * Handle reorder requests with {@link TableProps.onColumnReorder}.
 */
export function ColumnReorderHandle<T>({
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  ...restProps
}: ComponentPropsWithRef<'button'>) {
  const tableProps = use(TablePropsContext as Context<TableProps<T> | null>);
  const columnIndex = use(ColumnIndexContext);
  const column = tableProps?.columns[columnIndex];

  const activeDragRef = useRef<{
    startClientX: number;
    pointerId: number;
    columnsClientX: {l: number; r: number}[];
    keydownListener: (keyEvent: KeyboardEvent) => void;
  }>(null);

  const getHeaderCellElements = useCallback((currentTarget: HTMLButtonElement) => {
    const th = currentTarget.closest('th');
    if (!th) return null;
    const thead = th.closest('thead');
    if (!thead) return null;
    const table = thead.closest('table');
    if (!table) return null;
    return {currentTarget, th, thead, table};
  }, []);

  type HeaderElements = NonNullable<ReturnType<typeof getHeaderCellElements>>;

  const getDragState = useCallback(
    ({th}: HeaderElements) =>
      th.getAttribute('data-ring-drag-state') as 'is-dragging' | 'ended-with-no-change' | undefined,
    [],
  );

  const setDragState = useCallback(
    ({th}: HeaderElements, state: 'is-dragging' | 'ended-with-no-change' | undefined) => {
      if (state != null) {
        th.setAttribute('data-ring-drag-state', state);
      } else {
        th.removeAttribute('data-ring-drag-state');
      }
    },
    [],
  );

  const setDragOffsetX = useCallback(({th}: HeaderElements, offsetX: number | undefined) => {
    if (offsetX != null) {
      th.style.setProperty('--ring-drag-offset-x', `${offsetX}px`);
    } else {
      th.style.removeProperty('--ring-drag-offset-x');
    }
  }, []);

  const setDragFrameHeight = useCallback(({table}: HeaderElements, value: string | undefined) => {
    if (value != null) {
      table.style.setProperty('--ring-drag-frame-height', value);
    } else {
      table.style.removeProperty('--ring-drag-frame-height');
    }
  }, []);

  const getClosestInsertionPoint = useCallback((clientX: number) => {
    let bestDistance = Infinity;
    let index = -1;
    let after = false;
    activeDragRef.current?.columnsClientX.forEach(({l, r}, i) => {
      const distanceToLeft = Math.abs(l - clientX);
      const distanceToRight = Math.abs(r - clientX);
      if (distanceToLeft < bestDistance || distanceToRight < bestDistance) {
        bestDistance = Math.min(distanceToLeft, distanceToRight);
        index = i;
        after = distanceToRight < distanceToLeft;
      }
    });
    return {index, after};
  }, []);

  const indicateInsertionPoint = useCallback(
    ({thead}: HeaderElements, insertionPoint: ReturnType<typeof getClosestInsertionPoint> | undefined) => {
      thead.querySelectorAll('th')?.forEach((th, index) => {
        th.removeAttribute('data-ring-insert-before');
        th.removeAttribute('data-ring-insert-after');
        if (index === insertionPoint?.index) {
          th.setAttribute(insertionPoint.after ? 'data-ring-insert-after' : 'data-ring-insert-before', '');
        }
      });
    },
    [],
  );

  const cleanupDrag = useCallback(
    (headerElements: HeaderElements) => {
      if (activeDragRef.current) {
        headerElements.currentTarget.releasePointerCapture?.(activeDragRef.current.pointerId);
        document.removeEventListener('keydown', activeDragRef.current.keydownListener);
        activeDragRef.current = null;
      }

      setDragState(headerElements, undefined);
      setDragOffsetX(headerElements, undefined);
      setDragFrameHeight(headerElements, undefined);
      indicateInsertionPoint(headerElements, undefined);
    },
    [indicateInsertionPoint, setDragFrameHeight, setDragOffsetX, setDragState],
  );

  const animateNoChangeThenCleanup = useCallback(
    (headerElements: HeaderElements) => {
      setDragState(headerElements, 'ended-with-no-change');
      setDragOffsetX(headerElements, 0);
      setTimeout(() => cleanupDrag(headerElements), stdAnimationTimeout);
    },
    [cleanupDrag, setDragOffsetX, setDragState],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented) return;

      const headerElements = getHeaderCellElements(e.currentTarget);
      if (!headerElements || getDragState(headerElements)) return;

      const {clientX, pointerId} = e;
      e.currentTarget.setPointerCapture(pointerId);

      const columnsClientX = [...headerElements.thead.querySelectorAll('th')].map(th => {
        const rect = th.getBoundingClientRect();
        return {l: rect.x, r: rect.x + rect.width};
      });
      function keydownListener(keyEvent: KeyboardEvent) {
        if (headerElements && keyEvent.key === 'Escape') {
          animateNoChangeThenCleanup(headerElements);
          keyEvent.stopPropagation();
          keyEvent.preventDefault();
        }
      }
      document.addEventListener('keydown', keydownListener); // In Safari, the button is not focused
      activeDragRef.current = {startClientX: clientX, pointerId, columnsClientX, keydownListener};

      setDragState(headerElements, 'is-dragging');
      setDragOffsetX(headerElements, 0);

      const {top, height} = headerElements.table.getBoundingClientRect();
      const tableVisibleBottomViewportY = Math.min(window.innerHeight, top + height);
      const tableVisibleBottomOffsetFromTableTop = tableVisibleBottomViewportY - top;
      const viewportBottomRelativeToTableTop = window.innerHeight - top;
      setDragFrameHeight(
        headerElements,
        `min(${tableVisibleBottomOffsetFromTableTop}px, calc(${viewportBottomRelativeToTableTop}px - .5rem))`,
      );
    },
    [
      animateNoChangeThenCleanup,
      getDragState,
      getHeaderCellElements,
      onPointerDown,
      setDragFrameHeight,
      setDragOffsetX,
      setDragState,
    ],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(e);
      if (e.defaultPrevented || !activeDragRef.current) return;

      const headerElements = getHeaderCellElements(e.currentTarget);
      if (!headerElements || getDragState(headerElements) !== 'is-dragging') return;

      const {clientX} = e;
      const {startClientX} = activeDragRef.current;
      setDragOffsetX(headerElements, clientX - startClientX);

      const insertionPoint = getClosestInsertionPoint(clientX);
      indicateInsertionPoint(headerElements, insertionPoint);
    },
    [
      getClosestInsertionPoint,
      getDragState,
      getHeaderCellElements,
      indicateInsertionPoint,
      onPointerMove,
      setDragOffsetX,
    ],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerUp?.(e);
      if (e.defaultPrevented || !activeDragRef.current) return;

      const headerElements = getHeaderCellElements(e.currentTarget);
      if (!headerElements || getDragState(headerElements) !== 'is-dragging') return;

      const {index, after} = getClosestInsertionPoint(e.clientX);
      const insertionIndex = after ? index + 1 : index;
      if (insertionIndex === columnIndex || insertionIndex === columnIndex + 1) {
        animateNoChangeThenCleanup(headerElements);
        return;
      }

      cleanupDrag(headerElements);
      setExpectedColumnReorder(headerElements.table, [columnIndex, insertionIndex]);

      tableProps!.onColumnReorder?.(columnIndex, insertionIndex, tableProps!.columns);
    },
    [
      animateNoChangeThenCleanup,
      cleanupDrag,
      columnIndex,
      getClosestInsertionPoint,
      getDragState,
      getHeaderCellElements,
      onPointerUp,
      tableProps,
    ],
  );

  const handlePointerCancel = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerCancel?.(e);
      if (e.defaultPrevented || !activeDragRef.current) return;

      const headerElements = getHeaderCellElements(e.currentTarget);
      if (headerElements) animateNoChangeThenCleanup(headerElements);
    },
    [animateNoChangeThenCleanup, getHeaderCellElements, onPointerCancel],
  );

  const handleLostPointerCapture = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onLostPointerCapture?.(e);
      if (e.defaultPrevented || !activeDragRef.current) return;

      const headerElements = getHeaderCellElements(e.currentTarget);
      if (headerElements) animateNoChangeThenCleanup(headerElements);
    },
    [animateNoChangeThenCleanup, getHeaderCellElements, onLostPointerCapture],
  );

  if (!tableProps || !column) {
    return null;
  }

  return (
    <button
      type='button'
      className={classNames(styles.headerButton, styles.columnReorderHandle, className)}
      aria-label={`Reorder column ${column.name ?? String(column.key)}`}
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
 * Insert to the right of the column header text to reserve the space for the reorder handle
 * and prevent layout shift when the handle appears on hover.
 * Do not add the space between the text and the component - it already includes the left margin.
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
