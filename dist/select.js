import { _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, c as _createClass, e as _objectWithoutProperties, f as _extends, i as _objectSpread2, n as _toPropertyKey } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { Component, PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import chevronDown from '@jetbrains/icons/chevron-10px';
import closeIcon from '@jetbrains/icons/close';
import deepEqual from 'deep-equal';
import { Anchor } from './dropdown.js';
import Avatar, { Size as Size$1 } from './avatar.js';
import { a as DEFAULT_DIRECTIONS, g as getPopupContainer, m as maxHeightForDirection, P as Popup } from './popup-442f4003.js';
import { A as ActiveItemContext, L as List, g as getEventKey } from './list-2403b1cd.js';
import Input, { Size } from './input.js';
import Shortcuts from './shortcuts.js';
import { B as Button, b as buttonStyles } from './button-c0bc1992.js';
import { j as joinDataTestAttributes } from './data-tests-1a367745.js';
import { g as getUID } from './get-uid-bf3ab014.js';
import { r as rerenderHOC } from './rerender-hoc-bbc9cb21.js';
import fuzzyHighlight from './global/fuzzy-highlight.js';
import { T as Theme, a as ThemeContext } from './theme-9a053da9.js';
import { m as memoize } from './memoize-ad2c954c.js';
import searchIcon from '@jetbrains/icons/search';
import memoizeOne from 'memoize-one';
import Icon from './icon.js';
import { a as PopupTargetContext } from './popup.target-9daf0591.js';
import LoaderInline from './loader-inline.js';
import { f as getStyles } from './dom-0ae85140.js';
import TagsList from './tags-list.js';
import Caret from './caret.js';
import Text from './text.js';
import { s as sniffr } from './sniffer-c9d1f40e.js';
import styleInject from 'style-inject';
import 'util-deprecate';
import 'focus-visible';
import './clickableLink-3fc5662b.js';
import './url-a3cbb96f.js';
import 'react-dom';
import './schedule-raf-edeb21db.js';
import './tab-trap.js';
import 'react-virtualized/dist/es/List';
import 'react-virtualized/dist/es/AutoSizer';
import 'react-virtualized/dist/es/WindowScroller';
import 'react-virtualized/dist/es/CellMeasurer';
import './link.js';
import './checkbox.js';
import '@jetbrains/icons/checkmark';
import '@jetbrains/icons/remove-10px';
import 'combokeys';
import 'sniffr';
import 'conic-gradient';
import './tag.js';

function shortcutsHOC(ComposedComponent) {
  var _class, _temp;

  return _temp = _class = /*#__PURE__*/function (_React$Component) {
    _inherits(WithShortcuts, _React$Component);

    var _super = _createSuper(WithShortcuts);

    function WithShortcuts() {
      var _this;

      _classCallCheck(this, WithShortcuts);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "_shortcutsScopeUid", getUID('rg-shortcuts-'));

      return _this;
    }

    _createClass(WithShortcuts, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            rgShortcutsOptions = _this$props.rgShortcutsOptions,
            rgShortcutsMap = _this$props.rgShortcutsMap,
            props = _objectWithoutProperties(_this$props, ["rgShortcutsOptions", "rgShortcutsMap"]);

        return /*#__PURE__*/React.createElement(Shortcuts, {
          scope: this._shortcutsScopeUid,
          map: rgShortcutsMap,
          options: rgShortcutsOptions,
          disabled: rgShortcutsOptions.disabled
        }, /*#__PURE__*/React.createElement(ComposedComponent, props));
      }
    }]);

    return WithShortcuts;
  }(React.Component), _defineProperty(_class, "propTypes", {
    rgShortcutsOptions: PropTypes.object,
    rgShortcutsMap: PropTypes.object
  }), _temp;
}

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.select-popup_filterWithTags__-Mbf7 {\n  overflow: hidden;\n\n  margin: 16px 8px 0;\n  padding: 1px;\n\n  text-align: left;\n\n  border: 1px solid #b8d1e5;\n\n  border: 1px solid var(--ring-borders-color)\n}\n\n.select-popup_filterWithTags__-Mbf7 .select-popup_filterWrapper__3ek3A {\n    border-bottom: none;\n  }\n\n.select-popup_filterWithTagsFocused__3RCHp {\n  border: 1px solid #80c6ff;\n  border: 1px solid var(--ring-border-hover-color);\n}\n\n.select-popup_filter__3niGK {\n  width: 100%\n}\n\n.select-popup_filter__3niGK input {\n    font-weight: 200;\n  }\n\n.select-popup_filterWrapper__3ek3A {\n  position: relative;\n\n  margin: 0;\n  padding-right: 8px;\n  padding-left: 44px;\n\n  border-bottom: 1px solid #b8d1e5;\n\n  border-bottom: 1px solid var(--ring-borders-color)\n}\n\n[dir=rtl] .select-popup_filterWrapper__3ek3A {\n    padding-right: 44px;\n    padding-left: 8px\n}\n\n.select-popup_filterIcon__3wU3S {\n  position: absolute;\n  top: 7px;\n  left: 16px;\n\n  color: #b8d1e5;\n\n  color: var(--ring-icon-color)\n}\n\n[dir=rtl] .select-popup_filterIcon__3wU3S {\n    right: 16px;\n    left: auto\n}\n\n.select-popup_bottomLine__3PYTj {\n  text-align: center;\n}\n\n.select-popup_message__2lDgT {\n  display: inline-block;\n\n  margin: 8px 0;\n  padding: 0 16px;\n}\n\n.select-popup_selectAll__2gSGp {\n  display: flex;\n  justify-content: space-between;\n\n  padding: 8px 16px 0;\n}\n";
var styles = {"unit":"8px","filterWithTags":"select-popup_filterWithTags__-Mbf7","filterWrapper":"select-popup_filterWrapper__3ek3A","filterWithTagsFocused":"select-popup_filterWithTagsFocused__3RCHp","filter":"select-popup_filter__3niGK","filterIcon":"select-popup_filterIcon__3wU3S","bottomLine":"select-popup_bottomLine__3PYTj","message":"select-popup_message__2lDgT","selectAll":"select-popup_selectAll__2gSGp"};
styleInject(css_248z);

function noop() {}

var SelectFilter = /*#__PURE__*/function (_Component) {
  _inherits(SelectFilter, _Component);

  var _super = _createSuper(SelectFilter);

  function SelectFilter() {
    var _this;

    _classCallCheck(this, SelectFilter);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "inputRef", function (el) {
      _this.input = el;

      _this.props.inputRef(el);
    });

    return _this;
  }

  _createClass(SelectFilter, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.blur();
    }
  }, {
    key: "focus",
    value: function focus() {
      var input = this.input;

      if (input && input !== document.activeElement) {
        sniffr.browser.name === 'firefox' ? input.select() : input.focus();
      }
    }
  }, {
    key: "blur",
    value: function blur() {
      if (this.input && this.input === document.activeElement) {
        this.input.blur();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          className = _this$props.className,
          listId = _this$props.listId,
          restProps = _objectWithoutProperties(_this$props, ["className", "listId"]);

      var classes = classNames(styles.filter, className);
      return /*#__PURE__*/React.createElement(ActiveItemContext.ValueContext.Consumer, null, function (activeItemId) {
        return /*#__PURE__*/React.createElement(Input, _extends({}, restProps, {
          "aria-owns": listId,
          "aria-activedescendant": activeItemId,
          autoComplete: "off",
          autoFocus: true,
          borderless: true,
          inputRef: _this2.inputRef,
          className: classes
        }));
      });
    }
  }]);

  return SelectFilter;
}(Component);

_defineProperty(SelectFilter, "propTypes", {
  placeholder: PropTypes.string,
  className: PropTypes.string,
  inputRef: PropTypes.func,
  listId: PropTypes.string,
  activeItemId: PropTypes.string
});

_defineProperty(SelectFilter, "defaultProps", {
  placeholder: 'Filter items',
  inputRef: noop
});

var INPUT_MARGIN_COMPENSATION = -14;
var FILTER_HEIGHT = 35;
var TOOLBAR_HEIGHT = 49;

function noop$1() {}

var FilterWithShortcuts = shortcutsHOC(SelectFilter);

var SelectPopup = /*#__PURE__*/function (_PureComponent) {
  _inherits(SelectPopup, _PureComponent);

  var _super = _createSuper(SelectPopup);

  function SelectPopup() {
    var _this;

    _classCallCheck(this, SelectPopup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      popupFilterShortcutsOptions: {
        modal: true,
        disabled: true
      },
      tagsActiveIndex: null
    });

    _defineProperty(_assertThisInitialized(_this), "isClickingPopup", false);

    _defineProperty(_assertThisInitialized(_this), "onFilterFocus", function () {
      _this._togglePopupFilterShortcuts(false);

      _this.setState({
        tagsActiveIndex: null
      });
    });

    _defineProperty(_assertThisInitialized(_this), "popupFilterOnBlur", function () {
      if (_this.state.tagsActiveIndex === null) {
        _this._togglePopupFilterShortcuts(true);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "mouseDownHandler", function () {
      _this.isClickingPopup = true;
    });

    _defineProperty(_assertThisInitialized(_this), "mouseUpHandler", function () {
      _this.isClickingPopup = false;
    });

    _defineProperty(_assertThisInitialized(_this), "onListSelect", function (selected, event, opts) {
      var getSelectItemEvent = function getSelectItemEvent() {
        var customEvent;

        if (document.createEvent) {
          customEvent = document.createEvent('Event');
          customEvent.initEvent('select', true, false);
        }

        if (event && event.persist) {
          event.persist();
        }

        customEvent.originalEvent = event;
        return customEvent;
      };

      _this.props.onSelect(selected, getSelectItemEvent(), opts);
    });

    _defineProperty(_assertThisInitialized(_this), "tabPress", function (event) {
      _this.props.onCloseAttempt(event, true);
    });

    _defineProperty(_assertThisInitialized(_this), "onClickHandler", function () {
      return _this.filter.focus();
    });

    _defineProperty(_assertThisInitialized(_this), "handleRemoveTag", memoize(function (tag) {
      return function (event) {
        return _this.removeTag(tag, event);
      };
    }));

    _defineProperty(_assertThisInitialized(_this), "handleTagClick", memoize(function (tag) {
      return function () {
        _this.setState({
          tagsActiveIndex: _this.props.selected.indexOf(tag)
        });
      };
    }));

    _defineProperty(_assertThisInitialized(_this), "handleListResize", function () {
      _this.forceUpdate();
    });

    _defineProperty(_assertThisInitialized(_this), "handleSelectAll", function () {
      return _this.props.onSelectAll(_this.props.data.filter(function (item) {
        return !item.disabled;
      }).length !== _this.props.selected.length);
    });

    _defineProperty(_assertThisInitialized(_this), "getSelectAll", function () {
      var activeFilters = _this.props.data.filter(function (item) {
        return !item.disabled;
      });

      return /*#__PURE__*/React.createElement("div", {
        className: styles.selectAll
      }, activeFilters.length === 0 ? /*#__PURE__*/React.createElement("span", null) : /*#__PURE__*/React.createElement(Button, {
        text: true,
        inline: true,
        onClick: _this.handleSelectAll
      }, activeFilters.length !== _this.props.selected.length ? 'Select all' : 'Deselect all'), /*#__PURE__*/React.createElement(Text, {
        info: true
      }, "".concat(_this.props.selected.length, " selected")));
    });

    _defineProperty(_assertThisInitialized(_this), "_adjustListMaxHeight", memoizeOne(function (hidden, userDefinedMaxHeight, ringPopupTarget) {
      if (hidden) {
        return userDefinedMaxHeight;
      } // Calculate list's maximum height that can't
      // get beyond the screen
      // @see RG-1838, JT-48358


      var minMaxHeight = 100;
      var directions = _this.props.directions || DEFAULT_DIRECTIONS; // Note:
      // Create a method which'll be called only when the popup opens and before
      // render the list would be a better way

      var anchorNode = _this.props.anchorElement;
      var containerNode = getPopupContainer(ringPopupTarget) || document.documentElement;
      return Math.min(directions.reduce(function (maxHeight, direction) {
        return Math.max(maxHeight, maxHeightForDirection(direction, anchorNode, getStyles(containerNode).position !== 'static' ? containerNode : null));
      }, minMaxHeight), userDefinedMaxHeight);
    }));

    _defineProperty(_assertThisInitialized(_this), "popupRef", function (el) {
      _this.popup = el;
    });

    _defineProperty(_assertThisInitialized(_this), "listRef", function (el) {
      _this.list = el;
    });

    _defineProperty(_assertThisInitialized(_this), "filterRef", function (el) {
      _this.filter = el;
      _this.caret = new Caret(_this.filter);
    });

    _defineProperty(_assertThisInitialized(_this), "shortcutsScope", getUID('select-popup-'));

    _defineProperty(_assertThisInitialized(_this), "shortcutsMap", {
      tab: _this.tabPress
    });

    _defineProperty(_assertThisInitialized(_this), "popupFilterShortcuts", {
      map: {
        up: function up(event) {
          return _this.list && _this.list.upHandler(event);
        },
        down: function down(event) {
          return _this.list && _this.list.downHandler(event);
        },
        home: function home(event) {
          return _this.list && _this.list.homeHandler(event);
        },
        end: function end(event) {
          return _this.list && _this.list.endHandler(event);
        },
        enter: function enter(event) {
          return _this.list ? _this.list.enterHandler(event) : _this.props.onEmptyPopupEnter(event);
        },
        esc: function esc(event) {
          return _this.props.onCloseAttempt(event, true);
        },
        tab: function tab(event) {
          return _this.tabPress(event);
        },
        backspace: function backspace(event) {
          return _this.handleBackspace(event);
        },
        del: function del() {
          return _this.removeSelectedTag();
        },
        left: function left() {
          return _this.handleNavigation(true);
        },
        right: function right() {
          return _this.handleNavigation();
        }
      }
    });

    return _this;
  }

  _createClass(SelectPopup, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      window.document.addEventListener('mouseup', this.mouseUpHandler);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.document.removeEventListener('mouseup', this.mouseUpHandler);
    }
  }, {
    key: "focusFilter",
    // This flag is set to true while an item in the popup is being clicked
    value: function focusFilter() {
      var _this2 = this;

      setTimeout(function () {
        return _this2.filter.focus();
      });
    }
  }, {
    key: "isEventTargetFilter",
    value: function isEventTargetFilter(event) {
      return event.target && event.target.matches('input,textarea');
    }
  }, {
    key: "handleNavigation",
    value: function handleNavigation(navigateLeft) {
      if (this.isEventTargetFilter(event) && this.caret.getPosition() > 0) {
        return;
      }

      var newIndex = null;

      if (navigateLeft) {
        newIndex = this.state.tagsActiveIndex === null ? this.props.selected.length - 1 : this.state.tagsActiveIndex - 1;
      } else if (this.state.tagsActiveIndex !== null) {
        newIndex = this.state.tagsActiveIndex + 1;
      }

      if (newIndex !== null && (newIndex >= this.props.selected.length || newIndex < 0)) {
        newIndex = null;
        this.focusFilter();
      }

      this.setState({
        tagsActiveIndex: newIndex
      });
    }
  }, {
    key: "removeTag",
    value: function removeTag(tag, event) {
      var _tag = tag || this.props.selected.slice(0)[this.props.selected.length - 1];

      if (_tag) {
        this.onListSelect(_tag, event, {
          tryKeepOpen: true
        });
        this.setState({
          tagsActiveIndex: null
        });
        this.focusFilter();
      }
    }
  }, {
    key: "removeSelectedTag",
    value: function removeSelectedTag() {
      if (this.state.tagsActiveIndex != null) {
        this.removeTag(this.props.selected[this.state.tagsActiveIndex]);
        return false;
      }

      return true;
    }
  }, {
    key: "handleBackspace",
    value: function handleBackspace(event) {
      if (!this.props.tags) {
        return true;
      }

      if (!this.isEventTargetFilter(event)) {
        this.removeSelectedTag();
        return false;
      }

      if (!event.target.value) {
        this.removeTag();
        return false;
      }

      return true;
    }
  }, {
    key: "_togglePopupFilterShortcuts",
    value: function _togglePopupFilterShortcuts(shortcutsDisabled) {
      this.setState({
        popupFilterShortcutsOptions: {
          modal: true,
          disabled: shortcutsDisabled
        }
      });
    }
  }, {
    key: "isVisible",
    value: function isVisible() {
      return this.popup && this.popup.isVisible();
    }
  }, {
    key: "getFilter",
    value: function getFilter() {
      if (this.props.filter || this.props.tags) {
        return /*#__PURE__*/React.createElement("div", {
          className: styles.filterWrapper,
          "data-test": "ring-select-popup-filter"
        }, /*#__PURE__*/React.createElement(Icon, {
          glyph: searchIcon,
          className: styles.filterIcon,
          "data-test-custom": "ring-select-popup-filter-icon"
        }), /*#__PURE__*/React.createElement(FilterWithShortcuts, {
          rgShortcutsOptions: this.state.popupFilterShortcutsOptions,
          rgShortcutsMap: this.popupFilterShortcuts.map,
          value: this.props.filterValue,
          inputRef: this.filterRef,
          onBlur: this.popupFilterOnBlur,
          onFocus: this.onFilterFocus,
          className: "ring-js-shortcuts",
          placeholder: this.props.filter.placeholder,
          onChange: this.props.onFilter,
          onClick: this.onClickHandler,
          onClear: this.props.onClear,
          "data-test-custom": "ring-select-popup-filter-input",
          listId: this.props.listId
        }));
      }

      return null;
    }
  }, {
    key: "getTags",
    value: function getTags() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TagsList, {
        tags: this.props.selected,
        activeIndex: this.state.tagsActiveIndex,
        handleRemove: this.handleRemoveTag,
        handleClick: this.handleTagClick,
        disabled: this.props.disabled
      }));
    }
  }, {
    key: "getFilterWithTags",
    value: function getFilterWithTags() {
      if (this.props.tags) {
        var classes = classNames([styles.filterWithTags, _defineProperty({}, styles.filterWithTagsFocused, !this.state.popupFilterShortcutsOptions.disabled)]);
        return /*#__PURE__*/React.createElement("div", {
          className: classes
        }, this.getTags(), this.getFilter());
      }

      return this.getFilter();
    }
  }, {
    key: "getBottomLine",
    value: function getBottomLine() {
      var _this$props = this.props,
          loading = _this$props.loading,
          message = _this$props.message;
      return (loading || message) && /*#__PURE__*/React.createElement("div", {
        className: styles.bottomLine
      }, loading && /*#__PURE__*/React.createElement(LoaderInline, null), message && /*#__PURE__*/React.createElement("div", {
        className: styles.message
      }, message));
    }
  }, {
    key: "getList",
    value: function getList(ringPopupTarget) {
      if (this.props.data.length) {
        var maxHeight = this.props.maxHeight;

        if (this.props.anchorElement) {
          maxHeight = this._adjustListMaxHeight(this.props.hidden, maxHeight, ringPopupTarget);
        }

        if (this.props.filter) {
          maxHeight -= FILTER_HEIGHT;
        }

        if (this.props.toolbar) {
          maxHeight -= TOOLBAR_HEIGHT;
        }

        return /*#__PURE__*/React.createElement(List, {
          id: this.props.listId,
          maxHeight: maxHeight,
          data: this.props.data,
          activeIndex: this.props.activeIndex,
          ref: this.listRef,
          restoreActiveIndex: true,
          activateFirstItem: true,
          onSelect: this.onListSelect,
          onResize: this.handleListResize,
          onScrollToBottom: this.props.onLoadMore,
          hidden: this.props.hidden,
          shortcuts: !this.props.hidden,
          disableMoveOverflow: this.props.disableMoveOverflow,
          disableMoveDownOverflow: this.props.loading,
          disableScrollToActive: this.props.disableScrollToActive,
          compact: this.props.compact,
          renderOptimization: this.props.renderOptimization
        });
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props2 = this.props,
          toolbar = _this$props2.toolbar,
          className = _this$props2.className,
          multiple = _this$props2.multiple,
          hidden = _this$props2.hidden,
          isInputMode = _this$props2.isInputMode,
          anchorElement = _this$props2.anchorElement,
          minWidth = _this$props2.minWidth,
          onCloseAttempt = _this$props2.onCloseAttempt,
          directions = _this$props2.directions,
          top = _this$props2.top,
          left = _this$props2.left,
          style = _this$props2.style,
          dir = _this$props2.dir,
          filter = _this$props2.filter;
      var classes = classNames(styles.popup, className);
      return /*#__PURE__*/React.createElement(PopupTargetContext.Consumer, null, function (ringPopupTarget) {
        var filterWithTags = _this3.getFilterWithTags();

        var selectAll = multiple && !multiple.limit && multiple.selectAll && _this3.getSelectAll();

        var list = _this3.getList(_this3.props.ringPopupTarget || ringPopupTarget);

        var bottomLine = _this3.getBottomLine();

        var hasContent = filterWithTags || selectAll || list || bottomLine || toolbar;
        return /*#__PURE__*/React.createElement(Popup, {
          trapFocus: false,
          ref: _this3.popupRef,
          hidden: hidden || !hasContent,
          attached: isInputMode,
          className: classes,
          dontCloseOnAnchorClick: true,
          anchorElement: anchorElement,
          minWidth: minWidth,
          onCloseAttempt: onCloseAttempt,
          directions: directions,
          top: top || (isInputMode ? INPUT_MARGIN_COMPENSATION : null),
          left: left,
          onMouseDown: _this3.mouseDownHandler,
          target: _this3.props.ringPopupTarget,
          autoCorrectTopOverflow: false,
          style: style
        }, /*#__PURE__*/React.createElement("div", {
          dir: dir
        }, !hidden && filter && /*#__PURE__*/React.createElement(Shortcuts, {
          map: _this3.shortcutsMap,
          scope: _this3.shortcutsScope
        }), hidden ? /*#__PURE__*/React.createElement("div", null) : filterWithTags, selectAll, list, bottomLine, toolbar));
      });
    }
  }]);

  return SelectPopup;
}(PureComponent);

_defineProperty(SelectPopup, "propTypes", {
  activeIndex: PropTypes.number,
  anchorElement: PropTypes.instanceOf(HTMLElement),
  className: PropTypes.string,
  compact: PropTypes.bool,
  data: PropTypes.array,
  dir: PropTypes.oneOf(['ltr', 'rtl']),
  directions: PropTypes.array,
  disabled: PropTypes.bool,
  disableMoveOverflow: PropTypes.bool,
  disableScrollToActive: PropTypes.bool,
  filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({
    value: PropTypes.string,
    placeholder: PropTypes.string
  })]),
  filterValue: PropTypes.string,
  hidden: PropTypes.bool,
  isInputMode: PropTypes.bool,
  listId: PropTypes.string,
  maxHeight: PropTypes.number,
  message: PropTypes.string,
  minWidth: PropTypes.number,
  multiple: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({
    label: PropTypes.string,
    limit: PropTypes.number,
    selectAll: PropTypes.bool
  })]),
  left: PropTypes.bool,
  loading: PropTypes.bool,
  onClear: PropTypes.func,
  onCloseAttempt: PropTypes.func,
  onEmptyPopupEnter: PropTypes.func,
  onFilter: PropTypes.func,
  onLoadMore: PropTypes.func,
  onSelect: PropTypes.func,
  onSelectAll: PropTypes.func,
  renderOptimization: PropTypes.bool,
  ringPopupTarget: PropTypes.string,
  selected: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  style: PropTypes.object,
  tags: PropTypes.object,
  toolbar: PropTypes.node,
  top: PropTypes.number
});

_defineProperty(SelectPopup, "defaultProps", {
  data: [],
  activeIndex: null,
  toolbar: null,
  filter: false,
  multiple: false,
  message: null,
  anchorElement: null,
  maxHeight: 600,
  minWidth: 240,
  loading: false,
  onSelect: noop$1,
  onCloseAttempt: noop$1,
  onFilter: noop$1,
  onClear: noop$1,
  onLoadMore: noop$1,
  selected: [],
  tags: null,
  ringPopupTarget: null,
  onSelectAll: noop$1,
  onEmptyPopupEnter: noop$1
});

var css_248z$1 = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.select_select__2jGvw:hover .select_value__qxDh-,\n.select_select__2jGvw:hover .select_icons__MhZF4 {\n  transition: none;\n\n  color: #008eff;\n\n  color: var(--ring-main-color);\n}}\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.select_select__2jGvw {\n  position: relative;\n\n  display: inline-block;\n\n  white-space: nowrap;\n\n  color: #1f2326;\n\n  color: var(--ring-text-color);\n}\n\n.select_toolbar__iBlVg {\n  border-top: 1px solid #dfe5eb;\n  border-top: 1px solid var(--ring-line-color);\n}\n\n.select_button__cRi6L {\n  width: 100%;\n  padding: 0;\n\n  text-align: left\n}\n\n[dir=rtl] .select_button__cRi6L {\n    text-align: right;\n    direction: ltr\n}\n\n.select_toolbar__iBlVg .select_button__cRi6L {\n    height: 32px;\n    margin: 8px 0\n}\n\n.select_button__cRi6L.select_buttonSpaced__Ao7mF {\n    padding: 0 16px;\n  }\n\n.select_icons__MhZF4 {\n  position: absolute;\n  top: -2px;\n  right: 0;\n\n  transition: color 0.3s ease-out;\n\n  transition: color var(--ring-ease);\n\n  color: #999;\n\n  color: var(--ring-icon-secondary-color);\n\n  line-height: 32px\n}\n\n.select_icons__MhZF4 .ring-loader_inline {\n    top: 2px;\n\n    margin-right: 2px;\n  }\n\n.select_inputMode__11dCf .select_icons__MhZF4 {\n    top: 12px;\n\n    font-size: 13px;\n\n    font-size: var(--ring-font-size)\n}\n\n.select_buttonMode__3ZuOd .select_icons__MhZF4 {\n    top: -4px;\n    right: 8px\n}\n\n.select_selectedIcon__sHpRS {\n\n  display: inline-block;\n\n  width: 16px;\n  height: 16px;\n  margin: 0 4px;\n\n  background-repeat: no-repeat;\n  background-position: center;\n\n  background-size: contain;\n}\n\n.select_clearIcon__24NGA {\n  padding: 0 3px;\n\n  vertical-align: -1px;\n}\n\n.select_clearIcon__24NGA.select_clearIcon__24NGA > span > span {\n  color: #999;\n  color: var(--ring-icon-secondary-color);\n}\n\n.select_sizeS__HBpoh {\n  width: 96px;\n}\n\n.select_sizeM__3K-T2 {\n  width: 240px;\n}\n\n.select_sizeL__2WBQL {\n  width: 400px;\n}\n\n.select_sizeFULL__3JvvJ {\n  width: 100%;\n}\n\n.select_sizeAUTO__dG_Cv {\n  max-width: 100%;\n}\n\n.select_buttonMode__3ZuOd,\n.select_materialMode__3z8Nc {\n  position: relative;\n\n  cursor: pointer;\n}\n\n.select_value__qxDh- {\n\n  display: inline-block;\n\n  box-sizing: border-box;\n  width: 100%;\n  height: 33px;\n  padding: 0 0 3px;\n\n  cursor: pointer;\n  transition: color 0.3s ease-out, border-color 0.3s ease-out;\n  transition: color var(--ring-ease), border-color var(--ring-ease);\n  text-align: left;\n  vertical-align: top;\n\n  color: #1f2326;\n\n  color: var(--ring-text-color);\n\n  border: none;\n  border-bottom: 1px solid #b8d1e5;\n  border-bottom: 1px solid var(--ring-borders-color);\n  outline: none;\n  background: transparent\n}\n\n.select_value__qxDh-:focus {\n    border-color: #008eff;\n    border-color: var(--ring-main-color);\n  }\n\n.select_value__qxDh-.select_open__3leXa,\n  .select_value__qxDh-:active {\n    border-color: transparent;\n  }\n\n.select_value__qxDh-::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n    outline: 0;\n  }\n\n.select_buttonValue__8sfiM {\n\n  width: 100%;\n\n  text-align: left;\n  vertical-align: -8px;\n}\n\n.select_buttonValueOpen__1xw5Y {\n  border-color: #d4edff;\n  border-color: var(--ring-selected-background-color);\n  background-color: #d4edff;\n  background-color: var(--ring-selected-background-color)\n}\n\n.select_buttonValueOpen__1xw5Y .select_icons__MhZF4 {\n    transition: none;\n\n    color: #008eff;\n\n    color: var(--ring-main-color);\n  }\n\n.select_label__1cvPG {\n  position: relative;\n\n  color: #737577;\n\n  color: var(--ring-secondary-color);\n}\n\n.select_value__qxDh-:focus,\n.select_value__qxDh-:focus + .select_icons__MhZF4,\n.select_open__3leXa,\n.select_open__3leXa + .select_icons__MhZF4 {\n  transition: none;\n\n  color: #008eff;\n\n  color: var(--ring-main-color);\n}\n\n.select_disabled__35ATU {\n  pointer-events: none;\n\n  color: #999;\n\n  color: var(--ring-disabled-color)\n}\n\n.select_disabled__35ATU .select_value__qxDh- {\n    color: #999;\n    color: var(--ring-disabled-color);\n    border-bottom-style: dashed;\n  }\n\n.select_selectedLabel__3-bdf {\n  position: absolute;\n  top: -12px;\n  left: 0;\n\n  overflow: hidden;\n\n  max-width: 100%;\n\n  text-overflow: ellipsis;\n\n  color: #737577;\n\n  color: var(--ring-secondary-color);\n\n  font-size: 12px;\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: 16px;\n  line-height: var(--ring-line-height-lowest);\n}\n\n.select_avatar__m6agV {\n  margin-right: 4px;\n\n  vertical-align: -5px;\n}\n\n.select_popup__arVe0 {\n  min-width: 240px;\n  max-width: 320px;\n}\n\n.select_chevron__2QQTt.select_chevron__2QQTt {\n  padding: 0;\n\n  transition: none;\n\n  color: inherit;\n}\n\n.select_chevronIcon__xx9jh.select_chevronIcon__xx9jh {\n  transition: none;\n\n  color: inherit;\n}\n";
var styles$1 = {"unit":"8px","resetButton":"global_resetButton__WQfrm","select":"select_select__2jGvw","value":"select_value__qxDh- global_ellipsis__xhH6M global_font__2H0e4","icons":"select_icons__MhZF4","toolbar":"select_toolbar__iBlVg","button":"select_button__cRi6L","buttonSpaced":"select_buttonSpaced__Ao7mF","inputMode":"select_inputMode__11dCf","buttonMode":"select_buttonMode__3ZuOd","selectedIcon":"select_selectedIcon__sHpRS global_resetButton__WQfrm","clearIcon":"select_clearIcon__24NGA","sizeS":"select_sizeS__HBpoh","sizeM":"select_sizeM__3K-T2","sizeL":"select_sizeL__2WBQL","sizeFULL":"select_sizeFULL__3JvvJ","sizeAUTO":"select_sizeAUTO__dG_Cv","materialMode":"select_materialMode__3z8Nc","open":"select_open__3leXa","buttonValue":"select_buttonValue__8sfiM global_ellipsis__xhH6M","buttonValueOpen":"select_buttonValueOpen__1xw5Y","label":"select_label__1cvPG","disabled":"select_disabled__35ATU","selectedLabel":"select_selectedLabel__3-bdf","avatar":"select_avatar__m6agV","popup":"select_popup__arVe0","chevron":"select_chevron__2QQTt","chevronIcon":"select_chevronIcon__xx9jh"};
styleInject(css_248z$1);

/**
 * @name Select
 */

function noop$2() {}
/**
 * @enum {number}
 */


var Type = {
  BUTTON: 'BUTTON',
  INPUT: 'INPUT',
  CUSTOM: 'CUSTOM',
  INLINE: 'INLINE',
  MATERIAL: 'MATERIAL',
  INPUT_WITHOUT_CONTROLS: 'INPUT_WITHOUT_CONTROLS'
};
var ICON_WIDTH = 20;
var getStyle = memoize(function (iconsLength) {
  return {
    paddingRight: iconsLength * ICON_WIDTH
  };
});

var _isInputMode = function isInputMode(type) {
  return type === Type.INPUT || type === Type.INPUT_WITHOUT_CONTROLS;
};

function getLowerCaseLabel(item) {
  if (List.isItemType(List.ListProps.Type.SEPARATOR, item) || List.isItemType(List.ListProps.Type.HINT, item) || item.label == null) {
    return null;
  }

  return item.label.toLowerCase();
}

function doesLabelMatch(itemToCheck, fn) {
  var lowerCaseLabel = getLowerCaseLabel(itemToCheck);

  if (lowerCaseLabel == null) {
    return true;
  }

  return fn(lowerCaseLabel);
}

function _getFilterFn(filter) {
  if (filter.fn) {
    return filter.fn;
  }

  if (filter.fuzzy) {
    return function (itemToCheck, checkString) {
      return doesLabelMatch(itemToCheck, function (lowerCaseLabel) {
        return fuzzyHighlight(checkString, lowerCaseLabel).matched;
      });
    };
  }

  return function (itemToCheck, checkString) {
    return doesLabelMatch(itemToCheck, function (lowerCaseLabel) {
      return lowerCaseLabel.indexOf(checkString) >= 0;
    });
  };
}

var buildMultipleMap = function buildMultipleMap(selected) {
  return selected.reduce(function (acc, item) {
    acc[item.key] = true;
    return acc;
  }, {});
};

function _getListItems(props, state, rawFilterString) {
  var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : props.data;
  var filterString = rawFilterString.trim();

  if (_isInputMode(props.type) && state.selected && filterString === state.selected.label) {
    filterString = ''; // ignore multiple if it is exactly the selected item
  }

  var lowerCaseString = filterString.toLowerCase();
  var filteredData = [];
  var exactMatch = false;

  var check = _getFilterFn(props.filter);

  var _loop = function _loop(i) {
    var item = _objectSpread2({}, data[i]);

    if (check(item, lowerCaseString, data)) {
      exactMatch = item.label === filterString;

      if (props.multiple && !props.multiple.removeSelectedItems) {
        item.checkbox = !!state.multipleMap[item.key];
      }

      if (props.multiple && props.multiple.limit) {
        item.disabled = props.multiple.limit === state.selected.length && !state.selected.find(function (selectedItem) {
          return selectedItem.key === item.key;
        });
      } // Ignore item if it's multiple and is already selected


      if (!(props.multiple && props.multiple.removeSelectedItems && state.multipleMap[item.key])) {
        filteredData.push(item);
      }
    }
  };

  for (var i = 0; i < data.length; i++) {
    _loop(i);
  }

  var addButton = null;
  var add = props.add;

  if (add && filterString && !exactMatch || add && add.alwaysVisible) {
    if (!(add.regexp && !add.regexp.test(filterString)) && !(add.minlength && filterString.length < +add.minlength) || add.alwaysVisible) {
      addButton = {
        prefix: add.prefix,
        label: add.label || filterString,
        delayed: add.hasOwnProperty('delayed') ? add.delayed : true
      };
    }
  }

  return {
    filteredData: filteredData,
    addButton: addButton
  };
}

function getSelectedIndex(selected, data, multiple) {
  var firstSelected = multiple ? selected[0] : selected;

  if (firstSelected == null) {
    return null;
  }

  for (var i = 0; i < data.length; i++) {
    var item = data[i];

    if (item.key === undefined) {
      continue;
    }

    if (item.key === firstSelected.key) {
      return i;
    }
  }

  return null;
}

var getItemLabel = function getItemLabel(_ref) {
  var selectedLabel = _ref.selectedLabel,
      label = _ref.label;
  return selectedLabel != null ? selectedLabel : label;
};

var _getValueForFilter = function getValueForFilter(selected, type, filterValue) {
  return selected && _isInputMode(type) ? getItemLabel(selected) : filterValue;
};

function isSameSelected(prevSelected, selected) {
  if (!prevSelected || !selected || prevSelected.length !== selected.length) {
    return false;
  }

  var keysMap = selected.reduce(function (result, item) {
    result[item.key] = true;
    return result;
  }, {});
  return prevSelected.every(function (it) {
    return keysMap[it.key];
  });
}
/**
 * @name Select
 * @constructor
 * @extends {Component}
 */

/**
 * Displays a select.
 */


var Select = /*#__PURE__*/function (_Component) {
  _inherits(Select, _Component);

  var _super = _createSuper(Select);

  function Select() {
    var _this;

    _classCallCheck(this, Select);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      data: [],
      shownData: [],
      selected: _this.props.multiple ? [] : null,
      selectedIndex: null,
      filterValue: _this.props.filter && _this.props.filter.value || '',
      shortcutsEnabled: false,
      popupShortcuts: false,
      showPopup: false,
      prevData: _this.props.data,
      prevSelected: null,
      prevMultiple: _this.props.multiple,
      multipleMap: {},
      addButton: null
    });

    _defineProperty(_assertThisInitialized(_this), "id", getUID('select-'));

    _defineProperty(_assertThisInitialized(_this), "shortcutsScope", _this.id);

    _defineProperty(_assertThisInitialized(_this), "listId", "".concat(_this.id, ":list"));

    _defineProperty(_assertThisInitialized(_this), "_focusHandler", function () {
      _this.props.onFocus();

      _this.setState({
        shortcutsEnabled: true,
        focused: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_blurHandler", function () {
      _this.props.onBlur();

      if (_this._popup && _this._popup.isVisible() && !_this._popup.isClickingPopup) {
        window.setTimeout(function () {
          _this.setState({
            showPopup: false
          });
        });
      }

      if (!_this._popup.isClickingPopup) {
        _this.setState({
          shortcutsEnabled: false,
          focused: false
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "nodeRef", function (el) {
      _this.node = el;
    });

    _defineProperty(_assertThisInitialized(_this), "_popup", null);

    _defineProperty(_assertThisInitialized(_this), "onEmptyPopupEnter", function () {
      if (_this.state.addButton) {
        _this.addHandler();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onEnter", function () {
      if (_this.state.addButton && _this.state.shownData.length === 0) {
        _this.addHandler();
      }

      _this.props.onDone();

      if (!_this._popup.isVisible() && _this.props.allowAny) {
        return true;
      }

      return undefined;
    });

    _defineProperty(_assertThisInitialized(_this), "_onEsc", function (event) {
      if (!_this._popup.isVisible()) {
        return true;
      } else if (_this.props.multiple || !_this.props.getInitial) {
        return false;
      }

      var selected = {
        key: Math.random(),
        label: _this.props.getInitial()
      };

      _this.setState({
        selected: selected,
        filterValue: _this.getValueForFilter(selected)
      }, function () {
        _this.props.onChange(selected, event);

        _this.props.onReset();
      });

      return undefined;
    });

    _defineProperty(_assertThisInitialized(_this), "_inputShortcutHandler", function () {
      if (_this.state.focused && _this._popup && !_this._popup.isVisible()) {
        _this._clickHandler();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "popupRef", function (el) {
      _this._popup = el;
    });

    _defineProperty(_assertThisInitialized(_this), "addHandler", function () {
      var value = _this.filterValue();

      _this._hidePopup();

      _this.props.onAdd(value);
    });

    _defineProperty(_assertThisInitialized(_this), "getLowerCaseLabel", getLowerCaseLabel);

    _defineProperty(_assertThisInitialized(_this), "doesLabelMatch", doesLabelMatch);

    _defineProperty(_assertThisInitialized(_this), "_clickHandler", function () {
      if (!_this.props.disabled) {
        if (_this.state.showPopup) {
          _this._hidePopup();
        } else {
          _this.props.onBeforeOpen();

          _this._showPopup();
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_selectButtonKeyboardHack", function (event) {
      var key = getEventKey(event);

      if (key === 'Enter' || key === ' ') {
        _this._clickHandler();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_filterChangeHandler", function (e) {
      _this._setFilter(e.target.value, e);
    });

    _defineProperty(_assertThisInitialized(_this), "_setFilter", function (value) {
      var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (_this.isInputMode() && !_this.state.focused) {
        return;
      }

      if (value === _this.state.filterValue) {
        return;
      }

      var filterValue = value.replace(/^\s+/g, '');

      _this.props.onFilter(filterValue);

      if (_this.props.allowAny) {
        var fakeSelected = {
          key: Math.random(),
          label: filterValue
        };

        _this.setState({
          selected: filterValue === '' ? null : fakeSelected,
          selectedIndex: null
        }, function () {
          _this.props.onSelect(fakeSelected, event);

          _this.props.onChange(fakeSelected, event);
        });
      }

      !_this._popup.isVisible() && _this.props.onBeforeOpen();

      _this.setState({
        filterValue: filterValue
      }, function () {
        _this._showPopup();
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_redrawPopup", function () {
      if (_this.props.multiple) {
        setTimeout(function () {
          //setTimeout solves events order and bubbling issue
          _this.isInputMode() && _this.clearFilter();

          _this._showPopup();
        }, 0);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_listSelectHandler", function (selected, event) {
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var isItem = List.isItemType.bind(null, List.ListProps.Type.ITEM);
      var isCustomItem = List.isItemType.bind(null, List.ListProps.Type.CUSTOM);
      var isSelectItemEvent = event && (event.type === 'select' || event.type === 'keydown');

      if (isSelectItemEvent) {
        event.preventDefault();
      }

      if (!isItem(selected) && !isCustomItem(selected) || selected.disabled || selected.isResetItem) {
        return;
      }

      if (!_this.props.multiple) {
        _this._hidePopup(isSelectItemEvent);

        _this.setState({
          selected: selected,
          selectedIndex: _this._getSelectedIndex(selected, _this.props.data)
        }, function () {
          var newFilterValue = _this.isInputMode() && !_this.props.hideSelected ? getItemLabel(selected) : '';

          _this.filterValue(newFilterValue);

          _this.props.onFilter(newFilterValue);

          _this.props.onSelect(selected, event);

          _this.props.onChange(selected, event);
        });
      } else {
        var tryKeepOpen = opts.tryKeepOpen;

        if (!tryKeepOpen) {
          _this._hidePopup(isSelectItemEvent);
        }

        if (selected.key == null) {
          throw new Error('Multiple selection requires each item to have the "key" property');
        }

        _this.setState(function (prevState) {
          var currentSelection = prevState.selected;
          var nextSelection;

          if (!prevState.multipleMap[selected.key]) {
            nextSelection = currentSelection.concat(selected);
            _this.props.onSelect && _this.props.onSelect(selected, event);
          } else {
            nextSelection = currentSelection.filter(function (item) {
              return item.key !== selected.key;
            });
            _this.props.onDeselect && _this.props.onDeselect(selected);
          }

          _this.props.onChange(nextSelection, event);

          var nextState = {
            selected: nextSelection,
            selectedIndex: _this._getSelectedIndex(selected, _this.props.data)
          };

          if (_this.props.multiple.limit && nextSelection.length === _this.props.multiple.limit) {
            nextState.shownData = prevState.shownData.map(function (item) {
              return nextSelection.find(function (selectedItem) {
                return selectedItem.key === item.key;
              }) ? item : _objectSpread2(_objectSpread2({}, item), {}, {
                disabled: true
              });
            });
          }

          if (!prevState.multipleMap[selected.key]) {
            nextState.multipleMap = _objectSpread2(_objectSpread2({}, prevState.multipleMap), {}, _defineProperty({}, selected.key, true));
          } else {
            var _prevState$multipleMa = prevState.multipleMap,
                _selected$key = selected.key;
                _prevState$multipleMa[_selected$key];
                var restMultipleMap = _objectWithoutProperties(_prevState$multipleMa, [_selected$key].map(_toPropertyKey));

            nextState.multipleMap = restMultipleMap;
          }

          return nextState;
        }, function () {
          if (tryKeepOpen) {
            _this._redrawPopup();
          }
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_listSelectAllHandler", function () {
      var isSelectAll = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var isItem = List.isItemType.bind(null, List.ListProps.Type.ITEM);
      var isCustomItem = List.isItemType.bind(null, List.ListProps.Type.CUSTOM);

      _this.setState(function (prevState) {
        var currentSelection = prevState.selected;
        var nextSelection;

        if (isSelectAll) {
          nextSelection = _this.props.data.filter(function (item) {
            return (isItem(item) || isCustomItem(item)) && !item.disabled;
          });
          nextSelection.filter(function (item) {
            return !_this.props.selected.find(function (selectedItem) {
              return item.key === selectedItem.key;
            });
          }).forEach(function (item) {
            _this.props.onSelect && _this.props.onSelect(item);
          });
        } else {
          nextSelection = [];
          currentSelection.forEach(function (item) {
            _this.props.onDeselect && _this.props.onDeselect(item);
          });
        }

        _this.props.onChange(nextSelection, event);

        return {
          filterValue: '',
          selected: nextSelection,
          selectedIndex: isSelectAll ? _this._getSelectedIndex(nextSelection, _this.props.data) : null,
          shownData: prevState.shownData.map(function (item) {
            return _objectSpread2(_objectSpread2({}, item), {}, {
              checkbox: isSelectAll
            });
          }),
          multipleMap: isSelectAll ? buildMultipleMap(_this.props.data.filter(function (item) {
            return !item.disabled;
          })) : {}
        };
      }, _this._redrawPopup);
    });

    _defineProperty(_assertThisInitialized(_this), "_onCloseAttempt", function (event, isEsc) {
      if (_this.isInputMode()) {
        if (!_this.props.allowAny) {
          if (_this.props.hideSelected || !_this.state.selected || _this.props.multiple) {
            _this.clearFilter();
          } else if (_this.state.selected) {
            _this.filterValue(getItemLabel(_this.state.selected));
          }
        }
      }

      var isTagRemoved = _this.props.tags && event && event.target && event.target.matches('[data-test="ring-tag-remove"]');

      if (!isTagRemoved) {
        _this._hidePopup(isEsc);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "clearFilter", function (e) {
      _this._setFilter('', e);
    });

    _defineProperty(_assertThisInitialized(_this), "clear", function (event) {
      if (event) {
        event.stopPropagation();
      }

      var empty = Select._getEmptyValue(_this.props.multiple);

      _this.setState({
        selected: empty,
        selectedIndex: null,
        filterValue: ''
      }, function () {
        if (_this.props.onChange) {
          _this.props.onChange(empty, event);
        }
      });

      return false;
    });

    _defineProperty(_assertThisInitialized(_this), "popupRef", function (el) {
      _this._popup = el;
    });

    _defineProperty(_assertThisInitialized(_this), "buttonRef", function (el) {
      _this.button = el;
    });

    _defineProperty(_assertThisInitialized(_this), "filterRef", function (el) {
      _this.filter = el;
    });

    return _this;
  }

  _createClass(Select, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$state = this.state,
          showPopup = _this$state.showPopup,
          selected = _this$state.selected;
      var _this$props = this.props,
          onClose = _this$props.onClose,
          onOpen = _this$props.onOpen,
          onChange = _this$props.onChange,
          multiple = _this$props.multiple;

      if (prevState.showPopup && !showPopup) {
        onClose(selected);
      } else if (!prevState.showPopup && showPopup) {
        onOpen();
      }

      if (multiple !== prevProps.multiple && !deepEqual(multiple, prevProps.multiple)) {
        onChange(selected);
      }
    }
  }, {
    key: "getValueForFilter",
    value: function getValueForFilter(selected) {
      return _getValueForFilter(selected, this.props.type, this.state.filterValue);
    }
  }, {
    key: "_getSelectedIndex",
    value: function _getSelectedIndex(selected, data) {
      return getSelectedIndex(selected, data, this.props.multiple);
    }
  }, {
    key: "_getResetOption",
    value: function _getResetOption() {
      var _this2 = this;

      var isOptionsSelected = this.state.selected && this.state.selected.length;
      var hasTagsResetProp = this.props.tags && this.props.tags.reset;

      if (!isOptionsSelected || !hasTagsResetProp) {
        return null;
      }

      var reset = this.props.tags.reset;

      var resetHandler = function resetHandler(item, event) {
        _this2.clear(event);

        _this2.clearFilter();

        _this2.props.onFilter('');

        _this2.setState(function (prevState) {
          return {
            shownData: prevState.shownData.slice(reset.separator ? 2 : 1),
            multipleMap: {}
          };
        });

        _this2._redrawPopup();
      };

      return {
        isResetItem: true,
        separator: reset.separator,
        key: reset.label,
        rgItemType: List.ListProps.Type.CUSTOM,
        template: /*#__PURE__*/React.createElement(Button, {
          text: true,
          className: styles$1.button,
          "data-test": "ring-select-reset-tags-button"
        }, reset.label),
        glyph: reset.glyph,
        onClick: resetHandler
      };
    }
  }, {
    key: "_prependResetOption",
    value: function _prependResetOption(shownData) {
      var resetOption = this._getResetOption();

      var margin = {
        rgItemType: List.ListProps.Type.MARGIN
      };

      if (resetOption) {
        var resetItems = [margin, resetOption, margin];

        if (resetOption.separator) {
          resetItems.push({
            rgItemType: List.ListProps.Type.SEPARATOR
          });
        }

        return resetItems.concat(shownData);
      }

      return shownData;
    }
  }, {
    key: "_renderPopup",
    value: function _renderPopup() {
      var anchorElement = this.props.targetElement || this.node;
      var _this$state2 = this.state,
          showPopup = _this$state2.showPopup,
          shownData = _this$state2.shownData;

      var _shownData = this._prependResetOption(shownData);

      var message = null;

      if (this.props.loading) {
        message = this.props.loadingMessage;
      } else if (!shownData.length) {
        message = this.props.notFoundMessage;
      }

      return /*#__PURE__*/React.createElement(SelectPopup, {
        data: _shownData,
        message: message,
        toolbar: showPopup && this.getToolbar(),
        loading: this.props.loading,
        activeIndex: this.state.selectedIndex,
        hidden: !showPopup,
        ref: this.popupRef,
        maxHeight: this.props.maxHeight,
        minWidth: this.props.minWidth,
        directions: this.props.directions,
        className: this.props.popupClassName,
        style: this.props.popupStyle,
        top: this.props.top,
        left: this.props.left,
        filter: this.isInputMode() ? false : this.props.filter // disable popup filter in INPUT mode
        ,
        multiple: this.props.multiple,
        filterValue: this.state.filterValue,
        anchorElement: anchorElement,
        onCloseAttempt: this._onCloseAttempt,
        onSelect: this._listSelectHandler,
        onSelectAll: this._listSelectAllHandler,
        onFilter: this._filterChangeHandler,
        onClear: this.clearFilter,
        onLoadMore: this.props.onLoadMore,
        isInputMode: this.isInputMode(),
        selected: this.state.selected,
        tags: this.props.tags,
        compact: this.props.compact,
        renderOptimization: this.props.renderOptimization,
        ringPopupTarget: this.props.ringPopupTarget,
        disableMoveOverflow: this.props.disableMoveOverflow,
        disableScrollToActive: this.props.disableScrollToActive,
        dir: this.props.dir,
        onEmptyPopupEnter: this.onEmptyPopupEnter,
        listId: this.listId
      });
    }
  }, {
    key: "_showPopup",
    value: function _showPopup() {
      if (!this.node) {
        return;
      }

      var shownData = this.getListItems(this.filterValue());
      this.setState({
        showPopup: !!shownData.length || !this.props.allowAny,
        shownData: shownData
      });
    }
  }, {
    key: "_hidePopup",
    value: function _hidePopup(tryFocusAnchor) {
      if (this.node && this.state.showPopup) {
        this.setState({
          showPopup: false,
          filterValue: ''
        });

        if (tryFocusAnchor) {
          var restoreFocusNode = this.props.targetElement || this.node.querySelector('[data-test~=ring-select__focus]');

          if (restoreFocusNode) {
            restoreFocusNode.focus();
          }
        }
      }
    }
  }, {
    key: "getToolbar",
    value: function getToolbar() {
      var hint = this.props.hint;

      var _ref2 = this.state.addButton || {},
          prefix = _ref2.prefix,
          label = _ref2.label,
          delayed = _ref2.delayed;

      var isToolbarHasElements = this.state.addButton || hint;

      if (!isToolbarHasElements) {
        return null;
      }

      return /*#__PURE__*/React.createElement("div", {
        className: classNames(_defineProperty({}, styles$1.toolbar, !!this.state.addButton)),
        "data-test": "ring-select-toolbar"
      }, this.state.addButton && /*#__PURE__*/React.createElement(Button, {
        text: true,
        delayed: delayed,
        className: classNames(styles$1.button, styles$1.buttonSpaced),
        onClick: this.addHandler,
        "data-test": "ring-select-toolbar-button"
      }, prefix ? "".concat(prefix, " ").concat(label) : label), hint && /*#__PURE__*/React.createElement(List.ListHint, {
        label: hint,
        "data-test": "ring-select-toolbar-hint"
      }));
    }
  }, {
    key: "getFilterFn",
    value: function getFilterFn() {
      return _getFilterFn(this.props.filter);
    }
  }, {
    key: "getListItems",
    value: function getListItems(rawFilterString, data) {
      var _getListItems2 = _getListItems(this.props, this.state, rawFilterString, data),
          filteredData = _getListItems2.filteredData,
          addButton = _getListItems2.addButton;

      this.setState({
        addButton: addButton
      });
      return filteredData;
    }
  }, {
    key: "filterValue",
    value: function filterValue(setValue) {
      if (typeof setValue === 'string' || typeof setValue === 'number') {
        this.setState({
          filterValue: setValue
        });
      } else {
        return this.state.filterValue;
      }

      return undefined;
    }
  }, {
    key: "isInputMode",
    value: function isInputMode() {
      return _isInputMode(this.props.type);
    }
  }, {
    key: "_rebuildMultipleMap",
    value: function _rebuildMultipleMap(selected, multiple) {
      if (selected && multiple) {
        this.setState({
          multipleMap: buildMultipleMap(selected)
        });
      }
    }
  }, {
    key: "_selectionIsEmpty",
    value: function _selectionIsEmpty() {
      return this.props.multiple && !this.state.selected.length || !this.state.selected;
    }
  }, {
    key: "_getLabel",
    value: function _getLabel() {
      return this.props.label || this.props.selectedLabel || 'Select an option';
    }
  }, {
    key: "_getSelectedString",
    value: function _getSelectedString() {
      if (this.props.multiple) {
        var labels = [];

        for (var i = 0; i < this.state.selected.length; i++) {
          labels.push(getItemLabel(this.state.selected[i]));
        }

        return labels.filter(Boolean).join(', ');
      } else {
        return getItemLabel(this.state.selected);
      }
    }
  }, {
    key: "_getIcons",
    value: function _getIcons() {
      var selected = this.state.selected;
      var _this$props2 = this.props,
          disabled = _this$props2.disabled,
          clear = _this$props2.clear,
          hideArrow = _this$props2.hideArrow;
      var icons = [];

      if (selected === null || selected === void 0 ? void 0 : selected.icon) {
        icons.push( /*#__PURE__*/React.createElement("button", {
          title: "Toggle options popup",
          type: "button",
          className: styles$1.selectedIcon,
          key: "selected",
          onClick: this._clickHandler,
          style: {
            backgroundImage: "url(".concat(selected.icon, ")")
          }
        }));
      }

      if (clear && !disabled && !this._selectionIsEmpty()) {
        icons.push( /*#__PURE__*/React.createElement(Button, {
          title: "Clear selection",
          "data-test": "ring-clear-select",
          className: styles$1.clearIcon,
          key: "close",
          onClick: this.clear,
          icon: closeIcon
        }));
      }

      if (!hideArrow) {
        icons.push( /*#__PURE__*/React.createElement(Button, {
          title: "Toggle options popup",
          className: styles$1.chevron,
          iconClassName: styles$1.chevronIcon,
          icon: chevronDown,
          key: "hide",
          onClick: this._clickHandler
        }));
      }

      return icons;
    }
  }, {
    key: "_getAvatar",
    value: function _getAvatar() {
      return this.state.selected && this.state.selected.avatar && /*#__PURE__*/React.createElement(Avatar, {
        className: styles$1.avatar,
        url: this.state.selected.avatar,
        size: Size$1.Size20
      });
    }
  }, {
    key: "getShortcutsMap",
    value: function getShortcutsMap() {
      return {
        enter: this._onEnter,
        esc: this._onEsc,
        up: this._inputShortcutHandler,
        down: this._inputShortcutHandler,
        right: noop$2,
        left: noop$2,
        'shift+up': noop$2,
        'shift+down': noop$2,
        space: noop$2
      };
    }
  }, {
    key: "renderSelect",
    value: function renderSelect(activeItemId) {
      var _classNames2,
          _this3 = this,
          _classNames4;

      var dataTest = this.props['data-test'];
      var shortcutsEnabled = this.state.shortcutsEnabled;
      var classes = classNames(styles$1.select, 'ring-js-shortcuts', this.props.className, (_classNames2 = {}, _defineProperty(_classNames2, styles$1["size".concat(this.props.size)], this.props.type !== Type.INLINE), _defineProperty(_classNames2, styles$1.disabled, this.props.disabled), _classNames2));

      var icons = this._getIcons();

      var style = getStyle(icons.length);
      var iconsNode = /*#__PURE__*/React.createElement("span", {
        className: styles$1.icons
      }, icons);
      var ariaProps = this.state.showPopup ? {
        'aria-owns': this.listId,
        'aria-activedescendant': activeItemId
      } : {};

      switch (this.props.type) {
        case Type.INPUT_WITHOUT_CONTROLS:
        case Type.INPUT:
          return /*#__PURE__*/React.createElement("div", {
            ref: this.nodeRef,
            className: classNames(classes, styles$1.inputMode),
            "data-test": joinDataTestAttributes('ring-select', dataTest)
          }, shortcutsEnabled && /*#__PURE__*/React.createElement(Shortcuts, {
            map: this.getShortcutsMap(),
            scope: this.shortcutsScope
          }), /*#__PURE__*/React.createElement(Input, _extends({}, ariaProps, {
            autoComplete: "off",
            id: this.props.id,
            onClick: this._clickHandler,
            inputRef: this.filterRef,
            disabled: this.props.disabled,
            value: this.state.filterValue,
            borderless: this.props.type === Type.INPUT_WITHOUT_CONTROLS,
            style: style,
            size: Size.FULL,
            onChange: this._filterChangeHandler,
            onFocus: this._focusHandler,
            onBlur: this._blurHandler,
            label: this.props.type === Type.INPUT ? this._getLabel() : null,
            placeholder: this.props.inputPlaceholder,
            onKeyDown: this.props.onKeyDown,
            "data-test": "ring-select__focus"
          })), this.props.type === Type.INPUT && iconsNode, this._renderPopup());

        case Type.BUTTON:
          return /*#__PURE__*/React.createElement("div", {
            ref: this.nodeRef,
            className: classNames(classes, styles$1.buttonMode),
            "data-test": joinDataTestAttributes('ring-select', dataTest)
          }, shortcutsEnabled && /*#__PURE__*/React.createElement(Shortcuts, {
            map: this.getShortcutsMap(),
            scope: this.shortcutsScope
          }), /*#__PURE__*/React.createElement(ThemeContext.Consumer, null, function (contextTheme) {
            return /*#__PURE__*/React.createElement("div", _extends({}, ariaProps, {
              id: _this3.props.id,
              onClick: _this3._clickHandler,
              onKeyPress: _this3._selectButtonKeyboardHack,
              className: classNames(buttonStyles.button, buttonStyles[_this3.props.theme || contextTheme || Theme.LIGHT], styles$1.buttonValue, _defineProperty({}, styles$1.buttonValueOpen, _this3.state.showPopup)),
              role: "button",
              tabIndex: 0,
              disabled: _this3.props.disabled,
              style: style,
              "data-test": "ring-select__button ring-select__focus"
            }), _this3._getAvatar(), _this3._selectionIsEmpty() ? _this3._getLabel() : _this3._getSelectedString(), iconsNode);
          }), this._renderPopup());

        case Type.MATERIAL:
          return /*#__PURE__*/React.createElement("div", {
            ref: this.nodeRef,
            className: classNames(classes, styles$1.materialMode),
            "data-test": joinDataTestAttributes('ring-select', dataTest)
          }, shortcutsEnabled && /*#__PURE__*/React.createElement(Shortcuts, {
            map: this.getShortcutsMap(),
            scope: this.shortcutsScope
          }), !this._selectionIsEmpty() && this.props.selectedLabel && /*#__PURE__*/React.createElement("span", {
            className: styles$1.selectedLabel
          }, this.props.selectedLabel), /*#__PURE__*/React.createElement("button", _extends({}, ariaProps, {
            id: this.props.id,
            onClick: this._clickHandler,
            type: "button",
            disabled: this.props.disabled,
            className: classNames(styles$1.value, (_classNames4 = {}, _defineProperty(_classNames4, styles$1.open, this.state.showPopup), _defineProperty(_classNames4, styles$1.label, this._selectionIsEmpty()), _classNames4)),
            "aria-label": this._getLabel(),
            style: style,
            "data-test": "ring-select__focus",
            ref: this.buttonRef
          }), this._getAvatar(), this._selectionIsEmpty() ? this._getLabel() : this._getSelectedString()), iconsNode, this._renderPopup());

        case Type.INLINE:
          return /*#__PURE__*/React.createElement("div", {
            className: classes,
            ref: this.nodeRef,
            "data-test": joinDataTestAttributes('ring-select', dataTest)
          }, shortcutsEnabled && /*#__PURE__*/React.createElement(Shortcuts, {
            map: this.getShortcutsMap(),
            scope: this.shortcutsScope
          }), /*#__PURE__*/React.createElement(Anchor, _extends({}, ariaProps, {
            id: this.props.id,
            onClick: this._clickHandler,
            "data-test": "ring-select__focus",
            disabled: this.props.disabled,
            active: this.state.showPopup
          }), this._selectionIsEmpty() ? this._getLabel() : this._getSelectedString()), this._renderPopup());

        default:
          if (this.props.customAnchor) {
            return /*#__PURE__*/React.createElement(Fragment, null, shortcutsEnabled && /*#__PURE__*/React.createElement(Shortcuts, {
              map: this.getShortcutsMap(),
              scope: this.shortcutsScope
            }), this.props.customAnchor({
              wrapperProps: {
                ref: this.nodeRef,
                'data-test': joinDataTestAttributes('ring-select', dataTest)
              },
              buttonProps: _objectSpread2(_objectSpread2({}, ariaProps), {}, {
                id: this.props.id,
                onClick: this._clickHandler,
                disabled: this.props.disabled,
                children: this._selectionIsEmpty() ? this._getLabel() : this._getSelectedString(),
                'data-test': 'ring-select_focus'
              }),
              popup: this._renderPopup()
            }));
          }

          return /*#__PURE__*/React.createElement("span", {
            id: this.props.id,
            ref: this.nodeRef,
            "data-test": "ring-select"
          }, this._renderPopup());
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      return /*#__PURE__*/React.createElement(ActiveItemContext.Provider, null, /*#__PURE__*/React.createElement(ActiveItemContext.ValueContext.Consumer, null, function (activeItemId) {
        return _this4.renderSelect(activeItemId);
      }));
    }
  }], [{
    key: "_getEmptyValue",
    value: function _getEmptyValue(multiple) {
      return multiple ? [] : null;
    }
  }, {
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var multiple = nextProps.multiple,
          data = nextProps.data,
          type = nextProps.type;
      var prevSelected = prevState.prevSelected,
          prevData = prevState.prevData,
          prevMultiple = prevState.prevMultiple,
          filterValue = prevState.filterValue;
      var nextState = {
        prevData: data,
        prevSelected: nextProps.selected,
        prevMultiple: multiple
      };

      if ('data' in nextProps && data !== prevData) {
        var _getListItems3 = _getListItems(nextProps, prevState, filterValue, data),
            filteredData = _getListItems3.filteredData,
            addButton = _getListItems3.addButton;

        Object.assign(nextState, {
          shownData: filteredData,
          addButton: addButton
        });

        if (prevState.selected) {
          Object.assign(nextState, {
            selectedIndex: getSelectedIndex(prevState.selected, data, multiple),
            prevFilterValue: _getValueForFilter(prevState.selected, type, filterValue)
          });
        }
      }

      if ('selected' in nextProps && nextProps.selected !== prevSelected) {
        var _selected = nextProps.selected || Select._getEmptyValue(multiple);

        var selectedIndex = getSelectedIndex(_selected, data || prevData, multiple);
        Object.assign(nextState, {
          selected: _selected,
          prevFilterValue: _getValueForFilter(_selected, type, filterValue)
        });

        if (!multiple || !isSameSelected(prevSelected, _selected)) {
          Object.assign(nextState, {
            selectedIndex: selectedIndex
          });
        }
      }

      if (prevMultiple !== multiple && !deepEqual(prevMultiple, multiple)) {
        nextState.selected = Select._getEmptyValue(multiple);
      }

      var _prevState$nextState = _objectSpread2(_objectSpread2({}, prevState), nextState),
          selected = _prevState$nextState.selected;

      if (selected && multiple) {
        nextState.multipleMap = buildMultipleMap(selected);

        var _getListItems4 = _getListItems(nextProps, nextState, filterValue, data),
            _filteredData = _getListItems4.filteredData,
            _addButton = _getListItems4.addButton;

        Object.assign(nextState, {
          shownData: _filteredData,
          addButton: _addButton
        });
      }

      return nextState;
    }
  }]);

  return Select;
}(Component);

_defineProperty(Select, "propTypes", {
  className: PropTypes.string,
  id: PropTypes.string,
  multiple: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  allowAny: PropTypes.bool,
  filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  getInitial: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  onDone: PropTypes.func,
  onFilter: PropTypes.func,
  onChange: PropTypes.func,
  onReset: PropTypes.func,
  onLoadMore: PropTypes.func,
  onAdd: PropTypes.func,
  onBeforeOpen: PropTypes.func,
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  selected: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  data: PropTypes.array,
  tags: PropTypes.object,
  targetElement: PropTypes.object,
  loading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  notFoundMessage: PropTypes.string,
  maxHeight: PropTypes.number,
  minWidth: PropTypes.number,
  directions: PropTypes.array,
  popupClassName: PropTypes.string,
  popupStyle: PropTypes.object,
  top: PropTypes.number,
  left: PropTypes.number,
  renderOptimization: PropTypes.bool,
  ringPopupTarget: PropTypes.string,
  hint: List.ListHint.propTypes.label,
  add: PropTypes.object,
  type: PropTypes.oneOf(Object.values(Type)),
  disabled: PropTypes.bool,
  hideSelected: PropTypes.bool,
  label: PropTypes.string,
  selectedLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  inputPlaceholder: PropTypes.string,
  clear: PropTypes.bool,
  hideArrow: PropTypes.bool,
  compact: PropTypes.bool,
  size: PropTypes.oneOf(Object.values(Size)),
  theme: PropTypes.string,
  customAnchor: PropTypes.func,
  disableMoveOverflow: PropTypes.bool,
  disableScrollToActive: PropTypes.bool,
  dir: PropTypes.oneOf(['ltr', 'rtl']),
  'data-test': PropTypes.string
});

_defineProperty(Select, "defaultProps", {
  data: [],
  filter: false,
  // enable filter (not in INPUT modes)
  multiple: false,
  // multiple can be an object - see demo for more information
  clear: false,
  // enable clear button that clears the "selected" state
  loading: false,
  // show a loading indicator while data is loading
  disabled: false,
  // disable select
  loadingMessage: 'Loading...',
  notFoundMessage: 'No options found',
  type: Type.MATERIAL,
  size: Size.M,
  targetElement: null,
  // element to bind the popup to (select BUTTON or INPUT by default)
  hideSelected: false,
  // INPUT mode: clears the input after an option is selected (useful when the selection is displayed in some custom way elsewhere)
  allowAny: false,
  // INPUT mode: allows any value to be entered, hides the dropdown icon
  hideArrow: false,
  // hide dropdown arrow icon
  maxHeight: 600,
  // height of the options list, including the filter and the 'Add' button
  directions: [Popup.PopupProps.Directions.BOTTOM_RIGHT, Popup.PopupProps.Directions.BOTTOM_LEFT, Popup.PopupProps.Directions.TOP_LEFT, Popup.PopupProps.Directions.TOP_RIGHT],
  selected: null,
  // current selection (item / array of items)
  label: '',
  // BUTTON or INPUT label (nothing selected)
  selectedLabel: '',
  // BUTTON or INPUT label (something selected)
  inputPlaceholder: '',
  // Placeholder for input modes
  hint: null,
  // hint text to display under the list
  shortcutsEnabled: false,
  onBeforeOpen: noop$2,
  onLoadMore: noop$2,
  onOpen: noop$2,
  onClose: noop$2,
  onFilter: noop$2,
  // search string as first argument
  onFocus: noop$2,
  onBlur: noop$2,
  onKeyDown: noop$2,
  onSelect: noop$2,
  // single + multi
  onDeselect: noop$2,
  // multi
  onChange: noop$2,
  // multi
  onAdd: noop$2,
  // search string as first argument
  onDone: noop$2,
  onReset: noop$2,
  tags: null,
  onRemoveTag: noop$2,
  ringPopupTarget: null,
  dir: 'ltr'
});

_defineProperty(Select, "Type", Type);

_defineProperty(Select, "Size", Size);

_defineProperty(Select, "Theme", Theme);
var RerenderableSelect = rerenderHOC(Select);

export default Select;
export { RerenderableSelect };
