/**
 * @jsx React.DOM
 */

var React = require('react/addons');
require('./input.scss');

/**
 * @name Input
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="Input">
     <file name="index.html">
       <div id='input'></div>
     </file>

     <file name="index.js" webpack="true">
       var React = require('react');
       var Input = require('input/input');

       React.renderComponent(Input(),
         document.getElementById('input'));
     </file>
   </example>
 */
var Input = React.createClass({
  render: function () {
    return this.transferPropsTo(
      <input
        className="ring-input"
      />
    );
  }
});

module.exports = Input;
