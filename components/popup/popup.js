/**
 * @fileoverview Popup.
 */

import React, {PropTypes} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import classNames from 'classnames';

import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';
import {getStyles, isMounted, getRect} from '../dom/dom';

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

const OPPOSITE_HORIZONTAL_CORNER = {
  [Corner.BOTTOM_LEFT]: Corner.BOTTOM_RIGHT,
  [Corner.BOTTOM_RIGHT]: Corner.BOTTOM_LEFT,
  [Corner.TOP_RIGHT]: Corner.TOP_LEFT,
  [Corner.TOP_LEFT]: Corner.TOP_RIGHT
};

const OPPOSITE_VERTICAL_CORNER = {
  [Corner.BOTTOM_LEFT]: Corner.TOP_LEFT,
  [Corner.BOTTOM_RIGHT]: Corner.TOP_RIGHT,
  [Corner.TOP_RIGHT]: Corner.BOTTOM_RIGHT,
  [Corner.TOP_LEFT]: Corner.BOTTOM_LEFT
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
 var Popup = require('ring-ui/components/popup/popup');
 var Direction = Popup.PopupProps.Direction;

 var container = DOM.span(null, 'Hello world!');

 var popup = Popup.renderPopup(Popup.factory({
   anchorElement: document.getElementById('target1'),
   corner: Popup.PopupProps.Corner.BOTTOM_RIGHT,
   direction: Direction.DOWN | Direction.RIGHT,
   autoRemove: false
 }, container));

 var popup2 = Popup.renderPopup(Popup.factory({
   anchorElement: document.getElementById('target2'),
   corner: Popup.PopupProps.Corner.BOTTOM_LEFT,
   direction: Direction.LEFT | Direction.DOWN,
   autoRemove: false
 }, container));

 var popup3 = Popup.renderPopup(Popup.factory({
   anchorElement: document.getElementById('target3'),
   corner: Popup.PopupProps.Corner.TOP_RIGHT,
   direction: Direction.UP | Direction.RIGHT,
   autoRemove: false
 }, container));

 var popup4 = Popup.renderPopup(Popup.factory({
   anchorElement: document.getElementById('target4'),
   corner: Popup.PopupProps.Corner.TOP_LEFT,
   direction: Direction.UP | Direction.LEFT,
   autoRemove: false
 }, container));

 document.getElementById('switch3').onclick = function() {
  setTimeout(function() {
    popup3.show();
  }, 1);
 };
 </file>
 </example>

 <example name="Popup autoposition">
   <file name="index.html">
   <div>
     <div style="position: absolute; top:50%; left: 300px;">Popup should change open direction when reaching window borders</div>
     <div id="leftSide" style="position: absolute; left: 0; top: 50px;">Left side open popup</div>
     <div id="rightSide" style="position: absolute; right: 0; top: 50px;">Right side open popup</div>
     <div id="downSide" style="position: absolute; left: 150px; bottom: 0;">Downside open popup</div>
     <div id="topSide" style="position: absolute; right: 150px; top: 0;">Upside open popup</div>
   </div>
   </file>
   <file name="index.js" webpack="true">
   var DOM = require('react').DOM;
   var Popup = require('ring-ui/components/popup/popup');
   var Direction = Popup.PopupProps.Direction;

   var container = DOM.span({style: {whiteSpace: 'no-wrap'}}, 'This is popup');

   var popup = Popup.renderPopup(Popup.factory({
     anchorElement: document.getElementById('leftSide'),
     corner: Popup.PopupProps.Corner.BOTTOM_LEFT,
     direction: Direction.LEFT,
     autoRemove: false
   }, container));

   var popup2 = Popup.renderPopup(Popup.factory({
     anchorElement: document.getElementById('rightSide'),
     corner: Popup.PopupProps.Corner.BOTTOM_RIGHT,
     direction: Direction.RIGHT,
     autoRemove: false
   }, container));

   var popup3 = Popup.renderPopup(Popup.factory({
     anchorElement: document.getElementById('downSide'),
     corner: Popup.PopupProps.Corner.BOTTOM_LEFT,
     direction: Direction.DOWN,
     autoRemove: false
   }, container));

   var popup4 = Popup.renderPopup(Popup.factory({
     anchorElement: document.getElementById('topSide'),
     corner: Popup.PopupProps.Corner.TOP_LEFT,
     direction: Direction.UP,
     autoRemove: false
   }, container));
   </file>
</example>
 */
export default class Popup extends RingComponentWithShortcuts {
  static propTypes = {
    anchorElement: PropTypes.object,
    className: PropTypes.string,
    maxHeight: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    left: PropTypes.number,
    top: PropTypes.number
  };

  static defaultProps = {
    shortcuts: false,
    hidden: false,
    autoRemove: true,
    cutEdge: true,
    left: 0,
    top: 0,
    corner: Corner.BOTTOM_LEFT,
    direction: Direction.DOWN | Direction.RIGHT,
    autoPositioning: true,
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

    const parent = currentElement.parentNode;

    if (parent && validDomElement(parent)) {
      const style = getStyles(parent);
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
   * @param {HTMLElement} containerElement Places popup in specified container
   * @return {HTMLElement}
   */
  static renderPopup(component, anchorElement, containerElement) {
    const wrapperElement = document.createElement('div');

    const container = containerElement || this.closestFixedParent(anchorElement) || document.body;
    container.appendChild(wrapperElement);

    const popupInstance = render(component, wrapperElement);

    popupInstance.rerender({container: container});
    return popupInstance;
  }

  state = {
    display: this.props.hidden ? 0 : 1 // 0 - hidden, 1 - display in progress, 2 - visible
  };

  constructor(...args) {
    super(...args);

    this._onWindowResize = this._onWindowResize.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);
  }

  getShortcutsProps() {
    return {
      map: {
        esc: ::this.close
      },
      scope: ::this.constructor.getUID('ring-popup-')
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
    const classes = classNames({
      'ring-popup': true,
      'ring-popup_bound': this.props.cutEdge
    }, this.props.className);

    return (
      <div
        {...this.props}
        className={classes}
        style={this._getStyles()}
      >
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
        window.addEventListener('resize', this._onWindowResize);
        document.addEventListener('click', this._onDocumentClick);
      }, 0);

      return;
    }

    if (!enable && this._listenersEnabled) {
      window.removeEventListener('resize', this._onWindowResize);
      document.removeEventListener('click', this._onDocumentClick);
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

    const parent = this.node.parentNode;
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
    const elementRect = getRect(element);

    if (this.props.container && this.props.container !== document.body) {
      const containerRect = getRect(this.props.container);
      elementRect.left -= containerRect.left;
      elementRect.top -= containerRect.top;
    }

    return elementRect;
  }

  _doesPopupOverflowVertically(styles) {
    if (!this.props.autoPositioning) {
      return false;
    }
    if (styles.top < 0) {
      return true;
    }
    const popupHeight = this.node.clientHeight;
    const documentHeight = Math.max(document.body.scrollHeight, document.documentElement.clientHeight);
    const verticalDiff = documentHeight - styles.top - popupHeight;

    if (verticalDiff < this.props.sidePadding) {
      return true;
    }
  }

  _doesPopupOverflowHorizontally(styles) {
    if (!this.props.autoPositioning) {
      return false;
    }
    if (styles.left < 0) {
      return true;
    }
    const popupWidth = this.node.clientWidth;
    const documentWidth = Math.max(document.body.scrollWidth, document.documentElement.clientWidth);
    const horizontalDiff = documentWidth - styles.left - popupWidth;

    if (horizontalDiff < this.props.sidePadding) {
      return true;
    }
  }

  _getPositionStyles(corner, left, top, anchor, anchorLeft, anchorTop) {
    /* eslint-enable no-bitwise */

    switch (corner) {
      case Corner.TOP_LEFT:
        return {
          left: anchorLeft + left,
          top: anchorTop + top
        };

      case Corner.TOP_RIGHT:
        return {
          left: anchorLeft + anchor.width + left,
          top: anchorTop + top
        };

      case Corner.BOTTOM_LEFT:
        return {
          left: anchorLeft + left,
          top: anchorTop + anchor.height + top
        };

      case Corner.BOTTOM_RIGHT:
        return {
          left: anchorLeft + anchor.width + left,
          top: anchorTop + anchor.height + top
        };

      default:
        throw new Error('Unknown corner type: ' + corner);
    }
  }

  _getBodyScroll() {
    return {
      left: window.pageXOffset || document.documentElement.scrollLeft,
      top: window.pageYOffset || document.documentElement.scrollTop
    };
  }

  /**
   * @return {Object}
   * @private
   */
  _getStyles() {
    let styles = {};
    const props = this.props;

    let top = props.top;
    let left = props.left;

    let anchorElement = document.body;
    if (isMounted(props.anchorElement)) {
      anchorElement = props.anchorElement;
    }

    const isInsideBody = this.props.container === document.body;

    const anchor = this.getElementOffset(anchorElement);
    let anchorLeft = anchor.left;
    let anchorTop = anchor.top;

    if (isInsideBody) {
      const scroll = this._getBodyScroll();
      anchorLeft += scroll.left;
      anchorTop += scroll.top;
    }

    /* eslint-disable no-bitwise */
    if (this.node) {
      if (props.direction & Direction.UP) {
        top -= this.node.clientHeight;
      }

      if (props.direction & Direction.LEFT) {
        left -= this.node.clientWidth;
      }

      styles = this._getPositionStyles(props.corner, left, top, anchor, anchorLeft, anchorTop);

      if (this._doesPopupOverflowHorizontally(styles)) {
        if (props.direction & Direction.RIGHT) {
          left -= this.node.clientWidth;
        } else if (props.direction & Direction.LEFT) {
          left += this.node.clientWidth;
        }

        const newCorner = OPPOSITE_HORIZONTAL_CORNER[props.corner];
        styles = this._getPositionStyles(newCorner, left, top, anchor, anchorLeft, anchorTop);
      }

      if (this._doesPopupOverflowVertically(styles)) {
        if (props.direction & Direction.DOWN) {
          top -= this.node.clientHeight;
        } else if (props.direction & Direction.UP) {
          top += this.node.clientHeight;
        }

        const newCorner = OPPOSITE_VERTICAL_CORNER[props.corner];

        styles = this._getPositionStyles(newCorner, left, top, anchor, anchorLeft, anchorTop);
      }
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
      default:
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
