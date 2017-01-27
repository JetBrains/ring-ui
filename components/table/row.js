/* eslint-disable react/jsx-max-props-per-line */

import 'core-js/modules/es6.number.is-finite';
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import focusSensorHOC from '../global/focus-sensor-hoc';

import Cell from './cell';
import Checkbox from '../checkbox/checkbox';

import style from './table.css';

class Row extends Component {
  static propTypes = {
    className: PropTypes.string,
    item: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    selectable: PropTypes.bool,
    focused: PropTypes.bool,
    selected: PropTypes.bool,
    onHover: PropTypes.func,
    onSelect: PropTypes.func,
    onFocusRestore: PropTypes.func
  }

  static defaultProps = {
    selectable: true,
    focused: false,
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
    const {item, columns, selectable, selected, focused} = this.props;

    const classes = classNames(this.props.className, {
      [style.row]: true,
      [style.rowSelected]: selected
    });

    const cells = [];

    if (selectable) {
      const checkboxCell = (
        <Cell key="checkbox" className={style.cellCheckbox}>
          <Checkbox
            className={focused ? 'ring-checkbox_focus' : ''}
            checked={selected}
            onFocus={this.onCheckboxFocus}
            onChange={this.onCheckboxChange}
            tabIndex="-1"
          />
        </Cell>
      );
      cells.push(checkboxCell);
    }

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
