import { e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { createContext, forwardRef } from 'react';
import PropTypes from 'prop-types';

var PopupTargetContext = /*#__PURE__*/createContext();
var PopupTarget = /*#__PURE__*/forwardRef(function PopupTarget(_ref, ref) {
  var id = _ref.id,
      children = _ref.children,
      restProps = _objectWithoutProperties(_ref, ["id", "children"]);

  var isFunctionChild = typeof children === 'function';
  var target = /*#__PURE__*/React.createElement("div", _extends({}, restProps, {
    "data-portaltarget": id,
    ref: ref
  }), !isFunctionChild && children);
  return /*#__PURE__*/React.createElement(PopupTargetContext.Provider, {
    value: id
  }, isFunctionChild ? children(target) : target);
});
PopupTarget.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
};

export { PopupTarget as P, PopupTargetContext as a };
