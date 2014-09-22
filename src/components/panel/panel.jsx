/**
 * @fileoverview Panel.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 * @jsx React.DOM
 */

'use strict';

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

    /*jshint ignore:start*/
    var classList = [BASE_CLASS, additionalClassName].join(' ');

    return this.transferPropsTo(<div className={classList}>
      {this.props.children}
    </div>);
    /*jshint ignore:end*/
  }
});


module.exports = Panel;
