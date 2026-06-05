import {type Context, type HTMLAttributes, useContext} from 'react';
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
 * Handle clicks with `TableProps.onSort`.
 */
export function SortButton<T>(props: HTMLAttributes<HTMLButtonElement>) {
  const tableProps = useContext(TablePropsContext as Context<TableProps<T>>);
  const columnIndex = useContext(ColumnIndexContext);
  const column = tableProps?.columns[columnIndex];
  if (!tableProps || !column) {
    return null;
  }

  const sortOrder = column.sortOrder ?? 'none';
  // eslint-disable-next-line no-nested-ternary, prettier/prettier
  const glyph = sortOrder === 'none' ? unsortedIcon
    : sortOrder === 'ascending' ? arrowUpIcon
    : arrowDownIcon;

  const {className, children, onClick, ...restProps} = props;

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(e);
    if (!e.defaultPrevented) {
      const sequence = ['none', 'ascending', 'descending'] satisfies SortOrder[];
      const nextOrder = sequence[(sequence.indexOf(sortOrder) + 1) % sequence.length];
      tableProps.onSort?.(columnIndex, nextOrder);
    }
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
 * Handle clicks with `TableProps.onColumnDelete`.
 */
export function DeleteColumnButton<T>(props: HTMLAttributes<HTMLButtonElement>) {
  const tableProps = useContext(TablePropsContext as Context<TableProps<T>>);
  const columnIndex = useContext(ColumnIndexContext);
  const column = tableProps?.columns[columnIndex];
  if (!tableProps || !column) {
    return null;
  }

  const {className, onClick, ...restProps} = props;

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(e);
    if (!e.defaultPrevented) {
      tableProps.onColumnDelete?.(columnIndex);
    }
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
