import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import sortableIcon from '@jetbrains/icons/unsorted-10px.svg';
import sortedIcon from '@jetbrains/icons/chevron-10px.svg';

import Icon from '../icon';

import style from './table.css';

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

    const glyph = this.sorted ? sortedIcon : sortableIcon;

    const classes = classNames(className, column.headerClassName, {
      [style.headerCell]: true,
      [style.headerCellSortable]: this.sortable,
      [style.headerCellSorted]: this.sorted,
      [style.sortedUp]: sortOrder && this.sorted,
      [style.cellRight]: column.rightAlign
    });

    return (
      <th
        {...restProps}
        className={classes}
        onClick={this.onClick}
        data-test="ring-table-header-cell"
      >
        {/* onClick only used to stop propagation */}
        <span onClick={this.onChildrenClick} role="presentation">{this.props.children}</span>

        {column.getHeaderValue ? column.getHeaderValue() : column.title}

        {this.sortable && (
          <span className={style.sorter}>
            <Icon glyph={glyph} className={style.icon}/>
          </span>
        )}
      </th>
    );
  }
}
