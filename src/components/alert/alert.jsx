/**
 * @fileoverview Alert. Could be used as message, shown inline in context.
 * On the other hand could be used in a stack of messages. In this case
 * use {@link Alerts}.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @jsx React.DOM
 */

var React = require('react/addons');


/**
 * List of available types of alert.
 * @enum {string}
 */
var Type = {
  ERROR: 'error',
  MESSAGE: 'message',
  WARNING: 'warning'
};


/**
 * @const
 * @type {string}
 */
var BASE_CLASS = 'ring-alert';



/**
 * @constructor
 * @extends {ReactComponent}
 */
var Alert = React.createClass({
  statics: {
    Type: Type
  },

  /** @override */
  getDefaultProps: function() {
    return {
      /** @type {$.Deferred} */
      'animationDeferred': null,

      /** @type {ReactComponent|string} */
      'caption': null,

      /** @type {boolean} */
      'closeable': true,

      /** @type {Type} */
      'type': Type.MESSAGE
    };
  },

  /** @override */
  componentDidMount: function() {
    if (this.props['animationDeferred']) {
      this.getDOMNode().addEventListener('transitionend', this._handleTransitionEnd);
    }
  },

  /** @override */
  componentWillUnmount: function() {
    this.getDOMNode().removeEventListener('transitionend');
  },

  /** @override */
  render: function() {
    var modifiedClassName = [BASE_CLASS, this.props['type']].join('_');
    var className = [BASE_CLASS, modifiedClassName].join(' ');

    return (<div className={className}>
      {this.props['caption']}
      {this.props['closeable'] ?
          (<span className="ring-alert__close ring-font-icon ring-font-icon_close" />) :
          ''}
    </div>);
  },

  // fixme(igor.alexeenko): Find out how to close it.
  close: function() {
    throw new Error('Unimplemented method.')
  },

  /**
   * @param {Event} evt
   * @private
   */
  _handleTransitionEnd: function(evt) {
    if (this.props['animationDeferred']) {
      this.props['animationDeferred'].resolve();
    }
  }
});


/** @type {Alert} */
module.exports = Alert;
