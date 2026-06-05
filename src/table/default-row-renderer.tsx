import {type Context, type HTMLAttributes, useContext, useEffect, useRef} from 'react';
import classNames from 'classnames';

import {CollapseItemIntoSpacerContext, TablePropsContext} from './table-const';
import {useIsIntersectingListener} from '../global/intersection-observer-context';

import type {TableProps, DefaultRowRendererProps} from './table';

import styles from './table.css';

const INDENT_SIZE = 16;

/**
 * The default row renderer used when `renderItem` is not provided.
 * You can also use it as a fallback in a custom `renderItem` implementation.
 */
export function DefaultRowRenderer<T>({item, index}: DefaultRowRendererProps<T>) {
  const tableProps = useContext(TablePropsContext as Context<TableProps<T>>);

  const rowRef = useRef<HTMLTableRowElement | null>(null);

  const collapseItemIntoSpacer = useContext(CollapseItemIntoSpacerContext);
  useIsIntersectingListener(rowRef, isIntersecting => {
    if (rowRef.current && !isIntersecting) {
      collapseItemIntoSpacer(rowRef.current!.getBoundingClientRect().height);
    }
  });

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

  function onKeyDown(e: React.KeyboardEvent<HTMLTableRowElement>) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const step = e.key === 'ArrowUp' ? -1 : 1;
      // eslint-disable-next-line yoda
      for (let i = index + step; 0 <= i && i < tableProps.data.length; i += step) {
        if (tableProps.isItemFocusable?.(tableProps.data[i], i)) {
          tableProps.onItemFocus?.(tableProps.data[i], i);
          break;
        }
      }
    }
  }

  const focused = selection?.isFocused(item);

  useEffect(() => {
    if (focused) rowRef.current?.focus();
  }, [focused]);

  function onBlur() {
    if (focused) tableProps.onItemFocus?.(null, -1);
  }

  return (
    <TableRow
      ref={rowRef}
      className={classNames(
        getItemDependentClassName(tbodyTrClassName),
        clickable && styles.clickableRow,
        selected && styles.selectedRow,
      )}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
      tabIndex={focused ? 0 : undefined}
      onBlur={focused ? onBlur : undefined}
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
