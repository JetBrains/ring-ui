import React from 'react';
import PropTypes from 'prop-types';

import getUID from '../global/get-uid';

import Shortcuts from './shortcuts';

export default function shortcutsHOC(ComposedComponent) {

  /* eslint-disable react/display-name */
  return class extends React.Component {
    static propTypes = {
      rgShortcutsOptions: PropTypes.object,
      rgShortcutsMap: PropTypes.object
    }

    _shortcutsScopeUid = getUID('rg-shortcuts-')

    render() {
      const {rgShortcutsOptions, rgShortcutsMap, ...props} = this.props;


      if (
        rgShortcutsOptions &&
        rgShortcutsOptions.disabled
      ) {
        return (
          <ComposedComponent {...props}/>
        );
      }

      return (
        <Shortcuts
          scope={this._shortcutsScopeUid}
          map={rgShortcutsMap}
          options={rgShortcutsOptions}
        >
          <ComposedComponent {...props}/>
        </Shortcuts>
      );
    }
  };
}
