import React, {PureComponent, HTMLAttributes} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './button-set.css';

/**
 * @name Button Set
 */
export default class ButtonSet extends PureComponent<HTMLAttributes<HTMLElement>> {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const classes = classNames(styles.buttonSet, this.props.className);
    return (
      <div
        {...this.props}
        className={classes}
      >
        {this.props.children}
      </div>
    );
  }
}
