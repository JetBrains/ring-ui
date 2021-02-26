import { _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, c as _createClass } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import closeIcon from '@jetbrains/icons/close';
import Icon from './icon.js';
import { B as Button } from './button-c0bc1992.js';
import styleInject from 'style-inject';
import 'util-deprecate';
import './memoize-ad2c954c.js';
import 'focus-visible';
import '@jetbrains/icons/chevron-10px';
import './theme-9a053da9.js';
import './clickableLink-3fc5662b.js';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.tag_tag__2Urym {\n\n  position: relative;\n  z-index: 1;\n\n  display: inline-flex;\n\n  box-sizing: border-box;\n  max-width: 100%;\n  height: 20px;\n\n  margin-bottom: 1px;\n  padding: 0 8px;\n\n  vertical-align: top;\n\n  color: #1f2326;\n\n  color: var(--ring-text-color);\n\n  border: none;\n  border-radius: 3px;\n  border-radius: var(--ring-border-radius);\n  background-color: #e6ecf2;\n  background-color: var(--ring-tag-background-color);\n\n  font-size: 12px;\n  line-height: 20px;\n  line-height: var(--ring-line-height);\n}\n\n.tag_withRemove__3aJkC {\n  padding-right: 22px;\n}\n\n.tag_container__2cO1x {\n  position: relative;\n\n  display: inline-block;\n\n  max-width: calc(100% - 4px);\n\n  margin-right: 4px;\n\n  white-space: nowrap;\n}\n\n.tag_focused__2JpKv,\n.tag_tag__2Urym:focus {\n  position: relative;\n\n  outline: none;\n  box-shadow: 0 0 0 2px #80c6ff;\n  box-shadow: 0 0 0 2px var(--ring-border-hover-color);\n}\n\n.tag_tagAngled__ho0BG {\n  margin-bottom: -5px !important; /* it needs to fix vertical alignment broken by \"overflow: hidden\". Remove this class, when IE11 will be deprecated */\n  margin-left: 8px;\n  padding-left: 4px;\n\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0\n}\n\n.tag_tagAngled__ho0BG::before {\n    position: absolute;\n    z-index: -1;\n    top: 0;\n    left: 0;\n\n    box-sizing: border-box;\n    width: 12px;\n    height: 12px;\n\n    content: '';\n    transform: scaleY(1.177) rotate(45deg);\n    transform-origin: 0 0;\n\n    border: none;\n\n    background-color: #e6ecf2;\n\n    background-color: var(--ring-tag-background-color);\n  }\n\n.tag_tagAngled__ho0BG.tag_focused__2JpKv,\n  .tag_tagAngled__ho0BG:focus {\n    box-shadow: 0 0 0 1px #80c6ff inset, 0 0 0 1px #80c6ff;\n    box-shadow: 0 0 0 1px var(--ring-border-hover-color) inset, 0 0 0 1px var(--ring-border-hover-color);\n  }\n\n.tag_tagAngled__ho0BG:focus::before {\n    box-shadow:\n      1px -1px #80c6ff inset,\n      -0.8px 0.8px 0 0.5px #80c6ff;\n    box-shadow:\n      1px -1px var(--ring-border-hover-color) inset,\n      -0.8px 0.8px 0 0.5px var(--ring-border-hover-color);\n  }\n\n.tag_content__uKiBS {\n}\n\n.tag_disabled__29cr5 {\n  opacity: 0.5;\n}\n\n.tag_remove__3yYOb {\n  position: absolute;\n  z-index: 1;\n  top: -1px;\n  right: 0;\n\n  padding: 0 4px;\n}\n\n.tag_removeIcon__1uePt.tag_removeIcon__1uePt {\n  color: #999;\n  color: var(--ring-icon-secondary-color);\n}\n\n.tag_icon__3CI7h {\n  margin-right: 6px;\n\n  color: #999;\n\n  color: var(--ring-icon-secondary-color)\n}\n\n.tag_icon__3CI7h svg {\n    vertical-align: -3px;\n  }\n\n.tag_avatarContainer__1nYYD {\n  display: inline-block;\n  overflow: hidden;\n\n  box-sizing: border-box;\n  width: 20px;\n  height: 20px;\n  margin-right: 4px;\n  margin-left: -8px;\n\n  vertical-align: top;\n\n  border-top-left-radius: 3px;\n\n  border-top-left-radius: var(--ring-border-radius);\n  border-bottom-left-radius: 3px;\n  border-bottom-left-radius: var(--ring-border-radius);\n}\n\n.tag_customIcon__2uOt- {\n  max-width: 16px;\n  max-height: 16px;\n\n  margin-right: 4px;\n\n  vertical-align: bottom;\n}\n\n.tag_avatarIcon__3SaBM {\n  width: 20px;\n\n  margin-right: -4px;\n\n  -o-object-fit: contain;\n\n     object-fit: contain;\n  -o-object-position: center;\n     object-position: center;\n}\n";
var styles = {"unit":"8px","resetButton":"global_resetButton__WQfrm","background-color":"var(--ring-tag-background-color)","max-height":"20px","tag":"tag_tag__2Urym global_resetButton__WQfrm","withRemove":"tag_withRemove__3aJkC","container":"tag_container__2cO1x","focused":"tag_focused__2JpKv","tagAngled":"tag_tagAngled__ho0BG","content":"tag_content__uKiBS global_ellipsis__xhH6M","disabled":"tag_disabled__29cr5","remove":"tag_remove__3yYOb","removeIcon":"tag_removeIcon__1uePt","icon":"tag_icon__3CI7h","avatarContainer":"tag_avatarContainer__1nYYD","customIcon":"tag_customIcon__2uOt-","avatarIcon":"tag_avatarIcon__3SaBM"};
styleInject(css_248z);

/**
 * @name Tag
 */

var Tag = /*#__PURE__*/function (_PureComponent) {
  _inherits(Tag, _PureComponent);

  var _super = _createSuper(Tag);

  function Tag() {
    var _this;

    _classCallCheck(this, Tag);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      focused: false
    });

    _defineProperty(_assertThisInitialized(_this), "onDocumentClick", function (event) {
      if (_this.tagNode) {
        _this.setState({
          focused: _this.tagNode === event.target
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "tagRef", function (el) {
      _this.tagNode = el;
    });

    return _this;
  }

  _createClass(Tag, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.focused !== prevProps.focused) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          focused: this.props.focused
        });
      }

      if (this.state.focused) {
        this.tagNode.focus();
      }

      this.setDocumentClickListener(this.state.focused);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.setDocumentClickListener(false);
      this.setState({
        focused: false
      });
    }
  }, {
    key: "setDocumentClickListener",
    value: function setDocumentClickListener(setListener) {
      if (setListener) {
        document.addEventListener('click', this.onDocumentClick);
      } else {
        document.removeEventListener('click', this.onDocumentClick);
      }
    }
  }, {
    key: "renderCustomIcon",
    value: function renderCustomIcon() {
      if (this.props.rgTagIcon) {
        return /*#__PURE__*/React.createElement(Icon, {
          className: styles.icon,
          title: this.props.rgTagTitle,
          glyph: this.props.rgTagIcon
        });
      }

      return null;
    }
  }, {
    key: "_renderImageElement",
    value: function _renderImageElement(avatarSrc) {
      var _classNames;

      var classes = classNames((_classNames = {}, _defineProperty(_classNames, styles.customIcon, this.props.icon), _defineProperty(_classNames, styles.avatarIcon, avatarSrc), _classNames));
      return /*#__PURE__*/React.createElement("img", {
        alt: avatarSrc ? 'Avatar' : 'Icon',
        className: classes,
        src: avatarSrc || this.props.icon
      });
    }
  }, {
    key: "renderImage",
    value: function renderImage() {
      if (this.props.icon && !this.props.avatar) {
        return this._renderImageElement();
      }

      return null;
    }
  }, {
    key: "renderAvatar",
    value: function renderAvatar() {
      if (this.props.avatar) {
        return /*#__PURE__*/React.createElement("span", {
          className: styles.avatarContainer
        }, this._renderImageElement(this.props.avatar));
      }

      return null;
    }
  }, {
    key: "renderRemoveIcon",
    value: function renderRemoveIcon() {
      if (!this.props.readOnly) {
        return /*#__PURE__*/React.createElement(Button, {
          title: "Remove",
          icon: closeIcon,
          "data-test": "ring-tag-remove",
          className: styles.remove,
          iconClassName: styles.removeIcon,
          onClick: this.props.onRemove,
          style: {
            '--ring-icon-secondary-color': this.props.textColor
          }
        });
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames2;

      var classes = classNames('ring-js-shortcuts', styles.tag, (_classNames2 = {}, _defineProperty(_classNames2, styles.focused, this.state.focused), _defineProperty(_classNames2, styles.disabled, this.props.disabled), _defineProperty(_classNames2, styles.tagAngled, this.props.angled), _defineProperty(_classNames2, styles.withRemove, !this.props.readOnly), _classNames2), this.props.className);
      var _this$props = this.props,
          backgroundColor = _this$props.backgroundColor,
          textColor = _this$props.textColor;
      return /*#__PURE__*/React.createElement("span", {
        className: styles.container
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        "data-test": "ring-tag",
        className: classes,
        ref: this.tagRef,
        onClick: this.props.onClick,
        style: {
          backgroundColor: backgroundColor,
          color: textColor
        }
      }, this.renderAvatar(), this.renderCustomIcon(), this.renderImage(), /*#__PURE__*/React.createElement("span", {
        className: styles.content
      }, this.props.children)), this.renderRemoveIcon());
    }
  }]);

  return Tag;
}(PureComponent);

_defineProperty(Tag, "propTypes", {
  onRemove: PropTypes.func,
  onClick: PropTypes.func,
  rgTagIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  icon: PropTypes.string,
  avatar: PropTypes.string,
  rgTagTitle: PropTypes.string,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  focused: PropTypes.bool,
  angled: PropTypes.bool,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
});

_defineProperty(Tag, "defaultProps", {
  onRemove: function onRemove() {},
  onClick: function onClick() {},
  readOnly: false,
  disabled: false,
  focused: false
});

export default Tag;
