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
 * Render in any place inside a table row to make it possible to reorder.
 * Use {@link TableProps.canReorderItem} and {@link TableProps.onItemReorder}.
 */
export function ItemReorderHandle({index, ...restProps}: {index: number} & ComponentPropsWithRef<'button'>) {
  return <ReorderHandle direction='items' index={index} {...restProps} />;
}
