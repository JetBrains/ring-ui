import React, {createContext, forwardRef, memo} from 'react';
import {wrapDisplayName} from 'recompose';

const Theme = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const ThemeContext = createContext();

export const withTheme = (defaultTheme = Theme.LIGHT) => ComposedComponent => {
  // eslint-disable-next-line react/prop-types
  const WithTheme = memo(forwardRef(function WithTheme({theme, ...restProps}, ref) {
    return (
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
    );
  }));
  Object.assign(WithTheme, ComposedComponent);
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
