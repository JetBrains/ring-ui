import { d as _defineProperty, _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass, e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import 'focus-visible';
import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { m as memoize } from './memoize-ad2c954c.js';
import { j as joinDataTestAttributes } from './data-tests-1a367745.js';
import { C as ClickableLink } from './clickableLink-3fc5662b.js';
import styleInject from 'style-inject';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */@import \"../global/variables.css\";.alert_alert__rClQK {\n  position: relative;\n\n  display: flex;\n  align-items: baseline;\n\n  box-sizing: border-box;\n  min-height: 40px;\n  margin: 8px auto;\n  padding: 0 16px;\n\n  transition:\n    transform 300ms ease-out,\n    margin-bottom 300ms ease-out,\n    opacity 300ms ease-out;\n  white-space: nowrap;\n  pointer-events: auto;\n\n  border-radius: var(--ring-border-radius);\n  background-color: var(--ring-message-background-color);\n  box-shadow: 0 2px 16px var(--ring-popup-shadow-color);\n\n  font-size: var(--ring-font-size);\n  line-height: 40px;\n}.alert_alertInline__3faAP {\n  margin: 8px;\n}.alert_error__2d5bp {\n  word-wrap: break-word;\n\n  color: var(--ring-error-color);\n}.alert_icon__3NQUw {\n  margin-right: 8px;\n}.alert_caption__3rGzh {\n  overflow: hidden;\n\n  max-width: calc(100% - 40px);\n\n  margin: 12px 0;\n\n  white-space: normal;\n\n  color: var(--ring-dark-text-color);\n\n  line-height: 20px;\n\n  & .ring-link,\n  \n  & .alert_link__28yrp {\n    color: var(--ring-main-color);\n  }\n\n  &.alert_withCloseButton__2CUJo {\n    margin-right: 40px;\n  }\n}.alert_badge__3Gace {\n  margin-left: 8px;\n\n  vertical-align: baseline;\n}.alert_loader__NgYhc {\n  top: 2px;\n\n  margin-right: 8px;\n}.alert_close__1g8Nu {\n  position: absolute;\n  top: 2px;\n  right: 0;\n\n  margin: 4px;\n  padding: 8px;\n\n  cursor: pointer;\n\n  color: var(--ring-dark-secondary-color);\n  border: none;\n  background: transparent;\n\n  font-size: 0;\n  line-height: 0;\n\n  &:hover,\n  &:focus {\n    color: var(--ring-link-hover-color);\n  }\n}@keyframes alert_show__3qO5F {\n  from {\n    transform: translateY(100%);\n\n    opacity: 0;\n  }\n\n  to {\n    transform: translateY(0);\n\n    opacity: 1;\n  }\n}@keyframes alert_shaking__1FXdE {\n  10%,\n  90% {\n    transform: translateX(-1px);\n  }\n\n  20%,\n  80% {\n    transform: translateX(2px);\n  }\n\n  30%,\n  50%,\n  70% {\n    transform: translateX(-4px);\n  }\n\n  40%,\n  60% {\n    transform: translateX(4px);\n  }\n}.alert_animationOpen__3Ck97 {\n  animation-name: alert_show__3qO5F;\n  animation-duration: 300ms;\n}.alert_animationClosing__y4ZLI {\n  z-index: var(--ring-invisible-element-z-index);\n\n  opacity: 0;\n}.alert_animationShaking__1FrRc {\n  animation-name: alert_shaking__1FXdE;\n  animation-duration: 500ms;\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_link__33ZOK:hover {\n    transition: none;\n\n    color: #ff008c;\n\n    color: var(--ring-link-hover-color);\n  }}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_link__33ZOK:hover {\n    text-decoration: none;\n  }}\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.link_link__33ZOK { /* To override link stiles inside alert */\n\n  cursor: pointer;\n  transition: color 0.15s ease-out;\n  transition: color var(--ring-fast-ease);\n\n  color: #0f5b99;\n\n  color: var(--ring-link-color)\n}\n\n.link_link__33ZOK {\n    text-decoration: none;\n  }\n\n.link_link__33ZOK.link_hover__pNP00 {\n    transition: none;\n\n    color: #ff008c;\n\n    color: var(--ring-link-hover-color);\n  }\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_link__33ZOK:hover .link_inner__Da94C {\n    border-width: 0;\n    border-bottom: 2px solid;\n    border-image-source: linear-gradient(currentcolor 50%, transparent 50%);\n    border-image-slice: 0 0 100% 0;\n  }}\n\n.link_link__33ZOK.link_active__nCdO7 {\n    color: inherit;\n  }\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_link__33ZOK.link_compatibilityUnderlineMode__ABm4S:hover {\n    text-decoration: underline\n\n    /* stylelint-disable-next-line selector-max-specificity */\n  }}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_link__33ZOK.link_compatibilityUnderlineMode__ABm4S:hover .link_inner__Da94C {\n      border: none;\n    }}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_link__33ZOK.link_pseudo__2Alx4:hover {\n    text-decoration: none\n\n    /* stylelint-disable-next-line selector-max-specificity */\n  }}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_link__33ZOK.link_pseudo__2Alx4:hover .link_inner__Da94C {\n      border: none;\n    }}\n\n.link_link__33ZOK {\n\n  outline: none\n}\n\n.link_link__33ZOK.focus-visible {\n    box-shadow: 0 0 0 2px #80c6ff;\n    box-shadow: 0 0 0 2px var(--ring-border-hover-color);\n  }\n\n@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_link__33ZOK:hover .link_inner__Da94C {\n    border-bottom-width: 1px;\n  }}\n}\n\n.link_text__vWxZZ {\n  border-radius: 3px;\n  border-radius: var(--ring-border-radius);\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_inherit__2rCTY:not(:hover) {\n  color: inherit;\n}}\n\n.link_pseudo__2Alx4 {\n  margin: 0;\n  padding: 0;\n\n  text-align: left;\n\n  border: 0;\n\n  background: transparent;\n\n  font: inherit\n}\n\n.link_pseudo__2Alx4::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n";
var styles = {"link":"link_link__33ZOK alert_link__28yrp","hover":"link_hover__pNP00","inner":"link_inner__Da94C","active":"link_active__nCdO7","compatibilityUnderlineMode":"link_compatibilityUnderlineMode__ABm4S","pseudo":"link_pseudo__2Alx4","text":"link_text__vWxZZ","inherit":"link_inherit__2rCTY"};
styleInject(css_248z);

/**
 * @name Link
 */

var isCompatibilityMode = false;
function setCompatibilityMode(isEnabled) {
  isCompatibilityMode = isEnabled;
}
var makeWrapText = memoize(function (innerClassName) {
  var WrapText = /*#__PURE__*/memo(function WrapText(_ref) {
    var className = _ref.className,
        children = _ref.children;
    var classes = classNames(styles.inner, className, innerClassName);
    return /*#__PURE__*/React.createElement("span", {
      className: classes
    }, children);
  });
  WrapText.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };
  return WrapText;
});
function linkHOC(ComposedComponent) {
  var _class, _temp;

  var isCustom = typeof ComposedComponent !== 'string' && ComposedComponent !== ClickableLink;
  return _temp = _class = /*#__PURE__*/function (_Component) {
    _inherits(Link, _Component);

    var _super = _createSuper(Link);

    function Link() {
      _classCallCheck(this, Link);

      return _super.apply(this, arguments);
    }

    _createClass(Link, [{
      key: "getChildren",
      value: function getChildren() {
        var _this$props = this.props,
            children = _this$props.children,
            innerClassName = _this$props.innerClassName;
        var WrapText = makeWrapText(innerClassName);
        return typeof children === 'function' ? children(WrapText) : /*#__PURE__*/React.createElement(WrapText, null, children);
      }
    }, {
      key: "render",
      value: function render() {
        var _classNames;

        var _this$props2 = this.props,
            active = _this$props2.active,
            inherit = _this$props2.inherit,
            pseudo = _this$props2.pseudo,
            hover = _this$props2.hover,
            className = _this$props2.className,
            dataTest = _this$props2['data-test'],
            href = _this$props2.href;
            _this$props2.innerClassName;
            var children = _this$props2.children,
            onPlainLeftClick = _this$props2.onPlainLeftClick,
            onClick = _this$props2.onClick,
            props = _objectWithoutProperties(_this$props2, ["active", "inherit", "pseudo", "hover", "className", "data-test", "href", "innerClassName", "children", "onPlainLeftClick", "onClick"]);

        var useButton = pseudo || !isCustom && href == null;
        var classes = classNames(styles.link, className, (_classNames = {}, _defineProperty(_classNames, styles.active, active), _defineProperty(_classNames, styles.inherit, inherit), _defineProperty(_classNames, styles.hover, hover), _defineProperty(_classNames, styles.compatibilityUnderlineMode, isCompatibilityMode), _defineProperty(_classNames, styles.pseudo, useButton), _defineProperty(_classNames, styles.text, typeof children !== 'function'), _classNames));

        if (isCustom && !props.activeClassName) {
          props.activeClassName = styles.active;
        }

        if (useButton) {
          return /*#__PURE__*/React.createElement("button", _extends({
            type: "button"
          }, props, {
            className: classes,
            onClick: onClick || onPlainLeftClick,
            "data-test": joinDataTestAttributes('ring-link', dataTest)
          }), this.getChildren());
        }

        return /*#__PURE__*/React.createElement(ComposedComponent, _extends({}, props, {
          href: href,
          className: classes,
          onClick: onClick,
          onPlainLeftClick: onPlainLeftClick,
          "data-test": joinDataTestAttributes('ring-link', dataTest)
        }), this.getChildren());
      }
    }]);

    return Link;
  }(Component), _defineProperty(_class, "propTypes", {
    className: PropTypes.string,
    innerClassName: PropTypes.string,
    active: PropTypes.bool,
    inherit: PropTypes.bool,
    pseudo: PropTypes.bool,
    hover: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    'data-test': PropTypes.string,
    href: PropTypes.string,
    onPlainLeftClick: PropTypes.func,
    onClick: PropTypes.func
  }), _temp;
}
var Link = linkHOC(ClickableLink);

export default Link;
export { linkHOC, setCompatibilityMode };
