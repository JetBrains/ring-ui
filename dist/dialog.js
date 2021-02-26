import { _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, c as _createClass, e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import closeIcon from '@jetbrains/icons/close';
import { AdaptiveIsland } from './island.js';
import { g as getUID } from './get-uid-bf3ab014.js';
import { j as joinDataTestAttributes } from './data-tests-1a367745.js';
import Shortcuts from './shortcuts.js';
import TabTrap from './tab-trap.js';
import { B as Button } from './button-c0bc1992.js';
import { P as PopupTarget } from './popup.target-9daf0591.js';
import scrollbarWidth from 'scrollbar-width';
import styleInject from 'style-inject';
import './linear-function-3bd43cfe.js';
import 'element-resize-detector';
import './schedule-raf-edeb21db.js';
import 'combokeys';
import './sniffer-c9d1f40e.js';
import 'sniffr';
import './dom-0ae85140.js';
import 'focus-visible';
import '@jetbrains/icons/chevron-10px';
import './icon.js';
import 'util-deprecate';
import './memoize-ad2c954c.js';
import './theme-9a053da9.js';
import './clickableLink-3fc5662b.js';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.dialog_container__3RH2z {\n  position: fixed;\n  z-index: 5;\n  z-index: var(--ring-overlay-z-index);\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n\n  display: flex;\n  overflow: auto;\n  align-items: center;\n  justify-content: center;\n\n  padding: 32px 8px;\n\n  background-color: rgba(255, 255, 255, 0.4);\n}\n\n.dialog_innerContainer__1KMzQ {\n  display: flex;\n  flex-direction: column;\n\n  max-height: 100%;\n}\n\n.dialog_content__kxkHg {\n  position: relative;\n\n  width: 464px;\n  min-height: 120px;\n  margin: auto;\n\n  cursor: default;\n  overflow-wrap: break-word\n}\n\n.dialog_content__kxkHg .dialog_panel__-DkGj {\n    margin-top: 0;\n    padding-right: 32px;\n    padding-left: 32px;\n\n    border-top: none;\n\n    background-color: transparent;\n  }\n\n.dialog_content__kxkHg {\n\n  /* stylelint-disable-next-line selector-max-specificity */\n}\n\n.dialog_content__kxkHg .dialog_panel__-DkGj button {\n    margin-right: 8px;\n  }\n\n.dialog_content__kxkHg.dialog_content__kxkHg {\n  box-shadow: 0 2px 16px rgba(0, 42, 76, 0.15);\n  box-shadow: 0 2px 16px var(--ring-popup-shadow-color);\n}\n\n.dialog_clickableOverlay__2P039 {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n\n  cursor: pointer;\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.dialog_clickableOverlay__2P039:hover + * .dialog_closeIcon__2oM0w {\n  color: #ff008c;\n  color: var(--ring-icon-hover-color);\n}}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.dialog_closeButton__eMIAc:hover .dialog_closeIcon__2oM0w {\n  color: #ff008c;\n  color: var(--ring-icon-hover-color);\n}}\n\n.dialog_clickableOverlay__2P039:active + * .dialog_closeIcon__2oM0w {\n  color: #008eff;\n  color: var(--ring-main-color);\n}\n\n.dialog_closeButton__eMIAc:active .dialog_closeIcon__2oM0w {\n  color: #008eff;\n  color: var(--ring-main-color);\n}\n\n.dialog_closeButton__eMIAc.dialog_closeButton__eMIAc {\n  position: absolute;\n}\n\n.dialog_closeButtonOutside__3_cTk {\n  top: 0;\n  right: -32px;\n}\n\n.dialog_closeButtonInside__1NRM8 {\n  top: 12px;\n  right: 8px;\n}\n\n.dialog_documentWithoutScroll__21pO0 {\n  overflow: hidden;\n\n  height: 100%;\n}\n\n.dialog_popupTarget__C-G_u {\n  position: fixed;\n  z-index: 5;\n  z-index: var(--ring-overlay-z-index);\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n\n  pointer-events: none\n}\n\n.dialog_popupTarget__C-G_u > :not(.dialog_popupTarget__C-G_u) {\n    pointer-events: initial;\n  }\n";
var styles = {"unit":"8px","container":"dialog_container__3RH2z","innerContainer":"dialog_innerContainer__1KMzQ","content":"dialog_content__kxkHg","panel":"dialog_panel__-DkGj","clickableOverlay":"dialog_clickableOverlay__2P039","closeIcon":"dialog_closeIcon__2oM0w","closeButton":"dialog_closeButton__eMIAc","closeButtonOutside":"dialog_closeButtonOutside__3_cTk","closeButtonInside":"dialog_closeButtonInside__1NRM8","documentWithoutScroll":"dialog_documentWithoutScroll__21pO0","popupTarget":"dialog_popupTarget__C-G_u"};
styleInject(css_248z);

var isPrevented = false;
var previousDocumentWidth = null;
var ScrollPreventer = {
  prevent: function prevent() {
    if (isPrevented) {
      return;
    }

    isPrevented = true;
    var documentHasScroll = document.documentElement.scrollHeight > window.innerHeight || getComputedStyle(document.documentElement).overflowY === 'scroll';
    document.documentElement.classList.add(styles.documentWithoutScroll);
    var scrollWidth = scrollbarWidth();

    if (documentHasScroll && scrollWidth > 0) {
      previousDocumentWidth = document.documentElement.style.width;
      document.documentElement.style.width = "calc(100% - ".concat(scrollWidth, "px)");
    }
  },
  reset: function reset() {
    if (!isPrevented) {
      return;
    }

    isPrevented = false;
    document.documentElement.classList.remove(styles.documentWithoutScroll);

    if (previousDocumentWidth !== null) {
      document.documentElement.style.width = previousDocumentWidth;
      previousDocumentWidth = null;
    }
  }
};

/**
 * @name Dialog
 */

function noop() {}

var Dialog = /*#__PURE__*/function (_PureComponent) {
  _inherits(Dialog, _PureComponent);

  var _super = _createSuper(Dialog);

  function Dialog() {
    var _this;

    _classCallCheck(this, Dialog);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      shortcutsScope: getUID('ring-dialog-')
    });

    _defineProperty(_assertThisInitialized(_this), "uid", getUID('dialog-'));

    _defineProperty(_assertThisInitialized(_this), "handleClick", function (event) {
      _this.props.onOverlayClick(event);

      _this.props.onCloseAttempt(event);
    });

    _defineProperty(_assertThisInitialized(_this), "onCloseClick", function (event) {
      _this.props.onCloseClick(event);

      _this.props.onCloseAttempt(event);
    });

    _defineProperty(_assertThisInitialized(_this), "getShortcutsMap", function () {
      var onEscape = function onEscape(event) {
        if (_this.props.show) {
          _this.props.onEscPress(event);

          _this.props.onCloseAttempt(event);
        }
      };

      return {
        esc: onEscape
      };
    });

    _defineProperty(_assertThisInitialized(_this), "dialogRef", function (tabTrap) {
      _this.dialog = tabTrap && tabTrap.node;
    });

    return _this;
  }

  _createClass(Dialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.toggleScrollPreventer();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.show !== this.props.show) {
        this.toggleScrollPreventer();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      ScrollPreventer.reset();
    }
  }, {
    key: "toggleScrollPreventer",
    value: function toggleScrollPreventer() {
      if (this.props.show) {
        ScrollPreventer.prevent();
      } else {
        ScrollPreventer.reset();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          show = _this$props.show,
          showCloseButton = _this$props.showCloseButton,
          onOverlayClick = _this$props.onOverlayClick,
          onCloseAttempt = _this$props.onCloseAttempt;
          _this$props.onEscPress;
          _this$props.onCloseClick;
          var children = _this$props.children,
          className = _this$props.className,
          contentClassName = _this$props.contentClassName,
          trapFocus = _this$props.trapFocus,
          dataTest = _this$props['data-test'],
          closeButtonInside = _this$props.closeButtonInside,
          portalTarget = _this$props.portalTarget,
          restProps = _objectWithoutProperties(_this$props, ["show", "showCloseButton", "onOverlayClick", "onCloseAttempt", "onEscPress", "onCloseClick", "children", "className", "contentClassName", "trapFocus", "data-test", "closeButtonInside", "portalTarget"]);

      var classes = classNames(styles.container, className);
      var shortcutsMap = this.getShortcutsMap();
      return show && /*#__PURE__*/createPortal( /*#__PURE__*/React.createElement(PopupTarget, {
        id: this.uid,
        className: styles.popupTarget
      }, function (target) {
        var _classNames;

        return /*#__PURE__*/React.createElement(TabTrap, _extends({
          trapDisabled: !trapFocus,
          "data-test": joinDataTestAttributes('ring-dialog-container', dataTest),
          ref: _this2.dialogRef,
          className: classes,
          role: "presentation"
        }, restProps), /*#__PURE__*/React.createElement(Shortcuts, {
          map: shortcutsMap,
          scope: _this2.state.shortcutsScope
        }), (onOverlayClick !== noop || onCloseAttempt !== noop) && /*#__PURE__*/React.createElement("div", {
          // click handler is duplicated in close button
          role: "presentation",
          className: styles.clickableOverlay,
          onClick: _this2.handleClick
        }), /*#__PURE__*/React.createElement("div", {
          className: styles.innerContainer
        }, /*#__PURE__*/React.createElement(AdaptiveIsland, {
          className: classNames(styles.content, contentClassName),
          "data-test": "ring-dialog",
          role: "dialog"
        }, children, showCloseButton && /*#__PURE__*/React.createElement(Button, {
          icon: closeIcon,
          "data-test": "ring-dialog-close-button",
          className: classNames(styles.closeButton, (_classNames = {}, _defineProperty(_classNames, styles.closeButtonOutside, !closeButtonInside), _defineProperty(_classNames, styles.closeButtonInside, closeButtonInside), _classNames)),
          iconClassName: styles.closeIcon,
          onClick: _this2.onCloseClick,
          "aria-label": "close dialog"
        }))), target);
      }), portalTarget instanceof HTMLElement ? portalTarget : document.body);
    }
  }]);

  return Dialog;
}(PureComponent);

_defineProperty(Dialog, "propTypes", {
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  show: PropTypes.bool.isRequired,
  showCloseButton: PropTypes.bool,
  closeButtonInside: PropTypes.bool,
  onOverlayClick: PropTypes.func,
  onEscPress: PropTypes.func,
  onCloseClick: PropTypes.func,
  // onCloseAttempt is a common callback for ESC pressing and overlay clicking.
  // Use it if you don't need different behaviors for this cases.
  onCloseAttempt: PropTypes.func,
  // focusTrap may break popups inside dialog, so use it carefully
  trapFocus: PropTypes.bool,
  portalTarget: PropTypes.instanceOf(HTMLElement),
  autoFocusFirst: PropTypes.bool,
  'data-test': PropTypes.string
});

_defineProperty(Dialog, "defaultProps", {
  onOverlayClick: noop,
  onEscPress: noop,
  onCloseClick: noop,
  onCloseAttempt: noop,
  showCloseButton: false,
  closeButtonInside: false,
  trapFocus: false,
  autoFocusFirst: true
});

export default Dialog;
