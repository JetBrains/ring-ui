import React, {
  HTMLAttributes,
  useMemo,
  useState,
  useEffect, forwardRef, Ref, useContext
} from 'react';
import classNames from 'classnames';

import {createPortal} from 'react-dom';

import {PopupTarget, PopupTargetContext} from '../popup/popup.target';

import {getPopupContainer} from '../popup/popup';

import defaultStyles from './variables.css';
import styles from './variables_dark.css';
import getUID from './get-uid';

enum Theme {
  AUTO= 'auto',
  LIGHT= 'light',
  DARK= 'dark'
}

const darkMatcher = window.matchMedia('(prefers-color-scheme: dark)');

export function useTheme() {
  const [dark, setDark] = useState(darkMatcher.matches);

  useEffect(() => {
    const onChange = (e: MediaQueryListEvent) => setDark(e.matches);
    darkMatcher.addEventListener('change', onChange);

    return () => darkMatcher.removeEventListener('change', onChange);
  }, []);

  return dark ? Theme.DARK : Theme.LIGHT;
}

export function applyTheme(theme: Theme.DARK | Theme.LIGHT, container: HTMLElement) {
  if (theme === Theme.DARK) {
    container.classList.remove(defaultStyles.light);
    container.classList.add(styles.dark);
  } else {
    container.classList.remove(styles.dark);
    container.classList.add(defaultStyles.light);
  }
}

export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  theme?: Theme
  passToPopups?: boolean
}

export const ThemeProvider = forwardRef(function ThemeProvider({
  theme = Theme.AUTO,
  className,
  passToPopups,
  children,
  ...restProps
}: ThemeProviderProps, ref: Ref<HTMLDivElement>) {
  const systemTheme = useTheme();
  const resolvedTheme = theme === Theme.AUTO ? systemTheme : theme;
  const id = useMemo(() => getUID('popups-with-theme-'), []);
  const themeClasses = classNames({
    [styles.dark]: resolvedTheme === Theme.DARK,
    [defaultStyles.light]: resolvedTheme === Theme.LIGHT
  });
  const parentTarget = useContext(PopupTargetContext);
  return (
    <div
      ref={ref}
      className={classNames(className, themeClasses)}
      {...restProps}
    >{
        passToPopups
          ? (
            <PopupTarget id={id}>
              {target => (
                <>
                  {children}
                  {createPortal(
                    target,
                    parentTarget && getPopupContainer(parentTarget) || document.body)
                  }
                </>
              )}
            </PopupTarget>
          )
          : children}
    </div>
  );
});

export default Theme;

