import {Component, ComponentType} from 'react';

import getUID from '../global/get-uid';

import Shortcuts from './shortcuts';
import {ShortcutsMap, ShortcutsScopeOptions} from './core';

export interface ShortcutsHOCOptions extends ShortcutsScopeOptions {
  disabled?: boolean | null | undefined
}

export interface ShortcutsHOCProps {
  rgShortcutsOptions: ShortcutsHOCOptions
  rgShortcutsMap: ShortcutsMap
}

export default function shortcutsHOC<P extends {}>(ComposedComponent: ComponentType<P> | string) {

  return class WithShortcuts extends Component<P & ShortcutsHOCProps> {
    _shortcutsScopeUid = getUID('rg-shortcuts-');

    render() {
      const {rgShortcutsOptions, rgShortcutsMap, ...props} = this.props;

      return (
        <Shortcuts
          scope={this._shortcutsScopeUid}
          map={rgShortcutsMap}
          options={rgShortcutsOptions}
          disabled={rgShortcutsOptions.disabled}
        >
          <ComposedComponent {...props as unknown as P}/>
        </Shortcuts>
      );
    }
  };
}
