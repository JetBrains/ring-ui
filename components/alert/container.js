import React, {Children, cloneElement, PureComponent} from 'react';
import {createPortal} from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './container.css';

/**
 * @name Alert Container
 * @description Displays a stack of alerts on top of the page.
 * @extends {PureComponent}
 */

export default class Alerts extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames(styles.alertContainer, className);
    const show = Children.count(children) > 0;

    if (!show) {
      return null;
    }

    return createPortal(
      <div
        data-test="alert-container"
        className={classes}
        aria-live="polite"
        {...restProps}
      >
        {Children.map(children, child => {
          const alertClassNames = classNames(styles.alertInContainer, child.props.className);

          return cloneElement(child, {
            className: alertClassNames
          });
        })}
      </div>,
      document.body
    );
  }
}
