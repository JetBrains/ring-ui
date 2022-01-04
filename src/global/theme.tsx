import React, {
  HTMLAttributes,
  useMemo,
  useState,
  useEffect, forwardRef, Ref
} from 'react';
import classNames from 'classnames';

import {PopupTarget} from '../popup/popup.target';

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
  return (
    <div
      ref={ref}
      className={classNames(className, {[styles.dark]: resolvedTheme === Theme.DARK})}
      {...restProps}
    >{
        passToPopups
          ? (
            <PopupTarget id={id}>
              {target => <>{children}{target}</>}
            </PopupTarget>
          )
          : children}
    </div>
  );
});

export default Theme;

