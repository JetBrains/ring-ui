import {Children, cloneElement, PureComponent, HTMLAttributes, isValidElement} from 'react';
import {createPortal} from 'react-dom';
import classNames from 'classnames';

import styles from './container.css';

/**
 * @name Alert Container
 * @description Displays a stack of alerts on top of the page.
 * @extends {PureComponent}
 */

export type AlertContainerProps = HTMLAttributes<HTMLDivElement>;

export default class Alerts extends PureComponent<AlertContainerProps> {
  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames(styles.alertContainer, className);
    const show = Children.count(children) > 0;

    if (!show) {
      return null;
    }

    return createPortal(
      <div data-test="alert-container" className={classes} aria-live="polite" {...restProps}>
        {Children.map(children, child => {
          if (!isValidElement(child)) {
            return child;
          }

          const alertClassNames = classNames(styles.alertInContainer, child.props.className);

          return cloneElement(child, {
            className: alertClassNames,
          } as Partial<unknown>);
        })}
      </div>,
      document.body,
    );
  }
}
