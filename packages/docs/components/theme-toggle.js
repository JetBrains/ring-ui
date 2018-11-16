import React, {PureComponent} from 'react';

import Toggle from '../../../components/toggle/toggle';
import styles from './index.css';
import darkVariables from '@jetbrains/ring-ui/components/global/variables_dark';
import Storage from '@jetbrains/ring-ui/components/storage/storage';
import {setRootStyleProperties, resetRootStyleProperties} from '@jetbrains/ring-ui/components/global/dom';
import Theme from '@jetbrains/ring-ui/components/global/theme';

function toggleDarkTheme(isOn) {
  isOn ? setRootStyleProperties(darkVariables) : resetRootStyleProperties(darkVariables);
}

function messageToIFrames(isOn) {
  const message = JSON.stringify({
    type: 'RING_DARK_THEME',
    value: isOn
  });

  [...document.querySelectorAll('iframe')].
    forEach(iFrame => iFrame.contentWindow.postMessage(message, '*'))
}

const STORAGE_KEY = 'ring-ui-dark-mode';

export default class ThemeToggle extends PureComponent {
  storage = new Storage();
  state = {dark: false};

  componentDidMount() {
    this.loadDarkModeState();
  }

  async loadDarkModeState() {
    const dark = await this.storage.get(STORAGE_KEY);
    this.setState({dark});
    toggleDarkTheme(dark);
    messageToIFrames(dark);
  }

  onToggle = () => {
    const dark = !this.state.dark;
    this.setState({dark});
    toggleDarkTheme(dark);
    messageToIFrames(dark);
    this.storage.set(STORAGE_KEY, dark);
  };

  render() {
    return (
      <Toggle
        theme={Theme.DARK}
        checked={this.state.dark}
        onChange={this.onToggle}
        className={styles.darkThemeToggle}
        leftLabel="Dark mode"
      />
    );
  }
};
