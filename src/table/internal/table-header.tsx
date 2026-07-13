/* eslint-disable no-nested-ternary */
import {type ComponentPropsWithRef, type Context, use, useCallback, useRef, useState} from 'react';
import classNames from 'classnames';
import arrowDownIcon from '@jetbrains/icons/arrow-12px-down';
import arrowUpIcon from '@jetbrains/icons/arrow-12px-up';
import settingsIcon from '@jetbrains/icons/settings-12px';
import trashIcon from '@jetbrains/icons/trash-12px';
import unsortedIcon from '@jetbrains/icons/unsorted-12px';

import {type TableProps} from '../table-props';
import {TablePropsContext} from '../table-const';
import Icon from '../../icon';
import {isWithinInteractiveElement} from '../../global/is-within-interactive-element';
import {ReorderHandle} from './reorder-handle';
import {ReorderAnimationContext} from './reorder-animation-context';
import {ReorderLayoutContext, useReorderLayoutContextValue} from './reorder-layout-context';
import {useReorderItemLayout} from '../reorder-item-layout';

import styles from '../table.css';

export function TableHeader<T>() {
  const {columns, noHeader, stickyHeader, columnEditing, onColumnEditingRequest, theadClassName, theadTrClassName} =
    use(TablePropsContext as Context<TableProps<T>>);

  const [localColumnEditing, setLocalColumnEditing] = useState(false);
  const effectiveColumnEditing = columnEditing ?? localColumnEditing;

  const toggleColumnEditing = useCallback(
    (source: 'header' | 'edit-button') => {
      let newColumnEditing: boolean;
      if (columnEditing == null) {
        newColumnEditing = !localColumnEditing;
        setLocalColumnEditing(newColumnEditing);
      } else {
        newColumnEditing = !columnEditing;
      }

      onColumnEditingRequest?.(newColumnEditing, source);
    },
    [columnEditing, localColumnEditing, onColumnEditingRequest],
  );

  const handleTheadClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (window.matchMedia('(hover: none)').matches && !isWithinInteractiveElement(e.target)) {
        toggleColumnEditing('header');
      }
    },
    [toggleColumnEditing],
  );

  const handleEditColumnsButtonClick = useCallback(() => {
    toggleColumnEditing('edit-button');
  }, [toggleColumnEditing]);

  const reorderContextValue = useReorderLayoutContextValue();

  if (noHeader) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <thead
      className={classNames(
        theadClassName,
        effectiveColumnEditing && styles.theadColumnEditing,
        stickyHeader && styles.stickyHeader,
      )}
      onClick={handleTheadClick}
    >
      <tr className={theadTrClassName}>
        <ReorderLayoutContext value={reorderContextValue}>
          {columns.map((column, columnIndex) => (
            <TableHeaderCell
              key={column.key}
              columnIndex={columnIndex}
              columnEditing={effectiveColumnEditing}
              handleEditColumnsButtonClick={handleEditColumnsButtonClick}
            />
          ))}
        </ReorderLayoutContext>
      </tr>
    </thead>
  );
}

function TableHeaderCell<T>({
  columnIndex,
  columnEditing,
  handleEditColumnsButtonClick,
}: {
  columnIndex: number;
  columnEditing: boolean;
  handleEditColumnsButtonClick: () => void;
}) {
  const ref = useRef<HTMLTableCellElement>(null);

  const {columns, columnEditButton} = use(TablePropsContext as Context<TableProps<T>>);
  const {key, name, renderHeader, sortOrder, deletable, canReorder, thClassName} = columns[columnIndex];

  const {reorderAnimation} = use(ReorderAnimationContext);
  const children = renderHeader ? renderHeader() : (name ?? String(key));

  useReorderItemLayout({
    index: columnIndex,
    getBounds: () => {
      const r = ref.current?.getBoundingClientRect();
      return {start: r?.left ?? 0, end: r?.right ?? 0};
    },
  });

  return (
    <th
      ref={ref}
      className={classNames(
        styles.headerCell,
        reorderAnimation?.direction === 'columns' &&
          reorderAnimation.index === columnIndex &&
          reorderAnimation.className,
        thClassName,
      )}
      scope='col'
      aria-sort={sortOrder}
    >
      <div className={styles.headerCellInnerWrapper}>
        <div className={styles.sortAndHeader}>
          {canReorder && <ColumnReorderHandle columnIndex={columnIndex} />}
          {sortOrder ? (
            <SortButton columnIndex={columnIndex} aria-description={`Sort order: ${sortOrder}`}>
              {children}
            </SortButton>
          ) : (
            children
          )}
          {canReorder && <ColumnReorderHandleMirror />}
        </div>

        <div className={styles.rightButtons}>
          {deletable && <DeleteColumnButton columnIndex={columnIndex} />}
          {columnIndex === columns.length - 1 && columnEditButton && (
            <EditColumnsButton columnEditing={columnEditing} onClick={handleEditColumnsButtonClick} />
          )}
        </div>
      </div>
    </th>
  );
}

function SortButton<T>({
  columnIndex,
  className,
  children,
  onClick,
  ...restProps
}: {columnIndex: number} & ComponentPropsWithRef<'button'>) {
  const tableProps = use(TablePropsContext as Context<TableProps<T> | null>);
  const column = tableProps?.columns[columnIndex];

  const sortOrder = column?.sortOrder;
  const glyph =
    sortOrder === 'none'
      ? unsortedIcon
      : sortOrder === 'ascending'
        ? arrowUpIcon
        : sortOrder === 'descending'
          ? arrowDownIcon
          : undefined;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        const nextOrder = sortOrder === 'ascending' ? 'descending' : sortOrder === 'descending' ? 'none' : 'ascending';
        tableProps!.onSort?.(columnIndex, nextOrder, tableProps!.columns);
      }
    },
    [columnIndex, onClick, sortOrder, tableProps],
  );

  if (!tableProps || !column) {
    return null;
  }

  return (
    <button type='button' className={classNames(styles.tableButton, className)} onClick={handleClick} {...restProps}>
      {children} <Icon glyph={glyph} aria-hidden />
    </button>
  );
}

function DeleteColumnButton<T>({
  columnIndex,
  className,
  onClick,
  ...restProps
}: {columnIndex: number} & ComponentPropsWithRef<'button'>) {
  const tableProps = use(TablePropsContext as Context<TableProps<T> | null>);
  const column = tableProps?.columns[columnIndex];

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        tableProps!.onColumnDelete?.(columnIndex, tableProps!.columns);
      }
    },
    [columnIndex, onClick, tableProps],
  );

  if (!tableProps || !column) {
    return null;
  }

  const hint = `Delete column ${column.name ?? String(column.key)}.`;

  return (
    <button
      type='button'
      className={classNames(styles.tableButton, styles.deleteColumnButton, className)}
      onClick={handleClick}
      aria-label={hint}
      title={hint}
      {...restProps}
    >
      <Icon glyph={trashIcon} aria-hidden='true' />
    </button>
  );
}

function EditColumnsButton({columnEditing, ...props}: {columnEditing: boolean} & ComponentPropsWithRef<'button'>) {
  const {className, ...restProps} = props;
  const hint = columnEditing ? 'Hide column controls.' : 'Show column controls.';
  return (
    <button
      type='button'
      className={classNames(styles.tableButton, styles.editColumnsButton, className)}
      aria-pressed={columnEditing}
      aria-label={hint}
      title={hint}
      {...restProps}
    >
      <Icon glyph={settingsIcon} aria-hidden='true' />
    </button>
  );
}

function ColumnReorderHandle({columnIndex, ...restProps}: {columnIndex: number} & ComponentPropsWithRef<'button'>) {
  return <ReorderHandle direction='columns' index={columnIndex} {...restProps} />;
}

/**
 * Reserves the space for the reorder handle and prevents layout shift when the handle appears on hover.
 */
function ColumnReorderHandleMirror() {
  return <span className={styles.columnReorderHandleMirror} aria-hidden='true' />;
}
