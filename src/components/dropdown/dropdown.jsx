/**
 * @fileoverview Scaffolds for ring popup component. To create custom component
 * it's enough to mix this code into component and then add method
 * ```getInternalContent```.
 * @author igor.alexeenko
 * @jsx React.DOM
 */

'use strict';

require('./dropdown.scss');
var $ = require('jquery');
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
 * @static
 * @return {HTMLElement}
 */
var getPopupLayer = function() {
  if (!popupLayer) {
    popupLayer = document.createElement('div');
    popupLayer.className = POPUP_LAYER_CLASS_NAME;
    document.body.appendChild(popupLayer);
  }

  return popupLayer;
};

/**
 * @mixin {DropdownMixin}
 */
var DropdownMixin = {
  /** @override */
  componentDidMount: function() {
    window.addEventListener('resize', this.onWindowResize_);
    document.body.addEventListener('click', this.onDocumentClick_);
    document.body.addEventListener('keydown', this.onDocumentKeyDown_);
  },

  /** @override */
  componentWillUnmount: function() {
    window.removeEventListener('resize', this.onWindowResize_);
    document.body.removeEventListener('click', this.onDocumentClick_);
    document.body.removeEventListener('keydown', this.onDocumentKeyDown_);
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
    React.unmountComponentAtNode(getPopupLayer());
  },

  /**
   * @param {Event} evt
   * @private
   */
  onWindowResize_: function(evt) {
    this.close();
  },

  /**
   * @param {Event} evt
   * @private
   */
  onDocumentClick_: function(evt) {
    if (!this.getDOMNode().contains(evt.target)) {
      this.close();
    }
  },

  /**
   * @param {KeyboardEvent} evt
   * @private
   */
  onDocumentKeyDown_: function(evt) {
    if (evt.keyCode === 27) { // todo(igor.alexeenko): Stop using magic numbers.
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

    classNames.push("ring-dropdown");
    classNames.push("ring-dropdown_bound");

    return classNames.concat(this.props.classNames || []).join(' ');
  }
};

module.exports = DropdownMixin;
module.exports.Angle = Angle;
module.exports.getPopupLayer = getPopupLayer;
