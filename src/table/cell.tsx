import {PureComponent, TdHTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import style from './table.css';

export interface CellProps extends TdHTMLAttributes<HTMLTableDataCellElement> {
  'data-test'?: string | null | undefined
}

export default class Cell extends PureComponent<CellProps> {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    'data-test': PropTypes.string
  };

  render() {
    const classes = classNames(style.cell, this.props.className);
    return (
      <td
        {...this.props}
        className={classes}
        data-test={dataTests('ring-table-cell', this.props['data-test'])}
      >{this.props.children}</td>
    );
  }
}
