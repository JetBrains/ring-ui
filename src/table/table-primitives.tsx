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
