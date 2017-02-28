import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import Icon from '../icon/icon';
import {Size, Color} from '../icon/icon__constants';

import styles from './error-message.css';


/**
 * @name Error Message
 * @category Components
 * @framework React
 * @constructor
 * @description Displays an error message. Component centered both vertically and horisontally inside parent container.
 * @example-file ./error-message.examples.html
 */

export default class ErrorMessage extends Component {
  static propTypes = {
    icon: PropTypes.string,
    code: PropTypes.string,
    message: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string
  };


  render() {
    const {className, icon, code, message, description, children} = this.props;
    const classes = classNames(styles.errorMessage, className);

    return (
      <div className={classes}>
        {icon && (
          <Icon className={styles.icon}
            glyph={icon}
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
