import { _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass, d as _defineProperty, e as _objectWithoutProperties, f as _extends, i as _objectSpread2, g as _assertThisInitialized, l as _asyncToGenerator, k as _toConsumableArray } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent, Children, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { w as withTheme, T as Theme } from './theme-9a053da9.js';
import styleInject from 'style-inject';
import Icon, { Size } from './icon.js';
import { B as Button } from './button-c0bc1992.js';
import Avatar, { Size as Size$1 } from './avatar.js';
import Dropdown from './dropdown.js';
import PopupMenu from './popup-menu.js';
import Auth, { USER_CHANGED_EVENT, LOGOUT_POSTPONED_EVENT, USER_CHANGE_POSTPONED_EVENT } from './auth.js';
import alertService from './alert-service.js';
import servicesIcon from '@jetbrains/icons/services-20px';
import { P as Popup } from './popup-442f4003.js';
import Link from './link.js';
import HTTP from './http.js';
import 'util-deprecate';
import './memoize-ad2c954c.js';
import 'focus-visible';
import '@jetbrains/icons/chevron-10px';
import './clickableLink-3fc5662b.js';
import './url-a3cbb96f.js';
import './dom-0ae85140.js';
import './data-tests-1a367745.js';
import './list-2403b1cd.js';
import 'react-virtualized/dist/es/List';
import 'react-virtualized/dist/es/AutoSizer';
import 'react-virtualized/dist/es/WindowScroller';
import 'react-virtualized/dist/es/CellMeasurer';
import 'memoize-one';
import './get-uid-bf3ab014.js';
import './schedule-raf-edeb21db.js';
import './shortcuts.js';
import 'combokeys';
import './sniffer-c9d1f40e.js';
import 'sniffr';
import './checkbox.js';
import '@jetbrains/icons/checkmark';
import '@jetbrains/icons/remove-10px';
import './background-flow-9ba3b146.js';
import 'es6-error';
import './alert.js';
import '@jetbrains/icons/exception';
import '@jetbrains/icons/warning';
import '@jetbrains/icons/close';
import './loader-inline.js';
import 'conic-gradient';
import 'react-dom';
import './group.js';
import './storage.js';
import 'deep-equal';
import 'simply-uuid';
import './tab-trap.js';
import './popup.target-9daf0591.js';

var compose = function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return funcs.reduce(function (acc, func) {
    return function (arg) {
      return acc(func(arg));
    };
  }, function (arg) {
    return arg;
  });
};

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.header_light__pFuir {\n  background-color: transparent;\n}\n\n.header_dark__1mX-R {\n  color: #fff;\n  color: var(--ring-dark-text-color);\n  background-color: #000;\n  background-color: var(--ring-navigation-background-color)\n\n  /* override link */\n}\n\n.header_dark__1mX-R > a {\n    color: #888;\n    color: var(--ring-dark-secondary-color);\n  }\n\n.header_header__3b7Ca {\n  display: flex;\n  overflow: hidden;\n  align-items: center;\n\n  box-sizing: border-box;\n  height: 64px;\n\n  line-height: 61px\n}\n\n.header_header__3b7Ca > * {\n    display: inline-block;\n\n    box-sizing: border-box;\n    height: 64px;\n    padding: 0 12px 3px;\n  }\n\n.header_headerSpaced__PMLSF > *:first-child {\n    padding-left: 32px;\n  }\n\n.header_headerSpaced__PMLSF > *:last-child {\n    padding-right: 32px;\n  }\n\n.header_logo__2A4EQ {\n  display: inline-flex;\n  align-items: center;\n\n  height: 64px;\n\n  color: #000;\n\n  color: var(--ring-navigation-background-color);\n\n  line-height: normal\n}\n\n.header_logo__2A4EQ svg {\n    vertical-align: bottom;\n  }\n\n.header_tray__9Kd5k {\n  align-items: flex-end;\n\n  margin-left: auto;\n  padding: 0 0 3px;\n}\n\n/* override .header > * */\n\n.header_tray__9Kd5k.header_tray__9Kd5k {\n  display: flex;\n}\n\n.header_trayItemContent__1Ix3j {\n  height: 61px;\n}\n\n.header_icon__3u9hW {\n  width: 40px;\n\n  text-align: center;\n\n  vertical-align: top;\n}\n\n/* override button */\n\n.header_icon__3u9hW.header_icon__3u9hW {\n  height: 61px;\n\n  padding-top: 4px;\n\n  line-height: 61px;\n}\n\n.header_main__2qPH0 svg {\n  color: #008eff;\n  color: var(--ring-main-color);\n}\n\n.header_rotatable__2jXuO svg {\n  transition: transform 0.3s ease-out;\n  transform: rotate(0deg);\n  transform-origin: 50% 50%;\n}\n\n.header_rotated__8lidY svg {\n  transform: rotate(90deg);\n}\n\n.header_profileEmpty__WJhAm {\n  align-items: center;\n\n  width: auto;\n  height: 61px;\n  padding-left: 8px;\n\n  vertical-align: bottom;\n}\n\n/* override dropdown */\n\n.header_profileEmpty__WJhAm.header_profileEmpty__WJhAm {\n  display: inline-flex;\n}\n\n.header_profile__35U4t {\n\n  height: 61px;\n\n  cursor: pointer;\n}\n\n.header_avatarWrapper__3Rplb {\n\n  line-height: 0;\n}\n\n.header_hasUpdates__AIHYz {\n  position: relative\n}\n\n.header_hasUpdates__AIHYz::after {\n    position: absolute;\n    top: calc(15% - 5px);\n    right: calc(15% - 5px);\n\n    display: block;\n\n    width: 8px;\n    height: 8px;\n\n    content: '';\n\n    border: 1px solid #fff;\n\n    border: 1px solid var(--ring-dark-text-color);\n    border-radius: 50%;\n    background-color: #ff008c;\n    background-color: var(--ring-link-hover-color);\n  }\n";
var styles = {"unit":"8px","resetButton":"global_resetButton__WQfrm","height":"calc(8px * 8)","compensate":"3px","compensated":"calc(calc(8px * 8) - 3px)","light":"header_light__pFuir","dark":"header_dark__1mX-R","header":"header_header__3b7Ca","headerSpaced":"header_headerSpaced__PMLSF","logo":"header_logo__2A4EQ","tray":"header_tray__9Kd5k","trayItemContent":"header_trayItemContent__1Ix3j","icon":"header_icon__3u9hW","main":"header_main__2qPH0","rotatable":"header_rotatable__2jXuO","rotated":"header_rotated__8lidY","profileEmpty":"header_profileEmpty__WJhAm","profile":"header_profile__35U4t header_profileEmpty__WJhAm","avatarWrapper":"header_avatarWrapper__3Rplb global_resetButton__WQfrm","hasUpdates":"header_hasUpdates__AIHYz"};
styleInject(css_248z);

var Logo = /*#__PURE__*/function (_PureComponent) {
  _inherits(Logo, _PureComponent);

  var _super = _createSuper(Logo);

  function Logo() {
    _classCallCheck(this, Logo);

    return _super.apply(this, arguments);
  }

  _createClass(Logo, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          restProps = _objectWithoutProperties(_this$props, ["className"]);

      var classes = classNames(styles.logo, className);
      return /*#__PURE__*/React.createElement("div", {
        className: classes
      }, /*#__PURE__*/React.createElement(Icon, restProps));
    }
  }]);

  return Logo;
}(PureComponent);

_defineProperty(Logo, "propTypes", {
  className: PropTypes.string
});

_defineProperty(Logo, "defaultProps", {
  size: Size.Size48,
  suppressSizeWarning: true
});

_defineProperty(Logo, "Size", Size);

var wrapChild = function wrapChild(child) {
  return child && /*#__PURE__*/React.createElement("div", {
    className: styles.trayItem
  }, child);
};

var Tray = /*#__PURE__*/function (_Component) {
  _inherits(Tray, _Component);

  var _super = _createSuper(Tray);

  function Tray() {
    _classCallCheck(this, Tray);

    return _super.apply(this, arguments);
  }

  _createClass(Tray, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          restProps = _objectWithoutProperties(_this$props, ["children", "className"]);

      var classes = classNames(styles.tray, className);
      return /*#__PURE__*/React.createElement("div", _extends({}, restProps, {
        className: classes
      }), Children.map(children, wrapChild));
    }
  }]);

  return Tray;
}(Component);

_defineProperty(Tray, "propTypes", {
  className: PropTypes.string,
  children: PropTypes.node
});

var TrayIcon = /*#__PURE__*/function (_Component) {
  _inherits(TrayIcon, _Component);

  var _super = _createSuper(TrayIcon);

  function TrayIcon() {
    _classCallCheck(this, TrayIcon);

    return _super.apply(this, arguments);
  }

  _createClass(TrayIcon, [{
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props = this.props,
          className = _this$props.className,
          rotatable = _this$props.rotatable,
          restProps = _objectWithoutProperties(_this$props, ["className", "rotatable"]);

      var classes = classNames(styles.icon, className, (_classNames = {}, _defineProperty(_classNames, styles.rotatable, rotatable), _defineProperty(_classNames, styles.rotated, rotatable && restProps.active), _classNames));
      return /*#__PURE__*/React.createElement(Button, _extends({}, restProps, {
        className: classes
      }));
    }
  }]);

  return TrayIcon;
}(Component);

_defineProperty(TrayIcon, "propTypes", _objectSpread2(_objectSpread2({}, Button.propTypes), {}, {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]).isRequired,
  rotatable: PropTypes.bool
}));

_defineProperty(TrayIcon, "defaultProps", _objectSpread2({}, Button.defaultProps));

var rgItemType = PopupMenu.ListProps.Type.LINK;

var Profile = /*#__PURE__*/function (_PureComponent) {
  _inherits(Profile, _PureComponent);

  var _super = _createSuper(Profile);

  function Profile() {
    _classCallCheck(this, Profile);

    return _super.apply(this, arguments);
  }

  _createClass(Profile, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          closeOnSelect = _this$props.closeOnSelect,
          hasUpdates = _this$props.hasUpdates,
          onLogout = _this$props.onLogout,
          user = _this$props.user,
          profileUrl = _this$props.profileUrl,
          LinkComponent = _this$props.LinkComponent,
          onSwitchUser = _this$props.onSwitchUser,
          renderPopupItems = _this$props.renderPopupItems,
          onRevertPostponement = _this$props.onRevertPostponement,
          showApplyChangedUser = _this$props.showApplyChangedUser,
          showLogIn = _this$props.showLogIn,
          showLogOut = _this$props.showLogOut,
          showSwitchUser = _this$props.showSwitchUser,
          renderGuest = _this$props.renderGuest,
          translations = _this$props.translations,
          size = _this$props.size,
          round = _this$props.round;
          _this$props.loading;
          _this$props.onLogin;
          var props = _objectWithoutProperties(_this$props, ["className", "closeOnSelect", "hasUpdates", "onLogout", "user", "profileUrl", "LinkComponent", "onSwitchUser", "renderPopupItems", "onRevertPostponement", "showApplyChangedUser", "showLogIn", "showLogOut", "showSwitchUser", "renderGuest", "translations", "size", "round", "loading", "onLogin"]);

      if (!user) {
        return /*#__PURE__*/React.createElement("div", _extends({}, props, {
          className: classNames(styles.profileEmpty, className)
        }), /*#__PURE__*/React.createElement(Avatar, {
          size: size,
          round: round
        }));
      }

      if (user.guest) {
        return renderGuest(this.props);
      }

      var anchorClassName = classNames(styles.avatarWrapper, _defineProperty({}, styles.hasUpdates, hasUpdates));
      var anchor = /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: anchorClassName
      }, /*#__PURE__*/React.createElement(Avatar, {
        url: user.profile && user.profile.avatar && user.profile.avatar.url,
        size: size,
        round: round
      }));
      var items = [showApplyChangedUser && {
        rgItemType: rgItemType,
        label: translations.applyChangedUser || 'Apply changed user',
        className: styles.profileMenuItem,
        onClick: onRevertPostponement
      }, showLogIn && {
        rgItemType: rgItemType,
        label: translations.login || 'Log in',
        className: styles.profileMenuItem,
        onClick: onRevertPostponement
      }, {
        rgItemType: PopupMenu.ListProps.Type.LINK,
        label: translations.profile || 'Profile',
        target: '_self',
        // Full page reload in Angular
        href: profileUrl,
        LinkComponent: LinkComponent
      }, showSwitchUser && {
        rgItemType: rgItemType,
        label: translations.switchUser || 'Switch user',
        className: styles.profileMenuItem,
        onClick: onSwitchUser
      }, showLogOut && {
        rgItemType: rgItemType,
        label: translations.logout || 'Log out',
        onClick: onLogout
      }].filter(function (it) {
        return !!it;
      });
      return /*#__PURE__*/React.createElement(Dropdown, _extends({}, props, {
        title: user.name,
        anchor: anchor,
        "data-test": "ring-profile",
        className: classNames(styles.profile, className)
      }), /*#__PURE__*/React.createElement(PopupMenu, {
        closeOnSelect: closeOnSelect,
        data: renderPopupItems(items),
        left: -2,
        top: -8,
        sidePadding: 32
      }));
    }
  }]);

  return Profile;
}(PureComponent);

_defineProperty(Profile, "propTypes", {
  className: PropTypes.string,
  closeOnSelect: PropTypes.bool,
  hasUpdates: PropTypes.bool,
  loading: PropTypes.bool,
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  onSwitchUser: PropTypes.func,
  profileUrl: PropTypes.string,
  renderPopupItems: PropTypes.func,
  LinkComponent: PropTypes.oneOfType([PropTypes.instanceOf(Component), PropTypes.func, PropTypes.string]),
  translations: PropTypes.shape({
    profile: PropTypes.string,
    login: PropTypes.string,
    logout: PropTypes.string,
    applyChangedUser: PropTypes.string,
    switchUser: PropTypes.string
  }),
  user: PropTypes.shape({
    guest: PropTypes.bool,
    profile: PropTypes.object,
    name: PropTypes.string
  }),
  size: PropTypes.number,
  round: PropTypes.bool,
  showLogIn: PropTypes.bool,
  showLogOut: PropTypes.bool,
  showSwitchUser: PropTypes.bool,
  showApplyChangedUser: PropTypes.bool,
  onRevertPostponement: PropTypes.func,
  renderGuest: PropTypes.func
});

_defineProperty(Profile, "defaultProps", {
  closeOnSelect: true,
  renderPopupItems: function renderPopupItems(items) {
    return items;
  },
  translations: {},
  size: Size$1.Size32,
  renderGuest: function renderGuest(_ref) {
    var loading = _ref.loading,
        onLogin = _ref.onLogin,
        className = _ref.className,
        translations = _ref.translations;
    return /*#__PURE__*/React.createElement("div", {
      className: classNames(styles.profileEmpty, className)
    }, /*#__PURE__*/React.createElement(Button, {
      primary: true,
      "data-test": "ring-header-login-button",
      disabled: loading,
      loader: loading,
      onClick: onLogin
    }, translations.login || 'Log in...'));
  }
});

_defineProperty(Profile, "Size", Size$1);

var CERTIFICATE_MISMATCH_HEADER = 'x-client-certificate-token-mismatch';

var SmartProfile = /*#__PURE__*/function (_PureComponent) {
  _inherits(SmartProfile, _PureComponent);

  var _super = _createSuper(SmartProfile);

  function SmartProfile() {
    var _this;

    _classCallCheck(this, SmartProfile);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      user: null,
      size: Profile.defaultProps.size,
      isLogoutPostponed: false,
      isUserChangePostponed: false
    });

    _defineProperty(_assertThisInitialized(_this), "login", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.setState({
                loading: true
              });

              _context.prev = 1;
              _context.next = 4;
              return _this.props.auth.login();

            case 4:
              _context.next = 8;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](1);

            case 8:
              _context.prev = 8;

              _this.setState({
                loading: false
              });

              return _context.finish(8);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 6, 8, 11]]);
    })));

    _defineProperty(_assertThisInitialized(_this), "logout", function () {
      return _this.props.auth.logout();
    });

    _defineProperty(_assertThisInitialized(_this), "switchUser", function () {
      return _this.props.auth.switchUser();
    });

    _defineProperty(_assertThisInitialized(_this), "onRevertPostponement", function () {
      if (_this.state.isLogoutPostponed) {
        _this.props.auth.login();
      }

      if (_this.state.isUserChangePostponed) {
        _this.props.auth.updateUser();
      }
    });

    return _this;
  }

  _createClass(SmartProfile, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.requestUser();
    }
  }, {
    key: "requestUser",
    value: function () {
      var _requestUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this2 = this;

        var auth, user;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                auth = this.props.auth;
                _context2.next = 4;
                return auth.requestUser();

              case 4:
                user = _context2.sent;
                this.checkUserCertificateMismatch(user);
                this.setState({
                  user: user
                });
                auth.addListener(USER_CHANGED_EVENT, function (newUser) {
                  _this2.setState({
                    user: newUser,
                    isLogoutPostponed: false,
                    isUserChangePostponed: false
                  });
                });
                auth.addListener(LOGOUT_POSTPONED_EVENT, function () {
                  _this2.setState({
                    isLogoutPostponed: true
                  });
                });
                auth.addListener(USER_CHANGE_POSTPONED_EVENT, function () {
                  _this2.setState({
                    isUserChangePostponed: true
                  });
                });
                _context2.next = 14;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](0);

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 12]]);
      }));

      function requestUser() {
        return _requestUser.apply(this, arguments);
      }

      return requestUser;
    }()
  }, {
    key: "checkUserCertificateMismatch",
    value: function checkUserCertificateMismatch(user) {
      var _userMeta$headers;

      var _this$props = this.props,
          auth = _this$props.auth,
          translations = _this$props.translations;
      var userMeta = auth.http.getMetaForResponse(user);

      if (userMeta === null || userMeta === void 0 ? void 0 : (_userMeta$headers = userMeta.headers) === null || _userMeta$headers === void 0 ? void 0 : _userMeta$headers.has(CERTIFICATE_MISMATCH_HEADER)) {
        var message = (translations === null || translations === void 0 ? void 0 : translations.certificateMismatch) || "You are authenticated as ".concat(user.login || user.name, ". To authenticate with the client certificate for your account, log out, then click the \"Log in with certificate\" option on the login page.");
        alertService.warning(message, 0);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          user = _this$state.user,
          loading = _this$state.loading,
          isLogoutPostponed = _this$state.isLogoutPostponed,
          isUserChangePostponed = _this$state.isUserChangePostponed;

      var _this$props2 = this.props,
          auth = _this$props2.auth,
          profileUrl = _this$props2.profileUrl,
          props = _objectWithoutProperties(_this$props2, ["auth", "profileUrl"]);

      var url = profileUrl || (user ? "".concat(auth.config.serverUri, "users/").concat(user.id) : '');
      return /*#__PURE__*/React.createElement(Profile, _extends({
        onLogin: this.login,
        onLogout: this.logout,
        onSwitchUser: this.switchUser,
        loading: loading,
        user: user,
        profileUrl: url,
        showApplyChangedUser: isUserChangePostponed,
        showLogIn: isLogoutPostponed,
        showLogOut: !isLogoutPostponed,
        showSwitchUser: auth._canShowDialogs() && !isLogoutPostponed && !isUserChangePostponed,
        onRevertPostponement: this.onRevertPostponement
      }, props));
    }
  }]);

  return SmartProfile;
}(PureComponent);

_defineProperty(SmartProfile, "propTypes", {
  auth: PropTypes.instanceOf(Auth).isRequired,
  className: PropTypes.string,
  translations: PropTypes.object,
  profileUrl: PropTypes.string,
  size: Profile.propTypes.size,
  round: Profile.propTypes.round
});

_defineProperty(SmartProfile, "Size", Profile.Size);

var css_248z$1 = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.services_services__7DkE4 {\n  max-width: 402px;\n  padding: 32px 32px 24px;\n\n  background-color: #000;\n\n  background-color: var(--ring-navigation-background-color);\n\n  line-height: 10px; /* Eliminate gap between clickable blocks rows */\n}\n\n.services_active__yvOwi {\n  font-weight: bold;\n}\n\n.services_item__3DySI {\n  display: inline-block;\n  overflow-x: hidden;\n\n  box-sizing: border-box;\n  width: 112px;\n  height: 112px;\n\n  text-align: center;\n  text-overflow: ellipsis;\n\n  color: #fff;\n\n  color: var(--ring-dark-text-color);\n\n  line-height: normal;\n\n  line-height: initial\n}\n\n.services_item__3DySI::after {\n    height: 112px;\n\n    vertical-align: middle;\n  }\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.services_item__3DySI:not(:hover),\n  .services_item__3DySI:visited:not(:hover) {\n    color: #fff;\n    color: var(--ring-dark-text-color);\n  }}\n\n.services_itemLogo__1sHpb {\n  display: inline-block;\n\n  width: 48px;\n  height: 48px;\n  margin: 16px 0 9px;\n\n  background-repeat: no-repeat;\n  background-size: contain;\n}\n\n.services_activeItem__3Gpv2 {\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.services_activeItem__3Gpv2:hover {\n    color: #fff;\n    color: var(--ring-dark-text-color);\n  }}\n\n.services_line__2eLfG {\n  height: 1px;\n  margin: 32px 0 16px;\n\n  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent);\n}\n\n.services_itemStacked__1Bpe1 {\n  display: inline-block;\n\n  width: 100%;\n  margin-bottom: 16px;\n\n  text-decoration: none;\n\n  line-height: 16px\n}\n\n.services_itemStacked__1Bpe1,\n  .services_itemStacked__1Bpe1:visited {\n    color: #737577;\n    color: var(--ring-secondary-color);\n  }\n\n.services_itemStacked__1Bpe1:last-child {\n    margin-bottom: -24px;\n  }\n\n.services_activeItemStacked__3dJR6 {\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.services_activeItemStacked__3dJR6:hover {\n    color: #737577;\n    color: var(--ring-secondary-color);\n  }}\n";
var styles$1 = {"unit":"8px","services":"services_services__7DkE4","active":"services_active__yvOwi","item":"services_item__3DySI","itemLogo":"services_itemLogo__1sHpb","activeItem":"services_activeItem__3Gpv2 services_item__3DySI services_active__yvOwi","line":"services_line__2eLfG","itemStacked":"services_itemStacked__1Bpe1","activeItemStacked":"services_activeItemStacked__3dJR6 services_itemStacked__1Bpe1 services_active__yvOwi"};
styleInject(css_248z$1);

var ServicesLink = /*#__PURE__*/function (_PureComponent) {
  _inherits(ServicesLink, _PureComponent);

  var _super = _createSuper(ServicesLink);

  function ServicesLink() {
    _classCallCheck(this, ServicesLink);

    return _super.apply(this, arguments);
  }

  _createClass(ServicesLink, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          service = _this$props.service,
          props = _objectWithoutProperties(_this$props, ["service"]);

      return /*#__PURE__*/React.createElement(Link, _extends({
        target: "_self",
        href: service.homeUrl
      }, props), function (WrapText) {
        return service.iconUrl ? [/*#__PURE__*/React.createElement("span", {
          key: "icon",
          className: styles$1.itemLogo,
          style: {
            backgroundImage: "url(".concat(service.iconUrl, ")")
          }
        }), /*#__PURE__*/React.createElement("div", {
          key: "text"
        }, /*#__PURE__*/React.createElement(WrapText, null, service.name))] : /*#__PURE__*/React.createElement(WrapText, null, service.name);
      });
    }
  }]);

  return ServicesLink;
}(PureComponent);

_defineProperty(ServicesLink, "propTypes", {
  isActive: PropTypes.bool,
  service: PropTypes.shape({
    applicationName: PropTypes.string,
    iconUrl: PropTypes.string,
    homeUrl: PropTypes.string,
    name: PropTypes.string
  })
});

var makeAnchor = function makeAnchor(loading) {
  var Anchor = function Anchor(_ref) {
    var active = _ref.active;
    return /*#__PURE__*/React.createElement(TrayIcon, {
      loader: loading,
      active: active,
      icon: servicesIcon,
      "aria-label": "Services"
    });
  };

  Anchor.propTypes = {
    active: PropTypes.bool
  };
  return Anchor;
};

var Services = /*#__PURE__*/function (_PureComponent) {
  _inherits(Services, _PureComponent);

  var _super = _createSuper(Services);

  function Services() {
    var _this;

    _classCallCheck(this, Services);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "serviceIsActive", function (service) {
      return service.id === _this.props.clientId;
    });

    return _this;
  }

  _createClass(Services, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props;
          _this$props.clientId;
          var loading = _this$props.loading,
          services = _this$props.services,
          initShown = _this$props.initShown,
          props = _objectWithoutProperties(_this$props, ["clientId", "loading", "services", "initShown"]);

      if (!services) {
        return /*#__PURE__*/React.createElement(TrayIcon, _extends({}, props, {
          loader: loading,
          active: loading,
          icon: servicesIcon,
          "aria-label": "Services"
        }));
      }

      var sortedServices = _toConsumableArray(services).sort(Services.sort);

      var servicesWithIcons = sortedServices.filter(function (service) {
        return service.iconUrl;
      });
      var servicesWithOutIcons = sortedServices.filter(function (service) {
        return !service.iconUrl;
      });
      var separatorIsRequired = servicesWithIcons.length !== 0 && servicesWithOutIcons.length !== 0;
      return /*#__PURE__*/React.createElement(Dropdown, _extends({}, props, {
        anchor: makeAnchor(loading),
        initShown: initShown
      }), /*#__PURE__*/React.createElement(Popup, {
        className: styles$1.services,
        top: -3
      }, servicesWithIcons.map(function (service) {
        var isActive = _this2.serviceIsActive(service);

        return /*#__PURE__*/React.createElement(Services.Link, {
          active: isActive,
          className: isActive ? styles$1.activeItem : styles$1.item,
          key: service.id,
          service: service
        });
      }), separatorIsRequired && /*#__PURE__*/React.createElement("div", {
        className: styles$1.line,
        key: "separator"
      }), servicesWithOutIcons.map(function (service) {
        var isActive = _this2.serviceIsActive(service);

        return /*#__PURE__*/React.createElement(Services.Link, {
          active: isActive,
          className: isActive ? styles$1.activeItemStacked : styles$1.itemStacked,
          key: service.id,
          service: service
        });
      })));
    }
  }]);

  return Services;
}(PureComponent);

_defineProperty(Services, "sort", function (a, b) {
  var aApplicationName = a.applicationName || '';
  var bApplicationName = b.applicationName || '';
  return aApplicationName.localeCompare(bApplicationName) || a.name.localeCompare(b.name);
});

_defineProperty(Services, "propTypes", {
  className: PropTypes.string,
  clientId: PropTypes.string,
  initShown: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  services: PropTypes.arrayOf(ServicesLink.propTypes.service)
});

_defineProperty(Services, "Link", ServicesLink);

function noop() {}

var SmartServices = /*#__PURE__*/function (_Component) {
  _inherits(SmartServices, _Component);

  var _super = _createSuper(SmartServices);

  function SmartServices() {
    var _this;

    _classCallCheck(this, SmartServices);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      visible: true,
      loading: false,
      services: null
    });

    _defineProperty(_assertThisInitialized(_this), "stopLoading", function () {
      _this.setState({
        loading: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "getServicesContent", function () {
      _this.setState({
        loading: true
      });

      _this.getServices(SmartServices.allFields).then(function (services) {
        _this.setState({
          services: services
        });

        _this.stopLoading();
      }).catch(_this.stopLoading);
    });

    return _this;
  }

  _createClass(SmartServices, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var auth = this.props.auth;
      this.http = new HTTP(auth, auth.getAPIPath());
      this.getServices(SmartServices.countFields).then(function (services) {
        if (!services.length) {
          _this2.setState({
            visible: false
          });
        }
      }).catch(noop);
    }
  }, {
    key: "getServices",
    value: function getServices(fields) {
      return this.http.get("services/header?fields=".concat(fields));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          services = _this$state.services,
          visible = _this$state.visible,
          loading = _this$state.loading;

      var _this$props = this.props,
          auth = _this$props.auth,
          props = _objectWithoutProperties(_this$props, ["auth"]);

      if (!visible) {
        return null;
      }

      return /*#__PURE__*/React.createElement(Services, _extends({}, props, {
        clientId: auth.config.clientId,
        initShown: true,
        loading: loading,
        onClick: this.getServicesContent,
        services: services
      }));
    }
  }]);

  return SmartServices;
}(Component);

_defineProperty(SmartServices, "propTypes", {
  auth: PropTypes.instanceOf(Auth).isRequired
});

_defineProperty(SmartServices, "allFields", 'id,name,applicationName,homeUrl,iconUrl');

_defineProperty(SmartServices, "countFields", 'key');

/**
 * @name Header
 */

/**
 * Displays a configurable page header. See available presentation options in the knobs panel.
 */

var Header = /*#__PURE__*/function (_Component) {
  _inherits(Header, _Component);

  var _super = _createSuper(Header);

  function Header() {
    _classCallCheck(this, Header);

    return _super.apply(this, arguments);
  }

  _createClass(Header, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          spaced = _this$props.spaced,
          theme = _this$props.theme,
          restProps = _objectWithoutProperties(_this$props, ["children", "className", "spaced", "theme"]);

      var classes = classNames(styles.header, styles[theme], className, _defineProperty({}, styles.headerSpaced, spaced));
      return /*#__PURE__*/React.createElement("header", _extends({}, restProps, {
        className: classes
      }), children);
    }
  }]);

  return Header;
}(Component);

_defineProperty(Header, "propTypes", {
  theme: PropTypes.oneOf(['light', 'dark']),
  className: PropTypes.string,
  children: PropTypes.node,
  spaced: PropTypes.bool
});

_defineProperty(Header, "defaultProps", {
  spaced: true
});

var header = withTheme(Theme.DARK)(Header);
var RerenderableHeader = compose(withTheme(Theme.DARK))(Header);

export default header;
export { Logo, Profile, RerenderableHeader, Services, SmartProfile, SmartServices, Tray, TrayIcon };
