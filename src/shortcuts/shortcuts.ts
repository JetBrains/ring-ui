import {PureComponent} from 'react';

import shortcuts, {ShortcutsMap, ShortcutsScopeOptions} from './core';

export interface ShortcutsProps {
  map: ShortcutsMap;
  scope: string;
  options: ShortcutsScopeOptions;
  children?: React.ReactNode;
  disabled?: boolean | null | undefined;
}

export default class Shortcuts extends PureComponent<ShortcutsProps> {
  static defaultProps = {
    options: {},
  };

  componentDidMount() {
    if (!this.props.disabled) {
      this.turnShorcutsOn();
    }
  }

  componentDidUpdate(prevProps: ShortcutsProps) {
    const {disabled, map} = this.props;
    if (!prevProps.disabled && disabled) {
      this.turnShorcutsOff();
    }
    if (prevProps.disabled && !disabled) {
      this.turnShorcutsOn();
    }
    if (prevProps.map !== map) {
      shortcuts.bindMap(map, this.props);
    }
  }

  componentWillUnmount() {
    if (!this.props.disabled) {
      this.turnShorcutsOff();
    }
  }

  turnShorcutsOn() {
    const {map, scope, options} = this.props;
    shortcuts.bindMap(map, this.props);
    shortcuts.pushScope(scope, options);
  }

  turnShorcutsOff() {
    const {scope} = this.props;
    shortcuts.unbindScope(scope);
    shortcuts.spliceScope(scope);
  }

  render() {
    return this.props.children || null;
  }
}
