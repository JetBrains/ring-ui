import {addons} from '@storybook/addons';
import {create} from '@storybook/theming/create';
import {paramCase} from 'change-case';
import '../components/global/variables.css';

// Proxy support is more or less the same as one of CSS custom properties
const variables = window.Proxy
  ? new Proxy(
    {},
    {
      get: (_, prop) => getComputedStyle(document.documentElement).getPropertyValue(`--ring-${paramCase(prop)}`).trim()
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
    appBorderRadius: variables.borderRadius,

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
    inputTextColor: variables.textColor,
    inputBorderRadius: 0
  }
  : {};

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'JetBrains Ring UI',
    ...theme
  })
});
