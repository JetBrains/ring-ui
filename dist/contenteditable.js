import { d as _defineProperty, i as _objectSpread2, e as _objectWithoutProperties, f as _extends, _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * @name ContentEditable
 */

function noop() {}

var commonPropTypes = {
  disabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  componentDidUpdate: PropTypes.func,
  onComponentUpdate: PropTypes.func,
  className: PropTypes.string,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

var ContentEditableBase = /*#__PURE__*/function (_Component) {
  _inherits(ContentEditableBase, _Component);

  var _super = _createSuper(ContentEditableBase);

  function ContentEditableBase() {
    _classCallCheck(this, ContentEditableBase);

    return _super.apply(this, arguments);
  }

  _createClass(ContentEditableBase, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.disabled !== this.props.disabled || nextProps.__html !== this.props.__html;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      this.props.onComponentUpdate(prevProps, prevState);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          __html = _this$props.__html;
          _this$props.onComponentUpdate;
          var disabled = _this$props.disabled,
          tabIndex = _this$props.tabIndex,
          inputRef = _this$props.inputRef,
          props = _objectWithoutProperties(_this$props, ["__html", "onComponentUpdate", "disabled", "tabIndex", "inputRef"]);

      return /*#__PURE__*/React.createElement("div", _extends({}, props, {
        ref: inputRef,
        disabled: disabled,
        role: "textbox",
        tabIndex: disabled ? null : tabIndex,
        contentEditable: !this.props.disabled,
        dangerouslySetInnerHTML: {
          __html: __html
        }
      }));
    }
  }]);

  return ContentEditableBase;
}(Component);

_defineProperty(ContentEditableBase, "propTypes", _objectSpread2(_objectSpread2({}, commonPropTypes), {}, {
  __html: PropTypes.string
}));

_defineProperty(ContentEditableBase, "defaultProps", {
  disabled: false,
  tabIndex: 0,
  onInput: noop,
  onComponentUpdate: noop
});

var ContentEditable = function ContentEditable(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, ["children"]);

  return /*#__PURE__*/React.createElement(ContentEditableBase, _extends({}, props, {
    __html: renderToStaticMarkup(children)
  }));
};

ContentEditable.propTypes = _objectSpread2(_objectSpread2({}, commonPropTypes), {}, {
  children: PropTypes.node
});

export default ContentEditable;
