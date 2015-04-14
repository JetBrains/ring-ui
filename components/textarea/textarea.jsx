/**
 * @jsx React.DOM
 */

var React = require('react/addons');
require('./textarea.scss');

/**
 * @name Textarea
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
       var Textarea = require('textarea/textarea');

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
