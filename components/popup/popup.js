/**
 * @fileoverview Popup.
 */

import React, { PropTypes } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import classNames from 'classnames';

import RingComponentWithShortcuts from 'ring-component/ring-component_with-shortcuts';
import './popup.scss';

/**
 * @enum {number}
 */
const Corner = {
  TOP_LEFT: 0,
  TOP_RIGHT: 1,
  BOTTOM_RIGHT: 2,
  BOTTOM_LEFT: 3
};

/**
 * @enum {number}
 */
const Direction = {
  DOWN: 1,
  RIGHT: 2,
  UP: 4,
  LEFT: 8
};

/**
 * @enum {number}
 */
const Dimension = {
  MARGIN: 16,
  BORDER_WIDTH: 1
};

/**
 * @constructor
 * @name Popup
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
export default class Popup extends RingComponentWithShortcuts {
  static propTypes = {
    anchorElement: React.PropTypes.object,
    className: React.PropTypes.string,
    maxHeight: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    left: React.PropTypes.number,
    top: React.PropTypes.number
  };

  static defaultProps = {
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

  static PopupProps = {
    Corner: Corner,
    Direction: Direction,
    Dimension: Dimension
  };

  /**
   * Finds and returns closest DOM node with position=fixed or null
   * @param currentElement
   * @returns {DOMNode|null}
   */
  static closestFixedParent(currentElement) {
    if (!currentElement || currentElement === document.body) {
      return null;
    }

    /**
     * Test node type. Used to skip unsuitable DOM nodes like #document-fragment
     * @param node
     * @returns {boolean} is Element
     */
    function validDomElement(node) {
      return node instanceof Element;
    }

    let parent = currentElement.parentNode;

    if (parent && validDomElement(parent)) {
      let style = window.getComputedStyle(parent);
      if (style && style.position === 'fixed') {
        return parent;
      }
      return this.closestFixedParent(parent);
    }

    return null;
  }

  /**
   * @static
   * @param {ReactComponent} component
   * @param {HTMLElement} anchorElement DOM node for popup placing
   * Places popup wrapper into closest fixed DOM node if anchorElement is specified -
   * useful for placing popup into sidebar.
   * @return {HTMLElement}
   */
  static renderPopup(component, anchorElement) {
    let wrapperElement = document.createElement('div');

    let container = this.closestFixedParent(anchorElement) || document.body;
    container.appendChild(wrapperElement);

    let popupInstance = render(component, wrapperElement);

    popupInstance.rerender({container: container});
    return popupInstance;
  }

  state = {
    display: this.props.hidden ? 0 : 1 // 0 - hidden, 1 - display in progress, 2 - visible
  }

  getShortcutsProps() {
    return {
      map: {
        esc: ::this.close
      },
      scope: ::this.constructor.getUID()
    };
  }

  didMount() {
    if (!this.props.hidden) {
      this._setListenersEnabled(true);
    }
    this._checkDisplay();
  }

  didUpdate() {
    this._checkDisplay();
  }

  willUnmount() {
    this._setListenersEnabled(false);
  }

  render() {
    let classes = classNames({
      'ring-popup': true,
      'ring-popup_bound': this.props.cutEdge
    }, this.props.className);

    return (
      <div {...this.props} className={classes} style={this._getStyles()}>
        {this.getInternalContent()}
      </div>
    );
  }

  /**
   * Closes popup and optionally removes from document.
   */
  close(evt) {
    let onCloseResult = true;

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
  }

  hide(cb) {
    this.setState({
      display: 0,
      shortcuts: false
    }, cb);

    this._setListenersEnabled(false);
  }

  show(cb) {
    this.setState({
      display: 1,
      shortcuts: true
    }, cb);

    this._setListenersEnabled(true);
  }

  /**
   * @param {boolean} enable
   * @private
   */
  _setListenersEnabled(enable) {
    if (enable && !this._listenersEnabled) {
      setTimeout(() => {
        this._listenersEnabled = true;
        window.addEventListener('resize', ::this._onWindowResize);
        document.addEventListener('click', ::this._onDocumentClick);
      }, 0);

      return;
    }

    if (!enable && this._listenersEnabled){
      window.removeEventListener('resize', ::this._onWindowResize);
      document.removeEventListener('click', ::this._onDocumentClick);
      this._listenersEnabled = false;
    }
  }

  /**
   * @private
   */
  _checkDisplay() {
    if (this.state.display === 1) {
      this.setState({
        display: 2
      });
    }
  }

  /**
   * Returns visibility state
   * @return {boolean}
   */
  isVisible() {
    return this.state.display > 0;
  }

  /**
   * Removes popup from document.
   */
  remove() {
    if (!this.node) {
      return;
    }

    let parent = this.node.parentNode;
    unmountComponentAtNode(parent);

    if (parent.parentNode) {
      parent.parentNode.removeChild(parent);
    }
  }

  /**
   * @private
   */
  _onWindowResize(evt) {
    this.close(evt);
  }

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  _onDocumentClick(evt) {
    if (!this.node || this.node.contains(evt.target) || !this._listenersEnabled) {
      return;
    }

    if (!this.props.anchorElement ||
      !this.props.dontCloseOnAnchorClick ||
      !this.props.anchorElement.contains(evt.target)) {
      this.close(evt);
    }
  }

  getElementOffset(element) {
    let elementRect = element.getBoundingClientRect();

    if (this.props.container) {
      const containerRect = this.props.container.getBoundingClientRect();
      elementRect.left = elementRect.left - containerRect.left;
      elementRect.top = elementRect.top - containerRect.top;
    }

    return elementRect;
  }

  /**
   * @return {Object}
   * @private
   */
  _getStyles(props) {
    props = props || this.props;
    let top = props.top;
    let left = props.left;

    let styles = {};

    let anchor = this.getElementOffset(props.anchorElement || document.body);
    let anchorLeft = anchor.left + document.body.scrollLeft;
    let anchorTop = anchor.top + document.body.scrollTop;

    /* eslint-disable no-bitwise */
    if (this.node) {
      if (props.direction & Direction.UP) {
        top -= this.node.clientHeight;
      }

      if (props.direction & Direction.LEFT) {
        left -= this.node.clientWidth;
      }
    }
    /* eslint-enable no-bitwise */

    switch (props.corner) {
      case Corner.TOP_LEFT:
        styles.left = anchorLeft + left;
        styles.top = anchorTop + top;
        break;

      case Corner.TOP_RIGHT:
        styles.left = anchorLeft + anchor.width + left;
        styles.top = anchorTop + top;
        break;

      case Corner.BOTTOM_LEFT:
        styles.left = anchorLeft + left;
        styles.top = anchorTop + anchor.height + top;
        break;

      case Corner.BOTTOM_RIGHT:
        styles.left = anchorLeft + anchor.width + left;
        styles.top = anchorTop + anchor.height + top;
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
      styles.minWidth = anchor.width;
    } else {
      styles.minWidth = props.minWidth;
    }

    // automatic position correction -->
    let sidePadding = this.props.sidePadding;
    if (this.node) {
      if (styles.left < sidePadding) {
        styles.left = sidePadding;
      }

      if (styles.top < sidePadding) {
        styles.top = sidePadding;
      }

      let horizontalDiff = document.documentElement.clientWidth - styles.left - this.node.offsetWidth;
      if (horizontalDiff < sidePadding) {
        styles.left = styles.left + horizontalDiff - sidePadding;
      }

      let vericalDiff = document.documentElement.clientHeight - styles.top - this.node.offsetHeight;
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

  getInternalContent() {
    return this.props.children;
  }
}
