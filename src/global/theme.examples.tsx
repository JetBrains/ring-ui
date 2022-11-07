import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Text from '../text/text';

import Theme, {ThemeProvider} from './theme';

export default {
  title: 'Components/Theme Provider',
  decorators: [reactDecorator()]
};

export const basic = () => {
  const ThemedWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
    <div className="themed-wrapper">{children}</div>
  );

  const ThemeExample: React.FC = () => (
    <div>
      <div className="ring-ui-theme-dark">
        <ThemedWrapper>
          <Text>This is dark (via global css class)</Text>
        </ThemedWrapper>
      </div>

      <div>
        <ThemedWrapper>
          <Text>This is light (via absence of css class)</Text>
        </ThemedWrapper>
      </div>

      <ThemeProvider theme={Theme.DARK}>
        <ThemedWrapper>
          <Text>This is dark</Text>
        </ThemedWrapper>
      </ThemeProvider>

      <ThemeProvider theme={Theme.LIGHT}>
        <ThemedWrapper>
          <Text>This is light</Text>
        </ThemedWrapper>
      </ThemeProvider>

      <ThemeProvider theme={Theme.LIGHT}>
        <ThemedWrapper>
          <Text>There will be Dark inside Light</Text>
          <ThemeProvider theme={Theme.DARK}>
            <ThemedWrapper>
              <Text>This is dark</Text>
            </ThemedWrapper>
          </ThemeProvider>
        </ThemedWrapper>
      </ThemeProvider>

      <ThemeProvider theme={Theme.DARK}>
        <ThemedWrapper>
          <Text>There will be Light inside Dark</Text>
          <ThemeProvider theme={Theme.LIGHT}>
            <ThemedWrapper>
              <Text>This is light</Text>
            </ThemedWrapper>
          </ThemeProvider>
        </ThemedWrapper>
      </ThemeProvider>
    </div>
  );

  return <ThemeExample/>;
};

basic.storyName = 'Theme Provider';
basic.parameters = {
  storyStyles: `
<style>
  .themed-wrapper {
    border: solid 1px var(--ring-borders-color);
    border-radius: var(--ring-border-radius);
    background-color: var(--ring-content-background-color);
    margin: var(--ring-unit);
    padding: var(--ring-unit);
  }
</style>`
};
