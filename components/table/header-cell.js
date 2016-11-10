/* eslint-disable react/jsx-max-props-per-line */

import React, {PropTypes} from 'react';
import RingComponent from '../ring-component/ring-component';
import classNames from 'classnames';

import Icon from '../icon/icon';

import style from './table.css';

export default class HeaderCell extends RingComponent {
  static propTypes = {
    column: PropTypes.object.isRequired,
    onSort: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool
  }

  render() {
    const {column, onSort, sortKey, sortOrder} = this.props;

    this.sortable = true;
    if (column.sortable === false) {
      this.sortable = false;
    }

    let glyph = require('jetbrains-icons/caret-down.svg');
    if (sortKey === column.id && sortOrder) {
      glyph = require('jetbrains-icons/caret-up.svg');
    }

    const size = Icon.Size.Size16;

    const classes = classNames({
      [style.headerCell]: true,
      [style.headerCellSortable]: this.sortable && onSort,
      [style.headerCellSorted]: sortKey === column.id
    });

    return (
      <th className={classes} onClick={::this.onClick}>
        {column.title}
        {this.sortable && onSort ? <Icon className={style.sorter} glyph={glyph} size={size} /> : ''}
      </th>
    );
  }

  onClick() {
    const {column, onSort, sortKey, sortOrder} = this.props;
    if (this.sortable && onSort) {
      onSort(column, !(sortKey === column.id && sortOrder));
    }
  }
}
