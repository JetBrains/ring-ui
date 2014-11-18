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

var Dimensions = {
  MARGIN: 16
};

/**
 * @mixin {PopupMixin}
 * @mixes {Shortcuts.Mixin}
 */
var PopupMixin = {
  mixins: [Shortcuts.Mixin],

  statics: {
    PopupProps: {
      Corner: Corner,
      Dimensions: Dimensions
    },

    /** @override */
    propTypes: {
      anchorElement: React.PropTypes.object,
      className: React.PropTypes.string,
      maxHeight: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]),
      left: React.PropTypes.number,
      top: React.PropTypes.number
    },

    /**
     * @static
     * @param {ReactComponent} component
     * @returns {HTMLElement}
     */
    renderComponent: function (component) {
      if (!this._wrapper) {
        this._wrapper = document.createElement('div');
        document.body.appendChild(this._wrapper);
      }

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
      style: this._getStyles(props),
      shortcuts: true
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
        {this.getInternalContent(this.props, this.state)}
      </div>
      );
    /* jshint ignore:end */
  },

  /**
   * Closes popup and optionally removes from document.
   */
  close: function () {
    if (typeof this.props.onClose === 'function' &&
        this.props.onClose() === false) {
      return false;
    }

    if (this.props.autoRemove !== false) {
      this.remove();
    } else {
      // There should be a better way
      this.setState({
        style: {
          display: 'none'
        },
        shortcuts: false
      });
    }

    return true;
  },

  /**
   * Removes popup from document.
   */
  remove: function () {
    if (this.isMounted()) {
      var parent = this.getDOMNode().parentNode;
      React.unmountComponentAtNode(parent);
    }

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

      case Corner.BOTTOM_RIGHT:
        // todo(igor.alexeenko): Very approximate.
        styles.left = anchorElementOffset.left - $(this.getDOMNode()).width() + $(anchorElement).width() + 20;
        styles.top = (anchorElementOffset.top + $(anchorElement).outerHeight()) + (props.top || 0);
        break;

      case undefined:
      case Corner.BOTTOM_LEFT:
        styles.left = anchorElementOffset.left + (props.left || 0);
        styles.top = (anchorElementOffset.top + $(anchorElement).outerHeight()) + (props.top || 0);
        break;

      default:
        throw new Error('Unknown corner type: ' + props.corner);
    }

    if (typeof props.maxHeight === 'number') {
      styles.maxHeight = props.maxHeight;
    }

    if (props.maxHeight === 'screen') {
      styles.maxHeight = $(window).height() - styles.top - Dimensions.MARGIN;
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

    return classNames.concat(this.props.className || []).join(' ');
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
  getInternalContent: function () {
    return this.props.children;
  }
});

module.exports = Popup;
