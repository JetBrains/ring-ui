import React, {PureComponent} from 'react';

import Toggle from '../../../components/toggle/toggle';
import styles from './index.css';
import darkVariables from '@jetbrains/ring-ui/components/global/variables_dark';
import {setRootStyleProperties, resetRootStyleProperties} from '@jetbrains/ring-ui/components/global/dom';

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

export default class ThemeToggle extends PureComponent {
  state = {dark: false};

  onToggle = () => {
    const dark = !this.state.dark;
    this.setState({dark});
    toggleDarkTheme(dark);
    messageToIFrames(dark);
  };

  render() {
    return (
      <Toggle
        checked={this.state.dark}
        onChange={this.onToggle}
        className={styles.darkThemeToggle}
      >
        Dark mode
      </Toggle>
    );
  }
};
