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
  const distanceToTableEnd = tableBottom - headerTop;
  const distanceToViewportEnd = window.innerHeight - headerTop;

  return {
    top: headerTop,
    height: `min(${distanceToTableEnd}px, calc(${distanceToViewportEnd}px - .5rem))`,
  };
}
