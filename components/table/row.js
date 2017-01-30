/* eslint-disable react/jsx-max-props-per-line */

import 'core-js/modules/es6.number.is-finite';
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {sortableHandle} from 'react-sortable-hoc';

import focusSensorHOC from '../global/focus-sensor-hoc';
import dragIcon from 'jetbrains-icons/move.svg';

import Cell from './cell';
import Checkbox from '../checkbox/checkbox';
import Icon from '../icon/icon';

import style from './table.css';

const DragHandle = sortableHandle(() => { // eslint-disable-line arrow-body-style
  return (
    <div className={style.dragHandle}>
      <Icon
        className={style.clear}
        glyph={dragIcon}
        size={Icon.Size.Size14}
      />
    </div>
  );
});

class Row extends Component {
  static propTypes = {
    className: PropTypes.string,
    item: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    selectable: PropTypes.bool,
    focused: PropTypes.bool,
    draggable: PropTypes.bool,
    selected: PropTypes.bool,
    onHover: PropTypes.func,
    onSelect: PropTypes.func,
    onFocusRestore: PropTypes.func
  }

  static defaultProps = {
    selectable: true,
    focused: false,
    draggable: false,
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
    const {item, columns, selectable, selected, focused, draggable} = this.props;

    const classes = classNames(this.props.className, {
      [style.row]: true,
      [style.rowSelected]: selected
    });

    const cells = [
      <Cell key="meta" className={style.metaColumn}>
        {draggable && <DragHandle/>}
        {selectable &&
        <Checkbox
          className={focused ? 'ring-checkbox_focus' : ''}
          checked={selected}
          onFocus={this.onCheckboxFocus}
          onChange={this.onCheckboxChange}
          tabIndex="-1"
        />}
      </Cell>
    ];

    columns.map((column, key) => {
      const getValue = column.getValue || (() => item[column.id]);
      const value = getValue(item, column);

      /*let gap = 0;
      if (column.groupable) {
        gap = item.__level * 10;
      }

      const style = {
        paddingLeft: `${gap + 10}px`
      };*/

      const cellClasses = classNames({[style.cellRight]: Number.isFinite(value)});
      cells.push(<Cell key={key} className={cellClasses}>{value}</Cell>);
    });

    return (
      <tr
        ref="row"
        className={classes}
        tabIndex="0"
        onMouseMove={this.onMouseEnter}
        onClick={this.onClick}
      >{cells}</tr>
    );
  }
}

export default focusSensorHOC(Row);
