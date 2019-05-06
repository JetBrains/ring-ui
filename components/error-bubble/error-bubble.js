import React, {Children, cloneElement, PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Popup from '../popup/popup';
import {Directions} from '../popup/position';

import styles from './error-bubble.css';
/**
 * @name Error Bubble
 */

export default class ErrorBubble extends PureComponent {
  static propTypes = {
    error: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {children, className, ...restProps} = this.props;

    const errorBubbleClasses = classNames(styles.errorBubble, className);

    return (
      <div className={styles.errorBubbleWrapper}>
        {Children.map(children, child => cloneElement(child, restProps))}

        {restProps.error && (
          <Popup
            className={styles.errorBubblePopup}
            hidden={false}
            attached={false}
            directions={[Directions.RIGHT_CENTER, Directions.RIGHT_BOTTOM, Directions.RIGHT_TOP]}
          >
            <div
              className={errorBubbleClasses}
              data-test="ring-error-bubble"
            >
              {restProps.error}
            </div>
          </Popup>
        )}
      </div>
    );
  }
}

