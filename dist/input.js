import { _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, c as _createClass, e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import closeIcon from '@jetbrains/icons/close';
import { w as withTheme } from './theme-9a053da9.js';
export { T as Theme } from './theme-9a053da9.js';
import { B as Button } from './button-c0bc1992.js';
import { g as getUID } from './get-uid-bf3ab014.js';
import Icon from './icon.js';
import styleInject from 'style-inject';
import 'focus-visible';
import '@jetbrains/icons/chevron-10px';
import './clickableLink-3fc5662b.js';
import 'util-deprecate';
import './memoize-ad2c954c.js';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.input_input__Aoceq:-webkit-autofill:hover {\n      -webkit-transition: background-color 50000s ease-in-out 0s;\n      transition: background-color 50000s ease-in-out 0s;\n    }}\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.input_container__3e2Ri {\n\n  position: relative;\n\n  box-sizing: border-box;\n  min-height: 64px;\n  padding-top: 16px\n}\n\n.input_container__3e2Ri * {\n    box-sizing: border-box;\n  }\n\n.input_compact__3sBkw {\n  min-height: 32px;\n  padding: 0;\n}\n\n.input_input__Aoceq {\n  width: 100%;\n  min-height: 32px;\n  padding: 0;\n\n  border: none;\n  outline: none;\n  background: transparent;\n\n  font: inherit;\n  caret-color: #008eff;\n  caret-color: var(--ring-main-color)\n}\n\n.input_clearable__tRq7D .input_input__Aoceq {\n    padding-right: 24px\n}\n\n[dir=rtl] .input_clearable__tRq7D .input_input__Aoceq {\n      padding-right: 0;\n      padding-left: 24px\n}\n\n.input_light__1o2Is .input_input__Aoceq {\n    color: #1f2326;\n    color: var(--ring-text-color)\n}\n\n.input_dark__1Pcil .input_input__Aoceq {\n    color: #fff;\n    color: var(--ring-dark-text-color)\n}\n\n.input_input__Aoceq:-ms-input-placeholder {\n    color: transparent;\n  }\n\n.input_input__Aoceq::placeholder {\n    color: transparent;\n  }\n\n.input_input__Aoceq[disabled] {\n    color: #999;\n    color: var(--ring-disabled-color);\n\n    -webkit-text-fill-color: #999;\n\n    -webkit-text-fill-color: var(--ring-disabled-color); /* Required for Safari, see RG-2063 for details */\n  }\n\n.input_input__Aoceq {\n\n  /*\n    Kill yellow/blue webkit autocomplete\n    https://css-tricks.com/snippets/css/change-autocomplete-styles-webkit-browsers/\n  */\n}\n\n.input_input__Aoceq:-webkit-autofill,\n    .input_input__Aoceq:-webkit-autofill:focus {\n      -webkit-transition: background-color 50000s ease-in-out 0s;\n      transition: background-color 50000s ease-in-out 0s;\n    }\n\n.input_input__Aoceq {\n\n  /* if you need a cross, pass onClear prop */\n}\n\n.input_input__Aoceq::-ms-clear {\n    display: none;\n  }\n\n.input_withIcon__3nsOK .input_input__Aoceq,\n.input_withIcon__3nsOK .input_label__3mt6D {\n  padding-left: 22px\n}\n\n[dir=rtl] .input_withIcon__3nsOK .input_input__Aoceq,\n[dir=rtl] .input_withIcon__3nsOK .input_label__3mt6D {\n    padding-right: 22px;\n    padding-left: 0\n}\n\n.input_icon__Hiuyd,\n\n.input_clear__2-7VT.input_clear__2-7VT {\n  position: absolute;\n  top: 17px;\n\n  line-height: 32px\n}\n\n.input_compact__3sBkw .input_icon__Hiuyd,\n\n.input_compact__3sBkw .input_clear__2-7VT.input_clear__2-7VT {\n    top: 1px\n}\n\n.input_icon__Hiuyd {\n  left: 0;\n\n  color: #b8d1e5;\n\n  color: var(--ring-icon-color)\n}\n\n[dir=rtl] .input_icon__Hiuyd {\n    right: 0;\n    left: auto\n}\n\n.input_clear__2-7VT {\n  right: 0;\n\n  padding-right: 0\n}\n\n.input_empty__2ruUY .input_clear__2-7VT {\n    display: none\n}\n\n[dir=rtl] .input_clear__2-7VT {\n    right: auto;\n    left: 0\n}\n\ntextarea.input_input__Aoceq {\n  overflow: hidden;\n\n  box-sizing: border-box;\n  padding-top: 8px;\n\n  resize: none;\n}\n\n.input_label__3mt6D {\n  position: absolute;\n  top: 23px;\n  left: 0;\n\n  transition: transform 0.15s ease-out, color 0.15s ease-out;\n\n  transition: transform var(--ring-fast-ease), color var(--ring-fast-ease);\n  transform-origin: top left;\n  pointer-events: none\n}\n\n.input_light__1o2Is .input_label__3mt6D {\n    color: #737577;\n    color: var(--ring-secondary-color)\n}\n\n.input_dark__1Pcil .input_label__3mt6D {\n    color: #888;\n    color: var(--ring-dark-secondary-color)\n}\n\n.input_input__Aoceq:focus ~ .input_label__3mt6D,\n.input_container__3e2Ri.input_active__3fOUW > .input_label__3mt6D,\n.input_container__3e2Ri:not(.input_empty__2ruUY) > .input_label__3mt6D {\n  transform: translateY(-20px) scale(0.92308);\n}\n\n.input_noLabel__3dYsX :-ms-input-placeholder, .input_input__Aoceq:focus:-ms-input-placeholder {\n  -ms-transition: color 0.15s ease-out;\n  transition: color 0.15s ease-out;\n  -ms-transition: color var(--ring-fast-ease);\n  transition: color var(--ring-fast-ease);\n}\n\n.input_noLabel__3dYsX ::placeholder,\n.input_input__Aoceq:focus::placeholder {\n  transition: color 0.15s ease-out;\n  transition: color var(--ring-fast-ease);\n}\n\n.input_light__1o2Is.input_noLabel__3dYsX :-ms-input-placeholder, .input_light__1o2Is :focus:-ms-input-placeholder {\n  color: #999;\n  color: var(--ring-disabled-color);\n}\n\n.input_light__1o2Is.input_noLabel__3dYsX ::placeholder,\n.input_light__1o2Is :focus::placeholder {\n  color: #999;\n  color: var(--ring-disabled-color);\n}\n\n/* stylelint-disable-next-line selector-max-specificity */\n\n.input_dark__1Pcil.input_noLabel__3dYsX :-ms-input-placeholder, .input_dark__1Pcil :focus:-ms-input-placeholder {\n  color: #737577;\n  color: var(--ring-secondary-color);\n}\n\n.input_dark__1Pcil.input_noLabel__3dYsX ::placeholder,\n\n.input_dark__1Pcil :focus::placeholder {\n  color: #737577;\n  color: var(--ring-secondary-color);\n}\n\n.input_input__Aoceq:focus ~ .input_label__3mt6D {\n  color: #008eff;\n  color: var(--ring-main-color);\n}\n\n.input_error__cP6Mv > :focus ~ .input_label__3mt6D {\n  color: #c22731;\n  color: var(--ring-error-color);\n}\n\n.input_underline__31gsk {\n  height: 1px;\n\n  border-bottom-width: 1px;\n  border-bottom-style: solid\n}\n\n.input_light__1o2Is .input_underline__31gsk {\n    border-color: #b8d1e5;\n    border-color: var(--ring-borders-color)\n}\n\n.input_dark__1Pcil .input_underline__31gsk {\n    border-color: #406380;\n    border-color: var(--ring-dark-borders-color)\n}\n\n.input_input__Aoceq[disabled] ~ .input_underline__31gsk {\n  border-bottom-style: dashed;\n}\n\n.input_focusUnderline__1USJ0,\n.input_errorUnderline__3vxYv {\n  width: 100%;\n  height: 2px;\n\n  transform: scaleX(0);\n  transform-origin: top left;\n}\n\n.input_focusUnderline__1USJ0 {\n  margin-top: -1px;\n\n  background: #008eff;\n\n  background: var(--ring-main-color);\n}\n\n.input_errorUnderline__3vxYv {\n  margin-top: -2px;\n\n  background: #db5860;\n\n  background: var(--ring-icon-error-color)\n}\n\n.input_dark__1Pcil .input_errorUnderline__3vxYv {\n    background: #c22731;\n    background: var(--ring-error-color)\n}\n\n.input_input__Aoceq:focus ~ .input_focusUnderline__1USJ0,\n.input_container__3e2Ri.input_active__3fOUW > .input_focusUnderline__1USJ0,\n.input_error__cP6Mv > .input_errorUnderline__3vxYv {\n  transition: transform 0.15s ease-out;\n  transform: scaleX(1);\n}\n\n.input_errorText__vwRxH {\n  overflow: hidden;\n\n  box-sizing: border-box;\n  height: 0;\n  padding: 4px 0 8px;\n\n  transition: height 0.3s ease-out;\n\n  color: #c22731;\n\n  color: var(--ring-error-color);\n\n  font-size: 12px;\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: 16px;\n  line-height: var(--ring-line-height-lowest);\n}\n\n.input_sizeS__16z07 {\n  width: 96px;\n}\n\n.input_sizeM__p7-cg {\n  width: 240px;\n}\n\n.input_sizeL__aI6kI {\n  width: 400px;\n}\n\n.input_sizeFULL__3lwSb {\n  width: 100%;\n}\n";
var styles = {"unit":"8px","iconOffset":"calc(8px * 3 - 2px)","input":"input_input__Aoceq","container":"input_container__3e2Ri global_font-lower__11Bp7 global_font__2H0e4","compact":"input_compact__3sBkw","clearable":"input_clearable__tRq7D","light":"input_light__1o2Is","dark":"input_dark__1Pcil","withIcon":"input_withIcon__3nsOK","label":"input_label__3mt6D","icon":"input_icon__Hiuyd","clear":"input_clear__2-7VT","empty":"input_empty__2ruUY","active":"input_active__3fOUW","noLabel":"input_noLabel__3dYsX","error":"input_error__cP6Mv","underline":"input_underline__31gsk","focusUnderline":"input_focusUnderline__1USJ0","errorUnderline":"input_errorUnderline__3vxYv","errorText":"input_errorText__vwRxH","sizeS":"input_sizeS__16z07","sizeM":"input_sizeM__p7-cg","sizeL":"input_sizeL__aI6kI","sizeFULL":"input_sizeFULL__3lwSb"};
styleInject(css_248z);

function noop() {}
/**
 * @name Input
 */


var Size = {
  AUTO: 'Auto',
  S: 'S',
  M: 'M',
  L: 'L',
  FULL: 'FULL'
};
var Input = /*#__PURE__*/function (_PureComponent) {
  _inherits(Input, _PureComponent);

  var _super = _createSuper(Input);

  function Input() {
    var _this;

    _classCallCheck(this, Input);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      empty: true
    });

    _defineProperty(_assertThisInitialized(_this), "id", getUID('ring-input-'));

    _defineProperty(_assertThisInitialized(_this), "underlineRef", function (el) {
      _this.underlineNode = el;
    });

    _defineProperty(_assertThisInitialized(_this), "inputRef", function (el) {
      var inputRef = _this.props.inputRef;
      _this.input = el;

      if (typeof inputRef === 'function') {
        inputRef(el);
      } else {
        inputRef.current = el;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "clear", function (e) {
      _this.props.onClear && _this.props.onClear(e);
    });

    _defineProperty(_assertThisInitialized(_this), "handleChange", function (e) {
      _this.props.onChange(e);

      _this.checkValue(e.target);
    });

    return _this;
  }

  _createClass(Input, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.adapt();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.adapt();
    }
  }, {
    key: "getId",
    value: function getId() {
      return this.props.id || this.id;
    }
  }, {
    key: "checkValue",
    value: function checkValue() {
      this.setState({
        empty: !this.input.value
      });

      if (this.props.multiline && this.input.scrollHeight > this.input.clientHeight) {
        this.stretch(this.input);
      }
    }
  }, {
    key: "stretch",
    value: function stretch(el) {
      if (!el || !el.style) {
        return;
      }

      el.style.height = "".concat(el.scrollHeight, "px");
    }
  }, {
    key: "adapt",
    value: function adapt() {
      this.checkValue();
      this.stretch(this.underlineNode);
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props = this.props,
          theme = _this$props.theme,
          size = _this$props.size,
          active = _this$props.active,
          multiline = _this$props.multiline,
          borderless = _this$props.borderless,
          compact = _this$props.compact,
          label = _this$props.label,
          error = _this$props.error,
          className = _this$props.className,
          inputClassName = _this$props.inputClassName,
          children = _this$props.children,
          value = _this$props.value,
          onClear = _this$props.onClear,
          disabled = _this$props.disabled;
          _this$props.inputRef;
          _this$props.onChange;
          var enableShortcuts = _this$props.enableShortcuts;
          _this$props.id;
          var placeholder = _this$props.placeholder,
          icon = _this$props.icon,
          renderUnderline = _this$props.renderUnderline,
          restProps = _objectWithoutProperties(_this$props, ["theme", "size", "active", "multiline", "borderless", "compact", "label", "error", "className", "inputClassName", "children", "value", "onClear", "disabled", "inputRef", "onChange", "enableShortcuts", "id", "placeholder", "icon", "renderUnderline"]);

      var minimizeMargins = compact || borderless;
      var empty = this.state.empty;
      var clearable = !!onClear;
      var classes = classNames(styles.container, className, styles[theme], [styles["size".concat(size)]], (_classNames = {
        'ring-js-shortcuts': enableShortcuts === true
      }, _defineProperty(_classNames, styles.active, active), _defineProperty(_classNames, styles.error, error != null), _defineProperty(_classNames, styles.empty, empty), _defineProperty(_classNames, styles.noLabel, !this.props.label), _defineProperty(_classNames, styles.withIcon, icon != null), _defineProperty(_classNames, styles.clearable, clearable), _defineProperty(_classNames, styles.compact, minimizeMargins), _classNames));
      var inputClasses = classNames(styles.input, inputClassName);
      var TagName = multiline ? 'textarea' : 'input';
      var text = value != null ? value : children;
      return /*#__PURE__*/React.createElement("div", {
        className: classes,
        "data-test": "ring-input"
      }, icon && /*#__PURE__*/React.createElement(Icon, {
        glyph: icon,
        className: styles.icon
      }), /*#__PURE__*/React.createElement(TagName, _extends({
        ref: this.inputRef,
        onChange: this.handleChange,
        className: inputClasses,
        value: text,
        rows: multiline ? 1 : null,
        disabled: disabled,
        id: this.getId(),
        placeholder: placeholder,
        "aria-label": typeof label === 'string' && label ? label : placeholder,
        "data-enabled-shortcuts": Array.isArray(enableShortcuts) ? enableShortcuts.join(',') : null
      }, restProps)), clearable && !disabled && /*#__PURE__*/React.createElement(Button, {
        title: "Clear input",
        "data-test": "ring-input-clear",
        className: styles.clear,
        icon: closeIcon,
        onClick: this.clear
      }), !minimizeMargins && /*#__PURE__*/React.createElement("label", {
        htmlFor: this.getId(),
        className: styles.label
      }, label), !borderless && /*#__PURE__*/React.createElement("div", {
        className: styles.underline
      }), !borderless && /*#__PURE__*/React.createElement("div", {
        className: styles.focusUnderline
      }), !minimizeMargins && /*#__PURE__*/React.createElement("div", {
        className: styles.errorUnderline
      }), !minimizeMargins && renderUnderline(this.underlineRef, error));
    }
  }]);

  return Input;
}(PureComponent);

_defineProperty(Input, "propTypes", {
  value: PropTypes.string,
  theme: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  size: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  active: PropTypes.bool,
  error: PropTypes.string,
  multiline: PropTypes.bool,
  borderless: PropTypes.bool,
  compact: PropTypes.bool,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.instanceOf(HTMLInputElement)
  })]),
  children: PropTypes.string,
  enableShortcuts: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.string)]),
  disabled: PropTypes.bool,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  renderUnderline: PropTypes.func
});

_defineProperty(Input, "defaultProps", {
  size: Size.M,
  onChange: noop,
  inputRef: noop,
  enableShortcuts: ['esc'],
  renderUnderline: function renderUnderline(underlineRef, errorText) {
    return /*#__PURE__*/React.createElement("div", {
      className: styles.errorText,
      ref: underlineRef
    }, errorText);
  }
});

var Input$1 = withTheme()(Input);

export default Input$1;
export { Input, Size };
