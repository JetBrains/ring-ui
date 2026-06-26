import {type ComponentPropsWithRef, type Context, use, useCallback, useRef} from 'react';
import classNames from 'classnames';

import {AnimatedColumnContext, TablePropsContext} from './table-const';
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
   * If true, the row will be focusable with up/down arrow keys.
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
   * If true, the row is highlighted as selected, that is, with the
   * a different background color.
   */
  selected?: boolean;

  /**
   * A level of a nested item. Results in an indent for columns with `indent: true`.
   * 0, negative values, and an unset value mean no indent.
   */
  level?: number;

  /**
   * When set to `true`, doesn't control the item virtualization.
   * Useful when you include `DefaultItemRenderer` as a part of a custom row rendered,
   * and track the visibility yourself.
   */
  noItemVirtualization?: boolean;
}

/**
 * Use to render a row in a standard way, and to specify item-scoped props like this:
 *
 * ```tsx
 * <DefaultItemRenderer
 *   index={index}
 *   keyboardFocusable
 *   clickable
 *   onClick={e => {
 *     if (!isWithinInteractiveElement(e.target)) {
 *       selection.toggle(item);
 *       focusWithTemporaryTabIndex(e.currentTarget);
 *       e.preventDefault();
 *     }
 *   }}
 * />
 *```
 *
 * `isWithinInteractiveElement()` and `focusWithTemporaryTabIndex()` are utils in the 'global' directory.
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
        !noItemVirtualization && element?.isConnected && isIntersecting === false
          ? element.getBoundingClientRect().height
          : undefined,
      [noItemVirtualization],
    ),
  });

  const tableProps = use(TablePropsContext as Context<TableProps<T> | null>);
  if (!tableProps) {
    return null;
  }

  const animatedColumn = use(AnimatedColumnContext);

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
            {column.renderCell?.(item, index, data) ?? getDefaultCellValue(item, columnIndex)}
          </TableCell>
        );
      })}
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
 * A helper `<tr>` component for a custom {@link TableProps.renderItem} implementations.
 * Applies the standard row classnames.
 */
export function TableRow(props: TableRowProps & ComponentPropsWithRef<'tr'>) {
  const {keyboardFocusable, className, ...restProps} = props;
  const classes = classNames(styles.row, className);
  const trRestProps = keyboardFocusable ? {[keyboardFocusableAttrName]: '', ...restProps} : restProps;
  return <tr className={classes} {...trRestProps} />;
}

/**
 * A helper `<td>` component for a custom {@link TableProps.renderItem} implementations.
 * Applies the standard cell classnames, but not data-dependent `tdClassName`.
 */
export function TableCell(props: ComponentPropsWithRef<'td'>) {
  const {className, ...restProps} = props;
  const classes = classNames(styles.cell, className);
  return <td className={classes} {...restProps} />;
}
