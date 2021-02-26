import { d as _defineProperty, _ as _inherits, a as _createSuper, b as _classCallCheck, g as _assertThisInitialized, c as _createClass, e as _objectWithoutProperties, f as _extends, k as _toConsumableArray, i as _objectSpread2 } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { arrayMove, List } from 'react-movable';
import { c as composeRefs, f as focusSensorHOC, d as disableHoverHOC, s as selectionShortcutsHOC, S as Selection } from './disable-hover-hoc-7059240f.js';
import { g as getUID } from './get-uid-bf3ab014.js';
import Shortcuts from './shortcuts.js';
import Loader from './loader.js';
import { Waypoint } from 'react-waypoint';
import Checkbox from './checkbox.js';
import styleInject from 'style-inject';
import sortableIcon from '@jetbrains/icons/unsorted-10px';
import chevronDown from '@jetbrains/icons/chevron-10px';
import Icon from './icon.js';
import { j as joinDataTestAttributes } from './data-tests-1a367745.js';
import chevronRightIcon from '@jetbrains/icons/chevron-right';
import chevronDownIcon from '@jetbrains/icons/chevron-down';
import dragIcon from '@jetbrains/icons/drag';
import { B as Button } from './button-c0bc1992.js';
import Tooltip from './tooltip.js';
import 'combokeys';
import './sniffer-c9d1f40e.js';
import 'sniffr';
import './dom-0ae85140.js';
import '@jetbrains/icons/checkmark';
import '@jetbrains/icons/remove-10px';
import 'util-deprecate';
import './memoize-ad2c954c.js';
import 'focus-visible';
import './theme-9a053da9.js';
import './clickableLink-3fc5662b.js';
import './popup-442f4003.js';
import 'react-dom';
import './schedule-raf-edeb21db.js';
import './tab-trap.js';
import './popup.target-9daf0591.js';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.table_row__rjKsp:hover .table_dragHandle__130T3 {\n  opacity: 1;\n}}\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.table_tableWrapper__2G-mN {\n  position: relative;\n}\n\n.table_table__XyHHk {\n  width: 100%;\n\n  border-spacing: 0;\n}\n\n.table_userSelectNone__20qeC {\n  -webkit-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n.table_headerCell__LjAPm {\n\n  box-sizing: border-box;\n  height: 24px;\n  padding-right: 40px;\n\n  text-align: left;\n  white-space: nowrap;\n\n  color: #737577;\n\n  color: var(--ring-secondary-color);\n\n  font-weight: 200;\n}\n\n.table_headerCell__LjAPm:first-child {\n  padding-left: 32px;\n}\n\n.table_headerCell__LjAPm:last-child {\n  width: 100%;\n  padding-right: 32px;\n}\n\n.table_headerCell__LjAPm:first-child:only-child {\n  width: auto;\n  width: initial;\n  max-width: none;\n}\n\n.table_headerCell__LjAPm.table_headerCellSorted__LTUaM {\n  font-weight: 500;\n}\n\n.table_headerCell__LjAPm.table_headerCellSortable__jAig7 {\n  cursor: pointer;\n}\n\n.table_headerCell__LjAPm .table_sorter__FnDpo {\n  position: absolute;\n\n  display: none;\n\n  margin-left: 6px;\n\n  -webkit-user-select: none;\n\n      -ms-user-select: none;\n\n          user-select: none;\n}\n\n.table_headerCell__LjAPm.table_headerCellSortable__jAig7 .table_sorter__FnDpo {\n  display: inline-block;\n}\n\n.table_sortedUp__3d1dE .table_icon__21Sbt {\n  transform: rotate(180deg);\n  transform-origin: center 53%;\n}\n\n.table_caption__2ahih {\n  padding-top: 8px;\n  padding-bottom: 6px;\n\n  text-transform: capitalize;\n\n  color: #1f2326;\n\n  color: var(--ring-text-color);\n  border-bottom: none;\n\n  font-size: 13px;\n\n  font-size: var(--ring-font-size);\n  font-weight: bold;\n  line-height: 18px;\n  line-height: var(--ring-line-height-lower);\n}\n\n.table_tableHead__2Thy0::after {\n  position: absolute;\n\n  width: 100%;\n\n  height: 1px;\n\n  content: \"\";\n\n  background-color: #dfe5eb;\n\n  background-color: var(--ring-line-color);\n}\n\n.table_subHeaderFixed__1E8Sk::after {\n  position: absolute;\n  top: 24px;\n\n  height: 1px;\n\n  content: \"\";\n\n  background-color: #dfe5eb;\n\n  background-color: var(--ring-line-color);\n}\n\n.table_subHeader__3mgg3::after {\n  right: 32px;\n  left: 32px;\n}\n\n.table_subHeaderFixed__1E8Sk {\n  position: fixed;\n  z-index: 1;\n  z-index: var(--ring-fixed-z-index);\n  top: 0;\n\n  opacity: 0.9;\n  background-color: #fff;\n  background-color: var(--ring-content-background-color);\n}\n\n.table_subHeaderFixed__1E8Sk::after {\n  right: 0;\n  left: 0;\n}\n\n.table_row__rjKsp {\n  outline: none;\n\n  line-height: 30px;\n}\n\n@nest .table:not(.disabledHover) &:hover .row {\n  background-color: #ebf6ff;\n  background-color: var(--ring-hover-background-color);\n}\n\n.table_rowSelected__DtGaH {\n  background-color: #d4edff;\n  background-color: var(--ring-selected-background-color);\n}\n\n.table_rowFocused__1Smxj {\n  background-color: #ebf6ff;\n  background-color: var(--ring-hover-background-color);\n}\n\n/* stylelint-disable-next-line selector-max-specificity */\n\n.table_rowFocused__1Smxj .table_cell__18kkQ:nth-child(1) {\n  box-shadow: inset 2px 0 #008eff;\n  box-shadow: inset 2px 0 var(--ring-main-color);\n}\n\n.table_loadingOverlay__3sLvt {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n\n  display: flex;\n  align-items: center;\n  justify-content: center;\n\n  background-color: rgba(255, 255, 255, 0.5);\n}\n\n.table_cell__18kkQ {\n\n  box-sizing: content-box;\n\n  min-width: 0;\n\n  height: 32px;\n  padding: 0;\n  padding-right: 40px;\n\n  color: #1f2326;\n\n  color: var(--ring-text-color);\n}\n\n.table_cell__18kkQ:first-child {\n  padding-left: 32px;\n}\n\n.table_cell__18kkQ:last-child {\n  width: 100%;\n\n  /* Markup hack, allows cell to have content which is wider than cell and collapses it */\n\n  max-width: 0;\n  padding-right: 32px;\n}\n\n.table_cell__18kkQ:first-child {\n  min-width: 296px;\n  max-width: 616px;\n}\n\n.table_cell__18kkQ:first-child:only-child {\n  width: auto;\n  width: initial;\n  max-width: none;\n}\n\n.table_cellUnlimited__2TvCG {\n  width: 100%;\n}\n\n.table_cellRight__1XajV {\n  text-align: right;\n}\n\n.table_metaColumn__3GhUJ {\n  position: relative;\n\n  float: left;\n\n  height: 16px;\n  padding-right: 2px;\n}\n\n.table_metaColumn__3GhUJ.table_headerMetaColumn__prbWn {\n  padding-top: 1px;\n}\n\n.table_dragHandle__130T3 {\n  top: -3px;\n  left: -16px;\n\n  cursor: grab;\n\n  opacity: 0;\n}\n\n/* override button */\n\n.table_dragHandle__130T3.table_dragHandle__130T3 {\n  position: absolute;\n\n  height: 35px;\n  padding: 0;\n}\n\n.table_dragHandle__130T3.table_visibleDragHandle__29bBy {\n  opacity: 1;\n}\n\n.table_rowCollapseExpandButton__2w0xO {\n  padding-right: 4px;\n  padding-left: 7px;\n}\n\n.table_draggingRow__2nHVB {\n  z-index: 5;\n  z-index: var(--ring-overlay-z-index);\n\n  background-color: #ebf6ff;\n\n  background-color: var(--ring-hover-background-color);\n}\n\n.table_draggingRow__2nHVB .table_dragHandle__130T3 {\n  cursor: grabbing;\n\n  opacity: 1;\n}\n\n.table_draggingRow__2nHVB .table_dragHandle__130T3 svg {\n  color: #008eff;\n  color: var(--ring-main-color);\n}\n\n.table_tableMessage__3_hQS {\n  padding: 16px 32px;\n  padding: calc(var(--ring-unit)*2) calc(var(--ring-unit)*4);\n\n  color: #737577;\n\n  color: var(--ring-secondary-color);\n}\n";
var style = {"unit":"8px","height":"calc(4 * 8px)","compensate":"2px","compensated":"calc(calc(4 * 8px) - 2px)","top":"-3px","row":"table_row__rjKsp","dragHandle":"table_dragHandle__130T3","tableWrapper":"table_tableWrapper__2G-mN","table":"table_table__XyHHk","userSelectNone":"table_userSelectNone__20qeC","headerCell":"table_headerCell__LjAPm global_font-smaller-lower__33Wmu global_font-smaller__2YCID global_font-lower__11Bp7 global_font__2H0e4","headerCellSorted":"table_headerCellSorted__LTUaM","headerCellSortable":"table_headerCellSortable__jAig7","sorter":"table_sorter__FnDpo","sortedUp":"table_sortedUp__3d1dE","icon":"table_icon__21Sbt","caption":"table_caption__2ahih","tableHead":"table_tableHead__2Thy0","subHeaderFixed":"table_subHeaderFixed__1E8Sk","subHeader":"table_subHeader__3mgg3","rowSelected":"table_rowSelected__DtGaH","rowFocused":"table_rowFocused__1Smxj","cell":"table_cell__18kkQ global_ellipsis__xhH6M","loadingOverlay":"table_loadingOverlay__3sLvt","cellUnlimited":"table_cellUnlimited__2TvCG","cellRight":"table_cellRight__1XajV","metaColumn":"table_metaColumn__3GhUJ","headerMetaColumn":"table_headerMetaColumn__prbWn","visibleDragHandle":"table_visibleDragHandle__29bBy","rowCollapseExpandButton":"table_rowCollapseExpandButton__2w0xO","draggingRow":"table_draggingRow__2nHVB","tableMessage":"table_tableMessage__3_hQS"};
styleInject(css_248z);

var HeaderCell = /*#__PURE__*/function (_PureComponent) {
  _inherits(HeaderCell, _PureComponent);

  var _super = _createSuper(HeaderCell);

  function HeaderCell() {
    var _this;

    _classCallCheck(this, HeaderCell);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "onClick", function () {
      if (_this.sortable) {
        var _this$props = _this.props,
            column = _this$props.column,
            onSort = _this$props.onSort,
            sortOrder = _this$props.sortOrder;
        onSort({
          column: column,
          order: !(_this.sorted && sortOrder)
        });
      }
    });

    return _this;
  }

  _createClass(HeaderCell, [{
    key: "onChildrenClick",
    value: function onChildrenClick(e) {
      e.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props2 = this.props,
          className = _this$props2.className,
          column = _this$props2.column;
          _this$props2.onSort;
          var sortKey = _this$props2.sortKey,
          sortOrder = _this$props2.sortOrder,
          dataTest = _this$props2['data-test'],
          restProps = _objectWithoutProperties(_this$props2, ["className", "column", "onSort", "sortKey", "sortOrder", "data-test"]);

      this.sortable = column.sortable === true;
      this.sorted = sortKey === column.id;
      var glyph = this.sorted ? chevronDown : sortableIcon;
      var classes = classNames(className, column.headerClassName, (_classNames = {}, _defineProperty(_classNames, style.headerCell, true), _defineProperty(_classNames, style.headerCellSortable, this.sortable), _defineProperty(_classNames, style.headerCellSorted, this.sorted), _defineProperty(_classNames, style.sortedUp, sortOrder && this.sorted), _defineProperty(_classNames, style.cellRight, column.rightAlign), _classNames));
      return /*#__PURE__*/React.createElement("th", _extends({}, restProps, {
        className: classes,
        onClick: this.onClick,
        "data-test": joinDataTestAttributes('ring-table-header-cell', dataTest)
      }), /*#__PURE__*/React.createElement("span", {
        onClick: this.onChildrenClick,
        role: "presentation"
      }, this.props.children), column.getHeaderValue ? column.getHeaderValue() : column.title, this.sortable && /*#__PURE__*/React.createElement("span", {
        className: style.sorter
      }, /*#__PURE__*/React.createElement(Icon, {
        glyph: glyph,
        className: style.icon
      })));
    }
  }]);

  return HeaderCell;
}(PureComponent);

_defineProperty(HeaderCell, "propTypes", {
  children: PropTypes.any,
  className: PropTypes.string,
  column: PropTypes.object.isRequired,
  onSort: PropTypes.func,
  sortKey: PropTypes.string,
  sortOrder: PropTypes.bool,
  'data-test': PropTypes.string
});

_defineProperty(HeaderCell, "defaultProps", {
  onSort: function onSort() {}
});

var waypointChild = /*#__PURE__*/React.createElement("tr", {
  "data-test": "ring-table-header-row"
});

var Header = /*#__PURE__*/function (_PureComponent) {
  _inherits(Header, _PureComponent);

  var _super = _createSuper(Header);

  function Header() {
    var _this;

    _classCallCheck(this, Header);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      fixed: false,
      headerWidth: null,
      widths: []
    });

    _defineProperty(_assertThisInitialized(_this), "id", getUID('table-header-'));

    _defineProperty(_assertThisInitialized(_this), "onCheckboxFocus", function (event) {
      event.target.blur();
    });

    _defineProperty(_assertThisInitialized(_this), "storeColumnsRowNode", function (node) {
      if (node) {
        _this._columnsRowNode = node;

        _this.calculateColumnsWidths(node);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onScrollIn", function () {
      _this.calculateColumnsWidths(_this._columnsRowNode);

      _this.setState({
        fixed: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onScrollOut", function (_ref) {
      var currentPosition = _ref.currentPosition;

      if (currentPosition !== 'above') {
        return;
      }

      _this.calculateColumnsWidths(_this._columnsRowNode);

      _this.setState({
        fixed: true
      });
    });

    return _this;
  }

  _createClass(Header, [{
    key: "calculateColumnsWidths",
    value: function calculateColumnsWidths(columnsRowNode) {
      this.setState({
        headerWidth: columnsRowNode.clientWidth,
        widths: _toConsumableArray(columnsRowNode.childNodes).map(function (column) {
          return column.clientWidth;
        })
      });
    }
  }, {
    key: "createCells",
    value: function createCells() {
      var widths = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var _this$props = this.props,
          selectable = _this$props.selectable,
          draggable = _this$props.draggable,
          columns = _this$props.columns,
          checked = _this$props.checked,
          checkboxDisabled = _this$props.checkboxDisabled,
          onCheckboxChange = _this$props.onCheckboxChange,
          onSort = _this$props.onSort,
          sortKey = _this$props.sortKey,
          sortOrder = _this$props.sortOrder;
      var metaColumnClasses = classNames(style.metaColumn, style.headerMetaColumn);
      var metaColumn = /*#__PURE__*/React.createElement("div", {
        className: metaColumnClasses
      }, selectable && /*#__PURE__*/React.createElement(Checkbox, {
        "aria-labelledby": this.id,
        disabled: checkboxDisabled,
        checked: checked,
        onChange: onCheckboxChange,
        onFocus: this.onCheckboxFocus
      }));
      return columns.map(function (column, index) {
        var columnStyle = widths[index] ? {
          width: widths[index]
        } : null;
        var props = {
          column: column,
          onSort: onSort,
          sortKey: sortKey,
          sortOrder: sortOrder,
          style: columnStyle
        };
        return /*#__PURE__*/React.createElement(HeaderCell, _extends({
          key: column.id,
          "data-test": column.id
        }, props), index === 0 && (draggable || selectable) && metaColumn);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          caption = _this$props2.caption,
          sticky = _this$props2.sticky,
          topStickOffset = _this$props2.topStickOffset;
      var _this$state = this.state,
          fixed = _this$state.fixed,
          widths = _this$state.widths,
          headerWidth = _this$state.headerWidth;
      var regularCells = this.createCells();
      return /*#__PURE__*/React.createElement("thead", {
        id: this.id,
        "data-test": "ring-table-header",
        className: style.tableHead
      }, caption && /*#__PURE__*/React.createElement("tr", {
        "data-test": "ring-table-header-row"
      }, /*#__PURE__*/React.createElement("th", {
        className: classNames(style.headerCell, style.caption),
        colSpan: regularCells.length + 1,
        "data-test": "ring-table-header-cell"
      }, caption)), sticky && /*#__PURE__*/React.createElement(Waypoint, {
        topOffset: topStickOffset,
        onEnter: this.onScrollIn,
        onLeave: this.onScrollOut
      }, waypointChild), /*#__PURE__*/React.createElement("tr", {
        className: style.subHeader,
        ref: this.storeColumnsRowNode,
        "data-test": "ring-table-header-row"
      }, regularCells), fixed && sticky && /*#__PURE__*/React.createElement("tr", {
        className: style.subHeaderFixed,
        style: {
          width: headerWidth,
          top: topStickOffset
        },
        "data-test": "ring-table-header-row"
      }, this.createCells(widths)));
    }
  }]);

  return Header;
}(PureComponent);

_defineProperty(Header, "propTypes", {
  caption: PropTypes.string,
  selectable: PropTypes.bool,
  draggable: PropTypes.bool,
  checked: PropTypes.bool,
  checkboxDisabled: PropTypes.bool,
  sticky: PropTypes.bool,
  topStickOffset: PropTypes.string,
  onCheckboxChange: PropTypes.func,
  columns: PropTypes.array.isRequired,
  onSort: PropTypes.func,
  sortKey: PropTypes.string,
  sortOrder: PropTypes.bool
});

_defineProperty(Header, "defaultProps", {
  selectable: true,
  draggable: false,
  checked: true,
  sticky: true,
  topStickOffset: '0px',
  onSort: function onSort() {},
  onCheckboxChange: function onCheckboxChange() {},
  sortKey: 'id',
  sortOrder: true
});

var Cell = /*#__PURE__*/function (_PureComponent) {
  _inherits(Cell, _PureComponent);

  var _super = _createSuper(Cell);

  function Cell() {
    _classCallCheck(this, Cell);

    return _super.apply(this, arguments);
  }

  _createClass(Cell, [{
    key: "render",
    value: function render() {
      var classes = classNames(style.cell, this.props.className);
      return /*#__PURE__*/React.createElement("td", _extends({}, this.props, {
        className: classes,
        "data-test": joinDataTestAttributes('ring-table-cell', this.props['data-test'])
      }), this.props.children);
    }
  }]);

  return Cell;
}(PureComponent);

_defineProperty(Cell, "propTypes", {
  children: PropTypes.any,
  className: PropTypes.string,
  'data-test': PropTypes.string
});

var DragHandle = function DragHandle(_ref) {
  var alwaysShowDragHandle = _ref.alwaysShowDragHandle;
  var classes = classNames(style.dragHandle, _defineProperty({}, style.visibleDragHandle, alwaysShowDragHandle));
  return /*#__PURE__*/React.createElement(Button, {
    "data-movable-handle": true,
    title: "Drag",
    className: classes,
    icon: dragIcon
  });
};

DragHandle.propTypes = {
  alwaysShowDragHandle: PropTypes.bool
};

var Row = /*#__PURE__*/function (_PureComponent) {
  _inherits(Row, _PureComponent);

  var _super = _createSuper(Row);

  function Row() {
    var _this;

    _classCallCheck(this, Row);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "id", getUID('table-row-'));

    _defineProperty(_assertThisInitialized(_this), "onMouseEnter", function () {
      var _this$props = _this.props,
          item = _this$props.item,
          onHover = _this$props.onHover;
      onHover(item);
    });

    _defineProperty(_assertThisInitialized(_this), "onClick", function (e) {
      var item = _this.props.item;

      _this.props.onClick(item, e);

      if (e.shiftKey) {
        _this.toggleSelection();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onCheckboxFocus", function () {
      _this.props.onFocusRestore();
    });

    _defineProperty(_assertThisInitialized(_this), "onCheckboxChange", function () {
      _this.toggleSelection();
    });

    _defineProperty(_assertThisInitialized(_this), "onDoubleClick", function () {
      var item = _this.props.item;

      _this.props.onDoubleClick(item);
    });

    _defineProperty(_assertThisInitialized(_this), "rowRef", function (el) {
      _this.row = el;
    });

    return _this;
  }

  _createClass(Row, [{
    key: "toggleSelection",
    value: function toggleSelection() {
      var _this$props2 = this.props,
          selectable = _this$props2.selectable,
          selected = _this$props2.selected,
          onSelect = _this$props2.onSelect,
          item = _this$props2.item;

      if (selectable) {
        onSelect(item, !selected);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames2;

      var _this$props3 = this.props,
          item = _this$props3.item,
          columns = _this$props3.columns,
          selectable = _this$props3.selectable,
          selected = _this$props3.selected,
          showFocus = _this$props3.showFocus,
          draggable = _this$props3.draggable,
          alwaysShowDragHandle = _this$props3.alwaysShowDragHandle,
          level = _this$props3.level,
          collapsible = _this$props3.collapsible,
          parentCollapsible = _this$props3.parentCollapsible,
          collapsed = _this$props3.collapsed,
          onCollapse = _this$props3.onCollapse,
          onExpand = _this$props3.onExpand,
          showDisabledSelection = _this$props3.showDisabledSelection,
          checkboxTooltip = _this$props3.checkboxTooltip,
          innerRef = _this$props3.innerRef;
          _this$props3.focused;
          _this$props3.autofocus;
          _this$props3.onFocusReset;
          _this$props3.onFocusRestore;
          _this$props3.onHover;
          var className = _this$props3.className,
          dataTest = _this$props3['data-test'],
          restProps = _objectWithoutProperties(_this$props3, ["item", "columns", "selectable", "selected", "showFocus", "draggable", "alwaysShowDragHandle", "level", "collapsible", "parentCollapsible", "collapsed", "onCollapse", "onExpand", "showDisabledSelection", "checkboxTooltip", "innerRef", "focused", "autofocus", "onFocusReset", "onFocusRestore", "onHover", "className", "data-test"]);

      var classes = classNames(className, (_classNames2 = {}, _defineProperty(_classNames2, style.row, true), _defineProperty(_classNames2, style.rowFocused, showFocus), _defineProperty(_classNames2, style.rowSelected, selected), _classNames2));
      var testAttrs = {
        'data-test-focused': showFocus || undefined,
        'data-test-selected': selected || undefined
      };
      var metaColumnClasses = style.metaColumn;
      var SUBITEM_OFFSET = 30;
      var COLLAPSIBLE_PARENT_OFFSET = 20;
      var gap = level * SUBITEM_OFFSET + (parentCollapsible ? COLLAPSIBLE_PARENT_OFFSET : 0);
      var metaColumnStyle = {
        paddingLeft: "".concat(gap, "px")
      };
      var metaColumn = /*#__PURE__*/React.createElement("div", {
        className: metaColumnClasses,
        style: metaColumnStyle
      }, draggable && /*#__PURE__*/React.createElement(DragHandle, {
        alwaysShowDragHandle: alwaysShowDragHandle
      }), selectable && /*#__PURE__*/React.createElement(Tooltip, {
        title: checkboxTooltip
      }, /*#__PURE__*/React.createElement(Checkbox, {
        "aria-labelledby": this.id,
        className: showFocus ? 'ring-checkbox_focus' : '',
        checked: selected,
        onFocus: this.onCheckboxFocus,
        onChange: this.onCheckboxChange,
        tabIndex: "-1"
      })), !selectable && showDisabledSelection && /*#__PURE__*/React.createElement(Tooltip, {
        title: checkboxTooltip
      }, /*#__PURE__*/React.createElement(Checkbox, {
        "aria-labelledby": this.id,
        checked: selected,
        disabled: true
      })), collapsible && collapsed && /*#__PURE__*/React.createElement(Button, {
        className: style.rowCollapseExpandButton,
        icon: chevronRightIcon,
        onClick: function onClick() {
          return onExpand(item);
        }
      }), collapsible && !collapsed && /*#__PURE__*/React.createElement(Button, {
        className: style.rowCollapseExpandButton,
        icon: chevronDownIcon,
        onClick: function onClick() {
          return onCollapse(item);
        }
      }));
      var cells = columns.map(function (column, index) {
        var getValue = column.getValue || function () {
          return item[column.id];
        };

        var getDataTest = column.getDataTest || function () {
          return column.id;
        };

        var value = getValue(item, column);
        var cellClasses = classNames(_defineProperty({}, style.cellRight, column.rightAlign), column.className);
        return /*#__PURE__*/React.createElement(Cell, {
          key: column.id,
          className: cellClasses,
          "data-test": getDataTest(item, column)
        }, index === 0 && (draggable || selectable || showDisabledSelection) && metaColumn, value);
      });
      return /*#__PURE__*/React.createElement("tr", _extends({
        id: this.id,
        ref: composeRefs(this.rowRef, innerRef),
        className: classes,
        tabIndex: "0",
        "data-test": joinDataTestAttributes('ring-table-row', dataTest)
      }, testAttrs, restProps, {
        onMouseMove: this.onMouseEnter,
        onClick: this.onClick,
        onDoubleClick: this.onDoubleClick
      }), cells);
    }
  }]);

  return Row;
}(PureComponent);

_defineProperty(Row, "propTypes", {
  className: PropTypes.string,
  item: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  selectable: PropTypes.bool,
  showFocus: PropTypes.bool,
  draggable: PropTypes.bool,
  alwaysShowDragHandle: PropTypes.bool,
  selected: PropTypes.bool,
  onHover: PropTypes.func,
  onSelect: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onClick: PropTypes.func,
  onFocusRestore: PropTypes.func,
  level: PropTypes.number,
  collapsible: PropTypes.bool,
  parentCollapsible: PropTypes.bool,
  collapsed: PropTypes.bool,
  onCollapse: PropTypes.func,
  onExpand: PropTypes.func,
  showDisabledSelection: PropTypes.bool,
  checkboxTooltip: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  focused: PropTypes.bool,
  autofocus: PropTypes.bool,
  onFocusReset: PropTypes.func,
  'data-test': PropTypes.string
});

_defineProperty(Row, "defaultProps", {
  selectable: true,
  showFocus: false,
  draggable: false,
  alwaysShowDragHandle: false,
  selected: false,
  onHover: function onHover() {},
  onSelect: function onSelect() {},
  onDoubleClick: function onDoubleClick() {},
  onClick: function onClick() {},
  onFocusRestore: function onFocusRestore() {},
  level: 0,
  collapsible: false,
  parentCollapsible: false,
  collapsed: false,
  onCollapse: function onCollapse() {},
  onExpand: function onExpand() {}
});

var RowWithFocusSensor = focusSensorHOC(Row);

var RowWithFocusSensorCallbacks = /*#__PURE__*/function (_PureComponent) {
  _inherits(RowWithFocusSensorCallbacks, _PureComponent);

  var _super = _createSuper(RowWithFocusSensorCallbacks);

  function RowWithFocusSensorCallbacks() {
    var _this;

    _classCallCheck(this, RowWithFocusSensorCallbacks);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "onFocus", function () {
      _this.props.onFocus(_this.props.item);
    });

    _defineProperty(_assertThisInitialized(_this), "onSelect", function (item, selected) {
      _this.props.onSelect(item, selected);
    });

    _defineProperty(_assertThisInitialized(_this), "onCollapse", function () {
      _this.props.onCollapse(_this.props.item);
    });

    _defineProperty(_assertThisInitialized(_this), "onExpand", function () {
      _this.props.onExpand(_this.props.item);
    });

    return _this;
  }

  _createClass(RowWithFocusSensorCallbacks, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(RowWithFocusSensor, _extends({}, this.props, {
        onFocus: this.onFocus,
        onSelect: this.onSelect,
        onCollapse: this.onCollapse,
        onExpand: this.onExpand
      }));
    }
  }]);

  return RowWithFocusSensorCallbacks;
}(PureComponent);

_defineProperty(RowWithFocusSensorCallbacks, "propTypes", Row.propTypes);

/**
 * Interactive table with selection and keyboard navigation support.
 */

var Table = /*#__PURE__*/function (_PureComponent) {
  _inherits(Table, _PureComponent);

  var _super = _createSuper(Table);

  function Table() {
    var _this;

    _classCallCheck(this, Table);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      shortcutsScope: getUID('ring-table-'),
      userSelectNone: false
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseDown", function (e) {
      if (e.shiftKey) {
        _this.setState({
          userSelectNone: true
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseUp", function () {
      if (_this.state.userSelectNone) {
        _this.setState({
          userSelectNone: false
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onRowFocus", function (row) {
      var _this$props = _this.props,
          selection = _this$props.selection,
          onSelect = _this$props.onSelect;
      onSelect(selection.focus(row));
    });

    _defineProperty(_assertThisInitialized(_this), "onRowSelect", function (row, selected) {
      var _this$props2 = _this.props,
          selection = _this$props2.selection,
          onSelect = _this$props2.onSelect;

      if (selected) {
        onSelect(selection.select(row));
      } else {
        onSelect(selection.deselect(row));
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onSortEnd", function (_ref) {
      var oldIndex = _ref.oldIndex,
          newIndex = _ref.newIndex;
      var data = arrayMove(_this.props.data, oldIndex, newIndex);

      _this.props.onReorder({
        data: data,
        oldIndex: oldIndex,
        newIndex: newIndex
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onCheckboxChange", function (e) {
      var checked = e.target.checked;
      var _this$props3 = _this.props,
          selection = _this$props3.selection,
          onSelect = _this$props3.onSelect;

      if (checked) {
        onSelect(selection.selectAll());
      } else {
        onSelect(selection.reset());
      }

      _this.restoreFocusWithoutScroll();
    });

    _defineProperty(_assertThisInitialized(_this), "restoreFocusWithoutScroll", function () {
      var _window = window,
          scrollX = _window.scrollX,
          scrollY = _window.scrollY;

      _this.props.onFocusRestore();

      window.scrollTo(scrollX, scrollY);
    });

    return _this;
  }

  _createClass(Table, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      document.addEventListener('mouseup', this.onMouseUp);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(_ref2) {
      var data = _ref2.data,
          selection = _ref2.selection,
          onSelect = _ref2.onSelect,
          selectable = _ref2.selectable,
          remoteSelection = _ref2.remoteSelection;

      if (data !== this.props.data && remoteSelection) {
        onSelect(selection.cloneWith({
          data: this.props.data
        }));
      }

      if (!this.props.selectable && this.props.selectable !== selectable) {
        onSelect(selection.resetSelection());
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames,
          _classNames2,
          _this2 = this;

      var _this$props4 = this.props,
          data = _this$props4.data,
          selection = _this$props4.selection,
          columns = _this$props4.columns,
          caption = _this$props4.caption,
          getItemKey = _this$props4.getItemKey,
          selectable = _this$props4.selectable,
          focused = _this$props4.focused,
          isItemSelectable = _this$props4.isItemSelectable,
          getItemLevel = _this$props4.getItemLevel,
          getItemClassName = _this$props4.getItemClassName,
          getItemDataTest = _this$props4.getItemDataTest,
          draggable = _this$props4.draggable,
          alwaysShowDragHandle = _this$props4.alwaysShowDragHandle,
          loading = _this$props4.loading,
          onSort = _this$props4.onSort,
          sortKey = _this$props4.sortKey,
          sortOrder = _this$props4.sortOrder,
          loaderClassName = _this$props4.loaderClassName,
          stickyHeader = _this$props4.stickyHeader,
          stickyHeaderOffset = _this$props4.stickyHeaderOffset,
          isItemCollapsible = _this$props4.isItemCollapsible,
          isParentCollapsible = _this$props4.isParentCollapsible,
          isItemCollapsed = _this$props4.isItemCollapsed,
          onItemCollapse = _this$props4.onItemCollapse,
          onItemExpand = _this$props4.onItemExpand,
          isDisabledSelectionVisible = _this$props4.isDisabledSelectionVisible,
          getCheckboxTooltip = _this$props4.getCheckboxTooltip,
          onItemDoubleClick = _this$props4.onItemDoubleClick,
          onItemClick = _this$props4.onItemClick,
          renderEmpty = _this$props4.renderEmpty; // NOTE: Do not construct new object per render because it causes all rows rerendering

      var headerProps = {
        caption: caption,
        selectable: selectable,
        draggable: draggable,
        columns: columns,
        onSort: onSort,
        sortKey: sortKey,
        sortOrder: sortOrder,
        sticky: stickyHeader,
        topStickOffset: stickyHeaderOffset
      };
      var selectedSize = selection.getSelected().size;
      var allSelectedSize = selection.selectAll().getSelected().size;
      headerProps.checked = selectedSize > 0 && selectedSize === allSelectedSize;
      headerProps.onCheckboxChange = this.onCheckboxChange;
      headerProps.checkboxDisabled = this.props.data.length === 0;
      var wrapperClasses = classNames((_classNames = {}, _defineProperty(_classNames, style.tableWrapper, true), _defineProperty(_classNames, style.loading, loading), _classNames));
      var classes = classNames(this.props.className, (_classNames2 = {}, _defineProperty(_classNames2, style.table, true), _defineProperty(_classNames2, style.multiSelection, selection.getSelected().size > 0), _defineProperty(_classNames2, style.userSelectNone, this.state.userSelectNone), _defineProperty(_classNames2, style.disabledHover, this.props.disabledHover), _classNames2));

      var renderList = function renderList(_ref3) {
        var children = _ref3.children,
            props = _ref3.props;
        var empty = /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
          colSpan: _this2.props.columns.length || '1',
          className: style.tableMessage
        }, renderEmpty ? renderEmpty() : null));
        var tbody = (children || []).length > 0 ? children : empty;
        return /*#__PURE__*/React.createElement("table", {
          className: classes,
          "data-test": "ring-table"
        }, /*#__PURE__*/React.createElement(Header, headerProps), /*#__PURE__*/React.createElement("tbody", _extends({}, props, {
          "data-test": "ring-table-body"
        }), tbody));
      };

      var renderItem = function renderItem(_ref4) {
        var value = _ref4.value,
            index = _ref4.index,
            _ref4$props = _ref4.props,
            props = _ref4$props === void 0 ? {} : _ref4$props,
            isDragged = _ref4.isDragged;

        var ref = props.ref,
            restProps = _objectWithoutProperties(props, ["ref"]);

        var row = /*#__PURE__*/React.createElement(RowWithFocusSensorCallbacks, _extends({
          innerRef: ref,
          key: getItemKey(value),
          level: getItemLevel(value),
          index: index,
          item: value,
          showFocus: selection.isFocused(value),
          autofocus: selection.isFocused(value),
          focused: selection.isFocused(value),
          selectable: selectable && isItemSelectable(value),
          selected: selectable && selection.isSelected(value),
          onFocus: _this2.onRowFocus,
          onSelect: _this2.onRowSelect,
          onDoubleClick: onItemDoubleClick,
          onClick: onItemClick,
          collapsible: isItemCollapsible(value),
          parentCollapsible: isParentCollapsible(value),
          collapsed: isItemCollapsed(value),
          onCollapse: onItemCollapse,
          onExpand: onItemExpand,
          showDisabledSelection: isDisabledSelectionVisible(value),
          checkboxTooltip: getCheckboxTooltip(value),
          className: classNames(getItemClassName(value), _defineProperty({}, style.draggingRow, isDragged)),
          draggable: draggable,
          alwaysShowDragHandle: alwaysShowDragHandle,
          columns: columns,
          "data-test": getItemDataTest(value)
        }, restProps));
        return isDragged ? /*#__PURE__*/React.createElement("table", {
          style: _objectSpread2(_objectSpread2({}, props.style), {}, {
            borderSpacing: 0
          })
        }, /*#__PURE__*/React.createElement("tbody", null, row)) : row;
      };

      return /*#__PURE__*/React.createElement("div", {
        className: wrapperClasses,
        "data-test": "ring-table-wrapper",
        ref: this.props.innerRef
      }, focused && /*#__PURE__*/React.createElement(Shortcuts, {
        map: this.props.shortcutsMap,
        scope: this.state.shortcutsScope
      }), /*#__PURE__*/React.createElement("div", {
        role: "presentation",
        onMouseDown: this.onMouseDown
      }, draggable ? /*#__PURE__*/React.createElement(List, {
        values: data,
        renderList: renderList,
        renderItem: renderItem,
        onChange: this.onSortEnd
      }) : renderList({
        children: data.map(function (value, index) {
          return renderItem({
            value: value,
            index: index
          });
        })
      })), loading && /*#__PURE__*/React.createElement("div", {
        className: style.loadingOverlay
      }, /*#__PURE__*/React.createElement(Loader, {
        className: loaderClassName
      })));
    }
  }]);

  return Table;
}(PureComponent);

_defineProperty(Table, "propTypes", {
  className: PropTypes.string,
  loaderClassName: PropTypes.string,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  caption: PropTypes.string,
  isItemSelectable: PropTypes.func,
  stickyHeader: PropTypes.bool,
  stickyHeaderOffset: PropTypes.string,
  loading: PropTypes.bool,
  getItemKey: PropTypes.func,
  getItemClassName: PropTypes.func,
  getItemDataTest: PropTypes.func,
  onSort: PropTypes.func,
  onReorder: PropTypes.func,
  sortKey: PropTypes.string,
  sortOrder: PropTypes.bool,
  draggable: PropTypes.bool,
  alwaysShowDragHandle: PropTypes.bool,
  getItemLevel: PropTypes.func,
  isItemCollapsible: PropTypes.func,
  isParentCollapsible: PropTypes.func,
  isItemCollapsed: PropTypes.func,
  onItemCollapse: PropTypes.func,
  onItemExpand: PropTypes.func,
  isDisabledSelectionVisible: PropTypes.func,
  getCheckboxTooltip: PropTypes.func,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func]),
  // focusSensorHOC
  focused: PropTypes.bool,
  onFocusRestore: PropTypes.func,
  // selectionShortcutsHOC
  selection: PropTypes.instanceOf(Selection).isRequired,
  selectable: PropTypes.bool,
  onSelect: PropTypes.func,
  onItemDoubleClick: PropTypes.func,
  onItemClick: PropTypes.func,
  shortcutsMap: PropTypes.object,
  // disableHoverHOC
  disabledHover: PropTypes.bool,
  remoteSelection: PropTypes.bool,
  renderEmpty: PropTypes.func
});

_defineProperty(Table, "defaultProps", {
  isItemSelectable: function isItemSelectable() {
    return true;
  },
  loading: false,
  onSort: function onSort() {},
  onReorder: function onReorder() {},
  getItemKey: function getItemKey(item) {
    return item.id;
  },
  sortKey: 'id',
  sortOrder: true,
  draggable: false,
  alwaysShowDragHandle: false,
  stickyHeader: true,
  getItemLevel: function getItemLevel() {
    return 0;
  },
  getItemClassName: function getItemClassName() {
    return null;
  },
  getItemDataTest: function getItemDataTest() {
    return null;
  },
  isItemCollapsible: function isItemCollapsible() {
    return false;
  },
  isParentCollapsible: function isParentCollapsible() {
    return false;
  },
  isItemCollapsed: function isItemCollapsed() {
    return false;
  },
  onItemCollapse: function onItemCollapse() {},
  onItemExpand: function onItemExpand() {},
  onItemDoubleClick: function onItemDoubleClick() {},
  onItemClick: function onItemClick() {},
  remoteSelection: false,
  isDisabledSelectionVisible: function isDisabledSelectionVisible() {},
  getCheckboxTooltip: function getCheckboxTooltip() {}
});

var table = disableHoverHOC(selectionShortcutsHOC(focusSensorHOC(Table)));

export default table;
export { Table };
