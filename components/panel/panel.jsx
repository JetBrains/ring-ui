/**
 * @fileoverview Panel.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 * @jsx React.DOM
 */

require('./panel.scss');
var React = require('react/addons');


/**
 * @const
 * @type {string}
 */
var BASE_CLASS = 'ring-panel';


/**
 * @enum {string}
 */
var Modifier = {
  BLACK: 'black',
  NONE: '',
  TRANSPARENT: 'transparent'
};



/**
 * @constructor
 * @extends {ReactComponent}
 */
var Panel = React.createClass({
  statics: {
    Modifier: Modifier
  },

  /** @override */
  getDefaultProps: function() {
    return {
      'modifier': Modifier.NONE
    };
  },

  /** @override */
  render: function() {
    var additionalClassName = '';

    if (this.props['modifier'] !== Modifier.NONE) {
      additionalClassName = [BASE_CLASS, this.props['modifier']].join('_');
    }
    var classList = [BASE_CLASS, additionalClassName].join(' ');

    return this.transferPropsTo(<div className={classList}>
      {this.props.children}
    </div>);
  }
});


module.exports = Panel;
