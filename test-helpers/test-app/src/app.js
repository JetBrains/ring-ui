/* eslint-disable react/jsx-no-literals */
import React from '@jetbrains/ring-ui-built/node_modules/react';

import '@jetbrains/ring-ui-built/dist/style.css';
import DatePicker from '@jetbrains/ring-ui-built/dist/date-picker/date-picker';
import Toggle from '@jetbrains/ring-ui-built/dist/toggle/toggle';
import Heading from '@jetbrains/ring-ui-built/dist/heading/heading';
import {SmartTabs, Tab} from '@jetbrains/ring-ui-built/dist/tabs/tabs';
import Theme, {ThemeProvider} from '@jetbrains/ring-ui-built/dist/global/theme';

import './styles.css';

const darkMatcher = window.matchMedia('(prefers-color-scheme: dark)');

export default function App() {
  const [dark, setDark] = React.useState(darkMatcher.matches);

  React.useEffect(() => {
    const onChange = e => setDark(e.matches);
    darkMatcher.addEventListener('change', onChange);

    return () => darkMatcher.removeEventListener('change', onChange);
  }, []);

  return (
    <ThemeProvider className="App" theme={dark ? Theme.DARK : Theme.LIGHT}>
      <Heading className="component">Start editing to see some magic happen!</Heading>

      <DatePicker withTime/>

      <Toggle defaultChecked={dark} className="component" onChange={e => setDark(e.target.checked)}>
        Dark theme
      </Toggle>

      <SmartTabs>
        <Tab title="First tab">First tab content</Tab>
        <Tab title="Second tab">Second tab content</Tab>
        <Tab title="Third tab">Third tab content</Tab>
        <Tab title="Fourth  tab (Link)" href="/">
          Fourth tab content
        </Tab>
        <Tab disabled title="Disabled tab">
          Disabled tab content
        </Tab>
      </SmartTabs>
    </ThemeProvider>
  );
}
