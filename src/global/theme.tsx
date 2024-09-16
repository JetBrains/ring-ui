import {
  HTMLAttributes,
  useMemo,
  useState,
  useEffect,
  forwardRef,
  Ref,
  useContext,
  ReactElement,
  createContext,
  FunctionComponent
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

export const ThemeContext = createContext<{theme: Theme.LIGHT | Theme.DARK}>({theme: Theme.LIGHT});

export const GLOBAL_DARK_CLASS_NAME = 'ring-ui-theme-dark';

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

export function useThemeClasses(theme: Theme) {
  const systemTheme = useTheme();
  const resolvedTheme = theme === Theme.AUTO ? systemTheme : theme;
  return classNames({
    [styles.dark]: resolvedTheme === Theme.DARK,
    [GLOBAL_DARK_CLASS_NAME]: resolvedTheme === Theme.DARK,
    [defaultStyles.light]: resolvedTheme === Theme.LIGHT
  });
}

export interface WithThemeClassesProps {
  theme: Theme
  children: (classes: string) => ReactElement
}
export function WithThemeClasses({theme, children}: WithThemeClassesProps) {
  const themeClasses = useThemeClasses(theme);
  return children(themeClasses);
}

export function applyTheme(theme: Theme.DARK | Theme.LIGHT, container: HTMLElement) {
  if (theme === Theme.DARK) {
    container.classList.remove(defaultStyles.light);
    container.classList.add(styles.dark);
    container.classList.add(GLOBAL_DARK_CLASS_NAME);
  } else {
    container.classList.remove(styles.dark);
    container.classList.remove(GLOBAL_DARK_CLASS_NAME);
    container.classList.add(defaultStyles.light);
  }
}

export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  theme?: Theme
  passToPopups?: boolean
  WrapperComponent?: FunctionComponent<
    HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
  >
  target?: HTMLElement
}

export const ThemeProvider = forwardRef(function ThemeProvider({
  theme = Theme.AUTO,
  className,
  passToPopups,
  children,
  WrapperComponent = props => <div {...props as HTMLAttributes<HTMLDivElement>}/>,
  target,
  ...restProps
}: ThemeProviderProps, ref: Ref<HTMLElement>) {
  const systemTheme = useTheme();
  const resolvedTheme = theme === Theme.AUTO ? systemTheme : theme;
  const id = useMemo(() => getUID('popups-with-theme-'), []);
  const themeValue = useMemo(() => ({theme: resolvedTheme}), [resolvedTheme]);
  useEffect(() => {
    if (target != null) {
      applyTheme(resolvedTheme, target);
    }
  }, [resolvedTheme, target]);
  const themeClasses = useThemeClasses(theme);
  const parentTarget = useContext(PopupTargetContext);

  return (
    <ThemeContext.Provider value={themeValue}>
      <WrapperComponent
        ref={ref}
        className={target != null ? undefined : classNames(className, themeClasses)}
        {...restProps}
      >{
          passToPopups
            ? (
              <PopupTarget id={id}>
                {popupTarget => (
                  <>
                    {children}
                    {createPortal(
                      <div className={themeClasses}>{popupTarget}</div>,
                      parentTarget && getPopupContainer(parentTarget) || document.body)
                    }
                  </>
                )}
              </PopupTarget>
            )
            : children}
      </WrapperComponent>
    </ThemeContext.Provider>
  );
});

export default Theme;

