import type {AriaAttributes, ReactNode, RefObject} from 'react';

export interface TableProps<T> {
  /**
   * The data items to render. `null` and `undefined` items are not supported.
   * Referentially identical items are not supported either.
   */
  data: T[];

  /**
   * Column definitions.
   */
  columns: Column<T>[];

  /**
   * Used as a key in the items list.
   */
  getKey: (item: T, index: number, items: T[]) => React.Key;

  /**
   * If true, the table header will not be rendered.
   */
  noHeader?: boolean;

  /**
   * If true, renders a sticky header.
   */
  stickyHeader?: boolean;

  /**
   * Not implemented yet.
   *
   * Called when the user moves a row by dragging it.
   */
  onItemMove?: (item: T, fromIndex: number, toIndex: number, items: T[]) => void;

  /**
   * Called when the user clicks the sort button in a column header.
   * The client is expected to update the `columns` prop with the new
   * sort order for the corresponding column, and update the data accordingly.
   */
  onSort?: (columnIndex: number, newOrder: SortOrder, columns: Column<T>[]) => void;

  /**
   * Called when the user clicks on a column delete button in the header.
   * The client is expected to update the `columns` prop with the column removed.
   */
  onColumnDelete?: (columnIndex: number, columns: Column<T>[]) => void;

  /**
   * Called when the user reorders columns by dragging a column.
   * The `insertionIndex` parameter represents an insertion position in the original,
   * unchanged `columns` array before the column is removed.
   *
   * One possible implementation is:
   *
   * ```ts
   * const [moved] = columns.splice(fromIndex, 1);
   * columns.splice(fromIndex < insertionIndex ? insertionIndex - 1 : insertionIndex, 0, moved);
   * ```
   *
   * The callback is not called when the reorder operation would not change the
   * column order, i.e. when
   * `insertionIndex === fromIndex || insertionIndex === fromIndex + 1`.
   */
  onColumnReorder?: (fromIndex: number, insertionIndex: number, columns: Column<T>[]) => void;

  /**
   * By default, when a column is reordered, the moved column is highlighted
   * with a temporary background color. Set `true` to disable this animation.
   */
  noColumnReorderAnimation?: boolean;

  /**
   * Customizes how an item is rendered.
   *
   * Return `DefaultItemRenderer` to configure row-specific behavior such as
   * `clickable`, `keyboardFocusable`, event handlers, `className`, or `ref`.
   *
   * You can also return custom row(s) instead. See the `Table` documentation
   * for details.
   */
  renderItem?: (item: T, index: number, items: T[]) => ReactNode;

  /**
   * Only renders rows near the viewport.
   *
   * Rows may transition between two states:
   * - materialized: rendered as actual table rows. This happens when
   *   the corresponding spacer approaches the viewport, as specified by
   *   `lookaheadPx`.
   * - virtualized: replaced with spacer rows of the same height. This happens
   *   when the row moves sufficiently far from the viewport, as specified by
   *   `retentionMarginPx`.
   */
  virtualizeRows?: boolean;

  /**
   * Used with `virtualizeRows` as a source of scroll events, as a target for
   * ResizeObserver, and as the root for IntersectionObserver. Required when
   * the scrollable container is not the whole document.
   *
   * If not set:
   * - scroll listener is attached to `window`
   * - ResizeObserver observes `document.body`
   * - IntersectionObserver has no root (i.e. the viewport is used)
   */
  scrollerRef?: RefObject<HTMLElement | null>;

  /**
   * Used with `virtualizeRows` to estimate the height of items that have not
   * been rendered yet. The function should be fast and side-effect free.
   * Do not measure the DOM here. Once a row is rendered, its actual height
   * will be measured and used instead of this estimate.
   *
   * Note the effects of imprecise estimates:
   * - When the height is underestimated, the table may materialize more rows
   *   than specified by `lookaheadPx`. If the resulting rows extend beyond
   *   `retentionMarginPx`, they will be virtualized again. If this causes
   *   relayout flickering, increase `retentionMarginPx`.
   * - When the height is overestimated, the table may materialize fewer rows
   *   than specified by `lookaheadPx`, which may leave a spacer partially
   *   visible. To avoid this, increase `lookaheadPx` (and `retentionMarginPx`
   *   accordingly, since it should be greater than `lookaheadPx`).
   *
   * Default: 37px = 16px padding + 20px line height + 1px border.
   */
  estimateHeight?: (item: T, index: number, items: T[]) => number;

  /**
   * When using `virtualizeRows`, the number of pixels above and below
   * the viewport to materialize in advance.
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
   * In that case, the table may materialize more rows than needed and then
   * immediately virtualize them again. A larger margin keeps such rows
   * rendered for longer, at the cost of rendering more rows overall.
   *
   * This value should be greater than `lookaheadPx`. Increase it if you notice
   * table relayouts during initial render or scrolling.
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
   * "Column editing mode" is a mode in which controls that are normally hidden
   * become visible, such as column reorder and delete buttons.
   *
   * When this prop is undefined, the component manages the mode internally.
   * Users can toggle it by tapping the table header on mobile or by clicking
   * the column edit button, if enabled.
   *
   * Pass `true` or `false` to control the mode externally.
   */
  columnEditing?: boolean;

  /**
   * Called when the user requests to enter or leave column editing mode.
   *
   * The `source` parameter indicates what triggered the request.
   *
   * When `columnEditing` is not controlled, the component automatically
   * applies the requested change internally.
   *
   * When `columnEditing` is controlled externally and you still want to
   * respond to user requests, use this callback to decide whether to
   * update the mode.
   */
  onColumnEditingRequest?: (editing: boolean, source: 'header' | 'edit-button') => void;

  /**
   * Whether to show a small gear button in the top-right corner that
   * toggles column editing mode.
   */
  columnEditButton?: boolean;

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
}

export type SortOrder = Extract<AriaAttributes['aria-sort'], 'none' | 'ascending' | 'descending'>;

/**
 * The column specification.
 */
export interface Column<T> {
  /**
   * Used as a key in the columns list.
   */
  key: React.Key;

  /**
   * Used in `aria-label`s of column controls which do not contain text,
   * such as the delete column button. If not set, the `String(key)` is used.
   */
  name?: string;

  /**
   * Renders the content of the column header, excluding controls such as
   * the sort and delete buttons. If not specified, the default behavior is
   * `name ?? String(key)`.
   */
  renderHeader?: () => ReactNode;

  /**
   * Renders the value of a single cell. If not specified, the default
   * behavior is:
   *
   * - If `item` is an `Array`, renders `String(item[columnIndex])`
   * - If `item` is an `Object`, renders `String(item[String(columnKey)])`
   * - Otherwise:
   *   - The first column renders `String(item)`
   *   - Other columns render an empty string
   */
  renderCell?: (item: T, index: number, items: T[]) => ReactNode;

  /**
   * If the column gets an indent when `DefaultItemRendererProps.level` returns
   * a positive number.
   */
  indent?: boolean;

  /**
   * If set, displays sort button and includes `aria-sort` in the column header.
   * Handle clicks with {@link TableProps.onSort}.
   */
  sortOrder?: AriaAttributes['aria-sort'];

  /**
   * Whether to display a delete button in the column header.
   * Handle delete requests with {@link TableProps.onColumnDelete}.
   * Make sure {@link Column.name} or {@link Column.key} is meaningful,
   * as it will be included in the `aria-label` of the delete button.
   */
  deletable?: boolean;

  /**
   * Displays a reorder handle in the column header.
   * Handle reorder requests with {@link TableProps.onColumnReorder}.
   * If a function is provided, it determines whether the column may be moved
   * to the specified insertion position.
   *
   * Make sure {@link Column.name} or {@link Column.key} is meaningful,
   * as it will be included in the `aria-label` of the reorder button.
   */
  canReorder?: boolean | ((insertionIndex: number, columns: Column<T>[]) => boolean);

  /**
   * The class name to apply to the `th` element inside `table > thead`.
   */
  thClassName?: string;

  /**
   * The class name to apply to the `td` element inside `table > tbody`.
   * If a custom `TableProps.renderItem` is provided, this prop is not used,
   * unless the custom renderer falls back to the `DefaultItemRenderer`.
   */
  tdClassName?: string | ((item: T, index: number, items: T[]) => string | undefined);
}
