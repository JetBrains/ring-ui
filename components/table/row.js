/* eslint-disable react/jsx-max-props-per-line */

import 'core-js/modules/es6.number.is-finite';
import React, {PropTypes} from 'react';
import RingComponent from '../ring-component/ring-component';
import classNames from 'classnames';

import Cell from './cell';
import Checkbox from '../checkbox/checkbox';

import style from './table.css';

export default class Row extends RingComponent {
  static propTypes = {
    className: PropTypes.string,
    item: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    selectable: PropTypes.bool,
    focused: PropTypes.bool,
    selected: PropTypes.bool,
    onFocus: PropTypes.func,
    onHover: PropTypes.func,
    onSelect: PropTypes.func
  }

  static defaultProps = {
    selectable: true,
    focused: false,
    selected: false,
    onFocus: () => {},
    onHover: () => {},
    onSelect: () => {}
  }

  onFocus = () => {
    const {selectable, item, focused, onFocus} = this.props;
    if (selectable && !focused) {
      onFocus(item);
    }
  }

  onMouseEnter = () => {
    const {item, onHover} = this.props;
    onHover(item);
  }

  onClick = e => {
    const {selectable, item, onSelect} = this.props;
    if (selectable && e.shiftKey) {
      onSelect(item);
    }
  }

  onCheckboxChange = () => {
    const {item, onSelect} = this.props;
    onSelect(item);
  }

  onCheckboxFocus = () => {
    this.refs.row.focus();
  }

  didUpdate(prevProps) {
    const {props: {focused}, refs: {row}} = this;
    if (focused && !prevProps.focused) {
      row.focus();
    } else if (!focused && prevProps.focused) {
      row.blur();
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
            onChange={this.onCheckboxChange}
            onFocus={this.onCheckboxFocus}
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
        onFocus={this.onFocus}
        onMouseMove={this.onMouseEnter}
        onClick={this.onClick}
      >{cells}</tr>
    );
  }
}
