import {configure, addParameters, addDecorator} from '@storybook/html';
import {create} from '@storybook/theming';

// eslint-disable-next-line import/no-unresolved
import jetbrainsLogoURL from '!file-loader!@jetbrains/logos/jetbrains/favicon.ico';

import {paramCase} from 'change-case';
import URLSearchParams from 'url-search-params';

import styles from './preview.css';
import stylesDecorator from './styles-decorator';

const params = new URLSearchParams(location.search.slice(1));
if (params.has('block-animations')) {
  document.body.classList.add(styles.blockAnimations);
}

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

addParameters({
  options: {
    theme: create({
      base: 'light',
      brandTitle: 'Ring UI',
      brandUrl: '#',
      brandImage: jetbrainsLogoURL,
      ...theme
    })
  }
});

addDecorator(stylesDecorator());

const req = require.context('../components', true, /\.examples\.js$/);

function loadStories() {
  // Make welcome stories default
  require('../components/welcome.examples');
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
