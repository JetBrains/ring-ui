import { d as _defineProperty, _ as _inherits, a as _createSuper, b as _classCallCheck, g as _assertThisInitialized, c as _createClass, i as _objectSpread2 } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { f as focusSensorHOC, d as disableHoverHOC, s as selectionShortcutsHOC } from './disable-hover-hoc-7059240f.js';
import { g as getUID } from './get-uid-bf3ab014.js';
import Shortcuts from './shortcuts.js';
import Loader from './loader.js';
import chevronRightIcon from '@jetbrains/icons/chevron-right';
import chevronDownIcon from '@jetbrains/icons/chevron-down';
import Link from './link.js';
import Text from './text.js';
import LoaderInline from './loader-inline.js';
import { B as Button } from './button-c0bc1992.js';
import Checkbox from './checkbox.js';
import styleInject from 'style-inject';
import 'combokeys';
import './sniffer-c9d1f40e.js';
import 'sniffr';
import './data-tests-1a367745.js';
import './dom-0ae85140.js';
import 'focus-visible';
import './memoize-ad2c954c.js';
import './clickableLink-3fc5662b.js';
import './theme-9a053da9.js';
import 'conic-gradient';
import '@jetbrains/icons/chevron-10px';
import './icon.js';
import 'util-deprecate';
import '@jetbrains/icons/checkmark';
import '@jetbrains/icons/remove-10px';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */@import \"../global/variables.css\";.table_tableWrapper__2G-mN {\n  position: relative;\n}.table_table__XyHHk {\n  width: 100%;\n\n  border-spacing: 0;\n}.table_userSelectNone__20qeC {\n  user-select: none;\n}.table_headerCell__LjAPm {\n\n  box-sizing: border-box;\n  height: 24px;\n  padding-right: 40px;\n\n  text-align: left;\n  white-space: nowrap;\n\n  color: var(--ring-secondary-color);\n\n  font-weight: 200;\n}.table_headerCell__LjAPm:first-child {\n  padding-left: 32px;\n}.table_headerCell__LjAPm:last-child {\n  width: 100%;\n  padding-right: 32px;\n}.table_headerCell__LjAPm:first-child:only-child {\n  width: initial;\n  max-width: none;\n}.table_headerCell__LjAPm.table_headerCellSorted__LTUaM {\n  font-weight: 500;\n}.table_headerCell__LjAPm.table_headerCellSortable__jAig7 {\n  cursor: pointer;\n}.table_headerCell__LjAPm .table_sorter__FnDpo {\n  position: absolute;\n\n  display: none;\n\n  margin-left: 6px;\n\n  user-select: none;\n}.table_headerCell__LjAPm.table_headerCellSortable__jAig7 .table_sorter__FnDpo {\n  display: inline-block;\n}.table_sortedUp__3d1dE .table_icon__21Sbt {\n  transform: rotate(180deg);\n  transform-origin: center 53%;\n}.table_caption__2ahih {\n  padding-top: 8px;\n  padding-bottom: 6px;\n\n  text-transform: capitalize;\n\n  color: var(--ring-text-color);\n  border-bottom: none;\n\n  font-size: var(--ring-font-size);\n  font-weight: bold;\n  line-height: var(--ring-line-height-lower);\n}.table_tableHead__2Thy0::after {\n  position: absolute;\n\n  width: 100%;\n\n  height: 1px;\n\n  content: \"\";\n\n  background-color: var(--ring-line-color);\n}.table_subHeaderFixed__1E8Sk::after {\n  position: absolute;\n  top: 24px;\n\n  height: 1px;\n\n  content: \"\";\n\n  background-color: var(--ring-line-color);\n}.table_subHeader__3mgg3::after {\n  right: 32px;\n  left: 32px;\n}.table_subHeaderFixed__1E8Sk {\n  position: fixed;\n  z-index: var(--ring-fixed-z-index);\n  top: 0;\n\n  opacity: 0.9;\n  background-color: var(--ring-content-background-color);\n}.table_subHeaderFixed__1E8Sk::after {\n  right: 0;\n  left: 0;\n}.table_row__rjKsp {\n  outline: none;\n\n  line-height: 30px;\n}@nest .table:not(.disabledHover) &:hover .row {\n  background-color: var(--ring-hover-background-color);\n}.table_rowSelected__DtGaH {\n  background-color: var(--ring-selected-background-color);\n}.table_rowFocused__1Smxj {\n  background-color: var(--ring-hover-background-color);\n}/* stylelint-disable-next-line selector-max-specificity */.table_rowFocused__1Smxj .table_cell__18kkQ:nth-child(1) {\n  box-shadow: inset 2px 0 var(--ring-main-color);\n}.table_loadingOverlay__3sLvt {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n\n  display: flex;\n  align-items: center;\n  justify-content: center;\n\n  background-color: rgba(255, 255, 255, 0.5);\n}.table_cell__18kkQ {\n\n  box-sizing: content-box;\n\n  min-width: 0;\n\n  height: 32px;\n  padding: 0;\n  padding-right: 40px;\n\n  color: var(--ring-text-color);\n}.table_cell__18kkQ:first-child {\n  padding-left: 32px;\n}.table_cell__18kkQ:last-child {\n  width: 100%;\n\n  /* Markup hack, allows cell to have content which is wider than cell and collapses it */\n\n  max-width: 0;\n  padding-right: 32px;\n}.table_cell__18kkQ:first-child {\n  min-width: 296px;\n  max-width: 616px;\n}.table_cell__18kkQ:first-child:only-child {\n  width: initial;\n  max-width: none;\n}.table_cellUnlimited__2TvCG {\n  width: 100%;\n}.table_cellRight__1XajV {\n  text-align: right;\n}.table_metaColumn__3GhUJ {\n  position: relative;\n\n  float: left;\n\n  height: 16px;\n  padding-right: 2px;\n}.table_metaColumn__3GhUJ.table_headerMetaColumn__prbWn {\n  padding-top: 1px;\n}.table_dragHandle__130T3 {\n  top: -3px;\n  left: -16px;\n\n  cursor: grab;\n\n  opacity: 0;\n}/* override button */.table_dragHandle__130T3.table_dragHandle__130T3 {\n  position: absolute;\n\n  height: 35px;\n  padding: 0;\n}.table_dragHandle__130T3.table_visibleDragHandle__29bBy,\n.table_row__rjKsp:hover .table_dragHandle__130T3 {\n  opacity: 1;\n}.table_rowCollapseExpandButton__2w0xO {\n  padding-right: 4px;\n  padding-left: 7px;\n}.table_draggingRow__2nHVB {\n  z-index: var(--ring-overlay-z-index);\n\n  background-color: var(--ring-hover-background-color);\n}.table_draggingRow__2nHVB .table_dragHandle__130T3 {\n  cursor: grabbing;\n\n  opacity: 1;\n}.table_draggingRow__2nHVB .table_dragHandle__130T3 svg {\n  color: var(--ring-main-color);\n}.table_tableMessage__3_hQS {\n  padding: calc(var(--ring-unit)*2) calc(var(--ring-unit)*4);\n\n  color: var(--ring-secondary-color);\n}\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.data-list_dataListWrapper__2vJDZ {\n  position: relative;\n}\n\n.data-list_dataList__3jHcS {\n  margin: 0;\n  padding: 0;\n\n  list-style: none;\n}\n\n.data-list_itemContent__1RMxZ {\n  padding: 0;\n\n  list-style: none;\n}\n\n.data-list_title__JGcx7 {\n  display: flex;\n  align-items: center;\n\n  box-sizing: content-box;\n  height: 32px;\n  padding: 0 40px 2px 0;\n\n  outline: none\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.data-list_dataList__3jHcS:not(.data-list_disabledHover__o7Ztn) .data-list_title__JGcx7:hover {\n    background-color: #ebf6ff;\n    background-color: var(--ring-hover-background-color)\n}}\n\n.data-list_title__JGcx7.data-list_titleSelected__Ze0Dk {\n    background-color: #d4edff;\n    background-color: var(--ring-selected-background-color);\n  }\n\n.data-list_title__JGcx7.data-list_titleFocused__1VIQG {\n    background-color: #ebf6ff;\n    background-color: var(--ring-hover-background-color);\n    box-shadow: inset 2px 0 #008eff;\n    box-shadow: inset 2px 0 var(--ring-main-color);\n  }\n\n.data-list_showMore__3X3Ac {\n  padding: 4px 60px;\n\n  color: #737577;\n\n  color: var(--ring-secondary-color);\n  outline: none;\n\n  font-size: 12px;\n}\n\n.data-list_boxes__3h6mT {\n  display: flex;\n\n  min-width: 24px;\n}\n\n.data-list_checkboxBox__3ktzd {\n  width: 24px;\n}\n\n.data-list_collapseButton__1Z_dO {\n  top: 1px;\n  left: -5px;\n\n  height: auto;\n  padding: 0 5px;\n\n  line-height: inherit;\n}\n\n.data-list_collapseIcon__1WWkx.data-list_collapseIcon__1WWkx {\n  color: #999;\n  color: var(--ring-icon-secondary-color);\n}\n\n.data-list_loadingOverlay__3_5rq {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n\n  display: flex;\n  align-items: center;\n  justify-content: center;\n\n  background-color: rgba(255, 255, 255, 0.5);\n}\n\n.data-list_showMoreLoader__2MYWi {\n  top: 1px;\n  left: 8px;\n}\n";
var styles = {"unit":"8px","height":"calc(4 * 8px)","compensate":"2px","dataListWrapper":"data-list_dataListWrapper__2vJDZ","dataList":"data-list_dataList__3jHcS","itemContent":"data-list_itemContent__1RMxZ","title":"data-list_title__JGcx7","disabledHover":"data-list_disabledHover__o7Ztn","titleSelected":"data-list_titleSelected__Ze0Dk","titleFocused":"data-list_titleFocused__1VIQG","showMore":"data-list_showMore__3X3Ac","boxes":"data-list_boxes__3h6mT","checkboxBox":"data-list_checkboxBox__3ktzd","collapseButton":"data-list_collapseButton__1Z_dO","collapseIcon":"data-list_collapseIcon__1WWkx","loadingOverlay":"data-list_loadingOverlay__3_5rq","showMoreLoader":"data-list_showMoreLoader__2MYWi"};
styleInject(css_248z);

var Title = /*#__PURE__*/function (_PureComponent) {
  _inherits(Title, _PureComponent);

  var _super = _createSuper(Title);

  function Title() {
    var _this;

    _classCallCheck(this, Title);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "id", getUID('data-list-title'));

    _defineProperty(_assertThisInitialized(_this), "onCheckboxFocus", function () {
      _this.props.onFocusRestore();
    });

    _defineProperty(_assertThisInitialized(_this), "onCheckboxChange", function () {
      _this.toggleSelection();
    });

    return _this;
  }

  _createClass(Title, [{
    key: "toggleSelection",
    value: function toggleSelection() {
      var _this$props = this.props,
          selectable = _this$props.selectable,
          selected = _this$props.selected,
          onSelect = _this$props.onSelect;

      if (selectable) {
        onSelect(!selected);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props2 = this.props,
          className = _this$props2.className,
          title = _this$props2.title,
          offset = _this$props2.offset,
          showFocus = _this$props2.showFocus,
          innerRef = _this$props2.innerRef,
          selectable = _this$props2.selectable,
          selected = _this$props2.selected,
          collapserExpander = _this$props2.collapserExpander;
      var classes = classNames(className, (_classNames = {}, _defineProperty(_classNames, styles.title, true), _defineProperty(_classNames, styles.titleFocused, showFocus), _defineProperty(_classNames, styles.titleSelected, selected), _classNames));
      return /*#__PURE__*/React.createElement("div", {
        id: this.id,
        className: classes,
        style: {
          paddingLeft: offset
        },
        ref: innerRef
      }, /*#__PURE__*/React.createElement("div", {
        className: styles.boxes
      }, selectable && /*#__PURE__*/React.createElement("div", {
        className: styles.checkboxBox
      }, /*#__PURE__*/React.createElement(Checkbox, {
        "aria-labelledby": this.id,
        className: showFocus ? 'ring-checkbox_focus' : '',
        checked: selected,
        onFocus: this.onCheckboxFocus,
        onChange: this.onCheckboxChange,
        tabIndex: "-1"
      })), collapserExpander), title);
    }
  }]);

  return Title;
}(PureComponent);

_defineProperty(Title, "propTypes", {
  className: PropTypes.string,
  title: PropTypes.node,
  offset: PropTypes.number,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  showFocus: PropTypes.bool,
  collapserExpander: PropTypes.node,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func]),
  // focusSensorHOC
  onFocusRestore: PropTypes.func
});

_defineProperty(Title, "defaultProps", {
  selectable: false,
  selected: false,
  showFocus: false
});

var Title$1 = focusSensorHOC(Title);

var moreLessButtonStates = {
  UNUSED: 0,
  MORE: 1,
  MORE_LOADING: 2,
  LESS: 3
};
var ITEM_LEFT_OFFSET = 32;
var LIST_LEFT_OFFSET = 24;

var Item = /*#__PURE__*/function (_PureComponent) {
  _inherits(Item, _PureComponent);

  var _super = _createSuper(Item);

  function Item() {
    var _this;

    _classCallCheck(this, Item);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "onShowMore", function () {
      var _this$props = _this.props,
          onItemMoreLess = _this$props.onItemMoreLess,
          item = _this$props.item;
      onItemMoreLess(item, true);
    });

    _defineProperty(_assertThisInitialized(_this), "onShowLess", function () {
      var _this$props2 = _this.props,
          onItemMoreLess = _this$props2.onItemMoreLess,
          item = _this$props2.item;
      onItemMoreLess(item, false);
    });

    _defineProperty(_assertThisInitialized(_this), "onFocus", function () {
      var _this$props3 = _this.props,
          onFocus = _this$props3.onFocus,
          item = _this$props3.item;
      onFocus(item);
    });

    _defineProperty(_assertThisInitialized(_this), "onSelect", function (selected) {
      var _this$props4 = _this.props,
          onSelect = _this$props4.onSelect,
          item = _this$props4.item;
      onSelect(item, selected);
    });

    _defineProperty(_assertThisInitialized(_this), "renderItem", function (model, parentShift) {
      var _this$props5 = _this.props,
          onFocus = _this$props5.onFocus,
          onSelect = _this$props5.onSelect,
          selection = _this$props5.selection,
          level = _this$props5.level,
          itemFormatter = _this$props5.itemFormatter;
      var item = itemFormatter(model);
      return /*#__PURE__*/React.createElement(Item, {
        key: item.key || item.id,
        item: model,
        title: item.title,
        items: item.items,
        level: level + 1,
        parentShift: parentShift,
        itemFormatter: itemFormatter,
        collapsible: item.collapsible,
        collapsed: item.collapsed,
        onCollapse: item.onCollapse,
        onExpand: item.onExpand,
        focused: selection.isFocused(model),
        showFocus: selection.isFocused(model),
        onFocus: onFocus,
        selection: selection,
        selectable: item.selectable,
        selected: selection.isSelected(model),
        onSelect: onSelect
      });
    });

    return _this;
  }

  _createClass(Item, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props6 = this.props,
          title = _this$props6.title,
          items = _this$props6.items,
          showMoreLessButton = _this$props6.showMoreLessButton,
          level = _this$props6.level,
          parentShift = _this$props6.parentShift,
          showFocus = _this$props6.showFocus,
          selectable = _this$props6.selectable,
          selected = _this$props6.selected,
          collapsible = _this$props6.collapsible,
          collapsed = _this$props6.collapsed,
          onCollapse = _this$props6.onCollapse,
          onExpand = _this$props6.onExpand;
      var moreLessButton;

      if (showMoreLessButton === moreLessButtonStates.MORE || showMoreLessButton === moreLessButtonStates.MORE_LOADING) {
        moreLessButton = /*#__PURE__*/React.createElement(Text, {
          info: true
        }, /*#__PURE__*/React.createElement(Link, {
          inherit: true,
          pseudo: true,
          onClick: this.onShowMore
        }, 'Show more'), showMoreLessButton === moreLessButtonStates.MORE_LOADING && /*#__PURE__*/React.createElement(LoaderInline, {
          className: styles.showMoreLoader
        }));
      } else if (showMoreLessButton === moreLessButtonStates.LESS) {
        moreLessButton = /*#__PURE__*/React.createElement(Text, {
          info: true
        }, /*#__PURE__*/React.createElement(Link, {
          inherit: true,
          pseudo: true,
          onClick: this.onShowLess
        }, 'Show less'));
      }

      var collapserExpander = null;

      if (collapsible) {
        if (collapsed) {
          collapserExpander = /*#__PURE__*/React.createElement(Button, {
            title: "Expand",
            onClick: onExpand,
            icon: chevronRightIcon,
            className: styles.collapseButton,
            iconClassName: styles.collapseIcon,
            "data-test": "ring-data-list-expand"
          });
        } else {
          collapserExpander = /*#__PURE__*/React.createElement(Button, {
            title: "Collapse",
            onClick: onCollapse,
            icon: chevronDownIcon,
            className: styles.collapseButton,
            iconClassName: styles.collapseIcon,
            "data-test": "ring-data-list-collapse"
          });
        }
      }

      var itemIsEmpty = !items.length || collapsible && collapsed;
      var offset = level * LIST_LEFT_OFFSET + ITEM_LEFT_OFFSET + parentShift;
      return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Title$1, {
        title: title,
        focused: showFocus,
        showFocus: showFocus,
        selectable: selectable,
        selected: selected,
        collapserExpander: collapserExpander,
        onFocus: this.onFocus,
        onSelect: this.onSelect,
        offset: offset
      }), !itemIsEmpty ? /*#__PURE__*/React.createElement("ul", {
        className: styles.itemContent
      }, items.map(function (model) {
        return _this2.renderItem(model, parentShift);
      }), showMoreLessButton !== moreLessButtonStates.UNUSED ? /*#__PURE__*/React.createElement("li", {
        className: styles.showMore
      }, moreLessButton) : null) : null);
    }
  }]);

  return Item;
}(PureComponent);

_defineProperty(Item, "propTypes", {
  item: PropTypes.object,
  title: PropTypes.node,
  items: PropTypes.array,
  className: PropTypes.string,
  level: PropTypes.number,
  parentShift: PropTypes.number,
  itemFormatter: PropTypes.func,
  collapsible: PropTypes.bool,
  collapsed: PropTypes.bool,
  onCollapse: PropTypes.func,
  onExpand: PropTypes.func,
  showFocus: PropTypes.bool,
  onFocus: PropTypes.func,
  selection: PropTypes.object,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  showMoreLessButton: PropTypes.number,
  onItemMoreLess: PropTypes.func
});

_defineProperty(Item, "defaultProps", {
  items: [],
  level: 0,
  parentShift: 0,
  showMoreLessButton: moreLessButtonStates.UNUSED,
  onItemMoreLess: function onItemMoreLess() {}
});

var DataList = /*#__PURE__*/function (_PureComponent) {
  _inherits(DataList, _PureComponent);

  var _super = _createSuper(DataList);

  function DataList() {
    var _this;

    _classCallCheck(this, DataList);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "shortcutsScope", getUID('ring-data-list-'));

    _defineProperty(_assertThisInitialized(_this), "onItemFocus", function (item) {
      var _this$props = _this.props,
          selection = _this$props.selection,
          onSelect = _this$props.onSelect;
      onSelect(selection.focus(item));
    });

    _defineProperty(_assertThisInitialized(_this), "onItemSelect", function (item, selected) {
      var _this$props2 = _this.props,
          selection = _this$props2.selection,
          onSelect = _this$props2.onSelect;

      if (selected) {
        onSelect(selection.select(item));
      } else {
        onSelect(selection.deselect(item));
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onEqualPress", function () {
      var _this$props3 = _this.props,
          selection = _this$props3.selection,
          itemFormatter = _this$props3.itemFormatter;
      var item = itemFormatter(selection.getFocused());

      if (item.collapsed) {
        item.onExpand();
      } else {
        item.onCollapse();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "shortcutsMap", {
      '=': _this.onEqualPress
    });

    return _this;
  }

  _createClass(DataList, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props4 = this.props,
          data = _this$props4.data,
          selection = _this$props4.selection,
          onSelect = _this$props4.onSelect,
          selectable = _this$props4.selectable;

      if (data !== prevProps.data && !prevProps.remoteSelection) {
        onSelect(selection.cloneWith({
          data: data
        }));
      }

      if (!selectable && prevProps.selectable) {
        onSelect(selection.resetSelection());
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames,
          _this2 = this;

      var _this$props5 = this.props,
          data = _this$props5.data,
          className = _this$props5.className,
          loading = _this$props5.loading,
          selection = _this$props5.selection,
          disabledHover = _this$props5.disabledHover,
          itemFormatter = _this$props5.itemFormatter,
          focused = _this$props5.focused,
          innerRef = _this$props5.innerRef;

      var shortcutsMap = _objectSpread2(_objectSpread2({}, this.shortcutsMap), this.props.shortcutsMap);

      var classes = classNames(className, (_classNames = {}, _defineProperty(_classNames, styles.dataList, true), _defineProperty(_classNames, styles.disabledHover, disabledHover), _defineProperty(_classNames, styles.multiSelection, selection.getSelected().size > 0), _classNames));
      return /*#__PURE__*/React.createElement("div", {
        className: styles.dataListWrapper,
        "data-test": "ring-data-list",
        ref: innerRef
      }, focused && /*#__PURE__*/React.createElement(Shortcuts, {
        map: shortcutsMap,
        scope: this.shortcutsScope
      }), /*#__PURE__*/React.createElement("ul", {
        className: classes
      }, data.map(function (model) {
        var item = itemFormatter(model);
        var id = item.id,
            key = item.key,
            title = item.title,
            items = item.items;

        var showMoreLessButton = _this2.props.itemMoreLessState(item);

        return /*#__PURE__*/React.createElement(Item, {
          key: key || id,
          item: model,
          title: title,
          items: items,
          itemFormatter: itemFormatter,
          collapsible: item.collapsible,
          collapsed: item.collapsed,
          onCollapse: item.onCollapse,
          onExpand: item.onExpand,
          focused: selection.isFocused(model),
          showFocus: selection.isFocused(model),
          onFocus: _this2.onItemFocus,
          selection: selection,
          selectable: item.selectable,
          selected: selection.isSelected(model),
          onSelect: _this2.onItemSelect,
          showMoreLessButton: showMoreLessButton,
          onItemMoreLess: _this2.props.onItemMoreLess
        });
      })), loading && /*#__PURE__*/React.createElement("div", {
        className: data.length > 0 ? styles.loadingOverlay : null
      }, /*#__PURE__*/React.createElement(Loader, null)));
    }
  }]);

  return DataList;
}(PureComponent);

_defineProperty(DataList, "propTypes", {
  className: PropTypes.string,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  focused: PropTypes.bool,
  disabledHover: PropTypes.bool,
  selection: PropTypes.object,
  selectable: PropTypes.bool,
  shortcutsMap: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func]),
  itemFormatter: PropTypes.func.isRequired,
  onItemMoreLess: PropTypes.func,
  itemMoreLessState: PropTypes.func,
  onSelect: PropTypes.func,
  remoteSelection: PropTypes.bool
});

_defineProperty(DataList, "defaultProps", {
  loading: false,
  onItemMoreLess: function onItemMoreLess() {},
  itemMoreLessState: function itemMoreLessState() {
    return moreLessButtonStates.UNUSED;
  },
  remoteSelection: false
});

var dataList = disableHoverHOC(selectionShortcutsHOC(focusSensorHOC(DataList)));

export default dataList;
