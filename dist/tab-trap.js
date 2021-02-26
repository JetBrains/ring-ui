import { _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, k as _toConsumableArray, c as _createClass, e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { i as isNodeInVisiblePartOfPage } from './dom-0ae85140.js';
import styleInject from 'style-inject';

var css_248z = "/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.tab-trap_trapButton__HmzWW {\n  position: absolute;\n  left: -9999px;\n}\n";
var styles = {"trapButton":"tab-trap_trapButton__HmzWW"};
styleInject(css_248z);

var FOCUSABLE_ELEMENTS = 'input, button, select, textarea, a[href], *[tabindex]:not([data-trap-button]):not([data-scrollable-container])';
/**
 * @name TabTrap
 */

var TabTrap = /*#__PURE__*/function (_Component) {
  _inherits(TabTrap, _Component);

  var _super = _createSuper(TabTrap);

  function TabTrap() {
    var _this;

    _classCallCheck(this, TabTrap);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "restoreFocus", function () {
      var _assertThisInitialize = _assertThisInitialized(_this),
          previousFocusedNode = _assertThisInitialize.previousFocusedNode;

      if (previousFocusedNode && previousFocusedNode.focus && isNodeInVisiblePartOfPage(previousFocusedNode)) {
        previousFocusedNode.focus({
          preventScroll: true
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "containerRef", function (node) {
      if (!node) {
        return;
      }

      _this.node = node;
    });

    _defineProperty(_assertThisInitialized(_this), "focusElement", function () {
      var first = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var _assertThisInitialize2 = _assertThisInitialized(_this),
          node = _assertThisInitialize2.node;

      if (!node) {
        return;
      }

      var tabables = _toConsumableArray(node.querySelectorAll(FOCUSABLE_ELEMENTS)).filter(function (item) {
        return item.tabIndex >= 0;
      });

      var toBeFocused = first ? tabables[0] : tabables[tabables.length - 1];

      if (toBeFocused) {
        toBeFocused.focus();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "focusFirst", function () {
      return _this.focusElement(true);
    });

    _defineProperty(_assertThisInitialized(_this), "focusLast", function () {
      return _this.focusElement(false);
    });

    _defineProperty(_assertThisInitialized(_this), "focusLastIfEnabled", function (event) {
      if (_this.trapWithoutFocus) {
        return;
      }

      if (_this.props.focusBackOnExit) {
        var prevFocused = event.nativeEvent.relatedTarget;

        if (prevFocused != null && _this.node != null && _this.node.contains(prevFocused)) {
          _this.restoreFocus();
        }
      } else {
        _this.focusLast();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleBlurIfWithoutFocus", function (event) {
      if (!_this.trapWithoutFocus) {
        return;
      }

      _this.trapWithoutFocus = false;
      var newFocused = event.nativeEvent.relatedTarget;

      if (!newFocused) {
        return;
      }

      if (_this.node.contains(newFocused)) {
        return;
      }

      _this.focusLast();
    });

    _defineProperty(_assertThisInitialized(_this), "trapButtonRef", function (node) {
      if (!node) {
        return;
      }

      _this.trapButtonNode = node;
    });

    return _this;
  }

  _createClass(TabTrap, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.previousFocusedNode = document.activeElement;

      if (this.props.autoFocusFirst) {
        this.focusFirst();
      } else if (!this.props.trapDisabled && (!this.node || !this.node.contains(this.previousFocusedNode))) {
        this.trapWithoutFocus = true;
        this.trapButtonNode.focus();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.focusBackOnClose) {
        this.restoreFocus();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          trapDisabled = _this$props.trapDisabled;
          _this$props.autoFocusFirst;
          _this$props.focusBackOnClose;
          var focusBackOnExit = _this$props.focusBackOnExit,
          restProps = _objectWithoutProperties(_this$props, ["children", "trapDisabled", "autoFocusFirst", "focusBackOnClose", "focusBackOnExit"]);

      if (trapDisabled) {
        return /*#__PURE__*/React.createElement("div", _extends({
          ref: this.containerRef
        }, restProps), children);
      }

      return /*#__PURE__*/React.createElement("div", _extends({
        ref: this.containerRef
      }, restProps), /*#__PURE__*/React.createElement("div", {
        // It never actually stays focused
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex: 0,
        ref: this.trapButtonRef,
        className: styles.trapButton,
        onFocus: this.focusLastIfEnabled,
        onBlur: this.handleBlurIfWithoutFocus,
        "data-trap-button": true
      }), children, /*#__PURE__*/React.createElement("div", {
        // It never actually stays focused
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex: 0,
        onFocus: focusBackOnExit ? this.restoreFocus : this.focusFirst,
        "data-trap-button": true
      }));
    }
  }]);

  return TabTrap;
}(Component);

_defineProperty(TabTrap, "propTypes", {
  children: PropTypes.node.isRequired,
  trapDisabled: PropTypes.bool,
  autoFocusFirst: PropTypes.bool,
  focusBackOnClose: PropTypes.bool,
  focusBackOnExit: PropTypes.bool
});

_defineProperty(TabTrap, "defaultProps", {
  trapDisabled: false,
  autoFocusFirst: true,
  focusBackOnClose: true,
  focusBackOnExit: false
});

export default TabTrap;
export { FOCUSABLE_ELEMENTS };
