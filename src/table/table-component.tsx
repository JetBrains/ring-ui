import React, {type HTMLAttributes, useRef} from 'react';
import classNames from 'classnames';

import {IntersectionObserverContext} from '../global/intersection-observer-context';
import {SpacerRow, useTableVirtualize} from './table-virtualize';
import {DefaultRowRenderer} from './default-row-renderer';
import {
  CollapseItemIntoSpacerContext,
  ColumnIndexContext,
  defaultLookaheadPx,
  defaultMinScrollAndResizeDeltaPx,
  defaultRetentionMarginPx,
  defaultRowHeight,
  TablePropsContext,
} from './table-const';

import type {TableProps} from './table';

import styles from './table.css';

/**
 * The new Table component. Use it instead of tables in the `legacy-table` folder.
 *
 * Minimal usage requires the following props:
 * - `data`
 * - `getKey`
 * - `columns`
 *   - `key`
 *   - `renderCell` (not required, but usually needed)
 *
 * ## Selection
 *
 * Following three props support the selection:
 *
 * - `selection`
 * - `isItemClickable`
 * - `DefaultRowRenderer.onClick`
 *
 * Only `selection` is required: you can display and modify selection your way, e.g., via
 * checkboxes in cells.
 *
 * ## Sorting
 * You need the following to support sorting:
 *
 * - Include `<SortButton />` in a column header
 * - Set initial `Column.sortOrder` to `none`, `ascending`.
 * Do not leave `undefined` for the accessibility reasons.
 * - Handle `TableProps.onSort` callback in the client code. It is expected
 * to update `columns`, by setting the new `sortOrder` value for
 * the corresponding column, and updating the data accordingly.
 *
 * ## Deleting columns
 * You need the following to support deleting columns:
 *
 * - Make sure the `column` has a proper `name` or `key` prop, which will be
 * automatically included in the aria-label of `<DeleteColumnButton />`.
 * - Include `<DeleteColumnButton />` in a column header
 * - Handle `TableProps.onColumnDelete` callback in the client code. It is expected
 * to update `columns` by removing the corresponding column.
 *
 * ## Row virtualization
 *
 * To render only rows near the viewport and replace others with spacers, use:
 *
 * - `virtualizeRows`
 * - `scrollerRef` — required when the scrollable container is not the whole document
 * - `estimateHeight` — recommended when rows are expected to be taller than
 *   the default height (e.g. multiline or custom content)
 * - Fine-tuning props: `lookaheadPx`, `retentionMarginPx`, `minScrollAndResizeDeltaPx`
 */
export default function Table<T>(props: TableProps<T> & HTMLAttributes<HTMLTableElement>) {
  const {
    data,
    columns,
    getKey,
    selection,
    isItemClickable,
    isItemFocusableByArrowKeys,
    onItemFocus,
    onItemKeyDown,
    getItemLevel,
    onItemMove,
    onSort,
    onColumnDelete,
    onColumnMove,
    renderItem,
    virtualizeRows = false,
    scrollerRef,
    estimateHeight = () => defaultRowHeight,
    lookaheadPx = defaultLookaheadPx,
    retentionMarginPx = defaultRetentionMarginPx,
    minScrollAndResizeDeltaPx = defaultMinScrollAndResizeDeltaPx,
    className,
    theadClassName,
    theadTrClassName,
    tbodyClassName,
    columnEditButton,
    ...restProps
  } = props;

  const tableRef = useRef<HTMLTableElement | null>(null);

  const {virtualItems, intersectionObserverHandle, collapseItemIntoSpacer} = useTableVirtualize({
    enabled: virtualizeRows,
    length: data.length,
    scrollerRef,
    tableRef,
    estimateHeight,
    lookaheadPx,
    retentionMarginPx,
    minScrollAndResizeDeltaPx,
  });

  return (
    <TablePropsContext.Provider value={props as TableProps<unknown>}>
      <IntersectionObserverContext.Provider value={intersectionObserverHandle}>
        <table className={classNames(styles.table, className)} ref={tableRef} {...restProps}>
          <thead className={theadClassName}>
            <tr className={classNames(styles.headerRow, theadTrClassName)}>
              {columns.map((column, columnIndex) => (
                <th
                  key={column.key}
                  className={classNames(styles.headerCell, column.thClassName)}
                  aria-sort={column.sortOrder}
                >
                  <ColumnIndexContext.Provider value={columnIndex}>
                    {column.renderHeader?.() ?? column.name ?? String(column.key)}
                  </ColumnIndexContext.Provider>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={tbodyClassName}>
            {virtualItems.map(virtualItem => {
              if (virtualItem.type === 'spacer') {
                return <SpacerRow key={virtualItem.key} spacer={virtualItem} colSpan={columns.length} />;
              }

              const index = virtualItem.index;
              const item = data[index];
              const key = props.getKey(item, index);
              return (
                <CollapseItemIntoSpacerContext.Provider
                  value={height => collapseItemIntoSpacer(index, height)}
                  key={key}
                >
                  {renderItem ? renderItem(item, index) : <DefaultRowRenderer index={index} />}
                </CollapseItemIntoSpacerContext.Provider>
              );
            })}
          </tbody>
        </table>
      </IntersectionObserverContext.Provider>
    </TablePropsContext.Provider>
  );
}
