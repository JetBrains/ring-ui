import React from 'react';
import classNames from 'classnames';
import RingComponent from 'ring-component/ring-component';
import './textarea.scss';

/**
 * @name Textarea
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="Textarea">
     <file name="index.html">
       <div id="textarea"></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var Textarea = require('textarea/textarea');

       render(
         Textarea.factory(),
         document.getElementById('textarea')
       );
     </file>
   </example>
 */
export default class Textarea extends RingComponent {
  render() {
    let classes = classNames('ring-textarea', this.props.className);
    return (
      <textarea
        {...this.props}
        className={classes}
      />
    );
  }
}
