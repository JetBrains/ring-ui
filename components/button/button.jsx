require('./button.scss');

var React = require('react');
var ReactPropTypes = React.PropTypes;
var classNames = require('classnames');

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
       var Button = require('button/button.jsx');

       React.render(React.createElement(Button, {
         modifier: Button.Modifiers.DEFAULT
       }, 'Default Button'), document.getElementById('button'));

       React.render(React.createElement(Button, {
         modifier: Button.Modifiers.BLUE
       }, 'Blue Button'), document.getElementById('button-blue'));

       React.render(React.createElement(Button, {
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
    var classes = classNames(
      'ring-btn',
      'ring-btn_' + this.props.modifier,
      this.props.className
    );

    return (
      <button {...this.props} className={classes}>
        {this.props.children}
      </button>
    );
  }
});

module.exports = Button;
