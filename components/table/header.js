/* eslint-disable react/jsx-max-props-per-line */

import React, {PureComponent, PropTypes} from 'react';
import classNames from 'classnames';
import Waypoint from 'react-waypoint';

import style from './table.css';

import HeaderCell from './header-cell';
import Checkbox from '../checkbox/checkbox';

export default class Header extends PureComponent {
  static propTypes = {
    caption: PropTypes.string,
    selectable: PropTypes.bool,
    checked: PropTypes.bool,
    sticky: PropTypes.bool,
    onCheckboxChange: PropTypes.func,
    columns: PropTypes.array.isRequired,
    onSort: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool
  }

  static defaultProps = {
    selectable: true,
    checked: true,
    sticky: true,
    onSort: () => {},
    onCheckboxChange: () => {},
    sortKey: 'id',
    sortOrder: true
  }

  state = {
    fixed: false,
    headerWidth: null,
    widths: []
  };

  onCheckboxFocus = event => {
    event.target.blur();
  }

  storeColumnsRowNode = node => {
    this._columnsRowNode = node;
    this.calculateColumnsWidths(node);
  }

  onScrollIn = () => {
    this.setState({fixed: false});
  }

  onScrollOut = () => {
    this.setState({fixed: true});
  }

  calculateColumnsWidths(columnsRowNode) {
    this.setState({
      headerWidth: columnsRowNode.clientWidth,
      widths: Array.from(columnsRowNode.childNodes).map(column => column.clientWidth)
    });
  }

  createCells(widths = []) {
    const {selectable, caption, columns, checked, onCheckboxChange, onSort, sortKey, sortOrder} = this.props;

    const headerCells = [
      <th key="meta" className={classNames(style.headerCell, style.metaColumn)}>
        {selectable && !caption &&
        <Checkbox
          checked={checked}
          onChange={onCheckboxChange}
          onFocus={this.onCheckboxFocus}
        />}
      </th>
    ];

    columns.map((column, index) => {
      const columnStyle = widths[index + 1] ? {width: widths[index + 1]} : null;
      const props = {key: index, column, onSort, sortKey, sortOrder, style: columnStyle};
      if (caption) {
        if (selectable && index === 0) {
          props.colSpan = 2;
        }
      }
      headerCells.push(<HeaderCell {...props}/>);
    });

    return headerCells;
  }

  render() {
    const {caption, sticky} = this.props;
    const {fixed, widths, headerWidth} = this.state;

    const fixedHeaderClassName = classNames(style.subHeader, style.subHeaderFixed);

    const regularCells = this.createCells();

    return (
      <thead>
        {sticky &&
          <Waypoint
            onEnter={this.onScrollIn}
            onLeave={this.onScrollOut}
          >
            <tr/>
          </Waypoint>
        }

        {caption && <tr className={style.header}>
          <th className={classNames(style.headerCell, style.caption)} colSpan={regularCells.length + 1}>{caption}</th>
        </tr>}

        <tr className={style.subHeader} ref={this.storeColumnsRowNode}>{regularCells}</tr>

        {fixed && sticky &&
          <tr
            className={fixedHeaderClassName}
            style={{width: headerWidth}}
          >
            {this.createCells(widths)}
          </tr>
        }
      </thead>
    );
  }
}
