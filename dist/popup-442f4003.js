import { d as _defineProperty, _ as _inherits, a as _createSuper, b as _classCallCheck, g as _assertThisInitialized, i as _objectSpread2, c as _createClass } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { g as getUID } from './get-uid-bf3ab014.js';
import { s as scheduleRAF } from './schedule-raf-edeb21db.js';
import { g as getRect, b as isMounted, c as getDocumentScrollTop, d as getDocumentScrollLeft, e as getWindowHeight, L as Listeners, f as getStyles } from './dom-0ae85140.js';
import Shortcuts from './shortcuts.js';
import { j as joinDataTestAttributes } from './data-tests-1a367745.js';
import TabTrap from './tab-trap.js';
import styleInject from 'style-inject';
import { a as PopupTargetContext, P as PopupTarget } from './popup.target-9daf0591.js';

var Directions = {
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

var DEFAULT_DIRECTIONS = [Directions.BOTTOM_RIGHT, Directions.BOTTOM_LEFT, Directions.TOP_LEFT, Directions.TOP_RIGHT, Directions.RIGHT_TOP, Directions.RIGHT_BOTTOM, Directions.LEFT_TOP, Directions.LEFT_BOTTOM];
/**
 * @enum {number}
 */

var Dimension = {
  MARGIN: 16,
  BORDER_WIDTH: 1
};
var MinWidth = {
  TARGET: -1
};
var MaxHeight = {
  SCREEN: -1
};
var Display = {
  HIDDEN: 0,
  SHOWING: 1,
  SHOWN: 2
};

function getScrollingCoordinates(container) {
  if (container !== null) {
    return {
      top: container.scrollTop,
      left: container.scrollLeft
    };
  }

  return {
    top: getDocumentScrollTop(),
    left: getDocumentScrollLeft()
  };
}

function getPositionStyles(popup, anchorRect, anchorLeft, anchorTop, offset) {
  var _ref;

  var popupWidth = popup.clientWidth;
  var popupHeight = popup.clientHeight;
  var anchorBottom = anchorTop + anchorRect.height;
  var anchorRight = anchorLeft + anchorRect.width;
  var popupLeft = anchorLeft - popupWidth;
  var popupTop = anchorTop - popupHeight;
  var popupRightToLeft = anchorRight - popupWidth;
  var popupHorizontalCenter = anchorLeft + anchorRect.width / 2 - popupWidth / 2;
  var popupVerticalCenter = anchorTop + anchorRect.height / 2 - popupHeight / 2;
  var popupBottomToTop = anchorBottom - popupHeight;
  return _ref = {}, _defineProperty(_ref, Directions.BOTTOM_RIGHT, {
    left: anchorLeft,
    top: anchorBottom + offset
  }), _defineProperty(_ref, Directions.BOTTOM_LEFT, {
    left: popupRightToLeft,
    top: anchorBottom + offset
  }), _defineProperty(_ref, Directions.BOTTOM_CENTER, {
    left: popupHorizontalCenter,
    top: anchorBottom + offset
  }), _defineProperty(_ref, Directions.TOP_RIGHT, {
    left: anchorLeft,
    top: popupTop - offset
  }), _defineProperty(_ref, Directions.TOP_LEFT, {
    left: popupRightToLeft,
    top: popupTop - offset
  }), _defineProperty(_ref, Directions.TOP_CENTER, {
    left: popupHorizontalCenter,
    top: popupTop - offset
  }), _defineProperty(_ref, Directions.LEFT_BOTTOM, {
    left: popupLeft - offset,
    top: anchorTop
  }), _defineProperty(_ref, Directions.LEFT_TOP, {
    left: popupLeft - offset,
    top: popupBottomToTop
  }), _defineProperty(_ref, Directions.LEFT_CENTER, {
    left: popupLeft - offset,
    top: popupVerticalCenter
  }), _defineProperty(_ref, Directions.RIGHT_BOTTOM, {
    left: anchorRight + offset,
    top: anchorTop
  }), _defineProperty(_ref, Directions.RIGHT_TOP, {
    left: anchorRight + offset,
    top: popupBottomToTop
  }), _defineProperty(_ref, Directions.RIGHT_CENTER, {
    left: anchorRight + offset,
    top: popupVerticalCenter
  }), _ref;
}

function verticalOverflow(styles, scrollingCoordinates, attrs) {
  var containerHeight = attrs.container !== null ? attrs.container.clientHeight : getWindowHeight();
  var viewportMinX = scrollingCoordinates.top + attrs.sidePadding;
  var viewportMaxX = scrollingCoordinates.top + containerHeight - attrs.sidePadding;
  var topOverflow = Math.max(viewportMinX - styles.top, 0);
  var popupHeight = attrs.popup.clientHeight;
  var verticalDiff = styles.top + popupHeight - viewportMaxX;
  var bottomOverflow = Math.max(verticalDiff, 0);
  return topOverflow + bottomOverflow;
}

function horizontalOverflow(styles, scrollingCoordinates, attrs) {
  var containerWidth = attrs.container !== null ? attrs.container.clientWidth : window.innerWidth;
  var viewportMinY = scrollingCoordinates.left + attrs.sidePadding;
  var viewportMaxY = scrollingCoordinates.left + containerWidth - attrs.sidePadding;
  var leftOverflow = Math.max(viewportMinY - styles.left, 0);
  var popupWidth = attrs.popup.clientWidth;
  var horizontalDiff = styles.left + popupWidth - viewportMaxY;
  var rightOverflow = Math.max(horizontalDiff, 0);
  return leftOverflow + rightOverflow;
}

var positionPropKeys = ['directions', 'autoPositioning', 'autoCorrectTopOverflow', 'sidePadding', 'top', 'left', 'offset', 'maxHeight', 'minWidth'];
var defaultcontainerRect = {
  top: 0,
  left: 0
};

function handleTopOffScreen(_ref2) {
  var sidePadding = _ref2.sidePadding,
      styles = _ref2.styles,
      anchorRect = _ref2.anchorRect,
      maxHeight = _ref2.maxHeight,
      popupScrollHeight = _ref2.popupScrollHeight,
      direction = _ref2.direction,
      scroll = _ref2.scroll;
  var BORDER_COMPENSATION = 1;
  var TOP_LEFT = Directions.TOP_LEFT,
      TOP_RIGHT = Directions.TOP_RIGHT,
      TOP_CENTER = Directions.TOP_CENTER,
      RIGHT_TOP = Directions.RIGHT_TOP,
      LEFT_TOP = Directions.LEFT_TOP;
  var openedToTop = [TOP_LEFT, TOP_RIGHT, TOP_CENTER, RIGHT_TOP, LEFT_TOP].includes(direction);

  if (!openedToTop) {
    return styles;
  }

  var isAttachedToAnchorTop = [TOP_LEFT, TOP_CENTER, TOP_RIGHT].includes(direction);
  var attachingPointY = isAttachedToAnchorTop ? anchorRect.top : anchorRect.bottom;
  var effectiveHeight = maxHeight ? Math.min(popupScrollHeight, maxHeight) : popupScrollHeight;
  var hypotheticalTop = attachingPointY - effectiveHeight;

  if (hypotheticalTop <= sidePadding) {
    styles.top = sidePadding + scroll.top;
    styles.maxHeight = attachingPointY - sidePadding + BORDER_COMPENSATION;
  }

  return styles;
}

function maxHeightForDirection(direction, anchorNode, containerNode) {
  var container = containerNode || document.documentElement;
  var domRect = anchorNode.getBoundingClientRect();
  var containerRect = container.getBoundingClientRect();
  var topMaxHeight = Math.max(domRect.top - containerRect.top, 0);
  var containerHeight = Math.max(containerRect.height, // XXX
  // If container is the document element
  // then we check client height too because we may have situation when
  // "height" from "getBoundingClientRect" less then "clientHeight".
  container === document.documentElement ? container.clientHeight : 0);
  var bottomMaxHeight = Math.max(containerHeight - (topMaxHeight + domRect.height), 0);

  switch (direction) {
    case Directions.TOP_LEFT:
    case Directions.TOP_CENTER:
    case Directions.TOP_RIGHT:
      return topMaxHeight;

    case Directions.BOTTOM_LEFT:
    case Directions.BOTTOM_CENTER:
    case Directions.BOTTOM_RIGHT:
      return bottomMaxHeight;

    case Directions.LEFT_BOTTOM:
    case Directions.RIGHT_BOTTOM:
      return domRect.height + bottomMaxHeight;

    case Directions.LEFT_TOP:
    case Directions.RIGHT_TOP:
      return domRect.height + topMaxHeight;

    case Directions.RIGHT_CENTER:
    case Directions.LEFT_CENTER:
      return domRect.height / 2 + Math.min(bottomMaxHeight / 2, topMaxHeight / 2);

    default:
      return null;
  }
}
function position(attrs) {
  var popup = attrs.popup,
      anchor = attrs.anchor,
      container = attrs.container,
      directions = attrs.directions,
      autoPositioning = attrs.autoPositioning,
      sidePadding = attrs.sidePadding,
      top = attrs.top,
      left = attrs.left,
      offset = attrs.offset,
      maxHeight = attrs.maxHeight,
      minWidth = attrs.minWidth,
      _attrs$autoCorrectTop = attrs.autoCorrectTopOverflow,
      autoCorrectTopOverflow = _attrs$autoCorrectTop === void 0 ? true : _attrs$autoCorrectTop;
  var styles = {
    top: 0,
    left: 0
  };
  var chosenDirection = null;
  var containerRect = container !== null ? getRect(container) : defaultcontainerRect;
  var defaultAnchor = container !== null ? container : document.body;
  var anchorRect = getRect(isMounted(anchor) ? anchor : defaultAnchor);
  var scroll = getScrollingCoordinates(container);
  var anchorLeft = anchorRect.left + scroll.left + left - containerRect.left;
  var anchorTop = anchorRect.top + scroll.top + top - containerRect.top;

  if (popup) {
    var directionsMatrix = getPositionStyles(popup, anchorRect, anchorLeft, anchorTop, offset);

    if (!autoPositioning || directions.length === 1) {
      styles = directionsMatrix[directions[0]];
      chosenDirection = directions[0];
    } else {
      var sortedByIncreasingOverflow = directions. // Fall back to the first option
      concat(directions[0]).filter(function (direction) {
        return directionsMatrix[direction];
      }).map(function (direction) {
        return {
          styles: directionsMatrix[direction],
          direction: direction
        };
      }).sort(function (_ref3, _ref4) {
        var stylesA = _ref3.styles;
        var stylesB = _ref4.styles;
        var overflowA = verticalOverflow(stylesA, scroll, attrs) + horizontalOverflow(stylesA, scroll, attrs);
        var overflowB = verticalOverflow(stylesB, scroll, attrs) + horizontalOverflow(stylesB, scroll, attrs);
        return overflowA - overflowB;
      });
      styles = sortedByIncreasingOverflow[0].styles;
      chosenDirection = sortedByIncreasingOverflow[0].direction;
    } // because of the anchor negative margin top and left also may become negative


    ['left', 'top'].forEach(function (key) {
      if (styles[key] < 0) {
        styles[key] = 0;
      }
    });
  }

  if (maxHeight === MaxHeight.SCREEN || maxHeight === 'screen') {
    // this feature works properly only when direction is BOTTOM_* or *_BOTTOM
    styles.maxHeight = window.innerHeight + scroll.top - styles.top - Dimension.MARGIN;
  } else if (maxHeight) {
    styles.maxHeight = maxHeight;
  }

  if (autoCorrectTopOverflow) {
    styles = handleTopOffScreen({
      sidePadding: sidePadding,
      styles: styles,
      anchorRect: anchorRect,
      maxHeight: maxHeight,
      direction: chosenDirection,
      popupScrollHeight: popup.scrollHeight,
      scroll: scroll
    });
  }

  if (minWidth === MinWidth.TARGET || minWidth === 'target') {
    styles.minWidth = anchorRect.width;
  } else if (minWidth) {
    styles.minWidth = anchorRect.width < minWidth ? minWidth : anchorRect.width;
  }

  return {
    styles: styles,
    direction: chosenDirection
  };
}

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.popup_popup__1uxwL {\n\n  position: fixed;\n  z-index: 5;\n  z-index: var(--ring-overlay-z-index);\n  top: -100vh;\n  left: -100vw;\n\n  overflow-y: auto;\n\n  box-sizing: border-box;\n\n  border: 1px solid rgba(0, 42, 76, 0.1);\n\n  border: 1px solid var(--ring-popup-border-color);\n  border-radius: 3px;\n  border-radius: var(--ring-border-radius);\n\n  background-color: #fff;\n\n  background-color: var(--ring-popup-background-color);\n  box-shadow: 0 2px 16px 0 rgba(0, 42, 76, 0.15);\n  box-shadow: 0 2px 16px 0 var(--ring-popup-shadow-color);\n}\n\n.popup_hidden__nl_Yx {\n  display: none;\n}\n\n.popup_showing__2pmjG {\n  opacity: 0;\n}\n\n.popup_attached__1XyQd {\n  border-top: 0;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n}\n";
var styles = {"popup":"popup_popup__1uxwL global_font__2H0e4","hidden":"popup_hidden__nl_Yx","showing":"popup_showing__2pmjG","attached":"popup_attached__1XyQd"};
styleInject(css_248z);

var stop = function stop(e) {
  return e.stopPropagation();
};

var getPopupContainer = function getPopupContainer(target) {
  return typeof target === 'string' ? document.querySelector("[data-portaltarget=".concat(target, "]")) : target;
};
/**
 * @constructor
 * @name Popup
 * @extends {ReactComponent}
 */

var Popup = /*#__PURE__*/function (_PureComponent) {
  _inherits(Popup, _PureComponent);

  var _super = _createSuper(Popup);

  function Popup() {
    var _this;

    _classCallCheck(this, Popup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      display: Display.SHOWING
    });

    _defineProperty(_assertThisInitialized(_this), "listeners", new Listeners());

    _defineProperty(_assertThisInitialized(_this), "redrawScheduler", scheduleRAF(true));

    _defineProperty(_assertThisInitialized(_this), "uid", getUID('popup-'));

    _defineProperty(_assertThisInitialized(_this), "calculateDisplay", function (prevState) {
      return _objectSpread2(_objectSpread2({}, prevState), {}, {
        display: _this.props.hidden ? Display.SHOWING : Display.SHOWN
      });
    });

    _defineProperty(_assertThisInitialized(_this), "portalRef", function (el) {
      _this.node = el;
      _this.parent = el && el.parentElement;

      if (el && _this.getContainer()) {
        _this._redraw();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "popupRef", function (el) {
      _this.popup = el;

      _this._redraw();
    });

    _defineProperty(_assertThisInitialized(_this), "containerRef", function (el) {
      _this.container = el;
    });

    _defineProperty(_assertThisInitialized(_this), "_updateDirection", function (newDirection) {
      if (_this.state.direction !== newDirection) {
        _this.setState({
          direction: newDirection
        });

        if (_this.props.onDirectionChange) {
          _this.props.onDirectionChange(newDirection);
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_updatePosition", function () {
      if (_this.popup) {
        _this.popup.style.position = 'absolute';

        if (_this.isVisible()) {
          var _this$position = _this.position(),
              style = _this$position.styles,
              direction = _this$position.direction;

          Object.keys(style).forEach(function (key) {
            var value = style[key];

            if (typeof value === 'number') {
              _this.popup.style[key] = "".concat(value, "px");
            } else {
              _this.popup.style[key] = value.toString();
            }
          });

          _this._updateDirection(direction);
        }

        _this.setState(_this.calculateDisplay);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_redraw", function () {
      if (_this.isVisible()) {
        _this.redrawScheduler(_this._updatePosition);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onEscPress", function (evt) {
      _this.props.onEscPress(evt);

      _this._onCloseAttempt(evt, true);
    });

    _defineProperty(_assertThisInitialized(_this), "_onDocumentClick", function (evt) {
      if (_this.container && _this.container.contains(evt.target) || !_this._listenersEnabled || _this.props.dontCloseOnAnchorClick && _this._getAnchor() && _this._getAnchor().contains(evt.target)) {
        return;
      }

      _this.props.onOutsideClick(evt);

      _this._onCloseAttempt(evt, false);
    });

    _defineProperty(_assertThisInitialized(_this), "shortcutsScope", _this.uid);

    _defineProperty(_assertThisInitialized(_this), "shortcutsMap", {
      esc: _this._onEscPress
    });

    return _this;
  }

  _createClass(Popup, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.props.client) {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({
          client: true
        });
      }

      if (!this.props.hidden) {
        this._setListenersEnabled(true);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var hidden = this.props.hidden;

      if (this.props !== prevProps) {
        if (prevProps.hidden !== hidden) {
          this._setListenersEnabled(!hidden);
        }

        this._redraw();
      }

      if (this.props.onShow && !hidden && this.state.display === Display.SHOWN && (prevProps.hidden || prevState.display !== Display.SHOWN)) {
        this.props.onShow();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._setListenersEnabled(false);

      this.popup = null;
    }
  }, {
    key: "shouldUseShortcuts",
    value: function shouldUseShortcuts() {
      var _this$props = this.props,
          shortcuts = _this$props.shortcuts,
          hidden = _this$props.hidden;
      return shortcuts && !hidden;
    }
  }, {
    key: "getContainer",
    value: function getContainer() {
      var target = this.props.target || this.ringPopupTarget;
      return target && getPopupContainer(target);
    }
  }, {
    key: "position",
    value: function position$1() {
      var _this2 = this;

      var positionProps = positionPropKeys.reduce(function (acc, key) {
        acc[key] = _this2.props[key];
        return acc;
      }, {});
      var container = this.getContainer();
      return position(_objectSpread2({
        popup: this.popup,
        container: container && getStyles(container).position !== 'static' ? container : null,
        anchor: this._getAnchor()
      }, positionProps));
    }
  }, {
    key: "_getAnchor",
    value: function _getAnchor() {
      return this.props.anchorElement || this.parent;
    }
    /**
     * @param {boolean} enable
     * @private
     */

  }, {
    key: "_setListenersEnabled",
    value: function _setListenersEnabled(enable) {
      var _this3 = this;

      if (enable && !this._listenersEnabled) {
        setTimeout(function () {
          _this3._listenersEnabled = true;

          _this3.listeners.add(window, 'resize', _this3._redraw);

          _this3.listeners.add(window, 'scroll', _this3._redraw);

          _this3.listeners.add(document, 'click', _this3._onDocumentClick, true);

          var el = _this3._getAnchor();

          while (el) {
            _this3.listeners.add(el, 'scroll', _this3._redraw);

            el = el.parentElement;
          }
        }, 0);
        return;
      }

      if (!enable && this._listenersEnabled) {
        this.listeners.removeAll();
        this._listenersEnabled = false;
      }
    }
    /**
     * Returns visibility state
     * @return {boolean}
     */

  }, {
    key: "isVisible",
    value: function isVisible() {
      return !this.props.hidden;
    }
  }, {
    key: "_onCloseAttempt",
    value: function _onCloseAttempt(evt, isEsc) {
      this.props.onCloseAttempt(evt, isEsc);
    }
  }, {
    key: "getInternalContent",
    value: function getInternalContent() {
      var _this$props2 = this.props,
          trapFocus = _this$props2.trapFocus,
          autoFocusFirst = _this$props2.autoFocusFirst,
          children = _this$props2.children;
      return trapFocus ? /*#__PURE__*/React.createElement(TabTrap, {
        autoFocusFirst: autoFocusFirst,
        focusBackOnExit: true
      }, children) : children;
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames,
          _this4 = this;

      var _this$props3 = this.props,
          className = _this$props3.className,
          style = _this$props3.style,
          hidden = _this$props3.hidden,
          attached = _this$props3.attached,
          keepMounted = _this$props3.keepMounted,
          client = _this$props3.client,
          onMouseDown = _this$props3.onMouseDown,
          onMouseUp = _this$props3.onMouseUp,
          onMouseOver = _this$props3.onMouseOver,
          onMouseOut = _this$props3.onMouseOut,
          onContextMenu = _this$props3.onContextMenu,
          dataTest = _this$props3['data-test'];
      var showing = this.state.display === Display.SHOWING;
      var classes = classNames(className, styles.popup, (_classNames = {}, _defineProperty(_classNames, styles.attached, attached), _defineProperty(_classNames, styles.hidden, hidden), _defineProperty(_classNames, styles.showing, showing), _classNames));
      var direction = (this.state.direction || '').toLowerCase().replace(/[_]/g, '-');
      return /*#__PURE__*/React.createElement(PopupTargetContext.Consumer, null, function (value) {
        _this4.ringPopupTarget = value;
        return /*#__PURE__*/React.createElement("span", {
          // prevent bubbling through portal
          onClick: stop // This handler only blocks bubbling through React portal
          ,
          role: "presentation",
          ref: _this4.portalRef
        }, _this4.shouldUseShortcuts() && /*#__PURE__*/React.createElement(Shortcuts, {
          map: _this4.shortcutsMap,
          scope: _this4.shortcutsScope
        }), (client || _this4.state.client) && (keepMounted || !hidden) && /*#__PURE__*/createPortal( /*#__PURE__*/React.createElement(PopupTarget, {
          id: _this4.uid,
          ref: _this4.containerRef,
          onMouseOver: onMouseOver,
          onFocus: onMouseOver,
          onMouseOut: onMouseOut,
          onBlur: onMouseOut,
          onContextMenu: onContextMenu
        }, /*#__PURE__*/React.createElement("div", {
          "data-test": joinDataTestAttributes('ring-popup', dataTest),
          "data-test-shown": !hidden && !showing,
          "data-test-direction": direction,
          ref: _this4.popupRef,
          className: classes,
          style: style,
          onMouseDown: onMouseDown,
          onMouseUp: onMouseUp // mouse handlers are used to track clicking on inner elements
          ,
          role: "presentation"
        }, _this4.getInternalContent())), _this4.getContainer() || document.body));
      });
    }
  }]);

  return Popup;
}(PureComponent);

_defineProperty(Popup, "propTypes", {
  anchorElement: PropTypes.instanceOf(Node),
  target: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Element)]),
  className: PropTypes.string,
  style: PropTypes.object,
  hidden: PropTypes.bool.isRequired,
  onOutsideClick: PropTypes.func,
  onEscPress: PropTypes.func,
  // onCloseAttempt is a common callback for ESC pressing and outside clicking.
  // Use it if you don't need different behaviors for this cases.
  onCloseAttempt: PropTypes.func,
  children: PropTypes.node.isRequired,
  dontCloseOnAnchorClick: PropTypes.bool,
  shortcuts: PropTypes.bool,
  keepMounted: PropTypes.bool,
  // pass this prop to preserve the popup's DOM state while hidden
  'data-test': PropTypes.string,
  client: PropTypes.bool,
  // true means that it's never used in SSR
  directions: PropTypes.arrayOf(PropTypes.string),
  autoPositioning: PropTypes.bool,
  autoCorrectTopOverflow: PropTypes.bool,
  left: PropTypes.number,
  top: PropTypes.number,
  maxHeight: PropTypes.number,
  minWidth: PropTypes.number,
  sidePadding: PropTypes.number,
  attached: PropTypes.bool,
  // Popup adjacent to an input, without upper border and shadow
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  onContextMenu: PropTypes.func,
  onDirectionChange: PropTypes.func,
  onShow: PropTypes.func,
  // set to true whenever popup contains focusable and scrollable content
  trapFocus: PropTypes.bool,
  autoFocusFirst: PropTypes.bool
});

_defineProperty(Popup, "defaultProps", {
  shortcuts: true,
  hidden: false,
  onOutsideClick: function onOutsideClick() {},
  onEscPress: function onEscPress() {},
  onCloseAttempt: function onCloseAttempt() {},
  dontCloseOnAnchorClick: false,
  keepMounted: false,
  directions: DEFAULT_DIRECTIONS,
  autoPositioning: true,
  autoCorrectTopOverflow: true,
  left: 0,
  top: 0,
  offset: 0,
  sidePadding: 8,
  attached: false,
  trapFocus: false,
  autoFocusFirst: false,
  legacy: false
});

_defineProperty(Popup, "PopupProps", {
  Directions: Directions,
  Dimension: Dimension,
  MinWidth: MinWidth,
  MaxHeight: MaxHeight
});

export { Directions as D, Popup as P, DEFAULT_DIRECTIONS as a, getPopupContainer as g, maxHeightForDirection as m };
