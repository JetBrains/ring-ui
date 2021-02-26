import { h as _slicedToArray, d as _defineProperty, i as _objectSpread2, _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass, e as _objectWithoutProperties, f as _extends, g as _assertThisInitialized } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { memo, createContext, useState, useContext, useEffect, Component, PureComponent, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import VirtualizedList from 'react-virtualized/dist/es/List';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import WindowScroller from 'react-virtualized/dist/es/WindowScroller';
import { CellMeasurerCache, CellMeasurer } from 'react-virtualized/dist/es/CellMeasurer';
import deprecate from 'util-deprecate';
import memoizeOne from 'memoize-one';
import { j as joinDataTestAttributes } from './data-tests-1a367745.js';
import { g as getUID } from './get-uid-bf3ab014.js';
import { s as scheduleRAF } from './schedule-raf-edeb21db.js';
import { m as memoize } from './memoize-ad2c954c.js';
import { p as preventDefault } from './dom-0ae85140.js';
import Shortcuts from './shortcuts.js';
import Link, { linkHOC } from './link.js';
import styleInject from 'style-inject';
import Avatar, { Size } from './avatar.js';
import Checkbox from './checkbox.js';
import Icon from './icon.js';

function createStatefulContext(initialValue) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var ValueContext = /*#__PURE__*/createContext(initialValue);
  var UpdateContext = /*#__PURE__*/createContext(function () {});

  function Provider(_ref) {
    var children = _ref.children;

    var _useState = useState(initialValue),
        _useState2 = _slicedToArray(_useState, 2),
        value = _useState2[0],
        update = _useState2[1];

    return /*#__PURE__*/React.createElement(ValueContext.Provider, {
      value: value
    }, /*#__PURE__*/React.createElement(UpdateContext.Provider, {
      value: update
    }, children));
  }

  Provider.propTypes = {
    children: PropTypes.node
  };
  Provider.displayName = "".concat(name, "Provider");

  function useUpdate(value, skipUpdate) {
    var update = useContext(UpdateContext);
    useEffect(function () {
      if (!skipUpdate) {
        update(value);
      }
    }, [update, value, skipUpdate]);
  }

  function Updater(_ref2) {
    var value = _ref2.value,
        skipUpdate = _ref2.skipUpdate;
    useUpdate(value, skipUpdate);
    return null;
  }

  Updater.displayName = "".concat(name, "Updater");
  return {
    ValueContext: ValueContext,
    UpdateContext: UpdateContext,
    Provider: Provider,
    useUpdate: useUpdate,
    Updater: /*#__PURE__*/memo(Updater)
  };
}

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.list_error__TLLdT:hover {\n    color: #c22731;\n    color: var(--ring-error-color);\n  }}\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.list_list__2b0Bc {\n  position: relative;\n\n  z-index: 1;\n\n  border-radius: 3px;\n\n  border-radius: var(--ring-border-radius);\n\n  line-height: normal;\n}\n\n.list_simpleInner__9-jpj {\n  overflow: auto;\n}\n\n.list_scrolling__3Wj4v {\n  pointer-events: none;\n}\n\n.list_separator__3jRuQ {\n  display: block;\n\n  min-height: 8px;\n\n  margin-top: 8px;\n  padding: 0 16px 1px;\n\n  text-align: right;\n\n  color: #737577;\n\n  color: var(--ring-secondary-color);\n  border-top: 1px solid #dfe5eb;\n  border-top: 1px solid var(--ring-line-color);\n\n  font-size: 12px;\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: 18px;\n  line-height: var(--ring-line-height-lower);\n}\n\n.list_separator_first__2lMQc {\n  margin-top: 0;\n  padding-top: 0;\n\n  border: none;\n}\n\n.list_item__8d03A {\n  display: block;\n\n  box-sizing: border-box;\n\n  width: 100%;\n\n  text-align: left;\n  vertical-align: bottom;\n  white-space: nowrap;\n  text-decoration: none;\n\n  outline: none;\n\n  font-size: 13px;\n\n  font-size: var(--ring-font-size);\n  line-height: 24px;\n}\n\n.list_item__8d03A.list_item__8d03A {\n  padding: 3px 16px 5px;\n}\n\n.list_itemContainer__1FSki {\n  position: relative;\n}\n\n.list_compact__25yKG {\n  line-height: 16px;\n}\n\n.list_error__TLLdT {\n  cursor: default\n\n  /* Override ring-link */\n}\n\n.list_error__TLLdT,\n  .list_error__TLLdT:focus,\n  .list_error__TLLdT:visited {\n    color: #c22731;\n    color: var(--ring-error-color);\n  }\n\n.list_add__dBs5b {\n  padding: 8px 16px;\n\n  line-height: 32px;\n}\n\n.list_top__1CnD8 {\n  display: flex;\n  align-items: baseline;\n  flex-direction: row;\n}\n\n.list_left__3IXEL {\n  align-self: center;\n  flex-shrink: 0;\n}\n\n.list_label__3cest {\n  overflow: hidden;\n  flex-grow: 1;\n  flex-shrink: 1;\n\n  text-align: left;\n  white-space: nowrap;\n  text-overflow: ellipsis\n}\n\n[dir=rtl] .list_label__3cest {\n    text-align: right;\n    direction: ltr\n}\n\n.list_description__1YYwZ {\n  overflow: hidden;\n  flex-shrink: 100;\n\n  padding-left: 8px;\n\n  text-align: right;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n\n  color: #737577;\n\n  color: var(--ring-secondary-color);\n\n  font-size: 12px;\n\n  font-size: var(--ring-font-size-smaller);\n  font-weight: 400;\n  line-height: 16px;\n  line-height: var(--ring-line-height-lowest);\n}\n\n.list_right___rGlf {\n  display: flex;\n  align-items: center;\n  align-self: center;\n  flex-direction: row;\n  flex-shrink: 0;\n}\n\n.list_details__2KJUX {\n  margin-bottom: 6px;\n\n  white-space: normal;\n\n  color: #737577;\n\n  color: var(--ring-secondary-color);\n\n  font-size: 12px;\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: 16px;\n  line-height: var(--ring-line-height-lowest);\n}\n\n.list_padded__78Cjm {\n  margin-left: 20px;\n}\n\n/* Override :last-child */\n\n.list_hint__1vXJ1.list_hint__1vXJ1 {\n  margin-bottom: 0;\n\n  border-top: 1px solid #dfe5eb;\n\n  border-top: 1px solid var(--ring-line-color);\n  background-color: #f7f9fa;\n  background-color: var(--ring-sidebar-background-color);\n\n  font-size: 12px;\n\n  font-size: var(--ring-font-size-smaller);\n}\n\n.list_action__2dWDG {\n  cursor: pointer;\n\n  color: #1f2326;\n\n  color: var(--ring-text-color);\n}\n\n/* override link */\n\n.list_actionLink__uyxVb.list_actionLink__uyxVb {\n  transition: none;\n}\n\n.list_hover__1mpGn:not(.list_error__TLLdT) {\n  background-color: #d4edff;\n  background-color: var(--ring-selected-background-color);\n}\n\n.list_icon__1D-YR {\n  display: inline-block;\n\n  width: 20px;\n  height: 20px;\n  margin-left: 16px;\n\n  background-repeat: no-repeat;\n  background-position: center;\n\n  background-size: contain;\n}\n\n.list_highlight__28Oo6 {\n  color: #ff008c;\n  color: var(--ring-link-hover-color);\n}\n\n.list_service__kHaRc {\n  color: #737577;\n  color: var(--ring-secondary-color);\n}\n\n.list_glyph__2QhJM {\n  float: left;\n\n  width: 20px;\n  margin-right: 8px;\n\n  color: #999;\n\n  color: var(--ring-icon-secondary-color);\n}\n\n.list_avatar__3Zvm0 {\n\n  top: 0;\n}\n\n.list_rightGlyph__1jCM7 {\n\n  float: right;\n\n  margin-right: 0;\n  margin-left: 16px;\n}\n\n.list_checkboxContainer__15thh {\n  position: absolute;\n  top: 7px;\n  left: 19px;\n\n  width: 20px;\n  height: 20px;\n  margin-right: 8px;\n}\n\n.list_compact__25yKG .list_checkboxContainer__15thh {\n  top: 0;\n\n  width: 16px;\n  height: 16px;\n}\n\n.list_title__3QuJ9 {\n  display: block;\n\n  margin-top: 10px;\n  margin-bottom: 6px;\n  padding: 8px 16px 0;\n\n  text-align: left\n}\n\n[dir=rtl] .list_title__3QuJ9 {\n    text-align: right;\n    direction: ltr\n}\n\n.list_title_first__ARVmf {\n  margin-top: 0;\n}\n\n.list_text__2js5h {\n  letter-spacing: 1.5px;\n  text-transform: uppercase;\n\n  color: #737577;\n\n  color: var(--ring-secondary-color);\n\n  font-size: 12px;\n\n  font-size: var(--ring-font-size-smaller);\n}\n\n.list_fade__30cXw {\n  position: absolute;\n  bottom: 0;\n\n  width: 100%;\n  height: 24px;\n\n  pointer-events: none;\n\n  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff);\n\n  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), var(--ring-content-background-color));\n}\n\n.list_disabled__3iQvS {\n  pointer-events: none;\n\n  color: #999;\n\n  color: var(--ring-disabled-color);\n}\n";
var styles = {"unit":"8px","listSpacing":"8px","error":"list_error__TLLdT","list":"list_list__2b0Bc","simpleInner":"list_simpleInner__9-jpj","scrolling":"list_scrolling__3Wj4v","separator":"list_separator__3jRuQ","separator_first":"list_separator_first__2lMQc","item":"list_item__8d03A","itemContainer":"list_itemContainer__1FSki","compact":"list_compact__25yKG","add":"list_add__dBs5b","top":"list_top__1CnD8","left":"list_left__3IXEL","label":"list_label__3cest","description":"list_description__1YYwZ","right":"list_right___rGlf","details":"list_details__2KJUX","padded":"list_padded__78Cjm","hint":"list_hint__1vXJ1","action":"list_action__2dWDG","actionLink":"list_actionLink__uyxVb","hover":"list_hover__1mpGn","icon":"list_icon__1D-YR","highlight":"list_highlight__28Oo6","service":"list_service__kHaRc","glyph":"list_glyph__2QhJM","avatar":"list_avatar__3Zvm0 list_glyph__2QhJM","rightGlyph":"list_rightGlyph__1jCM7 list_glyph__2QhJM","checkboxContainer":"list_checkboxContainer__15thh","title":"list_title__3QuJ9","title_first":"list_title_first__ARVmf","text":"list_text__2js5h","fade":"list_fade__30cXw","disabled":"list_disabled__3iQvS"};
styleInject(css_248z);

/**
 * @constructor
 * @extends {ReactComponent}
 */

var ListLink = /*#__PURE__*/function (_PureComponent) {
  _inherits(ListLink, _PureComponent);

  var _super = _createSuper(ListLink);

  function ListLink() {
    _classCallCheck(this, ListLink);

    return _super.apply(this, arguments);
  }

  _createClass(ListLink, [{
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props = this.props,
          scrolling = _this$props.scrolling,
          dataTest = _this$props['data-test'],
          className = _this$props.className,
          label = _this$props.label,
          hover = _this$props.hover;
          _this$props.description;
          _this$props.rgItemType;
          _this$props.url;
          _this$props.onCheckboxChange;
          var disabled = _this$props.disabled,
          LinkComponent = _this$props.LinkComponent,
          compact = _this$props.compact;
          _this$props.hoverClassName;
          var restProps = _objectWithoutProperties(_this$props, ["scrolling", "data-test", "className", "label", "hover", "description", "rgItemType", "url", "onCheckboxChange", "disabled", "LinkComponent", "compact", "hoverClassName"]);

      var classes = classNames(styles.item, className, (_classNames = {}, _defineProperty(_classNames, styles.actionLink, !disabled), _defineProperty(_classNames, styles.compact, compact), _defineProperty(_classNames, styles.scrolling, scrolling), _classNames));
      var Comp = LinkComponent ? linkHOC(LinkComponent) : Link;
      return /*#__PURE__*/React.createElement(Comp, _extends({
        pseudo: !this.props.href
      }, restProps, {
        hover: hover && !disabled,
        className: classes,
        "data-test": joinDataTestAttributes('ring-list-link', dataTest)
      }), label);
    }
  }]);

  return ListLink;
}(PureComponent);

_defineProperty(ListLink, "propTypes", _objectSpread2(_objectSpread2({}, Link.propTypes), {}, {
  description: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  rgItemType: PropTypes.number,
  scrolling: PropTypes.bool,
  url: PropTypes.string,
  LinkComponent: PropTypes.oneOfType([PropTypes.instanceOf(Component), PropTypes.func, PropTypes.string]),
  onCheckboxChange: PropTypes.func,
  compact: PropTypes.bool
}));

var css_248z$1 = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ */\n\n/*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/\n\n.global_clearfix__1FS6o::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n\n.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}\n\n.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}\n\n.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}\n\n.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}\n\n.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}\n\n.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}\n\n/* To be used at large sizes */\n\n/* As close as possible to Helvetica Neue Thin (to replace Gotham) */\n\n.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}\n\n.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}\n\n.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\n.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit\n}\n\n.global_resetButton__WQfrm::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n\n/* Note: footer also has top margin which isn't taken into account here */\n\n/* Media breakpoints (minimal values) */\n\n/* Media queries */\n";
var globalStyles = {"unit":"8px","footer-height":"calc(8px * 8)","breakpoint-small":"640px","breakpoint-middle":"960px","breakpoint-large":"1200px","extra-small-screen-media":"(max-width: calc(640px - 1px))","small-screen-media":"(min-width: 640px) and (max-width: calc(960px - 1px))","middle-screen-media":"(min-width: 960px) and (max-width: calc(1200px - 1px))","large-screen-media":"(min-width: 1200px)","clearfix":"global_clearfix__1FS6o","font":"global_font__2H0e4","font-lower":"global_font-lower__11Bp7 global_font__2H0e4","font-smaller":"global_font-smaller__2YCID global_font-lower__11Bp7 global_font__2H0e4","font-smaller-lower":"global_font-smaller-lower__33Wmu global_font-smaller__2YCID global_font-lower__11Bp7 global_font__2H0e4","font-larger-lower":"global_font-larger-lower__2rrRR global_font-lower__11Bp7 global_font__2H0e4","font-larger":"global_font-larger__1-iV9 global_font-larger-lower__2rrRR global_font-lower__11Bp7 global_font__2H0e4","thin-font":"global_thin-font__1F7aK","monospace-font":"global_monospace-font__1XOVq","ellipsis":"global_ellipsis__xhH6M","resetButton":"global_resetButton__WQfrm"};
styleInject(css_248z$1);

/**
 * @constructor
 * @extends {ReactComponent}
 */

var RING_UNIT = 8;
var DEFAULT_PADDING = 16;
var CHECKBOX_WIDTH = 28;

var ListItem = /*#__PURE__*/function (_PureComponent) {
  _inherits(ListItem, _PureComponent);

  var _super = _createSuper(ListItem);

  function ListItem() {
    var _this;

    _classCallCheck(this, ListItem);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "id", getUID('list-item-'));

    _defineProperty(_assertThisInitialized(_this), "stopBubbling", function (e) {
      return e.stopPropagation();
    });

    _defineProperty(_assertThisInitialized(_this), "_isString", function (val) {
      return typeof val === 'string' || val instanceof String;
    });

    return _this;
  }

  _createClass(ListItem, [{
    key: "render",
    value: function render() {
      var _classNames, _classNames2;

      var _this$props = this.props,
          scrolling = _this$props.scrolling,
          className = _this$props.className,
          disabled = _this$props.disabled,
          checkbox = _this$props.checkbox,
          avatar = _this$props.avatar,
          subavatar = _this$props.subavatar,
          glyph = _this$props.glyph,
          icon = _this$props.icon,
          rightGlyph = _this$props.rightGlyph,
          description = _this$props.description,
          label = _this$props.label,
          title = _this$props.title,
          details = _this$props.details,
          hover = _this$props.hover;
          _this$props.rgItemType;
          var level = _this$props.level,
          tabIndex = _this$props.tabIndex,
          compact = _this$props.compact,
          onClick = _this$props.onClick,
          onCheckboxChange = _this$props.onCheckboxChange,
          onMouseOver = _this$props.onMouseOver,
          onMouseDown = _this$props.onMouseDown,
          onMouseUp = _this$props.onMouseUp,
          rightNodes = _this$props.rightNodes,
          leftNodes = _this$props.leftNodes,
          restProps = _objectWithoutProperties(_this$props, ["scrolling", "className", "disabled", "checkbox", "avatar", "subavatar", "glyph", "icon", "rightGlyph", "description", "label", "title", "details", "hover", "rgItemType", "level", "tabIndex", "compact", "onClick", "onCheckboxChange", "onMouseOver", "onMouseDown", "onMouseUp", "rightNodes", "leftNodes"]);

      var checkable = checkbox !== undefined;
      var hasLeftNodes = leftNodes || glyph || avatar;
      var showCheckbox = checkable && (checkbox || !hasLeftNodes || hover && !disabled);
      var classes = classNames(styles.item, globalStyles.resetButton, className, (_classNames = {}, _defineProperty(_classNames, styles.action, !disabled), _defineProperty(_classNames, styles.hover, hover && !disabled), _defineProperty(_classNames, styles.compact, compact), _defineProperty(_classNames, styles.scrolling, scrolling), _defineProperty(_classNames, styles.disabled, disabled), _classNames));
      var detailsClasses = classNames((_classNames2 = {}, _defineProperty(_classNames2, styles.details, details), _defineProperty(_classNames2, styles.padded, icon !== undefined || checkbox !== undefined || glyph !== undefined), _classNames2));
      var style = {
        paddingLeft: "".concat((+level || 0) * RING_UNIT + DEFAULT_PADDING + (showCheckbox ? CHECKBOX_WIDTH : 0), "px")
      };
      var computedTitle = null;

      if (this._isString(title)) {
        // if title is specified and is a string then use it
        computedTitle = title;
      } else {
        // otherwise use label if it is a string;
        // label can also be an element, use empty string in this case
        computedTitle = this._isString(label) ? label : '';
      }

      var dataTest = joinDataTestAttributes({
        'ring-list-item': (restProps['data-test'] || '').indexOf('ring-list-item') === -1,
        'ring-list-item-action': !disabled,
        'ring-list-item-selected': checkbox
      }, restProps['data-test']);
      return /*#__PURE__*/React.createElement("div", {
        className: styles.itemContainer,
        "data-test": dataTest
      }, showCheckbox && /*#__PURE__*/React.createElement("div", {
        className: styles.checkboxContainer
      }, /*#__PURE__*/React.createElement(Checkbox, {
        "aria-labelledby": this.id,
        checked: checkbox,
        disabled: disabled,
        onChange: onCheckboxChange,
        onClick: this.stopBubbling
      })), /*#__PURE__*/React.createElement("button", {
        id: this.id,
        type: "button",
        tabIndex: tabIndex,
        onClick: onClick,
        onMouseOver: onMouseOver,
        onMouseDown: onMouseDown,
        onFocus: onMouseOver,
        onMouseUp: onMouseUp,
        className: classes,
        style: style
      }, /*#__PURE__*/React.createElement("div", {
        className: styles.top,
        onMouseOut: this.stopBubbling,
        onBlur: this.stopBubbling
      }, !showCheckbox && /*#__PURE__*/React.createElement("div", {
        className: styles.left
      }, leftNodes, glyph && /*#__PURE__*/React.createElement(Icon, {
        className: styles.glyph,
        glyph: glyph,
        size: this.props.iconSize
      }), avatar && /*#__PURE__*/React.createElement(Avatar, {
        className: styles.avatar,
        url: avatar,
        size: Size.Size20,
        subavatar: subavatar
      })), /*#__PURE__*/React.createElement("span", {
        className: styles.label,
        title: computedTitle,
        "data-test": "ring-list-item-label"
      }, label), description && /*#__PURE__*/React.createElement("span", {
        className: styles.description,
        "data-test": "ring-list-item-description"
      }, description), /*#__PURE__*/React.createElement("div", {
        className: styles.right
      }, rightGlyph && /*#__PURE__*/React.createElement(Icon, {
        className: styles.rightGlyph,
        glyph: rightGlyph,
        size: this.props.iconSize
      }), icon && /*#__PURE__*/React.createElement("div", {
        className: styles.icon,
        style: {
          backgroundImage: "url(\"".concat(icon, "\")")
        }
      }), rightNodes)), details && /*#__PURE__*/React.createElement("div", {
        className: detailsClasses
      }, details)));
    }
  }]);

  return ListItem;
}(PureComponent);

_defineProperty(ListItem, "propTypes", {
  scrolling: PropTypes.bool,
  hover: PropTypes.bool,
  details: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  tabIndex: PropTypes.number,
  checkbox: PropTypes.bool,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array]),
  avatar: PropTypes.string,
  subavatar: PropTypes.string,
  glyph: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  icon: PropTypes.string,
  iconSize: PropTypes.number,
  rightNodes: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array]),
  leftNodes: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  title: PropTypes.string,
  level: PropTypes.number,
  rgItemType: PropTypes.number,
  rightGlyph: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  compact: PropTypes.bool,
  onClick: PropTypes.func,
  onCheckboxChange: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  'data-test': PropTypes.string
});

// react-dom getEventKey function extracted
var normalizeKey = {
  Esc: 'Escape',
  Spacebar: ' ',
  Left: 'ArrowLeft',
  Up: 'ArrowUp',
  Right: 'ArrowRight',
  Down: 'ArrowDown',
  Del: 'Delete',
  Win: 'OS',
  Menu: 'ContextMenu',
  Apps: 'ContextMenu',
  Scroll: 'ScrollLock',
  MozPrintableKey: 'Unidentified'
};
var translateToKey = {
  8: 'Backspace',
  9: 'Tab',
  12: 'Clear',
  13: 'Enter',
  16: 'Shift',
  17: 'Control',
  18: 'Alt',
  19: 'Pause',
  20: 'CapsLock',
  27: 'Escape',
  32: ' ',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  45: 'Insert',
  46: 'Delete',
  112: 'F1',
  113: 'F2',
  114: 'F3',
  115: 'F4',
  116: 'F5',
  117: 'F6',
  118: 'F7',
  119: 'F8',
  120: 'F9',
  121: 'F10',
  122: 'F11',
  123: 'F12',
  144: 'NumLock',
  145: 'ScrollLock',
  224: 'Meta'
};
var ENTER = 13;
var SPACE = 32;

function getEventCharCode(nativeEvent) {
  var charCode;
  var keyCode = nativeEvent.keyCode;

  if ('charCode' in nativeEvent) {
    charCode = nativeEvent.charCode; // FF does not set `charCode` for the Enter-key, check against `keyCode`.

    if (charCode === 0 && keyCode === ENTER) {
      charCode = ENTER;
    }
  } else {
    // IE8 does not implement `charCode`, but `keyCode` has the correct value.
    charCode = keyCode;
  } // Some non-printable keys are reported in `charCode`/`keyCode`, discard them.
  // Must not discard the (non-)printable Enter-key.


  if (charCode >= SPACE || charCode === ENTER) {
    return charCode;
  }

  return 0;
}

function getEventKey(nativeEvent) {
  if (nativeEvent.key) {
    // Normalize inconsistent values reported by browsers due to
    // implementations of a working draft specification.
    // FireFox implements `key` but returns `MozPrintableKey` for all
    // printable characters (normalized to `Unidentified`), ignore it.
    var key = normalizeKey[nativeEvent.key] || nativeEvent.key;

    if (key !== 'Unidentified') {
      return key;
    }
  } // Browser does not implement `key`, polyfill as much of it as we can.


  if (nativeEvent.type === 'keypress') {
    var charCode = getEventCharCode(nativeEvent); // The enter-key is technically both printable and non-printable and can
    // thus be captured by `keypress`, no other non-printable key should.

    return charCode === SPACE ? 'Enter' : String.fromCharCode(charCode);
  }

  if (nativeEvent.type === 'keydown' || nativeEvent.type === 'keyup') {
    // While user keyboard layout determines the actual meaning of each
    // `keyCode` value, almost all function keys have a universal value.
    return translateToKey[nativeEvent.keyCode] || 'Unidentified';
  }

  return '';
}

var ListCustom = /*#__PURE__*/function (_PureComponent) {
  _inherits(ListCustom, _PureComponent);

  var _super = _createSuper(ListCustom);

  function ListCustom() {
    var _this;

    _classCallCheck(this, ListCustom);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleKeyPress", function (event) {
      var key = getEventKey(event);

      if (key === 'Enter' || key === ' ') {
        _this.props.onClick(event);
      }
    });

    return _this;
  }

  _createClass(ListCustom, [{
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props = this.props,
          scrolling = _this$props.scrolling,
          hover = _this$props.hover,
          className = _this$props.className,
          disabled = _this$props.disabled,
          template = _this$props.template;
          _this$props.rgItemType;
          var tabIndex = _this$props.tabIndex,
          onClick = _this$props.onClick;
          _this$props.onCheckboxChange;
          var onMouseOver = _this$props.onMouseOver,
          onMouseUp = _this$props.onMouseUp,
          restProps = _objectWithoutProperties(_this$props, ["scrolling", "hover", "className", "disabled", "template", "rgItemType", "tabIndex", "onClick", "onCheckboxChange", "onMouseOver", "onMouseUp"]);

      var classes = classNames(styles.item, className, (_classNames = {}, _defineProperty(_classNames, styles.action, !disabled), _defineProperty(_classNames, styles.hover, hover && !disabled), _defineProperty(_classNames, styles.scrolling, scrolling), _classNames));
      var dataTest = joinDataTestAttributes('ring-list-item-custom', {
        'ring-list-item-action': !disabled
      }, restProps['data-test']);
      var content = typeof template === 'function' ? template(this.props) : template;
      return /*#__PURE__*/React.createElement("span", {
        role: "button",
        tabIndex: tabIndex,
        onClick: onClick,
        onKeyPress: this.handleKeyPress,
        onMouseOver: onMouseOver,
        onFocus: onMouseOver,
        onMouseUp: onMouseUp,
        className: classes,
        "data-test": dataTest
      }, content);
    }
  }]);

  return ListCustom;
}(PureComponent);

_defineProperty(ListCustom, "propTypes", {
  scrolling: PropTypes.bool,
  hover: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  rgItemType: PropTypes.number,
  tabIndex: PropTypes.number,
  template: PropTypes.oneOfType([PropTypes.func, PropTypes.element, PropTypes.string]),
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseUp: PropTypes.func,
  onCheckboxChange: PropTypes.func,
  'data-test': PropTypes.string
});

_defineProperty(ListCustom, "defaultProps", {
  hover: false
});

var ListTitle = /*#__PURE__*/function (_PureComponent) {
  _inherits(ListTitle, _PureComponent);

  var _super = _createSuper(ListTitle);

  function ListTitle() {
    _classCallCheck(this, ListTitle);

    return _super.apply(this, arguments);
  }

  _createClass(ListTitle, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          description = _this$props.description,
          label = _this$props.label,
          isFirst = _this$props.isFirst;
      var classes = classNames(styles.title, className, _defineProperty({}, styles.title_first, isFirst));
      return /*#__PURE__*/React.createElement("span", {
        className: classes,
        "data-test": "ring-list-title"
      }, /*#__PURE__*/React.createElement("span", {
        className: classNames(styles.label, styles.text),
        "data-test": "ring-list-title-label"
      }, label), /*#__PURE__*/React.createElement("div", {
        className: styles.description,
        "data-test": "ring-list-title-description"
      }, description));
    }
  }]);

  return ListTitle;
}(PureComponent);

_defineProperty(ListTitle, "propTypes", {
  className: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  isFirst: PropTypes.bool
});

var ListSeparator = /*#__PURE__*/function (_PureComponent) {
  _inherits(ListSeparator, _PureComponent);

  var _super = _createSuper(ListSeparator);

  function ListSeparator() {
    _classCallCheck(this, ListSeparator);

    return _super.apply(this, arguments);
  }

  _createClass(ListSeparator, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          description = _this$props.description,
          isFirst = _this$props.isFirst,
          className = _this$props.className;
      var classes = classNames(styles.separator, className, _defineProperty({}, styles.separator_first, isFirst));
      return /*#__PURE__*/React.createElement("span", {
        className: classes
      }, description);
    }
  }]);

  return ListSeparator;
}(PureComponent);

_defineProperty(ListSeparator, "propTypes", {
  className: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  isFirst: PropTypes.bool
});

/**
 * @constructor
 * @extends {ReactComponent}
 */

var ListHint = /*#__PURE__*/function (_PureComponent) {
  _inherits(ListHint, _PureComponent);

  var _super = _createSuper(ListHint);

  function ListHint() {
    _classCallCheck(this, ListHint);

    return _super.apply(this, arguments);
  }

  _createClass(ListHint, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("span", {
        className: classNames(styles.item, styles.hint),
        "data-test": "ring-list-hint"
      }, this.props.label);
    }
  }]);

  return ListHint;
}(PureComponent);

_defineProperty(ListHint, "propTypes", {
  label: PropTypes.node
});

/**
 * @enum {number}
 */
var Type = {
  SEPARATOR: 0,
  LINK: 1,
  ITEM: 2,
  HINT: 3,
  CUSTOM: 4,
  TITLE: 5,
  MARGIN: 6
};
var Dimension = {
  ITEM_PADDING: 16,
  ITEM_HEIGHT: 32,
  COMPACT_ITEM_HEIGHT: 24,
  SEPARATOR_HEIGHT: 25,
  SEPARATOR_FIRST_HEIGHT: 16,
  SEPARATOR_TEXT_HEIGHT: 18,
  TITLE_HEIGHT: 42,
  INNER_PADDING: 8,
  MARGIN: 8
};
var DEFAULT_ITEM_TYPE = Type.ITEM;

var scheduleScrollListener = scheduleRAF();
var scheduleHoverListener = scheduleRAF();

function noop() {}

var warnEmptyKey = deprecate(function () {}, 'No key passed for list item with non-string label. It is considered as a bad practice and has been deprecated, please provide a key.');
/**
 * @param {Type} listItemType
 * @param {Object} item list item
 */

function isItemType(listItemType, item) {
  var type = item.rgItemType;

  if (type == null) {
    type = DEFAULT_ITEM_TYPE;
  }

  return type === listItemType;
}

var nonActivatableTypes = [Type.SEPARATOR, Type.TITLE, Type.MARGIN];

function isActivatable(item) {
  return item != null && !nonActivatableTypes.includes(item.rgItemType) && !item.disabled;
}

var shouldActivateFirstItem = function shouldActivateFirstItem(props) {
  return props.activateFirstItem || props.activateSingleItem && props.data.length === 1;
};

var ActiveItemContext = createStatefulContext(undefined, 'ActiveItem');
/**
 * @name List
 * @constructor
 * @extends {ReactComponent}
 */

/**
 * Displays a list of items.
 */

var List = /*#__PURE__*/function (_Component) {
  _inherits(List, _Component);

  var _super = _createSuper(List);

  function List() {
    var _this;

    _classCallCheck(this, List);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      activeIndex: null,
      prevActiveIndex: null,
      prevData: [],
      activeItem: null,
      needScrollToActive: false,
      scrolling: false,
      hasOverflow: false,
      disabledHover: false,
      scrolledToBottom: false
    });

    _defineProperty(_assertThisInitialized(_this), "hoverHandler", memoize(function (index) {
      return function () {
        return scheduleHoverListener(function () {
          if (_this.state.disabledHover) {
            return;
          }

          if (_this.container) {
            _this.setState({
              activeIndex: index,
              activeItem: _this.props.data[index],
              needScrollToActive: false
            });
          }
        });
      };
    }));

    _defineProperty(_assertThisInitialized(_this), "_activatableItems", false);

    _defineProperty(_assertThisInitialized(_this), "_bufferSize", 10);

    _defineProperty(_assertThisInitialized(_this), "sizeCacheKey", function (index) {
      if (index === 0 || index === _this.props.data.length + 1) {
        return Type.MARGIN;
      }

      var item = _this.props.data[index - 1];
      var isFirst = index === 1;

      switch (item.rgItemType) {
        case Type.SEPARATOR:
        case Type.TITLE:
          return "".concat(item.rgItemType).concat(isFirst ? '_first' : '').concat(item.description ? '_desc' : '');

        case Type.MARGIN:
          return Type.MARGIN;

        case Type.CUSTOM:
          return "".concat(Type.CUSTOM, "_").concat(item.key);

        case Type.ITEM:
        case Type.LINK:
        default:
          if (item.details) {
            return "".concat(Type.ITEM, "_").concat(item.details);
          }

          return Type.ITEM;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_cache", new CellMeasurerCache({
      defaultHeight: _this.defaultItemHeight(),
      fixedWidth: true,
      keyMapper: _this.sizeCacheKey
    }));

    _defineProperty(_assertThisInitialized(_this), "_hasActivatableItems", memoizeOne(function (items) {
      return items.some(isActivatable);
    }));

    _defineProperty(_assertThisInitialized(_this), "selectHandler", memoize(function (index) {
      return function (event) {
        var tryKeepOpen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var item = _this.props.data[index];

        if (!_this.props.useMouseUp && item.onClick) {
          item.onClick(item, event);
        } else if (_this.props.useMouseUp && item.onMouseUp) {
          item.onMouseUp(item, event);
        }

        if (_this.props.onSelect) {
          _this.props.onSelect(item, event, {
            tryKeepOpen: tryKeepOpen
          });
        }
      };
    }));

    _defineProperty(_assertThisInitialized(_this), "checkboxHandler", memoize(function (index) {
      return function (event) {
        return _this.selectHandler(index)(event, true);
      };
    }));

    _defineProperty(_assertThisInitialized(_this), "upHandler", function (e) {
      var _this$props = _this.props,
          data = _this$props.data,
          disableMoveOverflow = _this$props.disableMoveOverflow;
      var index = _this.state.activeIndex;
      var newIndex;

      if (index === null || index === 0) {
        if (!disableMoveOverflow) {
          newIndex = data.length - 1;
        } else {
          return;
        }
      } else {
        newIndex = index - 1;
      }

      _this.moveHandler(newIndex, _this.upHandler, e);
    });

    _defineProperty(_assertThisInitialized(_this), "downHandler", function (e) {
      var _this$props2 = _this.props,
          data = _this$props2.data,
          disableMoveOverflow = _this$props2.disableMoveOverflow,
          disableMoveDownOverflow = _this$props2.disableMoveDownOverflow;
      var index = _this.state.activeIndex;
      var newIndex;

      if (index === null) {
        newIndex = 0;
      } else if (index + 1 === data.length) {
        if (!disableMoveOverflow && !disableMoveDownOverflow) {
          newIndex = 0;
        } else {
          return;
        }
      } else {
        newIndex = index + 1;
      }

      _this.moveHandler(newIndex, _this.downHandler, e);
    });

    _defineProperty(_assertThisInitialized(_this), "homeHandler", function (e) {
      _this.moveHandler(0, _this.downHandler, e);
    });

    _defineProperty(_assertThisInitialized(_this), "endHandler", function (e) {
      _this.moveHandler(_this.props.data.length - 1, _this.upHandler, e);
    });

    _defineProperty(_assertThisInitialized(_this), "onDocumentMouseMove", function () {
      if (_this.state.disabledHover) {
        _this.setState({
          disabledHover: false
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onDocumentKeyDown", function (e) {
      var metaKeys = [16, 17, 18, 19, 20, 91]; // eslint-disable-line no-magic-numbers

      if (!_this.state.disabledHover && !metaKeys.includes(e.keyCode)) {
        _this.setState({
          disabledHover: true
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "mouseHandler", function () {
      _this.setState({
        scrolling: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "scrollHandler", function () {
      _this.setState({
        scrolling: true
      }, _this.scrollEndHandler);
    });

    _defineProperty(_assertThisInitialized(_this), "enterHandler", function (event, shortcut) {
      if (_this.state.activeIndex !== null) {
        var item = _this.props.data[_this.state.activeIndex];

        _this.selectHandler(_this.state.activeIndex)(event);

        if (item.href && !event.defaultPrevented) {
          if (['command+enter', 'ctrl+enter'].includes(shortcut)) {
            window.open(item.href, '_blank');
          } else if (shortcut === 'shift+enter') {
            window.open(item.href);
          } else {
            window.location.href = item.href;
          }
        }

        return false; // do not propagate event
      } else {
        return true; // propagate event to the parent component (e.g., QueryAssist)
      }
    });

    _defineProperty(_assertThisInitialized(_this), "clearSelected", function () {
      _this.setState({
        activeIndex: null,
        needScrollToActive: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "scrollEndHandler", function () {
      return scheduleScrollListener(function () {
        var innerContainer = _this.inner;

        if (innerContainer) {
          var maxScrollingPosition = innerContainer.scrollHeight;
          var sensitivity = _this.defaultItemHeight() / 2;
          var currentScrollingPosition = innerContainer.scrollTop + innerContainer.clientHeight + sensitivity;
          var scrolledToBottom = maxScrollingPosition > 0 && currentScrollingPosition >= maxScrollingPosition;

          if (!_this.unmounted) {
            _this.setState({
              scrolledToBottom: scrolledToBottom
            });
          }

          if (scrolledToBottom) {
            _this.props.onScrollToBottom();
          }
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "checkOverflow", function () {
      if (_this.inner) {
        _this.setState({
          hasOverflow: _this.inner.scrollHeight - _this.inner.clientHeight > 1
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "renderItem", function (_ref) {
      var index = _ref.index,
          style = _ref.style,
          isScrolling = _ref.isScrolling,
          parent = _ref.parent,
          key = _ref.key;
      var itemKey;
      var el;
      var realIndex = index - 1;
      var item = _this.props.data[realIndex];

      var itemId = _this.getId(item); // top and bottom margins


      if (index === 0 || index === _this.props.data.length + 1 || item.rgItemType === Type.MARGIN) {
        itemKey = key || "".concat(Type.MARGIN, "_").concat(index);
        el = /*#__PURE__*/React.createElement("div", {
          style: {
            height: Dimension.MARGIN
          }
        });
      } else {
        // Hack around SelectNG implementation
        item.selectedLabel;
            item.originalModel;
            var cleanedProps = _objectWithoutProperties(item, ["selectedLabel", "originalModel"]);

        var itemProps = Object.assign({
          rgItemType: DEFAULT_ITEM_TYPE
        }, cleanedProps);

        if (itemProps.url) {
          itemProps.href = itemProps.url;
        }

        if (itemProps.href) {
          itemProps.rgItemType = Type.LINK;
        }

        itemKey = key || itemId;
        itemProps.hover = realIndex === _this.state.activeIndex;

        if (itemProps.hoverClassName != null && itemProps.hover) {
          itemProps.className = classNames(itemProps.className, itemProps.hoverClassName);
        }

        itemProps.onMouseOver = _this.hoverHandler(realIndex);
        itemProps.tabIndex = -1;
        itemProps.scrolling = isScrolling;

        var selectHandler = _this.selectHandler(realIndex);

        if (_this.props.useMouseUp) {
          itemProps.onMouseUp = selectHandler;
        } else {
          itemProps.onClick = selectHandler;
        }

        itemProps.onCheckboxChange = _this.checkboxHandler(realIndex);

        if (itemProps.compact == null) {
          itemProps.compact = _this.props.compact;
        }

        var ItemComponent;
        var isFirst = index === 1;

        switch (itemProps.rgItemType) {
          case Type.SEPARATOR:
            ItemComponent = ListSeparator;
            itemProps.isFirst = isFirst;
            break;

          case Type.LINK:
            ItemComponent = ListLink;

            _this.addItemDataTestToProp(itemProps);

            break;

          case Type.ITEM:
            ItemComponent = ListItem;

            _this.addItemDataTestToProp(itemProps);

            break;

          case Type.CUSTOM:
            ItemComponent = ListCustom;

            _this.addItemDataTestToProp(itemProps);

            break;

          case Type.TITLE:
            itemProps.isFirst = isFirst;
            ItemComponent = ListTitle;
            break;

          default:
            throw new Error("Unknown menu element type: ".concat(itemProps.rgItemType));
        }

        el = /*#__PURE__*/React.createElement(ItemComponent, itemProps);
      }

      return parent ? /*#__PURE__*/React.createElement(CellMeasurer, {
        cache: _this._cache,
        key: itemKey,
        parent: parent,
        rowIndex: index,
        columnIndex: 0
      }, function (_ref2) {
        var registerChild = _ref2.registerChild;
        return /*#__PURE__*/React.createElement("div", {
          ref: registerChild,
          style: style,
          role: "row",
          id: itemId
        }, /*#__PURE__*/React.createElement("div", {
          role: "cell"
        }, el));
      }) : /*#__PURE__*/cloneElement(el, {
        key: itemKey
      });
    });

    _defineProperty(_assertThisInitialized(_this), "addItemDataTestToProp", function (props) {
      props['data-test'] = joinDataTestAttributes('ring-list-item', props['data-test']);
      return props;
    });

    _defineProperty(_assertThisInitialized(_this), "virtualizedListRef", function (el) {
      _this.virtualizedList = el;
    });

    _defineProperty(_assertThisInitialized(_this), "containerRef", function (el) {
      _this.container = el;
    });

    _defineProperty(_assertThisInitialized(_this), "id", getUID('list-'));

    _defineProperty(_assertThisInitialized(_this), "shortcutsScope", _this.id);

    _defineProperty(_assertThisInitialized(_this), "shortcutsMap", {
      up: _this.upHandler,
      down: _this.downHandler,
      home: _this.homeHandler,
      end: _this.endHandler,
      enter: _this.enterHandler,
      'meta+enter': _this.enterHandler,
      'ctrl+enter': _this.enterHandler,
      'command+enter': _this.enterHandler,
      'shift+enter': _this.enterHandler
    });

    return _this;
  }

  _createClass(List, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      document.addEventListener('mousemove', this.onDocumentMouseMove);
      document.addEventListener('keydown', this.onDocumentKeyDown, true);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _this2 = this;

      return nextProps !== this.props || Object.keys(nextState).some(function (key) {
        return nextState[key] !== _this2.state[key];
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.virtualizedList && prevProps.data !== this.props.data) {
        this.virtualizedList.recomputeRowHeights();
      }

      this.checkOverflow();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unmounted = true;
      document.removeEventListener('mousemove', this.onDocumentMouseMove);
      document.removeEventListener('keydown', this.onDocumentKeyDown, true);
    }
  }, {
    key: "hasActivatableItems",
    value: function hasActivatableItems() {
      return this._hasActivatableItems(this.props.data);
    }
  }, {
    key: "moveHandler",
    value: function moveHandler(index, retryCallback, e) {
      var correctedIndex;

      if (this.props.data.length === 0 || !this.hasActivatableItems()) {
        return;
      } else if (this.props.data.length < index) {
        correctedIndex = 0;
      } else {
        correctedIndex = index;
      }

      var item = this.props.data[correctedIndex];
      this.setState({
        activeIndex: correctedIndex,
        activeItem: item,
        needScrollToActive: true
      }, function onSet() {
        if (!isActivatable(item)) {
          retryCallback(e);
          return;
        }

        if (e.key !== 'Home' && e.key !== 'End') {
          preventDefault(e);
        }
      });
    }
  }, {
    key: "getFirst",
    value: function getFirst() {
      return this.props.data.find(function (item) {
        return item.rgItemType === Type.ITEM || item.rgItemType === Type.CUSTOM;
      });
    }
  }, {
    key: "getSelected",
    value: function getSelected() {
      return this.props.data[this.state.activeIndex];
    }
  }, {
    key: "defaultItemHeight",
    value: function defaultItemHeight() {
      return this.props.compact ? Dimension.COMPACT_ITEM_HEIGHT : Dimension.ITEM_HEIGHT;
    }
  }, {
    key: "getVisibleListHeight",
    value: function getVisibleListHeight(props) {
      return props.maxHeight - this.defaultItemHeight() - Dimension.INNER_PADDING;
    }
  }, {
    key: "_deprecatedGenerateKeyFromContent",
    value: function _deprecatedGenerateKeyFromContent(itemProps) {
      var identificator = itemProps.label || itemProps.description;
      var isString = typeof identificator === 'string' || identificator instanceof String;

      if (identificator && !isString) {
        warnEmptyKey();
        "".concat(itemProps.rgItemType, "_").concat(JSON.stringify(identificator));
      }

      return "".concat(itemProps.rgItemType, "_").concat(identificator);
    }
  }, {
    key: "getId",
    value: function getId(item) {
      return item != null ? "".concat(this.id, ":").concat(item.key || this._deprecatedGenerateKeyFromContent(item)) : null;
    }
  }, {
    key: "renderVirtualizedInner",
    value: function renderVirtualizedInner(_ref3) {
      var _this3 = this;

      var height = _ref3.height,
          maxHeight = _ref3.maxHeight,
          _ref3$autoHeight = _ref3.autoHeight,
          autoHeight = _ref3$autoHeight === void 0 ? false : _ref3$autoHeight,
          rowCount = _ref3.rowCount,
          isScrolling = _ref3.isScrolling,
          _ref3$onChildScroll = _ref3.onChildScroll,
          onChildScroll = _ref3$onChildScroll === void 0 ? noop : _ref3$onChildScroll,
          scrollTop = _ref3.scrollTop,
          registerChild = _ref3.registerChild;
      var dirOverride = {
        direction: 'auto'
      }; // Virtualized sets "direction: ltr" by default https://github.com/bvaughn/react-virtualized/issues/457

      return /*#__PURE__*/React.createElement(AutoSizer, {
        disableHeight: true,
        onResize: this.props.onResize
      }, function (_ref4) {
        var width = _ref4.width;
        return /*#__PURE__*/React.createElement("div", {
          ref: registerChild
        }, /*#__PURE__*/React.createElement(VirtualizedList, {
          "aria-label": _this3.props.ariaLabel,
          ref: _this3.virtualizedListRef,
          className: "ring-list__i",
          autoHeight: autoHeight,
          style: maxHeight ? _objectSpread2({
            maxHeight: maxHeight,
            height: 'auto'
          }, dirOverride) : dirOverride,
          autoContainerWidth: true,
          height: height,
          width: width,
          isScrolling: isScrolling,
          onScroll: function onScroll(e) {
            onChildScroll(e);

            _this3.scrollEndHandler(e);
          },
          scrollTop: scrollTop,
          rowCount: rowCount,
          estimatedRowSize: _this3.defaultItemHeight(),
          rowHeight: _this3._cache.rowHeight,
          rowRenderer: _this3.renderItem,
          overscanRowCount: _this3._bufferSize // ensure rerendering
          ,
          noop: function noop() {},
          scrollToIndex: !_this3.props.disableScrollToActive && _this3.state.needScrollToActive && _this3.state.activeIndex != null ? _this3.state.activeIndex + 1 : undefined,
          scrollToAlignment: "center",
          deferredMeasurementCache: _this3._cache,
          onRowsRendered: _this3.checkOverflow
        }));
      });
    }
  }, {
    key: "renderVirtualized",
    value: function renderVirtualized(maxHeight, rowCount) {
      var _this4 = this;

      if (maxHeight) {
        return this.renderVirtualizedInner({
          height: maxHeight,
          maxHeight: maxHeight,
          rowCount: rowCount
        });
      }

      return /*#__PURE__*/React.createElement(WindowScroller, null, function (props) {
        return _this4.renderVirtualizedInner(_objectSpread2(_objectSpread2({}, props), {}, {
          rowCount: rowCount,
          autoHeight: true
        }));
      });
    }
  }, {
    key: "renderSimple",
    value: function renderSimple(maxHeight, rowCount) {
      var items = [];

      for (var index = 0; index < rowCount; index++) {
        items.push(this.renderItem({
          index: index,
          isScrolling: this.state.scrolling
        }));
      }

      return /*#__PURE__*/React.createElement("div", {
        className: classNames('ring-list__i', styles.simpleInner),
        onScroll: this.scrollHandler,
        onMouseMove: this.mouseHandler
      }, /*#__PURE__*/React.createElement("div", {
        "aria-label": this.props.ariaLabel,
        style: maxHeight ? {
          maxHeight: this.getVisibleListHeight(this.props)
        } : null
      }, items));
    }
  }, {
    key: "render",

    /** @override */
    value: function render() {
      var hint = this.getSelected() && this.props.hintOnSelection || this.props.hint;
      var fadeStyles = hint ? {
        bottom: Dimension.ITEM_HEIGHT
      } : null;
      var rowCount = this.props.data.length + 2;
      var maxHeight = this.props.maxHeight && this.getVisibleListHeight(this.props);
      var classes = classNames(styles.list, this.props.className);
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ActiveItemContext.Updater, {
        value: this.getId(this.state.activeItem),
        skipUpdate: this.props.hidden || !isActivatable(this.state.activeItem)
      }), /*#__PURE__*/React.createElement("div", {
        id: this.props.id,
        ref: this.containerRef,
        className: classes,
        onMouseOut: this.props.onMouseOut,
        onBlur: this.props.onMouseOut,
        onMouseLeave: this.clearSelected,
        "data-test": "ring-list"
      }, this.props.shortcuts && /*#__PURE__*/React.createElement(Shortcuts, {
        map: this.shortcutsMap,
        scope: this.shortcutsScope
      }), this.props.renderOptimization ? this.renderVirtualized(maxHeight, rowCount) : this.renderSimple(maxHeight, rowCount), this.state.hasOverflow && !this.state.scrolledToBottom && /*#__PURE__*/React.createElement("div", {
        className: styles.fade,
        style: fadeStyles
      }), hint && /*#__PURE__*/React.createElement(ListHint, {
        label: hint
      })));
    }
  }, {
    key: "inner",
    get: function get() {
      if (!this._inner) {
        this._inner = this.container && this.container.querySelector('.ring-list__i');
      }

      return this._inner;
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var prevActiveIndex = prevState.prevActiveIndex,
          prevData = prevState.prevData,
          activeItem = prevState.activeItem;
      var data = nextProps.data,
          activeIndex = nextProps.activeIndex,
          restoreActiveIndex = nextProps.restoreActiveIndex;
      var nextState = {
        prevActiveIndex: activeIndex,
        prevData: data
      };

      if (data !== prevData) {
        Object.assign(nextState, {
          activeIndex: null,
          activeItem: null
        });
      }

      if (activeIndex != null && activeIndex !== prevActiveIndex && data[activeIndex] != null) {
        Object.assign(nextState, {
          activeIndex: activeIndex,
          activeItem: data[activeIndex],
          needScrollToActive: true
        });
      } else if (data !== prevData && restoreActiveIndex && activeItem != null && activeItem.key != null) {
        // Restore active index if there is an item with the same "key" property
        var index = data.findIndex(function (item) {
          return item.key === activeItem.key;
        });

        if (index >= 0) {
          Object.assign(nextState, {
            activeIndex: index,
            activeItem: data[index]
          });
        }
      }

      if (activeIndex == null && prevState.activeIndex == null && shouldActivateFirstItem(nextProps)) {
        var firstActivatableIndex = data.findIndex(isActivatable);

        if (firstActivatableIndex >= 0) {
          Object.assign(nextState, {
            activeIndex: firstActivatableIndex,
            activeItem: data[firstActivatableIndex],
            needScrollToActive: true
          });
        }
      }

      return nextState;
    }
  }]);

  return List;
}(Component);

_defineProperty(List, "propTypes", {
  id: PropTypes.string,
  className: PropTypes.string,
  hint: PropTypes.node,
  hintOnSelection: PropTypes.string,
  data: PropTypes.array,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  activeIndex: PropTypes.number,
  restoreActiveIndex: PropTypes.bool,
  activateSingleItem: PropTypes.bool,
  activateFirstItem: PropTypes.bool,
  shortcuts: PropTypes.bool,
  onMouseOut: PropTypes.func,
  onSelect: PropTypes.func,
  onScrollToBottom: PropTypes.func,
  onResize: PropTypes.func,
  useMouseUp: PropTypes.bool,
  visible: PropTypes.bool,
  renderOptimization: PropTypes.bool,
  disableMoveOverflow: PropTypes.bool,
  disableMoveDownOverflow: PropTypes.bool,
  compact: PropTypes.bool,
  disableScrollToActive: PropTypes.bool,
  hidden: PropTypes.bool,
  ariaLabel: PropTypes.string
});

_defineProperty(List, "defaultProps", {
  data: [],
  restoreActiveIndex: false,
  // restore active item using its "key" property
  activateSingleItem: false,
  // if there is only one item, activate it
  activateFirstItem: false,
  // if there no active items, activate the first one
  onMouseOut: noop,
  onSelect: noop,
  onScrollToBottom: noop,
  onResize: noop,
  shortcuts: false,
  renderOptimization: true,
  disableMoveDownOverflow: false,
  ariaLabel: 'List'
});

_defineProperty(List, "isItemType", isItemType);

_defineProperty(List, "ListHint", ListHint);

_defineProperty(List, "ListProps", {
  Type: Type,
  Dimension: Dimension
});

export { ActiveItemContext as A, List as L, getEventKey as g };
