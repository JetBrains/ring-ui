import {addons, type State} from 'storybook/manager-api';
import '../src/global/variables.css';
// eslint-disable-next-line camelcase
import {type API_DocsEntry} from 'storybook/internal/types';

import Theme, {applyTheme} from '../src/global/theme';
import {darkMatcher, theme} from './theme';
import {hideAddonsPanelParam} from '../src/util-stories';

if (darkMatcher.matches) {
  applyTheme(Theme.DARK, document.documentElement);
}

addons.setConfig({
  theme,
  layoutCustomisations: {
    showPanel(state: State, defaultValue: boolean) {
      // eslint-disable-next-line camelcase
      const parameters = (state.index?.[state.storyId] as API_DocsEntry)?.parameters;

      if (parameters?.[hideAddonsPanelParam]) {
        return false;
      }

      return defaultValue;
    },
  },
});
