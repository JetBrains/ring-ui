/** @jsx React.DOM */

'use string';

var React = require('react');
var $ = require('jquery');
var ReactPropTypes = React.PropTypes;

/**
 * @enum {number}
 */
var Position = {
  TOP_LEFT: 0,
  TOP_RIGHT: 1,
  BOTTOM_RIGHT: 2,
  BOTTOM_LEFT: 3
};

/**
 * @enum {number}
 */
var KeyCode = {
  ESC: 27
};

var Popup = React.createClass({
  propTypes: {

    /**
     * Popup position relative anchor node
     */
    position: ReactPropTypes.number,

    /**
     * Element relative to which position popup
     */
    anchorElement: ReactPropTypes.object,

    /**
     * Custom classes
     */
    className: ReactPropTypes.string
  },

  getDefaultProps: function () {
    return {
      anchorElement: global.document.body,
      position: Position.TOP_LEFT
    };
  },

  /** @override */
  componentDidMount: function () {
    this._eventHandlers('on');
  },

  /** @override */
  componentWillUnmount: function () {
    this._eventHandlers('off');
  },

  /** @override */
  render: function () {
    var className = [
      'ring-dropdown',
      'ring-dropdown_bound',
      this.props.className
    ].join(' ');

    return (
      <div className={className} style={this._getPosition()}>
        {this.props.children}
      </div>
      );
  },

  /**
   * Removes popup from document.
   */
  close: function () {
    React.unmountComponentAtNode(this.getDOMNode());
  },

  /**
   * Add/Remove global event handlers
   * @param {string} method (on/off)
   * @private
   */
  _eventHandlers: function (method) {
    $(global.window)[method]('resize', this._onWindowResize);
    $(global.document.body)
      [method]('click', this._onDocumentClick)
      [method]('keydown', this._onDocumentKeyDown);
  },

  /**
   * @param {Event} evt
   * @private
   */
  _onWindowResize: function (evt) {
    this.close();
  },

  /**
   * @param {Event} evt
   * @private
   */
  _onDocumentClick: function (evt) {
    if (!this.getDOMNode().contains(evt.target)) {
      this.close();
    }
  },

  /**
   * @param {KeyboardEvent} evt
   * @private
   */
  _onDocumentKeyDown: function (evt) {
    if (evt.keyCode === KeyCode.ESC) {
      this.close();
    }
  },

  /**
   * @return {Object}
   * @private
   */
  _getPosition: function () {
    var anchorElement = this.props.anchorElement;
    var position = this.props.position;
    var anchorElementOffset = $(anchorElement).offset();
    var offset = {
      left: anchorElementOffset.left,
      top: anchorElementOffset.top
    };

    if (position === Position.BOTTOM_LEFT) {
      offset.top += $(anchorElement).height();
    }

    return Object.keys(offset).reduce(function (style, property) {
      style[property] = offset[property] + 'px';
      return style;
    }, {});
  }
});

module.exports = Popup;
module.exports.Position = Position;
