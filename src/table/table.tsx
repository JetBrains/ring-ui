import Table from './table-component';

import type {ReactNode} from 'react';
import type Selection from '../legacy-table/selection';

export default Table;

export interface TableProps<T> {
  /**
   * The data items to render. `null` and `undefined` as an item is not supported.
   * Referentially same items are not supported either.
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
   * Displays the selection and focus state.
   */
  selection?: Selection<T>;

  /**
   * If true, the item can be focused by keyboard up/down arrows.
   * Note that `false` doesn't prevent from `selection.focus()`.
   */
  isItemKeyboardFocusable?: (item: T, index: number, items: T[]) => boolean;

  /**
   * When the item should get focused by keyboard navigation.
   * The client is expected to update `selection`.
   */
  onItemFocus?: (item: T | null, index: number, items: T[]) => void;

  /**
   * Called when the client moves a row by dragging it.
   */
  onItemMove?: (item: T, fromIndex: number, toIndex: number, items: T[]) => void;

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
   * Implement to specify props like `clickable`, handlers like onClick,
   * a custom `className`, a `ref` etc., or to implement a custom renderer.
   *
   * ```tsx
   * <Table
   *   renderItem={(item, index) => (
   *     <DefaultItemRenderer
   *       index={index}
   *       className={'my-row'}
   *       onClick={() => setSelection(selection.focus(item))}
   *     />
   *   )}
   * />
   * ```
   *
   * In your custom implementation, use `TableRow` and `TableCell` components to apply the
   * standard classnames, but beware that `tdClassName` won't be applied.
   *
   * You can also use `DefaultItemRenderer` in combination with your custom rows.
   */
  renderItem?: (item: T, index: number, items: T[]) => ReactNode;

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
   * Used with `virtualizeRows`. Additional margin around the viewport before
   * materialized rows become eligible for virtualization.
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
   * When using `virtualizeRows`, ignore scroll and resize position changes
   * smaller than this value.
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
  renderCell?: (item: T, index: number, items: T[]) => ReactNode;

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
   * unless the custom renderer falls back to `DefaultItemRenderer`.
   */
  tdClassName?: (item: T, index: number, items: T[]) => string | undefined;
}

export interface DefaultItemRendererProps {
  /**
   * Installed on the `<tr>` element
   */
  ref?: React.RefObject<HTMLTableRowElement | null>;

  /**
   * The index of the `data` item
   */
  index: number;

  /**
   * Changes the highlight on hover and applies the pointer cursor.
   * Note that `false` doesn't mean it cannot handle `onClick`.
   */
  clickable?: boolean;

  /**
   * A level of a nested item. Results in an indent for columns with `indent: true`.
   * 0, negative and not set mean no indent.
   */
  level?: number;
}
