import { d as _defineProperty, _ as _inherits, a as _createSuper, b as _classCallCheck, g as _assertThisInitialized, c as _createClass, f as _extends, e as _objectWithoutProperties } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { createContext, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { j as joinDataTestAttributes } from './data-tests-1a367745.js';
import { i as interpolateLinear } from './linear-function-3bd43cfe.js';
import styleInject from 'style-inject';
import createResizeDetector from 'element-resize-detector';
import { s as scheduleRAF } from './schedule-raf-edeb21db.js';

var TITLE_RESIZE_END = 20;
var TITLE_RESIZE_THRESHOLD = 36;
var PhaseContext = /*#__PURE__*/createContext();
var ScrollHandlerContext = /*#__PURE__*/createContext();
function adaptiveIslandHOC(ComposedComponent) {
  var _class, _temp;

  return _temp = _class = /*#__PURE__*/function (_Component) {
    _inherits(AdaptiveIsland, _Component);

    var _super = _createSuper(AdaptiveIsland);

    function AdaptiveIsland() {
      var _this;

      _classCallCheck(this, AdaptiveIsland);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "state", {
        phase: 0
      });

      _defineProperty(_assertThisInitialized(_this), "onContentScroll", function (_ref) {
        var scrollTop = _ref.scrollTop,
            scrollHeight = _ref.scrollHeight,
            clientHeight = _ref.clientHeight;

        if (scrollHeight - clientHeight >= interpolateLinear(TITLE_RESIZE_THRESHOLD, TITLE_RESIZE_END, _this.state.phase)) {
          var phase = Math.min(1, scrollTop / TITLE_RESIZE_END);

          _this.setState({
            phase: phase
          });
        }
      });

      return _this;
    }

    _createClass(AdaptiveIsland, [{
      key: "render",
      value: function render() {
        return /*#__PURE__*/React.createElement(PhaseContext.Provider, {
          value: this.state.phase
        }, /*#__PURE__*/React.createElement(ScrollHandlerContext.Provider, {
          value: this.onContentScroll
        }, /*#__PURE__*/React.createElement(ComposedComponent, this.props)));
      }
    }]);

    return AdaptiveIsland;
  }(Component), _defineProperty(_class, "propTypes", ComposedComponent.propTypes), _temp;
}

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.island_island__tyHcv {\n  display: flex;\n  flex-direction: column;\n\n  border: 1px solid #dfe5eb;\n\n  border: 1px solid var(--ring-line-color);\n  border-radius: 3px;\n  border-radius: var(--ring-border-radius);\n\n  background-color: #fff;\n\n  background-color: var(--ring-content-background-color);\n  box-shadow: 0 1px 4px rgba(0, 42, 76, 0.15);\n  box-shadow: 0 1px 4px var(--ring-popup-shadow-color);\n}\n\n.island_withTransparentBottomBorder__2FZgs {\n  transition: border-bottom-color 0.1s;\n\n  border-bottom: 1px solid transparent;\n}\n\n.island_header__1UlrB {\n\n  box-sizing: border-box;\n  width: 100%;\n  padding: 0 32px;\n\n  line-height: 28px;\n}\n\n.island_withBottomBorder__xof22.island_withBottomBorder__xof22 {\n  border-bottom-color: rgba(0, 42, 76, 0.1);\n  border-bottom-color: var(--ring-popup-border-color);\n  border-top-left-radius: 3px;\n  border-top-left-radius: var(--ring-border-radius);\n  border-top-right-radius: 3px;\n  border-top-right-radius: var(--ring-border-radius);\n}\n\n.island_title__31Kjx {\n  display: block;\n  float: left;\n\n  transform-origin: 0 50%;\n  word-break: break-word;\n\n  color: #1f2326;\n\n  color: var(--ring-heading-color);\n\n  font-weight: bold;\n}\n\n.island_narrowIsland__3d0lP .island_header__1UlrB {\n  padding: 0 16px;\n}\n\n.island_content__ySqlk {\n  position: relative;\n\n  display: flex;\n  overflow: auto;\n\n  width: 100%;\n  -webkit-overflow-scrolling: touch;\n}\n\n.island_scrollableWrapper__2IH80 {\n  overflow: auto;\n\n  width: 100%;\n  padding: 16px 32px\n}\n\n.island_scrollableWrapper__2IH80:focus:not(.focus-visible) {\n    outline: none;\n  }\n\n.island_narrowIsland__3d0lP .island_scrollableWrapper__2IH80 {\n  padding: 16px 16px;\n}\n\n.island_withoutPaddings__1EXUQ .island_scrollableWrapper__2IH80 {\n  padding: 0;\n}\n\n.island_contentWithTopFade__1RkLp::before {\n  position: absolute;\n  z-index: 1;\n  z-index: var(--ring-fixed-z-index);\n  left: 0;\n\n  display: block;\n\n  width: 100%;\n  height: 24px;\n\n  content: '';\n\n  pointer-events: none;\n\n  opacity: 0.8;\n  background: linear-gradient(to top, rgba(255, 255, 255, 0), #fff);\n  background: linear-gradient(to top, rgba(255, 255, 255, 0), var(--ring-content-background-color)); /* stylelint-disable-line function-linear-gradient-no-nonstandard-direction */\n}\n\n.island_contentWithTopFade__1RkLp:first-child::before {\n  border-top-left-radius: 3px;\n  border-top-left-radius: var(--ring-border-radius);\n  border-top-right-radius: 3px;\n  border-top-right-radius: var(--ring-border-radius);\n}\n\n.island_contentWithBottomFade__3FPsJ::after {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n\n  display: block;\n\n  width: 100%;\n  height: 24px;\n\n  content: '';\n  pointer-events: none;\n\n  opacity: 0.8;\n  border-bottom-right-radius: 3px;\n  border-bottom-right-radius: var(--ring-border-radius);\n  border-bottom-left-radius: 3px;\n  border-bottom-left-radius: var(--ring-border-radius);\n  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff);\n  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), var(--ring-content-background-color));\n}\n";
var styles = {"unit":"8px","gradientStart":"rgba(255, 255, 255, 0)","gradientStop":"var(--ring-content-background-color)","island":"island_island__tyHcv","withTransparentBottomBorder":"island_withTransparentBottomBorder__2FZgs","header":"island_header__1UlrB island_withTransparentBottomBorder__2FZgs","withBottomBorder":"island_withBottomBorder__xof22","title":"island_title__31Kjx","narrowIsland":"island_narrowIsland__3d0lP","content":"island_content__ySqlk","scrollableWrapper":"island_scrollableWrapper__2IH80","withoutPaddings":"island_withoutPaddings__1EXUQ","contentWithTopFade":"island_contentWithTopFade__1RkLp","contentWithBottomFade":"island_contentWithBottomFade__3FPsJ"};
styleInject(css_248z);

var Start = {
  FONT_SIZE: 24,
  LINE_HEIGHT: 28,
  PADDING: 16
};
var End = {
  FONT_SIZE: 13,
  LINE_HEIGHT: 28,
  // Compensation
  X: 0.4,
  Y: 0.1,
  SPACING: 1.09
};
var BORDER_APPEAR_PHASE = 0.5;

var Header = /*#__PURE__*/function (_Component) {
  _inherits(Header, _Component);

  var _super = _createSuper(Header);

  function Header() {
    _classCallCheck(this, Header);

    return _super.apply(this, arguments);
  }

  _createClass(Header, [{
    key: "style",
    value: function style(name) {
      return interpolateLinear(Start[name] || 0, End[name] || 0, this.props.phase);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          wrapWithTitle = _this$props.wrapWithTitle,
          border = _this$props.border,
          phase = _this$props.phase,
          restProps = _objectWithoutProperties(_this$props, ["children", "className", "wrapWithTitle", "border", "phase"]);

      var classes = classNames(styles.header, className, _defineProperty({}, styles.withBottomBorder, border || phase >= BORDER_APPEAR_PHASE));
      var headerStyle = phase != null ? {
        lineHeight: "".concat(this.style('LINE_HEIGHT'), "px"),
        // need to append px because number is a valid line-height value
        paddingTop: this.style('PADDING')
      } : null;
      var scaleFont = phase != null && this.style('FONT_SIZE') / Start.FONT_SIZE;
      var titleStyle = phase != null && phase < 1 ? {
        fontSize: Start.FONT_SIZE,
        transform: "translate(".concat(this.style('X'), "px, ").concat(this.style('Y'), "px) scale(").concat(scaleFont, ")"),
        letterSpacing: this.style('SPACING')
      } : null;
      return /*#__PURE__*/React.createElement("div", _extends({}, restProps, {
        "data-test": "ring-island-header",
        className: classes,
        style: headerStyle
      }), wrapWithTitle && /*#__PURE__*/React.createElement("div", {
        className: styles.title,
        style: titleStyle
      }, children), !wrapWithTitle && children);
    }
  }]);

  return Header;
}(Component);

_defineProperty(Header, "propTypes", {
  children: PropTypes.node,
  className: PropTypes.string,
  border: PropTypes.bool,
  wrapWithTitle: PropTypes.bool,
  phase: PropTypes.number
});

_defineProperty(Header, "defaultProps", {
  wrapWithTitle: true
});

var HeaderWrapper = function HeaderWrapper(props) {
  return /*#__PURE__*/React.createElement(PhaseContext.Consumer, null, function (phase) {
    var addProps = phase != null ? {
      phase: phase
    } : {};
    return /*#__PURE__*/React.createElement(Header, _extends({}, props, addProps));
  });
};

var scheduleScrollAction = scheduleRAF();

var noop = function noop() {};

var END_DISTANCE = 16;

var Content = /*#__PURE__*/function (_Component) {
  _inherits(Content, _Component);

  var _super = _createSuper(Content);

  function Content() {
    var _this;

    _classCallCheck(this, Content);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      scrolledToTop: true,
      scrolledToBottom: false
    });

    _defineProperty(_assertThisInitialized(_this), "resizeDetector", createResizeDetector({
      strategy: 'scroll'
    }));

    _defineProperty(_assertThisInitialized(_this), "setWrapper", function (node) {
      if (!node) {
        return;
      }

      _this.wrapperNode = node;

      _this.resizeDetector.listenTo(node, _this.calculateScrollPosition);
    });

    _defineProperty(_assertThisInitialized(_this), "calculateScrollPosition", function () {
      return scheduleScrollAction(function () {
        var _assertThisInitialize = _assertThisInitialized(_this),
            scrollableNode = _assertThisInitialize.scrollableNode;

        if (!scrollableNode) {
          return;
        }

        var scrollTop = scrollableNode.scrollTop,
            scrollHeight = scrollableNode.scrollHeight,
            offsetHeight = scrollableNode.offsetHeight;
        var scrolledToTop = scrollTop === 0;
        var scrolledToBottom = offsetHeight + scrollTop >= scrollHeight - END_DISTANCE;

        if (scrolledToBottom) {
          _this.props.onScrollToBottom();
        }

        _this.setState({
          scrolledToTop: scrolledToTop,
          scrolledToBottom: scrolledToBottom
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onScroll", function () {
      _this.props.onScroll(_this.scrollableNode);

      _this.calculateScrollPosition();
    });

    _defineProperty(_assertThisInitialized(_this), "setScrollableNodeAndCalculatePosition", function (node) {
      if (!node) {
        return;
      }

      _this.scrollableNode = node;

      _this.calculateScrollPosition();
    });

    return _this;
  }

  _createClass(Content, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.scrollableNode = null;

      if (!this.wrapperNode) {
        return;
      }

      this.resizeDetector.removeAllListeners(this.wrapperNode);
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          bottomBorder = _this$props.bottomBorder,
          scrollableWrapperClassName = _this$props.scrollableWrapperClassName;
          _this$props.onScroll;
          _this$props.onScrollToBottom;
          var fade = _this$props.fade,
          restProps = _objectWithoutProperties(_this$props, ["children", "className", "bottomBorder", "scrollableWrapperClassName", "onScroll", "onScrollToBottom", "fade"]);

      var _this$state = this.state,
          scrolledToTop = _this$state.scrolledToTop,
          scrolledToBottom = _this$state.scrolledToBottom;
      var classes = classNames(styles.content, className, (_classNames = {}, _defineProperty(_classNames, styles.contentWithTopFade, fade && !scrolledToTop), _defineProperty(_classNames, styles.contentWithBottomFade, fade && !scrolledToBottom), _defineProperty(_classNames, styles.withTransparentBottomBorder, bottomBorder), _defineProperty(_classNames, styles.withBottomBorder, bottomBorder && !scrolledToBottom), _classNames));
      var scrollableWrapperClasses = classNames(styles.scrollableWrapper, scrollableWrapperClassName);
      return /*#__PURE__*/React.createElement("div", _extends({}, restProps, {
        "data-test": "ring-island-content",
        className: classes
      }), /*#__PURE__*/React.createElement("div", {
        // it has to be focusable because it can be scrollable
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex: 0,
        "data-scrollable-container": true,
        className: scrollableWrapperClasses,
        ref: this.setScrollableNodeAndCalculatePosition,
        onScroll: fade ? this.onScroll : noop
      }, fade && /*#__PURE__*/React.createElement("div", {
        ref: this.setWrapper
      }, children), !fade && children));
    }
  }]);

  return Content;
}(Component);

_defineProperty(Content, "propTypes", {
  children: PropTypes.node,
  className: PropTypes.string,
  scrollableWrapperClassName: PropTypes.string,
  fade: PropTypes.bool,
  bottomBorder: PropTypes.bool,
  onScroll: PropTypes.func,
  onScrollToBottom: PropTypes.func
});

_defineProperty(Content, "defaultProps", {
  fade: true,
  bottomBorder: false,
  onScroll: noop,
  onScrollToBottom: noop
});

var ContentWrapper = function ContentWrapper(props) {
  return /*#__PURE__*/React.createElement(ScrollHandlerContext.Consumer, null, function (onScroll) {
    var addProps = onScroll != null ? {
      onScroll: onScroll,
      bottomBorder: true
    } : {};
    return /*#__PURE__*/React.createElement(Content, _extends({}, props, addProps));
  });
};

/**
 * @name Island
 */

var Island = /*#__PURE__*/function (_Component) {
  _inherits(Island, _Component);

  var _super = _createSuper(Island);

  function Island() {
    _classCallCheck(this, Island);

    return _super.apply(this, arguments);
  }

  _createClass(Island, [{
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          narrow = _this$props.narrow,
          withoutPaddings = _this$props.withoutPaddings,
          dataTest = _this$props['data-test'],
          restProps = _objectWithoutProperties(_this$props, ["children", "className", "narrow", "withoutPaddings", "data-test"]);

      var classes = classNames(styles.island, className, (_classNames = {}, _defineProperty(_classNames, styles.narrowIsland, narrow), _defineProperty(_classNames, styles.withoutPaddings, withoutPaddings), _classNames));
      return /*#__PURE__*/React.createElement("div", _extends({}, restProps, {
        className: classes,
        "data-test": joinDataTestAttributes('ring-island', dataTest)
      }), children);
    }
  }]);

  return Island;
}(Component);

_defineProperty(Island, "propTypes", {
  children: PropTypes.node,
  className: PropTypes.string,
  narrow: PropTypes.bool,
  withoutPaddings: PropTypes.bool,
  'data-test': PropTypes.string
});
var AdaptiveIsland = adaptiveIslandHOC(Island);

export default Island;
export { AdaptiveIsland, ContentWrapper as Content, HeaderWrapper as Header };
