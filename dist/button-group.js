import { _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass, d as _defineProperty, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styleInject from 'style-inject';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */@import \"../global/variables.css\";.button-toolbar_buttonToolbar__BsD3B {\n  display: inline-block;\n\n  white-space: nowrap;\n\n  font-size: 0;\n}.button-toolbar_buttonToolbar__BsD3B > button,\n.button-toolbar_buttonToolbar__BsD3B > .ring-button-group,\n.button-toolbar_buttonToolbar__BsD3B > .button-toolbar_button__Dzqe5,\n.button-toolbar_buttonToolbar__BsD3B > .button-toolbar_buttonGroup__h-IL5,\n.button-toolbar_buttonToolbar__BsD3B > .button-toolbar_buttonToolbar__BsD3B {\n  margin-right: 8px;\n}.button-toolbar_buttonToolbar__BsD3B > :last-child {\n  margin-right: 0;\n}\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n:root {\n  --ring-button-group-default-z-index: 0;\n  --ring-button-group-disabled-z-index: -1;\n  --ring-button-group-active-z-index: 1;\n  --ring-button-group-hover-z-index: 2;\n  --ring-button-group-focus-z-index: 3;\n}\n\n.button-group_buttonGroup__3txuo {\n\n  position: relative;\n  z-index: 0;\n\n  display: inline-block;\n\n  white-space: nowrap;\n}\n\n.button-group_buttonGroup__3txuo button,\n.button-group_buttonGroup__3txuo .button-group_button__3uv9W {\n  margin: 0 0 0 -1px;\n\n  border-radius: 0;\n}\n\n.button-group_caption__10uPh {\n\n  margin-right: 8px;\n\n  font-size: 13px;\n\n  font-size: var(--ring-font-size)\n}\n\n.button-group_caption__10uPh:empty {\n    margin-right: 0;\n  }\n\n.button-group_buttonGroup__3txuo > .button-group_caption__10uPh + .button-group_button__3uv9W,\n.button-group_buttonGroup__3txuo > button:first-child,\n.button-group_buttonGroup__3txuo > .button-group_button__3uv9W:first-child,\n.button-group_buttonGroup__3txuo > :first-child .button-group_button__3uv9W {\n  margin: 0;\n\n  border-top-left-radius: 3px;\n\n  border-top-left-radius: var(--ring-border-radius);\n  border-bottom-left-radius: 3px;\n  border-bottom-left-radius: var(--ring-border-radius);\n}\n\n.button-group_buttonGroup__3txuo > .button-group_button__3uv9W:last-child,\n.button-group_buttonGroup__3txuo > button:last-child,\n.button-group_buttonGroup__3txuo > :last-child .button-group_button__3uv9W {\n  border-top-right-radius: 3px;\n  border-top-right-radius: var(--ring-border-radius);\n  border-bottom-right-radius: 3px;\n  border-bottom-right-radius: var(--ring-border-radius);\n}\n\n.button-group_buttonGroup__3txuo .button-group_button__3uv9W {\n    position: relative;\n    z-index: 0;\n    z-index: var(--ring-button-group-default-z-index)\n  }\n\n.button-group_buttonGroup__3txuo .button-group_button__3uv9W[disabled] {\n      z-index: -1;\n      z-index: var(--ring-button-group-disabled-z-index);\n    }\n\n.button-group_buttonGroup__3txuo .button-group_button__3uv9W:active {\n      z-index: 1;\n      z-index: var(--ring-button-group-active-z-index);\n    }\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.button-group_buttonGroup__3txuo .button-group_button__3uv9W:hover {\n      z-index: 2;\n      z-index: var(--ring-button-group-hover-z-index);\n    }}\n\n.button-group_buttonGroup__3txuo .button-group_button__3uv9W:focus {\n      z-index: 3;\n      z-index: var(--ring-button-group-focus-z-index);\n    }\n\n.button-group_buttonGroup__3txuo .button-group_active__Uv_AL {\n    z-index: 1;\n    z-index: var(--ring-button-group-active-z-index);\n  }\n";
var styles = {"unit":"8px","buttonGroup":"button-group_buttonGroup__3txuo button-toolbar_buttonGroup__h-IL5","button":"button-group_button__3uv9W","caption":"button-group_caption__10uPh global_font__2H0e4","active":"button-group_active__Uv_AL"};
styleInject(css_248z);

var Caption = /*#__PURE__*/function (_PureComponent) {
  _inherits(Caption, _PureComponent);

  var _super = _createSuper(Caption);

  function Caption() {
    _classCallCheck(this, Caption);

    return _super.apply(this, arguments);
  }

  _createClass(Caption, [{
    key: "render",
    value: function render() {
      var className = this.props.className;
      var classes = classNames(styles.caption, className);
      return /*#__PURE__*/React.createElement("span", _extends({}, this.props, {
        className: classes
      }));
    }
  }]);

  return Caption;
}(PureComponent);

_defineProperty(Caption, "propTypes", {
  className: PropTypes.node
});

/**
 * @name Button Group
 */

var ButtonGroup = /*#__PURE__*/function (_PureComponent) {
  _inherits(ButtonGroup, _PureComponent);

  var _super = _createSuper(ButtonGroup);

  function ButtonGroup() {
    _classCallCheck(this, ButtonGroup);

    return _super.apply(this, arguments);
  }

  _createClass(ButtonGroup, [{
    key: "render",
    value: function render() {
      var className = this.props.className;
      var classes = classNames(styles.buttonGroup, className);
      return /*#__PURE__*/React.createElement("div", _extends({}, this.props, {
        className: classes
      }));
    }
  }]);

  return ButtonGroup;
}(PureComponent);

_defineProperty(ButtonGroup, "propTypes", {
  children: PropTypes.node,
  className: PropTypes.string
});

export default ButtonGroup;
export { Caption };
