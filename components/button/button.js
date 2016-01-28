import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './button.scss';

const Modifiers = {
  DEFAULT: 'default',
  BLUE: 'blue',
  PRIMARY: 'primary',
  DELAYED_ACTION: 'delayed',
  DANGER: 'danger'
};

/**
 * @name Button
 * @constructor
 * @description Button component
 * @extends {ReactComponent}
 * @example
   <example name="Button">
     <file name="index.html">
       <div>
         <span id="button"></span>
         <span id="button-blue"></span>
         <span id="button-primary"></span>
       </div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var Button = require('ring-ui/components/button/button');

       render(Button.factory({
         modifier: Button.Modifiers.DEFAULT
       }, 'Default Button'), document.getElementById('button'));

       render(Button.factory({
         modifier: Button.Modifiers.BLUE
       }, 'Blue Button'), document.getElementById('button-blue'));

       render(Button.factory({
         modifier: Button.Modifiers.PRIMARY
       }, 'Primary Button'), document.getElementById('button-primary'));
     </file>
   </example>
 */
export default class Button extends RingComponent {
  static get Modifiers() {
    return Modifiers;
  }

  static get propTypes() {
    return {
      modifier: PropTypes.string,
      className: PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      modifier: Modifiers.DEFAULT
    };
  }

  render() {
    const classes = classNames(
      'ring-button',
      'ring-button_' + this.props.modifier,
      this.props.className
    );

    return (
      <button
        {...this.props}
        className={classes}
      >
        {this.props.children}
      </button>
    );
  }
}
