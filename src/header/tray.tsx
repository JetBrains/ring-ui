import {Children, Component, HTMLAttributes, ReactNode} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './header.css';

const wrapChild = (child: ReactNode) => child && (
  <div className={styles.trayItem}>{child}</div>
);

export default class Tray extends Component<HTMLAttributes<HTMLElement>> {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames(styles.tray, className);

    return (
      <div
        {...restProps}
        className={classes}
      >
        {Children.map(children, wrapChild)}
      </div>
    );
  }
}
