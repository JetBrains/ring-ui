var React = require('react');
var classNames = require('classnames');
require('./input.scss');

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
       var React = require('react');
       var Input = require('input/input');

       React.render(
         React.createElement(Input),
         document.getElementById('input')
       );
     </file>
   </example>
 */
var Input = React.createClass({
  render: function () {
    var classes = classNames('ring-input', this.props.className);
    return <input {...this.props} className={classes}/>;
  }
});

module.exports = Input;
