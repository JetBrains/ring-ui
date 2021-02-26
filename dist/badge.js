import { _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass, d as _defineProperty, e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { j as joinDataTestAttributes } from './data-tests-1a367745.js';
import { b as badgeStyles } from './badge-5ef3e7e8.js';
import 'style-inject';

/**
 * @name Badge
 */

var Badge = /*#__PURE__*/function (_PureComponent) {
  _inherits(Badge, _PureComponent);

  var _super = _createSuper(Badge);

  function Badge() {
    _classCallCheck(this, Badge);

    return _super.apply(this, arguments);
  }

  _createClass(Badge, [{
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props = this.props,
          gray = _this$props.gray,
          valid = _this$props.valid,
          invalid = _this$props.invalid,
          disabled = _this$props.disabled,
          className = _this$props.className,
          children = _this$props.children,
          dataTest = _this$props['data-test'],
          props = _objectWithoutProperties(_this$props, ["gray", "valid", "invalid", "disabled", "className", "children", "data-test"]);

      var classes = classNames(badgeStyles.badge, className, (_classNames = {}, _defineProperty(_classNames, badgeStyles.gray, gray), _defineProperty(_classNames, badgeStyles.valid, valid), _defineProperty(_classNames, badgeStyles.invalid, invalid), _defineProperty(_classNames, badgeStyles.disabled, disabled), _classNames));
      return /*#__PURE__*/React.createElement("span", _extends({}, props, {
        "data-test": joinDataTestAttributes('ring-badge', dataTest),
        className: classes
      }), children);
    }
  }]);

  return Badge;
}(PureComponent);

_defineProperty(Badge, "propTypes", {
  gray: PropTypes.bool,
  valid: PropTypes.bool,
  invalid: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  'data-test': PropTypes.string
});

export default Badge;
