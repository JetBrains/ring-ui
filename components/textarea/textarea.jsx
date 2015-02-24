/**
 * @jsx React.DOM
 */

var React = require('react/addons');
require('./textarea.scss');

/**
 * @constructor
 * @extends {ReactComponent}
 * @example
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
    return this.transferPropsTo(
      <textarea
        className="ring-textarea"
      />
    );
  }
});

module.exports = Textarea;
