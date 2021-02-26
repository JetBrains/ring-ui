import { d as _defineProperty, _ as _inherits, a as _createSuper, b as _classCallCheck, g as _assertThisInitialized, c as _createClass, e as _objectWithoutProperties, f as _extends, i as _objectSpread2 } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { Component, forwardRef, createContext } from 'react';
import PropTypes from 'prop-types';
import { g as getUID } from './get-uid-bf3ab014.js';
import classNames from 'classnames';
import styleInject from 'style-inject';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.radio_radio__3PsAc {\n  position: relative;\n\n  display: block;\n\n  text-align: left;\n\n  color: #1f2326;\n\n  color: var(--ring-text-color);\n  outline: none\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.radio_radio__3PsAc:hover .radio_circle__2UzPl {\n    transition: none;\n\n    border-color: #80c6ff;\n\n    border-color: var(--ring-border-hover-color);\n  }}\n\n.radio_circle__2UzPl {\n  position: relative;\n  top: -2px;\n\n  display: inline-block;\n\n  box-sizing: border-box;\n  width: 16px;\n  height: 16px;\n\n  -webkit-user-select: none;\n\n      -ms-user-select: none;\n\n          user-select: none;\n  transition: border-color 0.3s ease-out, box-shadow 0.3s ease-out;\n  transition: border-color var(--ring-ease), box-shadow var(--ring-ease);\n  vertical-align: middle;\n  pointer-events: none;\n\n  border: 1px solid #b8d1e5;\n\n  border: 1px solid var(--ring-borders-color);\n  border-radius: 8px;\n  background-color: #fff;\n  background-color: var(--ring-content-background-color)\n}\n\n.radio_circle__2UzPl::after {\n    position: absolute;\n    top: 3px;\n    left: 3px;\n\n    width: 8px;\n    height: 8px;\n\n    content: \"\";\n\n    transition: opacity 0.15s ease-out, transform 0.15s ease-out;\n\n    transition: opacity var(--ring-fast-ease), transform var(--ring-fast-ease);\n\n    transform: scale(0);\n\n    opacity: 0;\n\n    border-radius: 4px;\n    background-color: #008eff;\n    background-color: var(--ring-main-color);\n  }\n\n.radio_input__2maS5 {\n  position: absolute;\n  top: 0;\n  left: 0;\n\n  width: 100%;\n  height: 100%;\n  margin: 0;\n\n  cursor: pointer;\n\n  opacity: 0\n}\n\n.radio_input__2maS5[disabled] + .radio_circle__2UzPl {\n    border-color: #b8d1e5;\n    border-color: var(--ring-borders-color);\n  }\n\n.radio_input__2maS5:checked + .radio_circle__2UzPl {\n    border-color: #80c6ff;\n    border-color: var(--ring-border-hover-color)\n\n    /* stylelint-disable-next-line selector-max-specificity */\n  }\n\n.radio_input__2maS5:checked + .radio_circle__2UzPl::after {\n      transition: none;\n\n      transform: scale(1);\n\n      opacity: 1;\n    }\n\n.radio_input__2maS5:focus + .radio_circle__2UzPl,\n  .radio_input__2maS5.radio_focus__2AY3h + .radio_circle__2UzPl {\n    border-color: #80c6ff;\n    border-color: var(--ring-border-hover-color);\n    box-shadow: 0 0 0 1px #80c6ff;\n    box-shadow: 0 0 0 1px var(--ring-border-hover-color);\n  }\n\n.radio_input__2maS5[disabled] {\n    pointer-events: none;\n  }\n\n.radio_input__2maS5 {\n\n  /* stylelint-disable-next-line selector-max-specificity */\n}\n\n.radio_input__2maS5[disabled]:checked + .radio_circle__2UzPl::after {\n    opacity: 0.5;\n  }\n\n.radio_input__2maS5[disabled] ~ .radio_label__1qwrN {\n    color: #999;\n    color: var(--ring-disabled-color);\n  }\n\n.radio_label__1qwrN {\n  margin-left: 8px;\n\n  line-height: 32px;\n}\n";
var styles = {"unit":"8px","radio-size":"calc(2 * 8px)","radio":"radio_radio__3PsAc","circle":"radio_circle__2UzPl","input":"radio_input__2maS5","focus":"radio_focus__2AY3h","label":"radio_label__1qwrN"};
styleInject(css_248z);

var RadioContext = /*#__PURE__*/createContext({});
var Radio = /*#__PURE__*/function (_Component) {
  _inherits(Radio, _Component);

  var _super = _createSuper(Radio);

  function Radio() {
    var _this;

    _classCallCheck(this, Radio);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "uid", getUID('ring-radio-item-'));

    _defineProperty(_assertThisInitialized(_this), "inputRef", function (el) {
      _this.input = el;
    });

    _defineProperty(_assertThisInitialized(_this), "labelRef", function (el) {
      _this.label = el;
    });

    return _this;
  }

  _createClass(Radio, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          children = _this$props.children,
          restProps = _objectWithoutProperties(_this$props, ["className", "children"]);

      var classes = classNames(styles.radio, className);
      return /*#__PURE__*/React.createElement("label", {
        ref: this.labelRef,
        className: classes,
        htmlFor: this.uid
      }, /*#__PURE__*/React.createElement("input", _extends({
        name: name,
        id: this.uid
      }, restProps, {
        ref: this.inputRef,
        className: styles.input,
        type: "radio"
      })), /*#__PURE__*/React.createElement("span", {
        className: styles.circle
      }), /*#__PURE__*/React.createElement("span", {
        className: styles.label
      }, children));
    }
  }]);

  return Radio;
}(Component);

_defineProperty(Radio, "propTypes", {
  className: PropTypes.string,
  children: PropTypes.node,
  value: PropTypes.string,
  name: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func
});

var RadioItem = /*#__PURE__*/forwardRef(function RadioItem(props, ref) {
  return /*#__PURE__*/React.createElement(RadioContext.Consumer, null, function (_ref) {
    var value = _ref.value,
        onChange = _ref.onChange,
        restContext = _objectWithoutProperties(_ref, ["value", "onChange"]);

    return /*#__PURE__*/React.createElement(Radio, _extends({
      ref: ref
    }, restContext, {
      checked: value != null ? value === props.value : undefined,
      onChange: onChange && function () {
        return onChange(props.value);
      }
    }, props));
  });
});
RadioItem.propTypes = Radio.propTypes;

/**
 * @name Radio
 */

var Radio$1 = /*#__PURE__*/function (_Component) {
  _inherits(Radio, _Component);

  var _super = _createSuper(Radio);

  function Radio() {
    var _this;

    _classCallCheck(this, Radio);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "uid", getUID('ring-radio-'));

    return _this;
  }

  _createClass(Radio, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(RadioContext.Provider, {
        value: _objectSpread2({
          name: this.uid
        }, this.props)
      }, this.props.children);
    }
  }]);

  return Radio;
}(Component);

_defineProperty(Radio$1, "propTypes", {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onChange: PropTypes.func,
  children: PropTypes.node.isRequired
});

_defineProperty(Radio$1, "Item", RadioItem);

export default Radio$1;
