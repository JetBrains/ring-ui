import { _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass, d as _defineProperty, e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { w as withTheme } from './theme-9a053da9.js';
import { j as joinDataTestAttributes } from './data-tests-1a367745.js';
import styleInject from 'style-inject';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.toggle_toggle__37a4t {\n  cursor: pointer\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.toggle_toggle__37a4t:hover .toggle_switch__3m_1F {\n      background-color: #80c6ff;\n      background-color: var(--ring-border-hover-color);\n    }}\n\n.toggle_toggle__37a4t.toggle_disabled__1Nujn {\n    pointer-events: none;\n  }\n\n.toggle_label__2s4dr {\n  margin-left: 4px;\n}\n\n.toggle_leftLabel__2XtTm {\n  margin-right: 4px;\n}\n\n.toggle_light__3wTpp .toggle_switch__3m_1F {\n    background-color: #b8d1e5;\n    background-color: var(--ring-icon-color)\n  }\n\n.toggle_light__3wTpp .toggle_switch__3m_1F::before {\n      background-color: #fff;\n      background-color: var(--ring-content-background-color);\n    }\n\n.toggle_dark__2FaPj .toggle_switch__3m_1F {\n    background-color: #406380;\n    background-color: var(--ring-hint-color)\n  }\n\n.toggle_dark__2FaPj .toggle_switch__3m_1F::before {\n      background-color: #000;\n      background-color: var(--ring-navigation-background-color);\n    }\n\n.toggle_switchWrapper__2IR8k {\n  position: relative;\n\n  display: inline-block;\n\n  width: 24px;\n  height: 16px;\n\n  vertical-align: -3px;\n}\n\n.toggle_input__PBjqP {\n  position: absolute;\n  top: 0;\n  left: 0;\n\n  width: 100%;\n  height: 100%;\n\n  margin: 0;\n\n  opacity: 0;\n}\n\n.toggle_switch__3m_1F {\n  position: relative;\n\n  display: block;\n\n  width: 100%;\n  height: 100%;\n\n  transition: background-color cubic-bezier(0.23, 1, 0.32, 1) 300ms\n}\n\n.toggle_input__PBjqP:focus + .toggle_switch__3m_1F {\n    box-shadow: inset 0 0 0 1px #80c6ff, 0 0 0 1px #80c6ff;\n    box-shadow: inset 0 0 0 1px var(--ring-border-hover-color), 0 0 0 1px var(--ring-border-hover-color)\n}\n\n.toggle_switch__3m_1F {\n\n  border-radius: 8px\n}\n\n.toggle_switch__3m_1F::before {\n    position: absolute;\n    top: 2px;\n    left: 0;\n\n    width: 12px;\n    height: 12px;\n\n    content: \"\";\n\n    transition: transform cubic-bezier(0.23, 1, 0.32, 1) 300ms;\n\n    transform: translateX(2px);\n\n    border-radius: 6px;\n  }\n\n.toggle_input__PBjqP:checked + .toggle_switch__3m_1F {\n  background-color: #008eff;\n  background-color: var(--ring-main-color);\n}\n\n.toggle_input__PBjqP:checked + ::before {\n  transform: translateX(10px);\n}\n\n.toggle_size20__3A2b7 .toggle_switchWrapper__2IR8k {\n    width: 32px;\n    height: 20px;\n\n    vertical-align: -5px;\n  }\n\n.toggle_size20__3A2b7 .toggle_switch__3m_1F {\n    border-radius: 10px\n  }\n\n.toggle_size20__3A2b7 .toggle_switch__3m_1F::before {\n      width: 16px;\n      height: 16px;\n\n      border-radius: 8px;\n    }\n\n.toggle_size20__3A2b7 {\n\n  /* stylelint-disable-next-line selector-max-specificity */\n}\n\n.toggle_size20__3A2b7 .toggle_input__PBjqP:checked + ::before {\n    transform: translateX(14px);\n  }\n\n.toggle_input__PBjqP[disabled] + ::after {\n  position: absolute;\n  top: 0;\n  left: 0;\n\n  width: 100%;\n  height: 100%;\n\n  content: \"\";\n\n  border-radius: 8px;\n  background-image:\n    linear-gradient(\n      45deg,\n      transparent,\n      transparent 37.5%,\n      rgba(255, 255, 255, 0.9) 37.5%,\n      rgba(255, 255, 255, 0.9) 50%,\n      transparent 50%,\n      transparent 87.5%,\n      rgba(255, 255, 255, 0.9) 87.5%,\n      rgba(255, 255, 255, 0.9)\n    );\n  background-repeat: repeat;\n  background-size: 4px 4px;\n}\n\n.toggle_paleSwitch__1uHYH.toggle_paleSwitch__1uHYH {\n  background-color: #cfdbe5;\n  background-color: var(--ring-pale-control-color);\n}\n\n.toggle_input__PBjqP:checked + .toggle_paleSwitch__1uHYH {\n  background-color: #80c6ff;\n  background-color: var(--ring-border-hover-color);\n}\n";
var styles = {"unit":"8px","padding":"2px","disabled-line-color":"rgba(255, 255, 255, 0.9)","duration":"300ms","timing-function":"cubic-bezier(0.23, 1, 0.32, 1)","toggle":"toggle_toggle__37a4t","switch":"toggle_switch__3m_1F","disabled":"toggle_disabled__1Nujn","label":"toggle_label__2s4dr","leftLabel":"toggle_leftLabel__2XtTm","light":"toggle_light__3wTpp","dark":"toggle_dark__2FaPj","switchWrapper":"toggle_switchWrapper__2IR8k","input":"toggle_input__PBjqP","size20":"toggle_size20__3A2b7","paleSwitch":"toggle_paleSwitch__1uHYH"};
styleInject(css_248z);

var Size = {
  Size16: styles.size16,
  Size20: styles.size20
};
/**
  * @name Toggle
  */

var Toggle = /*#__PURE__*/function (_PureComponent) {
  _inherits(Toggle, _PureComponent);

  var _super = _createSuper(Toggle);

  function Toggle() {
    _classCallCheck(this, Toggle);

    return _super.apply(this, arguments);
  }

  _createClass(Toggle, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          children = _this$props.children,
          disabled = _this$props.disabled,
          pale = _this$props.pale,
          title = _this$props.title,
          leftLabel = _this$props.leftLabel,
          theme = _this$props.theme,
          _this$props$size = _this$props.size,
          size = _this$props$size === void 0 ? Size.Size16 : _this$props$size,
          dataTest = _this$props['data-test'],
          onTransitionEnd = _this$props.onTransitionEnd,
          restProps = _objectWithoutProperties(_this$props, ["className", "children", "disabled", "pale", "title", "leftLabel", "theme", "size", "data-test", "onTransitionEnd"]);

      var classes = classNames(className, size, styles.toggle, styles[theme], disabled && styles.disabled);
      return /*#__PURE__*/React.createElement("label", {
        className: classes,
        title: title,
        "data-test": joinDataTestAttributes('ring-toggle', dataTest)
      }, leftLabel && /*#__PURE__*/React.createElement("span", {
        className: styles.leftLabel
      }, leftLabel), /*#__PURE__*/React.createElement("span", {
        className: styles.switchWrapper
      }, /*#__PURE__*/React.createElement("input", _extends({
        "data-test": "ring-toggle-input"
      }, restProps, {
        type: "checkbox",
        disabled: disabled,
        className: styles.input
      })), /*#__PURE__*/React.createElement("span", {
        className: classNames(styles.switch, pale && styles.paleSwitch),
        onTransitionEnd: onTransitionEnd
      })), children && /*#__PURE__*/React.createElement("span", {
        className: styles.label
      }, children));
    }
  }]);

  return Toggle;
}(PureComponent);

_defineProperty(Toggle, "propTypes", {
  children: PropTypes.node,
  name: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  leftLabel: PropTypes.node,
  defaultChecked: PropTypes.bool,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  pale: PropTypes.bool,
  onChange: PropTypes.func,
  onTransitionEnd: PropTypes.func,
  theme: PropTypes.string,
  size: PropTypes.oneOf(Object.values(Size)),
  'data-test': PropTypes.string
});

var toggle = withTheme()(Toggle);

export default toggle;
export { Size };
