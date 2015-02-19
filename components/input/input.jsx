/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
require('./input.scss');

/**
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="Input">
     <file name="index.html">
       <div id='input'></div>
     </file>

     <file name="index.js" webpack="true">
       var React = require('react');
       var Input = require('./input.jsx');

       React.renderComponent(Input(),
         document.getElementById('input'));
     </file>
   </example>
 */
var Input = React.createClass({
  render: function () {
    /* jshint ignore:start */
    return this.transferPropsTo(
      <input
        className="ring-input"
      />
    );
    /* jshint ignore:end */
  }
});

module.exports = Input;
