import {type ComponentPropsWithoutRef, type Context, use, useEffect, useRef} from 'react';
import classNames from 'classnames';

import {CollapseItemIntoSpacerContext, TablePropsContext} from './table-const';
import {useIsIntersectingListener} from '../global/intersection-observer-context';
import {TableCell, TableRow} from './table-base';

import type {TableProps} from './table';

import styles from './table.css';

export interface DefaultItemRendererProps {
  /**
   * Installed on the `<tr>` element
   */
  ref?: React.RefObject<HTMLTableRowElement | null>;

  /**
   * The index of the `data` item to render
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

const INDENT_SIZE = 24;

/**
 * @see TableProps.renderItem
 */
export function DefaultItemRenderer<T>({
  ref: userRef,
  index,
  clickable,
  level,
  className,
  onKeyDown,
  onBlur,
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

  const {data, columns, selection, isItemKeyboardFocusable, onItemFocus} = use(
    TablePropsContext as Context<TableProps<T>>,
  );

  const item = data[index];
  const selected = selection?.isSelected(item);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTableRowElement>) {
    onKeyDown?.(e);

    if (!e.defaultPrevented && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      const step = e.key === 'ArrowUp' ? -1 : 1;
      // eslint-disable-next-line yoda
      for (let i = index + step; 0 <= i && i < data.length; i += step) {
        if (isItemKeyboardFocusable?.(data[i], i, data)) {
          onItemFocus?.(data[i], i, data);
          break;
        }
      }
    }
  }

  const focused = selection?.isFocused(item);

  useEffect(() => {
    if (focused) ref.current?.focus();
  }, [focused, ref]);

  function handleBlur(e: React.FocusEvent<HTMLTableRowElement>) {
    onBlur?.(e);
    if (!e.defaultPrevented && focused) {
      onItemFocus?.(null, -1, data);
    }
  }

  return (
    <TableRow
      ref={ref}
      className={classNames(className, clickable && styles.clickableRow, selected && styles.selectedRow)}
      onKeyDown={handleKeyDown}
      tabIndex={focused ? 0 : undefined}
      onBlur={focused ? handleBlur : undefined}
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
