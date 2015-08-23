/**
 * @fileoverview Panel.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 */

var React = require('react');
var classNames = require('classnames');
require('./panel.scss');

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
      additionalClassName = BASE_CLASS + '_' + this.props['modifier'];
    }

    var classes = classNames(BASE_CLASS + ' ' + additionalClassName, this.props.className);

    return (
      <div {...this.props} className={classes}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Panel;
