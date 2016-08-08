import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './input.scss';

/**
 * @name Input
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="Input">
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
           <div class="ring-error-bubble active">No modifiers (full-width)</div>
         </div>
         <div class="input-control-wrapper">
           <input type="number" class="ring-input ring-input-size_xs">
           <div class="ring-error-bubble active">X Short</div>
         </div>
         <div class="input-control-wrapper">
           <input type="number" class="ring-input ring-input-size_s">
           <div class="ring-error-bubble active">Short</div>
         </div>
         <div class="input-control-wrapper">
           <input type="number" class="ring-input ring-input-size_md">
           <div class="ring-error-bubble active">Medium</div>
         </div>
         <div class="input-control-wrapper">
           <input type="number" class="ring-input ring-input-size_l">
           <div class="ring-error-bubble active">Long</div>
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
       require('ring-ui/components/input-size/input-size.scss');
       require('./style.scss');
     </file>
   </example>

   <example name="Textarea sizes">
     <file name="index.html">
       <div style="width: 600px">
         <div class="input-control-wrapper">
           <textarea class="ring-input"></textarea>
           <div class="ring-error-bubble active">No modifiers (full-width)</div>
         </div>
         <div class="input-control-wrapper">
           <textarea class="ring-input ring-input-size_xs"></textarea>
           <div class="ring-error-bubble active">X Short</div>
         </div>
         <div class="input-control-wrapper">
           <textarea class="ring-input ring-input-size_s"></textarea>
           <div class="ring-error-bubble active">Short</div>
         </div>
         <div class="input-control-wrapper">
           <textarea class="ring-input ring-input-size_md"></textarea>
           <div class="ring-error-bubble active">Medium</div>
         </div>
         <div class="input-control-wrapper">
           <textarea class="ring-input ring-input-size_l"></textarea>
           <div class="ring-error-bubble active">Long</div>
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
       require('ring-ui/components/input-size/input-size.scss');
       require('./style.scss');
     </file>
   </example>
 */
export default class Input extends RingComponent {
  static propTypes = {
    multiline: PropTypes.bool,
    className: PropTypes.string
  }

  render() {
    const {className, multiline, shortcuts, ...props} = this.props; // eslint-disable-line no-unused-vars
    const classes = classNames('ring-input', className);

    return multiline ? (
      <textarea
        {...props}
        className={classes}
      />
    ) : (
      <input
        {...props}
        className={classes}
      />
    );
  }
}
