import React from 'react';
import DefaultRenderer from './renderer-default';
import Cell from './cell';
import style from './table.css';

export default class NumberRenderer extends DefaultRenderer {
  render() {
    const {item, column} = this.props;
    const value = item[column.id];
    return <Cell className={style.cellRight}>{value}</Cell>;
  }
}
