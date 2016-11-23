import React from 'react';
import DefaultRenderer from './renderer-default';

import Cell from './cell';
import style from './table.css';

export default class NumberRenderer extends DefaultRenderer {
  render() {
    return <Cell className={style.cellRight}>{this.props.children}</Cell>;
  }
}
