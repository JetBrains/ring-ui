import { _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, c as _createClass, e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { T as Theme } from './theme-9a053da9.js';
import styleInject from 'style-inject';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.progress-bar_light__1DQHZ.progress-bar_progressBar__2_qoL {\n    background-color: rgba(0, 0, 0, 0.2);\n  }\n\n.progress-bar_dark__28npm.progress-bar_progressBar__2_qoL {\n    background-color: rgba(255, 255, 255, 0.3);\n  }\n\n.progress-bar_dark__28npm .progress-bar_line__25WPt::after {\n    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.4), rgba(0, 0, 0, 0));\n  }\n\n.progress-bar_progressBar__2_qoL {\n  position: relative;\n  z-index: 1; /* Required to see border-radius on animated background */\n\n  overflow: hidden;\n\n  height: 4px;\n  margin-bottom: 4px;\n\n  border-radius: 2px;\n}\n\n.progress-bar_globalMode__2OJA1 {\n  position: absolute;\n  top: 0;\n\n  width: 100%;\n\n  background: transparent;\n}\n\n.progress-bar_line__25WPt {\n  float: left;\n\n  width: 0;\n  height: 100%;\n\n  transition: width 0.6s ease;\n  text-align: center;\n\n  color: #fff;\n\n  color: var(--ring-content-background-color);\n  border-radius: 2px;\n  background-color: #008eff;\n  background-color: var(--ring-main-color);\n\n  line-height: 4px\n}\n\n.progress-bar_line__25WPt::after {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n\n    content: '';\n    animation: progress-bar_progress-bar__KC7pZ 2500ms linear infinite;\n\n    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.6), rgba(0, 0, 0, 0));\n    background-repeat: no-repeat;\n  }\n\n@keyframes progress-bar_progress-bar__KC7pZ {\n  from {\n    transform: translateX(-100%);\n  }\n\n  to {\n    transform: translateX(100%);\n  }\n}\n";
var styles = {"unit":"8px","light":"progress-bar_light__1DQHZ","progressBar":"progress-bar_progressBar__2_qoL","dark":"progress-bar_dark__28npm","line":"progress-bar_line__25WPt","globalMode":"progress-bar_globalMode__2OJA1","progress-bar":"progress-bar_progress-bar__KC7pZ"};
styleInject(css_248z);

/**
 * @name Progress Bar
 */

var ProgressBar = /*#__PURE__*/function (_PureComponent) {
  _inherits(ProgressBar, _PureComponent);

  var _super = _createSuper(ProgressBar);

  function ProgressBar() {
    var _this;

    _classCallCheck(this, ProgressBar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "progressbarWrapperRef", function (el) {
      _this.progressbarWrapper = el;
    });

    _defineProperty(_assertThisInitialized(_this), "progressbarRef", function (el) {
      _this.progressbar = el;
    });

    return _this;
  }

  _createClass(ProgressBar, [{
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props = this.props,
          theme = _this$props.theme,
          className = _this$props.className,
          global = _this$props.global,
          max = _this$props.max,
          value = _this$props.value,
          otherProps = _objectWithoutProperties(_this$props, ["theme", "className", "global", "max", "value"]);

      var width = value ? "".concat(ProgressBar.toPercent(value, max), "%") : null;
      var classes = classNames(styles.progressBar, className, (_classNames = {}, _defineProperty(_classNames, styles.light, theme === Theme.LIGHT), _defineProperty(_classNames, styles.dark, theme === Theme.DARK), _defineProperty(_classNames, styles.globalMode, global), _classNames));
      return /*#__PURE__*/React.createElement("div", _extends({}, otherProps, {
        className: classes,
        ref: this.progressbarWrapperRef
      }), /*#__PURE__*/React.createElement("div", {
        className: styles.line,
        ref: this.progressbarRef,
        role: "progressbar",
        "aria-valuenow": value,
        "aria-valuemin": 0,
        "aria-valuemax": max,
        style: {
          width: width
        }
      }));
    }
  }], [{
    key: "toPercent",

    /**
     * @param {number} value The progress task value
     * @param {number} max The maximum value
     * @return {number} The progress task value in percents
     * @private
     */
    value: function toPercent(value, max) {
      var HUNDRED_PERCENT = 100;
      var percents = value * HUNDRED_PERCENT / max;
      return percents > HUNDRED_PERCENT ? HUNDRED_PERCENT : percents;
    }
  }]);

  return ProgressBar;
}(PureComponent);

_defineProperty(ProgressBar, "propTypes", {
  theme: PropTypes.string,

  /**
   * Sets the ring-progress-bar_global class to position the progress bar on top of the screen.
   * Should be placed directly inside body, will be positioned right below .ring-header
   * if placed adjacent to it.
   * @type {boolean}
   */
  global: PropTypes.bool,

  /**
   * Custom class
   * @type {string}
   */
  className: PropTypes.string,
  style: PropTypes.object,

  /**
   * A floating point number that specifies minimum completion rate for a task to be considered
   * complete. Default value is 1.0.
   * @type {number}
   */
  max: PropTypes.number,

  /**
   * A floating point number that specifies current task completion rate.
   * @type {number}
   */
  value: PropTypes.number
});

_defineProperty(ProgressBar, "defaultProps", {
  max: 1.0,
  value: 0,
  theme: Theme.LIGHT
});

export default ProgressBar;
