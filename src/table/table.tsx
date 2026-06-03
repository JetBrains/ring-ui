/* eslint-disable max-lines */
import React, {
  type Context,
  createContext,
  useContext,
  type HTMLAttributes,
  Fragment,
  type ReactNode,
  useRef,
} from 'react';
import classNames from 'classnames';
import unsortedIcon from '@jetbrains/icons/unsorted-12px';
import arrowDownIcon from '@jetbrains/icons/arrow-12px-down';
import arrowUpIcon from '@jetbrains/icons/arrow-12px-up';
import trashIcon from '@jetbrains/icons/trash-12px';

import Icon from '../icon/icon';
import {IntersectionObserverContext, useIsIntersectingListener} from '../global/intersection-observer-context';
import {SpacerRow, useTableVirtualize} from './table-virtualize';

import type Selection from '../legacy-table/selection';

import styles from './table.css';

export interface TableProps<T> {
  /**
   * The data items to render.
   */
  data: T[];

  /**
   * Columns specification.
   */
  columns: Column<T>[];

  /**
   * Used to render a row key, e.g. `<tr key={getKey(item, index)}>`.
   */
  getKey: (item: T, index: number) => React.Key;

  /**
   * Displays the selection state.
   */
  selection?: Selection<T>;

  /**
   * Highlights an item on hover. Note that `onItemClick` works regardless
   * of the value of this prop.
   */
  isClickable?: (item: T, index: number) => boolean;

  /**
   * Called when a `pointerup` event is handled at row level,
   * and the event target is not an active element, such as
   * `button`, `a`, `input`, or `select` elements.
   */
  onItemClick?: (e: PointerEvent, item: T, index: number) => void;

  /**
   * If true, the item can be focused by keyboard up/down arrows.
   */
  isFocusable?: (item: T, index: number) => boolean;

  /**
   * When the item should get focused by keyboard navigation.
   * The client is expected to update `selection`.
   */
  onFocus?: (item: T, index: number) => void;

  /**
   * Called when a `keydown` event is handled at a focused row.
   */
  onItemKeyDown?: (e: React.KeyboardEvent, item: T, index: number) => void;

  /**
   * A level of a nested item. Results in an indent for columns with `indent: true`.
   * 0, negative and not set mean no indent.
   */
  getItemLevel?: (item: T, index: number) => number;

  /**
   * Called when the client moves a row by dragging it.
   */
  onRowMove?: (item: T, fromIndex: number, toIndex: number) => void;

  /**
   * Called when the client clicks on SortButton in a column header.
   */
  onSort?: (columnIndex: number, newOrder: SortOrder) => void;

  /**
   * Called when the client clicks on a column delete button in the header.
   */
  onColumnDelete?: (columnIndex: number) => void;

  /**
   * Called when the client moves a column.
   */
  onColumnMove?: (fromIndex: number, toIndex: number) => void;

  /**
   * Custom renderer for a data item.
   *
   * Expected to return one or more rows. If provided, completely
   * overrides standard column-based rendering.
   *
   * Use `TableRow` and `TableCell` components to apply standard classnames.
   * Beware that data-dependent classnames, namely `tbodyTrClassName` and `tdClassName`,
   * will not be applied; likewise `onItemClick` and `onItemKeyDown` won't be attached.
   *
   * The implementation may use `StandardRowRenderer` to fall back to default behavior,
   * including data-dependent classnames and event handlers mentioned above.
   * It's also okay to render several rows, one of which uses `StandardRowRenderer`,
   * other being custom.
   *
   * @see StandardRowRendererProps
   */
  renderItem?: (item: T, index: number) => ReactNode;

  /**
   * Only renders rows near the viewport.
   *
   * Rows may transition between two states:
   * - materialized: rendered as actual table rows. This happens when the corresponding
   *   spacer approaches the viewport, as specified by `lookaheadPx`.
   * - virtualized: replaced with spacer rows of the same height. This happens when the row
   *   moves sufficiently far from the viewport, as specified by `retentionMarginPx`.
   */
  virtualizeRows?: boolean;

  /**
   * Used with `virtualizeRows` as a source of scroll events, as a target for ResizeObserver,
   * and as the root for IntersectionObserver. Required when the scrollable container is not
   * the whole document.
   *
   * If not set:
   * - scroll listener is attached to `window`
   * - ResizeObserver observes `document.body`
   * - IntersectionObserver has no root (i.e. the viewport is used)
   */
  scrollerRef?: React.RefObject<HTMLElement | null>;

  /**
   * Used with `virtualizeRows` to estimate the height of items that have not been rendered yet.
   * The function should be fast and side-effect free. Do not measure the DOM here.
   * Once a row is rendered, its actual height will be measured and used instead of this estimate.
   *
   * Note the effects of imprecise estimates:
   * - When the height is underestimated, the table may materialize more rows than specified by `lookaheadPx`.
   *   If the resulting rows extend beyond `retentionMarginPx`, they will be virtualized again.
   *   If this causes relayout flickering, increase `retentionMarginPx`.
   * - When the height is overestimated, the table may materialize fewer rows than specified by `lookaheadPx`,
   *   which may leave a spacer partially visible. To avoid this, increase `lookaheadPx` (and
   *   `retentionMarginPx` accordingly, since it should be greater than `lookaheadPx`).
   *
   * Default: 37px = 16px padding + 20px line height + 1px border.
   */
  estimateHeight?: (index: number) => number;

  /**
   * When using `virtualizeRows`, the number of pixels above and below the viewport
   * to materialize in advance.
   *
   * Increase this value if blank space becomes visible during fast scrolling.
   *
   * Default: 400px.
   */
  lookaheadPx?: number;

  /**
   * Additional margin around the viewport before materialized rows become eligible
   * for virtualization.
   *
   * Increasing this value reduces row churn when heights are underestimated.
   * In that case, the table may materialize more rows than needed and then immediately
   * virtualize them again. A larger margin keeps such rows rendered for longer,
   * at the cost of rendering more rows overall.
   *
   * This value should be greater than `lookaheadPx`.
   * Increase it if you notice table relayouts during initial render or scrolling.
   *
   * Default: 450px.
   */
  retentionMarginPx?: number;

  /**
   * Ignore scroll and resize position changes smaller than this value.
   *
   * Measurement inaccuracies and rounding artifacts may slightly change the
   * table layout during materialization and virtualization. With scroll
   * anchoring enabled (the default browser behavior), the browser may then
   * adjust the scroll position, triggering additional scroll or resize events.
   * Small deltas are ignored to prevent such feedback loops from causing
   * oscillations at virtualization boundaries.
   *
   * Increase if you expect high inaccuracy in height measurements, or if you
   * notice oscillations at virtualization boundaries.
   *
   * Default: 50px.
   */
  minScrollAndResizeDeltaPx?: number;

  /**
   * Applied to the `<thead>` element.
   */
  theadClassName?: string;

  /**
   * Applied to the only `<tr>` element within the `<thead>`.
   */
  theadTrClassName?: string;

  /**
   * Applied to the `<tbody>` element.
   */
  tbodyClassName?: string;

  /**
   * Applied to each `<tr>` element within the `<tbody>`.
   * If a custom `renderItem` is provided, this prop is not used,
   * unless the custom renderer falls back to `StandardRowRenderer`.
   */
  tbodyTrClassName?: string | ((item: T, index: number) => string);

  /**
   * Whether to show a small gear button at the top right corner.
   * See the "Column Controls Discoverability" section above.
   */
  columnEditButton?: 'everywhere' | 'mobileOnly';
}

export type SortOrder = 'none' | 'ascending' | 'descending';

/**
 * The column specification.
 */
export interface Column<T> {
  /**
   * Used to render a row key, e.g. `<thead><tr><td key={getKey(item, index)}...</td></tr></thead>`.
   */
  key: React.Key;

  /**
   * Used in aria-labels of controls which do not contain text,
   * e.g. `DeleteColumnButton`. If not set, the `String(key)` is used.
   */
  name?: string;

  /**
   * Default: name ?? String(key)
   */
  renderHeader?: () => ReactNode;

  /**
   * Renders a single cell value for a column.
   * Default:
   * - If item is an Array, renders `String(item[columnIndex])`
   * - If item is an Object, renders `Object.values(item)[columnIndex]`
   * - Otherwise:
   *   - The first column renders `String(item)`
   *   - Other columns render empty value
   */
  renderCell?: (item: T, index: number) => ReactNode;

  /**
   * If the column gets an indent when `TableProps.getItemLevel()` returns
   * a positive number.
   */
  indent?: boolean;

  /**
   * The current sort order displayed by `SortButton` and indicated
   * by `aria-sort` in `th`.
   *
   * - `undefined` or not set means that the column is not sortable,
   * and it shouldn't have a `SortButton`.
   * - `none` means that the column is sortable, but currently not sorted.
   * It should include a `SortButton`.
   * - `ascending` and `descending` mean that the column is sorted
   * in the corresponding order, and it should include a `SortButton`.
   */
  sortOrder?: SortOrder;

  /**
   * The classname to apply to the `th` element inside `table / thead`.
   */
  thClassName?: string;

  /**
   * The classname to apply to the `td` element inside `table / tbody`.
   * If a custom `TableProps.renderItem` is provided, this prop is not used,
   * unless the custom renderer falls back to `StandardRowRenderer`.
   */
  tdClassName?: string | ((item: T, index: number) => string);
}

/**
 * Use it as a fallback in `renderItem`. It renders a single row with cells based on
 * `columns`, and applies all relevant classnames, including data-dependent ones,
 * namely `tbodyTrClassName` and `tdClassName`.
 *
 * The component props are only item-scoped. Table-scoped props are passed via
 * React context.
 */
export interface StandardRowRendererProps<T> {
  item: T;
  index: number;
}

export const TablePropsContext = createContext<TableProps<unknown> | null>(null);

export const ColumnIndexContext = createContext<number>(-1);

export const CollapseItemIntoSpacerContext = createContext<(height: number) => void>(() => {});

const defaultRowHeight = 37;
const defaultLookaheadPx = 400;
const defaultRetentionMarginPx = 450;
const defaultMinScrollAndResizeDeltaPx = 50;

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
 * - `isClickable`
 * - `onItemClick`
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
        <table className={classNames(styles.table, className)} ref={tableRef}>
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
                  {renderItem ? (
                    <Fragment>{renderItem(item, index)}</Fragment>
                  ) : (
                    <StandardRowRenderer item={item} index={index} />
                  )}
                </CollapseItemIntoSpacerContext.Provider>
              );
            })}
          </tbody>
        </table>
      </IntersectionObserverContext.Provider>
    </TablePropsContext.Provider>
  );
}

const INDENT_SIZE = 16;

/**
 * The default row renderer used when `renderItem` is not provided.
 * You can also use it as a fallback in a custom `renderItem` implementation.
 */
export function StandardRowRenderer<T>({item, index}: StandardRowRendererProps<T>) {
  const tableProps = useContext(TablePropsContext as Context<TableProps<T>>);

  const rowRef = useRef<HTMLTableRowElement | null>(null);

  const collapseItemIntoSpacer = useContext(CollapseItemIntoSpacerContext);
  useIsIntersectingListener(rowRef, isIntersecting => {
    if (rowRef.current && !isIntersecting) {
      collapseItemIntoSpacer(rowRef.current!.getBoundingClientRect().height);
    }
  });

  const {columns, selection, isClickable, onItemClick, getItemLevel, tbodyTrClassName} = tableProps;
  const clickable = isClickable?.(item, index);
  const selected = selection?.isSelected(item);
  const level = getItemLevel?.(item, index) ?? 0;

  function getItemDependentClassName(className: undefined | string | ((item: T, index: number) => string)) {
    if (!className) {
      return undefined;
    }

    return typeof className === 'function' ? className(item, index) : className;
  }

  function onPointerUp(e: React.PointerEvent<HTMLTableRowElement>) {
    if (!onItemClick) return;

    const {target} = e;
    const isActiveElement = target instanceof Element && target.closest('a, button, input, select');
    if (isActiveElement) return;

    onItemClick(e.nativeEvent, item, index);
  }

  return (
    <TableRow
      ref={rowRef}
      className={classNames(
        getItemDependentClassName(tbodyTrClassName),
        clickable && styles.clickableRow,
        selected && styles.selectedRow,
      )}
      onPointerUp={onPointerUp}
    >
      {columns.map((column, columnIndex) => (
        <TableCell
          key={column.key}
          className={getItemDependentClassName(column.tdClassName)}
          style={column.indent && level > 0 ? {paddingInlineStart: `${level * INDENT_SIZE}px`} : undefined}
        >
          {column.renderCell?.(item, index) ?? getDefaultCellValue(item, columnIndex)}
        </TableCell>
      ))}
    </TableRow>
  );
}

function getDefaultCellValue<T>(item: T, columnIndex: number) {
  if (Array.isArray(item)) {
    return String(item[columnIndex] ?? '');
  }

  if (item !== null && typeof item === 'object') {
    return String(Object.values(item)[columnIndex] ?? '');
  }

  if (columnIndex === 0) {
    return String(item);
  }

  return '';
}

/**
 * A helper `<tr>` component for custom `renderItem` implementations.
 * Applies standard row classnames, but not data-dependent `tbodyTrClassName`.
 */
export function TableRow(props: {ref?: React.Ref<HTMLTableRowElement>} & HTMLAttributes<HTMLTableRowElement>) {
  const {ref, className, ...restProps} = props;
  const classes = classNames(styles.row, className);
  return <tr ref={ref} className={classes} {...restProps} />;
}

/**
 * A helper `<td>` component for custom `renderItem` implementations.
 * Applies standard cell classnames, but not data-dependent `tdClassName`.
 */
export function TableCell(props: HTMLAttributes<HTMLTableCellElement>) {
  const {className, ...restProps} = props;
  const classes = classNames(styles.cell, className);
  return <td className={classes} {...restProps} />;
}

/**
 * Include it in a column header to make the column sortable.
 * Handle clicks with `TableProps.onSort`.
 */
export function SortButton<T>(props: HTMLAttributes<HTMLButtonElement>) {
  const tableProps = useContext(TablePropsContext as Context<TableProps<T>>);
  const columnIndex = useContext(ColumnIndexContext);
  const column = tableProps?.columns[columnIndex];
  if (!tableProps || !column) {
    return null;
  }

  const sortOrder = column.sortOrder ?? 'none';
  // eslint-disable-next-line no-nested-ternary, prettier/prettier
  const glyph = sortOrder === 'none' ? unsortedIcon
    : sortOrder === 'ascending' ? arrowUpIcon
    : arrowDownIcon;

  const {className, children, onClick, ...restProps} = props;

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const sequence = ['none', 'ascending', 'descending'] satisfies SortOrder[];
    const nextOrder = sequence[(sequence.indexOf(sortOrder) + 1) % sequence.length];
    tableProps.onSort?.(columnIndex, nextOrder);

    onClick?.(e);
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
 * Handle clicks with `TableProps.onColumnDelete`.
 */
export function DeleteColumnButton<T>(props: HTMLAttributes<HTMLButtonElement>) {
  const tableProps = useContext(TablePropsContext as Context<TableProps<T>>);
  const columnIndex = useContext(ColumnIndexContext);
  const column = tableProps?.columns[columnIndex];
  if (!tableProps || !column) {
    return null;
  }

  const {className, onClick, ...restProps} = props;

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    tableProps.onColumnDelete?.(columnIndex);

    onClick?.(e);
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
