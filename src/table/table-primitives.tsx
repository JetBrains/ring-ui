import classNames from 'classnames';

import {ReorderHandle} from './internal/reorder-handle';

import type {ComponentPropsWithRef} from 'react';

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

/**
 * A helper `<td>` component for custom {@link TableProps.renderItem} implementations.
 * Applies the standard cell class names, but not data-dependent `tdClassName`.
 */
export function TableCell(props: ComponentPropsWithRef<'td'>) {
  const {className, ...restProps} = props;
  const classes = classNames(styles.cell, className);
  return <td className={classes} {...restProps} />;
}

/**
 * - `number` means the distance in pixels the user has dragged the handle along
 *   the Y axis.
 * - `'cancelled'` means the drag has been cancelled in any way, e.g. by pressing
 *   the Escape, or dragging far outside the viewport, or by dragging to the
 *   former position. The client may play cancel-animation in this case.
 *   This phase will last 300 ms, after which the component will send `undefined`.
 * - `undefined` means the drag has ended, either with the result of by cancellation.
 */
export type DragState = number | 'cancelled' | undefined;

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
   * When `true`, the six-dot handle will not change its position while
   * dragging, or, in other words, won't follow the user drag.
   */
  noHandleTranslate?: boolean;
  /**
   * Callback that is called when the user drags the handle.
   * Use it for custom drag indication.
   * The `Table.onItemReorder` will be called after this callback.
   * @param state The current drag state.
   */
  onUserDrag?: (state: DragState) => void;
}

/**
 * Render in any place inside a table row to make it possible to reorder.
 * Use {@link TableProps.canReorderItem} and {@link TableProps.onItemReorder}.
 */
export function ItemReorderHandle({index, ...restProps}: ItemReorderHandleProps & ComponentPropsWithRef<'button'>) {
  return <ReorderHandle direction='items' index={index} {...restProps} />;
}
