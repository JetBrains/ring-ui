import {withThemeByClassName} from '@storybook/addon-themes';
import {type StoryContext} from '@storybook/react-webpack5';
import {type PartialStoryFn} from 'storybook/internal/csf';

import Theme, {GLOBAL_DARK_CLASS_NAME, ThemeProvider} from '../src/global/theme';

export const themeDecoration = (Story: PartialStoryFn, context: StoryContext) => (
  <ThemeProvider theme={context.userGlobals.theme === 'dark' ? Theme.DARK : Theme.LIGHT}>
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

export default () => themeDecoration;
