import {addons} from '@storybook/addons';
import {create} from '@storybook/theming';
import {paramCase} from 'change-case';

import '../src/global/variables.css';
import Theme, {applyTheme} from '../src/global/theme';

const darkMatcher = window.matchMedia('(prefers-color-scheme: dark)');

if (darkMatcher.matches) {
  applyTheme(Theme.DARK, document.documentElement);
}

// Proxy support is more or less the same as one of CSS custom properties
const variables: Record<string, string> = window.Proxy
  ? new Proxy(
    {},
    {
      get: (_, prop) => getComputedStyle(document.documentElement).getPropertyValue(`--ring-${paramCase(prop as string)}`).trim()
    },
  )
  : {};

const variablesSupported = variables.textColor != null;

const theme = variablesSupported
  ? {
    // Storybook-specific color palette
    colorSecondary: variables.mainColor,

    // UI
    appBg: variables.sidebarBackgroundColor,
    appBorderColor: variables.lineColor,
    appBorderRadius: parseInt(variables.borderRadius, 10),

    // Typography
    fontBase: variables.fontFamily,
    fontCode: variables.fontFamilyMonospace,

    // Text colors
    textColor: variables.textColor,

    // Toolbar default and active colors
    barTextColor: variables.secondaryColor,
    barSelectedColor: variables.mainColor,

    // Form colors
    inputBorder: variables.bordersColor,
    inputTextColor: variables.textColor
  }
  : {};

addons.setConfig({
  theme: create({
    base: darkMatcher.matches ? 'dark' : 'light',
    brandTitle: 'JetBrains Ring UI',
    ...theme
  })
});
