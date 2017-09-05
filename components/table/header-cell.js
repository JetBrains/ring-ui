import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  UnsortedIcon as SortableIcon,
  ChevronUpIcon as SortedUpIcon,
  ChevronDownIcon as SortedDownIcon
} from '../icon';

import style from './table.css';

const ICON_SIZE = 10;

export default class HeaderCell extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    column: PropTypes.object.isRequired,
    onSort: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool
  };

  static defaultProps = {
    onSort: () => {}
  };

  onClick = () => {
    if (this.sortable) {
      const {column, onSort, sortOrder} = this.props;
      onSort({column, order: !(this.sorted && sortOrder)});
    }
  };

  onChildrenClick(e) {
    e.stopPropagation();
  }

  render() {
    const {className, column, onSort, sortKey, sortOrder, ...restProps} = this.props; // eslint-disable-line no-unused-vars

    this.sortable = column.sortable === true;
    this.sorted = sortKey === column.id;

    let Icon = SortableIcon;

    if (this.sorted) {
      Icon = sortOrder ? SortedUpIcon : SortedDownIcon;
    }

    const classes = classNames(className, {
      [style.headerCell]: true,
      [style.headerCellSortable]: this.sortable,
      [style.headerCellSorted]: this.sorted,
      [style.cellRight]: column.rightAlign
    });

    return (
      <th
        {...restProps}
        className={classes}
        onClick={this.onClick}
        data-test="ring-table-header-cell"
      >
        <span onClick={this.onChildrenClick}>{this.props.children}</span>

        {column.getHeaderValue ? column.getHeaderValue() : column.title}

        {this.sortable && <span className={style.sorter}>
          <Icon className={style.icon} size={ICON_SIZE}/>
        </span>}
      </th>
    );
  }
}
