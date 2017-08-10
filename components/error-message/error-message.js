import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {Color, Size} from '../icon/icon__constants';

import styles from './error-message.css';


/**
 * @name Error Message
 * @category Components
 * @framework React
 * @constructor
 * @description Displays an error message centered both vertically and horizontally inside the parent container.
 * @example-file ./error-message.examples.html
 */

export default class ErrorMessage extends Component {
  static propTypes = {
    icon: PropTypes.func,
    code: PropTypes.string,
    message: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string
  };


  render() {
    const {className, icon, code, message, description, children} = this.props;
    const Icon = icon;
    const classes = classNames(styles.errorMessage, className);

    return (
      <div className={classes}>
        {Icon && (
          <Icon
            className={styles.icon}
            size={Size.Size64}
            color={Color.GRAY}
          />
        )}
        <div className={styles.content}>
          <div className={styles.title}>
            {code && `${code}:`} {message}
          </div>
          {description && (
            <div className={styles.description}>
              {description}
            </div>
          )}
          {children}
        </div>
      </div>
    );
  }
}
