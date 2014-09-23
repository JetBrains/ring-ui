/**
 * @fileoverview Scaffolds for ring popup component. To create custom component
 * it's enough to mix this code into component and then add method
 * ```getInternalContent```.
 * @author igor.alexeenko
 * @jsx React.DOM
 */

'use strict';

require('./popup.scss');
var $ = require('jquery');
var React = require('react');
var Global = require('global/global');

var generateUniqueId = Global.getUIDGenerator('ring-popup-');
var Shortcuts = require('shortcuts/shortcuts');
var shortcuts = Shortcuts.getInstance();

/**
 * @enum {number}
 */
var Corner = {
  TOP_LEFT: 0,
// Not implemented yet
//  TOP_RIGHT: 1,
//  BOTTOM_RIGHT: 2,
  BOTTOM_LEFT: 3
};

/**
 * @mixin {PopupMixin}
 * @mixes {Shortcuts.Mixin}
 */
var PopupMixin = {
  mixins: [Shortcuts.Mixin],

  statics: {
    Corner: Corner,

    /**
     * @static
     * @param {ReactComponent} component
     * @returns {HTMLElement}
     */
    renderComponent: function (component) {
      this._wrapper = document.createElement('div');
      document.body.appendChild(this._wrapper);

      return React.renderComponent(component, this._wrapper);
    }
  },

  getInitialState: function () {
    return {
      style: {}
    };
  },

  getDefaultProps: function () {
    return {
      shortcuts: true
    };
  },

  getShortcutsProps: function () {
    return {
      map: {
        'esc': this.close
      },
      scope: generateUniqueId()
    };
  },

  componentWillReceiveProps: function (props) {
    this.setState({
      style: this._getStyles(props)
    });
  },

  /** @override */
  componentDidMount: function () {
    this.setState({
      style: this._getStyles()
    });

    $(window).on('resize', this.onWindowResize_);
    $(document).on('click', this.onDocumentClick_);
  },

  /** @override */
  componentWillUnmount: function () {
    $(window).off('resize', this.onWindowResize_);
    $(document).off('click', this.onDocumentClick_);
  },

  /** @override */
  render: function () {
    /* jshint ignore:start */
    return (
      <div className={this.getClassName()} style={this.state.style}>
        {this.getInternalContent()}
      </div>
      );
    /* jshint ignore:end */
  },

  /**
   * Closes popup and optionally removes from document.
   */
  close: function () {
    if (typeof this.props.onClose === 'function') {
      return this.props.onClose();
    }

    if (this.props.autoRemove !== false) {
      this.remove();
    } else {
      // There should be a better way
      this.setState({
        style: {
          display: 'none'
        }
      });
      shortcuts.spliceScope(this.shortcutsScope);
    }

    return true;
  },

  /**
   * Removes popup from document.
   */
  remove: function () {
    var parent = this.getDOMNode().parentNode;

    React.unmountComponentAtNode(parent);

    if (this._wrapper) {
      document.body.removeChild(this._wrapper);
    }
  },

  /**
   * @private
   */
  onWindowResize_: function () {
    this.close();
  },

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  onDocumentClick_: function (evt) {
    if (!this.getDOMNode().contains(evt.target)) {
      this.close();
    }
  },

  /**
   * @return {Object}
   * @private
   */
  _getStyles: function (props) {
    props = props || this.props;
    var anchorElement = props.anchorElement || document.body;

    var anchorElementOffset = $(anchorElement).offset();
    var styles = {};

    switch (props.corner) {
      case Corner.TOP_LEFT:
        styles.left = anchorElementOffset.left + (props.left || 0);
        styles.top = (anchorElementOffset.top - $(this.getDOMNode()).height()) + (props.top || 0);
        break;

      case undefined:
      case Corner.BOTTOM_LEFT:
        styles.left = anchorElementOffset.left + (props.left || 0);
        styles.top = (anchorElementOffset.top + $(anchorElement).outerHeight()) + (props.top || 0);
        break;

      default:
        throw new Error('Unknown corner type: ' + props.corner);
    }

    return styles;
  },

  /**
   * @return {string}
   */
  getClassName: function () {
    var classNames = [];

    classNames.push('ring-popup');
    classNames.push('ring-popup_bound');

    return classNames.concat(this.props.classNames || []).join(' ');
  }
};

/**
 * @constructor
 * @mixes {PopupMixin}
 * @extends {ReactComponent}
 */
var Popup = React.createClass({
  mixins: [PopupMixin],

  statics: {
    Mixin: PopupMixin
  },

  /** @override */
  propTypes: {
    anchorElement: React.PropTypes.object,
    className: React.PropTypes.string,
    left: React.PropTypes.number,
    top: React.PropTypes.number
  },

  /** @override */
  getInternalContent: function () {
    return this.props.children;
  }
});

module.exports = Popup;
