import React from 'react';
import RingComponent from '../ring-component/ring-component';
import classNames from 'classnames';

import style from './table.css';

export default class Cell extends RingComponent {
  render() {
    const classes = classNames(
      style.cell,
      this.props.className
    );

    return (
      <td className={classes}>
        {this.props.children}
      </td>
    );
  }
}
