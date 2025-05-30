import {paramCase} from 'change-case';
import {create} from 'storybook/theming';

export const darkMatcher = window.matchMedia('(prefers-color-scheme: dark)');
// Proxy support is more or less the same as one of CSS custom properties
const variables: Record<string, string> = window.Proxy
  ? new Proxy(
      {},
      {
        get: (_, prop) =>
          getComputedStyle(document.documentElement)
            .getPropertyValue(`--ring-${paramCase(prop as string)}`)
            .trim(),
      },
    )
  : {};

const variablesSupported = variables.textColor != null;
export const theme = create({
  base: darkMatcher.matches ? 'dark' : 'light',
  brandTitle: 'JetBrains Ring UI',
  ...(variablesSupported
    ? {
        // Storybook-specific color palette
        colorSecondary: variables.mainColor,

        // UI
        appBorderColor: variables.lineColor,
        appBorderRadius: parseInt(variables.borderRadius, 10),

        // Typography
        fontBase: variables.fontFamily,
        fontCode: variables.fontFamilyMonospace,

        // Toolbar default and active colors
        barTextColor: variables.secondaryColor,
        barSelectedColor: variables.mainColor,

        // Form colors
        inputBorder: variables.bordersColor,
        inputTextColor: variables.textColor,
      }
    : {}),
});
