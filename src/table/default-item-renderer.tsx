import {type ComponentPropsWithoutRef, type Context, use, useRef} from 'react';
import classNames from 'classnames';

import {CollapseItemIntoSpacerContext, TablePropsContext} from './table-const';
import {useIsIntersectingListener} from '../global/intersection-observer-context';
import {TableCell, TableRow} from './table-primitives';

import type {TableProps} from './table';

import styles from './table.css';

export interface DefaultItemRendererProps {
  /**
   * Installed on the `<tr>` element.
   */
  ref?: React.RefObject<HTMLTableRowElement | null>;

  /**
   * The index of the `data` item to render.
   */
  index: number;

  /**
   * If true, the row will be focusable with up/down arrow keys.
   * Focus is implemented using the
   * ["roving tabindex"](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets#technique_1_roving_tabindex)
   * technique, that is, only the focused row has `tabIndex={0}`.
   *
   * To focus the row on click or other user interaction, add e.g. `onClick()`
   * and invoke `focusRow(e.currentTarget)` imported from `table-row-focus.ts`.
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
}

const INDENT_SIZE = 24;

/**
 * @see TableProps.renderItem
 */
export function DefaultItemRenderer<T>({
  ref: userRef,
  index,
  keyboardFocusable,
  clickable,
  selected,
  level,

  className,
  ...restProps
}: DefaultItemRendererProps & ComponentPropsWithoutRef<'tr'>) {
  const selfRef = useRef<HTMLTableRowElement | null>(null);
  const ref = userRef ?? selfRef;

  const collapseItemIntoSpacer = use(CollapseItemIntoSpacerContext);
  useIsIntersectingListener(ref, isIntersecting => {
    if (ref.current && !isIntersecting) {
      collapseItemIntoSpacer(ref.current!.getBoundingClientRect().height);
    }
  });

  const {data, columns} = use(TablePropsContext as Context<TableProps<T>>);

  const item = data[index];

  return (
    <TableRow
      ref={ref}
      keyboardFocusable={keyboardFocusable}
      className={classNames(className, clickable && styles.clickableRow, selected && styles.selectedRow)}
      {...restProps}
    >
      {columns.map((column, columnIndex) => (
        <TableCell
          key={column.key}
          className={column.tdClassName?.(item, index, data)}
          style={
            column.indent && level != null && level > 0 ? {paddingInlineStart: `${level * INDENT_SIZE}px`} : undefined
          }
        >
          {column.renderCell?.(item, index, data) ?? getDefaultCellValue(item, columnIndex)}
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
