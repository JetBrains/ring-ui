/**
 * @fileoverview Popup.
 */

import React, {PropTypes} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import classNames from 'classnames';

import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';
import {getStyles, isMounted, getRect} from '../dom/dom';

import './popup.scss';

const Directions = {
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  RIGHT_TOP: 'right-top',
  RIGHT_BOTTOM: 'right-bottom',
  LEFT_TOP: 'left-top',
  LEFT_BOTTOM: 'left-bottom'
};

/**
 * This directions is default for popup. Suitable directoin will be chosen.
 * @type {*[]}
 */
const DEFAULT_DIRECTIONS = [
  Directions.BOTTOM_RIGHT, Directions.BOTTOM_LEFT, Directions.TOP_LEFT, Directions.TOP_RIGHT,
  Directions.RIGHT_TOP, Directions.RIGHT_BOTTOM, Directions.LEFT_TOP, Directions.LEFT_BOTTOM,
  // Finally fallback to bottom-right if it's not possbile to find any suitable direction
  Directions.BOTTOM_RIGHT
];

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
 <div id="target1" class="popup-example__anchor popup-example__anchor_left"></div>
 <div id="target2" class="popup-example__anchor popup-example__anchor_right"></div>
 <div id="target3" class="popup-example__anchor popup-example__anchor_bottom-left"></div>
 <button id="switch3" class="popup-example__button">Show again</button>
 <div id="target4" class="popup-example__anchor popup-example__anchor_bottom-right"></div>
 </div>
 </file>
 <file name="index.js" webpack="true">
   require('./index.scss');
   var DOM = require('react').DOM;
   var Popup = require('ring-ui/components/popup/popup');
   var Directions = Popup.PopupProps.Directions;

   var container = DOM.span(null, 'Helloworld!');

   var popup = Popup.renderPopup(Popup.factory({
     anchorElement: document.getElementById('target1'),
     directions: [Directions.BOTTOM_RIGHT],
     autoRemove: false
   }, container));

   var popup2 = Popup.renderPopup(Popup.factory({
     anchorElement: document.getElementById('target2'),
     directions: [Directions.BOTTOM_LEFT],
     autoRemove: false
   }, container));

   var popup3 = Popup.renderPopup(Popup.factory({
     anchorElement: document.getElementById('target3'),
     directions: [Directions.TOP_RIGHT],
     autoRemove: false
   }, container));

   var popup4 = Popup.renderPopup(Popup.factory({
     anchorElement: document.getElementById('target4'),
     directions: [Directions.TOP_LEFT],
     autoRemove: false
   }, container));

   document.getElementById('switch3').addEventListener('click', function() {
      setTimeout(function() {
        popup3.show();
      }, 1);
   });
 </file>
   <file name="index.scss">
      .popup-example__button {
        position: absolute;
        left: 50px;
        bottom: 50px;
      }

      .popup-example__anchor {
        position: absolute;
        width: 10px;
        height: 10px;

        &_left {
          left: 0;
          top: 0;
          background-color: red;
        }

        &_right {
          right: 0;
          top: 0;
          background-color: blue;
        }

        &_bottom-left {
          left: 0;
          bottom: 0;
          background-color: green;
        }

        &_bottom-right {
          right: 0;
          bottom: 0;
          background-color: orange;
        }
      }
   </file>
 </example>

 <example name="Popup autoposition">
   <file name="index.html">
   <div>
     <div class="popup-example__message">Popup should change open direction when reaching window borders</div>
     <div id="leftSide" class="popup-example__anchor popup-example__anchor_left">Left side open popup</div>
     <div id="rightSide" class="popup-example__anchor popup-example__anchor_right">Right side open popup</div>
     <div id="downSide" class="popup-example__anchor popup-example__anchor_bottom">Downside open popup</div>
     <div id="topSide" class="popup-example__anchor popup-example__anchor_top">Upside open popup</div>
   </div>
   </file>
   <file name="index.scss">
      .popup-example__message {
        position: absolute;

        top: 50%;
        left: 300px;
      }
      .popup-example__anchor {
        position: absolute;

        &_left {
          left: 0;
          top: 50px;
        }

        &_right {
          right: 0;
          top: 50px;
        }

        &_bottom {
          left: 150px;
          bottom: 0;
        }

        &_top {
          right: 150px;
          top: 0;
        }
      }
   </file>
   <file name="index.js" webpack="true">
     require('./index.scss');
     var DOM = require('react').DOM;
     var Popup = require('ring-ui/components/popup/popup');
     var Directions = Popup.PopupProps.Directions;

     var container = DOM.span({style: {whiteSpace: 'no-wrap'}}, 'This is popup');

     var popup = Popup.renderPopup(Popup.factory({
       anchorElement: document.getElementById('leftSide'),
       directions: [Directions.LEFT_BOTTOM, Directions.RIGHT_BOTTOM],
       autoRemove: false
     }, container));

     var popup2 = Popup.renderPopup(Popup.factory({
       anchorElement: document.getElementById('rightSide'),
       directions: [Directions.RIGHT_BOTTOM, Directions.LEFT_BOTTOM],
       autoRemove: false
     }, container));

     var popup3 = Popup.renderPopup(Popup.factory({
       anchorElement: document.getElementById('downSide'),
       directions: [Directions.BOTTOM_RIGHT, Directions.TOP_LEFT],
       autoRemove: false
     }, container));

     var popup4 = Popup.renderPopup(Popup.factory({
       anchorElement: document.getElementById('topSide'),
       directions: [Directions.TOP_LEFT, Directions.BOTTOM_RIGHT],
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
    directions: PropTypes.array,
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
    directions: DEFAULT_DIRECTIONS,
    autoPositioning: true,
    sidePadding: 8
  };

  static PopupProps = {
    Directions: Directions,
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

  _getPositionStyles(direction, anchor, anchorLeft, anchorTop) {
    const popupWidth = this.node.clientWidth;
    const popupHeight = this.node.clientHeight;

    const anchorBottom = anchorTop + anchor.height;
    const anchorRight = anchorLeft + anchor.width;

    const popupLeft = anchorLeft - popupWidth;
    const popupTop = anchorTop - popupHeight;
    const popupRightToLeft = anchorRight - popupWidth;
    const popupBottomToTop = anchorBottom - popupHeight;

    const directionsMatrix = {
      [Directions.BOTTOM_RIGHT]: {left: anchorLeft, top: anchorBottom},
      [Directions.BOTTOM_LEFT]: {left: popupRightToLeft, top: anchorBottom},
      [Directions.TOP_LEFT]: {left: popupRightToLeft, top: popupTop},
      [Directions.TOP_RIGHT]: {left: anchorLeft, top: popupTop},
      [Directions.LEFT_BOTTOM]: {left: popupLeft, top: anchorTop},
      [Directions.LEFT_TOP]: {left: popupLeft, top: popupBottomToTop},
      [Directions.RIGHT_BOTTOM]: {left: anchorRight, top: anchorTop},
      [Directions.RIGHT_TOP]: {left: anchorRight, top: popupBottomToTop}
    };

    if (directionsMatrix[direction]) {
      return directionsMatrix[direction];
    }

    throw new Error(`Unknown popup direction: ${direction}. Use one of this:
    [${Object.keys(Directions).join(', ')}]`);
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

    if (this.node) {
      for (const direction of props.directions) {
        styles = this._getPositionStyles(direction, anchor, anchorLeft, anchorTop);

        if (!this._doesPopupOverflowVertically(styles) && !this._doesPopupOverflowHorizontally(styles)) {
          break;
        }
      }
    }

    if (props.top) {
      styles.top += props.top;
    }

    if (props.left) {
      styles.left += props.left;
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
