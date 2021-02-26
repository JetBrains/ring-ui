import { e as _objectWithoutProperties, f as _extends, _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, c as _createClass, j as _typeof } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { memo, cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { j as joinDataTestAttributes } from './data-tests-1a367745.js';
import chevronDown from '@jetbrains/icons/chevron-10px';
import Icon from './icon.js';
import { B as Button } from './button-c0bc1992.js';
import styleInject from 'style-inject';
import 'util-deprecate';
import './memoize-ad2c954c.js';
import 'focus-visible';
import './theme-9a053da9.js';
import './clickableLink-3fc5662b.js';

var css_248z = "/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.dropdown_dropdown__1_u0F {\n  display: inline-block;\n}\n\n.dropdown_anchor__10aAj.dropdown_anchor__10aAj {\n  margin: 0 -3px;\n  padding: 0 3px;\n\n  font: inherit;\n}\n\n.dropdown_chevron__3AR1x {\n  margin-left: 2px;\n\n  line-height: normal;\n}\n";
var styles = {"dropdown":"dropdown_dropdown__1_u0F","anchor":"dropdown_anchor__10aAj","chevron":"dropdown_chevron__3AR1x"};
styleInject(css_248z);

var Anchor = function Anchor(_ref) {
  var children = _ref.children,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, ["children", "className"]);

  return /*#__PURE__*/React.createElement(Button, _extends({
    text: true,
    className: classNames(styles.anchor, className)
  }, restProps), children, /*#__PURE__*/React.createElement(Icon, {
    glyph: chevronDown,
    className: styles.chevron
  }));
};

Anchor.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
var Anchor$1 = /*#__PURE__*/memo(Anchor);

/**
 * @name Dropdown
 */

var Dropdown = /*#__PURE__*/function (_Component) {
  _inherits(Dropdown, _Component);

  var _super = _createSuper(Dropdown);

  function Dropdown() {
    var _this;

    _classCallCheck(this, Dropdown);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      show: _this.props.initShown,
      pinned: false
    });

    _defineProperty(_assertThisInitialized(_this), "onClick", function () {
      var _this$state = _this.state,
          show = _this$state.show,
          pinned = _this$state.pinned;
      var nextPinned = pinned;

      if (_this.props.hoverMode) {
        if (!pinned) {
          nextPinned = true;

          if (show) {
            _this.setState({
              pinned: true
            });

            return;
          }
        } else {
          nextPinned = false;
        }
      }

      _this._toggle(!show, nextPinned);
    });

    _defineProperty(_assertThisInitialized(_this), "onChildCloseAttempt", function () {
      var nextPinned = _this.state.pinned;

      if (_this.props.hoverMode) {
        nextPinned = false;
      }

      _this._toggle(false, nextPinned);
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseEnter", function (event) {
      _this._clearTimer();

      _this.props.onMouseEnter(event);

      _this.hoverTimer = setTimeout(function () {
        if (!_this.state.show) {
          _this._toggle(true);
        }
      }, _this.props.hoverShowTimeOut);
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseLeave", function (event) {
      _this.props.onMouseLeave(event);

      if (_this.state.pinned) {
        return;
      }

      _this._clearTimer();

      _this.hoverTimer = setTimeout(function () {
        if (_this.state.show) {
          _this._toggle(false);
        }
      }, _this.props.hoverHideTimeOut);
    });

    _defineProperty(_assertThisInitialized(_this), "handlePopupInteraction", function () {
      _this.setState(function (_ref) {
        var pinned = _ref.pinned;
        return pinned ? null : {
          pinned: true
        };
      });
    });

    return _this;
  }

  _createClass(Dropdown, [{
    key: "toggle",
    value: function toggle() {
      var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : !this.state.show;

      this._toggle(show);
    }
  }, {
    key: "_toggle",
    value: function _toggle(show) {
      var _this2 = this;

      var pinned = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state.pinned;
      this.setState({
        show: show,
        pinned: pinned
      }, function () {
        return show ? _this2.props.onShow() : _this2.props.onHide();
      });
    }
  }, {
    key: "_clearTimer",
    value: function _clearTimer() {
      if (this.hoverTimer) {
        clearTimeout(this.hoverTimer);
        this.hoverTimer = null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state2 = this.state,
          show = _this$state2.show,
          pinned = _this$state2.pinned;

      var _this$props = this.props;
          _this$props.initShown;
          _this$props.onShow;
          _this$props.onHide;
          _this$props.hoverShowTimeOut;
          _this$props.hoverHideTimeOut;
          var children = _this$props.children,
          anchor = _this$props.anchor,
          className = _this$props.className,
          activeClassName = _this$props.activeClassName,
          hoverMode = _this$props.hoverMode,
          clickMode = _this$props.clickMode,
          dataTest = _this$props['data-test'],
          restProps = _objectWithoutProperties(_this$props, ["initShown", "onShow", "onHide", "hoverShowTimeOut", "hoverHideTimeOut", "children", "anchor", "className", "activeClassName", "hoverMode", "clickMode", "data-test"]);

      var classes = classNames(styles.dropdown, className, _defineProperty({}, activeClassName, activeClassName != null && show));
      var anchorElement;
      var active = hoverMode ? pinned : show;

      switch (_typeof(anchor)) {
        case 'string':
          anchorElement = /*#__PURE__*/React.createElement(Anchor$1, {
            active: active
          }, anchor);
          break;

        case 'function':
          anchorElement = anchor({
            active: show,
            pinned: pinned
          });
          break;

        default:
          if (typeof anchor.type === 'string' || Array.isArray(anchor)) {
            anchorElement = anchor;
          } else {
            anchorElement = /*#__PURE__*/cloneElement(anchor, {
              active: active
            });
          }

      }

      var childProps = {
        hidden: !show,
        onCloseAttempt: this.onChildCloseAttempt,
        onMouseDown: hoverMode ? this.handlePopupInteraction : undefined,
        onContextMenu: hoverMode ? this.handlePopupInteraction : undefined,
        dontCloseOnAnchorClick: true
      };
      return /*#__PURE__*/React.createElement("div", _extends({
        "data-test": joinDataTestAttributes('ring-dropdown', dataTest)
      }, restProps, {
        onClick: clickMode ? this.onClick : undefined // anchorElement should be a `button` or an `a`
        ,
        role: "presentation",
        onMouseEnter: hoverMode ? this.onMouseEnter : undefined,
        onMouseLeave: hoverMode ? this.onMouseLeave : undefined,
        className: classes
      }), anchorElement, typeof children === 'function' ? children(childProps) : /*#__PURE__*/cloneElement(children, childProps));
    }
  }]);

  return Dropdown;
}(Component);

_defineProperty(Dropdown, "propTypes", {
  /**
   * Can be string, React element, or a function accepting an object with {active, pinned} properties and returning a React element
   * React element should render some interactive HTML element like `button` or `a`
   */
  anchor: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  initShown: PropTypes.bool,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  clickMode: PropTypes.bool,
  hoverMode: PropTypes.bool,
  hoverShowTimeOut: PropTypes.number,
  hoverHideTimeOut: PropTypes.number,
  onShow: PropTypes.func,
  onHide: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  'data-test': PropTypes.string
});

_defineProperty(Dropdown, "defaultProps", {
  initShown: false,
  clickMode: true,
  hoverMode: false,
  hoverShowTimeOut: 300,
  hoverHideTimeOut: 600,
  onShow: function onShow() {},
  onHide: function onHide() {},
  onMouseEnter: function onMouseEnter() {},
  onMouseLeave: function onMouseLeave() {}
});

export default Dropdown;
export { Anchor$1 as Anchor };
