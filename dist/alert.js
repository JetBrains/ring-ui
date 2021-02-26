import { _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass, d as _defineProperty, e as _objectWithoutProperties, f as _extends, g as _assertThisInitialized } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { Children, cloneElement, PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import exceptionIcon from '@jetbrains/icons/exception';
import checkmarkIcon from '@jetbrains/icons/checkmark';
import warningIcon from '@jetbrains/icons/warning';
import closeIcon from '@jetbrains/icons/close';
import Icon from './icon.js';
import LoaderInline from './loader-inline.js';
import { g as getRect } from './dom-0ae85140.js';
import { j as joinDataTestAttributes } from './data-tests-1a367745.js';
import styleInject from 'style-inject';
import { createPortal } from 'react-dom';
import 'util-deprecate';
import './memoize-ad2c954c.js';
import './theme-9a053da9.js';
import 'conic-gradient';
import './get-uid-bf3ab014.js';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.alert_close__1g8Nu:hover {\n    color: #ff008c;\n    color: var(--ring-link-hover-color);\n  }}\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.alert_alert__rClQK {\n  position: relative;\n\n  display: flex;\n  align-items: baseline;\n\n  box-sizing: border-box;\n  min-height: 40px;\n  margin: 8px auto;\n  padding: 0 16px;\n\n  transition:\n    transform 300ms ease-out,\n    margin-bottom 300ms ease-out,\n    opacity 300ms ease-out;\n  white-space: nowrap;\n  pointer-events: auto;\n\n  border-radius: 3px;\n\n  border-radius: var(--ring-border-radius);\n  background-color: #111314;\n  background-color: var(--ring-message-background-color);\n  box-shadow: 0 2px 16px rgba(0, 42, 76, 0.15);\n  box-shadow: 0 2px 16px var(--ring-popup-shadow-color);\n\n  font-size: 13px;\n\n  font-size: var(--ring-font-size);\n  line-height: 40px;\n}\n\n.alert_alertInline__3faAP {\n  margin: 8px;\n}\n\n.alert_error__2d5bp {\n  word-wrap: break-word;\n\n  color: #c22731;\n\n  color: var(--ring-error-color);\n}\n\n.alert_icon__3NQUw {\n  margin-right: 8px;\n}\n\n.alert_caption__3rGzh {\n  overflow: hidden;\n\n  max-width: calc(100% - 40px);\n\n  margin: 12px 0;\n\n  white-space: normal;\n\n  color: #fff;\n\n  color: var(--ring-dark-text-color);\n\n  line-height: 20px\n}\n\n.alert_caption__3rGzh .ring-link,\n  \n  .alert_caption__3rGzh .alert_link__28yrp {\n    color: #008eff;\n    color: var(--ring-main-color);\n  }\n\n.alert_caption__3rGzh.alert_withCloseButton__2CUJo {\n    margin-right: 40px;\n  }\n\n.alert_badge__3Gace {\n  margin-left: 8px;\n\n  vertical-align: baseline;\n}\n\n.alert_loader__NgYhc {\n  top: 2px;\n\n  margin-right: 8px;\n}\n\n.alert_close__1g8Nu {\n  position: absolute;\n  top: 2px;\n  right: 0;\n\n  margin: 4px;\n  padding: 8px;\n\n  cursor: pointer;\n\n  color: #888;\n\n  color: var(--ring-dark-secondary-color);\n  border: none;\n  background: transparent;\n\n  font-size: 0;\n  line-height: 0\n}\n\n.alert_close__1g8Nu:focus {\n    color: #ff008c;\n    color: var(--ring-link-hover-color);\n  }\n\n@keyframes alert_show__3qO5F {\n  from {\n    transform: translateY(100%);\n\n    opacity: 0;\n  }\n\n  to {\n    transform: translateY(0);\n\n    opacity: 1;\n  }\n}\n\n@keyframes alert_shaking__1FXdE {\n  10%,\n  90% {\n    transform: translateX(-1px);\n  }\n\n  20%,\n  80% {\n    transform: translateX(2px);\n  }\n\n  30%,\n  50%,\n  70% {\n    transform: translateX(-4px);\n  }\n\n  40%,\n  60% {\n    transform: translateX(4px);\n  }\n}\n\n.alert_animationOpen__3Ck97 {\n  animation-name: alert_show__3qO5F;\n  animation-duration: 300ms;\n}\n\n.alert_animationClosing__y4ZLI {\n  z-index: -1;\n  z-index: var(--ring-invisible-element-z-index);\n\n  opacity: 0;\n}\n\n.alert_animationShaking__1FrRc {\n  animation-name: alert_shaking__1FXdE;\n  animation-duration: 500ms;\n}\n";
var styles = {"unit":"8px","animation-duration":"300ms","animation-easing":"ease-out","close":"alert_close__1g8Nu","alert":"alert_alert__rClQK","alertInline":"alert_alertInline__3faAP","error":"alert_error__2d5bp","icon":"alert_icon__3NQUw","caption":"alert_caption__3rGzh","link":"alert_link__28yrp","withCloseButton":"alert_withCloseButton__2CUJo","badge":"alert_badge__3Gace","loader":"alert_loader__NgYhc","animationOpen":"alert_animationOpen__3Ck97","show":"alert_show__3qO5F","animationClosing":"alert_animationClosing__y4ZLI","animationShaking":"alert_animationShaking__1FrRc","shaking":"alert_shaking__1FXdE"};
styleInject(css_248z);

var css_248z$1 = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */@import \"../global/variables.css\";.alert_alert__rClQK {\n  position: relative;\n\n  display: flex;\n  align-items: baseline;\n\n  box-sizing: border-box;\n  min-height: 40px;\n  margin: 8px auto;\n  padding: 0 16px;\n\n  transition:\n    transform 300ms ease-out,\n    margin-bottom 300ms ease-out,\n    opacity 300ms ease-out;\n  white-space: nowrap;\n  pointer-events: auto;\n\n  border-radius: var(--ring-border-radius);\n  background-color: var(--ring-message-background-color);\n  box-shadow: 0 2px 16px var(--ring-popup-shadow-color);\n\n  font-size: var(--ring-font-size);\n  line-height: 40px;\n}.alert_alertInline__3faAP {\n  margin: 8px;\n}.alert_error__2d5bp {\n  word-wrap: break-word;\n\n  color: var(--ring-error-color);\n}.alert_icon__3NQUw {\n  margin-right: 8px;\n}.alert_caption__3rGzh {\n  overflow: hidden;\n\n  max-width: calc(100% - 40px);\n\n  margin: 12px 0;\n\n  white-space: normal;\n\n  color: var(--ring-dark-text-color);\n\n  line-height: 20px;\n\n  & .ring-link,\n  \n  & .alert_link__28yrp {\n    color: var(--ring-main-color);\n  }\n\n  &.alert_withCloseButton__2CUJo {\n    margin-right: 40px;\n  }\n}.alert_badge__3Gace {\n  margin-left: 8px;\n\n  vertical-align: baseline;\n}.alert_loader__NgYhc {\n  top: 2px;\n\n  margin-right: 8px;\n}.alert_close__1g8Nu {\n  position: absolute;\n  top: 2px;\n  right: 0;\n\n  margin: 4px;\n  padding: 8px;\n\n  cursor: pointer;\n\n  color: var(--ring-dark-secondary-color);\n  border: none;\n  background: transparent;\n\n  font-size: 0;\n  line-height: 0;\n\n  &:hover,\n  &:focus {\n    color: var(--ring-link-hover-color);\n  }\n}@keyframes alert_show__3qO5F {\n  from {\n    transform: translateY(100%);\n\n    opacity: 0;\n  }\n\n  to {\n    transform: translateY(0);\n\n    opacity: 1;\n  }\n}@keyframes alert_shaking__1FXdE {\n  10%,\n  90% {\n    transform: translateX(-1px);\n  }\n\n  20%,\n  80% {\n    transform: translateX(2px);\n  }\n\n  30%,\n  50%,\n  70% {\n    transform: translateX(-4px);\n  }\n\n  40%,\n  60% {\n    transform: translateX(4px);\n  }\n}.alert_animationOpen__3Ck97 {\n  animation-name: alert_show__3qO5F;\n  animation-duration: 300ms;\n}.alert_animationClosing__y4ZLI {\n  z-index: var(--ring-invisible-element-z-index);\n\n  opacity: 0;\n}.alert_animationShaking__1FrRc {\n  animation-name: alert_shaking__1FXdE;\n  animation-duration: 500ms;\n}\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.container_alertContainer__21fnt {\n  position: fixed;\n  z-index: 6;\n  z-index: var(--ring-alert-z-index);\n  right: 16px;\n  bottom: 8px;\n\n  display: flex;\n  overflow: visible;\n  align-items: flex-end;\n  flex-direction: column;\n\n  pointer-events: none;\n}\n\n.container_alertInContainer__1IOxT {\n\n  min-width: 240px;\n  max-width: 400px;\n  margin-top: 0;\n\n  box-shadow: 0 2px 8px rgba(0, 42, 76, 0.3);\n}\n";
var styles$1 = {"unit":"8px","alert":"alert_alert__rClQK","alertContainer":"container_alertContainer__21fnt","alertInContainer":"container_alertInContainer__1IOxT alert_alert__rClQK"};
styleInject(css_248z$1);

/**
 * @name Alert Container
 * @description Displays a stack of alerts on top of the page.
 * @extends {PureComponent}
 */

var Alerts = /*#__PURE__*/function (_PureComponent) {
  _inherits(Alerts, _PureComponent);

  var _super = _createSuper(Alerts);

  function Alerts() {
    _classCallCheck(this, Alerts);

    return _super.apply(this, arguments);
  }

  _createClass(Alerts, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          restProps = _objectWithoutProperties(_this$props, ["children", "className"]);

      var classes = classNames(styles$1.alertContainer, className);
      var show = Children.count(children) > 0;

      if (!show) {
        return null;
      }

      return /*#__PURE__*/createPortal( /*#__PURE__*/React.createElement("div", _extends({
        "data-test": "alert-container",
        className: classes,
        "aria-live": "polite"
      }, restProps), Children.map(children, function (child) {
        var alertClassNames = classNames(styles$1.alertInContainer, child.props.className);
        return /*#__PURE__*/cloneElement(child, {
          className: alertClassNames
        });
      })), document.body);
    }
  }]);

  return Alerts;
}(PureComponent);

_defineProperty(Alerts, "propTypes", {
  children: PropTypes.node,
  className: PropTypes.string
});

var _TypeToIcon, _TypeToIconColor;
var ANIMATION_TIME = 500;
/**
 * @name Alert
 */

/**
 * List of available alert types.
 * @enum {string}
 */

var Type = {
  ERROR: 'error',
  MESSAGE: 'message',
  SUCCESS: 'success',
  WARNING: 'warning',
  LOADING: 'loading'
};
/**
 * Lookup table of alert type to icon modifier.
 * @type {Object.<Type, string>}
 */

var TypeToIcon = (_TypeToIcon = {}, _defineProperty(_TypeToIcon, Type.ERROR, exceptionIcon), _defineProperty(_TypeToIcon, Type.SUCCESS, checkmarkIcon), _defineProperty(_TypeToIcon, Type.WARNING, warningIcon), _TypeToIcon);
/**
 * Lookup table of alert type to icon color.
 * @type {Object.<Type, Icon.Color>}
 */

var TypeToIconColor = (_TypeToIconColor = {}, _defineProperty(_TypeToIconColor, Type.ERROR, Icon.Color.RED), _defineProperty(_TypeToIconColor, Type.SUCCESS, Icon.Color.GREEN), _defineProperty(_TypeToIconColor, Type.WARNING, Icon.Color.WHITE), _TypeToIconColor);
/**
 * @constructor
 * @name Alert
 * @extends {ReactComponent}
 */

/**
 * **Alert** is a component for displaying contextual notifications. If you want to display a stack of notifications, use **Alerts** instead.
 */

var Alert = /*#__PURE__*/function (_PureComponent) {
  _inherits(Alert, _PureComponent);

  var _super = _createSuper(Alert);

  function Alert() {
    var _this;

    _classCallCheck(this, Alert);

    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(_args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      height: null
    });

    _defineProperty(_assertThisInitialized(_this), "closeRequest", function () {
      var _this$props;

      var height = getRect(_this.node).height;

      _this.setState({
        height: height
      });

      return (_this$props = _this.props).onCloseRequest.apply(_this$props, arguments);
    });

    _defineProperty(_assertThisInitialized(_this), "_handleCaptionsLinksClick", function (evt) {
      if (evt.target.matches('a')) {
        _this.closeRequest(evt);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "storeAlertRef", function (node) {
      _this.node = node;
    });

    return _this;
  }

  _createClass(Alert, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.timeout > 0) {
        this.hideTimeout = setTimeout(this.closeRequest, this.props.timeout);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.props.isClosing) {
        this._close();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearTimeout(this.hideTimeout);
    }
  }, {
    key: "_close",
    value: function _close() {
      var _this2 = this;

      setTimeout(function () {
        _this2.props.onClose();
      }, ANIMATION_TIME);
    }
    /**
     * @param {SyntheticEvent} evt
     * @private
     */

  }, {
    key: "_getCaption",

    /**
     * @private
     */
    value: function _getCaption() {
      return /*#__PURE__*/React.createElement("span", {
        className: classNames(styles.caption, this.props.captionClassName, _defineProperty({}, styles.withCloseButton, this.props.closeable)),
        onClick: this._handleCaptionsLinksClick // We only process clicks on `a` elements, see above
        ,
        role: "presentation"
      }, this.props.children);
    }
    /**
     * @private
     * @return {XML|string}
     */

  }, {
    key: "_getIcon",
    value: function _getIcon() {
      var glyph = TypeToIcon[this.props.type];

      if (glyph) {
        return /*#__PURE__*/React.createElement(Icon, {
          glyph: glyph,
          className: styles.icon,
          color: TypeToIconColor[this.props.type] || Icon.Color.DEFAULT
        });
      } else if (this.props.type === Type.LOADING) {
        return /*#__PURE__*/React.createElement(LoaderInline, {
          className: styles.loader,
          theme: LoaderInline.Theme.DARK
        });
      }

      return '';
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames2;

      var _this$props2 = this.props,
          type = _this$props2.type,
          inline = _this$props2.inline,
          isClosing = _this$props2.isClosing,
          isShaking = _this$props2.isShaking,
          showWithAnimation = _this$props2.showWithAnimation,
          className = _this$props2.className,
          dataTest = _this$props2['data-test'];
      var classes = classNames(className, (_classNames2 = {}, _defineProperty(_classNames2, styles.alert, true), _defineProperty(_classNames2, styles.animationOpen, showWithAnimation), _defineProperty(_classNames2, styles.error, type === 'error'), _defineProperty(_classNames2, styles.alertInline, inline), _defineProperty(_classNames2, styles.animationClosing, isClosing), _defineProperty(_classNames2, styles.animationShaking, isShaking), _classNames2));
      var style = this.state.height ? {
        marginBottom: -this.state.height
      } : null;
      return /*#__PURE__*/React.createElement("div", {
        className: classes,
        "data-test": joinDataTestAttributes('alert', dataTest),
        "data-test-type": type,
        style: style,
        ref: this.storeAlertRef
      }, this._getIcon(), this._getCaption(), this.props.closeable ? /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: styles.close,
        "data-test": "alert-close",
        "aria-label": "close alert",
        onClick: this.closeRequest
      }, /*#__PURE__*/React.createElement(Icon, {
        glyph: closeIcon
      })) : '');
    }
  }]);

  return Alert;
}(PureComponent);

_defineProperty(Alert, "propTypes", {
  timeout: PropTypes.number,

  /**
   * Fires when alert starts closing if timeout is out or user clicks "Close" button
   */
  onCloseRequest: PropTypes.func,
  onClose: PropTypes.func,
  isShaking: PropTypes.bool,
  isClosing: PropTypes.bool,

  /**
   * Whether an alert is rendered inside an **Alerts** container
   * or standalone.
   */
  inline: PropTypes.bool,
  showWithAnimation: PropTypes.bool,
  closeable: PropTypes.bool,
  type: PropTypes.oneOf(Object.values(Type)),
  children: PropTypes.node,
  className: PropTypes.string,
  captionClassName: PropTypes.string,
  'data-test': PropTypes.string
});

_defineProperty(Alert, "defaultProps", {
  closeable: true,
  showWithAnimation: true,
  type: Type.MESSAGE,
  inline: true,
  isClosing: false,
  isShaking: false,
  timeout: 0,
  onClose: function onClose() {},
  onCloseRequest: function onCloseRequest() {}
});

_defineProperty(Alert, "Type", Type);

export default Alert;
export { ANIMATION_TIME, Alerts as Container };
