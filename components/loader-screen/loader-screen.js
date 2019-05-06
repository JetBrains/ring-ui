import React, {PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Loader from '../loader/loader';

import styles from './loader-screen.css';

/**
 * @name Loader Screen
 */
export default class LoaderScreen extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    message: PropTypes.string
  };

  render() {
    const {message, className, containerClassName, ...restProps} = this.props;

    const containerClasses = classNames(containerClassName, styles.loaderScreen);

    const loaderClasses = classNames(className, styles.loader, {
      [styles.loaderWithoutSpacing]: !message
    });

    return (
      <div className={containerClasses}>
        <Loader
          {...restProps}
          message={message}
          className={loaderClasses}
        />
      </div>
    );
  }
}
