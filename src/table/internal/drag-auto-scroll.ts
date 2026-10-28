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
  for (let el = table.parentElement; el && el !== document.body; el = el.parentElement) {
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

/**
 * While the drag is active, scrolls the nearest scroller of `table` along `axis`
 * when the pointer is near the scroller edge, until the table edge becomes visible.
 * The closer the pointer is to the edge, the faster the scroll.
 *
 * `onScroll` is called with the last pointer position on any scroll during the drag,
 * including the user's wheel scroll, so that the caller can update anything
 * which depends on the scroll position.
 */
export function startDragAutoScroll(
  axis: Axis,
  table: Element,
  onScroll: (clientX: number, clientY: number) => void,
): DragAutoScroll {
  const isX = axis === 'x';
  const scroller = getScroller(table, axis);

  let pointer: {clientX: number; clientY: number} | null = null;

  function getStep() {
    if (!pointer) return 0;

    const {start, end} = getVisibleRange(scroller, axis);
    const area = Math.min(edgeAreaPx, (end - start) * maxEdgeAreaFraction);
    // The scroller is out of the viewport
    if (area <= 0) return 0;

    const offset = isX ? pointer.clientX : pointer.clientY;
    const tableRect = table.getBoundingClientRect();
    const tableStart = isX ? tableRect.left : tableRect.top;
    const tableEnd = isX ? tableRect.right : tableRect.bottom;
    // A pointer outside the scroller scrolls at the max speed
    const getSpeed = (distanceToEdge: number) => Math.ceil(maxStepPx * Math.min(1 - distanceToEdge / area, 1));

    if (offset < start + area && tableStart < start) return -getSpeed(offset - start);
    if (offset > end - area && tableEnd > end) return getSpeed(end - offset);
    return 0;
  }

  let rafId = requestAnimationFrame(function tick() {
    const step = getStep();
    // Not `smooth` even if the page sets `scroll-behavior: smooth`: each frame would restart the animation
    if (step) (scroller ?? window).scrollBy({[isX ? 'left' : 'top']: step, behavior: 'instant'});
    rafId = requestAnimationFrame(tick);
  });

  function handleScroll() {
    if (pointer) onScroll(pointer.clientX, pointer.clientY);
  }

  document.addEventListener('scroll', handleScroll, {capture: true, passive: true});

  return {
    update(clientX, clientY) {
      pointer = {clientX, clientY};
    },
    stop() {
      cancelAnimationFrame(rafId);
      document.removeEventListener('scroll', handleScroll, {capture: true});
      pointer = null;
    },
  };
}
