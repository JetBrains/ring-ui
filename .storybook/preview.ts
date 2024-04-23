// eslint-disable-next-line import/no-unresolved
import 'file-loader?name=ring-ui-favicon.ico!@jetbrains/logos/ring-ui/favicon.ico';

import URLSearchParams from '@ungap/url-search-params';

import {Component} from '@storybook/addon-docs';
import {Parameters} from '@storybook/react';

import Theme, {applyTheme} from '../src/global/theme';

import styles from './preview.css';
import strictModeDecorator from './strict-mode-decorator';
import stylesDecorator from './styles-decorator';
import {darkMatcher, theme} from './theme';

const updateTheme = () => applyTheme(
  darkMatcher.matches ? Theme.DARK : Theme.LIGHT,
  document.documentElement
);
updateTheme();
darkMatcher.addEventListener('change', updateTheme);

const params = new URLSearchParams(location.search.slice(1));
if (params.has('block-animations')) {
  document.body.classList.add(styles.blockAnimations);
}

export const parameters = {
  docs: {
    inlineStories: false,
    extractComponentDescription: (component: Component, {notes}: Parameters) =>
      notes ?? component?.__docgenInfo?.description,
    theme
  },
  a11y: {
    options: {
      rules: {
        // TODO enable when RG-2054 is fixed
        'color-contrast': {enabled: false},
        'link-in-text-block': {enabled: false} // https://youtrack.jetbrains.com/issue/RG-2412/Contrast-Issue-Between-Link-and-Text-Color
      }
    }
  },
  actions: {argTypesRegex: '^on.*'},
  backgrounds: {disable: true},
  themes: {
    default: 'Light',
    list: [
      {name: 'Light', color: '#FFF'},
      {name: 'Dark', class: 'ring-ui-theme-dark', color: '#23272b'}
    ]
  }
};

export const decorators = [stylesDecorator(), strictModeDecorator()];
