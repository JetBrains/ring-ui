import { _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, c as _createClass, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import gift from '@jetbrains/icons/gift';
import { P as Popup } from './popup-442f4003.js';
import Icon from './icon.js';
import { B as Button } from './button-c0bc1992.js';
import styleInject from 'style-inject';
import 'react-dom';
import './get-uid-bf3ab014.js';
import './schedule-raf-edeb21db.js';
import './dom-0ae85140.js';
import './shortcuts.js';
import 'combokeys';
import './sniffer-c9d1f40e.js';
import 'sniffr';
import './data-tests-1a367745.js';
import './tab-trap.js';
import './popup.target-9daf0591.js';
import 'util-deprecate';
import './memoize-ad2c954c.js';
import 'focus-visible';
import '@jetbrains/icons/chevron-10px';
import './theme-9a053da9.js';
import './clickableLink-3fc5662b.js';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.message_message__1mlS- {\n  overflow: visible;\n\n  max-width: 320px;\n\n  padding: 12px 12px 16px 40px;\n\n  text-align: left;\n\n  color: #fff;\n\n  color: var(--ring-dark-text-color);\n\n  border: none;\n\n  background-color: #111314;\n\n  background-color: var(--ring-message-background-color);\n\n  box-shadow: none\n}\n\n.message_message__1mlS-::before {\n    position: absolute;\n    z-index: -1;\n    z-index: var(--ring-invisible-element-z-index);\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n\n    content: '';\n\n    border-radius: 3px;\n\n    border-radius: var(--ring-border-radius);\n\n    box-shadow: 0 2px 8px 0 rgba(0, 42, 76, 0.3);\n\n    box-shadow: 0 2px 8px 0 var(--ring-message-shadow-color);\n  }\n\n.message_icon__3i1E3 {\n  position: absolute;\n  top: 10px;\n  left: 12px;\n}\n\n.message_title__2owmg {\n\n  margin: 0;\n\n  font-weight: normal;\n}\n\n.message_description__3iAFG {\n\n  margin: 4px 0 0;\n\n  color: #ccc;\n\n  color: var(--ring-dark-active-color);\n}\n\n.message_button__pqO1Y {\n  margin-top: 12px;\n}\n\n.message_tail__V_aVa {\n  position: absolute;\n\n  transform-origin: 50% 0;\n\n  border-width: 8px 8px 0;\n  border-style: solid;\n\n  border-color: #111314 transparent transparent;\n\n  border-color: var(--ring-message-background-color) transparent transparent; /* stylelint-disable-line color-no-hex */\n}\n";
var styles = {"unit":"8px","padding":"calc(8px * 1.5)","message":"message_message__1mlS-","icon":"message_icon__3i1E3","title":"message_title__2owmg global_font-lower__11Bp7 global_font__2H0e4","description":"message_description__3iAFG global_font-smaller-lower__33Wmu global_font-smaller__2YCID global_font-lower__11Bp7 global_font__2H0e4","button":"message_button__pqO1Y","tail":"message_tail__V_aVa"};
styleInject(css_248z);

/**
  * @name Message
  */

var Directions = Popup.PopupProps.Directions;
var UNIT = 8;

var getTailOffsets = function getTailOffsets(offset) {
  var _ref;

  return _ref = {}, _defineProperty(_ref, Directions.BOTTOM_RIGHT, {
    top: 0,
    left: offset - UNIT,
    transform: 'rotate(180deg)'
  }), _defineProperty(_ref, Directions.BOTTOM_LEFT, {
    top: 0,
    right: offset - UNIT,
    transform: 'rotate(180deg)'
  }), _defineProperty(_ref, Directions.BOTTOM_CENTER, {
    top: 0,
    left: offset - UNIT,
    transform: 'rotate(180deg)'
  }), _defineProperty(_ref, Directions.TOP_RIGHT, {
    bottom: -UNIT + 1,
    left: offset - UNIT
  }), _defineProperty(_ref, Directions.TOP_LEFT, {
    bottom: -UNIT + 1,
    right: offset - UNIT
  }), _defineProperty(_ref, Directions.TOP_CENTER, {
    bottom: -UNIT + 1,
    left: offset - UNIT
  }), _defineProperty(_ref, Directions.RIGHT_TOP, {
    bottom: offset - UNIT,
    left: -UNIT,
    transform: 'rotate(90deg)'
  }), _defineProperty(_ref, Directions.RIGHT_BOTTOM, {
    top: offset,
    left: -UNIT,
    transform: 'rotate(90deg)'
  }), _defineProperty(_ref, Directions.RIGHT_CENTER, {
    top: offset,
    left: -UNIT,
    transform: 'rotate(90deg)'
  }), _defineProperty(_ref, Directions.LEFT_TOP, {
    bottom: offset - UNIT,
    right: -UNIT,
    transform: 'rotate(-90deg)'
  }), _defineProperty(_ref, Directions.LEFT_BOTTOM, {
    top: offset,
    right: -UNIT,
    transform: 'rotate(-90deg)'
  }), _defineProperty(_ref, Directions.LEFT_CENTER, {
    top: offset,
    right: -UNIT,
    transform: 'rotate(-90deg)'
  }), _ref;
};
/**
 * Displays a popup containing a message.
 */


var Message = /*#__PURE__*/function (_Component) {
  _inherits(Message, _Component);

  var _super = _createSuper(Message);

  function Message() {
    var _this;

    _classCallCheck(this, Message);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {});

    _defineProperty(_assertThisInitialized(_this), "_onDirectionChange", function (direction) {
      return _this.setState({
        direction: direction
      });
    });

    _defineProperty(_assertThisInitialized(_this), "popupRef", function (el) {
      var _this$popup;

      _this.popup = el;
      _this.node = (_this$popup = _this.popup) === null || _this$popup === void 0 ? void 0 : _this$popup.node;
    });

    return _this;
  }

  _createClass(Message, [{
    key: "getTailOffset",
    value: function getTailOffset() {
      var _this$popup2;

      var DEFAULT_OFFSET = 32;
      var popupProps = this.props.popupProps;

      if ('tailOffset' in this.props) {
        return this.props.tailOffset;
      }

      var anchor = (popupProps === null || popupProps === void 0 ? void 0 : popupProps.anchorElement) || ((_this$popup2 = this.popup) === null || _this$popup2 === void 0 ? void 0 : _this$popup2.parent);

      if (!anchor) {
        return DEFAULT_OFFSET;
      }

      var offset = Math.floor(anchor.offsetWidth / 2);
      var isOpenedToRight = [Directions.TOP_RIGHT, Directions.BOTTOM_RIGHT].includes(this.state.direction);

      if ((popupProps === null || popupProps === void 0 ? void 0 : popupProps.left) && isOpenedToRight) {
        return offset - (popupProps === null || popupProps === void 0 ? void 0 : popupProps.left);
      }

      return offset;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          title = _this$props.title,
          icon = _this$props.icon,
          popupProps = _this$props.popupProps,
          buttonProps = _this$props.buttonProps,
          onClose = _this$props.onClose,
          onDismiss = _this$props.onDismiss,
          translations = _this$props.translations;
      var classes = classNames(styles.message, className);
      var popupDirections = this.props.direction ? [this.props.direction] : this.props.directions;
      var direction = this.state.direction;
      return /*#__PURE__*/React.createElement(Popup, _extends({
        ref: this.popupRef,
        hidden: false,
        directions: popupDirections,
        className: classes,
        offset: UNIT * 2,
        onDirectionChange: this._onDirectionChange
      }, popupProps), direction && /*#__PURE__*/React.createElement("div", {
        className: styles.tail,
        style: getTailOffsets(this.getTailOffset())[direction]
      }), icon && /*#__PURE__*/React.createElement(Icon, {
        className: styles.icon,
        glyph: icon
      }), /*#__PURE__*/React.createElement("h1", {
        "data-test": "rgMessageTitle",
        className: styles.title
      }, title), children && /*#__PURE__*/React.createElement("div", {
        className: styles.description
      }, children), (onClose || buttonProps) && /*#__PURE__*/React.createElement(Button, _extends({
        className: styles.button,
        onClick: onClose,
        primary: true
      }, buttonProps), translations.gotIt), onDismiss && /*#__PURE__*/React.createElement(Button, {
        onClick: onDismiss,
        text: true
      }, translations.dismiss));
    }
  }]);

  return Message;
}(Component);

_defineProperty(Message, "propTypes", {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  directions: PropTypes.arrayOf(PropTypes.string),
  direction: PropTypes.string,
  popupProps: PropTypes.object,
  buttonProps: PropTypes.object,
  tailOffset: PropTypes.number,
  onClose: PropTypes.func,
  onDismiss: PropTypes.func,
  translations: PropTypes.object
});

_defineProperty(Message, "defaultProps", {
  icon: gift,
  directions: [Directions.TOP_RIGHT, Directions.TOP_LEFT, Directions.TOP_CENTER, Directions.BOTTOM_RIGHT, Directions.BOTTOM_LEFT, Directions.BOTTOM_CENTER, Directions.RIGHT_TOP, Directions.RIGHT_BOTTOM, Directions.RIGHT_CENTER, Directions.LEFT_TOP, Directions.LEFT_BOTTOM, Directions.LEFT_CENTER],
  translations: {
    gotIt: 'Got it',
    dismiss: 'Dismiss'
  }
});

_defineProperty(Message, "Directions", Directions);

_defineProperty(Message, "PopupProps", Popup.PopupProps);

export default Message;
