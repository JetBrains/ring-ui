import { e as _objectWithoutProperties, d as _defineProperty, f as _extends, _ as _inherits, a as _createSuper, c as _createClass, b as _classCallCheck } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { memo, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import deprecate from 'util-deprecate';
import styleInject from 'style-inject';
import { m as memoize } from './memoize-ad2c954c.js';

/**
 * Commonly used icon colors.
 * @enum {string}
 */
var Color = {
  BLUE: 'blue',
  DEFAULT: '',
  GRAY: 'gray',
  GREEN: 'green',
  MAGENTA: 'magenta',
  RED: 'red',
  WHITE: 'white'
};
/**
 * @enum {number}
 */

var Size = {
  Size12: 12,
  Size14: 14,
  Size16: 16,
  Size18: 18,
  Size20: 20,
  Size24: 24,
  Size32: 32,
  Size40: 40,
  Size48: 48,
  Size64: 64,
  Size96: 96,
  Size128: 128
};

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.icon_icon__2qeSS {\n  display: inline-block;\n\n  fill: currentColor;\n}\n\n.icon_glyph__15AOF {\n  display: inline-flex;\n\n  margin-right: -1px;\n  margin-left: -1px;\n\n  pointer-events: none\n}\n\n.icon_glyph__15AOF[width='10'] {\n    vertical-align: -1px;\n  }\n\n.icon_glyph__15AOF[width='14'] {\n    margin-right: -2px;\n    margin-left: 0;\n\n    vertical-align: -3px;\n  }\n\n.icon_glyph__15AOF[width='16'] {\n    vertical-align: -3px;\n  }\n\n.icon_glyph__15AOF[width='20'] {\n    vertical-align: -2px;\n  }\n\n.icon_glyph__15AOF.icon_compatibilityMode__2In0l {\n    width: 16px;\n    height: 16px;\n    margin-right: 0;\n    margin-left: 0;\n  }\n\n/* HACK: This media query hack makes styles applied for WebKit browsers only */\n\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  .icon_glyph__15AOF {\n    width: auto; /* Safari size bug workaround, see https://youtrack.jetbrains.com/issue/RG-1983 */\n  }\n}\n\n.icon_gray__119eO {\n  color: #999;\n  color: var(--ring-icon-secondary-color);\n}\n\n.icon_hover__3YGKx {\n  color: #ff008c;\n  color: var(--ring-icon-hover-color);\n}\n\n.icon_green__Nu3De {\n  color: #59a869;\n  color: var(--ring-icon-success-color);\n}\n\n.icon_magenta__H6z0V {\n  color: #ff008c;\n  color: var(--ring-link-hover-color);\n}\n\n.icon_red__1dCvU {\n  color: #db5860;\n  color: var(--ring-icon-error-color);\n}\n\n.icon_blue__mP1bP {\n  color: #008eff;\n  color: var(--ring-main-color);\n}\n\n.icon_white__yDxu3 {\n  color: #fff;\n  color: var(--ring-dark-text-color);\n}\n\n.icon_loading__2NfYA {\n  animation-name: icon_icon-loading__3s3iG;\n  animation-duration: 1200ms;\n  animation-iteration-count: infinite;\n}\n\n@keyframes icon_icon-loading__3s3iG {\n  0% {\n    transform: scale(1);\n  }\n\n  50% {\n    transform: scale(0.9);\n\n    opacity: 0.5;\n  }\n\n  100% {\n    transform: scale(1);\n  }\n}\n";
var styles = {"unit":"8px","icon":"icon_icon__2qeSS","glyph":"icon_glyph__15AOF","compatibilityMode":"icon_compatibilityMode__2In0l","gray":"icon_gray__119eO","hover":"icon_hover__3YGKx","green":"icon_green__Nu3De","magenta":"icon_magenta__H6z0V","red":"icon_red__1dCvU","blue":"icon_blue__mP1bP","white":"icon_white__yDxu3","loading":"icon_loading__2NfYA","icon-loading":"icon_icon-loading__3s3iG"};
styleInject(css_248z);

function convertReactSVGDOMProperty(str) {
  return str.replace(/[-|:]([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

function serializeAttrs(map) {
  var res = {};

  for (var i = 0; i < map.length; i++) {
    var key = map[i].name;
    var prop = key;

    if (key === 'class') {
      prop = 'className';
    } else if (!key.startsWith('data-')) {
      prop = convertReactSVGDOMProperty(key);
    }

    res[prop] = map[i].value;
  }

  return res;
}

function extractSVGProps(svgNode) {
  var map = svgNode.attributes;
  return map.length > 0 ? serializeAttrs(map) : null;
}

var getSVGFromSource = memoize(function (src) {
  var svgContainer = document.createElement('div');
  svgContainer.innerHTML = src;
  var svg = svgContainer.firstElementChild;
  svg.remove ? svg.remove() : svgContainer.removeChild(svg);
  return {
    props: extractSVGProps(svg),
    html: svg.innerHTML
  };
});

function isCompatibilityMode(iconSrc) {
  var hasWidth = /width="[\d\.]+"/ig.test(iconSrc);
  var hasHeight = /height="[\d\.]+"/ig.test(iconSrc);
  return !hasWidth || !hasHeight;
}

function IconSVG(_ref) {
  var src = _ref.src,
      className = _ref.className,
      rest = _objectWithoutProperties(_ref, ["src", "className"]);

  var glyphClasses = classNames(styles.glyph, _defineProperty({}, styles.compatibilityMode, isCompatibilityMode(src)), className);

  var _getSVGFromSource = getSVGFromSource(src),
      props = _getSVGFromSource.props,
      html = _getSVGFromSource.html;

  return /*#__PURE__*/React.createElement("svg", _extends({}, props, rest, {
    className: glyphClasses,
    dangerouslySetInnerHTML: {
      __html: html
    }
  }));
}

IconSVG.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  style: PropTypes.object
};
var IconSVG$1 = /*#__PURE__*/memo(IconSVG);

var _warnSize = deprecate(function () {}, "`size`, `width` and `height` props are not recommended to use in Ring UI `Icon` component. The intrinsic sizes of SVG icon (`width` and `height` SVG attributes) are used instead.\n\nWe strongly recommend to use icons handcrafted for particular sizes. If your icon doesn't exist in the desired size, please ask your designer to draw one. \"Responsive\" checkmark should be unchecked when exporting icon.'");

var Icon = /*#__PURE__*/function (_PureComponent) {
  _inherits(Icon, _PureComponent);

  var _super = _createSuper(Icon);

  function Icon() {
    _classCallCheck(this, Icon);

    return _super.apply(this, arguments);
  }

  _createClass(Icon, [{
    key: "warnSize",
    value: function warnSize() {
      if (this.props.suppressSizeWarning) {
        return;
      }

      _warnSize();
    }
  }, {
    key: "getStyle",
    value: function getStyle() {
      var _this$props = this.props,
          size = _this$props.size,
          width = _this$props.width,
          height = _this$props.height;

      if (width || height) {
        this.warnSize();
        return {
          width: width,
          height: height
        };
      }

      if (size) {
        this.warnSize();
        return {
          width: size,
          height: size
        };
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props2 = this.props,
          className = _this$props2.className;
          _this$props2.size;
          var color = _this$props2.color,
          loading = _this$props2.loading,
          Glyph = _this$props2.glyph;
          _this$props2.width;
          _this$props2.height;
          _this$props2.suppressSizeWarning;
          var restProps = _objectWithoutProperties(_this$props2, ["className", "size", "color", "loading", "glyph", "width", "height", "suppressSizeWarning"]);

      if (!Glyph) {
        return null;
      }

      var classes = classNames(styles.icon, (_classNames = {}, _defineProperty(_classNames, styles[color], !!color), _defineProperty(_classNames, styles.loading, loading), _classNames), className);
      return /*#__PURE__*/React.createElement("span", _extends({}, restProps, {
        className: classes
      }), typeof Glyph === 'string' ? /*#__PURE__*/React.createElement(IconSVG$1, {
        src: Glyph,
        style: this.getStyle()
      }) : /*#__PURE__*/React.createElement(Glyph, {
        className: styles.glyph,
        style: this.getStyle()
      }));
    }
  }]);

  return Icon;
}(PureComponent);

_defineProperty(Icon, "propTypes", {
  className: PropTypes.string,
  color: PropTypes.string,
  glyph: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]).isRequired,
  height: PropTypes.number,
  size: PropTypes.number,
  width: PropTypes.number,
  loading: PropTypes.bool,
  suppressSizeWarning: PropTypes.bool
});

_defineProperty(Icon, "defaultProps", {
  className: '',
  color: Color.DEFAULT,
  glyph: ''
});

_defineProperty(Icon, "Color", Color);

_defineProperty(Icon, "Size", Size);

export default Icon;
export { Size };
