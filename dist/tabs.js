import PropTypes from 'prop-types';
import { e as _objectWithoutProperties, j as _typeof, d as _defineProperty, f as _extends, h as _slicedToArray, k as _toConsumableArray, i as _objectSpread2, _ as _inherits, a as _createSuper, b as _classCallCheck, g as _assertThisInitialized, c as _createClass } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { memo, PureComponent } from 'react';
import classNames from 'classnames';
import { m as memoize } from './memoize-ad2c954c.js';
import { w as withTheme, T as Theme } from './theme-9a053da9.js';
import { j as joinDataTestAttributes } from './data-tests-1a367745.js';
import styleInject from 'style-inject';
import Link from './link.js';
import fastdom from 'fastdom';
import chevronDown from '@jetbrains/icons/chevron-10px';
import { D as Directions } from './popup-442f4003.js';
import PopupMenu, { ListProps } from './popup-menu.js';
import Dropdown from './dropdown.js';
import Icon from './icon.js';
import 'focus-visible';
import './clickableLink-3fc5662b.js';
import 'react-dom';
import './get-uid-bf3ab014.js';
import './schedule-raf-edeb21db.js';
import './dom-0ae85140.js';
import './shortcuts.js';
import 'combokeys';
import './sniffer-c9d1f40e.js';
import 'sniffr';
import './tab-trap.js';
import './popup.target-9daf0591.js';
import './list-2403b1cd.js';
import 'react-virtualized/dist/es/List';
import 'react-virtualized/dist/es/AutoSizer';
import 'react-virtualized/dist/es/WindowScroller';
import 'react-virtualized/dist/es/CellMeasurer';
import 'util-deprecate';
import 'memoize-one';
import './avatar.js';
import './url-a3cbb96f.js';
import './checkbox.js';
import '@jetbrains/icons/checkmark';
import '@jetbrains/icons/remove-10px';
import './button-c0bc1992.js';

var CustomItem = function CustomItem(_ref) {
  var children = _ref.children;
  return children;
};
CustomItem.propTypes = {
  children: PropTypes.node.isRequired
};

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.tabs_title__3hggC:hover:not(.tabs_selected__1RUXC),\n    .tabs_title__3hggC:hover:not(.tabs_collapsed__1Tklv) {\n      color: #ff008c;\n      color: var(--ring-link-hover-color);\n      outline-style: none;\n      box-shadow: inset 0 -1px 0 0 #ff008c;\n      box-shadow: inset 0 -1px 0 0 var(--ring-link-hover-color);\n    }}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.tabs_title__3hggC:hover.tabs_selected__1RUXC,\n    .tabs_title__3hggC:hover.tabs_collapsed__1Tklv {\n      color: inherit;\n      box-shadow: inset 0 -3px 0 0 #1f2326;\n      box-shadow: inset 0 -3px 0 0 var(--ring-text-color);\n    }}\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.tabs_tabs__3_mvh {\n}\n\n.tabs_titles__1pTAd {\n  display: inline-block;\n\n  margin-bottom: 16px;\n}\n\n.tabs_light__3TUyJ .tabs_titles__1pTAd {\n  box-shadow: inset 0 -1px 0 0 #dfe5eb;\n  box-shadow: inset 0 -1px 0 0 var(--ring-line-color);\n}\n\n.tabs_dark__33k75 .tabs_titles__1pTAd {\n  box-shadow: inset 0 -1px 0 0 #475159;\n  box-shadow: inset 0 -1px 0 0 var(--ring-dark-line-color);\n}\n\n.tabs_title__3hggC {\n\n  position: relative;\n\n  display: inline-block;\n\n  padding: 0;\n\n  cursor: pointer;\n\n  color: inherit;\n\n  border: none;\n  border-radius: 0;\n  background: none;\n\n  line-height: 32px\n}\n\n.tabs_title__3hggC:active.tabs_selected__1RUXC,\n    .tabs_title__3hggC:active.tabs_collapsed__1Tklv {\n      color: inherit;\n      box-shadow: inset 0 -3px 0 0 #1f2326;\n      box-shadow: inset 0 -3px 0 0 var(--ring-text-color);\n    }\n\n.tabs_title__3hggC:active:not(.tabs_selected__1RUXC),\n    .tabs_title__3hggC:active:not(.tabs_collapsed__1Tklv) {\n      color: #ff008c;\n      color: var(--ring-link-hover-color);\n      outline-style: none;\n      box-shadow: inset 0 -1px 0 0 #ff008c;\n      box-shadow: inset 0 -1px 0 0 var(--ring-link-hover-color);\n    }\n\n.tabs_title__3hggC.focus-visible {\n    box-shadow: inset 0 -3px 0 0 #008eff;\n    box-shadow: inset 0 -3px 0 0 var(--ring-main-color);\n  }\n\n.tabs_title__3hggC[disabled] {\n    pointer-events: none;\n  }\n\n.tabs_title__3hggC + .tabs_title__3hggC {\n  margin-left: 24px;\n}\n\n.tabs_light__3TUyJ .tabs_title__3hggC[disabled] {\n    color: #999;\n    color: var(--ring-disabled-color);\n  }\n\n.tabs_dark__33k75 .tabs_title__3hggC {\n  color: #888;\n  color: var(--ring-dark-secondary-color)\n}\n\n.tabs_dark__33k75 .tabs_title__3hggC[disabled] {\n    color: #1f2326;\n    color: var(--ring-text-color);\n  }\n\n.tabs_selected__1RUXC {\n  cursor: default;\n\n  outline: none;\n  box-shadow: inset 0 -3px 0 0 #1f2326;\n  box-shadow: inset 0 -3px 0 0 var(--ring-text-color);\n\n  font-weight: bold;\n}\n\n.tabs_dark__33k75 .tabs_selected__1RUXC.tabs_selected__1RUXC {\n  color: #fff;\n  color: var(--ring-dark-text-color);\n  box-shadow: inset 0 -3px 0 0 #008eff;\n  box-shadow: inset 0 -3px 0 0 var(--ring-main-color);\n}\n\n.tabs_dark__33k75 .tabs_title__3hggC.focus-visible {\n  color: #008eff;\n  color: var(--ring-main-color);\n}\n\n.tabs_visible__-abfj {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n\n  text-align: center;\n}\n\n.tabs_hidden__bIN3o {\n  visibility: hidden;\n\n  font-weight: bold;\n}\n\n.tabs_tabCounter__PjkVT {\n  padding-left: 8px;\n\n  color: #737577;\n\n  color: var(--ring-secondary-color);\n\n  font-size: 12px;\n  font-weight: normal;\n  line-height: 19px; /* prevent jumps in Firefox */\n}\n\n.tabs_autoCollapseContainer__wyscy {\n  position: relative;\n}\n\n.tabs_autoCollapse__1PnrF {\n  position: relative;\n\n  display: inline-flex;\n  visibility: hidden;\n  overflow: hidden;\n\n  max-width: 100%;\n}\n\n.tabs_autoCollapse__1PnrF.tabs_adjusted__35bmM {\n  visibility: visible;\n  overflow: visible;\n}\n\n.tabs_autoCollapse__1PnrF .tabs_title__3hggC {\n  flex-shrink: 0;\n}\n\n.tabs_measure__2UZsl {\n  position: absolute;\n  top: 0;\n  left: 0;\n\n  overflow: hidden;\n\n  height: 0;\n  margin: 0;\n\n  pointer-events: none;\n\n  opacity: 0;\n}\n\n.tabs_morePopup__3T-aR {\n  display: flex;\n  flex-direction: column;\n}\n\n.tabs_collapsed__1Tklv.tabs_collapsed__1Tklv {\n  width: 100%;\n\n  border-bottom: none;\n  box-shadow: none\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.tabs_collapsed__1Tklv.tabs_collapsed__1Tklv:hover {\n    box-shadow: none;\n  }}\n\n.tabs_collapsed__1Tklv.tabs_collapsed__1Tklv[disabled] {\n  color: #999;\n  color: var(--ring-disabled-color);\n}\n\n.tabs_collapsed__1Tklv .tabs_visible__-abfj,\n.tabs_collapsed__1Tklv .tabs_hidden__bIN3o {\n  text-align: left;\n}\n\n.tabs_chevron__ZPcg- {\n  padding-left: 4px;\n}\n\n.tabs_morePopupBeforeEnd__2g515.tabs_morePopupBeforeEnd__2g515.tabs_morePopupBeforeEnd__2g515 {\n  padding: 0;\n}\n\n.tabs_morePopupBeforeEnd__2g515 ~ div {\n  display: none;\n}\n";
var styles = {"unit":"8px","line-shadow":"inset 0 -1px 0 0","selected-line-shadow":"inset 0 -3px 0 0","title":"tabs_title__3hggC global_font__2H0e4","selected":"tabs_selected__1RUXC","collapsed":"tabs_collapsed__1Tklv","tabs":"tabs_tabs__3_mvh global_font__2H0e4","titles":"tabs_titles__1pTAd","light":"tabs_light__3TUyJ","dark":"tabs_dark__33k75","visible":"tabs_visible__-abfj","hidden":"tabs_hidden__bIN3o","tabCounter":"tabs_tabCounter__PjkVT","autoCollapseContainer":"tabs_autoCollapseContainer__wyscy","autoCollapse":"tabs_autoCollapse__1PnrF","adjusted":"tabs_adjusted__35bmM","measure":"tabs_measure__2UZsl","morePopup":"tabs_morePopup__3T-aR","chevron":"tabs_chevron__ZPcg-","morePopupBeforeEnd":"tabs_morePopupBeforeEnd__2g515"};
styleInject(css_248z);

function TabLink(_ref) {
  var isSelected = _ref.isSelected,
      title = _ref.title,
      collapsed = _ref.collapsed,
      restProps = _objectWithoutProperties(_ref, ["isSelected", "title", "collapsed"]);

  var renderedTitle = typeof title === 'function' ? title(isSelected, collapsed) : title;
  return /*#__PURE__*/React.createElement(Link, restProps, function () {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: styles.visible
    }, renderedTitle), /*#__PURE__*/React.createElement("span", {
      className: styles.hidden
    }, renderedTitle));
  });
}

TabLink.propTypes = {
  isSelected: PropTypes.bool,
  collapsed: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.node])
};
var TabLink$1 = /*#__PURE__*/memo(TabLink);

function noop() {}

var TabTitle = /*#__PURE__*/React.memo(function (_ref) {
  var _classNames;

  var selected = _ref.selected,
      child = _ref.child,
      _ref$handleSelect = _ref.handleSelect,
      handleSelect = _ref$handleSelect === void 0 ? noop : _ref$handleSelect,
      _ref$collapsed = _ref.collapsed,
      collapsed = _ref$collapsed === void 0 ? false : _ref$collapsed,
      tabIndex = _ref.tabIndex;

  if (child == null || _typeof(child) !== 'object' || child.type === CustomItem) {
    return child;
  }

  var _child$props = child.props,
      title = _child$props.title,
      disabled = _child$props.disabled,
      href = _child$props.href,
      className = _child$props.className,
      activeClassName = _child$props.activeClassName,
      collapsedClassName = _child$props.collapsedClassName,
      collapsedActiveClassName = _child$props.collapsedActiveClassName;
  var titleClasses = classNames(styles.title, className, (_classNames = {}, _defineProperty(_classNames, styles.selected, selected), _defineProperty(_classNames, styles.collapsed, collapsed), _defineProperty(_classNames, activeClassName, selected), _defineProperty(_classNames, collapsedClassName, collapsed), _defineProperty(_classNames, collapsedActiveClassName, collapsed && selected), _classNames));
  return /*#__PURE__*/React.createElement(TabLink$1, {
    title: title,
    isSelected: selected,
    active: true,
    href: href,
    innerClassName: titleClasses,
    className: titleClasses,
    disabled: disabled,
    onPlainLeftClick: handleSelect,
    tabIndex: tabIndex,
    collapsed: collapsed
  });
});
TabTitle.propTypes = {
  child: PropTypes.element,
  handleSelect: PropTypes.func,
  selected: PropTypes.bool,
  collapsed: PropTypes.bool,
  tabIndex: PropTypes.number
};

var getTabTitles = function getTabTitles(_ref2) {
  var items = _ref2.items,
      _ref2$selected = _ref2.selected,
      selected = _ref2$selected === void 0 ? 0 : _ref2$selected,
      collapsed = _ref2.collapsed,
      _ref2$onSelect = _ref2.onSelect,
      onSelect = _ref2$onSelect === void 0 ? noop : _ref2$onSelect,
      props = _objectWithoutProperties(_ref2, ["items", "selected", "collapsed", "onSelect"]);

  return items.map(function (tab, index) {
    var key = tab.props.id || String(index);
    var isSelected = selected === key;
    return /*#__PURE__*/React.createElement(TabTitle, _extends({
      key: key,
      handleSelect: onSelect(key),
      selected: isSelected,
      child: tab,
      index: index,
      collapsed: collapsed,
      disabled: tab.props.disabled
    }, props));
  });
};

var AnchorLink = function AnchorLink(_ref) {
  var hasActiveChildren = _ref.hasActiveChildren,
      moreClassName = _ref.moreClassName,
      moreActiveClassName = _ref.moreActiveClassName,
      restProps = _objectWithoutProperties(_ref, ["hasActiveChildren", "moreClassName", "moreActiveClassName"]);

  var classnames = classNames(styles.title, hasActiveChildren && styles.selected, hasActiveChildren && moreActiveClassName, moreClassName);
  return /*#__PURE__*/React.createElement(Link, _extends({
    title: 'More',
    innerClassName: classnames,
    className: classnames
  }, restProps), 'More', /*#__PURE__*/React.createElement(Icon, {
    glyph: chevronDown,
    className: styles.chevron
  }));
};
AnchorLink.propTypes = {
  hasActiveChildren: PropTypes.bool,
  moreClassName: PropTypes.string,
  moreActiveClassName: PropTypes.string
};
var morePopupDirections = [Directions.BOTTOM_CENTER, Directions.BOTTOM_LEFT, Directions.BOTTOM_RIGHT];
var MoreButton = /*#__PURE__*/React.memo(function (_ref2) {
  var items = _ref2.items,
      selected = _ref2.selected,
      onSelect = _ref2.onSelect,
      moreClassName = _ref2.moreClassName,
      moreActiveClassName = _ref2.moreActiveClassName,
      morePopupClassName = _ref2.morePopupClassName,
      morePopupItemClassName = _ref2.morePopupItemClassName,
      morePopupBeforeEnd = _ref2.morePopupBeforeEnd;
  var onSelectHandler = React.useCallback(function (listItem) {
    if (listItem.disabled === true || listItem.custom === true) {
      return;
    }

    var cb = onSelect(listItem.key);
    cb();
  }, [onSelect]);
  var hasActiveChild = React.useMemo(function () {
    return items.some(function (item) {
      return item.props.alwaysHidden && item.props.id === selected;
    });
  }, [items, selected]);
  var data = React.useMemo(function () {
    var popupItems = getTabTitles({
      items: items,
      selected: selected,
      collapsed: true
    }).map(function (tab) {
      var disabled = tab.props.disabled === true;
      var custom = tab.props.child.type === CustomItem;
      return {
        template: tab,
        key: tab.key,
        rgItemType: ListProps.Type.CUSTOM,
        className: morePopupItemClassName,
        disabled: disabled,
        custom: custom
      };
    });

    if (morePopupBeforeEnd) {
      popupItems.push({
        template: morePopupBeforeEnd,
        key: 'before-end-content',
        className: styles.morePopupBeforeEnd,
        rgItemType: ListProps.Type.CUSTOM
      });
    }

    return popupItems;
  }, [items, morePopupBeforeEnd, morePopupItemClassName, selected]);
  var popupAnchor = React.useMemo(function () {
    return /*#__PURE__*/React.createElement(AnchorLink, {
      moreClassName: moreClassName,
      moreActiveClassName: moreActiveClassName,
      hasActiveChildren: hasActiveChild
    });
  }, [hasActiveChild, moreActiveClassName, moreClassName]);
  var popup = React.useMemo(function () {
    return /*#__PURE__*/React.createElement(PopupMenu, {
      directions: morePopupDirections,
      className: morePopupClassName,
      onSelect: onSelectHandler,
      data: data
    });
  }, [data, morePopupClassName, onSelectHandler]);

  if (items.length === 0) {
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.title, moreClassName, hasActiveChild && moreActiveClassName)
  }, /*#__PURE__*/React.createElement(Dropdown, {
    hoverMode: true,
    anchor: popupAnchor
  }, popup));
});
MoreButton.propTypes = {
  children: PropTypes.node,
  items: PropTypes.array,
  selected: PropTypes.string,
  onSelect: PropTypes.func,
  toMeasure: PropTypes.bool,
  moreClassName: PropTypes.string,
  moreActiveClassName: PropTypes.string,
  morePopupClassName: PropTypes.string,
  morePopupItemClassName: PropTypes.string,
  morePopupBeforeEnd: PropTypes.element
};
MoreButton.displayName = 'MoreButton';
var FakeMoreButton = /*#__PURE__*/React.memo(function (_ref3) {
  var moreClassName = _ref3.moreClassName,
      moreActiveClassName = _ref3.moreActiveClassName,
      hasActiveChildren = _ref3.hasActiveChildren;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.moreButton, styles.title)
  }, /*#__PURE__*/React.createElement(AnchorLink, {
    moreClassName: moreClassName,
    moreActiveClassName: moreActiveClassName,
    hasActiveChildren: hasActiveChildren,
    tabIndex: -1,
    disabled: true
  }));
});
FakeMoreButton.propTypes = {
  moreClassName: PropTypes.string,
  moreActiveClassName: PropTypes.string,
  hasActiveChildren: PropTypes.bool
};
FakeMoreButton.displayName = 'FakeMoreButton';

var DEFAULT_DEBOUNCE_INTERVAL = 100;
var MEASURE_TOLERANCE = 0.5;
var DEFAULT_STATE = {
  lastVisibleIndex: null,
  sizes: {
    tabs: [],
    more: null
  }
};
var ACTIONS = {
  MEASURE_TABS: 'MEASURE_TABS',
  DEFINE_LAST_VISIBLE_INDEX: 'DEFINE_LAST_VISIBLE_INDEX'
};

function visibilityReducer(state, action) {
  switch (action.type) {
    case ACTIONS.MEASURE_TABS:
      {
        var more = action.more,
            tabs = action.tabs;
        return _objectSpread2(_objectSpread2({}, state), {}, {
          sizes: {
            more: more,
            tabs: tabs
          }
        });
      }

    case ACTIONS.DEFINE_LAST_VISIBLE_INDEX:
      {
        var lastVisibleIndex = action.lastVisibleIndex;
        return _objectSpread2(_objectSpread2({}, state), {}, {
          lastVisibleIndex: lastVisibleIndex
        });
      }

    default:
      throw new Error();
  }
}

var useAdjustHandler = function useAdjustHandler(_ref) {
  var elements = _ref.elements,
      children = _ref.children,
      selectedIndex = _ref.selectedIndex,
      dispatch = _ref.dispatch;
  return React.useCallback(function (entry) {
    var containerWidth = entry.contentRect.width;
    var _elements$sizes = elements.sizes,
        tabsSizes = _elements$sizes.tabs,
        _elements$sizes$more = _elements$sizes.more,
        more = _elements$sizes$more === void 0 ? 0 : _elements$sizes$more;
    var renderMore = children.some(function (tab) {
      return tab.props.alwaysHidden;
    });
    var tabsToRender = [];
    var filledWidth = renderMore ? more !== null && more !== void 0 ? more : 0 : 0;

    for (var i = 0; i < tabsSizes.length; i++) {
      if (filledWidth + tabsSizes[i] < containerWidth + MEASURE_TOLERANCE) {
        filledWidth += tabsSizes[i];
        tabsToRender.push(tabsSizes[i]);
      } else {
        break;
      }
    }

    if (tabsToRender.length < tabsSizes.length && !renderMore) {
      for (var _i = tabsToRender.length - 1; _i >= 0; _i--) {
        if (filledWidth + more < containerWidth + MEASURE_TOLERANCE) {
          filledWidth += more;
          renderMore = true;
          break;
        } else {
          filledWidth -= tabsToRender[_i];
          tabsToRender.pop();
        }
      }
    }

    if (selectedIndex > tabsToRender.length - 1) {
      var selectedWidth = tabsSizes[selectedIndex];

      for (var _i2 = tabsToRender.length - 1; _i2 >= 0; _i2--) {
        if (filledWidth + selectedWidth < containerWidth + MEASURE_TOLERANCE) {
          filledWidth += selectedWidth;
          break;
        } else {
          filledWidth -= tabsToRender[_i2];
          tabsToRender.pop();
        }
      }
    }

    if (elements.lastVisibleIndex !== tabsToRender.length - 1) {
      dispatch({
        type: ACTIONS.DEFINE_LAST_VISIBLE_INDEX,
        lastVisibleIndex: tabsToRender.length - 1
      });
    }
  }, [children, dispatch, elements.lastVisibleIndex, elements.sizes, selectedIndex]);
};

var CollapsibleTabs = function CollapsibleTabs(_ref2) {
  var children = _ref2.children,
      selected = _ref2.selected,
      onSelect = _ref2.onSelect,
      moreClassName = _ref2.moreClassName,
      moreActiveClassName = _ref2.moreActiveClassName,
      morePopupClassName = _ref2.morePopupClassName,
      morePopupBeforeEnd = _ref2.morePopupBeforeEnd,
      morePopupItemClassName = _ref2.morePopupItemClassName,
      initialVisibleItems = _ref2.initialVisibleItems;

  var _React$useReducer = React.useReducer(visibilityReducer, DEFAULT_STATE),
      _React$useReducer2 = _slicedToArray(_React$useReducer, 2),
      elements = _React$useReducer2[0],
      dispatch = _React$useReducer2[1];

  var _React$useState = React.useState({
    visible: [],
    hidden: []
  }),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      preparedElements = _React$useState2[0],
      setPreparedElements = _React$useState2[1];

  var measureRef = React.useRef(null);
  var selectedIndex = React.useMemo(function () {
    var _children$filter$find;

    return (_children$filter$find = children.filter(function (tab) {
      return tab.props.alwaysHidden !== true;
    }).findIndex(function (tab) {
      return tab.props.id === selected;
    })) !== null && _children$filter$find !== void 0 ? _children$filter$find : null;
  }, [children, selected]);
  var visibleElements = React.useMemo(function () {
    var items;

    if (preparedElements.ready) {
      items = preparedElements.visible;
    } else {
      items = initialVisibleItems ? children.filter(function (item) {
        return item.props.alwaysHidden !== true;
      }).slice(0, initialVisibleItems) : [];
    }

    return getTabTitles({
      items: items,
      selected: selected,
      onSelect: onSelect
    });
  }, [initialVisibleItems, children, preparedElements.ready, preparedElements.visible, onSelect, selected]);
  var adjustTabs = useAdjustHandler({
    dispatch: dispatch,
    elements: elements,
    children: children,
    selectedIndex: selectedIndex
  }); // Prepare list of visible and hidden elements

  React.useEffect(function () {
    var timeout = setTimeout(function () {
      var _elements$lastVisible2;

      var res = children.reduce(function (accumulator, tab) {
        var _elements$lastVisible;

        if (tab.props.alwaysHidden !== true && accumulator.visible.length - 1 < ((_elements$lastVisible = elements.lastVisibleIndex) !== null && _elements$lastVisible !== void 0 ? _elements$lastVisible : 0)) {
          accumulator.visible.push(tab);
        } else {
          accumulator.hidden.push(tab);
        }

        return accumulator;
      }, {
        visible: [],
        hidden: [],
        ready: elements.lastVisibleIndex !== null
      });

      if (selectedIndex > ((_elements$lastVisible2 = elements.lastVisibleIndex) !== null && _elements$lastVisible2 !== void 0 ? _elements$lastVisible2 : 0)) {
        var selectedItem = children.find(function (tab) {
          return !tab.props.alwaysHidden && tab.props.id === selected;
        });
        res.visible.push(selectedItem);
      }

      var allVisibleTheSame = res.visible.length === preparedElements.visible.length && res.visible.every(function (item, index) {
        return item === preparedElements.visible[index];
      });
      var allHiddenTheSame = res.hidden.length === preparedElements.hidden.length && res.hidden.every(function (item, index) {
        return item === preparedElements.hidden[index];
      });

      if (!allVisibleTheSame || !allHiddenTheSame || preparedElements.ready !== res.ready) {
        fastdom.mutate(function () {
          return setPreparedElements(res);
        });
      }
    }, DEFAULT_DEBOUNCE_INTERVAL);
    return function () {
      clearTimeout(timeout);
    };
  }, [children, elements.lastVisibleIndex, preparedElements, selected, selectedIndex]); // Get list of all possibly visible elements to render in a measure container

  var childrenToMeasure = React.useMemo(function () {
    var items = children.filter(function (tab) {
      return tab.props.alwaysHidden !== true;
    });
    return getTabTitles({
      items: items,
      tabIndex: -1
    });
  }, [children]); // Initial measure for tabs and more button sizes

  React.useEffect(function () {
    if (measureRef.current == null) {
      return;
    }

    var measureTask = fastdom.measure(function () {
      var container = measureRef.current;

      var descendants = _toConsumableArray(container.children);

      var moreButton = descendants.pop();
      var moreButtonWidth = moreButton.offsetWidth;

      var _getComputedStyle = getComputedStyle(moreButton),
          moreButtonMarginLeft = _getComputedStyle.marginLeft,
          moreButtonMarginRight = _getComputedStyle.marginRight;

      moreButtonWidth += +moreButtonMarginLeft.replace('px', '') + +moreButtonMarginRight.replace('px', '');
      var tabsWidth = descendants.map(function (node) {
        var _getComputedStyle2 = getComputedStyle(node),
            marginLeft = _getComputedStyle2.marginLeft,
            marginRight = _getComputedStyle2.marginRight;

        var width = node.getBoundingClientRect().width;
        return width + +marginLeft.replace('px', '') + +marginRight.replace('px', '');
      }); // eslint-disable-next-line no-param-reassign

      var newSummaryWidth = tabsWidth.reduce(function (acc, curr) {
        return acc += curr;
      }, 0); // eslint-disable-next-line no-param-reassign

      var oldSummaryWidth = elements.sizes.tabs.reduce(function (acc, curr) {
        return acc += curr;
      }, 0);

      if (elements.sizes.more !== moreButtonWidth || newSummaryWidth !== oldSummaryWidth) {
        fastdom.mutate(function () {
          return dispatch({
            type: ACTIONS.MEASURE_TABS,
            more: moreButtonWidth,
            tabs: tabsWidth
          });
        });
      }
    }); // eslint-disable-next-line consistent-return

    return function () {
      fastdom.clear(measureTask);
    };
  }, [children, elements.sizes.more, elements.sizes.tabs]); // Start observers to listen resizing and mutation

  React.useEffect(function () {
    var measureTask = null;
    var resizeObserver = null;

    if (measureRef.current === null) {
      return;
    }

    resizeObserver = new ResizeObserver(function (entries) {
      entries.forEach(function (entry) {
        fastdom.clear(measureTask);
        measureTask = fastdom.mutate(function () {
          return adjustTabs(entry);
        });
      });
    });
    resizeObserver.observe(measureRef.current); // eslint-disable-next-line consistent-return

    return function () {
      fastdom.clear(measureTask);
      resizeObserver.disconnect();
    };
  }, [adjustTabs]);
  var isAdjusted = elements.lastVisibleIndex !== null && preparedElements.ready === true || initialVisibleItems;
  var className = classNames(styles.titles, styles.autoCollapse, isAdjusted && styles.adjusted);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.autoCollapseContainer
  }, /*#__PURE__*/React.createElement("div", {
    className: className
  }, visibleElements, /*#__PURE__*/React.createElement(MoreButton, {
    moreClassName: moreClassName,
    moreActiveClassName: moreActiveClassName,
    morePopupClassName: morePopupClassName,
    morePopupBeforeEnd: morePopupBeforeEnd,
    morePopupItemClassName: morePopupItemClassName,
    items: preparedElements.hidden,
    selected: selected,
    onSelect: onSelect
  })), /*#__PURE__*/React.createElement("div", {
    ref: measureRef,
    className: classNames(className, styles.measure)
  }, childrenToMeasure, /*#__PURE__*/React.createElement(FakeMoreButton, {
    hasActiveChildren: preparedElements.hidden.some(function (item) {
      return item.props.alwaysHidden && item.props.id === selected;
    }),
    moreClassName: moreClassName,
    moreActiveClassName: moreActiveClassName
  })));
};
CollapsibleTabs.propTypes = {
  children: PropTypes.node.isRequired,
  selected: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  moreClassName: PropTypes.string,
  moreActiveClassName: PropTypes.string,
  morePopupClassName: PropTypes.string,
  morePopupItemClassName: PropTypes.string,
  initialVisibleItems: PropTypes.number,
  morePopupBeforeEnd: PropTypes.element
};
var CollapsibleTabs$1 = /*#__PURE__*/React.memo(CollapsibleTabs);

var Tabs = /*#__PURE__*/function (_PureComponent) {
  _inherits(Tabs, _PureComponent);

  var _super = _createSuper(Tabs);

  function Tabs() {
    var _this;

    _classCallCheck(this, Tabs);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleSelect", memoize(function (key) {
      return function () {
        return _this.props.onSelect(key);
      };
    }));

    _defineProperty(_assertThisInitialized(_this), "getTabTitle", function (child, i) {
      if (child == null || _typeof(child) !== 'object' || child.type === CustomItem) {
        return child;
      }

      var selected = _this.props.selected;
      var _child$props = child.props,
          title = _child$props.title,
          id = _child$props.id,
          disabled = _child$props.disabled,
          href = _child$props.href,
          className = _child$props.className,
          activeClassName = _child$props.activeClassName;
      var key = id || String(i);
      var isSelected = key === selected;
      var titleClasses = classNames(styles.title, className, isSelected && activeClassName, _defineProperty({}, styles.selected, isSelected));
      return /*#__PURE__*/React.createElement(TabLink$1, {
        title: title,
        isSelected: isSelected,
        active: true,
        key: key,
        href: href,
        innerClassName: titleClasses,
        className: titleClasses,
        disabled: disabled,
        onPlainLeftClick: _this.handleSelect(key)
      });
    });

    return _this;
  }

  _createClass(Tabs, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          children = _this$props.children,
          selected = _this$props.selected,
          theme = _this$props.theme,
          autoCollapse = _this$props.autoCollapse,
          dataTest = _this$props['data-test'],
          restProps = _objectWithoutProperties(_this$props, ["className", "children", "selected", "theme", "autoCollapse", "data-test"]);

      var classes = classNames(styles.tabs, className, styles[theme]);
      var childrenArray = React.Children.toArray(children).filter(Boolean);
      return /*#__PURE__*/React.createElement("div", {
        className: classes,
        "data-test": joinDataTestAttributes('ring-dumb-tabs', dataTest)
      }, autoCollapse === true ? /*#__PURE__*/React.createElement(CollapsibleTabs$1, _extends({}, restProps, {
        onSelect: this.handleSelect,
        selected: selected
      }), childrenArray) : /*#__PURE__*/React.createElement("div", {
        className: styles.titles
      }, childrenArray.map(this.getTabTitle)), /*#__PURE__*/React.createElement("div", {
        className: styles.tab
      }, childrenArray.find(function (_ref, i) {
        var props = _ref.props;
        return (props.id || String(i)) === selected;
      })));
    }
  }]);

  return Tabs;
}(PureComponent);

_defineProperty(Tabs, "propTypes", {
  theme: PropTypes.string,
  selected: PropTypes.string,
  className: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.node.isRequired,
  onSelect: PropTypes.func,
  'data-test': PropTypes.string,
  autoCollapse: PropTypes.bool
});

_defineProperty(Tabs, "defaultProps", {
  onSelect: function onSelect() {}
});

_defineProperty(Tabs, "Theme", Theme);

var Tabs$1 = withTheme()(Tabs);

var SmartTabs = /*#__PURE__*/function (_PureComponent) {
  _inherits(SmartTabs, _PureComponent);

  var _super = _createSuper(SmartTabs);

  function SmartTabs() {
    var _this;

    _classCallCheck(this, SmartTabs);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      selected: _this.props.initSelected || _this.props.children[0].props.id || '0'
    });

    _defineProperty(_assertThisInitialized(_this), "handleSelect", function (selected) {
      return _this.setState({
        selected: selected
      });
    });

    return _this;
  }

  _createClass(SmartTabs, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children;
          _this$props.initSelected;
          var dataTest = _this$props['data-test'],
          restProps = _objectWithoutProperties(_this$props, ["children", "initSelected", "data-test"]);

      return /*#__PURE__*/React.createElement(Tabs$1, _extends({
        "data-test": joinDataTestAttributes('ring-smart-tabs', dataTest),
        selected: this.state.selected,
        onSelect: this.handleSelect
      }, restProps), children);
    }
  }]);

  return SmartTabs;
}(PureComponent);

_defineProperty(SmartTabs, "propTypes", {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  initSelected: PropTypes.string,
  'data-test': PropTypes.string
});

var Tab = /*#__PURE__*/function (_PureComponent) {
  _inherits(Tab, _PureComponent);

  var _super = _createSuper(Tab);

  function Tab() {
    _classCallCheck(this, Tab);

    return _super.apply(this, arguments);
  }

  _createClass(Tab, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          children = _this$props.children,
          dataTest = _this$props['data-test'];
      var classes = classNames(styles.tab, className);
      return /*#__PURE__*/React.createElement("div", {
        "data-test": joinDataTestAttributes('ring-tab', dataTest),
        className: classes
      }, children);
    }
  }]);

  return Tab;
}(PureComponent);

_defineProperty(Tab, "propTypes", {
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  'data-test': PropTypes.string
});

export { CustomItem, SmartTabs, Tab, Tabs$1 as Tabs };
