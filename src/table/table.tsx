import React, {type ComponentPropsWithRef, Fragment, useCallback, useRef} from 'react';
import classNames from 'classnames';

import {IntersectionObserverContext} from '../global/intersection-observer-context';
import {CollapseItemIntoSpacerContext, SpacerRow, useVirtualItems, type VirtualItem} from './internal/virtual-items';
import {DefaultItemRenderer} from './default-item-renderer';
import {ReorderAnimationContext, defaultRowHeight, TablePropsContext} from './table-const';
import {focusWithTemporaryTabIndex} from '../global/focus-with-temporary-tabindex';
import {ExpectReorderContext, useReorderAnimation} from './internal/reorder-animation';
import {useComposedRef} from '../global/compose-refs';
import {TableHeader} from './internal/table-header';
import {keyboardFocusableAttrName} from './table-primitives';
import {isWithinNavigableElement} from '../global/is-within-navigable-element';

import type {TableProps} from './table-props';

import styles from './table.css';

/**
 * Table component replacing the tables in the `legacy-table` folder.
 *
 * This documentation provides an overview of the most common usage patterns.
 * See individual props and exported components for detailed behavior.
 *
 * ## Minimal usage
 *
 * You need the following props:
 * - `data`
 * - `getKey`
 * - `columns`
 *   - `key`
 *   - `name` (optional but needed in most cases)
 *   - `renderCell` (optional but needed in most cases)
 *
 * ## Item rendering
 *
 * If `renderItem` is not specified, each item is rendered using
 * `DefaultItemRenderer` (from `table/default-item-renderer`)
 * as if the following code were used:
 *
 * ```tsx
 * <Table
 *   renderItem={(_item, index, _items) => (
 *     <DefaultItemRenderer index={index} />
 *   )}
 * />
 * ```
 *
 * `DefaultItemRenderer` renders a table row using the column definitions
 * (`Column.renderCell`) and provides built-in support for features such as
 * selection, keyboard navigation, and virtualization. It also accepts all
 * standard `tr` attributes, including `ref`.
 *
 * Use `renderItem` to configure `DefaultItemRenderer` for each item:
 *
 * ```tsx
 * <Table
 *   renderItem={(item, index, items) => (
 *     <DefaultItemRenderer
 *       index={index}
 *       keyboardFocusable
 *       className='my-item'
 *       onClick={e => handleClick(e, item, items)}
 *     />
 *   )}
 * />
 * ```
 *
 * If you need complete control over rendering, `renderItem` can instead
 * return your own table rows. See "Custom item rendering" below.
 *
 * ## Selection
 *
 * Selection is typically implemented using the following props
 * of the `DefaultItemRenderer`:
 *
 * - `clickable`
 * - `selected`
 * - `onClick` or `onPointerUp`, etc.
 *
 * The following utilities (from `global`) may come in handy:
 *
 * - `TableSelection` class to manage selection state
 *   - An alternative approach is to keep a `selected` field on each item
 * - `isWithinInteractiveElement()` to check if a click was made on a control
 *   or on "empty space"
 *
 * ```tsx
 * <Table
 *   renderItem={(item, index) => (
 *     <DefaultItemRenderer
 *       index={index}
 *       clickable
 *       selected={selection.isSelected(item)}
 *       onClick={e => {
 *         if (!isWithinInteractiveElement(e)) {
 *           setSelection(selection.toggleSelection(item));
 *         }
 *       }}
 *     />
 *   )}
 * />
 * ```
 *
 * Note that for accessibility reasons, you should have a cell with a checkbox
 * to display and toggle item selection.
 *
 * ## Rows focus
 *
 * The table implements the ["roving tabindex"](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets#technique_1_roving_tabindex)
 * technique to focus rows with the up/down arrow keys.
 * Rows can also be focused on click or other pointer events.
 * To support it, use the following props of the `DefaultItemRenderer`:
 *
 * - `keyboardFocusable`
 * - `clickable`, if you want to react to hover
 * - `onClick`, if you want to focus on click
 *
 * Useful utils:
 * - `focusWithTemporaryTabIndex()` from `global` to focus a row temporarily
 *   patching its `tabindex`.
 *
 * ```tsx
 * <Table
 *   renderItem={(item, index) => (
 *     <DefaultItemRenderer
 *       index={index}
 *       clickable
 *       keyboardFocusable
 *       onClick={e => {
 *         if (!isWithinInteractiveElement(e)) {
 *           focusWithTemporaryTabIndex(e.currentTarget);
 *         }
 *       }}
 *     />
 *   )}
 * />
 * ```
 *
 * Note that the table does not implement standard accessibility patterns such
 * as `grid` or `treegrid`, so row focus is not announced by screen readers.
 * Make sure all essential actions remain available without row focus, for
 * example via standard Tab navigation.
 *
 * ## Sorting
 *
 * You need the following to support sorting:
 *
 * - Set `Column.sortOrder` to `'none'`, `'ascending'` or `'descending'`
 *   to render the sort button, `aria-sort`, and indicate the current
 *   sort order.
 * - Handle `TableProps.onSort` callback in the client code.
 *
 * ## Deleting columns
 *
 * You need the following to support deleting columns:
 *
 * - Set `Column.deletable` to `true`. This will render a delete button in the
 *   column header.
 * - Make sure the `column` has a proper `name` or `key` prop, which will be
 *   automatically included in the aria-label of the column delete button.
 * - Handle `TableProps.onColumnDelete` callback in the client code. It is
 *   expected to update `columns` by removing the corresponding column.
 *
 * ## Moving columns
 *
 * - Set `Column.canReorder` to `true` or to predicate specifying possible
 *   insertion targets.
 *   This will render a reorder button in the column header.
 * - Make sure the `column` has a proper `name` or `key` prop, which will be
 *   automatically included in the aria-label of the column reorder button.
 * - Handle `TableProps.onColumnReorder` callback in the client code. It is
 *   expected to update `columns` by moving the corresponding column to the
 *   new position.
 *
 * ## Row virtualization
 *
 * To render only rows near the viewport while replacing off-screen rows with
 * spacers, use:
 *
 * - `virtualizeRows` prop set to `true`
 * - `scrollerRef` — required when the scrollable container is not the whole
 *    document
 * - `estimateHeight` — recommended when rows are expected to be taller than
 *   the default height (e.g. multiline or custom content)
 * - Fine-tuning props: `lookaheadPx`, `retentionMarginPx`,
 *   `minScrollAndResizeDeltaPx`
 *
 * ## Custom item rendering
 *
 * Use the `renderItem` prop to render an item in a completely custom way.
 * The prop is expected to return one or more table rows for the item.
 * Use `TableRow` and `TableCell` from `table/table-primitives` to apply
 * the default row and cell styles.
 *
 * ### Focus
 *
 * Just like `DefaultItemRenderer`, `TableRow` accepts the
 * `keyboardFocusable` prop.
 *
 * Focusable rows rendered by either component form a single keyboard
 * navigation sequence.
 *
 * ### Virtualization
 *
 * If `Table.virtualizeRows` is set to `true`, you need to handle visibility
 * for your custom-rendered component yourself with the
 * `useItemVirtualization()` hook (from `table/item-virtualization`). The hook
 * allows observing the intersection of one or multiple elements rendered for
 * the item, and, based on their intersection status, reporting the item as
 * eligible for virtualization.
 *
 * If you use `DefaultItemRenderer` as part of your custom row renderer,
 * set the `noItemVirtualization` prop to `true`, otherwise it will also try
 * to control the virtualization, possibly reporting incorrect item height.
 *
 * ### Column reorder animation
 *
 * Default-rendered rows highlight the column that was just reordered. To apply
 * the same animation to your custom-rendered rows, use `ColumnAnimationContext`
 * (from `table/table-const`) to get information about the currently animated column.
 */
export default function Table<T>(props: TableProps<T> & ComponentPropsWithRef<'table'>) {
  const {
    data,
    columns,
    getKey,
    noHeader,
    stickyHeader,
    onSort,
    onColumnDelete,
    onColumnReorder,
    noColumnReorderAnimation,
    canReorderItem,
    onItemReorder,
    noItemReorderAnimation,
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

  const {reorderAnimation, expectReorder} = useReorderAnimation({
    noColumnReorderAnimation,
    noItemReorderAnimation,
    tableRef: localRef,
    data,
    columns,
  });

  const handleRowNavigation = useCallback((e: React.KeyboardEvent<HTMLTableSectionElement>) => {
    if (e.defaultPrevented || isWithinNavigableElement(e.target)) return;

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
      <ExpectReorderContext value={expectReorder}>
        <ReorderAnimationContext value={reorderAnimation}>
          <table className={classNames(styles.table, className)} ref={useComposedRef(userRef, localRef)} {...restProps}>
            <TableHeader />
            <IntersectionObserverContext value={intersectionObserverHandle}>
              <CollapseItemIntoSpacerContext value={collapseItemIntoSpacer}>
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                <tbody className={tbodyClassName} onKeyDown={handleRowNavigation}>
                  {(virtualizeRows ? virtualItems : data).map((item, index) => {
                    let dataItem: T;
                    let dataItemIndex: number;

                    if (virtualizeRows) {
                      const virtualItem = item as VirtualItem;
                      if (virtualItem.type === 'spacer') {
                        return <SpacerRow key={virtualItem.key} spacer={virtualItem} colSpan={columns.length} />;
                      }

                      dataItemIndex = virtualItem.index;
                      if (dataItemIndex < 0 || dataItemIndex >= data.length) return null;
                      dataItem = data[dataItemIndex];
                    } else {
                      dataItem = item as T;
                      dataItemIndex = index;
                    }

                    return (
                      <Fragment key={getKey(dataItem, dataItemIndex, data)}>
                        {renderItem ? (
                          renderItem(dataItem, dataItemIndex, data)
                        ) : (
                          <DefaultItemRenderer index={dataItemIndex} />
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </CollapseItemIntoSpacerContext>
            </IntersectionObserverContext>
          </table>
        </ReorderAnimationContext>
      </ExpectReorderContext>
    </TablePropsContext>
  );
}
