import {ComponentType, HTMLAttributes, PureComponent, ReactNode} from 'react';
import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import chevronRightIcon from '@jetbrains/icons/chevron-right';
import chevronDownIcon from '@jetbrains/icons/chevron-down';
import dragIcon from '@jetbrains/icons/drag';

import Checkbox from '../checkbox/checkbox';
import Button from '../button/button';
import Tooltip from '../tooltip/tooltip';
import dataTests from '../global/data-tests';

import getUID from '../global/get-uid';
import {createComposedRef} from '../global/composeRefs';

import {FocusSensorAddProps} from '../global/focus-sensor-hoc';

import Cell from './cell';
import style from './table.css';

import {Column} from './header-cell';
import {SelectionItem} from './selection';

interface DragHandleProps {
  alwaysShowDragHandle: boolean
  dragHandleTitle?: string
}
const DragHandle = (
  {alwaysShowDragHandle, dragHandleTitle = 'Drag to reorder'}: DragHandleProps
) => {
  const classes = classNames(style.dragHandle, {
    [style.visibleDragHandle]: alwaysShowDragHandle
  });

  return (
    <Button
      data-movable-handle
      title={dragHandleTitle}
      className={classes}
      icon={dragIcon}
    />
  );
};
DragHandle.propTypes = {
  alwaysShowDragHandle: PropTypes.bool,
  dragHandleTitle: PropTypes.string
};

export interface RowProps<T extends SelectionItem> extends Omit<
  HTMLAttributes<HTMLTableRowElement>,
  'onClick' | 'onDoubleClick' | 'onSelect'
>, FocusSensorAddProps<HTMLTableRowElement> {
  item: T
  columns: readonly Column<T>[] | ((item: T) => readonly Column<T>[])
  selectable: boolean
  showFocus: boolean
  draggable: boolean
  alwaysShowDragHandle: boolean
  dragHandleTitle?: string
  selected: boolean
  onHover: (item: T, e: React.MouseEvent<HTMLTableRowElement>) => void
  onSelect: (item: T, selected: boolean) => void
  onDoubleClick: (item: T) => void
  onClick: (item: T, e: React.MouseEvent<HTMLTableRowElement>) => void
  level: number
  collapsible: boolean
  parentCollapsible: boolean
  collapsed: boolean
  onCollapse: (item: T) => void
  onExpand: (item: T) => void
  showDisabledSelection?: boolean | null | undefined
  checkboxTooltip?: string | undefined
  autofocus?: boolean | null | undefined
  'data-test'?: string | null | undefined
  metaColumnClassName?: string | null | undefined
}
export default class Row<T extends SelectionItem> extends PureComponent<RowProps<T>> {
  static defaultProps = {
    selectable: true,
    showFocus: false,
    draggable: false,
    alwaysShowDragHandle: false,
    selected: false,
    onHover: () => {},
    onSelect: () => {},
    onDoubleClick: () => {},
    onClick: () => {},
    level: 0,
    collapsible: false,
    parentCollapsible: false,
    collapsed: false,
    onCollapse: () => {},
    onExpand: () => {}
  };

  id = getUID('table-row-');

  onMouseEnter = (e: React.MouseEvent<HTMLTableRowElement>) => {
    const {item, onHover} = this.props;
    onHover(item, e);
  };

  onClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    const {item} = this.props;

    this.props.onClick(item, e);

    if (e.shiftKey) {
      this.toggleSelection();
    }
  };

  onCheckboxFocus = () => {
    this.props.onFocusRestore();
  };

  onCheckboxChange = () => {
    this.toggleSelection();
  };

  toggleSelection() {
    const {selectable, selected, onSelect, item} = this.props;
    if (selectable) {
      onSelect(item, !selected);
    }
  }

  onDoubleClick = () => {
    const {item} = this.props;
    this.props.onDoubleClick(item);
  };

  row?: HTMLElement | null;
  rowRef = (el: HTMLElement | null) => {
    this.row = el;
  };

  composedRowRef = createComposedRef<HTMLElement>();

  render() {
    const {
      item, columns: columnProps, selectable, selected,
      showFocus, draggable, alwaysShowDragHandle, dragHandleTitle, level,
      collapsible, parentCollapsible, collapsed,
      onCollapse, onExpand, showDisabledSelection, onSelect,
      checkboxTooltip, innerRef, focused, autofocus, onFocusReset,
      onFocusRestore, onHover, className, metaColumnClassName, 'data-test': dataTest, ...restProps
    } = this.props;

    const classes = classNames(className, {
      [style.row]: true,
      [style.rowFocused]: showFocus,
      [style.rowSelected]: selected
    });

    const testAttrs = {
      'data-test-focused': showFocus || undefined,
      'data-test-selected': selected || undefined
    };

    const metaColumnClasses = classNames(metaColumnClassName, style.metaColumn);

    const SUBITEM_OFFSET = 30;
    const COLLAPSIBLE_PARENT_OFFSET = 20;
    const gap = level * SUBITEM_OFFSET + (parentCollapsible ? COLLAPSIBLE_PARENT_OFFSET : 0);
    const metaColumnStyle = {
      paddingLeft: `${gap}px`
    };

    const metaColumn = (
      <div className={metaColumnClasses} style={metaColumnStyle}>
        {draggable && (
          <DragHandle
            alwaysShowDragHandle={alwaysShowDragHandle}
            dragHandleTitle={dragHandleTitle}
          />
        )}

        {selectable &&
          (
            <Tooltip title={checkboxTooltip}>
              <Checkbox
                aria-labelledby={this.id}
                className={showFocus ? 'ring-checkbox_focus' : ''}
                checked={selected}
                onFocus={this.onCheckboxFocus}
                onChange={this.onCheckboxChange}
                tabIndex={-1}
              />
            </Tooltip>
          )
        }

        {!selectable && showDisabledSelection &&
          (
            <Tooltip title={checkboxTooltip}>
              <Checkbox
                aria-labelledby={this.id}
                checked={selected}
                disabled
              />
            </Tooltip>
          )
        }

        {collapsible && collapsed &&
          (
            <Button
              className={style.rowCollapseExpandButton}
              icon={chevronRightIcon}
              onClick={() => onExpand(item)}
            />
          )
        }

        {collapsible && !collapsed &&
          (
            <Button
              className={style.rowCollapseExpandButton}
              icon={chevronDownIcon}
              onClick={() => onCollapse(item)}
            />
          )
        }
      </div>
    );

    const columns = typeof columnProps === 'function' ? columnProps(item) : columnProps;

    const cells = columns.map((column, index) => {
      const getValue = column.getValue || (() => item[column.id] as ReactNode);
      const getDataTest = column.getDataTest || (() => column.id);
      const value = getValue(item, column);
      const cellClasses = classNames({[style.cellRight]: column.rightAlign}, column.className);
      const showMetaColumn =
        draggable || selectable || collapsible || showDisabledSelection || !!level;

      return (
        <Cell
          colSpan={column.colSpan}
          key={column.id}
          className={cellClasses}
          data-test={getDataTest(item, column)}
        >
          {index === 0 && (showMetaColumn) && metaColumn}
          {value}
        </Cell>
      );
    });

    return (
      <tr
        id={this.id}
        ref={this.composedRowRef(this.rowRef, innerRef)}
        className={classes}
        tabIndex={0}
        data-test={dataTests('ring-table-row', dataTest)}
        {...testAttrs}
        {...restProps}
        onMouseMove={this.onMouseEnter}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
      >{cells}</tr>
    );
  }
}

(Row as ComponentType<unknown>).propTypes = {
  className: PropTypes.string,
  metaColumnClassName: PropTypes.string,
  item: PropTypes.object.isRequired,
  columns: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
  selectable: PropTypes.bool,
  showFocus: PropTypes.bool,
  draggable: PropTypes.bool,
  alwaysShowDragHandle: PropTypes.bool,
  selected: PropTypes.bool,
  onHover: PropTypes.func,
  onSelect: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onClick: PropTypes.func,
  onFocusRestore: PropTypes.func,
  level: PropTypes.number,
  collapsible: PropTypes.bool,
  parentCollapsible: PropTypes.bool,
  collapsed: PropTypes.bool,
  onCollapse: PropTypes.func,
  onExpand: PropTypes.func,
  showDisabledSelection: PropTypes.bool,
  checkboxTooltip: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  focused: PropTypes.bool,
  autofocus: PropTypes.bool,
  onFocusReset: PropTypes.func,
  'data-test': PropTypes.string
};

export type RowAttrs<T extends SelectionItem> =
  React.JSX.LibraryManagedAttributes<typeof Row, RowProps<T>>;
