import React, {ComponentType} from 'react';
import PropTypes from 'prop-types';

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

export default function shortcutsHOC<P>(ComposedComponent: ComponentType<P> | string) {

  return class WithShortcuts extends React.Component<P & ShortcutsHOCProps> {
    static propTypes = {
      rgShortcutsOptions: PropTypes.object,
      rgShortcutsMap: PropTypes.object
    };

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
          <ComposedComponent {...props as P}/>
        </Shortcuts>
      );
    }
  };
}
