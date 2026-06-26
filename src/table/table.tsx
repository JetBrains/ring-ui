import React, {type ComponentPropsWithRef, Fragment, useCallback, useRef} from 'react';
import classNames from 'classnames';

import {IntersectionObserverContext} from '../global/intersection-observer-context';
import {CollapseItemIntoSpacerContext, SpacerRow, useVirtualItems} from './internal/virtual-items';
import {DefaultItemRenderer, keyboardFocusableAttrName} from './default-item-renderer';
import {ColumnAnimationContext, defaultRowHeight, TablePropsContext} from './table-const';
import {focusWithTemporaryTabIndex} from '../global/focus-with-temporary-tabindex';
import {useColumnAnimation} from './internal/column-animation';
import {useComposedRef} from '../global/compose-refs';
import {TableHeader} from './internal/table-header';

import type {TableProps} from './table-props';

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
    // eslint-disable-next-line no-magic-numbers
    lookaheadPx = 400,
    // eslint-disable-next-line no-magic-numbers
    retentionMarginPx = 450,
    // eslint-disable-next-line no-magic-numbers
    minScrollAndResizeDeltaPx = 50,
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

  const {virtualItems, intersectionObserverHandle, collapseItemIntoSpacer} = useVirtualItems({
    enabled: virtualizeRows,
    data,
    scrollerRef,
    tableRef: localRef,
    estimateHeight,
    lookaheadPx,
    retentionMarginPx,
    minScrollAndResizeDeltaPx,
  });

  const {columnAnimation, expectColumnReorder} = useColumnAnimation({
    disabled: noColumnReorderAnimation,
    tableRef: localRef,
    columns,
  });

  const handleRowNavigation = useCallback((e: React.KeyboardEvent<HTMLTableSectionElement>) => {
    const arrowUp = e.key === 'ArrowUp';
    const arrowDown = e.key === 'ArrowDown';
    if (!arrowUp && !arrowDown) return;

    const currentRow = (e.target as HTMLElement).closest('tr');
    if (currentRow?.parentElement?.parentElement !== localRef.current) {
      return;
    }

    let candidate: HTMLTableRowElement | null = currentRow;
    while (candidate) {
      candidate = (
        arrowUp ? candidate.previousElementSibling : candidate.nextElementSibling
      ) as HTMLTableRowElement | null;

      if (candidate?.hasAttribute(keyboardFocusableAttrName)) {
        focusWithTemporaryTabIndex(candidate);
        e.preventDefault();
        return;
      }
    }
  }, []);

  return (
    <TablePropsContext value={props as TableProps<unknown>}>
      <ColumnAnimationContext value={columnAnimation}>
        <table className={classNames(styles.table, className)} ref={useComposedRef(userRef, localRef)} {...restProps}>
          <TableHeader expectColumnReorder={expectColumnReorder} />
          <IntersectionObserverContext value={intersectionObserverHandle}>
            <CollapseItemIntoSpacerContext value={collapseItemIntoSpacer}>
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
              <tbody className={tbodyClassName} onKeyDown={handleRowNavigation}>
                {virtualItems.map(virtualItem => {
                  if (virtualItem.type === 'spacer') {
                    return <SpacerRow key={virtualItem.key} spacer={virtualItem} colSpan={columns.length} />;
                  }

                  const index = virtualItem.index;
                  if (index < 0 || index >= data.length) return null;

                  const item = data[index];
                  const key = getKey(item, index, data);
                  return (
                    <Fragment key={key}>
                      {renderItem ? renderItem(item, index, data) : <DefaultItemRenderer index={index} />}
                    </Fragment>
                  );
                })}
              </tbody>
            </CollapseItemIntoSpacerContext>
          </IntersectionObserverContext>
        </table>
      </ColumnAnimationContext>
    </TablePropsContext>
  );
}
