import React, {PureComponent} from 'react';

import Toggle from '../../../components/toggle/toggle';
import styles from './index.css';
import darkVariables from '@jetbrains/ring-ui/components/global/variables_dark';
import {setRootStyleProperties, resetRootStyleProperties} from '@jetbrains/ring-ui/components/global/dom';

export function toggleDarkTheme(isOn) {
  isOn ? setRootStyleProperties(darkVariables) : resetRootStyleProperties(darkVariables);
}

export default class ThemeToggle extends PureComponent {
  state = {dark: false};

  onToggle = () => {
    this.setState({dark: !this.state.dark});
    toggleDarkTheme(!this.state.dark);
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
