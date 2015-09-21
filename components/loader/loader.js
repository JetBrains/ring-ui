import React, { DOM } from 'react';
import classNames from 'classnames';
import RingComponent from 'ring-component/ring-component';
import './loader.scss';

/**
 * @name Loader
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="Loader">
     <file name="index.html">
        <div id="loader"></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var Loader = require('loader/loader');

      render(
        Loader.factory(),
        document.getElementById('loader')
      );
     </file>
   </example>

   <example name="Loader Inline">
     <file name="index.html">
        <div id="loader-inline"></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var Loader = require('loader/loader');

       render(Loader.factory({
         modifier: Loader.Modifier.INLINE
       }), document.getElementById('loader-inline'));
     </file>
   </example>
 */
export default class Loader extends RingComponent {
  /**
   * @enum {number}
   */
  static Modifier = {

    /**
     * A small spinner suited for using inline with body text (12px)
     */
    INLINE: 'ring-loader_inline'
  };

  static defaultProps = {
    modifier: ''
  };

  render() {
    let classes = classNames(
      'ring-loader',
      this.props.modifier,
      this.props.className
    );

    return DOM.div(Object.assign({}, this.props, {
      className: classes
    }));
  }
}
