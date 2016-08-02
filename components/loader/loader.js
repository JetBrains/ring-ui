import React from 'react';
import RingComponent from '../ring-component/ring-component';

import LoaderCore from './loader__core';

/**
 * @name Loader
 * @constructor
 * @extends {ReactComponent}
 * @example
 <example name="Loader">
   <file name="index.html">
     <div id="loader1" class="loader-container"></div>
     <div id="loader2" class="loader-container loader-container_black"></div>
   </file>

   <file name="index.js" webpack="true">
     require('./index.scss');
     var render = require('react-dom').render;
     var Loader = require('ring-ui/components/loader/loader');

     render(Loader.factory({message: 'Loading...'}), document.getElementById('loader1'));

     render(Loader.factory({message: 'Loading...'}), document.getElementById('loader2'));
   </file>
   <file name="index.scss">
    .loader-container {
      padding: 32px;

      &_black {
        background-color: black;

        & .ring-loader__text {
          color: #FFF;
        }
      }
    }
   </file>
 </example>
 */

export default class Loader extends RingComponent {
  didMount() {
    this.loader = new LoaderCore(this.refs.loaderContainer, this.props);
  }

  willUnmount() {
    this.loader.destroy();
  }

  render() {
    const {message, size, colors, ...restProps} = this.props; // eslint-disable-line no-unused-vars
    return (
      <div
        {...restProps}
        ref="loaderContainer"
      >
      </div>
    );
  }
}
