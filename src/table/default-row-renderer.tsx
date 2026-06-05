import {type Context, type HTMLAttributes, useContext, useEffect, useRef} from 'react';
import classNames from 'classnames';

import {CollapseItemIntoSpacerContext, TablePropsContext} from './table-const';
import {useIsIntersectingListener} from '../global/intersection-observer-context';

import type {TableProps, DefaultRowRendererProps} from './table';

import styles from './table.css';

const INDENT_SIZE = 16;

/**
 * The default row renderer used when `renderItem` is not provided.
 * You can also use it to provide handlers like onClick, a custom className,
 * or as a fallback in your `TableProps.renderItem` implementation.
 */
export function DefaultRowRenderer<T>({
  index,
  ref: userRef,
  className,
  onKeyDown,
  onBlur,
  ...restProps
}: DefaultRowRendererProps & HTMLAttributes<HTMLTableRowElement>) {
  const selfRef = useRef<HTMLTableRowElement | null>(null);
  const ref = userRef ?? selfRef;

  const collapseItemIntoSpacer = useContext(CollapseItemIntoSpacerContext);
  useIsIntersectingListener(ref, isIntersecting => {
    if (ref.current && !isIntersecting) {
      collapseItemIntoSpacer(ref.current!.getBoundingClientRect().height);
    }
  });

  const {data, columns, selection, isItemClickable, isItemFocusableByArrowKeys, onItemFocus, getItemLevel} = useContext(
    TablePropsContext as Context<TableProps<T>>,
  );

  const item = data[index];
  const clickable = isItemClickable?.(item, index);
  const selected = selection?.isSelected(item);
  const level = getItemLevel?.(item, index) ?? 0;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTableRowElement>) {
    onKeyDown?.(e);

    if (!e.defaultPrevented && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      const step = e.key === 'ArrowUp' ? -1 : 1;
      // eslint-disable-next-line yoda
      for (let i = index + step; 0 <= i && i < data.length; i += step) {
        if (isItemFocusableByArrowKeys?.(data[i], i)) {
          onItemFocus?.(data[i], i);
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
      onItemFocus?.(null, -1);
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
          className={column.tdClassName?.(item, index)}
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
export function TableRow(props: {ref?: React.Ref<HTMLTableRowElement>} & HTMLAttributes<HTMLTableRowElement>) {
  const {ref, className, ...restProps} = props;
  const classes = classNames(styles.row, className);
  return <tr ref={ref} className={classes} {...restProps} />;
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
