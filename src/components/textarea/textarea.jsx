/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
require('./textarea.scss');

/**
 * @constructor
 * @extends {ReactComponent}
   <example name="Textarea">
     <file name="index.html">
        <div id="textarea">
        </div>
     </file>

     <file name="index.js" webpack="true">
       var React = require('react');
       var Textarea = require('./textarea.jsx');

       React.renderComponent(Textarea(), document.getElementById('textarea'));
     </file>
   </example>
 *
 */
var Textarea = React.createClass({
  render: function () {
    /* jshint ignore:start */
    return this.transferPropsTo(
      <textarea
        className="ring-textarea"
      />
    );
    /* jshint ignore:end */
  }
});

module.exports = Textarea;
