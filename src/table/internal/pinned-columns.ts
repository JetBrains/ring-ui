import {createContext, type RefObject, useLayoutEffect} from 'react';
import classNames from 'classnames';

import type {Column} from '../table-props';

import styles from '../table.css';

export interface PinnedColumns {
  columnCount: number;
  startCount: number;
  endCount: number;
  /**
   * Sticky offset of each pinned column from its edge, `undefined` for other columns
   */
  offsets: readonly (number | undefined)[];
  startWidth: number;
  endWidth: number;
  /**
   * The innermost pinned columns that have a width, they show the dividers
   */
  startEdgeIndex: number;
  endEdgeIndex: number;
}

export const noPinnedColumns: PinnedColumns = {
  columnCount: 0,
  startCount: 0,
  endCount: 0,
  offsets: [],
  startWidth: 0,
  endWidth: 0,
  startEdgeIndex: -1,
  endEdgeIndex: -1,
};

export const PinnedColumnsContext = createContext<PinnedColumns>(noPinnedColumns);

const subpixelTolerance = 0.5;

export const pinnedStartScrolledAttr = 'data-pinned-start-scrolled';
export const pinnedEndScrolledAttr = 'data-pinned-end-scrolled';

export function getPinnedColumns<T>(
  columns: readonly Column<T>[],
  widths: readonly (number | undefined)[],
): PinnedColumns {
  let startCount = 0;
  while (startCount < columns.length && columns[startCount].pinned === 'start') startCount++;
  let endCount = 0;
  while (endCount < columns.length - startCount && columns[columns.length - 1 - endCount].pinned === 'end') endCount++;
  if (!startCount && !endCount) return noPinnedColumns;

  const offsets: (number | undefined)[] = [];
  let startWidth = 0;
  for (let i = 0; i < startCount; i++) {
    offsets[i] = startWidth;
    startWidth += widths[i] ?? 0;
  }
  let endWidth = 0;
  for (let i = columns.length - 1; i >= columns.length - endCount; i--) {
    offsets[i] = endWidth;
    endWidth += widths[i] ?? 0;
  }

  let startEdgeIndex = startCount - 1;
  while (startEdgeIndex > 0 && columns[startEdgeIndex].fill) startEdgeIndex--;
  let endEdgeIndex = endCount ? columns.length - endCount : -1;
  while (endEdgeIndex !== -1 && endEdgeIndex < columns.length - 1 && columns[endEdgeIndex].fill) endEdgeIndex++;

  return {
    columnCount: columns.length,
    startCount,
    endCount,
    offsets,
    startWidth,
    endWidth,
    startEdgeIndex,
    endEdgeIndex,
  };
}

/**
 * Sticky position and divider of a cell in a pinned column, `undefined` for other columns
 */
export function getPinnedCellProps(pinnedColumns: PinnedColumns, columnIndex: number) {
  const offset = pinnedColumns.offsets[columnIndex];
  if (offset == null) return undefined;
  return {
    className: classNames(
      styles.pinnedCell,
      columnIndex === pinnedColumns.startEdgeIndex && styles.pinnedStartEdge,
      columnIndex === pinnedColumns.endEdgeIndex && styles.pinnedEndEdge,
    ),
    style: columnIndex < pinnedColumns.startCount ? {insetInlineStart: offset} : {insetInlineEnd: offset},
  };
}

/**
 * Marks the table while content is scrolled under the pinned columns, which shows the dividers
 */
export function usePinnedColumnsScrollState(
  tableRef: RefObject<HTMLTableElement | null>,
  {columnCount, startCount, endCount}: PinnedColumns,
) {
  useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table || (!startCount && !endCount)) return undefined;

    function update() {
      if (!table) return;
      const rows = table.tHead?.rows ?? table.tBodies[0]?.rows;
      const cells = rows && [...rows].find(row => row.cells.length === columnCount)?.cells;
      if (!cells) return;
      const overlaps = (before: Element | undefined, after: Element | undefined) =>
        !!before &&
        !!after &&
        after.getBoundingClientRect().left < before.getBoundingClientRect().right - subpixelTolerance;

      const startScrolled = startCount > 0 && overlaps(cells[startCount - 1], cells[startCount]);
      const endScrolled = endCount > 0 && overlaps(cells[columnCount - endCount - 1], cells[columnCount - endCount]);

      table.toggleAttribute(pinnedStartScrolledAttr, startScrolled);
      table.toggleAttribute(pinnedEndScrolledAttr, endScrolled);
    }

    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(table);
    // The scroller may resize without the table, e.g. with a fixed-width table
    if (table.parentElement) resizeObserver.observe(table.parentElement);
    document.addEventListener('scroll', update, {capture: true, passive: true});
    window.addEventListener('resize', update);

    return () => {
      resizeObserver.disconnect();
      document.removeEventListener('scroll', update, {capture: true});
      window.removeEventListener('resize', update);
      table.removeAttribute(pinnedStartScrolledAttr);
      table.removeAttribute(pinnedEndScrolledAttr);
    };
  }, [tableRef, startCount, endCount, columnCount]);
}
