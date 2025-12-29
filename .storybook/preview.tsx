import {type Component} from 'storybook/internal/docs-tools';
import {type Parameters} from '@storybook/react-vite';

import strictModeDecorator from './strict-mode-decorator';
import themeDecorator from './theme-decorator';
import {theme} from './theme';
import {CustomDocs} from './custom-docs/custom-docs';

import './preview.css';

const params = new URLSearchParams(location.search.slice(1));
if (params.has('block-animations')) {
  document.body.classList.add('blockAnimations');
}

export const parameters = {
  docs: {
    inlineStories: false,
    extractComponentDescription: (component: Component, {notes}: Parameters) =>
      // eslint-disable-next-line no-underscore-dangle
      notes ?? component?.__docgenInfo?.description,
    theme,
    codePanel: true,
    page: CustomDocs,
  },
  a11y: {
    test: 'error',
    config: {
      rules: [
        {id: 'link-in-text-block', enabled: false}, // https://youtrack.jetbrains.com/issue/RG-2412/Contrast-Issue-Between-Link-and-Text-Color
      ],
    },
  },
  backgrounds: {disable: true},
};

export const decorators = [strictModeDecorator(), themeDecorator()];
