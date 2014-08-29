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
var shortcuts = require('shortcuts/shortcuts').getInstance();

/**
 * @enum {number}
 */
var Corner = {
  TOP_LEFT: 0,
  TOP_RIGHT: 1,
  BOTTOM_RIGHT: 2,
  BOTTOM_LEFT: 3
};

/**
 * @mixin {PopupMixin}
 */
var PopupMixin = {
  statics: {
    Corner: Corner,

    /**
     * @static
     * @param {ReactComponent} component
     * @returns {HTMLElement}
     */
    renderComponent: function(component) {
      this._wrapper = document.createElement('div');
      document.body.appendChild(this._wrapper);

      return React.renderComponent(component, this._wrapper);
    }
  },

  getDefaultProps: function() {
    return {
      shortcuts: true
    };
  },

  /** @override */
  componentDidMount: function() {
    var position = this.getPosition_();
    this.getDOMNode().style.left = position.left;
    this.getDOMNode().style.top = position.top;

    $(window).on('resize', this.onWindowResize_);
    $(document).on('click', this.onDocumentClick_);

    if (this.props.shortcuts) {
      this._shortcutsScope = generateUniqueId();

      shortcuts.bind({
        key: 'esc',
        scope: this._shortcutsScope,
        handler: this.close
      });

      shortcuts.pushScope(this._shortcutsScope);
    }
  },

  /** @override */
  componentWillUnmount: function() {
    $(window).off('resize', this.onWindowResize_);
    $(document).off('click', this.onDocumentClick_);

    if (this.props.shortcuts) {
      shortcuts.unbindScope(this._shortcutsScope);
      shortcuts.spliceScope(this._shortcutsScope);
    }
  },

  /** @override */
  render: function() {
    /* jshint ignore:start */
    return (
      <div className={this.getClassName()}>
        {this.getInternalContent()}
      </div>
      );
    /* jshint ignore:end */
  },

  /**
   * Removes popup from document.
   */
  close: function() {
    var parent = this.getDOMNode().parentNode;

    React.unmountComponentAtNode(parent);

    if (this._wrapper) {
      document.body.removeChild(this._wrapper);
    }

    return true;
  },

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  onWindowResize_: function() {
    this.close();
  },

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  onDocumentClick_: function(evt) {
    if (!this.getDOMNode().contains(evt.target)) {
      this.close();
    }
  },

  /**
   * @return {Object}
   * @private
   */
  getPosition_: function() {
    var anchorElement = this.props.anchorElement || document.body;

    var anchorElementOffset = $(anchorElement).offset();
    var position;

    switch (this.props.corner) {
      case Corner.TOP_LEFT:
        position = {
          left: anchorElementOffset.left + 'px',
          top: (anchorElementOffset.top - $(this.getDOMNode()).height()) + 'px'
        };
        break;

      default:
        position = {
          left: anchorElementOffset.left + 'px',
          top: (anchorElementOffset.top + $(anchorElement).height()) + 'px'
        };
        break;
    }

    return position;
  },

  /**
   * @return {string}
   */
  getClassName: function() {
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
    position: React.PropTypes.number,
    anchorElement: React.PropTypes.object,
    className: React.PropTypes.string
  },

  /** @override */
  getInternalContent: function() {
    return this.props.children;
  }
});

module.exports = Popup;
