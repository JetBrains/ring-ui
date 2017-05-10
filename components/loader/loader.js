import React from 'react';

import RingComponent from '../ring-component/ring-component';

import LoaderCore from './loader__core';

/**
 * @name Loader
 * @category Components
 * @constructor
 * @description Displays a large animated loader and an (optional) text. Use cases: while the site is loading, during major actions.
 * @extends {ReactComponent}
 * @example
    <example name="Loader">
     <file name="index.html">
       <div id="loader1" class="loader-container"></div>
       <div id="loader2" class="loader-container loader-container_black"></div>
     </file>

     <file name="index.js" webpack="true">
       import {render} from 'react-dom';
       import Loader from 'ring-ui/components/loader/loader';

       render(Loader.factory({message: 'Loading...'}), document.getElementById('loader1'));

       render(Loader.factory({message: 'Loading...'}), document.getElementById('loader2'));
     </file>
     <file name="index.css">
       body {
          margin: 0;
       }

       :global(.loader-container) {
         padding: 32px;
       }
       :global(.loader-container_black) {
         background-color: black;
       }

       :global(.loader-container_black) :global(.ring-loader__text) {
         color: #FFF;
       }
     </file>
    </example>
 */

export default class Loader extends RingComponent {
  willUnmount() {
    this.loader.destroy();
  }

  initLoader = el => {
    if (el) {
      this.loader = new LoaderCore(el, this.props);
    }
  };

  render() {
    const {message, size, colors, ...restProps} = this.props; // eslint-disable-line no-unused-vars
    return (
      <div
        {...restProps}
        ref={this.initLoader}
      />
    );
  }
}
