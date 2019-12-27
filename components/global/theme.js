import React, {createContext, forwardRef} from 'react';
import {wrapDisplayName} from 'recompose';
import PropTypes from 'prop-types';

const Theme = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const ThemeContext = createContext();

export const withTheme = (defaultTheme = Theme.LIGHT) => ComposedComponent => {
  const WithTheme = forwardRef(({theme, ...restProps}, ref) => (
    <ThemeContext.Consumer>
      {contextTheme => {
        const usedTheme = theme || contextTheme || defaultTheme;
        return (
          <ThemeContext.Provider value={usedTheme}>
            <ComposedComponent
              ref={ref}
              {...restProps}
              theme={usedTheme}
            />
          </ThemeContext.Provider>
        );
      }}
    </ThemeContext.Consumer>
  ));
  Object.assign(WithTheme, ComposedComponent);
  WithTheme.propTypes = {
    theme: PropTypes.oneOf(Object.values(Theme)),
    ...ComposedComponent.propTypes
  };
  WithTheme.displayName = wrapDisplayName(ComposedComponent, 'withTheme');
  return WithTheme;
};

function applyTheme(params) {
  if (!params || !params.element || !params.currentTheme) {
    return;
  }

  if (params.prevTheme) {
    params.element.classList.remove(params.prevTheme);
  }

  params.element.classList.add(params.currentTheme);
}


export {applyTheme};
export default Theme;
