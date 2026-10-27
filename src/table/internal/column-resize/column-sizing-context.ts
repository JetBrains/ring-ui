import {createContext, useLayoutEffect, useRef, useState, type Key, type RefObject} from 'react';

import type {Column, TableProps} from '../../table-props';

interface ColumnSizingContextValue {
  /**
   * Called when the user starts resizing. Measures the columns whose width
   * is not known yet and keeps it, which switches the table to fixed layout.
   * Returns the widths of all columns, or `undefined` if there is no header.
   */
  freezeWidths(): number[] | undefined;

  commitWidth(columnKey: Key, width: number): void;
}

export const ColumnSizingContext = createContext<ColumnSizingContextValue>({
  freezeWidths: () => undefined,
  commitWidth: () => {},
});

export function useColumnSizing<T>({
  columns,
  onColumnResize,
  tableRef,
}: {
  columns: readonly Column<T>[];
  onColumnResize: TableProps<T>['onColumnResize'];
  tableRef: RefObject<HTMLTableElement | null>;
}) {
  // Widths measured or set by the user, used for columns without `width`
  const [internalWidths, setInternalWidths] = useState<ReadonlyMap<Key, number>>(() => new Map());

  // A drag commits after several renders, so it must see the latest columns and callback
  const latestPropsRef = useRef({columns, onColumnResize});
  useLayoutEffect(() => {
    latestPropsRef.current = {columns, onColumnResize};
  });

  const hasColgroup = columns.some(column => column.resizable || column.width != null);
  const widths = columns.map(column => column.width ?? internalWidths.get(column.key));
  const fixedLayout = hasColgroup && widths.every(width => width != null);
  const totalWidth = fixedLayout ? widths.reduce((sum, width) => sum + width, 0) : undefined;

  function freezeWidths() {
    const headerCells = tableRef.current?.tHead?.rows[0]?.cells;
    if (!headerCells) return undefined;

    // Floor, so that the sum doesn't exceed the container
    const frozenWidths = columns.map(
      (_column, index) => widths[index] ?? Math.floor(headerCells[index]?.getBoundingClientRect().width ?? 0),
    );
    if (!fixedLayout) {
      setInternalWidths(new Map(columns.map((column, index) => [column.key, frozenWidths[index]])));
    }
    return frozenWidths;
  }

  function commitWidth(columnKey: Key, width: number) {
    const {columns: latestColumns, onColumnResize: latestOnColumnResize} = latestPropsRef.current;
    const columnIndex = latestColumns.findIndex(column => column.key === columnKey);
    if (columnIndex === -1) return;

    // Ignored for columns with `width`: the client decides by updating `columns`
    setInternalWidths(prev => new Map(prev).set(columnKey, width));
    latestOnColumnResize?.(latestColumns[columnIndex], columnIndex, width, latestColumns);
  }

  return {
    hasColgroup,
    fixedLayout,
    totalWidth,
    widths,
    contextValue: {freezeWidths, commitWidth} satisfies ColumnSizingContextValue,
  };
}
