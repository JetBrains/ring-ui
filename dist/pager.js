import { _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, c as _createClass, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import chevronLeftIcon from '@jetbrains/icons/chevron-left';
import chevronRightIcon from '@jetbrains/icons/chevron-right';
import { B as Button } from './button-c0bc1992.js';
import ButtonGroup from './button-group.js';
import ButtonToolbar from './button-toolbar.js';
import Select from './select.js';
import { m as memoize } from './memoize-ad2c954c.js';
import Link from './link.js';
import Icon from './icon.js';
import styleInject from 'style-inject';
import 'focus-visible';
import '@jetbrains/icons/chevron-10px';
import './theme-9a053da9.js';
import './clickableLink-3fc5662b.js';
import '@jetbrains/icons/close';
import 'deep-equal';
import './dropdown.js';
import './data-tests-1a367745.js';
import 'util-deprecate';
import './avatar.js';
import './url-a3cbb96f.js';
import './dom-0ae85140.js';
import './popup-442f4003.js';
import 'react-dom';
import './get-uid-bf3ab014.js';
import './schedule-raf-edeb21db.js';
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
import 'memoize-one';
import './checkbox.js';
import '@jetbrains/icons/checkmark';
import '@jetbrains/icons/remove-10px';
import './input.js';
import './rerender-hoc-bbc9cb21.js';
import './global/fuzzy-highlight.js';
import '@jetbrains/icons/search';
import './loader-inline.js';
import 'conic-gradient';
import './tags-list.js';
import './tag.js';
import './caret.js';
import './text.js';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.pager_pager__6_17F {\n  -webkit-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n.pager_links__2vBEA {\n  margin-bottom: 16px;\n}\n\n.pager_link__XRxbf {\n  display: inline-block;\n\n  margin-right: 16px;\n}\n\n.pager_linkDisabled__zUzOw {\n  color: #737577;\n  color: var(--ring-secondary-color);\n}\n";
var style = {"unit":"8px","pager":"pager_pager__6_17F","links":"pager_links__2vBEA","link":"pager_link__XRxbf","linkDisabled":"pager_linkDisabled__zUzOw"};
styleInject(css_248z);

var Pager = /*#__PURE__*/function (_PureComponent) {
  _inherits(Pager, _PureComponent);

  var _super = _createSuper(Pager);

  function Pager() {
    var _this;

    _classCallCheck(this, Pager);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handlePageSizeChange", function (item) {
      _this.props.onPageSizeChange(item.key);
    });

    _defineProperty(_assertThisInitialized(_this), "handlePrevClick", function () {
      var currentPage = _this.props.currentPage;

      if (currentPage !== 1) {
        var prevPage = currentPage - 1;

        _this.props.onPageChange(prevPage);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleNextClick", function () {
      var _this$props = _this.props,
          currentPage = _this$props.currentPage,
          onLoadPage = _this$props.onLoadPage;
      var nextPage = currentPage + 1;

      var total = _this.getTotal();

      if (currentPage !== total) {
        _this.props.onPageChange(nextPage);
      } else if (_this.props.openTotal) {
        onLoadPage(nextPage);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handlePageChange", memoize(function (i) {
      return function (event) {
        _this.props.onPageChange(i, event);
      };
    }));

    _defineProperty(_assertThisInitialized(_this), "handleLoadMore", memoize(function (i) {
      return function () {
        _this.props.onLoadPage(i);
      };
    }));

    return _this;
  }

  _createClass(Pager, [{
    key: "getSelectOptions",
    value: function getSelectOptions() {
      var _this2 = this;

      var _this$props2 = this.props,
          pageSize = _this$props2.pageSize,
          pageSizes = _this$props2.pageSizes;
      var data = pageSizes.map(function (size) {
        return {
          key: size,
          label: "".concat(size, " ").concat(_this2.props.translations.perPage)
        };
      });
      var selected = data.find(function (it) {
        return it.key === pageSize;
      });
      return {
        selected: selected,
        data: data
      };
    }
  }, {
    key: "getTotal",
    value: function getTotal() {
      var _this$props3 = this.props,
          total = _this$props3.total,
          pageSize = _this$props3.pageSize;
      return Math.ceil(total / pageSize);
    }
  }, {
    key: "getButton",
    value: function getButton(page, content, key, active) {
      return /*#__PURE__*/React.createElement(Button, _extends({
        href: this.generateHref(page),
        key: key,
        active: active,
        disabled: this.props.loader && !active,
        loader: this.props.loader && active
      }, this.getClickProps(this.handlePageChange(page))), content);
    }
  }, {
    key: "getClickProps",
    value: function getClickProps(onClick) {
      var _this$props4 = this.props,
          hrefFunc = _this$props4.hrefFunc,
          onPageChange = _this$props4.onPageChange;

      if (!onPageChange) {
        return {};
      } else if (hrefFunc) {
        return {
          onPlainLeftClick: onClick
        };
      } else {
        return {
          onClick: onClick
        };
      }
    }
  }, {
    key: "getPageSizeSelector",
    value: function getPageSizeSelector() {
      var selectOptions = this.getSelectOptions();
      return !this.props.disablePageSizeSelector && /*#__PURE__*/React.createElement("div", {
        "data-test": "ring-pager-page-size-selector",
        style: {
          float: 'right'
        }
      }, /*#__PURE__*/React.createElement(Select, {
        data: selectOptions.data,
        selected: selectOptions.selected,
        onSelect: this.handlePageSizeChange,
        type: Select.Type.INLINE,
        disabled: this.props.loader
      }));
    }
  }, {
    key: "getPagerLinks",
    value: function getPagerLinks() {
      var _classNames;

      var prevLinkAvailable = this.props.currentPage !== 1;
      var nextLinkAvailable = this.props.openTotal || this.props.currentPage !== this.getTotal();
      var nextIcon = /*#__PURE__*/React.createElement(Icon, {
        glyph: chevronRightIcon,
        key: "icon"
      });
      var prevIcon = /*#__PURE__*/React.createElement(Icon, {
        glyph: chevronLeftIcon,
        key: "icon"
      });
      var prevText = this.props.translations.previousPage;
      var nextText = this.props.translations.nextPage;

      var nextLinkContent = function nextLinkContent(WrapText) {
        return [/*#__PURE__*/React.createElement("span", {
          key: "text"
        }, /*#__PURE__*/React.createElement(WrapText, null, nextText)), nextIcon];
      };

      var prevLinkContent = function prevLinkContent(WrapText) {
        return [prevIcon, /*#__PURE__*/React.createElement("span", {
          key: "text"
        }, /*#__PURE__*/React.createElement(WrapText, null, prevText))];
      };

      var prevLinkHref = this.generateHref(this.props.currentPage - 1);
      var nextLinkHref = this.generateHref(this.props.currentPage + 1);
      var disabledLinkClasses = classNames((_classNames = {}, _defineProperty(_classNames, style.link, true), _defineProperty(_classNames, style.linkDisabled, true), _classNames));
      return /*#__PURE__*/React.createElement("div", {
        className: style.links
      }, prevLinkAvailable && !this.props.loader ? /*#__PURE__*/React.createElement(Link, _extends({
        href: prevLinkHref,
        className: style.link
      }, this.getClickProps(this.handlePrevClick)), prevLinkContent) : /*#__PURE__*/React.createElement("span", {
        className: disabledLinkClasses
      }, prevIcon, /*#__PURE__*/React.createElement("span", {
        key: "text"
      }, prevText)), nextLinkAvailable && !this.props.loader ? /*#__PURE__*/React.createElement(Link, _extends({
        href: nextLinkHref,
        className: style.link
      }, this.getClickProps(this.handleNextClick)), nextLinkContent) : /*#__PURE__*/React.createElement("span", {
        className: disabledLinkClasses
      }, /*#__PURE__*/React.createElement("span", {
        key: "text"
      }, nextText), nextIcon));
    }
  }, {
    key: "generateHref",
    value: function generateHref(page) {
      if (this.props.hrefFunc === undefined) {
        return undefined;
      }

      var pageSize = this.props.disablePageSizeSelector ? undefined : this.props.pageSize;
      return this.props.hrefFunc(page, pageSize);
    }
  }, {
    key: "getPagerContent",
    value: function getPagerContent() {
      var _this$props5 = this.props,
          currentPage = _this$props5.currentPage,
          visiblePagesLimit = _this$props5.visiblePagesLimit;
      var totalPages = this.getTotal();

      if (totalPages < 2 && !this.props.openTotal) {
        return null;
      }

      var start = 1;
      var end = totalPages; // eslint-disable-next-line no-magic-numbers

      if (totalPages >= visiblePagesLimit + 6) {
        var leftHalfFrameSize = Math.ceil(visiblePagesLimit / 2) - 1;
        var rightHalfFrameSize = visiblePagesLimit - leftHalfFrameSize - 1;
        start = currentPage - leftHalfFrameSize;
        end = currentPage + rightHalfFrameSize;

        if (start < 1) {
          var tail = 1 - start;
          start += tail;
          end += tail;
        }

        if (end > totalPages) {
          var _tail = end - totalPages;

          start -= _tail;
          end -= _tail;
        }

        if (start < 1) {
          start += 1 - start;
        }
      }

      var buttons = [];

      for (var i = start; i <= end; i++) {
        buttons.push(this.getButton(i, i, i, i === currentPage));
      }

      var lastPageButtonAvailable = end < totalPages && !this.props.openTotal || this.props.openTotal && this.props.canLoadLastPageWithOpenTotal;
      return /*#__PURE__*/React.createElement("div", null, this.getPagerLinks(), /*#__PURE__*/React.createElement(ButtonToolbar, null, start > 1 && /*#__PURE__*/React.createElement(ButtonGroup, null, this.getButton(1, this.props.translations.firstPage)), /*#__PURE__*/React.createElement(ButtonGroup, null, start > 1 && this.getButton(start - 1, '...'), buttons, end < totalPages && this.getButton(end + 1, '...'), end === totalPages && this.props.openTotal && /*#__PURE__*/React.createElement(Button, _extends({
        href: this.generateHref(end + 1),
        disabled: this.props.loader
      }, this.getClickProps(this.handleLoadMore(end + 1))), '...')), lastPageButtonAvailable && /*#__PURE__*/React.createElement(ButtonGroup, null, this.getButton(this.props.openTotal ? -1 : totalPages, this.props.translations.lastPage))), this.getPageSizeSelector());
    }
  }, {
    key: "render",
    value: function render() {
      var classes = classNames(style.pager, this.props.className);
      return /*#__PURE__*/React.createElement("div", {
        "data-test": "ring-pager",
        className: classes
      }, this.props.total > 1 ? this.getPagerContent() : this.getPageSizeSelector());
    }
  }]);

  return Pager;
}(PureComponent);

_defineProperty(Pager, "propTypes", {
  total: PropTypes.number.isRequired,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  pageSizes: PropTypes.arrayOf(PropTypes.number),
  visiblePagesLimit: PropTypes.number,
  disablePageSizeSelector: PropTypes.bool,
  openTotal: PropTypes.bool,
  canLoadLastPageWithOpenTotal: PropTypes.bool,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onLoadPage: PropTypes.func,
  className: PropTypes.string,
  translations: PropTypes.object,
  loader: PropTypes.bool,
  hrefFunc: PropTypes.func //function which generates href for all pager's buttons based on pager state passed as a function parameter, either this function or onPageChange should be provided

});

_defineProperty(Pager, "defaultProps", {
  currentPage: 1,
  pageSize: 50,
  // eslint-disable-next-line no-magic-numbers
  pageSizes: [20, 50, 100],
  visiblePagesLimit: 7,
  disablePageSizeSelector: false,
  openTotal: false,
  canLoadLastPageWithOpenTotal: false,
  translations: {
    perPage: 'per page',
    firstPage: 'First page',
    lastPage: 'Last page',
    nextPage: 'Next page',
    previousPage: 'Previous'
  },
  loader: false,
  onPageSizeChange: function onPageSizeChange() {},
  onLoadPage: function onLoadPage() {}
});

export default Pager;
