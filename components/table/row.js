import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {sortableHandle} from 'react-sortable-hoc';
import chevronRightIcon from '@jetbrains/icons/chevron-right.svg';
import chevronDownIcon from '@jetbrains/icons/chevron-down.svg';
import dragIcon from '@jetbrains/icons/drag.svg';

import focusSensorHOC from '../global/focus-sensor-hoc';
import Checkbox from '../checkbox/checkbox';
import Button from '../button/button';
import Tooltip from '../tooltip/tooltip';

import Cell from './cell';
import style from './table.css';

const DragHandle = sortableHandle(({alwaysShowDragHandle}) => {
  const classes = classNames(style.dragHandle, {
    [style.visibleDragHandle]: alwaysShowDragHandle
  });

  return (
    <Button
      className={classes}
      icon={dragIcon}
    />
  );
});

class Row extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    item: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    selectable: PropTypes.bool,
    showFocus: PropTypes.bool,
    draggable: PropTypes.bool,
    alwaysShowDragHandle: PropTypes.bool,
    selected: PropTypes.bool,
    onHover: PropTypes.func,
    onSelect: PropTypes.func,
    onFocusRestore: PropTypes.func,
    level: PropTypes.number,
    collapsible: PropTypes.bool,
    parentCollapsible: PropTypes.bool,
    collapsed: PropTypes.bool,
    onCollapse: PropTypes.func,
    onExpand: PropTypes.func,
    showDisabledSelection: PropTypes.bool,
    checkboxTooltip: PropTypes.string
  };

  static defaultProps = {
    selectable: true,
    showFocus: false,
    draggable: false,
    alwaysShowDragHandle: false,
    selected: false,
    onHover: () => {},
    onSelect: () => {},
    onFocusRestore: () => {},
    level: 0,
    collapsible: false,
    parentCollapsible: false,
    collapsed: false,
    onCollapse: () => {},
    onExpand: () => {}
  };

  onMouseEnter = () => {
    const {item, onHover} = this.props;
    onHover(item);
  };

  onClick = e => {
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
    const {selectable, selected, onSelect} = this.props;
    if (selectable) {
      onSelect(!selected);
    }
  }

  rowRef = el => {
    this.row = el;
  };

  render() {
    const {
      item, columns, selectable, selected,
      showFocus, draggable, alwaysShowDragHandle, level,
      collapsible, parentCollapsible, collapsed,
      onCollapse, onExpand, showDisabledSelection,
      checkboxTooltip
    } = this.props;

    const classes = classNames(this.props.className, {
      [style.row]: true,
      [style.rowFocused]: showFocus,
      [style.rowSelected]: selected
    });

    const testAttrs = {
      'data-test-focused': showFocus || undefined,
      'data-test-selected': selected || undefined
    };

    const metaColumnClasses = style.metaColumn;

    const SUBITEM_OFFSET = 30;
    const COLLAPSIBLE_PARENT_OFFSET = 20;
    const gap = level * SUBITEM_OFFSET + (parentCollapsible ? COLLAPSIBLE_PARENT_OFFSET : 0);
    const metaColumnStyle = {
      paddingLeft: `${gap}px`
    };

    const metaColumn = (
      <div className={metaColumnClasses} style={metaColumnStyle}>
        {draggable &&
          <DragHandle alwaysShowDragHandle={alwaysShowDragHandle}/>
        }

        {selectable &&
          (
            <Tooltip title={checkboxTooltip}>
              <Checkbox
                className={showFocus ? 'ring-checkbox_focus' : ''}
                checked={selected}
                onFocus={this.onCheckboxFocus}
                onChange={this.onCheckboxChange}
                tabIndex="-1"
              />
            </Tooltip>
          )
        }

        {!selectable && showDisabledSelection &&
          (
            <Tooltip title={checkboxTooltip}>
              <Checkbox
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
              onClick={onExpand}
            />
          )
        }

        {collapsible && !collapsed &&
          (
            <Button
              className={style.rowCollapseExpandButton}
              icon={chevronDownIcon}
              onClick={onCollapse}
            />
          )
        }
      </div>
    );

    const cells = columns.map((column, index) => {
      const getValue = column.getValue || (() => item[column.id]);
      const value = getValue(item, column);
      const cellClasses = classNames({[style.cellRight]: column.rightAlign}, column.className);

      return (
        <Cell key={column.id} className={cellClasses}>
          {index === 0 && (draggable || selectable || showDisabledSelection) && metaColumn}
          {value}
        </Cell>
      );
    });

    return (
      <tr
        ref={this.rowRef}
        className={classes}
        tabIndex="0"
        onMouseMove={this.onMouseEnter}
        onClick={this.onClick}
        data-test="ring-table-row"
        {...testAttrs}
      >{cells}</tr>
    );
  }
}

export default focusSensorHOC(Row);
