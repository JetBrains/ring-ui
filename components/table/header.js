import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Waypoint} from 'react-waypoint';

import Checkbox from '../checkbox/checkbox';

import getUID from '../global/get-uid';

import style from './table.css';
import HeaderCell from './header-cell';

const waypointChild = <tr data-test="ring-table-header-row"/>;

export default class Header extends PureComponent {
  static propTypes = {
    caption: PropTypes.string,
    selectable: PropTypes.bool,
    draggable: PropTypes.bool,
    checked: PropTypes.bool,
    checkboxDisabled: PropTypes.bool,
    sticky: PropTypes.bool,
    topStickOffset: PropTypes.string,
    onCheckboxChange: PropTypes.func,
    columns: PropTypes.array.isRequired,
    onSort: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool
  };

  static defaultProps = {
    selectable: true,
    draggable: false,
    checked: true,
    sticky: true,
    topStickOffset: '0px',
    onSort: () => {},
    onCheckboxChange: () => {},
    sortKey: 'id',
    sortOrder: true
  };

  state = {
    fixed: false,
    headerWidth: null,
    widths: []
  };

  id = getUID('table-header-');

  onCheckboxFocus = event => {
    event.target.blur();
  };

  storeColumnsRowNode = node => {
    if (node) {
      this._columnsRowNode = node;
      this.calculateColumnsWidths(node);
    }
  };

  onScrollIn = () => {
    this.calculateColumnsWidths(this._columnsRowNode);
    this.setState({fixed: false});
  };

  onScrollOut = ({currentPosition}) => {
    if (currentPosition !== 'above') {
      return;
    }
    this.calculateColumnsWidths(this._columnsRowNode);
    this.setState({fixed: true});
  };

  calculateColumnsWidths(columnsRowNode) {
    this.setState({
      headerWidth: columnsRowNode.clientWidth,
      widths: [...columnsRowNode.childNodes].map(column => column.clientWidth)
    });
  }

  createCells(widths = []) {
    const {
      selectable, draggable, columns, checked, checkboxDisabled,
      onCheckboxChange, onSort, sortKey, sortOrder
    } = this.props;

    const metaColumnClasses = classNames(style.metaColumn, style.headerMetaColumn);

    const metaColumn = (
      <div className={metaColumnClasses}>
        {selectable &&
        (
          <Checkbox
            aria-labelledby={this.id}
            disabled={checkboxDisabled}
            checked={checked}
            onChange={onCheckboxChange}
            onFocus={this.onCheckboxFocus}
          />
        )}
      </div>
    );

    return columns.map((column, index) => {
      const columnStyle = widths[index] ? {width: widths[index]} : null;
      const props = {column, onSort, sortKey, sortOrder, style: columnStyle};
      return (
        <HeaderCell
          key={column.id}
          {...props}
        >
          {index === 0 && (draggable || selectable) && metaColumn}
        </HeaderCell>
      );
    });
  }

  render() {
    const {caption, sticky, topStickOffset} = this.props;
    const {fixed, widths, headerWidth} = this.state;

    const regularCells = this.createCells();

    return (
      <thead id={this.id} data-test="ring-table-header" className={style.tableHead}>
        {caption && (
          <tr data-test="ring-table-header-row">
            <th
              className={classNames(style.headerCell, style.caption)}
              colSpan={regularCells.length + 1}
              data-test="ring-table-header-cell"
            >{caption}</th>
          </tr>
        )}

        {sticky &&
        (
          <Waypoint
            topOffset={topStickOffset}
            onEnter={this.onScrollIn}
            onLeave={this.onScrollOut}
          >
            {waypointChild}
          </Waypoint>
        )
        }

        <tr
          className={style.subHeader}
          ref={this.storeColumnsRowNode}
          data-test="ring-table-header-row"
        >{regularCells}</tr>

        {fixed && sticky &&
          (
            <tr
              className={style.subHeaderFixed}
              style={{width: headerWidth, top: topStickOffset}}
              data-test="ring-table-header-row"
            >
              {this.createCells(widths)}
            </tr>
          )
        }
      </thead>
    );
  }
}
