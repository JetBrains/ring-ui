import {
  type HTMLAttributes,
  useState,
  useEffect,
  forwardRef,
  type Ref,
  type ReactElement,
  createContext,
  type FunctionComponent,
} from 'react';
import classNames from 'classnames';

import defaultStyles from './variables.css';
import styles from './variables_dark.css';

enum Theme {
  AUTO = 'auto',
  LIGHT = 'light',
  DARK = 'dark',
}

export const ThemeContext = createContext<{theme: Theme.LIGHT | Theme.DARK; passToPopups?: boolean}>({
  theme: Theme.LIGHT,
});

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
    [defaultStyles.light]: resolvedTheme === Theme.LIGHT,
  });
}

export interface WithThemeClassesProps {
  theme: Theme;
  children: (classes: string) => ReactElement;
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

type WrapperType = FunctionComponent<HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>>;

const DefaultWrapper = forwardRef(function Wrapper(
  props: HTMLAttributes<HTMLDivElement>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return <div {...props} ref={ref} />;
}) as WrapperType;

export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  theme?: Theme;
  passToPopups?: boolean;
  WrapperComponent?: WrapperType;
  target?: HTMLElement;
}

interface ThemeProviderInnerProps extends ThemeProviderProps {
  wrapperRef: Ref<HTMLElement>;
}

function ThemeProviderInner({
  theme = Theme.AUTO,
  className,
  passToPopups,
  children,
  WrapperComponent = DefaultWrapper,
  target,
  wrapperRef,
  ...restProps
}: ThemeProviderInnerProps) {
  const systemTheme = useTheme();
  const resolvedTheme = theme === Theme.AUTO ? systemTheme : theme;
  const themeValue = {theme: resolvedTheme, passToPopups};
  useEffect(() => {
    if (target) {
      applyTheme(resolvedTheme, target);
    }
  }, [resolvedTheme, target]);
  const themeClasses = useThemeClasses(theme);

  return (
    <ThemeContext.Provider value={themeValue}>
      <WrapperComponent
        ref={wrapperRef}
        className={target ? undefined : classNames(className, themeClasses)}
        {...restProps}
      >
        {children}
      </WrapperComponent>
    </ThemeContext.Provider>
  );
}

export const ThemeProvider = forwardRef(function ThemeProvider(props: ThemeProviderProps, ref: Ref<HTMLElement>) {
  return <ThemeProviderInner {...props} wrapperRef={ref} />;
});

export default Theme;
