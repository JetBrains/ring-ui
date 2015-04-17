/**
 * @fileoverview Scaffolds for ring popup component. To create custom component
 * it's enough to mix this code into component and then add method
 * ```getInternalContent```.
 * @author igor.alexeenko
 * @jsx React.DOM
 */

require('./popup.scss');
var $ = require('jquery');
var React = require('react');
var Global = require('global/global');

var generateUniqueId = Global.getUIDGenerator('ring-popup-');
var ShortcutsMixin = require('shortcuts/shortcuts-mixin');

/**
 * @constructor
 * @mixes {Popup.Mixin}
 * @extends {ReactComponent}
 * @example

 <example name="Popup Menu">
 <file name="index.html">
 <div>
 <div id="target1" style="position: absolute; left: 0; top: 0; width: 10px; height: 10px; background-color: red;"></div>
 <div id="target2" style="position: absolute; right: 0; top: 0; width: 10px; height: 10px; background-color: blue;"></div>
 <div id="target3" style="position: absolute; left: 0; bottom: 0; width: 10px; height: 10px; background-color: green;"></div>
 <button id="switch3" style="position: absolute; left: 50px; bottom: 50px;">Show again</button>
 <div id="target4" style="position: absolute; right: 0; bottom: 0; width: 10px; height: 10px; background-color: orange;"></div>
 </div>
 </file>
 <file name="index.js" webpack="true">
 var React = require('react');
 var Popup = require('./popup.jsx');

 var container = React.DOM.span(null, 'Hello world!');

 var popup = Popup.renderComponent(Popup({
        anchorElement: document.getElementById('target1'),
        corner: Popup.PopupProps.Corner.TOP_LEFT,
        autoRemove: false
      }, [container]));

 var popup2 = Popup.renderComponent(Popup({
        anchorElement: document.getElementById('target2'),
        corner: Popup.PopupProps.Corner.TOP_RIGHT,
        autoRemove: false
      }, [container]));

 var popup3 = Popup.renderComponent(Popup({
        anchorElement: document.getElementById('target3'),
        corner: Popup.PopupProps.Corner.BOTTOM_LEFT,
        autoRemove: false
      }, [container]));

 document.getElementById('switch3').onclick = function() {
  setTimeout(function() {
    popup3.show();
  }, 1);
 };

 var popup4 = Popup.renderComponent(Popup({
        anchorElement: document.getElementById('target4'),
        corner: Popup.PopupProps.Corner.BOTTOM_RIGHT,
        autoRemove: false
      }, [container]));
 </file>
 </example>
 */

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
var Direction = {
  DOWN: 1,
  RIGHT: 2,
  UP: 4,
  LEFT: 8
};

/**
 * @enum {number}
 */
var Dimension = {
  MARGIN: 16,
  BORDER_WIDTH: 1
};

/**
 * @mixin {PopupMixin}
 * @mixes {ShortcutsMixin}
 */
var PopupMixin = {
  mixins: [ShortcutsMixin],

  statics: {
    PopupProps: {
      Corner: Corner,
      Direction: Direction,
      Dimension: Dimension
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
     * @return {HTMLElement}
     */
    renderComponent: function (component) {
      var container = document.createElement('div');
      document.body.appendChild(container);

      return React.renderComponent(component, container);
    }
  },

  getInitialState: function () {
    return {
      style: {},
      display: this.props.hidden ? 0 : 1 // 0 - hidden, 1 - display in progress, 2 - visible
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
      /* eslint-disable no-bitwise */
      direction: Direction.DOWN | Direction.RIGHT
      /* eslint-enable no-bitwise */
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
    this._setListenersEnabled(true);
    this._checkDisplay();
  },

  componentDidUpdate: function() {
    this._checkDisplay();
  },

  /** @override */
  componentWillUnmount: function () {
    this._setListenersEnabled(false);
  },

  /** @override */
  render: function () {
    return this.transferPropsTo(
      <div className={this.getClassName()} style={this._getStyles()}>
        {this.getInternalContent()}
      </div>
    );
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

  hide: function(cb) {
    this.setState({
      display: 0,
      shortcuts: false
    }, cb);

    this._setListenersEnabled(false);
  },

  show: function(cb) {
    this.setState({
      display: 1,
      shortcuts: true
    }, cb);

    this._setListenersEnabled(true);
  },

  /**
   * @param {boolean} enable
   * @private
   */
  _setListenersEnabled: function(enable) {
    if (enable) {
      $(window).on('resize', this.onWindowResize_);
      $(document).on('click', this.onDocumentClick_);
    } else {
      $(window).off('resize', this.onWindowResize_);
      $(document).off('click', this.onDocumentClick_);
    }
  },

  /**
   * @private
   */
  _checkDisplay: function() {
    if (this.state.display === 1) {
      this.setState({
        display: 2
      });
    }
  },

  /**
   * Returns visibility state
   * @return {boolean}
   */
  isVisible: function() {
    return this.state.display > 0;
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

    if (parent.parentNode) {
      parent.parentNode.removeChild(parent);
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
    if (this.isMounted() && !this.getDOMNode().contains(evt.target)) {
      if (!this.props.anchorElement ||
        !this.props.dontCloseOnAnchorClick ||
        !this.props.anchorElement.contains(evt.target)) {
        this.close();
      }
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

    /* eslint-disable no-bitwise */
    if (this.isMounted()) {
      if (props.direction & Direction.UP) {
        top -= $(this.getDOMNode()).height();
      }

      if (props.direction & Direction.LEFT) {
        left -= $(this.getDOMNode()).width();
      }
    }
    /* eslint-enable no-bitwise */

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
      styles.maxHeight = $(window).height() - styles.top - Dimension.MARGIN;
    }

    if (props.minWidth === 'target') {
      styles.minWidth = $anchorElement.outerWidth();
    } else {
      styles.minWidth = props.minWidth;
    }

    // automatic position correction -->
    var sidePadding = 8;
    if (this.isMounted()) {
      if (styles.left < sidePadding) {
        styles.left = sidePadding;
      }

      if (styles.top < sidePadding) {
        styles.top = sidePadding;
      }

      var horizontalDiff = $(document).width() - (styles.left + $(this.getDOMNode()).outerWidth());
      if (horizontalDiff < sidePadding) {
        styles.left = styles.left + horizontalDiff - sidePadding;
      }

      var vericalDiff = $(document).height() - (styles.top + $(this.getDOMNode()).outerHeight());
      if (vericalDiff < sidePadding) {
        styles.top = styles.top + vericalDiff - sidePadding;
      }
    }
    // automatic position correction <--

    switch (this.state.display) {
      case 0:
        styles.left = 0;
        styles.top = 0;
        styles.display = 'none';
        styles.visibility = 'hidden';
        break;
      case 1:
        styles.left = 0;
        styles.top = 0;
        styles.display = 'block';
        styles.visibility = 'hidden';
        break;
      case 2:
        styles.display = 'block';
        styles.visibility = 'visible';
        break;
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
