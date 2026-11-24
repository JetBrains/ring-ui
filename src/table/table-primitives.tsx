import {type ComponentPropsWithRef, use} from 'react';
import classNames from 'classnames';

import {ReorderHandle} from './internal/reorder-handle';
import {getPinnedCellProps, PinnedColumnsContext} from './internal/pinned-columns';
import {TablePropsContext} from './table-const';

import styles from './table.css';

export interface TableRowProps {
  /**
   * @see DefaultItemRendererProps.keyboardFocusable
   */
  keyboardFocusable?: boolean;
}

/**
 * @internal
 */
export const keyboardFocusableAttrName = 'data-keyboard-focusable';

/**
 * A helper `<tr>` component for custom {@link TableProps.renderItem} implementations.
 * Applies the standard row class names.
 */
export function TableRow(props: TableRowProps & ComponentPropsWithRef<'tr'>) {
  const {keyboardFocusable, className, ...restProps} = props;
  const classes = classNames(styles.row, className);
  const trRestProps = keyboardFocusable ? {[keyboardFocusableAttrName]: '', ...restProps} : restProps;
  return <tr className={classes} {...trRestProps} />;
}

export interface TableCellProps {
  /**
   * The index of the column the cell belongs to. Applies the column layout, such as `Column.pinned`.
   */
  columnIndex?: number;

  /**
   * Spans all columns. Covers the content scrolled under the pinned columns
   * and continues their dividers, see `Column.pinned`.
   * The children are rendered in a wrapper that has the cell padding.
   */
  fullWidth?: boolean;
}

/**
 * A helper `<td>` component for custom {@link TableProps.renderItem} implementations.
 * Applies the standard cell class names, but not data-dependent `tdClassName`.
 */
export function TableCell(props: TableCellProps & ComponentPropsWithRef<'td'>) {
  const {columnIndex, fullWidth, className, style, children, ...restProps} = props;
  const tableProps = use(TablePropsContext);
  const pinnedColumns = use(PinnedColumnsContext);

  if (fullWidth) {
    return (
      <td
        className={classNames(styles.cell, styles.fullWidthCell, className)}
        colSpan={tableProps?.columns.length}
        style={style}
        {...restProps}
      >
        <div className={styles.fullWidthLayout}>
          <div className={styles.fullWidthContent}>{children}</div>
        </div>
      </td>
    );
  }

  const pinnedProps = columnIndex == null ? undefined : getPinnedCellProps(pinnedColumns, columnIndex);
  return (
    <td
      className={classNames(styles.cell, pinnedProps?.className, className)}
      style={pinnedProps ? {...style, ...pinnedProps.style} : style}
      {...restProps}
    >
      {children}
    </td>
  );
}

/**
 * - `'pointerdown'` means the user has pressed the mouse button or touched the handle.
 * - `number` means the distance in pixels the user has dragged the handle along
 *   the Y axis.
 * - `'cancelled'` means the reorder was aborted — e.g. the user pressed Escape,
 *   released the pointer outside the browser, or dropped the item at its original
 *   position. Use this phase to play a cancellation animation in your custom renderer.
 *   This state lasts 600 ms (matching the built-in cancel animation), after which
 *   `undefined` is sent.
 * - `undefined` means the drag interaction is fully over. Sent after a successful
 *   reorder as well as after the `'cancelled'` phase, so you can always do cleanup
 *   here without managing your own timer.
 */
export type DragState = 'pointerdown' | number | 'cancelled' | undefined;

export interface ItemReorderHandleProps {
  /**
   * The index of the item in the table data array.
   */
  index: number;
  /**
   * When `true`, the drag frame, indicating the currently dragged item,
   * will not be rendered.
   */
  noDragFrame?: boolean;
  /**
   * When `true`, the drag handle stays fixed in place instead of following
   * the pointer during drag.
   */
  noHandleTranslate?: boolean;
  /**
   * Callback that is called when the user drags the handle.
   * Use it for custom drag indication.
   * The `TableProps.onItemReorder` will be called after this callback.
   * @param state The current drag state.
   */
  onUserDrag?: (state: DragState) => void;
}

/**
 * A drag handle that allows the user to reorder the row. Place it anywhere
 * inside a row renderer.
 * Use {@link TableProps.canReorderItem} and {@link TableProps.onItemReorder}.
 */
export function ItemReorderHandle({index, ...restProps}: ItemReorderHandleProps & ComponentPropsWithRef<'button'>) {
  return <ReorderHandle direction='items' index={index} {...restProps} />;
}
