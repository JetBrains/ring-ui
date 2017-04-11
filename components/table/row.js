/* eslint-disable react/jsx-max-props-per-line */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {sortableHandle} from 'react-sortable-hoc';

import focusSensorHOC from '../global/focus-sensor-hoc';
import dragIcon from 'jetbrains-icons/drag.svg';

import Cell from './cell';
import Checkbox from '../checkbox/checkbox';
import Button from '../button/button';
import Icon from '../icon/icon';

import style from './table.css';

const DragHandle = sortableHandle(({alwaysShowDragHandle}) => { // eslint-disable-line arrow-body-style
  const classes = classNames(style.dragHandle, alwaysShowDragHandle && style.visibleDragHandle);

  return (
    <Button
      className={classes}
      icon={dragIcon}
      iconSize={Icon.Size.Size14}
    />
  );
});

class Row extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    item: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    selectable: PropTypes.bool,
    checkable: PropTypes.bool,
    showFocus: PropTypes.bool,
    draggable: PropTypes.bool,
    alwaysShowDragHandle: PropTypes.bool,
    selected: PropTypes.bool,
    onHover: PropTypes.func,
    onSelect: PropTypes.func,
    onFocusRestore: PropTypes.func
  }

  static defaultProps = {
    selectable: true,
    checkable: true,
    showFocus: false,
    draggable: false,
    alwaysShowDragHandle: false,
    selected: false,
    onHover: () => {},
    onSelect: () => {},
    onFocusRestore: () => {}
  }

  onMouseEnter = () => {
    const {item, onHover} = this.props;
    onHover(item);
  }

  onClick = e => {
    if (e.shiftKey) {
      this.toggleSelection();
    }
  }

  onCheckboxFocus = () => {
    this.props.onFocusRestore();
  }

  onCheckboxChange = () => {
    this.toggleSelection();
  }

  toggleSelection() {
    const {selectable, selected, onSelect} = this.props;
    if (selectable) {
      onSelect(!selected);
    }
  }

  render() {
    const {item, columns, selectable, checkable, selected, showFocus, draggable, alwaysShowDragHandle} = this.props;

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
    const gap = item.__level ? item.__level * SUBITEM_OFFSET : 0;
    const metaColumnStyle = {
      paddingLeft: `${gap}px`
    };

    const metaColumn = (
      <div className={metaColumnClasses} style={metaColumnStyle}>
        {draggable && <DragHandle alwaysShowDragHandle={alwaysShowDragHandle}/>}
        {checkable &&
        <Checkbox
          className={showFocus ? 'ring-checkbox_focus' : ''}
          checked={selected}
          onFocus={this.onCheckboxFocus}
          onChange={this.onCheckboxChange}
          tabIndex="-1"
        />}
      </div>
    );

    const cells = columns.map((column, index) => {
      const getValue = column.getValue || (() => item[column.id]);
      const value = getValue(item, column);
      const cellClasses = classNames({[style.cellRight]: column.rightAlign}, column.className);

      return (
        <Cell key={index} className={cellClasses}>
          {index === 0 && (draggable || selectable) && metaColumn}
          {value}
        </Cell>
      );
    });

    return (
      <tr
        ref="row"
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
