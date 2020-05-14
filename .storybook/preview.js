import {addParameters, addDecorator} from '@storybook/html';
import {withA11y} from '@storybook/addon-a11y';

// eslint-disable-next-line import/no-unresolved
import 'file-loader?name=ring-ui-favicon.ico!@jetbrains/logos/ring-ui/favicon.ico';

import URLSearchParams from 'url-search-params';

import styles from './preview.css';
import stylesDecorator from './styles-decorator';

const params = new URLSearchParams(location.search.slice(1));
if (params.has('block-animations')) {
  document.body.classList.add(styles.blockAnimations);
}

addParameters({
  docs: {
    inlineStories: false
  },
  options: {
    showRoots: true
  },
  a11y: {
    options: {
      rules: {
        // TODO enable when RG-2054 is fixed
        'color-contrast': {enabled: false}
      }
    }
  },
  hermione: {
    skip: 'ie'
  }
});

addDecorator(withA11y);
addDecorator(stylesDecorator());
