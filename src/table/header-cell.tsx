import React, {PureComponent, ReactNode, SyntheticEvent, ThHTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import sortableIcon from '@jetbrains/icons/unsorted-10px';
import sortedIcon from '@jetbrains/icons/chevron-10px';

import Icon from '../icon/icon';
import dataTests from '../global/data-tests';

import style from './table.css';

export interface Column<T = never> {
  id: string & keyof T
  sortable?: boolean | null | undefined
  className?: string | null | undefined
  headerClassName?: string | null | undefined
  rightAlign?: boolean | null | undefined
  getHeaderValue?: (() => ReactNode) | null | undefined
  title?: ReactNode
  getValue?: ((item: T, column: Column) => ReactNode) | null | undefined
  getDataTest?: ((item: T, column: Column) => string) | null | undefined
}

export interface SortParams<T> {
  column: Column<T>
  order: boolean
}

export interface HeaderCellProps<T> extends ThHTMLAttributes<HTMLTableHeaderCellElement> {
  column: Column<T>
  onSort: (params: SortParams<T>) => void
  sortKey?: string | null | undefined
  sortOrder?: boolean | null | undefined
  'data-test'?: string | null | undefined
}

export default class HeaderCell<T> extends PureComponent<HeaderCellProps<T>> {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    column: PropTypes.object.isRequired,
    onSort: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool,
    'data-test': PropTypes.string
  };

  static defaultProps = {
    onSort: () => {}
  };

  sortable?: boolean;
  sorted?: boolean;
  onClick = () => {
    if (this.sortable) {
      const {column, onSort, sortOrder} = this.props;
      onSort({column, order: !(this.sorted && sortOrder)});
    }
  };

  onChildrenClick(e: SyntheticEvent) {
    e.stopPropagation();
  }

  render() {
    const {
      className, column, onSort, sortKey, sortOrder,
      'data-test': dataTest, ...restProps
    } = this.props;

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
        data-test={dataTests('ring-table-header-cell', dataTest)}
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
