import React, {PropTypes} from 'react';
import RingComponent from '../ring-component/ring-component';
import classNames from 'classnames';

import style from './table.css';

export default class Cell extends RingComponent {
  static propTypes = {
    children: PropTypes.any.isRequired,
    className: PropTypes.string
  }

  render() {
    const classes = classNames(
      style.cell,
      this.props.className
    );

    return <td className={classes}>{this.props.children}</td>;
  }
}
