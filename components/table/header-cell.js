/* eslint-disable react/jsx-max-props-per-line */

import React, {PropTypes} from 'react';
import RingComponent from '../ring-component/ring-component';
import classNames from 'classnames';

import Icon from '../icon/icon';

import style from './table.css';

export default class HeaderCell extends RingComponent {
  static propTypes = {
    className: PropTypes.string,
    colSpan: PropTypes.number,
    tiny: PropTypes.bool,
    column: PropTypes.object.isRequired,
    onSort: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool
  }

  static defaultProps = {
    colSpan: 1,
    tiny: false,
    onSort: () => {}
  }

  render() {
    const {colSpan, tiny, column, sortKey, sortOrder} = this.props;

    this.sortable = column.sortable === true;
    this.sorted = sortKey === column.id;

    const iconSize = tiny ? Icon.Size.Size14 : Icon.Size.Size16;

    const iconGlyph = do {
      if (this.sorted && sortOrder) {
        require('jetbrains-icons/caret-up.svg');
      } else {
        require('jetbrains-icons/caret-down.svg');
      }
    };

    const classes = classNames(this.props.className, {
      [style.headerCell]: true,
      [style.headerCellSortable]: this.sortable,
      [style.headerCellSorted]: this.sorted
    });

    return (
      <th className={classes} colSpan={colSpan} onClick={::this.onClick}>
        {column.getHeaderValue ? column.getHeaderValue() : column.title}

        <span className={style.sorter}>
          <Icon className={style.icon} glyph={iconGlyph} size={iconSize}/>
        </span>
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
