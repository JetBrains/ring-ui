import { _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, c as _createClass, e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Waypoint } from 'react-waypoint';
import styleInject from 'style-inject';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.content-layout_contentLayout__3Y9sw {\n  position: relative;\n\n  display: flex;\n  flex-flow: row nowrap;\n}\n\n.content-layout_contentLayoutContent__2Zazj {\n  align-self: flex-start;\n  flex-grow: 2;\n\n  width: 100%; /* without this hack IE11 render contentLayoutContent wider than its container */\n  margin: 0 32px;\n}\n\n.content-layout_sidebarContainer__2WmOL {\n  min-width: 240px;\n  max-width: 240px;\n}\n\n.content-layout_sidebarContainerRight__2_-4P {\n  order: 1;\n}\n\n.content-layout_sidebar__2xyOI {\n  overflow: auto;\n\n  box-sizing: border-box;\n  min-width: 240px;\n  max-width: 240px;\n  height: 100%;\n  padding-right: 16px;\n  padding-left: 32px;\n}\n\n.content-layout_sidebarRight__xaP7t {\n  padding-right: 32px;\n  padding-left: 16px;\n}\n\n.content-layout_sidebarFixedTop__1zrZ7 {\n  top: 0;\n  bottom: 0\n}\n\n.content-layout_sidebarFixedTop__1zrZ7.content-layout_sidebarFixedTop__1zrZ7 {\n    position: fixed;\n  }\n\n.content-layout_sidebarFixedBottom__1Bow8.content-layout_sidebarFixedBottom__1Bow8 {\n  position: absolute;\n  top: auto;\n  bottom: 0;\n}\n\n.content-layout_bottomMarker__1GmDi {\n  position: absolute;\n  bottom: 0;\n}\n\n@media (max-width: 639px), (min-width: 640px) and (max-width: 959px) {\n    .content-layout_contentLayoutResponsive__3I4Bc .content-layout_contentLayoutContent__2Zazj {\n      margin: 0 16px;\n    }\n\n    .content-layout_contentLayoutResponsive__3I4Bc .content-layout_sidebar__2xyOI {\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      left: 0;\n\n      box-sizing: content-box;\n      padding: 0 16px;\n    }\n\n    .content-layout_contentLayoutResponsive__3I4Bc .content-layout_sidebarFixedTop__1zrZ7 {\n      position: fixed;\n    }\n\n    .content-layout_contentLayoutResponsive__3I4Bc .content-layout_sidebarFixedBottom__1Bow8 {\n      top: auto;\n    }\n\n    .content-layout_contentLayoutResponsive__3I4Bc .content-layout_sidebarRight__xaP7t {\n      right: 0;\n      left: auto;\n    }\n\n    .content-layout_contentLayoutResponsive__3I4Bc .content-layout_sidebarContainer__2WmOL {\n      min-width: 0;\n      max-width: 0;\n    }\n  }\n\n@media (max-width: 639px) {\n    .content-layout_contentLayoutResponsive__3I4Bc .content-layout_sidebar__2xyOI {\n      width: 80%;\n      min-width: 0;\n      max-width: none;\n    }\n  }\n";
var styles = {"unit":"8px","extra-small-screen-media":"(max-width: calc(640px - 1px))","small-screen-media":"(min-width: 640px) and (max-width: calc(960px - 1px))","sidebarWidth":"calc(8px * 30)","contentLayout":"content-layout_contentLayout__3Y9sw","contentLayoutContent":"content-layout_contentLayoutContent__2Zazj","sidebarContainer":"content-layout_sidebarContainer__2WmOL","sidebarContainerRight":"content-layout_sidebarContainerRight__2_-4P","sidebar":"content-layout_sidebar__2xyOI","sidebarRight":"content-layout_sidebarRight__xaP7t","sidebarFixedTop":"content-layout_sidebarFixedTop__1zrZ7","sidebarFixedBottom":"content-layout_sidebarFixedBottom__1Bow8","bottomMarker":"content-layout_bottomMarker__1GmDi","contentLayoutResponsive":"content-layout_contentLayoutResponsive__3I4Bc"};
styleInject(css_248z);

var ABOVE = 'above';
var INSIDE = 'inside';

var Sidebar = /*#__PURE__*/function (_Component) {
  _inherits(Sidebar, _Component);

  var _super = _createSuper(Sidebar);

  function Sidebar() {
    var _this;

    _classCallCheck(this, Sidebar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      topIsOutside: true,
      bottomIsOutside: true
    });

    _defineProperty(_assertThisInitialized(_this), "handleTopWaypoint", function (_ref) {
      var currentPosition = _ref.currentPosition;

      _this.setState({
        topIsOutside: currentPosition === ABOVE
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleBottomWaypoint", function (_ref2) {
      var currentPosition = _ref2.currentPosition,
          waypointTop = _ref2.waypointTop;

      _this.setState({
        sidebarVisibleHeight: waypointTop,
        bottomIsOutside: currentPosition !== INSIDE
      });
    });

    _defineProperty(_assertThisInitialized(_this), "sidebarRef", function (node) {
      _this.sidebarNode = node;
    });

    return _this;
  }

  _createClass(Sidebar, [{
    key: "shouldUseFixation",
    value: function shouldUseFixation() {
      var contentNode = this.props.contentNode;
      var sidebarNode = this.sidebarNode;

      if (!contentNode || !sidebarNode) {
        return false;
      }

      return contentNode.offsetHeight >= sidebarNode.offsetHeight;
    }
  }, {
    key: "shouldFixateBottom",
    value: function shouldFixateBottom() {
      var _this$state = this.state,
          topIsOutside = _this$state.topIsOutside,
          bottomIsOutside = _this$state.bottomIsOutside;
      return !bottomIsOutside && topIsOutside && this.shouldUseFixation();
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames2;

      var _this$props = this.props,
          right = _this$props.right,
          children = _this$props.children,
          className = _this$props.className,
          containerClassName = _this$props.containerClassName,
          fixedClassName = _this$props.fixedClassName;
          _this$props.contentNode;
          var restProps = _objectWithoutProperties(_this$props, ["right", "children", "className", "containerClassName", "fixedClassName", "contentNode"]);

      var _this$state2 = this.state,
          topIsOutside = _this$state2.topIsOutside,
          bottomIsOutside = _this$state2.bottomIsOutside,
          sidebarVisibleHeight = _this$state2.sidebarVisibleHeight;
      var shouldFixateTop = bottomIsOutside && topIsOutside && this.shouldUseFixation();
      var shouldFixateBottom = this.shouldFixateBottom();
      var containerClasses = classNames(styles.sidebarContainer, containerClassName, _defineProperty({}, styles.sidebarContainerRight, right));
      var classes = classNames(styles.sidebar, className, (_classNames2 = {}, _defineProperty(_classNames2, styles.sidebarRight, right), _defineProperty(_classNames2, styles.sidebarFixedTop, shouldFixateTop), _defineProperty(_classNames2, styles.sidebarFixedBottom, shouldFixateBottom), _defineProperty(_classNames2, fixedClassName, shouldFixateTop || shouldFixateBottom), _classNames2));
      var style = {
        maxHeight: shouldFixateBottom && sidebarVisibleHeight ? "".concat(sidebarVisibleHeight, "px") : null
      };
      return /*#__PURE__*/React.createElement("aside", {
        className: containerClasses,
        ref: this.sidebarRef
      }, /*#__PURE__*/React.createElement(Waypoint, {
        onEnter: this.handleTopWaypoint,
        onLeave: this.handleTopWaypoint
      }), /*#__PURE__*/React.createElement("div", _extends({}, restProps, {
        style: style,
        className: classes
      }), children), /*#__PURE__*/React.createElement("div", {
        className: styles.bottomMarker
      }, /*#__PURE__*/React.createElement(Waypoint, {
        onEnter: this.handleBottomWaypoint,
        onLeave: this.handleBottomWaypoint
      })));
    }
  }]);

  return Sidebar;
}(Component);

_defineProperty(Sidebar, "propTypes", {
  right: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  fixedClassName: PropTypes.string,
  contentNode: PropTypes.object
});

/**
 * @name Content Layout
 */

var ContentLayout = /*#__PURE__*/function (_Component) {
  _inherits(ContentLayout, _Component);

  var _super = _createSuper(ContentLayout);

  function ContentLayout() {
    var _this;

    _classCallCheck(this, ContentLayout);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {});

    _defineProperty(_assertThisInitialized(_this), "saveContentNode", function (contentNode) {
      _this.setState({
        contentNode: contentNode
      });
    });

    return _this;
  }

  _createClass(ContentLayout, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          contentClassName = _this$props.contentClassName,
          responsive = _this$props.responsive,
          restProps = _objectWithoutProperties(_this$props, ["children", "className", "contentClassName", "responsive"]);

      var classes = classNames(styles.contentLayout, className, _defineProperty({}, styles.contentLayoutResponsive, responsive));
      var contentClasses = classNames(styles.contentLayoutContent, contentClassName);
      var childrenArray = React.Children.toArray(children);
      var sidebarChild = childrenArray.filter(function (child) {
        return child && child.type === Sidebar;
      })[0];
      var sidebar = sidebarChild && /*#__PURE__*/cloneElement(sidebarChild, {
        contentNode: this.state.contentNode
      });
      var contentChildren = childrenArray.filter(function (child) {
        return child !== sidebarChild;
      });
      return /*#__PURE__*/React.createElement("div", _extends({}, restProps, {
        className: classes
      }), sidebar, /*#__PURE__*/React.createElement("main", {
        className: contentClasses,
        ref: this.saveContentNode
      }, contentChildren));
    }
  }]);

  return ContentLayout;
}(Component);

_defineProperty(ContentLayout, "propTypes", {
  children: PropTypes.node,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  responsive: PropTypes.bool
});

_defineProperty(ContentLayout, "defaultProps", {
  responsive: true
});

export default ContentLayout;
export { Sidebar };
