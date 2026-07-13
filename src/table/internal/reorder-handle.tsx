/* eslint-disable max-lines */
import {type ComponentPropsWithRef, type Context, type PointerEvent, use, useCallback, useRef} from 'react';
import classNames from 'classnames';
import dragIcon from '@jetbrains/icons/drag-12px';

import {type TableProps} from '../table-props';
import {TablePropsContext} from '../table-const';
import Icon from '../../icon';
import {useComposedRef} from '../../global/compose-refs';
import {parseCssDuration} from '../../global/parse-css-duration';
import {ExpectReorderContext} from './reorder-animation';

import styles from '../table.css';

/**
 * All coordinates are client coordinates (pixels relative to the viewport).
 */
interface ActiveDrag {
  state: 'is-dragging' | 'ended-with-no-change';
  startX: number;
  startY: number;
  /**
   * Top (columns) or left (items)
   */
  indicatorStart: number;
  /**
   * Height (columns) or width (items)
   */
  indicatorSize: string;
  /**
   * Left and right (columns) or top and bottom (items).
   */
  itemBounds: {start: number; end: number}[];
  cleanup: () => void;
}

const columnDragFrameAdjustmentPx = -1;
const itemDragFrameAdjustmentPx = -2;

export function ReorderHandle<T>({
  direction,
  index,
  noDragFrame,
  noHandleTranslate,
  onUserDrag,

  ref: userRef,
  className,
  onKeyDown,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  ...restProps
}: {
  direction: 'columns' | 'items';
  index: number;
  noDragFrame?: boolean;
  noHandleTranslate?: boolean;
  onUserDrag?: (delta: 'pointerdown' | number | 'cancelled' | undefined) => void;
} & ComponentPropsWithRef<'button'>) {
  const localRef = useRef<HTMLButtonElement | null>(null);
  const composedRef = useComposedRef(localRef, userRef);

  const isColumn = direction === 'columns';

  const tableProps = use(TablePropsContext as Context<TableProps<T> | null>);
  const data = tableProps?.data;
  const columns = tableProps?.columns;
  const canReorderItem = tableProps?.canReorderItem;
  const onItemReorder = tableProps?.onItemReorder;
  const onColumnReorder = tableProps?.onColumnReorder;

  const canReorder = useCallback(
    (insertionIndex: number) => {
      if (isColumn && columns) {
        const canReorderColumn = columns?.[index]?.canReorder;
        if (canReorderColumn === true) return true;
        if (typeof canReorderColumn === 'function') return canReorderColumn(insertionIndex, columns);
        return false;
      }

      if (!isColumn && data) {
        return canReorderItem ? canReorderItem(index, insertionIndex, data) : true;
      }

      return false;
    },
    [isColumn, columns, data, index, canReorderItem],
  );

  const expectReorder = use(ExpectReorderContext);

  const onReorder = useCallback(
    (insertionIndex: number) => {
      if (isColumn && columns) {
        expectReorder({direction, fromIndex: index, insertionIndex});
        onColumnReorder?.(index, insertionIndex, columns);
      } else if (!isColumn && data) {
        expectReorder({direction, fromIndex: index, insertionIndex});
        onItemReorder?.(index, insertionIndex, data);
      }
    },
    [isColumn, columns, data, expectReorder, direction, index, onColumnReorder, onItemReorder],
  );

  const activeDragRef = useRef<ActiveDrag>(null);

  const getDragFrame = useCallback(
    () => document.body.querySelector(`.${styles.dragFrame}`) as HTMLDivElement | null,
    [],
  );

  const getInsertionIndicator = useCallback(
    () => document.body.querySelector(`.${styles.insertionIndicator}`) as HTMLDivElement | null,
    [],
  );

  const renderDragFrame = useCallback(
    (clientX: number, clientY: number) => {
      const drag = activeDragRef.current;
      if (noDragFrame || !drag) return;

      const {startX, startY, indicatorStart, itemBounds, indicatorSize} = drag;
      const {start: itemStart, end: itemEnd} = itemBounds[index];

      let dragFrame = getDragFrame();
      if (!dragFrame) {
        dragFrame = document.createElement('div');
        dragFrame.className = styles.dragFrame;

        const frameStart = `calc(max(0px, ${indicatorStart - 2}px))`;
        const frameAcrossSize = `${itemEnd - itemStart}px`;
        const frameAlongSize = indicatorSize;
        dragFrame.style[isColumn ? 'top' : 'left'] = frameStart;
        dragFrame.style[isColumn ? 'width' : 'height'] = frameAcrossSize;
        dragFrame.style[isColumn ? 'height' : 'width'] = frameAlongSize;

        document.body.appendChild(dragFrame);
      }

      if (isColumn) {
        dragFrame.style.left = `${itemStart + clientX - startX + columnDragFrameAdjustmentPx}px`;
      } else {
        dragFrame.style.top = `${itemStart + clientY - startY + itemDragFrameAdjustmentPx}px`;
      }
    },
    [getDragFrame, index, isColumn, noDragFrame],
  );

  const translateButton = useCallback(
    (clientX: number, clientY: number) => {
      const btn = localRef.current;
      const drag = activeDragRef.current;
      if (noHandleTranslate || !btn || !drag) return;

      btn.style.transform = isColumn
        ? `translateX(${clientX - drag.startX}px)`
        : `translateY(${clientY - drag.startY}px)`;
    },
    [isColumn, noHandleTranslate],
  );

  const getClosestInsertionPoint = useCallback(
    (clientX: number, clientY: number) => {
      const drag = activeDragRef.current;
      if (!drag) return {insertionIndex: -1, after: false};

      const clientPos = isColumn ? clientX : clientY;

      let bestDistance = Infinity;
      let insertionIndex = -1;
      let after = false;

      drag.itemBounds.forEach(({start, end}, i) => {
        const distanceToStart = Math.abs(start - clientPos);
        const distanceToEnd = Math.abs(end - clientPos);
        if (distanceToStart < bestDistance && canReorder?.(i)) {
          bestDistance = distanceToStart;
          insertionIndex = i;
          after = false;
        }
        if (distanceToEnd < bestDistance && canReorder?.(i + 1)) {
          bestDistance = distanceToEnd;
          insertionIndex = i;
          after = true;
        }
      });

      return {insertionIndex, after};
    },
    [canReorder, isColumn],
  );

  const renderInsertionIndicator = useCallback(
    ({insertionIndex, after}: ReturnType<typeof getClosestInsertionPoint>) => {
      const drag = activeDragRef.current;
      if (!drag) return;

      const {indicatorStart, indicatorSize, itemBounds} = drag;
      const {start: itemStart, end: itemEnd} = itemBounds[insertionIndex];

      let indicator = getInsertionIndicator();
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = styles.insertionIndicator;

        indicator.style[isColumn ? 'top' : 'left'] = `${indicatorStart}px`;
        indicator.style[isColumn ? 'height' : 'width'] = indicatorSize;
        indicator.style[isColumn ? 'width' : 'height'] = '2px';

        document.body.appendChild(indicator);
      }

      const itemOffset = `${(after ? itemEnd : itemStart) - 1}px`;
      indicator.style[isColumn ? 'left' : 'top'] = itemOffset;
    },
    [getInsertionIndicator, isColumn],
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

    onUserDrag?.(undefined);
  }, [getDragFrame, getInsertionIndicator, onUserDrag]);

  const animateNoChangeThenCleanup = useCallback(() => {
    const drag = activeDragRef.current;
    if (drag?.state === 'is-dragging') {
      drag.state = 'ended-with-no-change';
      drag.cleanup();
      drag.cleanup = () => {};

      const dragFrame = getDragFrame();
      if (dragFrame) {
        const {start: itemStart} = drag.itemBounds[index];
        if (isColumn) {
          dragFrame.style.left = `${itemStart + columnDragFrameAdjustmentPx}px`;
        } else {
          dragFrame.style.top = `${itemStart + itemDragFrameAdjustmentPx}px`;
        }
        dragFrame.style.transition = 'left var(--ring-ease), top var(--ring-ease), opacity var(--ring-ease)';
        dragFrame.style.opacity = '0';
      }

      const indicator = getInsertionIndicator();
      if (indicator) {
        indicator.style.opacity = '0';
        indicator.style.transition = 'opacity var(--ring-ease)';
      }

      const btn = localRef.current;
      if (btn) {
        btn.style.transform = isColumn ? 'translateX(0)' : 'translateY(0)';
        btn.style.transition = 'transform var(--ring-ease)';
      }

      onUserDrag?.('cancelled');
    }

    const ringEaseMs = parseCssDuration(
      window.getComputedStyle(document.documentElement).getPropertyValue('--ring-ease'),
    );
    setTimeout(cleanupDrag, ringEaseMs);
  }, [cleanupDrag, getDragFrame, getInsertionIndicator, index, isColumn, onUserDrag]);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented) return;

      const {clientX, clientY, pointerId, currentTarget} = e;

      let indicatorStart: number;
      let indicatorSize: string;
      let itemBounds: {start: number; end: number}[];

      if (isColumn) {
        const thead = currentTarget.closest('thead');
        const table = thead?.closest('table');
        if (!thead || !table) return;

        const {top: headerTop} = thead.getBoundingClientRect();
        indicatorStart = headerTop;

        const {bottom: tableBottom} = table.getBoundingClientRect();
        const visibleTableHeight = tableBottom - headerTop;
        const viewportBottomRelativeToHeaderTop = window.innerHeight - headerTop;
        indicatorSize = `min(${visibleTableHeight}px, calc(${viewportBottomRelativeToHeaderTop}px - .5rem))`;

        itemBounds = [...thead.querySelectorAll('th')].map(th => {
          const rect = th.getBoundingClientRect();
          return {start: rect.x, end: rect.x + rect.width};
        });
      } else {
        const tr = currentTarget.closest('tr');
        const tbody = tr?.closest('tbody');
        if (!tr || !tbody) return;

        const {left: itemLeft} = tr.getBoundingClientRect();
        indicatorStart = itemLeft;

        const {right: itemRight} = tr.getBoundingClientRect();
        const visibleItemWidth = itemRight - itemLeft;
        const viewportRightRelativeToTableLeft = window.innerWidth - itemLeft;
        indicatorSize = `min(${visibleItemWidth}px, calc(${viewportRightRelativeToTableLeft}px - .5rem))`;

        // No virtualization or custom renderers supported so far
        itemBounds = [...tbody.querySelectorAll('tr')].map(itemTr => {
          const rect = itemTr.getBoundingClientRect();
          return {start: rect.top, end: rect.bottom};
        });
      }

      function keydownListener(keyEvent: KeyboardEvent) {
        if (keyEvent.key === 'Escape') {
          animateNoChangeThenCleanup();
          keyEvent.stopPropagation();
          keyEvent.preventDefault();
        }
      }

      currentTarget.setPointerCapture(pointerId);
      document.addEventListener('keydown', keydownListener);
      currentTarget.style.cursor = 'grabbing';

      activeDragRef.current = {
        state: 'is-dragging',
        startX: clientX,
        startY: clientY,
        indicatorStart,
        indicatorSize,
        itemBounds,
        cleanup: () => {
          currentTarget.releasePointerCapture(pointerId);
          document.removeEventListener('keydown', keydownListener);
          currentTarget.style.removeProperty('cursor');
        },
      };

      renderDragFrame(clientX, clientY);
      onUserDrag?.('pointerdown');

      e.preventDefault();
    },
    [animateNoChangeThenCleanup, isColumn, onPointerDown, onUserDrag, renderDragFrame],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(e);
      if (e.defaultPrevented) return;

      const drag = activeDragRef.current;
      if (drag?.state !== 'is-dragging') return;

      const {clientX, clientY} = e;
      renderDragFrame(clientX, clientY);
      translateButton(clientX, clientY);

      const insertionPoint = getClosestInsertionPoint(clientX, clientY);
      if (insertionPoint.insertionIndex !== -1) renderInsertionIndicator(insertionPoint);

      onUserDrag?.(isColumn ? clientX - drag.startX : clientY - drag.startY);
    },
    [
      onPointerMove,
      renderDragFrame,
      translateButton,
      getClosestInsertionPoint,
      renderInsertionIndicator,
      onUserDrag,
      isColumn,
    ],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerUp?.(e);
      if (e.defaultPrevented) return;

      if (activeDragRef.current?.state !== 'is-dragging') return;

      const {clientX, clientY} = e;
      const insertionPoint = getClosestInsertionPoint(clientX, clientY);
      const insertionIndex = insertionPoint.insertionIndex + (insertionPoint.after ? 1 : 0);

      if (insertionIndex === index || insertionIndex === index + 1) {
        animateNoChangeThenCleanup();
        return;
      }

      cleanupDrag();
      onReorder(insertionIndex);
    },
    [animateNoChangeThenCleanup, cleanupDrag, getClosestInsertionPoint, index, onPointerUp, onReorder],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;

      const left = isColumn && e.key === 'ArrowLeft';
      const right = isColumn && e.key === 'ArrowRight';
      const up = !isColumn && e.key === 'ArrowUp';
      const down = !isColumn && e.key === 'ArrowDown';
      if ((!left && !right && !up && !down) || !columns || !data) return;

      const backward = left || up;
      const initialInsertionIndex = backward ? index - 1 : index + 2;
      const maxInsertionIndex = isColumn ? columns.length : data.length;
      const step = backward ? -1 : 1;

      // eslint-disable-next-line yoda
      for (let i = initialInsertionIndex; 0 <= i && i <= maxInsertionIndex; i += step) {
        if (canReorder(i)) {
          onReorder(i);
          e.preventDefault();
          return;
        }
      }
    },
    [canReorder, columns, data, index, isColumn, onKeyDown, onReorder],
  );

  const handlePointerCancel = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerCancel?.(e);
      if (!e.defaultPrevented) animateNoChangeThenCleanup();
    },
    [animateNoChangeThenCleanup, onPointerCancel],
  );

  const handleLostPointerCapture = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onLostPointerCapture?.(e);
      if (!e.defaultPrevented) animateNoChangeThenCleanup();
    },
    [animateNoChangeThenCleanup, onLostPointerCapture],
  );

  const hint = isColumn
    ? `Reorder column ${columns?.[index]?.name ?? String(columns?.[index]?.key)}.`
    : `Reorder item ${index}.`;
  const description = isColumn
    ? 'Use Left and Right arrow keys to move the column.'
    : 'Use Up and Down arrow keys to move the item.';
  const shortcuts = isColumn ? 'ArrowLeft ArrowRight' : 'ArrowUp ArrowDown';

  return (
    // eslint-disable-next-line jsx-a11y/role-supports-aria-props
    <button
      ref={composedRef}
      type='button'
      className={classNames(
        styles.tableButton,
        isColumn ? styles.columnReorderHandle : styles.itemReorderHandle,
        className,
      )}
      aria-label={hint}
      aria-description={description}
      aria-keyshortcuts={shortcuts}
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
