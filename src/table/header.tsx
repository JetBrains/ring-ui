import React, {ChangeEventHandler, PureComponent, ReactNode, SyntheticEvent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Checkbox from '../checkbox/checkbox';

import getUID from '../global/get-uid';

import style from './table.css';
import HeaderCell, {Column, SortParams} from './header-cell';

export interface HeaderProps {
  columns: readonly Column[]
  selectable: boolean
  draggable: boolean
  checked: boolean
  sticky: boolean
  topStickOffset: string
  onSort: (params: SortParams) => void
  onCheckboxChange: ChangeEventHandler<HTMLInputElement>
  sortKey: string
  sortOrder: boolean
  caption?: string | null | undefined
  checkboxDisabled?: boolean | undefined
  maxColSpan?: number
}

declare module 'react-waypoint' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Waypoint {
    interface WaypointProps {
      children?: ReactNode
    }
  }
}

export default class Header extends PureComponent<HeaderProps> {
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


  id = getUID('table-header-');

  onCheckboxFocus = (event: SyntheticEvent<HTMLElement>) => {
    event.currentTarget.blur();
  };


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

    let colSpan = 0;
    return columns.map((column, index) => {
      const columnStyle = widths[index] ? {width: widths[index]} : undefined;
      const props = {column, onSort, sortKey, sortOrder, style: columnStyle};
      colSpan += column.colSpan || 1;
      if (colSpan > (this.props.maxColSpan || Infinity)) {
        return null;
      }

      return (
        <HeaderCell
          key={column.id}
          data-test={column.id}
          colSpan={column.colSpan}
          {...props}
        >
          {index === 0 && (draggable || selectable) && metaColumn}
        </HeaderCell>
      );
    });
  }

  render() {
    const {caption, sticky, topStickOffset} = this.props;

    const regularCells = this.createCells();

    return (
      <thead
        id={this.id}
        data-test="ring-table-header"
        style={{top: topStickOffset}}
        className={classNames({
          [style.tableHead]: true,
          [style.subHeaderSticky]: sticky
        })}
      >
        {caption && (
          <tr data-test="ring-table-header-row">
            <th
              className={classNames(style.headerCell, style.caption)}
              colSpan={regularCells.length + 1}
              data-test="ring-table-header-cell"
            >{caption}</th>
          </tr>
        )}

        <tr
          className={style.subHeader}
          data-test="ring-table-header-row"
        >{regularCells}</tr>
      </thead>
    );
  }
}

export type HeaderAttrs = JSX.LibraryManagedAttributes<typeof Header, HeaderProps>
