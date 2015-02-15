/**
 * @fileoverview Alert. Could be used as message, shown inline in context.
 * On the other hand could be used in a stack of messages. In this case
 * use {@link Alerts}.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @jsx React.DOM
 */

require('./alert.scss');
var Global = require('global/global');
var Icon = require('icon/icon'); // jshint -W098
var React = require('react/addons');


/**
 * List of available types of alert.
 * @enum {string}
 */
var Type = {
  ERROR: 'error',
  MESSAGE: 'message',
  SUCCESS: 'success',
  WARNING: 'warning'
};


/**
 * Lookup table of alert type to icon modifier.
 * @type {Object.<Type, string>}
 */
var TypeToIconModifier = Global.createObject(
    Type.ERROR, 'exception',
    Type.SUCCESS, 'ok',
    Type.WARNING, 'warning');


/**
 * Lookup table of alert type to icon color.
 * @type {Object.<Type, Icon.Color>}
 */
var TypeToIconColor = Global.createObject(
    Type.ERROR, Icon.Color.RED,
    Type.SUCCESS, Icon.Color.GREEN,
    Type.WARNING, Icon.Color.ORANGE);


/*jshint ignore:start*/
/**
 * @const
 * @type {string}
 */
var BASE_CLASS = 'ring-alert';
/*jshint ignore:end*/



/**
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="Alert">
     <file name="index.html">
       <div id="alert-container"></div>
     </file>

     <file name="index.js" webpack="true">
       var React = require('react');
       var Alert = require('./alert.jsx');

       var alert = React.renderComponent(Alert({
         caption: 'Sample alert',
         closeable: true,
         type: Alert.Type.SUCCESS
       }), document.querySelector('.alert-container'));
     </file>
   </example>
 */
var Alert = React.createClass({
  statics: {
    Type: Type,
    DOM: React.DOM
  },

  /** @override */
  getDefaultProps: function() {
    return {
      /** @type {Deferred} */
      animationDeferred: null,

      /** @type {ReactComponent|string} */
      caption: null,

      /** @type {boolean} */
      closeable: false,

      /**
       * Whether component is rendered inside {@code Alerts} container
       * or separately. Sometimes alerts are used to show messages
       * contextually.
       * @type {boolean}
       */
      inline: true,

      /**
       * Click handler on close element.
       * @type {?function(SyntheticMouseEvent):undefined}
       */
      onCloseClick: null,

      /** @type {Type} */
      type: Type.MESSAGE
    };
  },

  /** @override */
  componentDidMount: function() {
    if (this.props.animationDeferred) {
      if (typeof TransitionEvent === 'undefined') {
        this.props.animationDeferred.resolve(this);
      }

      this.getDOMNode().addEventListener('transitionend', this._handleTransitionEnd);
    }
  },

  /** @override */
  componentWillUnmount: function() {
    this.getDOMNode().removeEventListener('transitionend', this._handleTransitionEnd);
  },

  /** @override */
  render: function() {
    /*jshint ignore:start*/
    var modifiedClassName = [BASE_CLASS, this.props.type].join('_');

    var classes = React.addons.classSet(Global.createObject(
        BASE_CLASS, true,
        modifiedClassName, true,
        'ring-alert_inline', this.props.inline));

    return (<div className={classes}>
      {this._getIcon()}
      {this._getCaption()}
      {this.props.closeable ?
          (<Icon className="ring-alert__close" glyph="close" size={Icon.Size.Size16} onClick={this._handleCloseClick} />) :
          ''}
    </div>);
    /*jshint ignore:end*/
  },

  /**
   * Removes component from DOM.
   * @throws {Error} Throws an error if component rendered as a part of alerts
   * stack being deleted by this method.
   */
  close: function() {
    if (this.props.inline) {
      React.unmountComponentAtNode(this.getDOMNode().parentNode);
      return;
    }

    throw new Error('Removal of Alert by itself isn\'t possible ' +
        'if it has been rendered as a part of Alerts. ' +
        'Use Alerts.prototype.remove(index:number) instead.');
  },

  /**
   * @private
   */
  _handleTransitionEnd: function() {
    if (this.props.animationDeferred) {
      this.getDOMNode().removeEventListener('transitionend', this._handleTransitionEnd);
      this.props.animationDeferred.resolve(this);
    }
  },

  /**
   * @param {SyntheticEvent} evt
   * @private
   */
  _handleCloseClick: function(evt) {
    if (this.props.inline) {
      this.close();
    } else {
      this.props.onCloseClick(evt);
    }
  },

  /**
   * @private
   */
  _getCaption: function() {
    /*jshint ignore:start*/
    return (<span className="ring-alert__caption">{this.props.caption}</span>);
    /*jshint ignore:end*/
  },

  /**
   * @private
   * @return {XML|string}
   */
  _getIcon: function() {
    var iconModifier = TypeToIconModifier[this.props.type];

    if (iconModifier) {
      /*jshint ignore:start*/
      return (<Icon
          className="ring-alert__icon"
          color={TypeToIconColor[this.props.type] || Icon.Color.DEFAULT}
          glyph={iconModifier}
          size={Icon.Size.Size16} />);
      /*jshint ignore:end*/
    }

    return '';
  }
});


/** @type {Alert} */
module.exports = Alert;
