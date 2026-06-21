import {type ComponentPropsWithRef, type Context, use, useRef} from 'react';
import classNames from 'classnames';
import {mergeRefs} from 'react-merge-refs';

import {CollapseItemIntoSpacerContext, TablePropsContext} from './table-const';
import {useIsIntersectingListener} from '../global/intersection-observer-context';
import {TableCell, TableRow} from './table-primitives';
import {AnimatedColumnContext} from './table-animated-column';

import type {TableProps} from './table';

import styles from './table.css';

export interface DefaultItemRendererProps {
  /**
   * The index of the `data` item to render.
   */
  index: number;

  /**
   * If true, the row will be focusable with up/down arrow keys.
   * Focus is implemented using the
   * ["roving tabindex"](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets#technique_1_roving_tabindex)
   * technique, that is, only the focused row has `tabIndex={0}`.
   */
  keyboardFocusable?: boolean;

  /**
   * Changes the background on hover and applies the pointer cursor.
   * Note that `false` does not mean the row cannot handle `onClick`.
   */
  clickable?: boolean;

  /**
   * If true, the row is highlighted as selected, that is, with the
   * a different background color.
   */
  selected?: boolean;

  /**
   * A level of a nested item. Results in an indent for columns with `indent: true`.
   * 0, negative values, and an unset value mean no indent.
   */
  level?: number;

  /**
   * When set to `true`, doesn't observe own visibility and doesn't call
   * `collapseItemIntoSpacer()`. Useful when you include `DefaultItemRenderer`
   * as a part of a custom row rendered, and track the visibility yourself.
   */
  noVirtualization?: boolean;
}

const INDENT_SIZE = 24;

/**
 * Use to render a row in a standard way, and to specify item-scoped props like this:
 *
 * ```tsx
 * <DefaultItemRenderer
 *   index={index}
 *   keyboardFocusable
 *   clickable
 *   onClick={e => {
 *     if (!isWithinInteractiveElement(e.target)) {
 *       selection.toggle(item);
 *       focusRow(e.currentTarget);
 *       e.preventDefault();
 *     }
 *   }}
 * />
 *```
 *
 * `isWithinInteractiveElement()` and `focusRow()` utilities are available from `table-row-focus.ts`.
 */
export function DefaultItemRenderer<T>({
  index,
  keyboardFocusable,
  clickable,
  selected,
  level,
  noVirtualization,

  ref: userRef,
  className,
  ...restProps
}: DefaultItemRendererProps & ComponentPropsWithRef<'tr'>) {
  const localRef = useRef<HTMLTableRowElement>(null);

  const collapseItemIntoSpacer = use(CollapseItemIntoSpacerContext);
  useIsIntersectingListener({
    enabled: !noVirtualization,
    ref: localRef,
    onChange: isIntersecting => {
      if (localRef.current && !isIntersecting) {
        collapseItemIntoSpacer(localRef.current.getBoundingClientRect().height);
      }
    },
  });

  const tableProps = use(TablePropsContext as Context<TableProps<T> | null>);
  if (!tableProps) {
    return null;
  }

  const animatedColumn = use(AnimatedColumnContext);

  const {data, columns} = tableProps;

  const item = data[index];

  return (
    <TableRow
      ref={mergeRefs([userRef, localRef])}
      keyboardFocusable={keyboardFocusable}
      className={classNames(className, clickable && styles.clickableRow, selected && styles.selectedRow)}
      {...restProps}
    >
      {columns.map((column, columnIndex) => (
        <TableCell
          key={column.key}
          className={classNames(
            columnIndex === animatedColumn?.columnIndex && animatedColumn.cellClassName,
            column.tdClassName?.(item, index, data),
          )}
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
