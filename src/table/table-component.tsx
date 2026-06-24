import React, {type ComponentPropsWithRef, type Context, use, useCallback, useRef, useState} from 'react';
import classNames from 'classnames';

import {IntersectionObserverContext} from '../global/intersection-observer-context';
import {SpacerRow, useTableVirtualize} from './table-virtualize';
import {DefaultItemRenderer} from './default-item-renderer';
import {
  CollapseItemIntoSpacerContext,
  defaultLookaheadPx,
  defaultMinScrollAndResizeDeltaPx,
  defaultRetentionMarginPx,
  defaultRowHeight,
  TablePropsContext,
} from './table-const';
import {isWithinInteractiveElement, onBlurCaptureTbody, onKeyDownTbody} from './table-row-focus';
import {type AnimatedColumn, AnimatedColumnContext, useAnimatedColumn} from './table-animated-column';
import {
  ColumnReorderHandle,
  ColumnReorderHandleMirror,
  DeleteColumnButton,
  EditColumnsButton,
  SortButton,
} from './table-primitives';
import {useComposedRef} from '../global/compose-refs';

import type {TableProps} from './table';

import styles from './table.css';

/**
 * The new Table component. Use it instead of tables in the `legacy-table` folder.
 *
 * For every prop and component referenced here, see the corresponding docs
 * for detailed behavior.
 *
 * ## Minimal usage
 *
 * You need the following props:
 * - `data`
 * - `getKey`
 * - `columns`
 *   - `key`
 *   - `name` (not required but needed in most cases)
 *   - `renderCell` (not required but needed in most cases)
 *
 * ## Selection
 *
 * Selection is handled on item level via `renderItem` (often with
 * `DefaultItemRenderer`) and its props:
 *
 * - `clickable`
 * - `selected`
 * - `onClick` or `onPointerUp`, etc.
 *
 * You may use the TableSelection from `global/table-selection.ts` for the selection control:
 *
 * - `selected={tableSelection.isSelected(item)}`
 * - `onClick={() => setTableSelection(tableSelection.toggle(item))}`
 *
 * See the stories for examples with this utility.
 *
 * Additionally, for accessibility, you will likely need a cell with a checkbox
 * to toggle item selection.
 *
 * ## Sorting
 *
 * You need the following to support sorting:
 *
 * - Include `<SortButton />` in a column header
 * - Set initial `Column.sortOrder` to `none`. Do not leave `undefined`
 *   for accessibility reasons.
 * - Handle `TableProps.onSort` callback in the client code. It is expected
 *   to update `columns` by setting the new `sortOrder` value for
 *   the corresponding column, and updating the data accordingly.
 *
 * ## Focus
 *
 * The table supports the ["roving tabindex"](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets#technique_1_roving_tabindex)
 * technique to focus rows with the up/down arrow keys and, possibly, with the pointer.
 * To support it, use the following props of the `DefaultItemRenderer`:
 *
 * - `keyboardFocusable`
 * - Possibly `onClick` invoking `focusRow(e.currentTarget)`
 *
 * In your custom row renderer, use `TableRow`, which also has the `keyboardFocusable` prop.
 *
 * ## Deleting columns
 *
 * You need the following to support deleting columns:
 *
 * - Make sure the `column` has a proper `name` or `key` prop, which will be
 *   automatically included in the aria-label of `<DeleteColumnButton />`.
 * - Include `<DeleteColumnButton />` in a column header
 * - Handle `TableProps.onColumnDelete` callback in the client code. It is expected
 *   to update `columns` by removing the corresponding column.
 *
 * ## Row virtualization
 *
 * To render only rows near the viewport and replace others with spacers, use:
 *
 * - `virtualizeRows`
 * - `scrollerRef` — required when the scrollable container is not the whole document
 * - `estimateHeight` — recommended when rows are expected to be taller than
 *   the default height (e.g. multiline or custom content)
 * - Fine-tuning props: `lookaheadPx`, `retentionMarginPx`, `minScrollAndResizeDeltaPx`
 */
export default function Table<T>(props: TableProps<T> & ComponentPropsWithRef<'table'>) {
  const {
    data,
    columns,
    getKey,
    noHeader,
    onItemMove,
    onSort,
    onColumnDelete,
    onColumnReorder,
    noColumnReorderAnimation,
    renderItem,
    virtualizeRows = false,
    scrollerRef,
    estimateHeight = () => defaultRowHeight,
    lookaheadPx = defaultLookaheadPx,
    retentionMarginPx = defaultRetentionMarginPx,
    minScrollAndResizeDeltaPx = defaultMinScrollAndResizeDeltaPx,
    columnEditing,
    onColumnEditingRequest,
    columnEditButton,
    theadClassName,
    theadTrClassName,
    tbodyClassName,

    ref: userRef,
    className,
    ...restProps
  } = props;

  const localRef = useRef<HTMLTableElement>(null);

  const {virtualItems, intersectionObserverHandle, collapseItemIntoSpacer} = useTableVirtualize({
    enabled: virtualizeRows,
    data,
    scrollerRef,
    tableRef: localRef,
    estimateHeight,
    lookaheadPx,
    retentionMarginPx,
    minScrollAndResizeDeltaPx,
  });

  const [animatedColumn, setAnimatedColumn] = useState<AnimatedColumn | null>(null);
  useAnimatedColumn({
    animatedColumn,
    setAnimatedColumn,
    disabled: noColumnReorderAnimation,
    tableRef: localRef,
    columns,
  });

  return (
    <TablePropsContext value={props as TableProps<unknown>}>
      <AnimatedColumnContext value={animatedColumn}>
        <table className={classNames(styles.table, className)} ref={useComposedRef(userRef, localRef)} {...restProps}>
          <TableHeader />
          <IntersectionObserverContext value={intersectionObserverHandle}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <tbody className={tbodyClassName} onKeyDown={onKeyDownTbody} onBlurCapture={onBlurCaptureTbody}>
              {virtualItems.map(virtualItem => {
                if (virtualItem.type === 'spacer') {
                  return <SpacerRow key={virtualItem.key} spacer={virtualItem} colSpan={columns.length} />;
                }

                const index = virtualItem.index;
                if (index < 0 || index >= data.length) return null;

                const item = data[index];
                const key = getKey(item, index, data);
                return (
                  <CollapseItemIntoSpacerContext value={height => collapseItemIntoSpacer(index, height)} key={key}>
                    {renderItem ? renderItem(item, index, data) : <DefaultItemRenderer index={index} />}
                  </CollapseItemIntoSpacerContext>
                );
              })}
            </tbody>
          </IntersectionObserverContext>
        </table>
      </AnimatedColumnContext>
    </TablePropsContext>
  );
}

function TableHeader<T>() {
  const {columns, noHeader, columnEditing, onColumnEditingRequest, theadClassName, theadTrClassName} = use(
    TablePropsContext as Context<TableProps<T>>,
  );

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
      className={classNames(theadClassName, effectiveColumnEditing && styles.theadColumnEditing)}
      onClick={handleTheadClick}
    >
      <tr className={theadTrClassName}>
        {columns.map((column, columnIndex) => (
          <TableHeaderCell
            key={column.key}
            columnIndex={columnIndex}
            handleEditColumnsButtonClick={handleEditColumnsButtonClick}
          />
        ))}
      </tr>
    </thead>
  );
}

function TableHeaderCell<T>({
  columnIndex,
  handleEditColumnsButtonClick,
}: {
  columnIndex: number;
  handleEditColumnsButtonClick: () => void;
}) {
  const {columns, columnEditButton} = use(TablePropsContext as Context<TableProps<T>>);
  const {key, name, renderHeader, sortOrder, deletable, canReorder, thClassName} = columns[columnIndex];

  const animatedColumn = use(AnimatedColumnContext);
  const children = renderHeader ? renderHeader() : (name ?? String(key));

  return (
    <th
      className={classNames(
        styles.headerCell,
        animatedColumn?.columnIndex === columnIndex && animatedColumn.cellClassName,
        thClassName,
      )}
      aria-sort={sortOrder}
    >
      <div className={styles.headerCellInnerWrapper}>
        <div>
          {canReorder && <ColumnReorderHandle columnIndex={columnIndex} />}
          {sortOrder ? <SortButton columnIndex={columnIndex}>{children}</SortButton> : children}
          {canReorder && <ColumnReorderHandleMirror />}
        </div>

        <div>
          {deletable && <DeleteColumnButton columnIndex={columnIndex} />}
          {columnIndex === columns.length - 1 && columnEditButton && (
            <EditColumnsButton onClick={handleEditColumnsButtonClick} />
          )}
        </div>
      </div>
    </th>
  );
}
