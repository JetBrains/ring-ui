/**
 * @jsx React.DOM
 */

require('./button.scss');

var React = require('react');
var ReactPropTypes = React.PropTypes;

/**
 * @enum {string}
 * @see ***REMOVED***
 */
var Modifiers = {
  DEFAULT: 'default',
  BLUE: 'blue',
  BLACK: 'black',
  PRIMARY: 'primary',
  PLUS: 'plus',
  DELAYED_ACTION: 'delayed-action',
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
       var React = require('react');
       var Button = require('./button.jsx');

       React.renderComponent(Button({
                    modifier: Button.Modifiers.DEFAULT
                  }, 'Default Button'), document.getElementById('button'));
       React.renderComponent(Button({
                    modifier: Button.Modifiers.BLUE
                  }, 'Blue Button'), document.getElementById('button-blue'));
       React.renderComponent(Button({
                    modifier: Button.Modifiers.PRIMARY
                  }, 'Primary Button'), document.getElementById('button-primary'));
     </file>
   </example>
 */
var Button = React.createClass({
  statics: {
   Modifiers: Modifiers
  },

  propTypes: {

    /**
     * Button modifiers
     * @see Modifiers
     */
    modifier: ReactPropTypes.string,


    /**
     * Custom classes
     */
    className: ReactPropTypes.string
  },

  getDefaultProps: function () {
    return {
      modifier: Modifiers.DEFAULT
    };
  },

  render: function () {
    var className = [
      'ring-btn',
      'ring-btn_' + this.props.modifier
    ].join(' ');

    return this.transferPropsTo(
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
});

module.exports = Button;
