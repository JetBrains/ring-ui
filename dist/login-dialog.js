import { _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, c as _createClass } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from './dialog.js';
import { Content as ContentWrapper } from './island.js';
import LoaderScreen from './loader-screen.js';
import { H as HUB_AUTH_PAGE_OPENED } from './background-flow-9ba3b146.js';
import styleInject from 'style-inject';
import 'react-dom';
import 'classnames';
import '@jetbrains/icons/close';
import './get-uid-bf3ab014.js';
import './data-tests-1a367745.js';
import './shortcuts.js';
import 'combokeys';
import './sniffer-c9d1f40e.js';
import 'sniffr';
import './tab-trap.js';
import './dom-0ae85140.js';
import './button-c0bc1992.js';
import 'focus-visible';
import '@jetbrains/icons/chevron-10px';
import './icon.js';
import 'util-deprecate';
import './memoize-ad2c954c.js';
import './theme-9a053da9.js';
import './clickableLink-3fc5662b.js';
import './popup.target-9daf0591.js';
import 'scrollbar-width';
import './linear-function-3bd43cfe.js';
import 'element-resize-detector';
import './schedule-raf-edeb21db.js';
import './loader.js';
import 'es6-error';
import './url-a3cbb96f.js';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.login-dialog_iFrame__1iKm8 {\n  overflow: hidden;\n\n  border: none;\n}\n\n.login-dialog_dialogContent__3dzCu {\n  width: auto;\n}\n\n.login-dialog_nonOpaqueLoader__2ql_g {\n  background-color: #fff;\n  background-color: var(--ring-content-background-color);\n}\n\n.login-dialog_fallbackLinkContainer__3Fa7b {\n  position: absolute;\n  top: 0;\n  right: 0;\n\n  padding: 8px;\n}\n";
var styles = {"unit":"8px","iFrame":"login-dialog_iFrame__1iKm8","dialogContent":"login-dialog_dialogContent__3dzCu","nonOpaqueLoader":"login-dialog_nonOpaqueLoader__2ql_g","fallbackLinkContainer":"login-dialog_fallbackLinkContainer__3Fa7b"};
styleInject(css_248z);

var HUB_AUTH_PAGE_LOGIN_STARTED = 'HUB_AUTH_PAGE_LOGIN_STARTED';
var HUB_AUTH_PAGE_LOGIN_DIMENSIONS = 'HUB_AUTH_PAGE_LOGIN_DIMENSIONS';
var DEFAULT_HEIGHT = 517;
var DEFAULT_WIDTH = 333;
var DEFAULT_SHOW_FALLBACK_TIMEOUT = 5000;
/**
 * @name Login Dialog
 */

var LoginDialog = /*#__PURE__*/function (_Component) {
  _inherits(LoginDialog, _Component);

  var _super = _createSuper(LoginDialog);

  function LoginDialog() {
    var _this;

    _classCallCheck(this, LoginDialog);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      loading: true,
      loggingIn: false,
      showFallbackLink: false,
      height: DEFAULT_HEIGHT,
      width: DEFAULT_WIDTH
    });

    _defineProperty(_assertThisInitialized(_this), "onMessage", function (event) {
      var data = event.data;

      if (!data) {
        return;
      }

      if (data === HUB_AUTH_PAGE_OPENED) {
        clearTimeout(_this.showFallbackTimout);

        _this.setState({
          loading: false,
          loggingIn: false
        });

        return;
      }

      if (data === HUB_AUTH_PAGE_LOGIN_STARTED) {
        _this.setState({
          loading: true,
          loggingIn: true
        });

        _this.startFallbackCountdown();

        return;
      }

      if (data.message === HUB_AUTH_PAGE_LOGIN_DIMENSIONS) {
        _this.setState({
          height: data.height,
          width: data.width
        });
      }
    });

    return _this;
  }

  _createClass(LoginDialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener('message', this.onMessage);
      this.startFallbackCountdown();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('message', this.onMessage);
    }
  }, {
    key: "startFallbackCountdown",
    value: function startFallbackCountdown() {
      var _this2 = this;

      this.showFallbackTimout = setTimeout(function () {
        return _this2.setState({
          showFallbackLink: true
        });
      }, this.props.showFallbackTimeout);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          show = _this$props.show,
          className = _this$props.className,
          url = _this$props.url,
          loadingMessage = _this$props.loadingMessage,
          renderFallbackLink = _this$props.renderFallbackLink,
          onCancel = _this$props.onCancel;
      var _this$state = this.state,
          loading = _this$state.loading,
          height = _this$state.height,
          width = _this$state.width,
          loggingIn = _this$state.loggingIn,
          showFallbackLink = _this$state.showFallbackLink;
      var iFrameStyle = {
        height: height,
        width: width
      };
      return /*#__PURE__*/React.createElement(Dialog, {
        "data-test": "ring-login-dialog",
        className: className,
        contentClassName: styles.dialogContent,
        trapFocus: true,
        autoFocusFirst: false,
        show: show,
        showCloseButton: true,
        onCloseAttempt: onCancel
      }, /*#__PURE__*/React.createElement(ContentWrapper, null, /*#__PURE__*/React.createElement("iframe", {
        title: "Login dialog",
        style: iFrameStyle,
        src: url,
        className: styles.iFrame,
        scrolling: "no"
      })), loading && /*#__PURE__*/React.createElement(LoaderScreen, {
        message: loadingMessage,
        containerClassName: styles.nonOpaqueLoader
      }), showFallbackLink && /*#__PURE__*/React.createElement("div", {
        className: styles.fallbackLinkContainer
      }, renderFallbackLink(loggingIn)));
    }
  }]);

  return LoginDialog;
}(Component);

_defineProperty(LoginDialog, "propTypes", {
  show: PropTypes.bool,
  className: PropTypes.string,
  url: PropTypes.string,
  loader: PropTypes.bool,
  loadingMessage: PropTypes.string,
  showFallbackTimeout: PropTypes.number,
  renderFallbackLink: PropTypes.func,
  onCancel: PropTypes.func.isRequired
});

_defineProperty(LoginDialog, "defaultProps", {
  show: false,
  url: 'about:blank',
  renderFallbackLink: function renderFallbackLink() {
    return null;
  },
  showFallbackTimeout: DEFAULT_SHOW_FALLBACK_TIMEOUT
});

export default LoginDialog;
