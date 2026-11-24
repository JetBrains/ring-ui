/**
 * Computes the vertical position of an indicator that spans the visible part
 * of the table, starting at the header top. Client coordinates.
 */
export function getColumnIndicatorVerticalSpan(elementInHeader: Element) {
  const thead = elementInHeader.closest('thead');
  const table = thead?.closest('table');
  if (!thead || !table) return null;

  const {top: headerTop} = thead.getBoundingClientRect();
  const {bottom: tableBottom} = table.getBoundingClientRect();
  const distanceToTableEnd = Math.min(tableBottom, getClipBottom(table)) - headerTop;
  const distanceToViewportEnd = window.innerHeight - headerTop;

  return {
    top: headerTop,
    height: `min(${distanceToTableEnd}px, calc(${distanceToViewportEnd}px - .5rem))`,
  };
}

/**
 * The bottom of the nearest ancestor that clips the table vertically, such as a scroller
 */
function getClipBottom(table: Element) {
  for (let element = table.parentElement; element && element !== document.body; element = element.parentElement) {
    if (getComputedStyle(element).overflowY !== 'visible') {
      const {bottom} = element.getBoundingClientRect();
      return bottom - (element.offsetHeight - element.clientTop - element.clientHeight);
    }
  }
  return Infinity;
}
