import { e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { memo, forwardRef, createContext } from 'react';

var Theme = {
  LIGHT: 'light',
  DARK: 'dark'
};
var ThemeContext = /*#__PURE__*/createContext();

var getDisplayName = function getDisplayName(Component) {
  var _ref, _Component$name;

  return typeof Component === 'string' ? Component : (_ref = (_Component$name = Component.name) !== null && _Component$name !== void 0 ? _Component$name : Component.displayName) !== null && _ref !== void 0 ? _ref : 'Component';
};

var withTheme = function withTheme() {
  var defaultTheme = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Theme.LIGHT;
  return function (ComposedComponent) {
    var WithTheme = /*#__PURE__*/memo( /*#__PURE__*/forwardRef(function WithTheme(_ref2, ref) {
      var theme = _ref2.theme,
          restProps = _objectWithoutProperties(_ref2, ["theme"]);

      return /*#__PURE__*/React.createElement(ThemeContext.Consumer, null, function (contextTheme) {
        var usedTheme = theme || contextTheme || defaultTheme;
        return /*#__PURE__*/React.createElement(ThemeContext.Provider, {
          value: usedTheme
        }, /*#__PURE__*/React.createElement(ComposedComponent, _extends({
          ref: ref
        }, restProps, {
          theme: usedTheme
        })));
      });
    }));
    Object.assign(WithTheme, ComposedComponent);
    WithTheme.propTypes = ComposedComponent.propTypes;
    WithTheme.displayName = "withTheme(".concat(getDisplayName(ComposedComponent), ")");
    return WithTheme;
  };
};

export { Theme as T, ThemeContext as a, withTheme as w };
