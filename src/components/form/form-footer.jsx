/**
 * @fileoverview React wrapper for footer.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 * @jsx React.DOM
 */

var React = require('react');



/**
 * @constructor
 * @extends {ReactComponent}
 */
var FormFooter = React.createClass({
  render: function() {
    return this.transferPropsTo(
      <div className='ring-form__footer'>
        {this.props.children}
      </div>
    );
  }
});

module.exports = FormFooter;
