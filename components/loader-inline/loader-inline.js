import React from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './loader-inline.scss';

/**
 * @name LoaderInline
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="Loader Inline">
     <file name="index.html">
        <div id="loader-inline"></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var Loader = require('ring-ui/components/loader-inline/loader-inline');

       render(Loader.factory(), document.getElementById('loader-inline'));
     </file>
   </example>
 */

export default class LoaderInline extends RingComponent {
  render() {
    let classes = classNames(
      'ring-loader-inline',
      this.props.className
    );

    return (
      <div
        {...this.props}
        className={classes}
      />
    );
  }
}
