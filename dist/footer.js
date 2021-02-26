import { d as _defineProperty } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { memo, isValidElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Link from './link.js';
import styleInject from 'style-inject';
import 'focus-visible';
import './memoize-ad2c954c.js';
import './data-tests-1a367745.js';
import './clickableLink-3fc5662b.js';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.footer_footer__2iMkG {\n\n  position: relative;\n\n  box-sizing: border-box;\n  height: 64px;\n  margin: 40px 32px 0 32px;\n  padding-top: 16px;\n\n  text-align: center;\n\n  border-top: 1px solid #dfe5eb;\n\n  border-top: 1px solid var(--ring-line-color);\n\n  font-size: 12px;\n\n  font-size: var(--ring-font-size-smaller);\n}\n\n.footer_footerFloating__1G9jX {\n\n  position: absolute;\n  z-index: 1;\n  z-index: var(--ring-fixed-z-index);\n  bottom: 0;\n\n  width: 100%;\n  margin-right: 0;\n  margin-bottom: 8px;\n  margin-left: 0;\n}\n\n.footer_column__KYNt8 {\n  position: absolute;\n\n  width: 33%;\n}\n\n.footer_columnItem__UcRoc {\n  display: inline-block;\n\n  margin: 0;\n  padding: 0;\n\n  vertical-align: top;\n}\n\n.footer_columnLeft__2xtNm {\n\n  text-align: left;\n}\n\n.footer_columnCenter__2sM3U {\n\n  left: 33.6%;\n}\n\n.footer_columnCenter__2sM3U .footer_line__3RtvW {\n  text-align: left;\n}\n\n.footer_columnRight__2y57D {\n\n  top: 16px;\n  right: 0;\n\n  text-align: right;\n}\n\n.footer_line__3RtvW {\n  padding: 0;\n\n  list-style: none;\n\n  line-height: 16px;\n}\n\n.footer_lineCenter__lali0 {\n  text-align: left;\n}\n";
var styles = {"unit":"8px","footer-height":"calc(8px * 8)","footer":"footer_footer__2iMkG global_font__2H0e4","footerFloating":"footer_footerFloating__1G9jX footer_footer__2iMkG global_font__2H0e4","column":"footer_column__KYNt8","columnItem":"footer_columnItem__UcRoc","columnLeft":"footer_columnLeft__2xtNm footer_column__KYNt8","columnCenter":"footer_columnCenter__2sM3U footer_column__KYNt8","line":"footer_line__3RtvW","columnRight":"footer_columnRight__2y57D footer_column__KYNt8","lineCenter":"footer_lineCenter__lali0"};
styleInject(css_248z);

var FooterColumn = /*#__PURE__*/memo(function FooterColumn(_ref) {
  var _classNames;

  var position = _ref.position,
      children = _ref.children;
  var classes = classNames((_classNames = {}, _defineProperty(_classNames, styles.columnLeft, position === 'left'), _defineProperty(_classNames, styles.columnCenter, position === 'center'), _defineProperty(_classNames, styles.columnRight, position === 'right'), _classNames));
  return /*#__PURE__*/React.createElement("div", {
    className: classes
  }, /*#__PURE__*/React.createElement("ul", {
    className: styles.columnItem
  }, children));
});
FooterColumn.propTypes = {
  position: PropTypes.string,
  children: PropTypes.node
};
/**
 * Return copyright string
 * @param year {int}
 * @returns {string}
 */

function copyright(year) {
  var currentYear = new Date().getUTCFullYear();
  var ndash = '–';
  var ret = 'Copyright © ';

  if (year >= currentYear) {
    ret += year;
  } else {
    ret += year + ndash + currentYear;
  }

  return ret;
}
/**
 * @constructor
 * @extends {ReactComponent}
 */

var FooterLine = /*#__PURE__*/memo(function FooterLine(props) {
  var items = Array.isArray(props.item) ? props.item : [props.item];

  function renderItem(item) {
    if ( /*#__PURE__*/isValidElement(item)) {
      return item;
    }

    var element = (item.copyright ? copyright(item.copyright) : '') + (item.label || item);

    if (item.url) {
      return /*#__PURE__*/React.createElement(Link, {
        href: item.url,
        target: item.target,
        key: item.url + item.title,
        title: item.title
      }, element);
    }

    return element;
  }

  return /*#__PURE__*/React.createElement("li", {
    className: styles.line
  }, items.map(renderItem));
});
FooterLine.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string])
};
var Footer = /*#__PURE__*/memo(function Footer(_ref2) {
  var floating = _ref2.floating,
      className = _ref2.className,
      left = _ref2.left,
      center = _ref2.center,
      right = _ref2.right;

  function content(elements, position) {
    if (!elements) {
      return false;
    }

    return /*#__PURE__*/React.createElement(FooterColumn, {
      key: position,
      position: position
    }, elements.map(function (item, idx) {
      return /*#__PURE__*/React.createElement(FooterLine // eslint-disable-next-line react/no-array-index-key
      , {
        key: idx,
        item: item
      });
    }));
  }

  var classes = classNames(styles.footer, className, _defineProperty({}, styles.footerFloating, floating));
  return /*#__PURE__*/React.createElement("footer", {
    className: classes,
    "data-test": "ring-footer"
  }, [content(left, 'left'), content(center, 'center'), content(right, 'right')]);
});
Footer.propTypes = {
  className: PropTypes.string,
  floating: PropTypes.bool,
  left: PropTypes.array,
  center: PropTypes.array,
  right: PropTypes.array
};

export default Footer;
export { copyright };
