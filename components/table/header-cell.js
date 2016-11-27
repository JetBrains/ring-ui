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
    const {column, sortKey, sortOrder} = this.props;

    this.sortable = column.sortable === true;
    this.sorted = sortKey === column.id;

    const glyph = do {
      if (this.sorted && sortOrder) {
        require('jetbrains-icons/caret-up.svg');
      } else {
        require('jetbrains-icons/caret-down.svg');
      }
    };

    const sorter = (
      <span className={style.sorter}>
        <Icon className={style.icon} glyph={glyph} size={Icon.Size.Size16}/>
      </span>
    );

    const value = column.getHeaderValue ? column.getHeaderValue() : column.title;

    const classes = classNames({
      [style.headerCell]: true,
      [style.headerCellSortable]: this.sortable,
      [style.headerCellSorted]: this.sorted
    });

    return (
      <th className={classes} onClick={::this.onClick}>
        {value}
        {this.sortable ? sorter : ''}
      </th>
    );
  }

  onClick() {
    if (this.sortable) {
      const {column, onSort, sortOrder} = this.props;
      onSort({column, order: !(this.sorted && sortOrder)});
    }
  }
}
