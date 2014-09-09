/**
 * @fileoverview Alert. Could be used as message, shown inline in context.
 * On the other hand could be used in a stack of messages. In this case
 * use {@link Alerts}.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @jsx React.DOM
 */

require('./alert.scss');
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
      'closeable': false,

      /**
       * Whether component is rendered inside {@code Alerts} container
       * or separately. Sometimes alerts are used to show messages
       * contextually.
       * @type {boolean}
       */
      'inline': true,

      /**
       * Click handler on close element.
       * @type {?function(SyntheticMouseEvent):undefined}
       */
      'onClick': null,

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

    var className = {};
    className[BASE_CLASS] = true;
    className[modifiedClassName] = true;
    className['ring-alert_inline'] = this.props['inline'];

    var classes = React.addons.classSet(className);

    var closeClickHandler = this.props['onClick'] === null ?
        this._handleCloseClick :
        this.props['onClick'];

    return (<div className={classes} onClick={this.props['onClick']}>
      {this.props['caption']}
      {this.props['closeable'] ?
          (<span className="ring-alert__close ring-font-icon ring-font-icon_close" onClick={closeClickHandler} />) :
          ''}
    </div>);
  },

  /**
   * Removes component from DOM.
   */
  close: function() {
    if (this.props['inline']) {
      React.unmountComponentAtNode(this.getDOMNode().parentNode);
      return;
    }

    throw new Error('Removal of Alert by itself isn\'t possible ' +
        'if it has been rendered as a part of Alerts. ' +
        'Use Alerts.prototype.remove(index:number) instead.');
  },

  /**
   * @param {Event} evt
   * @private
   */
  _handleTransitionEnd: function(evt) {
    if (this.props['animationDeferred']) {
      this.props['animationDeferred'].resolve();
    }
  },

  /**
   * @param {SyntheticMouseEvent} evt
   * @private
   */
  _handleCloseClick: function(evt) {
    if (this.props['inline']) {
      this.close();
    }
  }
});


/** @type {Alert} */
module.exports = Alert;
