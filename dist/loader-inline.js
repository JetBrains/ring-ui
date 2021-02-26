import { h as _slicedToArray, i as _objectSpread2, d as _defineProperty, _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass, e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { T as Theme, w as withTheme } from './theme-9a053da9.js';
import { j as joinDataTestAttributes } from './data-tests-1a367745.js';
import styleInject from 'style-inject';
import 'conic-gradient';
import { m as memoize } from './memoize-ad2c954c.js';
import { g as getUID } from './get-uid-bf3ab014.js';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n@keyframes loader-inline_spin__RoQ6Z {\n  0% {\n    transform: rotate(0);\n  }\n\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loader-inline_pulse__3S00P {\n  0% {\n    transform: scale(1);\n  }\n\n  100% {\n    transform: scale(1.41667);\n  }\n}\n\n.loader-inline_loader__1jSuh,\n.ring-loader-inline {\n  /* needed for better backward-compatibility */\n\n  position: relative;\n\n  display: inline-block;\n\n  overflow: hidden;\n\n  transform: rotate(0);\n  animation: loader-inline_spin__RoQ6Z 1s linear infinite;\n  vertical-align: -3px;\n\n  border-radius: 8px\n}\n\n.loader-inline_loader__1jSuh,\n  .loader-inline_loader__1jSuh::after,\n  .ring-loader-inline,\n  .ring-loader-inline::after {\n    transform-origin: 50% 50%;\n  }\n\n.loader-inline_loader__1jSuh::after, .ring-loader-inline::after {\n    display: block;\n\n    width: 16px;\n    height: 16px;\n\n    content: '';\n    animation: loader-inline_pulse__3S00P 0.85s cubic-bezier(0.68, 0, 0.74, 0.74) infinite alternate;\n  }\n\n.loader-inline_children__dldpF {\n  margin-left: 4px;\n}\n";
var styles = {"unit":"8px","loader":"loader-inline_loader__1jSuh","spin":"loader-inline_spin__RoQ6Z","pulse":"loader-inline_pulse__3S00P","children":"loader-inline_children__dldpF"};
styleInject(css_248z);

var supportsCss = memoize(function (declaration) {
  var _declaration$split = declaration.split(': '),
      _declaration$split2 = _slicedToArray(_declaration$split, 2),
      property = _declaration$split2[0],
      value = _declaration$split2[1];

  var camelCaseProperty = property.replace(/-(\w)/g, function (_, letter) {
    return letter.toUpperCase();
  });
  var div = document.createElement('div');

  if (div.style[camelCaseProperty] === undefined) {
    return false;
  }

  if (value) {
    div.style[camelCaseProperty] = value;
    return Boolean(div.style[camelCaseProperty]);
  }

  return true;
});

var conicGradient = memoize(function (_ref) {
  var stops = _ref.stops,
      size = _ref.size;
  return supportsCss('background-image: conic-gradient(white, black)') ? "conic-gradient(".concat(stops, ")") : new ConicGradient({
    stops: stops,
    size: size
  });
});
var conicGradientWithMask = function conicGradientWithMask(mask, stops, size) {
  var gradient = conicGradient({
    stops: stops,
    size: size
  });

  if (!mask.supports && gradient instanceof ConicGradient) {
    Object.defineProperty(gradient, 'svg', {
      value: gradient.svg.replace('<image ', "\n        ".concat(mask.svgDefs, "    \n        <image mask=\"url(#").concat(mask.maskId, ")\" "))
    });
  }

  return _objectSpread2(_objectSpread2({}, mask.css), {}, {
    'background-image': gradient.toString()
  });
};

var injectStyleSheet = function injectStyleSheet(styles) {
  var styleTag = document.createElement('style');
  styleTag.setAttribute('type', 'text/css');
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);
  return styleTag;
};
var injectRuleSet = function injectRuleSet(selector, declarations) {
  return injectStyleSheet("\n".concat(selector, " {\n  ").concat(Object.entries(declarations).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        property = _ref2[0],
        value = _ref2[1];

    return "".concat(property, ": ").concat(value, ";");
  }).join("\n  "), "\n}"));
};

var radialGradient = function radialGradient(length, stops) {
  return "radial-gradient(".concat(length, ", ").concat(Object.entries(stops).map(function (entry) {
    return entry.join(' ');
  }).join(', '), ")");
};

var radialGradientMask = (function (length, stops) {
  for (var _i = 0, _arr = ['', '-webkit-']; _i < _arr.length; _i++) {
    var prefix = _arr[_i];
    var property = "".concat(prefix, "mask-image");
    var declaration = "".concat(property, ": radial-gradient(black, white)");

    if (supportsCss(declaration)) {
      return {
        supports: true,
        css: _defineProperty({}, property, radialGradient(length, stops))
      };
    }
  }

  var gradientId = getUID('gradient');
  var maskId = getUID('mask');
  var svgDefs = "\n    <svg>\n      <defs>\n        <radialGradient id=\"".concat(gradientId, "\">\n          ").concat(Object.entries(stops).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        color = _ref2[0],
        offset = _ref2[1];

    return "\n            <stop offset=\"".concat(offset, "\" stop-color=\"").concat(color, "\"/>\n          ");
  }).join(''), "\n        </radialGradient>\n        <mask id=\"").concat(maskId, "\">\n          <rect height=\"100%\" width=\"100%\" fill=\"url(#").concat(gradientId, ")\"/>\n        </mask>\n      </defs>\n    </svg>\n  ");
  return {
    supports: false,
    css: {},
    maskId: maskId,
    svgDefs: svgDefs
  };
});

var IMAGE_SIZE = 32;
var injectStyles = memoize(function () {
  var mask = radialGradientMask(styles.unit, {
    /* eslint-disable no-magic-numbers */
    transparent: "".concat(23 / 32 * 100, "%"),
    white: "".concat(25 / 32 * 100, "%")
    /* eslint-enable */

  });
  injectRuleSet(".".concat(styles.loader, "_").concat([Theme.LIGHT], "::after, .ring-loader-inline::after"), conicGradientWithMask(mask, '#ff00eb,#bd3bff,#008eff, #58ba00,#f48700,#ff00eb', IMAGE_SIZE));
  injectRuleSet(".".concat(styles.loader, "_").concat([Theme.DARK], "::after, .ring-loader-inline_dark::after"), conicGradientWithMask(mask, '#ff2eef,#d178ff,#289fff,#88d444,#ffe000,#ff2eef', IMAGE_SIZE));
});

/**
 * @name Loader Inline
 */

var LoaderInline = /*#__PURE__*/function (_PureComponent) {
  _inherits(LoaderInline, _PureComponent);

  var _super = _createSuper(LoaderInline);

  function LoaderInline() {
    _classCallCheck(this, LoaderInline);

    return _super.apply(this, arguments);
  }

  _createClass(LoaderInline, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      injectStyles();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          theme = _this$props.theme,
          dataTest = _this$props['data-test'],
          children = _this$props.children,
          restProps = _objectWithoutProperties(_this$props, ["className", "theme", "data-test", "children"]);

      var classes = classNames(styles.loader, className, "".concat(styles.loader, "_").concat(theme));
      var loader = /*#__PURE__*/React.createElement("div", _extends({}, restProps, {
        "data-test": joinDataTestAttributes('ring-loader-inline', dataTest),
        className: classes
      }));
      return children ? /*#__PURE__*/React.createElement(React.Fragment, null, loader, /*#__PURE__*/React.createElement("span", {
        className: styles.children
      }, children)) : loader;
    }
  }]);

  return LoaderInline;
}(PureComponent);

_defineProperty(LoaderInline, "propTypes", {
  theme: PropTypes.oneOf(Object.values(Theme)),
  className: PropTypes.string,
  'data-test': PropTypes.string,
  children: PropTypes.node
});

_defineProperty(LoaderInline, "Theme", Theme);

var LoaderInline$1 = withTheme()(LoaderInline);

export default LoaderInline$1;
