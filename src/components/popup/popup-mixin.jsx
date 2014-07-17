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
var getEventKey = require('react/lib/getEventKey');
var KeyCode = require('../global/keycode.jsx');
var React = require('react');

/**
 * @enum {number}
 */
var Angle = {
  TOP_LEFT: 0,
  TOP_RIGHT: 1,
  BOTTOM_RIGHT: 2,
  BOTTOM_LEFT: 3
};                     

/**
 * @type {HTMLElement}
 */
var popupLayer;

/**
 * @type {string}
 * @const
 */
var POPUP_LAYER_CLASS_NAME = 'ring-popup-layer';

/**
 * @mixin {PopupMixin}
 */
var PopupMixin = {
  statics: {
    Angle: Angle,

    /**
     * @static
     * @return {HTMLElement}
     */
    getPopupLayer: function() {
      if (!popupLayer) {
        popupLayer = document.createElement('div');
        popupLayer.className = POPUP_LAYER_CLASS_NAME;
        document.body.appendChild(popupLayer);
      }

      return popupLayer;
    }
  },

  /** @override */
  componentDidMount: function() {
    $(window).on('resize', this.onWindowResize_);
    $(document.body).
        on('click', this.onDocumentClick_).
        on('keydown', this.onDocumentKeyDown_);
  },

  /** @override */
  componentWillUnmount: function() {
    $(window).off('resize', this.onWindowResize_);
    $(document.body).
        off('click', this.onDocumentClick_).
        off('keydown', this.onDocumentKeyDown_);
  },

  /** @override */
  render: function() {
    return (
      <div className={this.getClassName()} style={this.getPosition_()}>
        {this.getInternalContent()}
      </div>
    );
  },

  /**
   * Removes popup from document.
   */
  close: function() {
    React.unmountComponentAtNode(this.getDOMNode().parentNode);
  },

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  onWindowResize_: function(evt) {
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
   * @param {jQuery.Event} evt
   * @private
   */
  onDocumentKeyDown_: function(evt) {
    if (getEventKey(evt.originalEvent) === 'Escape') {
      this.close();
    }
  },

  /**
   * @return {Object}
   * @private
   */
  getPosition_: function() {
    var anchorElement = this.props.anchorElement || document.body;
    var angle = this.props.angle || Angle.TOP_LEFT;

    var anchorElementOffset = $(anchorElement).offset();
    var position;

    switch (angle) {
      case Angle.BOTTOM_LEFT:
        position = {
          left: anchorElementOffset.left + 'px',
          top: (anchorElementOffset.top + $(anchorElement).height()) + 'px'
        };
        break;
      default:
        position = {
          left: anchorElementOffset.left + 'px',
          top: anchorElementOffset.top + 'px'
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

    classNames.push("ring-popup");
    classNames.push("ring-popup_bound");

    return classNames.concat(this.props.classNames || []).join(' ');
  }
};

module.exports = PopupMixin;
