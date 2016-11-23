/* eslint-disable react/jsx-max-props-per-line */

import 'core-js/modules/es6.number.is-finite';
import React, {PropTypes} from 'react';
import RingComponent from '../ring-component/ring-component';
import classNames from 'classnames';

import DefaultRenderer from './renderer-default';
import NumberRenderer from './renderer-number';

import style from './table.css';

export default class Row extends RingComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    focused: PropTypes.bool,
    onFocus: PropTypes.func
  }

  render() {
    const {item, columns, focused, onFocus} = this.props;

    const classes = classNames({
      [style.row]: true,
      [style.rowFocused]: focused
    });

    return (
      <tr className={classes} onClick={onFocus}>{
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

          return <Renderer key={key}>{value}</Renderer>;
        })
      }</tr>
    );
  }
}
