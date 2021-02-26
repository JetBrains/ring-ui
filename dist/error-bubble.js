import { _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass, d as _defineProperty, e as _objectWithoutProperties } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { Children, cloneElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { P as Popup, D as Directions } from './popup-442f4003.js';
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

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.error-bubble_errorBubblePopup__1RsSY {\n  overflow: visible;\n\n  margin-left: 2px;\n\n  border: none;\n\n  box-shadow: none;\n}\n\n.error-bubble_errorBubbleWrapper__1sOi6 {\n  display: inline-block;\n}\n\n.error-bubble_errorBubble__1ZIXz {\n  box-sizing: border-box;\n  min-height: 24px;\n  padding-right: 16px;\n  padding-left: 16px;\n\n  white-space: nowrap;\n\n  color: #c22731;\n\n  color: var(--ring-error-color);\n\n  border: 1px solid rgba(0, 42, 76, 0.1);\n\n  border: 1px solid var(--ring-popup-border-color);\n  border-radius: 3px;\n  border-radius: var(--ring-border-radius);\n\n  background: #fff;\n\n  background: var(--ring-popup-background-color);\n  box-shadow: 0 2px 16px 0 rgba(0, 42, 76, 0.15);\n  box-shadow: 0 2px 16px 0 var(--ring-popup-shadow-color);\n\n  font-size: 12px;\n  line-height: 22px;\n}\n\n.error-bubble_errorBubble__1ZIXz::before {\n  position: absolute;\n  top: 8px;\n  left: -4px;\n\n  display: block;\n\n  width: 8px;\n  height: 8px;\n\n  content: '';\n  transform: rotate(45deg);\n\n  border: 1px solid rgba(0, 42, 76, 0.1);\n\n  border: 1px solid var(--ring-popup-border-color);\n  border-top: none;\n  border-right: none;\n  background: #fff;\n  background: var(--ring-popup-background-color);\n}\n";
var styles = {"unit":"8px","errorBubblePopup":"error-bubble_errorBubblePopup__1RsSY","errorBubbleWrapper":"error-bubble_errorBubbleWrapper__1sOi6","errorBubble":"error-bubble_errorBubble__1ZIXz"};
styleInject(css_248z);

/**
 * @name Error Bubble
 */

var ErrorBubble = /*#__PURE__*/function (_PureComponent) {
  _inherits(ErrorBubble, _PureComponent);

  var _super = _createSuper(ErrorBubble);

  function ErrorBubble() {
    _classCallCheck(this, ErrorBubble);

    return _super.apply(this, arguments);
  }

  _createClass(ErrorBubble, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          restProps = _objectWithoutProperties(_this$props, ["children", "className"]);

      var errorBubbleClasses = classNames(styles.errorBubble, className);
      return /*#__PURE__*/React.createElement("div", {
        className: styles.errorBubbleWrapper
      }, Children.map(children, function (child) {
        return /*#__PURE__*/cloneElement(child, restProps);
      }), restProps.error && /*#__PURE__*/React.createElement(Popup, {
        trapFocus: false,
        className: styles.errorBubblePopup,
        hidden: false,
        attached: false,
        directions: [Directions.RIGHT_CENTER, Directions.RIGHT_BOTTOM, Directions.RIGHT_TOP]
      }, /*#__PURE__*/React.createElement("div", {
        className: errorBubbleClasses,
        "data-test": "ring-error-bubble"
      }, restProps.error)));
    }
  }]);

  return ErrorBubble;
}(PureComponent);

_defineProperty(ErrorBubble, "propTypes", {
  error: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node
});

export default ErrorBubble;
