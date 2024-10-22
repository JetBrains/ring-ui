import {PureComponent} from 'react';
import classNames from 'classnames';

import Loader, {LoaderProps} from '../loader/loader';

import styles from './loader-screen.css';

export interface LoaderScreenProps extends LoaderProps {
  containerClassName?: string | null | undefined;
}

/**
 * @name Loader Screen
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
