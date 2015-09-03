/**
 * @fileoverview Scaffolds for ring popup component. To create custom component
 * it's enough to mix this code into component and then add method
 * ```getInternalContent```.
 * @author igor.alexeenko
 */

import 'babel/polyfill';
import React, { PropTypes } from 'react';
import { render, findDOMNode, unmountComponentAtNode } from 'react-dom';
import mixin from 'react-mixin';
import classNames from 'classnames';
import $ from 'jquery';
import RingComponent from 'ring-component/ring-component';
import factory from 'factory-decorator/factory-decorator';
import Global from 'global/global';
import './popup.scss';
import debug from 'debug-decorator/debug-decorator';

var generateUniqueId = Global.getUIDGenerator('ring-popup-');
var ShortcutsMixin = require('shortcuts/shortcuts__mixin');

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

    /**
     * @static
     * @param {ReactComponent} component
     * @return {HTMLElement}
     */
    renderPopup: function (component) {
      var container = document.createElement('div');
      document.body.appendChild(container);

      return render(component, container);
    }
  },

  // Temporarily disabled due to https://github.com/brigand/react-mixin/blob/master/index.js#L101
  /** @override */
  /*propTypes: {
    anchorElement: React.PropTypes.object,
    className: React.PropTypes.string,
    maxHeight: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    left: React.PropTypes.number,
    top: React.PropTypes.number
  },*/

  getInitialState: function () {
    return {
      display: this.props.hidden ? 0 : 1 // 0 - hidden, 1 - display in progress, 2 - visible
    };
  },

  getDefaultProps: function () {
    return {
      shortcuts: false,
      hidden: false,
      autoRemove: true,
      cutEdge: true,
      left: 0,
      top: 0,
      corner: Corner.BOTTOM_LEFT,
      /* eslint-disable no-bitwise */
      direction: Direction.DOWN | Direction.RIGHT,
      /* eslint-enable no-bitwise */
      sidePadding: 8
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
    this.element = findDOMNode(this);

    if (!this.props.hidden) {
      this._setListenersEnabled(true);
    }
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
    var classes = classNames({
      'ring-popup': true,
      'ring-popup_bound': this.props.cutEdge
    }, this.props.className);

    return (
      <div {...this.props} className={classes} style={this._getStyles()}>
        {this.getInternalContent()}
      </div>
    );
  },

  /**
   * Closes popup and optionally removes from document.
   */
  close: function (evt) {
    var onCloseResult = true;

    if (typeof this.props.onClose === 'function') {
      onCloseResult = this.props.onClose(evt);

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
    if (enable && !this._listenersEnabled) {
      setTimeout(() => {
        this._listenersEnabled = true;
        window.addEventListener('resize', ::this.onWindowResize_);
        document.addEventListener('click', ::this.onDocumentClick_);
      }, 0);

      return;
    }

    if (!enable && this._listenersEnabled){
      window.removeEventListener('resize', ::this.onWindowResize_);
      document.removeEventListener('click', ::this.onDocumentClick_);
      this._listenersEnabled = false;
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
    /*if (!this.isMounted()) {
      return;
    }*/

    var parent = findDOMNode(this).parentNode;
    unmountComponentAtNode(parent);

    if (parent.parentNode) {
      parent.parentNode.removeChild(parent);
    }
  },

  /**
   * @private
   */
  onWindowResize_: function (evt) {
    this.close(evt);
  },

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  onDocumentClick_: function (evt) {
    //TODO починить
    //if (this.isMounted() && !this.getDOMNode().contains(evt.target)) {
    let node = findDOMNode(this);
    if (node && !node.contains(evt.target)) {
      if (!this.props.anchorElement ||
        !this.props.dontCloseOnAnchorClick ||
        !this.props.anchorElement.contains(evt.target)) {
        this.close(evt);
      }
    }
  },

  /**
   * @return {Object}
   * @private
   */
  _getStyles: function (props) {
    props = props || this.props;
    var anchorElement = (props.anchorElement || document.body);
    var top = props.top;
    var left = props.left;

    var anchorElementOffset = $(anchorElement).offset();
    var styles = {};

    /* eslint-disable no-bitwise */
    if (this.element) {
      if (props.direction & Direction.UP) {
        top -= $(this.element).height();
      }

      if (props.direction & Direction.LEFT) {
        left -= $(this.element).width();
      }
    }
    /* eslint-enable no-bitwise */

    switch (props.corner) {
      case Corner.TOP_LEFT:
        styles.left = anchorElementOffset.left + left;
        styles.top = anchorElementOffset.top + top;
        break;

      case Corner.TOP_RIGHT:
        styles.left = anchorElementOffset.left + anchorElement.offsetWidth + left;
        styles.top = anchorElementOffset.top + top;
        break;

      case Corner.BOTTOM_LEFT:
        styles.left = anchorElementOffset.left + left;
        styles.top = anchorElementOffset.top + anchorElement.offsetHeight + top;
        break;

      case Corner.BOTTOM_RIGHT:
        styles.left = anchorElementOffset.left + anchorElement.offsetWidth + left;
        styles.top = anchorElementOffset.top + anchorElement.offsetHeight + top;
        break;

      default:
        throw new Error('Unknown corner type: ' + props.corner);
    }

    if (typeof props.maxHeight === 'number') {
      styles.maxHeight = props.maxHeight;
    }

    if (props.maxHeight === 'screen') {
      styles.maxHeight = window.innerHeight - styles.top - Dimension.MARGIN;
    }

    if (props.minWidth === 'target') {
      styles.minWidth = anchorElement.offsetWidth;
    } else {
      styles.minWidth = props.minWidth;
    }

    // automatic position correction -->
    var sidePadding = this.props.sidePadding;
    if (this.element) {
      if (styles.left < sidePadding) {
        styles.left = sidePadding;
      }

      if (styles.top < sidePadding) {
        styles.top = sidePadding;
      }

      var horizontalDiff = $(document).width() - (styles.left + this.element.offsetWidth);
      if (horizontalDiff < sidePadding) {
        styles.left = styles.left + horizontalDiff - sidePadding;
      }

      var vericalDiff = $(document).height() - (styles.top + this.element.offsetHeight);
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
  }
};

/**
 * @constructor
 * @name Popup
 * @mixes {PopupMixin}
 * @extends {ReactComponent}
 * @example

 <example name="Popup">
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
 var DOM = require('react').DOM;
 var Popup = require('popup/popup');

 var container = DOM.span(null, 'Hello world!');

 var popup = Popup.renderPopup(Popup.factory({
   anchorElement: document.getElementById('target1'),
   corner: Popup.PopupProps.Corner.TOP_LEFT,
   autoRemove: false
 }, container));

 var popup2 = Popup.renderPopup(Popup.factory({
   anchorElement: document.getElementById('target2'),
   corner: Popup.PopupProps.Corner.TOP_RIGHT,
   autoRemove: false
 }, container));

 var popup3 = Popup.renderPopup(Popup.factory({
   anchorElement: document.getElementById('target3'),
   corner: Popup.PopupProps.Corner.BOTTOM_LEFT,
   autoRemove: false
 }, container));

 document.getElementById('switch3').onclick = function() {
  setTimeout(function() {
    popup3.show();
  }, 1);
 };

 var popup4 = Popup.renderPopup(Popup.factory({
   anchorElement: document.getElementById('target4'),
   corner: Popup.PopupProps.Corner.BOTTOM_RIGHT,
   autoRemove: false
 }, container));
 </file>
 </example>
 */
@factory
@mixin.decorate(PopupMixin)
export default class Popup extends RingComponent {
  static Mixin = PopupMixin;

  /** @override */
  getInternalContent() {
    return this.props.children;
  }
}
