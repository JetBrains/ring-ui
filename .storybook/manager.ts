import {addons} from '@storybook/addons';

import '../src/global/variables.css';
import Theme, {applyTheme} from '../src/global/theme';

import {darkMatcher, theme} from './theme';

if (darkMatcher.matches) {
  applyTheme(Theme.DARK, document.documentElement);
}

addons.setConfig({theme});
