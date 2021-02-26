import { _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, c as _createClass, e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import checkmarkIcon from '@jetbrains/icons/checkmark';
import minusIcon from '@jetbrains/icons/remove-10px';
import Icon from './icon.js';
import styleInject from 'style-inject';
import 'util-deprecate';
import './memoize-ad2c954c.js';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.checkbox_checkbox__2MvwT {\n  position: relative;\n\n  display: inline-block;\n\n  text-align: left;\n\n  color: #1f2326;\n\n  color: var(--ring-text-color);\n  outline: none\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.checkbox_checkbox__2MvwT:hover .checkbox_cell__2Td_m {\n    transition: background-color 0.3s ease-out;\n    transition: background-color var(--ring-ease);\n\n    border-color: #80c6ff;\n\n    border-color: var(--ring-border-hover-color);\n  }}\n\n.checkbox_cell__2Td_m {\n  position: relative;\n  top: -2px;\n\n  display: inline-block;\n\n  box-sizing: border-box;\n  width: 14px;\n  height: 14px;\n\n  -webkit-user-select: none;\n\n      -ms-user-select: none;\n\n          user-select: none;\n  transition: border-color 0.3s ease-out, background-color 0.3s ease-out, box-shadow 0.3s ease-out;\n  transition: border-color var(--ring-ease), background-color var(--ring-ease), box-shadow var(--ring-ease);\n  vertical-align: middle;\n  pointer-events: none;\n\n  border: 1px solid #b8d1e5;\n\n  border: 1px solid var(--ring-borders-color);\n  border-radius: 3px;\n  background-color: #fff;\n  background-color: var(--ring-content-background-color);\n}\n\n.checkbox_icon__NKeMt.checkbox_icon__NKeMt {\n  position: absolute;\n\n  width: 16px;\n  height: 16px;\n\n  transition: opacity 0.15s ease-out, transform 0.15s ease-out;\n\n  transition: opacity var(--ring-fast-ease), transform var(--ring-fast-ease);\n\n  opacity: 0\n}\n\n.checkbox_icon__NKeMt.checkbox_icon__NKeMt svg {\n    position: absolute;\n    top: 0;\n    left: 0;\n  }\n\n.checkbox_check__xwFWC {\n\n  top: -12px;\n  left: 1px;\n}\n\n.checkbox_minus__7M053 {\n\n  top: 1px;\n  left: 2px;\n\n  opacity: 0;\n}\n\n.checkbox_input__2b2Fv {\n  position: absolute;\n  top: 0;\n  left: 0;\n\n  width: 100%;\n  height: 100%;\n  margin: 0;\n\n  cursor: pointer;\n\n  opacity: 0\n\n  /* stylelint-disable-next-line selector-max-specificity */\n}\n\n.checkbox_input__2b2Fv:checked + .checkbox_cell__2Td_m,\n  .checkbox_input__2b2Fv:indeterminate[checked] + .checkbox_cell__2Td_m,\n  .checkbox_input__2b2Fv:indeterminate[data-checked=true] + .checkbox_cell__2Td_m {\n    border-color: #80c6ff;\n    border-color: var(--ring-border-hover-color);\n    background-color: #d4edff;\n    background-color: var(--ring-selected-background-color);\n  }\n\n.checkbox_input__2b2Fv {\n\n  /* stylelint-disable-next-line selector-max-specificity */\n}\n\n.checkbox_input__2b2Fv:checked + .checkbox_cell__2Td_m .checkbox_check__xwFWC {\n    transform: translateY(8px);\n\n    opacity: 1;\n  }\n\n.checkbox_input__2b2Fv:focus + .checkbox_cell__2Td_m,\n  .checkbox_input__2b2Fv.checkbox_focus__1YAGP + .checkbox_cell__2Td_m {\n    transition: background-color 0.3s ease-out;\n    transition: background-color var(--ring-ease);\n\n    border-color: #80c6ff;\n\n    border-color: var(--ring-border-hover-color);\n    box-shadow: 0 0 0 1px #80c6ff;\n    box-shadow: 0 0 0 1px var(--ring-border-hover-color);\n  }\n\n.checkbox_input__2b2Fv {\n\n  /* stylelint-disable-next-line selector-max-specificity */\n}\n\n.checkbox_input__2b2Fv:indeterminate + .checkbox_cell__2Td_m .checkbox_minus__7M053 {\n    opacity: 1;\n  }\n\n.checkbox_input__2b2Fv[disabled] {\n    pointer-events: none;\n  }\n\n.checkbox_input__2b2Fv {\n\n  /* stylelint-disable-next-line selector-max-specificity */\n}\n\n.checkbox_input__2b2Fv[disabled][disabled] + .checkbox_cell__2Td_m {\n    border-color: #dfe5eb;\n    border-color: var(--ring-line-color);\n    background-color: #fff;\n    background-color: var(--ring-content-background-color);\n  }\n\n.checkbox_input__2b2Fv {\n\n  /* stylelint-disable-next-line selector-max-specificity */\n}\n\n.checkbox_input__2b2Fv[disabled]:checked + .checkbox_cell__2Td_m .checkbox_check__xwFWC,\n  .checkbox_input__2b2Fv[disabled]:indeterminate + .checkbox_cell__2Td_m .checkbox_minus__7M053 {\n    opacity: 0.5;\n  }\n\n.checkbox_input__2b2Fv {\n\n  /* stylelint-disable-next-line selector-max-specificity */\n}\n\n.checkbox_input__2b2Fv:indeterminate:indeterminate + .checkbox_cell__2Td_m .checkbox_check__xwFWC {\n    transition: none;\n\n    opacity: 0;\n  }\n\n.checkbox_input__2b2Fv[disabled] ~ .checkbox_label__2uzN7 {\n    color: #999;\n    color: var(--ring-disabled-color);\n  }\n\n.checkbox_label__2uzN7 {\n  margin-left: 8px;\n\n  line-height: normal;\n}\n";
var styles = {"unit":"8px","checkboxSize":"14px","checkbox":"checkbox_checkbox__2MvwT","cell":"checkbox_cell__2Td_m","icon":"checkbox_icon__NKeMt","check":"checkbox_check__xwFWC checkbox_icon__NKeMt","minus":"checkbox_minus__7M053 checkbox_icon__NKeMt","input":"checkbox_input__2b2Fv","focus":"checkbox_focus__1YAGP","label":"checkbox_label__2uzN7"};
styleInject(css_248z);

/**
 * @name Checkbox
 */

/**
 * Displays a checkbox.
 */

var Checkbox = /*#__PURE__*/function (_PureComponent) {
  _inherits(Checkbox, _PureComponent);

  var _super = _createSuper(Checkbox);

  function Checkbox() {
    var _this;

    _classCallCheck(this, Checkbox);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "inputRef", function (el) {
      if (el != null) {
        el.indeterminate = _this.props.indeterminate;
      }

      _this.input = el;
    });

    return _this;
  }

  _createClass(Checkbox, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.input != null) {
        this.input.indeterminate = this.props.indeterminate;
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var indeterminate = this.props.indeterminate;

      if (this.input != null && indeterminate !== prevProps.indeterminate) {
        this.input.indeterminate = this.props.indeterminate;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          label = _this$props.label,
          className = _this$props.className,
          containerClassName = _this$props.containerClassName,
          containerStyle = _this$props.containerStyle,
          cellClassName = _this$props.cellClassName,
          labelClassName = _this$props.labelClassName;
          _this$props.indeterminate;
          var restProps = _objectWithoutProperties(_this$props, ["children", "label", "className", "containerClassName", "containerStyle", "cellClassName", "labelClassName", "indeterminate"]);

      var classes = classNames(styles.input, className);
      var containerClasses = classNames(styles.checkbox, containerClassName);
      var cellClasses = classNames(styles.cell, cellClassName);
      var labelClasses = classNames(styles.label, labelClassName);
      return /*#__PURE__*/React.createElement("label", {
        className: containerClasses,
        style: containerStyle,
        "data-test": "ring-checkbox"
      }, /*#__PURE__*/React.createElement("input", _extends({}, restProps, {
        "data-checked": restProps.checked,
        ref: this.inputRef,
        type: "checkbox",
        className: classes
      })), /*#__PURE__*/React.createElement("span", {
        className: cellClasses
      }, /*#__PURE__*/React.createElement(Icon, {
        glyph: checkmarkIcon,
        className: styles.check
      }), /*#__PURE__*/React.createElement(Icon, {
        glyph: minusIcon,
        className: styles.minus
      })), /*#__PURE__*/React.createElement("span", {
        className: labelClasses
      }, label || children));
    }
  }]);

  return Checkbox;
}(PureComponent);

_defineProperty(Checkbox, "propTypes", {
  name: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  containerStyle: PropTypes.object,
  cellClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  defaultChecked: PropTypes.bool,
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.node
});

export default Checkbox;
