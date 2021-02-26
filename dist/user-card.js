import { _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass, d as _defineProperty, e as _objectWithoutProperties, f as _extends, g as _assertThisInitialized, l as _asyncToGenerator, i as _objectSpread2 } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Avatar, { Size } from './avatar.js';
import Link from './link.js';
import { b as badgeStyles } from './badge-5ef3e7e8.js';
import styleInject from 'style-inject';
import Dropdown from './dropdown.js';
import { P as Popup } from './popup-442f4003.js';
import LoaderInline from './loader-inline.js';
import './url-a3cbb96f.js';
import './dom-0ae85140.js';
import 'focus-visible';
import './memoize-ad2c954c.js';
import './data-tests-1a367745.js';
import './clickableLink-3fc5662b.js';
import '@jetbrains/icons/chevron-10px';
import './icon.js';
import 'util-deprecate';
import './button-c0bc1992.js';
import './theme-9a053da9.js';
import 'react-dom';
import './get-uid-bf3ab014.js';
import './schedule-raf-edeb21db.js';
import './shortcuts.js';
import 'combokeys';
import './sniffer-c9d1f40e.js';
import 'sniffr';
import './tab-trap.js';
import './popup.target-9daf0591.js';
import 'conic-gradient';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.user-card_userCardSpaced__23UaG {\n  padding: 16px 16px;\n}\n\n.user-card_userInformationContainer__1Wixf {\n  display: flex;\n  align-items: center;\n}\n\n.user-card_userInformation__3sV02 {\n  padding-left: 12px;\n\n  text-align: left;\n\n  color: #1f2326;\n\n  color: var(--ring-text-color);\n\n  font-size: 13px;\n  line-height: 18px;\n}\n\n.user-card_userName__13VuD {\n  display: inline-block;\n\n  margin-right: 4px;\n  margin-bottom: 3px;\n\n  font-size: 16px;\n  font-weight: 600;\n}\n\n.user-card_userActiveStatus__3lqFQ {\n  display: inline-block;\n\n  width: 8px;\n  height: 8px;\n\n  margin-right: 4px;\n\n  border-radius: 50%;\n  background-color: #999;\n  background-color: var(--ring-icon-secondary-color);\n}\n\n.user-card_userActiveStatus__3lqFQ.user-card_online__cuQLR {\n  background-color: #59a869;\n  background-color: var(--ring-icon-success-color);\n}\n";
var styles = {"unit":"8px","userCardSpaced":"user-card_userCardSpaced__23UaG","userInformationContainer":"user-card_userInformationContainer__1Wixf","userInformation":"user-card_userInformation__3sV02","userName":"user-card_userName__13VuD","userActiveStatus":"user-card_userActiveStatus__3lqFQ","online":"user-card_online__cuQLR"};
styleInject(css_248z);

var UserCard = /*#__PURE__*/function (_PureComponent) {
  _inherits(UserCard, _PureComponent);

  var _super = _createSuper(UserCard);

  function UserCard() {
    _classCallCheck(this, UserCard);

    return _super.apply(this, arguments);
  }

  _createClass(UserCard, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          user = _this$props.user,
          wording = _this$props.wording,
          restProps = _objectWithoutProperties(_this$props, ["children", "className", "user", "wording"]);

      var classes = classNames(className, {});
      var userActiveStatusClasses = classNames(styles.userActiveStatus, user.online ? styles.online : '');
      return /*#__PURE__*/React.createElement("div", _extends({
        className: classes
      }, restProps), /*#__PURE__*/React.createElement("div", {
        className: styles.userInformationContainer
      }, /*#__PURE__*/React.createElement(Avatar, {
        size: Size.Size56,
        url: user.avatarUrl
      }), /*#__PURE__*/React.createElement("div", {
        className: styles.userInformation
      }, /*#__PURE__*/React.createElement("div", null, user.href && /*#__PURE__*/React.createElement(Link, {
        href: user.href,
        className: styles.userName
      }, user.name), !user.href && /*#__PURE__*/React.createElement("span", {
        className: styles.userName
      }, user.name), user.banned && /*#__PURE__*/React.createElement("span", {
        className: classNames(badgeStyles.badge, badgeStyles.invalid),
        title: user.banReason
      }, wording.banned)), /*#__PURE__*/React.createElement("div", null, typeof user.online === 'boolean' && /*#__PURE__*/React.createElement("span", {
        className: userActiveStatusClasses,
        title: user.online ? wording.online : wording.offline
      }), user.login), user.email && /*#__PURE__*/React.createElement("div", null, user.email))), children);
    }
  }]);

  return UserCard;
}(PureComponent);

_defineProperty(UserCard, "propTypes", {
  children: PropTypes.node,
  className: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    email: PropTypes.string,
    href: PropTypes.string,
    online: PropTypes.bool,
    banned: PropTypes.bool,
    banReason: PropTypes.string
  }).isRequired,
  wording: PropTypes.shape({
    banned: PropTypes.string.isRequired,
    online: PropTypes.string.isRequired,
    offline: PropTypes.string.isRequired
  })
});

_defineProperty(UserCard, "defaultProps", {
  wording: {
    banned: 'banned',
    online: 'online',
    offline: 'offline'
  }
});

var DEFAULT_TIMEOUT = 300;

var UserCardTooltip = /*#__PURE__*/function (_Component) {
  _inherits(UserCardTooltip, _Component);

  var _super = _createSuper(UserCardTooltip);

  function UserCardTooltip() {
    _classCallCheck(this, UserCardTooltip);

    return _super.apply(this, arguments);
  }

  _createClass(UserCardTooltip, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          user = _this$props.user,
          renderUserCard = _this$props.renderUserCard,
          renderNoUser = _this$props.renderNoUser,
          dropdownProps = _this$props.dropdownProps;
      return /*#__PURE__*/React.createElement(Dropdown, _extends({
        anchor: children,
        hoverMode: true,
        clickMode: false
      }, dropdownProps), /*#__PURE__*/React.createElement(Popup, {
        attached: false
      }, user ? renderUserCard(this.props) : renderNoUser()));
    }
  }]);

  return UserCardTooltip;
}(Component);

_defineProperty(UserCardTooltip, "propTypes", {
  className: PropTypes.string,
  children: PropTypes.node,
  dropdownProps: PropTypes.object,
  user: PropTypes.object,
  renderUserCard: PropTypes.func,
  renderNoUser: PropTypes.func
});

_defineProperty(UserCardTooltip, "defaultProps", {
  renderUserCard: function renderUserCard(props) {
    var className = props.className;
        props.children;
        props.renderUserCard;
        props.renderNoUser;
        props.dropdownProps;
        var restProps = _objectWithoutProperties(props, ["className", "children", "renderUserCard", "renderNoUser", "dropdownProps"]);

    return /*#__PURE__*/React.createElement(UserCard, _extends({}, restProps, {
      className: classNames(styles.userCardSpaced, className)
    }));
  },
  renderNoUser: function renderNoUser() {
    return '';
  },
  dropdownProps: {
    hoverShowTimeOut: DEFAULT_TIMEOUT,
    hoverHideTimeOut: DEFAULT_TIMEOUT
  }
});

var SmartUserCardTooltip = /*#__PURE__*/function (_Component) {
  _inherits(SmartUserCardTooltip, _Component);

  var _super = _createSuper(SmartUserCardTooltip);

  function SmartUserCardTooltip() {
    var _this;

    _classCallCheck(this, SmartUserCardTooltip);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      user: null,
      loading: false
    });

    _defineProperty(_assertThisInitialized(_this), "loadUser", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var user;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!_this.state.user) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              _context.prev = 2;

              _this.setState({
                loading: true
              });

              _context.next = 6;
              return _this.props.userDataSource();

            case 6:
              user = _context.sent;

              _this.setState({
                user: user
              });

              _context.next = 12;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](2);

            case 12:
              _context.prev = 12;

              _this.setState({
                loading: false
              });

              return _context.finish(12);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 10, 12, 15]]);
    })));

    _defineProperty(_assertThisInitialized(_this), "renderNoUser", function () {
      return _this.state.loading ? /*#__PURE__*/React.createElement("div", {
        className: styles.userCardSpaced
      }, /*#__PURE__*/React.createElement(LoaderInline, null)) : '';
    });

    return _this;
  }

  _createClass(SmartUserCardTooltip, [{
    key: "render",
    value: function render() {
      var user = this.state.user;

      var _this$props = this.props,
          children = _this$props.children;
          _this$props.userDataSource;
          var restProps = _objectWithoutProperties(_this$props, ["children", "userDataSource"]);

      var dropdownProps = _objectSpread2({
        onMouseEnter: this.loadUser
      }, UserCardTooltip.defaultProps.dropdownProps);

      return /*#__PURE__*/React.createElement(UserCardTooltip, _extends({
        user: user,
        renderNoUser: this.renderNoUser,
        dropdownProps: dropdownProps
      }, restProps), children);
    }
  }]);

  return SmartUserCardTooltip;
}(Component);

_defineProperty(SmartUserCardTooltip, "propTypes", {
  children: PropTypes.node,
  userDataSource: PropTypes.func
});

export { SmartUserCardTooltip, UserCard, UserCardTooltip };
