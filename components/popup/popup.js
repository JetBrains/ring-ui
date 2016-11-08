/**
 * @name Popup
 * @category Components
 * @description Displays a popup.
 */

import React, {PropTypes} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import classNames from 'classnames';
import 'dom4';

import RingComponentWithShortcuts from '../ring-component/ring-component_with-shortcuts';
import {getStyles, isMounted, getRect, getDocumentScrollLeft, getDocumentScrollTop, getWindowHeight} from '../dom/dom';

import './popup.scss';

const Directions = {
  BOTTOM_RIGHT: 'BOTTOM_RIGHT',
  BOTTOM_LEFT: 'BOTTOM_LEFT',
  BOTTOM_CENTER: 'BOTTOM_CENTER',
  TOP_LEFT: 'TOP_LEFT',
  TOP_RIGHT: 'TOP_RIGHT',
  TOP_CENTER: 'TOP_CENTER',
  RIGHT_TOP: 'RIGHT_TOP',
  RIGHT_BOTTOM: 'RIGHT_BOTTOM',
  RIGHT_CENTER: 'RIGHT_CENTER',
  LEFT_TOP: 'LEFT_TOP',
  LEFT_BOTTOM: 'LEFT_BOTTOM',
  LEFT_CENTER: 'LEFT_CENTER'
};

/**
 * When positioning a popup, directions will be tried in the listed order.
 * @type {Array.<string>}
 */
const DEFAULT_DIRECTIONS = [
  Directions.BOTTOM_RIGHT, Directions.BOTTOM_LEFT, Directions.TOP_LEFT, Directions.TOP_RIGHT,
  Directions.RIGHT_TOP, Directions.RIGHT_BOTTOM, Directions.LEFT_TOP, Directions.LEFT_BOTTOM,
  // Fall back to the first option
  Directions.BOTTOM_RIGHT
];

/**
 * @enum {number}
 */
const Dimension = {
  MARGIN: 16,
  BORDER_WIDTH: 1
};

class OpenedPopupRegistry {

  _registry = {};

  constructor() {}

  _findNearestParentUid(reactPopupInstance) {
    let checkingNode = reactPopupInstance.props.anchorElement;
    while (checkingNode) {
      const popupUid = checkingNode.getAttribute && checkingNode.getAttribute('data-popup-uid');
      if (popupUid && this._registry[popupUid]) {
        return popupUid;
      }
      checkingNode = checkingNode.parentNode;
    }

    return undefined;
  }

  isRegistered(reactPopupInstance) {
    return !!this._registry[reactPopupInstance.uid];
  }

  register(reactPopupInstance) {
    if (this.isRegistered(reactPopupInstance)) {
      return;
    }

    this._registry[reactPopupInstance.uid] = {
      instance: reactPopupInstance,
      childUid: null
    };

    const parentPopupIdentifier = this._findNearestParentUid(reactPopupInstance);
    if (parentPopupIdentifier) {
      this._registry[parentPopupIdentifier].childUid = reactPopupInstance.uid;
    }
  }

  unregister(reactPopupInstance) {
    this._registry[reactPopupInstance.uid] = undefined;
  }

  getChildren(reactPopupInstance) {
    const openedChildrenUid = this._registry[reactPopupInstance.uid] && this._registry[reactPopupInstance.uid].childUid;
    if (openedChildrenUid && this._registry[openedChildrenUid]) {
      const child = this._registry[openedChildrenUid].instance;
      return [child].concat(this.getChildren(child));
    }
    return [];
  }

  unregisterAll() {
    Object.keys(this._registry).
      forEach(registryItem => {
        if (this._registry[registryItem]) {
          this.unregister(this._registry[registryItem].instance);
        }
      });
  }

  getAllInstances() {
    return Object.keys(this._registry).
      filter(key => this._registry[key]).
      map(key => this._registry[key].instance);
  }
}

const POPUP_REGISTRY = new OpenedPopupRegistry();


/**
 * @constructor
 * @name Popup
 * @extends {ReactComponent}
 * @example-file ./popup.examples.html
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
    Directions,
    Dimension
  };

  static hideAllPopups() {
    const allInstances = POPUP_REGISTRY.getAllInstances();
    allInstances.forEach(instance => instance.hide());
    POPUP_REGISTRY.unregisterAll();
  }

  /**
   * Finds and returns the closest DOM node with position: fixed, or null if none found
   * @param currentElement
   * @returns {DOMNode|null}
   */
  static closestFixedParent(currentElement) {
    if (!currentElement || currentElement === document.body) {
      return null;
    }

    let node = currentElement;

    while ((node = node.parentNode) && node instanceof Element) {
      if (getStyles(node).position === 'fixed' || node.classList.contains('ring-popup-container-mark')) {
        return node;
      }
    }

    return null;
  }

  /**
   * @static
   * @param {ReactComponent} component
   * @param {Function} callback Callback to execute after rendering
   * @param {Object=} params Optional params
   * @param {Function} params.onRender Callback to run after rendering
   * @param {HTMLElement} params.container Container to put the popup element in
   * @return {HTMLElement}
   */
  static renderPopup(component, {onRender, container: customContainer} = {}) {
    const wrapperElement = document.createElement('div');
    const container = customContainer || component.props && this.closestFixedParent(component.props.anchorElement) || document.body;
    container.appendChild(wrapperElement);

    const popupInstance = render(component, wrapperElement);

    popupInstance.rerender({container}, onRender);
    return popupInstance;
  }

  state = {
    display: this.props.hidden ? 0 : 1 // 0 - hidden, 1 - display in progress, 2 - visible
  };

  constructor(...args) {
    super(...args);

    this.uid = this.constructor.getUID('ring-popup-');

    this._onWindowResize = this._onWindowResize.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);
    this.remove = this.remove.bind(this);
  }

  getShortcutsProps() {
    return {
      map: {
        esc: ::this.close
      },
      scope: this.uid
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
    POPUP_REGISTRY.register(this);
    const {onMouseDown, onMouseUp} = this.props;
    const classes = classNames({
      'ring-popup': true,
      'ring-popup_bound': this.props.cutEdge
    }, this.props.className);

    return (
      <div
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        data-popup-uid={this.uid}
        className={classes}
        style={this._getStyles()}
      >
        {this.getInternalContent()}
      </div>
    );
  }

  /**
   * Closes the popup and (optionally) removes it from the document
   */
  close(evt) {
    let onCloseResult;

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

    POPUP_REGISTRY::POPUP_REGISTRY.unregister(this);

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
   * Removes the popup from the document
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

    const children = POPUP_REGISTRY.getChildren(this);
    const clickToChildPopupNode = children.some(
      childPopup => childPopup.node && childPopup.node.contains(evt.target)
    );
    if (clickToChildPopupNode) {
      return;
    }

    if (!this.props.anchorElement || !this.props.dontCloseOnAnchorClick || !this.props.anchorElement.contains(evt.target)) {
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

  _verticalOverflow(styles, scrollingCoordinates) {
    if (!this.props.autoPositioning) {
      return 0;
    }
    const viewportMinX = scrollingCoordinates.top + this.props.sidePadding;
    const viewportMaxX = scrollingCoordinates.top + getWindowHeight() - this.props.sidePadding;

    const topOverflow = styles.top < viewportMinX ? viewportMinX - styles.top : 0;

    const popupHeight = this.node.clientHeight;
    const verticalDiff = viewportMaxX - styles.top - popupHeight;
    const bottomOverflow = verticalDiff < 0 ? Math.abs(verticalDiff) : 0;

    return topOverflow + bottomOverflow;
  }

  _horizontalOverflow(styles, scrollingCoordinates) {
    if (!this.props.autoPositioning) {
      return 0;
    }
    const viewportMinY = scrollingCoordinates.left + this.props.sidePadding;
    const viewportMaxY = scrollingCoordinates.left + window.innerWidth - this.props.sidePadding;

    const leftOverflow = styles.left < viewportMinY ? viewportMinY - styles.left : 0;

    const popupWidth = this.node.clientWidth;
    const horizontalDiff = viewportMaxY - styles.left - popupWidth;
    const rightOverflow = horizontalDiff < 0 ? Math.abs(horizontalDiff) : 0;

    return leftOverflow + rightOverflow;
  }

  _getPositionStyles(anchor, anchorLeft, anchorTop) {
    const popupWidth = this.node.clientWidth;
    const popupHeight = this.node.clientHeight;

    const anchorBottom = anchorTop + anchor.height;
    const anchorRight = anchorLeft + anchor.width;

    const popupLeft = anchorLeft - popupWidth;
    const popupTop = anchorTop - popupHeight;
    const popupRightToLeft = anchorRight - popupWidth;
    const popupHorizontalCenter = anchorLeft + anchor.width / 2 - popupWidth / 2;
    const popupVerticalCenter = anchorTop + anchor.height / 2 - popupHeight / 2;
    const popupBottomToTop = anchorBottom - popupHeight;

    return {
      [Directions.BOTTOM_RIGHT]: {left: anchorLeft, top: anchorBottom},
      [Directions.BOTTOM_LEFT]: {left: popupRightToLeft, top: anchorBottom},
      [Directions.BOTTOM_CENTER]: {left: popupHorizontalCenter, top: anchorBottom},
      [Directions.TOP_LEFT]: {left: popupRightToLeft, top: popupTop},
      [Directions.TOP_RIGHT]: {left: anchorLeft, top: popupTop},
      [Directions.TOP_CENTER]: {left: popupHorizontalCenter, top: popupTop},
      [Directions.LEFT_BOTTOM]: {left: popupLeft, top: anchorTop},
      [Directions.LEFT_TOP]: {left: popupLeft, top: popupBottomToTop},
      [Directions.LEFT_CENTER]: {left: popupLeft, top: popupVerticalCenter},
      [Directions.RIGHT_BOTTOM]: {left: anchorRight, top: anchorTop},
      [Directions.RIGHT_TOP]: {left: anchorRight, top: popupBottomToTop},
      [Directions.RIGHT_CENTER]: {left: anchorRight, top: popupVerticalCenter}
    };
  }

  _getScrollingCoordinates() {
    const isInsideBody = this.props.container === document.body;

    if (isInsideBody) {
      return {
        top: getDocumentScrollTop(),
        left: getDocumentScrollLeft()
      };
    }
    if (this.props.container) {
      const container = this.props.container;
      return {
        top: container.scrollTop,
        left: container.scrollLeft
      };
    }

    return {top: 0, left: 0};
  }

  /**
   * @return {Object}
   * @private
   */
  _getStyles() {
    let styles = {
      top: 0,
      left: 0
    };
    const props = this.props;

    let anchorElement = document.body;
    if (isMounted(props.anchorElement)) {
      anchorElement = props.anchorElement;
    }

    const anchor = this.getElementOffset(anchorElement);
    const scroll = this._getScrollingCoordinates();
    const anchorLeft = anchor.left + scroll.left;
    const anchorTop = anchor.top + scroll.top;

    if (this.node) {
      const directionsMatrix = this._getPositionStyles(anchor, anchorLeft, anchorTop);

      const directionStylesSortedByIncreasingOverflow = props.directions.
        filter(direction => directionsMatrix[direction]).
        map(direction => directionsMatrix[direction]).
        sort((firstDirectionStyles, secondDirectionStyles) => {
          const firstDirectionOverflow = this._verticalOverflow(firstDirectionStyles, scroll) + this._horizontalOverflow(firstDirectionStyles, scroll);
          const secondDirectionOverflow = this._verticalOverflow(secondDirectionStyles, scroll) + this._horizontalOverflow(secondDirectionStyles, scroll);
          return firstDirectionOverflow - secondDirectionOverflow;
        });

      styles = directionStylesSortedByIncreasingOverflow[0];
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
    styles.minWidth = styles.minWidth && `${styles.minWidth.toString()}px`;

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
