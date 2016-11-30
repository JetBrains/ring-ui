/* eslint-disable react/jsx-max-props-per-line */

import 'core-js/modules/es6.number.is-finite';
import React, {PropTypes} from 'react';
import RingComponent from '../ring-component/ring-component';
import classNames from 'classnames';

import DefaultRenderer from './renderer-default';
import NumberRenderer from './renderer-number';
import CheckboxRenderer from './renderer-checkbox';
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
    onSelect: PropTypes.func
  }

  static defaultProps = {
    selectable: true,
    focused: false,
    selected: false,
    onFocus: () => {},
    onSelect: () => {}
  }

  onFocus = () => {
    const {selectable, item, focused, onFocus} = this.props;
    if (selectable && !focused) {
      onFocus(item);
    }
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
    const {item, columns, selectable, selected} = this.props;

    const classes = classNames(this.props.className, {
      [style.row]: true,
      [style.rowSelected]: selected
    });

    const cells = [];

    if (selectable) {
      const checkboxCell = (
        <CheckboxRenderer key="checkbox">
          <Checkbox
            checked={selected}
            onChange={this.onCheckboxChange}
            onFocus={this.onCheckboxFocus}
            tabIndex="-1"
          />
        </CheckboxRenderer>
      );
      cells.push(checkboxCell);
    }

    columns.map((column, key) => {
      const getValue = column.getValue || (() => item[column.id]);
      const value = getValue(item, column);

      let Renderer = column.renderer;

      if (!Renderer) {
        if (Number.isFinite(value)) {
          Renderer = NumberRenderer;
        } else {
          Renderer = DefaultRenderer;
        }
      }

      /*let gap = 0;
      if (column.groupable) {
        gap = item.__level * 10;
      }

      const style = {
        paddingLeft: `${gap + 10}px`
      };*/

      cells.push(<Renderer key={key}>{value}</Renderer>);
    });

    return (
      <tr
        ref="row"
        className={classes}
        tabIndex="0"
        onFocus={this.onFocus}
        onClick={this.onClick}
      >{cells}</tr>
    );
  }
}
