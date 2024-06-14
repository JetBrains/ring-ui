import * as React from 'react';


import Text from '../text/text';

import Select from '../select/select';

import Theme, {ThemeProvider} from './theme';

export default {
  title: 'Components/Theme Provider'
};

const storyStyles = `
<style>
  .themed-wrapper {
    border: solid 1px var(--ring-borders-color);
    border-radius: var(--ring-border-radius);
    background-color: var(--ring-content-background-color);
    margin: var(--ring-unit);
    padding: var(--ring-unit);
  }
</style>`;

const ThemedWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div className="themed-wrapper">{children}</div>
);

export const basic = () => {
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
basic.parameters = {storyStyles};

const selectTestData = [{
  key: 'label-1', label: 'Hello'
}, {
  key: 'label-2', label: 'World'
}];

export const withPopup = () => {
  const ThemeExample: React.FC = () => (
    <div>
      <ThemeProvider theme={Theme.DARK} passToPopups>
        <ThemedWrapper>
          <Select data={selectTestData} label="Dark popup"/>
        </ThemedWrapper>
      </ThemeProvider>

      <ThemeProvider theme={Theme.DARK}>
        <ThemedWrapper>
          <Text>There will be Light inside Dark</Text>
          <ThemeProvider theme={Theme.LIGHT}>
            <ThemedWrapper>
              <Select data={selectTestData} label="Light popup"/>
            </ThemedWrapper>
          </ThemeProvider>
        </ThemedWrapper>
      </ThemeProvider>
    </div>
  );

  return <ThemeExample/>;
};

withPopup.storyName = 'Theme Provider and Popup';
withPopup.parameters = {
  screenshots: {skip: true},
  storyStyles
};
