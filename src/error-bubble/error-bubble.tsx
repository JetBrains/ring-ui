import {Children, cloneElement, PureComponent, ReactElement} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Popup from '../popup/popup';

import {Directions} from '../popup/popup.consts';

import styles from './error-bubble.css';

export type ErrorBubbleProps<P> = Partial<P> & {
  className?: string | null | undefined
  children: ReactElement<P> | ReactElement<P>[]
  error?: string | null | undefined
}

/**
 * @name Error Bubble
 */

export default class ErrorBubble<P> extends PureComponent<ErrorBubbleProps<P>> {
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
        {Children.map(children as ErrorBubbleProps<P>['children'], (child: ReactElement<P>) =>
          cloneElement(child, {...child.props, ...restProps}))}
        {restProps.error && (
          <Popup
            trapFocus={false}
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

