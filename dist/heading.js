import { e as _objectWithoutProperties, f as _extends, d as _defineProperty } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import deprecate from 'util-deprecate';
import styleInject from 'style-inject';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.heading_heading__1R0R- {\n\n  margin-top: 20px;\n\n  margin-top: var(--ring-line-height)\n}\n\n.heading_heading__1R0R-:first-child {\n    margin-top: 0;\n  }\n\nh1.heading_heading__1R0R-, h2.heading_heading__1R0R- {\n    margin-bottom: 8px;\n\n    color: #1f2326;\n\n    color: var(--ring-heading-color);\n\n    font-size: 24px;\n    line-height: 28px\n}\n\nh2.heading_heading__1R0R- {\n    font-weight: 200\n}\n\nh3.heading_heading__1R0R- {\n    margin-bottom: 0;\n\n    font-size: inherit;\n    line-height: inherit\n}\n\nh4.heading_heading__1R0R- {\n    margin-bottom: 1px;\n\n    letter-spacing: 1px;\n    text-transform: uppercase;\n\n    font-size: 12px;\n    font-weight: normal;\n    line-height: 16px\n}\n\n.heading_caps__37pbh {\n  letter-spacing: 2px;\n  text-transform: uppercase;\n}\n";
var styles = {"heading":"heading_heading__1R0R- global_font__2H0e4","caps":"heading_caps__37pbh"};
styleInject(css_248z);

/**
 * @name Heading
 */

var Levels = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4
};
var fallbackHeading = deprecate(function () {
  return 'h3';
}, 'Headings of level 5 and higher are replaced with h3');
var Heading = /*#__PURE__*/memo(function Heading(_ref) {
  var children = _ref.children,
      className = _ref.className,
      level = _ref.level,
      restProps = _objectWithoutProperties(_ref, ["children", "className", "level"]);

  var classes = classNames(styles.heading, className);
  var Tag = level <= Levels.H4 ? "h".concat(level) : fallbackHeading();
  return /*#__PURE__*/React.createElement(Tag, _extends({}, restProps, {
    className: classes
  }), children);
});
Heading.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  level: PropTypes.number
};
Heading.defaultProps = {
  level: Levels.H1
};
Heading.Levels = Levels;

function makeHeading(level, useCaps) {
  var H = /*#__PURE__*/memo(function (_ref2) {
    var className = _ref2.className,
        caps = _ref2.caps,
        restProps = _objectWithoutProperties(_ref2, ["className", "caps"]);

    var classes = classNames(className, _defineProperty({}, styles.caps, useCaps && caps));
    return /*#__PURE__*/React.createElement(Heading, _extends({}, restProps, {
      level: level,
      className: classes
    }));
  });
  H.displayName = "H".concat(level);
  H.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    // use only for short h1 headers, no longer than three words
    caps: PropTypes.bool
  };
  return H;
}

var H1 = makeHeading(Levels.H1, true);
var H2 = makeHeading(Levels.H2);
var H3 = makeHeading(Levels.H3);
var H4 = makeHeading(Levels.H4);

export default Heading;
export { H1, H2, H3, H4 };
