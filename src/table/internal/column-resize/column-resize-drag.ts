import {getColumnIndicatorVerticalSpan} from '../column-indicator-vertical-span';

import styles from '../../table.css';

const defaultMinColumnWidth = 40;

interface ColumnResizeDragParams {
  handle: HTMLElement;
  pointerId: number;
  clientX: number;
  columnIndex: number;
  /**
   * Widths of all columns at drag start, as rendered by React
   */
  startWidths: readonly number[];
  minWidth?: number;
  maxWidth?: number;
  onCommit: (width: number) => void;
  onEnd: () => void;
}

/**
 * Lets the user resize a column by dragging its handle.
 *
 * The width is previewed by writing directly to the `<col>` elements, without
 * rendering. On release, the DOM is restored and `onCommit` is called, so that
 * React renders the new width. Escape, pointer cancellation, and lost pointer
 * capture cancel the drag.
 *
 * Everything is captured when the drag starts, so re-renders don't affect it.
 * Returns a function that cancels the drag.
 */
export function startColumnResizeDrag({
  handle,
  pointerId,
  clientX: startClientX,
  columnIndex,
  startWidths,
  minWidth: columnMinWidth = defaultMinColumnWidth,
  maxWidth: columnMaxWidth = Infinity,
  onCommit,
  onEnd,
}: ColumnResizeDragParams): () => void {
  const elements = findDragElements(handle, columnIndex);
  if (!elements) {
    onEnd();
    return () => {};
  }

  const {th, table, column, filler} = elements;
  const startWidth = startWidths[columnIndex];
  const startTotalWidth = startWidths.reduce((sum, width) => sum + width, 0);
  // The bounds never make the column jump: a column that is already outside of them can only be resized towards them
  const minWidth = Math.min(columnMinWidth, startWidth);
  const maxWidth = Math.max(columnMaxWidth, startWidth);
  // Where the user grabbed the handle, relative to the column edge
  const grabOffset = startClientX - th.getBoundingClientRect().right;

  let width = startWidth;
  let lastClientX = startClientX;

  const indicator = document.createElement('div');
  indicator.className = styles.columnResizeIndicator;
  document.body.appendChild(indicator);

  const previousBodyCursor = document.body.style.cursor;
  const previousBodyUserSelect = document.body.style.userSelect;
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';

  function setDomWidths(columnWidth: number, fillerWidth: number) {
    column.style.width = `${columnWidth}px`;
    filler.style.width = `${fillerWidth}px`;
    table.style.width = `${startTotalWidth - startWidth + columnWidth + fillerWidth}px`;
  }

  function positionIndicator(columnRight: number) {
    const span = getColumnIndicatorVerticalSpan(th);
    if (span) {
      indicator.style.top = `${span.top}px`;
      indicator.style.height = span.height;
    }
    indicator.style.left = `${columnRight - 1}px`;
  }

  // Uses the column's current position rather than the pointer delta,
  // so the edge stays under the pointer when the table scrolls mid-drag.
  function update(clientX: number) {
    lastClientX = clientX;
    const {left} = th.getBoundingClientRect();
    width = Math.round(Math.min(maxWidth, Math.max(minWidth, clientX - grabOffset - left)));
    setDomWidths(width, Math.max(0, startWidth - width));
    positionIndicator(left + width);
  }

  function end(commit: boolean) {
    handle.removeEventListener('pointermove', handlePointerMove);
    handle.removeEventListener('pointerup', handlePointerUp);
    handle.removeEventListener('pointercancel', cancel);
    handle.removeEventListener('lostpointercapture', cancel);
    window.removeEventListener('keydown', handleKeyDown, {capture: true});
    document.removeEventListener('scroll', handleScroll, {capture: true});
    if (handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId);

    indicator.remove();
    document.body.style.cursor = previousBodyCursor;
    document.body.style.userSelect = previousBodyUserSelect;
    setDomWidths(startWidth, 0);

    if (commit && width !== startWidth) onCommit(width);
    onEnd();
  }

  function cancel() {
    end(false);
  }

  function handlePointerMove(e: PointerEvent) {
    if (e.pointerId === pointerId) update(e.clientX);
  }

  function handlePointerUp(e: PointerEvent) {
    if (e.pointerId === pointerId) end(true);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Escape') return;
    // Capture phase on `window`, so that e.g. a surrounding dialog doesn't close
    e.stopPropagation();
    e.preventDefault();
    cancel();
  }

  function handleScroll() {
    update(lastClientX);
  }

  handle.setPointerCapture(pointerId);
  handle.addEventListener('pointermove', handlePointerMove);
  handle.addEventListener('pointerup', handlePointerUp);
  handle.addEventListener('pointercancel', cancel);
  handle.addEventListener('lostpointercapture', cancel);
  window.addEventListener('keydown', handleKeyDown, {capture: true});
  document.addEventListener('scroll', handleScroll, {capture: true, passive: true});

  positionIndicator(th.getBoundingClientRect().right);
  return cancel;
}

function findDragElements(handle: HTMLElement, columnIndex: number) {
  const th = handle.closest('th');
  const table = th?.closest('table');
  const cols = table?.querySelectorAll<HTMLTableColElement>(':scope > colgroup > col');
  const column = cols?.[columnIndex];
  // The last `<col>` keeps the table width while shrinking (see `ColumnGroup`). Otherwise,
  // a container scrolled to the end reduces its scroll position and the content shifts under the pointer.
  const filler = cols?.[cols.length - 1];
  return th && table && column && filler ? {th, table, column, filler} : undefined;
}
