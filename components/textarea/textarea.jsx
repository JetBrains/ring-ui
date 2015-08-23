var React = require('react');
var classNames = require('classnames');
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

       React.render(React.createElement(Textarea), document.getElementById('textarea'));
     </file>
   </example>
 *
 */
var Textarea = React.createClass({
  render: function () {
    var classes = classNames('ring-textarea', this.props.className);
    return <textarea {...this.props} className={classes}/>;
  }
});

module.exports = Textarea;
