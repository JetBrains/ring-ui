/* eslint-disable no-nested-ternary */
import {type ComponentPropsWithRef, type Context, type PointerEvent, use, useCallback, useRef, useState} from 'react';
import classNames from 'classnames';
import arrowDownIcon from '@jetbrains/icons/arrow-12px-down';
import arrowUpIcon from '@jetbrains/icons/arrow-12px-up';
import dragIcon from '@jetbrains/icons/drag-12px';
import settingsIcon from '@jetbrains/icons/settings-12px';
import trashIcon from '@jetbrains/icons/trash-12px';
import unsortedIcon from '@jetbrains/icons/unsorted-12px';

import {type TableProps} from '../table-props';
import {ColumnAnimationContext, TablePropsContext} from '../table-const';
import {type ExpectColumnReorder} from './column-animation';
import Icon from '../../icon';
import {useComposedRef} from '../../global/compose-refs';
import {isWithinInteractiveElement} from '../../global/is-within-interactive-element';
import {useReorder} from './use-reorder';

import styles from '../table.css';

export function TableHeader<T>({expectColumnReorder}: {expectColumnReorder: ExpectColumnReorder}) {
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
        {columns.map((column, columnIndex) => (
          <TableHeaderCell
            key={column.key}
            columnIndex={columnIndex}
            columnEditing={effectiveColumnEditing}
            handleEditColumnsButtonClick={handleEditColumnsButtonClick}
            expectColumnReorder={expectColumnReorder}
          />
        ))}
      </tr>
    </thead>
  );
}

function TableHeaderCell<T>({
  columnIndex,
  columnEditing,
  handleEditColumnsButtonClick,
  expectColumnReorder,
}: {
  columnIndex: number;
  columnEditing: boolean;
  handleEditColumnsButtonClick: () => void;
  expectColumnReorder: ExpectColumnReorder;
}) {
  const {columns, columnEditButton} = use(TablePropsContext as Context<TableProps<T>>);
  const {key, name, renderHeader, sortOrder, deletable, canReorder, thClassName} = columns[columnIndex];

  const animatedColumn = use(ColumnAnimationContext);
  const children = renderHeader ? renderHeader() : (name ?? String(key));

  return (
    <th
      className={classNames(
        styles.headerCell,
        animatedColumn?.columnIndex === columnIndex && animatedColumn.cellClassName,
        thClassName,
      )}
      scope='col'
      aria-sort={sortOrder}
    >
      <div className={styles.headerCellInnerWrapper}>
        <div className={styles.sortAndHeader}>
          {canReorder && <ColumnReorderHandle columnIndex={columnIndex} expectColumnReorder={expectColumnReorder} />}
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
    <button type='button' className={classNames(styles.headerButton, className)} onClick={handleClick} {...restProps}>
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
      className={classNames(styles.headerButton, styles.deleteColumnButton, className)}
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
      className={classNames(styles.headerButton, styles.editColumnsButton, className)}
      aria-pressed={columnEditing}
      aria-label={hint}
      title={hint}
      {...restProps}
    >
      <Icon glyph={settingsIcon} aria-hidden='true' />
    </button>
  );
}

function ColumnReorderHandle<T>({
  columnIndex,
  expectColumnReorder,
  ref: userRef,
  className,
  onKeyDown: userOnKeyDown,
  onPointerDown: userOnPointerDown,
  onPointerMove: userOnPointerMove,
  onPointerUp: userOnPointerUp,
  onPointerCancel: userOnPointerCancel,
  onLostPointerCapture: userOnLostPointerCapture,
  ...restProps
}: {columnIndex: number; expectColumnReorder: ExpectColumnReorder} & ComponentPropsWithRef<'button'>) {
  const tableProps = use(TablePropsContext as Context<TableProps<T> | null>);
  const column = tableProps?.columns[columnIndex];

  const localRef = useRef<HTMLButtonElement>(null);
  const composedRef = useComposedRef(localRef, userRef);

  const {onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onLostPointerCapture, onKeyDown} = useReorder({
    direction: 'columns',
    ref: localRef,
    index: columnIndex,
    expectReorder: expectColumnReorder,
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      userOnKeyDown?.(e);
      if (!e.defaultPrevented) onKeyDown(e);
    },
    [onKeyDown, userOnKeyDown],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      userOnPointerDown?.(e);
      if (!e.defaultPrevented) onPointerDown(e);
    },
    [onPointerDown, userOnPointerDown],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      userOnPointerMove?.(e);
      if (!e.defaultPrevented) onPointerMove(e);
    },
    [onPointerMove, userOnPointerMove],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      userOnPointerUp?.(e);
      if (!e.defaultPrevented) onPointerUp(e);
    },
    [onPointerUp, userOnPointerUp],
  );

  const handlePointerCancel = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      userOnPointerCancel?.(e);
      if (!e.defaultPrevented) onPointerCancel();
    },
    [onPointerCancel, userOnPointerCancel],
  );

  const handleLostPointerCapture = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      userOnLostPointerCapture?.(e);
      if (!e.defaultPrevented) onLostPointerCapture();
    },
    [onLostPointerCapture, userOnLostPointerCapture],
  );

  if (!column) return null;

  const hint = `Reorder column ${column.name ?? String(column.key)}.`;
  const description = 'Use Left and Right arrow keys to move the column.';

  return (
    // eslint-disable-next-line jsx-a11y/role-supports-aria-props
    <button
      ref={composedRef}
      type='button'
      className={classNames(styles.headerButton, styles.columnReorderHandle, className)}
      aria-label={hint}
      aria-description={description}
      aria-keyshortcuts='ArrowLeft ArrowRight'
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
      {...restProps}
    >
      <Icon glyph={dragIcon} aria-hidden='true' />
    </button>
  );
}

/**
 * Reserves the space for the reorder handle and prevents layout shift when the handle appears on hover.
 */
function ColumnReorderHandleMirror() {
  return <span className={styles.columnReorderHandleMirror} aria-hidden='true' />;
}
