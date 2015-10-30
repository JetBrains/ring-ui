import React from 'react';
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
