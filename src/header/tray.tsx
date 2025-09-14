import {Children, Component, type HTMLAttributes, type ReactNode} from 'react';
import classNames from 'classnames';

import styles from './header.css';

const wrapChild = (child: ReactNode) => child && <div className={styles.trayItem}>{child}</div>;

export default class Tray extends Component<HTMLAttributes<HTMLElement>> {
  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames(styles.tray, className);

    return (
      <div {...restProps} className={classes}>
        {Children.map(children, wrapChild)}
      </div>
    );
  }
}
