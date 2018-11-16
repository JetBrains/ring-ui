import React, {PureComponent} from 'react';

import Toggle from '../../../components/toggle/toggle';
import styles from './index.css';
import Theme from '@jetbrains/ring-ui/components/global/theme';
import {loadStoredTheme, setTheme} from './theme';


export default class ThemeToggle extends PureComponent {
  state = {dark: false};

  componentDidMount() {
    this.loadDarkModeState();
  }

  async loadDarkModeState() {
    const dark = await loadStoredTheme();
    this.setState({dark});
  }

  onToggle = () => {
    const dark = !this.state.dark;
    setTheme(dark);
    this.setState({dark});
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
