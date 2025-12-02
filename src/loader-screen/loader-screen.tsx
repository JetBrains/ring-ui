import {PureComponent} from 'react';
import classNames from 'classnames';

import Loader, {type LoaderProps} from '../loader/loader';

import styles from './loader-screen.css';

export interface LoaderScreenProps extends LoaderProps {
  containerClassName?: string | null | undefined;
}

/**
 * @name Loader Screen
 * @deprecated Will be removed in Ring UI 9.0. Use Loader with your own layout implementation.
 */
export default class LoaderScreen extends PureComponent<LoaderScreenProps> {
  render() {
    const {message, className, containerClassName, ...restProps} = this.props;

    const containerClasses = classNames(containerClassName, styles.loaderScreen);

    const loaderClasses = classNames(className, styles.loader, {
      [styles.loaderWithoutSpacing]: !message,
    });

    return (
      <div className={containerClasses}>
        <Loader {...restProps} message={message} className={loaderClasses} />
      </div>
    );
  }
}
