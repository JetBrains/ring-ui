import {type HTMLAttributes, PureComponent} from 'react';
import classNames from 'classnames';

import styles from './panel.css';

// TODO after RG-2716 add a comment - Use Dialog.Footer instead (or something similar)
/**
 * @name Panel
 * @deprecated Will be removed in Ring UI 9.0. No longer maintained; implement your own solution if needed.
 */
export default class Panel extends PureComponent<HTMLAttributes<HTMLElement>> {
  render() {
    const {className, children, ...props} = this.props;
    const classes = classNames(styles.panel, className);
    return (
      <div data-test='ring-panel' {...props} className={classes}>
        {children}
      </div>
    );
  }
}
