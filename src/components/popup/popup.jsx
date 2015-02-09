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
  TOP_RIGHT: 1,
  BOTTOM_RIGHT: 2,
  BOTTOM_LEFT: 3
};

/**
 * @enum {number}
 */
var Directions = {
  // NB! As far as this enum is used as a bit mask, we can't use 0x00 as value.
  // Also, we can't use odd numbers.

  /**
   * @deprecated Use {@code Directions.DOWN} instead.
   */
  BOTTOM: 1,
  RIGHT: 2,
  /**
   * @deprecated Use {@code Directions.UP} instead.
   */
  TOP: 4,
  LEFT: 8
};

/** @alias {Directions.TOP} */
Directions.UP = Directions.TOP;

/** @alias {Directions.BOTTOM} */
Directions.DOWN = Directions.BOTTOM;

var Dimensions = {
  MARGIN: 16,
  BORDER_WIDTH: 1
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
      Directions: Directions,
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
      var hasWrapper = component.state && component.state._wrapper;
      var wrapper;

      if (!hasWrapper) {
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
      } else {
        wrapper = hasWrapper;
      }

      var instance = React.renderComponent(component, wrapper);
      if (!hasWrapper) {
        instance.setState({_wrapper: wrapper});
      }
      return instance;
    }
  },

  getInitialState: function () {
    return {
      style: {},
      hidden: this.props.hidden
    };
  },

  getDefaultProps: function () {
    return {
      shortcuts: true,
      hidden: false,
      autoRemove: true,
      cutEdge: true,
      left: 0,
      top: 0,
      corner: Corner.BOTTOM_LEFT,
      direction: Directions.BOTTOM | Directions.RIGHT
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

  /** @override */
  componentDidMount: function () {
    this.setState({mounted: true});
    $(window).on('resize', this.onWindowResize_);
    $(document).on('click', this.onDocumentClick_);
  },

  /** @override */
  shouldComponentUpdate: function(props) {
    this.state.hidden = props.hidden;

    return true;
  },

  /** @override */
  componentWillUnmount: function () {
    $(window).off('resize', this.onWindowResize_);
    $(document).off('click', this.onDocumentClick_);
  },

  /** @override */
  componentWillReceiveProps: function (props) {
    if (typeof props.hidden === 'boolean') {
      this.setState({
        hidden: props.hidden
      });
    }
  },

  /** @override */
  render: function () {
    /* jshint ignore:start */
    return this.transferPropsTo(
      <div className={this.getClassName()} style={this._getStyles()}>
        {this.getInternalContent()}
      </div>
    );
    /* jshint ignore:end */
  },

  /**
   * Closes popup and optionally removes from document.
   */
  close: function () {
    var onCloseResult = true;

    if (typeof this.props.onClose === 'function') {
      onCloseResult = this.props.onClose();

      if (onCloseResult === false) {
        return onCloseResult;
      }
    }

    if (this.props.autoRemove) {
      this.remove();
    } else {
      this.hide();
    }

    return onCloseResult;
  },

  hide: function() {
    this.setState({
      hidden: true,
      shortcuts: false
    });
  },

  show: function() {
    this.setState({
      hidden: false,
      shortcuts: true
    });
  },

  /**
   * Returns visibility state
   * @return {boolean}
   */
  isVisible: function() {
    return this.state.hidden !== true;
  },

  /**
   * Removes popup from document.
   */
  remove: function () {
    if (!this.isMounted()) {
      return;
    }

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
    var $anchorElement = $(props.anchorElement || document.body);
    var top = props.top;
    var left = props.left;

    var anchorElementOffset = $anchorElement.offset();
    var styles = {};

    if (this.isMounted()) {
      if (!!(props.direction & Directions.UP)) {
        top -= $(this.getDOMNode()).height();
      }

      if (!!(props.direction & Directions.LEFT)) {
        left -= $(this.getDOMNode()).width();
      }
    }

    switch (props.corner) {
      case Corner.TOP_LEFT:
        styles.left = anchorElementOffset.left + left;
        styles.top = anchorElementOffset.top + top;
        break;

      case Corner.TOP_RIGHT:
        styles.left = anchorElementOffset.left + $anchorElement.outerWidth() + left;
        styles.top = anchorElementOffset.top + top;
        break;

      case Corner.BOTTOM_LEFT:
        styles.left = anchorElementOffset.left + left;
        styles.top = anchorElementOffset.top + $anchorElement.outerHeight() + top;
        break;

      case Corner.BOTTOM_RIGHT:
        styles.left = anchorElementOffset.left + $anchorElement.outerWidth() + left;
        styles.top = anchorElementOffset.top + $anchorElement.outerHeight() + top;
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

    if (props.minWidth === 'target') {
      styles.minWidth = $anchorElement.width();
    }

    if (this.state.hidden) {
      styles.display = 'none';
    } else {
      styles.display = 'block';
    }

    return styles;
  },

  /**
   * @return {string}
   */
  getClassName: function () {
    var classNames = [];

    classNames.push('ring-popup');

    if (this.props.cutEdge) {
      classNames.push('ring-popup_bound');
    }

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
