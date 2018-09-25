import React, {PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Loader from '../loader/loader';

import styles from './loader-screen.css';

/**
 * @name Loader Screen
 * @category Components
 * @tags Ring UI Language
 * @constructor
 * @description Displays a large animated loader with an optional caption. Typical use cases: page loading animation, major action animation.
 * @extends {ReactComponent}
 * @example
    <example name="Loader Screen">
     <file name="index.html" disable-auto-size>
       <div id="loader-screen"></div>
     </file>

     <file name="index.js" webpack="true">
       import React from 'react';
       import {render} from 'react-dom';
       import LoaderScreen from '@jetbrains/ring-ui/components/loader-screen/loader-screen';

       render(
         <LoaderScreen/>,
         document.getElementById('loader-screen')
       );
     </file>
   </example>
   <example name="Loader Screen with a message">
     <file name="index.html" disable-auto-size>
       <div id="loader-screen"></div>
     </file>

     <file name="index.js" webpack="true">
       import React from 'react';
       import {render} from 'react-dom';
       import LoaderScreen from '@jetbrains/ring-ui/components/loader-screen/loader-screen';

       render(
         <LoaderScreen message="Loading..."/>,
         document.getElementById('loader-screen')
       );
     </file>
   </example>
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
