import { d as _defineProperty, _ as _inherits, a as _createSuper, b as _classCallCheck, g as _assertThisInitialized, c as _createClass, e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

var LEFT_BUTTON = 0; // Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks

var isPlainLeftClick = function isPlainLeftClick(e) {
  return e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;
};

var ClickableLink = /*#__PURE__*/function (_PureComponent) {
  _inherits(ClickableLink, _PureComponent);

  var _super = _createSuper(ClickableLink);

  function ClickableLink() {
    var _this;

    _classCallCheck(this, ClickableLink);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "onClick", function (e) {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          onConditionalClick = _this$props.onConditionalClick,
          onPlainLeftClick = _this$props.onPlainLeftClick;
      var isPlainLeft = isPlainLeftClick(e);

      if (onClick) {
        onClick(e);
      }

      if (onConditionalClick) {
        onConditionalClick(isPlainLeft, e);
      }

      if (onPlainLeftClick && isPlainLeft) {
        e.preventDefault();
        onPlainLeftClick(e);
      }
    });

    return _this;
  }

  _createClass(ClickableLink, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props;
          _this$props2.onConditionalClick;
          _this$props2.onPlainLeftClick;
          _this$props2.activeClassName;
          var href = _this$props2.href,
          children = _this$props2.children,
          restProps = _objectWithoutProperties(_this$props2, ["onConditionalClick", "onPlainLeftClick", "activeClassName", "href", "children"]);

      return /*#__PURE__*/React.createElement("a", _extends({
        href: href
      }, restProps, {
        onClick: this.onClick
      }), children);
    }
  }]);

  return ClickableLink;
}(PureComponent);

_defineProperty(ClickableLink, "propTypes", {
  onClick: PropTypes.func,
  onPlainLeftClick: PropTypes.func,
  onConditionalClick: PropTypes.func,
  activeClassName: PropTypes.string,
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
});

export { ClickableLink as C };
