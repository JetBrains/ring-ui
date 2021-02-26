import { _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass, d as _defineProperty, f as _extends, e as _objectWithoutProperties } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Tag from './tag.js';
import '@jetbrains/icons/close';
import './icon.js';
import 'util-deprecate';
import 'style-inject';
import './memoize-ad2c954c.js';
import './button-c0bc1992.js';
import 'focus-visible';
import '@jetbrains/icons/chevron-10px';
import './theme-9a053da9.js';
import './clickableLink-3fc5662b.js';

function noop() {}
/**
 * @name Tags List
 */


var TagsList = /*#__PURE__*/function (_Component) {
  _inherits(TagsList, _Component);

  var _super = _createSuper(TagsList);

  function TagsList() {
    _classCallCheck(this, TagsList);

    return _super.apply(this, arguments);
  }

  _createClass(TagsList, [{
    key: "renderTag",
    value: function renderTag(tag, focusTag) {
      var TagComponent = this.props.customTagComponent || Tag;
      var readOnly = this.props.disabled || tag.readOnly || this.props.canNotBeEmpty && this.props.tags.length === 1;
      var tagClassName = this.props.tagClassName;
      return /*#__PURE__*/React.createElement(TagComponent, _extends({}, tag, {
        readOnly: readOnly,
        disabled: this.props.disabled || tag.disabled,
        focused: focusTag,
        onClick: this.props.handleClick(tag),
        onRemove: this.props.handleRemove(tag),
        className: tagClassName
      }), tag.label);
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className;
          _this$props.customTagComponent;
          _this$props.canNotBeEmpty;
          _this$props.handleClick;
          _this$props.tagClassName;
          _this$props.handleRemove;
          _this$props.tags;
          _this$props.activeIndex;
          var props = _objectWithoutProperties(_this$props, ["children", "className", "customTagComponent", "canNotBeEmpty", "handleClick", "tagClassName", "handleRemove", "tags", "activeIndex"]);

      var classes = classNames('ring-js-shortcuts', className);
      var tagsList = (this.props.tags || []).map(function (tag, index) {
        return _this.renderTag(tag, _this.props.activeIndex === index);
      });
      return /*#__PURE__*/React.createElement("div", _extends({
        "data-test": "ring-tags-list",
        className: classes
      }, props), tagsList, children);
    }
  }]);

  return TagsList;
}(Component);

_defineProperty(TagsList, "propTypes", {
  children: PropTypes.node,
  tags: PropTypes.array,
  customTagComponent: function customTagComponent(props, propName, componentName) {
    if (props[propName] && !props[propName].prototype instanceof Component) {
      return new Error("Invalid prop ".concat(propName, " supplied to ").concat(componentName, ". Validation failed."));
    }

    return null;
  },
  activeIndex: PropTypes.number,
  canNotBeEmpty: PropTypes.bool,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func,
  handleRemove: PropTypes.func,
  className: PropTypes.string,
  tagClassName: PropTypes.string
});

_defineProperty(TagsList, "defaultProps", {
  customTagComponent: null,
  canNotBeEmpty: false,
  disabled: false,
  handleClick: noop,
  handleRemove: noop
});

export default TagsList;
