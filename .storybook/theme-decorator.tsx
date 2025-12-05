import {withThemeByClassName} from '@storybook/addon-themes';
import {type StoryContext} from '@storybook/react-webpack5';
import {type PartialStoryFn} from 'storybook/internal/csf';
import React from 'react';

import Theme, {GLOBAL_DARK_CLASS_NAME, ThemeProvider} from '../src/global/theme';

// To react on theme change in visual tests, see `packages/screenshots/testplane/actions.js`
const FORCE_THEME_DARK_SET_EVENT = 'FORCE_THEME_DARK_SET_EVENT';

declare global {
  interface WindowEventMap {
    [FORCE_THEME_DARK_SET_EVENT]: CustomEvent;
  }
}

function ThemeDecorator(Story: PartialStoryFn, context: StoryContext) {
  const [forceDark, setForceDark] = React.useState<boolean>(false);

  const onForceDark = React.useCallback(() => setForceDark(true), [setForceDark]);

  React.useEffect(() => {
    window.addEventListener(FORCE_THEME_DARK_SET_EVENT, onForceDark);
    return () => window.removeEventListener(FORCE_THEME_DARK_SET_EVENT, onForceDark);
  }, [onForceDark]);

  return (
    <ThemeProvider theme={forceDark || context.userGlobals.theme === 'dark' ? Theme.DARK : Theme.LIGHT}>
      {withThemeByClassName({
        themes: {
          light: '',
          dark: GLOBAL_DARK_CLASS_NAME,
        },
        defaultTheme: 'light',
        parentSelector: 'body',
      })(Story, context)}
    </ThemeProvider>
  );
}

export default () => ThemeDecorator;
