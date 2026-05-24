import React, {type Context, createContext, useContext, type HTMLAttributes, Fragment, type ReactNode} from 'react';
import classNames from 'classnames';

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
   * Called when the client clicks on a sortable column header.
   */
  onSort?: (columnIndex: number, direction: SortDirection) => void;

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

export type SortDirection = 'asc' | 'desc' | undefined;

/**
 * The column specification.
 */
export interface Column<T> {
  /**
   * Used to render a row key, e.g. `<thead><tr><td key={getKey(item, index)}...</td></tr></thead>`.
   */
  key: React.Key;

  /**
   * Default: String(key)
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
   * When `true`, TableProps.onSort will be called when the client
   * clicks on the column header.
   */
  sortable?: boolean;

  /**
   * The current sort direction to display in the column header, and to determine
   * the next sort direction when the client clicks on the column header.
   */
  sortDirection?: SortDirection;

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

const TableContext = createContext<TableProps<unknown> | null>(null);

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
 */
export default function Table<T>(props: TableProps<T> & HTMLAttributes<HTMLTableElement>) {
  const {data, columns, renderItem, className, theadClassName, theadTrClassName, tbodyClassName} = props;

  const TheTableContext = TableContext as Context<TableProps<T> | null>;

  return (
    <TheTableContext.Provider value={props}>
      <table className={classNames(styles.table, className)}>
        <thead className={theadClassName}>
          <tr className={classNames(styles.headerRow, theadTrClassName)}>
            {columns.map(column => (
              <th key={column.key} className={classNames(styles.headerCell, column.thClassName)}>
                {column.renderHeader?.() ?? String(column.key)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={tbodyClassName}>
          {data.map((item, index) => {
            const key = props.getKey(item, index);
            return renderItem ? (
              <Fragment key={key}>{renderItem(item, index)}</Fragment>
            ) : (
              <StandardRowRenderer key={key} item={item} index={index} />
            );
          })}
        </tbody>
      </table>
    </TheTableContext.Provider>
  );
}

const INDENT_SIZE = 16;

/**
 * The default row renderer used when `renderItem` is not provided.
 * You can also use it as a fallback in a custom `renderItem` implementation.
 */
export function StandardRowRenderer<T>({item, index}: StandardRowRendererProps<T>) {
  const tableProps = useContext(TableContext as Context<TableProps<T>>);

  if (!tableProps) {
    return null;
  }

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
export function TableRow(props: HTMLAttributes<HTMLTableRowElement>) {
  const {className, ...restProps} = props;
  const classes = classNames(styles.row, className);
  return <tr className={classes} {...restProps} />;
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
