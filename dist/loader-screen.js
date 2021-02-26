import { _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass, d as _defineProperty, e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Loader from './loader.js';
import styleInject from 'style-inject';
import './data-tests-1a367745.js';
import './dom-0ae85140.js';

var css_248z = "/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.loader-screen_loaderScreen__3Eii5 {\n  position: absolute;\n\n  width: 100%;\n  height: 100%;\n\n  text-align: center;\n  vertical-align: middle\n}\n\n.loader-screen_loaderScreen__3Eii5::before {\n    display: inline-block;\n\n    height: 100%;\n\n    content: '';\n\n    vertical-align: middle;\n  }\n\n.loader-screen_loader__2VqI1 {\n  display: inline-block;\n}\n\n.loader-screen_loaderWithoutSpacing__iDFwB canvas {\n  margin: 0;\n}\n";
var styles = {"loaderScreen":"loader-screen_loaderScreen__3Eii5","loader":"loader-screen_loader__2VqI1","loaderWithoutSpacing":"loader-screen_loaderWithoutSpacing__iDFwB"};
styleInject(css_248z);

/**
 * @name Loader Screen
 */

var LoaderScreen = /*#__PURE__*/function (_PureComponent) {
  _inherits(LoaderScreen, _PureComponent);

  var _super = _createSuper(LoaderScreen);

  function LoaderScreen() {
    _classCallCheck(this, LoaderScreen);

    return _super.apply(this, arguments);
  }

  _createClass(LoaderScreen, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          message = _this$props.message,
          className = _this$props.className,
          containerClassName = _this$props.containerClassName,
          restProps = _objectWithoutProperties(_this$props, ["message", "className", "containerClassName"]);

      var containerClasses = classNames(containerClassName, styles.loaderScreen);
      var loaderClasses = classNames(className, styles.loader, _defineProperty({}, styles.loaderWithoutSpacing, !message));
      return /*#__PURE__*/React.createElement("div", {
        className: containerClasses
      }, /*#__PURE__*/React.createElement(Loader, _extends({}, restProps, {
        message: message,
        className: loaderClasses
      })));
    }
  }]);

  return LoaderScreen;
}(PureComponent);

_defineProperty(LoaderScreen, "propTypes", {
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  message: PropTypes.string
});

export default LoaderScreen;
