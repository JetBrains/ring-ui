const edgeAreaPx = 100;
// Keeps the middle of a small scroller free from auto scroll
const maxEdgeAreaFraction = 0.3;
const maxStepPx = 16;

type Axis = 'x' | 'y';

export interface DragAutoScroll {
  update(clientX: number, clientY: number): void;
  stop(): void;
}

/**
 * The nearest ancestor which scrolls along `axis`, or `null` for the document
 */
function getScroller(table: Element, axis: Axis): HTMLElement | null {
  for (let el = table.parentElement; el && el !== document.scrollingElement; el = el.parentElement) {
    // `overflow` of <body> propagates to the viewport unless <html> has its own
    if (el === document.body && window.getComputedStyle(document.documentElement).overflow === 'visible') continue;
    const {overflowX, overflowY} = window.getComputedStyle(el);
    const isScrollable = /auto|scroll/.test(axis === 'x' ? overflowX : overflowY);
    // Ignores sub-pixel overflow
    const overflowPx = axis === 'x' ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
    if (isScrollable && overflowPx > 1) return el;
  }
  return null;
}

/**
 * The visible part of the scroller along `axis`, without borders and scrollbars
 */
function getVisibleRange(scroller: HTMLElement | null, axis: Axis) {
  const isX = axis === 'x';
  if (!scroller) {
    const root = document.documentElement;
    return {start: 0, end: isX ? root.clientWidth : root.clientHeight};
  }

  const rect = scroller.getBoundingClientRect();
  const start = isX ? rect.left + scroller.clientLeft : rect.top + scroller.clientTop;
  const end = start + (isX ? scroller.clientWidth : scroller.clientHeight);
  return {start: Math.max(start, 0), end: Math.min(end, isX ? window.innerWidth : window.innerHeight)};
}

function getRange(rect: DOMRect, axis: Axis) {
  return axis === 'x' ? {start: rect.left, end: rect.right} : {start: rect.top, end: rect.bottom};
}

/**
 * Grows from 1px at the inner boundary of the edge area to `maxStepPx` at the edge.
 * A pointer beyond the edge (negative distance) scrolls at `maxStepPx`.
 */
function getSpeed(distanceToEdge: number, edgeArea: number) {
  const closeness = Math.min(1 - distanceToEdge / edgeArea, 1);
  return Math.ceil(maxStepPx * closeness);
}

/**
 * While the drag is active, scrolls the nearest scroller of `table` along `axis`
 * when the pointer is near the scroller edge, until the table edge becomes visible.
 * The closer the pointer is to the edge, the faster the scroll.
 *
 * `preferredScroller` is used instead of the nearest scroller when set, e.g. `TableProps.scrollerRef` for `y`.
 *
 * `onScroll` is called with the last pointer position on every frame after the pointer has moved,
 * so that the caller can update anything which depends on the scroll position,
 * including after the user's wheel scroll.
 */
export function startDragAutoScroll(
  axis: Axis,
  table: HTMLTableElement,
  preferredScroller: HTMLElement | null | undefined,
  onScroll: (clientX: number, clientY: number) => void,
): DragAutoScroll {
  const isX = axis === 'x';

  const scroller = preferredScroller ?? getScroller(table, axis);

  let pointer: {clientX: number; clientY: number} | null = null;

  let rafId = requestAnimationFrame(function tick() {
    let step = 0;

    if (pointer) {
      const visible = getVisibleRange(scroller, axis);
      const edgeArea = Math.min(edgeAreaPx, (visible.end - visible.start) * maxEdgeAreaFraction);
      // The scroller is out of the viewport
      if (edgeArea > 0) {
        const pointerOffset = isX ? pointer.clientX : pointer.clientY;
        const distanceToStart = pointerOffset - visible.start;
        const distanceToEnd = visible.end - pointerOffset;

        const tableRange = getRange(table.getBoundingClientRect(), axis);
        const isTableHiddenAtStart = tableRange.start < visible.start;
        const isTableHiddenAtEnd = tableRange.end > visible.end;

        if (distanceToStart < edgeArea && isTableHiddenAtStart) {
          step = -getSpeed(distanceToStart, edgeArea);
        }
        if (distanceToEnd < edgeArea && isTableHiddenAtEnd) {
          step = getSpeed(distanceToEnd, edgeArea);
        }
      }
    }

    // Not `smooth` even if the page sets `scroll-behavior: smooth`: each frame would restart the animation
    if (step) (scroller ?? window).scrollBy({[isX ? 'left' : 'top']: step, behavior: 'instant'});
    if (pointer) onScroll(pointer.clientX, pointer.clientY);
    rafId = requestAnimationFrame(tick);
  });

  return {
    update(clientX, clientY) {
      pointer = {clientX, clientY};
    },
    stop() {
      cancelAnimationFrame(rafId);
      pointer = null;
    },
  };
}
