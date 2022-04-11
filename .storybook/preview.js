// eslint-disable-next-line import/no-unresolved
import 'file-loader?name=ring-ui-favicon.ico!@jetbrains/logos/ring-ui/favicon.ico';

import URLSearchParams from '@ungap/url-search-params';
import * as client from 'react-dom/client';

import {setClient} from '../components/global/react-render-adapter';

import styles from './preview.css';
import stylesDecorator from './styles-decorator';

setClient(client);

const params = new URLSearchParams(location.search.slice(1));
if (params.has('block-animations')) {
  document.body.classList.add(styles.blockAnimations);
}

export const parameters = {
  docs: {
    inlineStories: false,
    extractComponentDescription: (component, {notes}) =>
      notes ?? component?.__docgenInfo?.description
  },
  a11y: {
    options: {
      rules: {
        // TODO enable when RG-2054 is fixed
        'color-contrast': {enabled: false}
      }
    }
  },
  actions: {argTypesRegex: '^on.*'}
};

export const decorators = [stylesDecorator()];
