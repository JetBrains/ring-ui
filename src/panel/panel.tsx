import {HTMLAttributes, PureComponent} from 'react';
import classNames from 'classnames';

import styles from './panel.css';

/**
 * @name Panel
 */
export default class Panel extends PureComponent<HTMLAttributes<HTMLElement>> {
  render() {
    const {className, children, ...props} = this.props;
    const classes = classNames(styles.panel, className);
    return (
      <div data-test="ring-panel" {...props} className={classes}>
        {children}
      </div>
    );
  }
}
