import 'file-loader?name=ring-ui-favicon.ico!@jetbrains/logos/ring-ui/favicon.ico';

import {type Component} from 'storybook/internal/docs-tools';
import {type Parameters} from '@storybook/react-webpack5';

import Theme, {applyTheme, GLOBAL_DARK_CLASS_NAME} from '../src/global/theme';
import queryAssistStyles from '../src/query-assist/query-assist.css';
import selectStyles from '../src/select/select.css';
import styles from './preview.css';
import strictModeDecorator from './strict-mode-decorator';
import stylesDecorator from './styles-decorator';
import themeDecorator from './theme-decorator';
import {darkMatcher, theme} from './theme';

const updateTheme = () => applyTheme(darkMatcher.matches ? Theme.DARK : Theme.LIGHT, document.documentElement);
updateTheme();
darkMatcher.addEventListener('change', updateTheme);

const params = new URLSearchParams(location.search.slice(1));
if (params.has('block-animations')) {
  document.body.classList.add(styles.blockAnimations);
}

const selectorsWithColorContrastIssues = [
  `.${queryAssistStyles.placeholder.split(' ')[0]}`,
  `.${selectStyles.buttonValueEmpty}`,
].filter(Boolean);

export const parameters = {
  docs: {
    inlineStories: false,
    extractComponentDescription: (component: Component, {notes}: Parameters) =>
      // eslint-disable-next-line no-underscore-dangle
      notes ?? component?.__docgenInfo?.description,
    theme,
    codePanel: true,
  },
  a11y: {
    test: 'error',
    config: {
      rules: [
        {
          id: 'color-contrast',
          // TODO enable everywhere when RG-2054 is fixed
          selector: `*:not(${selectorsWithColorContrastIssues.join(', ')})`,
        },
        {id: 'link-in-text-block', enabled: false}, // https://youtrack.jetbrains.com/issue/RG-2412/Contrast-Issue-Between-Link-and-Text-Color
      ],
    },
  },
  backgrounds: {disable: true},
  themes: {
    default: 'Light',
    list: [
      {name: 'Light', color: '#FFF'},
      {name: 'Dark', class: GLOBAL_DARK_CLASS_NAME, color: '#23272b'},
    ],
  },
};

export const decorators = [stylesDecorator(), strictModeDecorator(), themeDecorator()];
export const tags = ['autodocs'];
