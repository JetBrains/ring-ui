import { _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, c as _createClass, e as _objectWithoutProperties, i as _objectSpread2, f as _extends, h as _slicedToArray } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { i as isDataURI, p as parseQueryString, e as encodeURL } from './url-a3cbb96f.js';
import { a as getPixelRatio } from './dom-0ae85140.js';
import styleInject from 'style-inject';

var css_248z = "/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.avatar_avatar__1Axze {\n  -o-object-fit: cover;\n     object-fit: cover;\n  -o-object-position: center;\n     object-position: center;\n\n  border-radius: 3px;\n\n  border-radius: var(--ring-border-radius); /* This is a \"graceful degradation\" fallback, while the real value is controlled by JS */\n}\n\n.avatar_subavatar__2Maep {\n  position: absolute;\n  top: 15px;\n  left: 27px;\n\n  border: 1px #fff solid;\n\n  border: 1px var(--ring-content-background-color) solid;\n}\n\n.avatar_empty__2ZwIS {\n  display: inline-block;\n\n  box-sizing: border-box;\n\n  border: 1px solid #b8d1e5;\n\n  border: 1px solid var(--ring-borders-color);\n}\n";
var styles = {"avatar":"avatar_avatar__1Axze","subavatar":"avatar_subavatar__2Maep","empty":"avatar_empty__2ZwIS"};
styleInject(css_248z);

/**
 * @name Avatar
 */

var Size = {
  Size18: 18,
  Size20: 20,
  Size24: 24,
  Size32: 32,
  Size40: 40,
  Size48: 48,
  Size56: 56
};

var Avatar = /*#__PURE__*/function (_PureComponent) {
  _inherits(Avatar, _PureComponent);

  var _super = _createSuper(Avatar);

  function Avatar() {
    var _this;

    _classCallCheck(this, Avatar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      errorUrl: ''
    });

    _defineProperty(_assertThisInitialized(_this), "handleError", function () {
      _this.setState({
        errorUrl: _this.props.url
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleSuccess", function () {
      _this.setState({
        errorUrl: ''
      });
    });

    return _this;
  }

  _createClass(Avatar, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          size = _this$props.size,
          url = _this$props.url,
          dpr = _this$props.dpr,
          style = _this$props.style,
          round = _this$props.round,
          subavatar = _this$props.subavatar,
          subavatarSize = _this$props.subavatarSize,
          restProps = _objectWithoutProperties(_this$props, ["size", "url", "dpr", "style", "round", "subavatar", "subavatarSize"]);

      var sizeString = "".concat(size, "px");
      var subavatarSizeString = "".concat(subavatarSize, "px");
      var borderRadius = size <= Size.Size18 ? 'var(--ring-border-radius-small)' : 'var(--ring-border-radius)';

      var styleObj = _objectSpread2({
        borderRadius: round ? '50%' : borderRadius,
        height: sizeString,
        width: sizeString
      }, style);

      var styleObjGroup = _objectSpread2({
        borderRadius: '2px',
        height: subavatarSizeString,
        width: subavatarSizeString
      }, style);

      if (!url || this.state.errorUrl === url) {
        return /*#__PURE__*/React.createElement("span", _extends({}, restProps, {
          className: classNames(styles.avatar, styles.empty, this.props.className),
          style: styleObj
        }));
      }

      var src = url;

      if (!isDataURI(url)) {
        var _url$split = url.split('?'),
            _url$split2 = _slicedToArray(_url$split, 2),
            urlStart = _url$split2[0],
            query = _url$split2[1];

        var queryParams = _objectSpread2(_objectSpread2({}, parseQueryString(query)), {}, {
          dpr: dpr,
          size: size
        });

        src = encodeURL(urlStart, queryParams);
      }

      var subavatarSrc = null;

      if (subavatar && !isDataURI(subavatar)) {
        var _subavatar$split = subavatar.split('?'),
            _subavatar$split2 = _slicedToArray(_subavatar$split, 2),
            _urlStart = _subavatar$split2[0],
            _query = _subavatar$split2[1];

        var _queryParams = _objectSpread2(_objectSpread2({}, parseQueryString(_query)), {}, {
          dpr: dpr,
          subavatarSizeString: subavatarSizeString
        });

        subavatarSrc = encodeURL(_urlStart, _queryParams);
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", _extends({}, restProps, {
          onError: this.handleError,
          onLoad: this.handleSuccess,
          className: classNames(styles.avatar, this.props.className),
          style: styleObj,
          src: src,
          alt: "User avatar"
        })), /*#__PURE__*/React.createElement("img", _extends({}, restProps, {
          onError: this.handleError,
          onLoad: this.handleSuccess,
          className: classNames(styles.subavatar),
          style: styleObjGroup,
          src: subavatarSrc,
          alt: "Subavatar"
        })));
      } else {
        return /*#__PURE__*/React.createElement("img", _extends({}, restProps, {
          onError: this.handleError,
          onLoad: this.handleSuccess,
          className: classNames(styles.avatar, this.props.className),
          style: styleObj,
          src: src,
          alt: "User avatar"
        }));
      }
    }
  }]);

  return Avatar;
}(PureComponent);

_defineProperty(Avatar, "propTypes", {
  dpr: PropTypes.number,
  className: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object,
  url: PropTypes.string,
  round: PropTypes.bool,
  subavatar: PropTypes.string,
  subavatarSize: PropTypes.number
});

_defineProperty(Avatar, "defaultProps", {
  dpr: getPixelRatio(),
  size: Size.Size20,
  subavatarSize: Size.Size20 / 2,
  style: {}
});

export default Avatar;
export { Size };
