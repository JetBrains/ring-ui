/* eslint-disable react/jsx-max-props-per-line */

import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import Icon from '../icon/icon';
import sorteableIcon from 'jetbrains-icons/caret-down.svg';
import sortedUpIcon from 'jetbrains-icons/caret-up.svg';
import sortedDownIcon from 'jetbrains-icons/caret-down.svg';

import style from './table.css';

export default class HeaderCell extends Component {
  static propTypes = {
    className: PropTypes.string,
    tiny: PropTypes.bool,
    column: PropTypes.object.isRequired,
    onSort: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool
  }

  static defaultProps = {
    tiny: false,
    onSort: () => {}
  }

  render() {
    const {className, tiny, column, onSort, sortKey, sortOrder, ...restProps} = this.props; // eslint-disable-line no-unused-vars

    this.sortable = column.sortable === true;
    this.sorted = sortKey === column.id;

    const iconSize = tiny ? Icon.Size.Size14 : Icon.Size.Size16;
    let iconGlyph = sorteableIcon;

    if (this.sorted) {
      iconGlyph = sortOrder ? sortedUpIcon : sortedDownIcon;
    }


    const classes = classNames(className, {
      [style.headerCell]: true,
      [style.headerCellSortable]: this.sortable,
      [style.headerCellSorted]: this.sorted
    });

    return (
      <th {...restProps} className={classes} onClick={::this.onClick}>
        {column.getHeaderValue ? column.getHeaderValue() : column.title}

        {this.sortable && <span className={style.sorter}>
          <Icon className={style.icon} glyph={iconGlyph} size={iconSize}/>
        </span>}
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
