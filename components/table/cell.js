/* eslint-disable react/jsx-max-props-per-line */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './table.css';

export default class Cell extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string
  }

  render() {
    const classes = classNames(style.cell, this.props.className);
    return (
      <td
        {...this.props}
        className={classes}
        data-test="ring-table-cell"
      >{this.props.children}</td>
    );
  }
}
