import {ChangeEventHandler, PureComponent, SyntheticEvent} from 'react';
import classNames from 'classnames';

import Checkbox from '../checkbox/checkbox';

import getUID from '../global/get-uid';

import style from './table.css';
import HeaderCell, {Column, SortParams} from './header-cell';

export interface HeaderProps {
  columns: readonly Column[];
  selectable: boolean;
  draggable: boolean;
  checked: boolean;
  sticky: boolean;
  topStickOffset: string;
  onSort: (params: SortParams) => void;
  onCheckboxChange: ChangeEventHandler<HTMLInputElement>;
  sortKey: string;
  sortOrder: boolean;
  caption?: string | null | undefined;
  checkboxDisabled?: boolean | undefined;
}

export default class Header extends PureComponent<HeaderProps> {
  static defaultProps = {
    selectable: true,
    draggable: false,
    checked: true,
    sticky: true,
    topStickOffset: '0px',
    onSort: () => {},
    onCheckboxChange: () => {},
    sortKey: 'id',
    sortOrder: true,
  };

  id = getUID('table-header-');

  onCheckboxFocus = (event: SyntheticEvent<HTMLElement>) => {
    event.currentTarget.blur();
  };

  createCells(widths = []) {
    const {selectable, draggable, columns, checked, checkboxDisabled, onCheckboxChange, onSort, sortKey, sortOrder} =
      this.props;

    const metaColumnClasses = classNames(style.metaColumn, style.headerMetaColumn);

    const metaColumn = (
      <div className={metaColumnClasses}>
        {selectable && (
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
      const columnStyle = widths[index] ? {width: widths[index]} : undefined;
      const props = {column, onSort, sortKey, sortOrder, style: columnStyle};

      return (
        <HeaderCell key={column.id} data-test={column.id} {...props}>
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
          [style.subHeaderSticky]: sticky,
        })}
      >
        {caption && (
          <tr data-test="ring-table-header-row">
            <th
              className={classNames(style.headerCell, style.caption)}
              colSpan={regularCells.length + 1}
              data-test="ring-table-header-cell"
            >
              {caption}
            </th>
          </tr>
        )}

        <tr className={style.subHeader} data-test="ring-table-header-row">
          {regularCells}
        </tr>
      </thead>
    );
  }
}

export type HeaderAttrs = React.JSX.LibraryManagedAttributes<typeof Header, HeaderProps>;
