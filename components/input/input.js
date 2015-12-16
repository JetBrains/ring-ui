import React from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './input.scss';

/**
 * @name Input
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="React input">
     <file name="index.html">
       <div id="input"></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var Input = require('ring-ui/components/input/input');

       render(
         Input.factory(),
         document.getElementById('input')
       );
     </file>
   </example>
   <example name="Input sizes">
     <file name="index.html">
       <div style="width: 600px">
         <div class="input-control-wrapper">
           <input type="number" class="ring-input">
           <div class="ring-input__error-bubble active">No modifiers (full-width)</div>
         </div>
         <div class="input-control-wrapper">
           <input type="number" class="ring-input ring-input_short">
           <div class="ring-input__error-bubble active">Short</div>
         </div>
         <div class="input-control-wrapper">
           <input type="number" class="ring-input ring-input_medium">
           <div class="ring-input__error-bubble active">Medium</div>
         </div>
         <div class="input-control-wrapper">
           <input type="number" class="ring-input ring-input_long">
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
       require('ring-ui/components/input/input.scss');
       require('./style.scss');
     </file>
   </example>

   <example name="Textarea sizes">
     <file name="index.html">
       <div style="width: 600px">
         <div class="input-control-wrapper">
           <textarea class="ring-input"></textarea>
           <div class="ring-input__error-bubble active">No modifiers (full-width)</div>
         </div>
         <div class="input-control-wrapper">
           <textarea class="ring-input ring-input_short"></textarea>
           <div class="ring-input__error-bubble active">Short</div>
         </div>
         <div class="input-control-wrapper">
           <textarea class="ring-input ring-input_medium"></textarea>
           <div class="ring-input__error-bubble active">Medium</div>
         </div>
         <div class="input-control-wrapper">
           <textarea class="ring-input ring-input_long"></textarea>
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
       require('ring-ui/components/input/input.scss');
       require('./style.scss');
     </file>
   </example>
 */
export default class Input extends RingComponent {
  render() {
    const classes = classNames('ring-input', this.props.className);
    return (
      <input
        {...this.props}
        className={classes}
      />
    );
  }
}
