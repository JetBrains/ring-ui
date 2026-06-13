import {type ComponentPropsWithoutRef, type Context, use, useCallback} from 'react';
import classNames from 'classnames';
import unsortedIcon from '@jetbrains/icons/unsorted-12px';
import arrowDownIcon from '@jetbrains/icons/arrow-12px-down';
import arrowUpIcon from '@jetbrains/icons/arrow-12px-up';
import trashIcon from '@jetbrains/icons/trash-12px';

import Icon from '../icon/icon';
import {ColumnIndexContext, TablePropsContext} from './table-const';

import type {SortOrder, TableProps} from './table';

import styles from './table.css';

/**
 * Include it in a column header to make the column sortable.
 * Handle clicks with {@link TableProps.onSort}.
 */
export function SortButton<T>(props: ComponentPropsWithoutRef<'button'>) {
  const tableProps = use(TablePropsContext as Context<TableProps<T>>);
  const columnIndex = use(ColumnIndexContext);
  const column = tableProps?.columns[columnIndex];

  const sortOrder = column.sortOrder ?? 'none';
  // eslint-disable-next-line no-nested-ternary, prettier/prettier
  const glyph = sortOrder === 'none' ? unsortedIcon
    : sortOrder === 'ascending' ? arrowUpIcon
    : arrowDownIcon;

  const {className, children, onClick, ...restProps} = props;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        const sequence = ['none', 'ascending', 'descending'] satisfies SortOrder[];
        const nextOrder = sequence[(sequence.indexOf(sortOrder) + 1) % sequence.length];
        tableProps.onSort?.(columnIndex, nextOrder, tableProps.columns);
      }
    },
    [columnIndex, onClick, sortOrder, tableProps],
  );

  if (!tableProps || !column) {
    return null;
  }

  return (
    <button type='button' className={classNames(styles.headerButton, className)} onClick={handleClick} {...restProps}>
      {children} <Icon glyph={glyph} aria-hidden />
    </button>
  );
}

/**
 * Include it in a column header to make the column deletable.
 * Beware that `column.name ?? String(column.key)` is used in the aria-label.
 * Handle clicks with {@link TableProps.onColumnDelete}.
 */
export function DeleteColumnButton<T>(props: ComponentPropsWithoutRef<'button'>) {
  const tableProps = use(TablePropsContext as Context<TableProps<T>>);
  const columnIndex = use(ColumnIndexContext);
  const column = tableProps?.columns[columnIndex];

  const {className, onClick, ...restProps} = props;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        tableProps.onColumnDelete?.(columnIndex, tableProps.columns);
      }
    },
    [columnIndex, onClick, tableProps],
  );

  if (!tableProps || !column) {
    return null;
  }

  return (
    <button
      type='button'
      className={classNames(styles.headerButton, styles.deleteColumnButton, className)}
      onClick={handleClick}
      aria-label={`Delete column ${column.name ?? String(column.key)}`}
      {...restProps}
    >
      <Icon glyph={trashIcon} />
    </button>
  );
}

/**
 * A helper `<tr>` component for a custom {@link TableProps.renderItem} implementations.
 * Applies the standard row classnames.
 */
export function TableRow(props: {ref?: React.Ref<HTMLTableRowElement>} & ComponentPropsWithoutRef<'tr'>) {
  const {ref, className, ...restProps} = props;
  const classes = classNames(styles.row, className);
  return <tr ref={ref} className={classes} {...restProps} />;
}

/**
 * A helper `<td>` component for a custom {@link TableProps.renderItem} implementations.
 * Applies the standard cell classnames, but not data-dependent `tdClassName`.
 */
export function TableCell(props: ComponentPropsWithoutRef<'td'>) {
  const {className, ...restProps} = props;
  const classes = classNames(styles.cell, className);
  return <td className={classes} {...restProps} />;
}
