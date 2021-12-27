import React, {
  ComponentType,
  createContext,
  forwardRef,
  memo,
  RefAttributes,
  ExoticComponent,
  PropsWithoutRef,
  FunctionComponent,
  HTMLAttributes,
  useMemo, useState, useEffect
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

export function ThemeProvider({
  theme = Theme.AUTO,
  className,
  passToPopups,
  children,
  ...restProps
}: ThemeProviderProps) {
  const systemTheme = useTheme();
  const resolvedTheme = theme === Theme.AUTO ? systemTheme : theme;
  const id = useMemo(() => getUID('popups-with-theme-'), []);
  return (
    <div
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
}

export const ThemeContext = createContext<Theme | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDisplayName = (Component: ComponentType<any>) =>
  Component.name ?? Component.displayName ?? 'Component';

export interface ThemeOuterProps {
  theme?: Theme | null | undefined
}
export interface ThemeProps {
  theme: Theme
}

type ClassComponentType<T, P> = T extends React.Component<P> ? new (props: P) => T : never;
type ExoticComponentType<T, P> = ExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;
type AnyComponentType<T, P> =
  ClassComponentType<T, P> | FunctionComponent<P> | ExoticComponentType<T, P>

export const withTheme = (defaultTheme = Theme.LIGHT) =>
  <T, P extends ThemeProps, S>(ComposedComponent: AnyComponentType<T, P> & S) => {
    type Attributes = JSX.LibraryManagedAttributes<typeof ComposedComponent, P>
    type Props = Omit<Attributes, keyof ThemeProps> & ThemeOuterProps
    // eslint-disable-next-line react/display-name
    const WithTheme = memo(forwardRef<T, Props>(
      ({theme, ...restProps}, ref) => (
        <ThemeContext.Consumer>
          {contextTheme => {
            const usedTheme = theme || contextTheme || defaultTheme;
            const Component = ComposedComponent as ComponentType<Attributes>;
            return (
              <ThemeContext.Provider value={usedTheme}>
                <Component
                  ref={ref}
                  // https://github.com/Microsoft/TypeScript/issues/28938#issuecomment-450636046
                  {...restProps as Attributes}
                  theme={usedTheme}
                />
              </ThemeContext.Provider>
            );
          }}
        </ThemeContext.Consumer>
      )));
    const WithThemeAndStatics: typeof WithTheme & {[K in keyof S]: S[K]} =
      Object.assign(WithTheme, ComposedComponent, {
        displayName: `withTheme(${getDisplayName(ComposedComponent)})`,
        propTypes: null
      });
    return WithThemeAndStatics;
  };

export interface ApplyThemeParams {
  element?: Element | null | undefined
  prevTheme?: string | null | undefined
  currentTheme?: string | null | undefined
}
function applyTheme(params: ApplyThemeParams) {
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
