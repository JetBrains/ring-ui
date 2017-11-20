import React, {PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Loader from '../loader/loader';

import './loader-screen.scss';

/**
 * @name Loader Screen
 * @category Components
 * @constructor
 * @description Displays a large animated loader and an (optional) text. Use cases: while the site is loading, during major actions.
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
    message: PropTypes.string
  };

  render() {
    const {message} = this.props;
    const classes = classNames(
      'ring-loader-screen__loader',
      {
        'ring-loader-screen__loader_without-spacings': !message
      }
    );

    return (
      <div className="ring-loader-screen">
        <Loader
          {...this.props}
          className={classes}
        />
      </div>
    );
  }
}
