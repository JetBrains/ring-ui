import React, {
  ComponentType,
  createContext,
  forwardRef,
  memo,
  RefAttributes,
  ExoticComponent,
  PropsWithoutRef,
  FunctionComponent
} from 'react';

enum Theme {
  LIGHT= 'light',
  DARK= 'dark'
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
