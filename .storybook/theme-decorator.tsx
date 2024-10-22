import {withThemeByClassName} from '@storybook/addon-themes';

import {GLOBAL_DARK_CLASS_NAME} from '../src/global/theme';

const themeDecoration = withThemeByClassName({
  themes: {
    light: '',
    dark: GLOBAL_DARK_CLASS_NAME,
  },
  defaultTheme: 'light',
  parentSelector: 'body',
});

export default () => themeDecoration;
