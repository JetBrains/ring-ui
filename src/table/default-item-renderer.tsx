import {type ComponentPropsWithRef, type Context, type Key, use, useCallback, useRef} from 'react';
import classNames from 'classnames';

import {ColumnAnimationContext, TablePropsContext} from './table-const';
import {useComposedRef} from '../global/compose-refs';
import {useItemVirtualization} from './item-virtualization';

import type {TableProps} from './table-props';

import styles from './table.css';

export interface DefaultItemRendererProps {
  /**
   * The index of the `data` item to render.
   */
  index: number;

  /**
   * If `true`, the row will be focusable with up/down arrow keys.
   * Focus is implemented using the
   * ["roving tabindex"](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets#technique_1_roving_tabindex)
   * technique, that is, only the focused row has `tabIndex={0}`.
   */
  keyboardFocusable?: boolean;

  /**
   * Changes the background on hover and applies the pointer cursor.
   * Note that `false` does not mean the row cannot handle `onClick`.
   */
  clickable?: boolean;

  /**
   * If `true`, the row is highlighted as selected with a different background color.
   */
  selected?: boolean;

  /**
   * The nesting level of an item. Applies an indent for columns with
   * `Column.indent` set to `true`. `0`, negative values, and an unset value
   * mean no indent.
   */
  level?: number;

  /**
   * When set to `true`, does not control item virtualization.
   * Useful when you include `DefaultItemRenderer` as a part of a custom row renderer,
   * and track the visibility yourself.
   */
  noItemVirtualization?: boolean;
}

/**
 * Standard component for rendering a table row.
 *
 * Renders an item using the table's column definitions and lets you
 * configure item-scoped behavior such as selection, keyboard navigation,
 * event handlers, `className`, and `ref`.
 *
 * Note that row-level click and keyboard handlers are not discoverable
 * by assistive technologies. Make sure that any functionality relying on
 * them (such as selection or expand/collapse) is also available through
 * accessible controls, such as checkboxes or buttons with accessible
 * labels.
 */
export function DefaultItemRenderer<T>({
  index,
  keyboardFocusable,
  clickable,
  selected,
  level,
  noItemVirtualization,

  ref: userRef,
  className,
  ...restProps
}: DefaultItemRendererProps & ComponentPropsWithRef<'tr'>) {
  const localRef = useRef<HTMLTableRowElement>(null);
  const composedRef = useComposedRef(userRef, localRef);

  useItemVirtualization({
    index,
    refs: localRef,
    onIntersectionChange: useCallback(
      ([isIntersecting], _i, [element]) =>
        isIntersecting === false &&
        !noItemVirtualization &&
        element?.isConnected &&
        !element.contains(document.activeElement) &&
        !element.previousElementSibling?.contains(document.activeElement) &&
        !element.nextElementSibling?.contains(document.activeElement)
          ? element.getBoundingClientRect().height
          : undefined,
      [noItemVirtualization],
    ),
  });

  const tableProps = use(TablePropsContext as Context<TableProps<T> | null>);
  if (!tableProps) {
    return null;
  }

  const animatedColumn = use(ColumnAnimationContext);

  const {data, columns} = tableProps;
  const item = data[index];

  const indentSize = 24;

  return (
    <TableRow
      ref={composedRef}
      keyboardFocusable={keyboardFocusable}
      className={classNames(className, clickable && styles.clickableRow, selected && styles.selectedRow)}
      {...restProps}
    >
      {columns.map((column, columnIndex) => {
        const {key, tdClassName, indent} = column;

        return (
          <TableCell
            key={key}
            className={classNames(
              columnIndex === animatedColumn?.columnIndex && animatedColumn.cellClassName,
              typeof tdClassName === 'function' ? tdClassName(item, index, data) : tdClassName,
            )}
            style={indent && level != null && level > 0 ? {paddingInlineStart: `${level * indentSize}px`} : undefined}
          >
            {column.renderCell?.(item, index, data) ?? getDefaultCellValue(item, columnIndex, key)}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

function getDefaultCellValue<T>(item: T, columnIndex: number, columnKey: Key) {
  if (Array.isArray(item)) {
    return String(item[columnIndex]);
  }

  if (item !== null && typeof item === 'object') {
    return String((item as Record<string, unknown>)[String(columnKey)]);
  }

  if (columnIndex === 0) {
    return String(item);
  }

  return '';
}

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
