import {Component, HTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './grid.css';

/**
 * @name Grid
 */

export class Grid extends Component<HTMLAttributes<HTMLDivElement>> {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames(styles['container-fluid'], className);

    return (
      <div
        {...restProps}
        className={classes}
      >
        {children}
      </div>
    );
  }
}

export {default as Row} from './row';
export {default as Col} from './col';
