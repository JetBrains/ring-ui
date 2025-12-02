import {Component, type ReactNode} from 'react';
import classNames from 'classnames';

import Icon, {type IconType} from '../icon/icon';
import {Size} from '../icon/icon.constants';
import dataTests from '../global/data-tests';

import styles from './error-message.css';

/**
 * @deprecated Will be removed in Ring UI 9.0. No longer maintained; implement your own solution if needed.
 */
export interface ErrorMessageProps {
  children?: ReactNode;
  icon?: string | IconType | null | undefined;
  code?: string | null | undefined;
  message?: string | null | undefined;
  description?: string | null | undefined;
  className?: string | null | undefined;
  'data-test'?: string | null | undefined;
}

/**
 * @name Error Message
 * @deprecated Will be removed in Ring UI 9.0. No longer maintained; implement your own solution if needed.
 */
export default class ErrorMessage extends Component<ErrorMessageProps> {
  render() {
    const {className, icon, code, message, description, children, 'data-test': dataTest} = this.props;
    const classes = classNames(styles.errorMessage, className);

    return (
      <div className={classes} data-test={dataTests('ring-error-message', dataTest)}>
        {icon && <Icon className={styles.icon} glyph={icon} size={Size.Size64} suppressSizeWarning />}
        <div className={styles.content}>
          <div className={styles.title} data-test='ring-error-message-title'>
            {code && `${code}:`} {message}
          </div>
          {description && <div className={styles.description}>{description}</div>}
          {children}
        </div>
      </div>
    );
  }
}
