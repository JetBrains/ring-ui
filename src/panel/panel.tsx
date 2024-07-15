import {HTMLAttributes, PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './panel.css';

/**
 * @name Panel
 */
export default class Panel extends PureComponent<HTMLAttributes<HTMLElement>> {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {className, children, ...props} = this.props;
    const classes = classNames(styles.panel, className);
    return (
      <div
        {...props}
        className={classes}
      >
        {children}
      </div>
    );
  }
}
