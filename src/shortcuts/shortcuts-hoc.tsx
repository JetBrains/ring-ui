import {Component, type ComponentClass, type ComponentType} from 'react';

import getUID from '../global/get-uid';
import Shortcuts from './shortcuts';
import {type ShortcutsMap, type ShortcutsScopeOptions} from './core';

export interface ShortcutsHOCOptions extends ShortcutsScopeOptions {
  disabled?: boolean | null | undefined;
}

export interface ShortcutsHOCProps {
  rgShortcutsOptions: ShortcutsHOCOptions;
  rgShortcutsMap: ShortcutsMap;
}

export default function shortcutsHOC<P extends {}>(
  ComposedComponent: ComponentType<P> | string,
): ComponentClass<P & ShortcutsHOCProps> {
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
          <ComposedComponent {...(props as unknown as P)} />
        </Shortcuts>
      );
    }
  };
}
