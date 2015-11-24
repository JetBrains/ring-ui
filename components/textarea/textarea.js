import React from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './textarea.scss';

/**
 * @name Textarea
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="React textarea">
     <file name="index.html">
       <div id="textarea"></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var Textarea = require('ring-ui/components/textarea/textarea');

       render(
         Textarea.factory(),
         document.getElementById('textarea')
       );
     </file>
   </example>

   <example name="Textarea sizes">
     <file name="index.html">
       <div style="width: 600px">
         <div class="input-control-wrapper">
           <textarea class="ring-textarea"></textarea>
           <div class="ring-input__error-bubble active">No modifiers (full-width)</div>
         </div>
         <div class="input-control-wrapper">
           <textarea class="ring-textarea ring-textarea_medium"></textarea>
           <div class="ring-input__error-bubble active">Medium</div>
         </div>
         <div class="input-control-wrapper">
           <textarea class="ring-textarea ring-textarea_long"></textarea>
           <div class="ring-input__error-bubble active">Long</div>
         </div>
       </div>
     </file>
     <file name="style.scss">
       .input-control-wrapper {
         position: relative;
         margin: 16px;
       }
     </file>
     <file name="index.js" webpack="true">
       require('ring-ui/components/textarea/textarea.scss');
       // For error-bubble
       require('ring-ui/components/input/input.scss');

       require('./style.scss');
     </file>
   </example>
 */
export default class Textarea extends RingComponent {
  render() {
    const classes = classNames('ring-textarea', this.props.className);
    return (
      <textarea
        {...this.props}
        className={classes}
      />
    );
  }
}
