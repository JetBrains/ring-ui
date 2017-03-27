import React from 'react';
import {PropTypes} from 'react';
import Shortcuts from './shortcuts';


export default function shortcutsHOC(ComposedComponent) {

  /* eslint-disable react/display-name */
  return class extends React.Component {
    static propTypes = {
      shortcuts: PropTypes.object
    }

    render() {
      const {shortcuts, ...props} = this.props;


      if (
        !shortcuts ||
        (
          shortcuts.options &&
          shortcuts.options.disabled
        )
      ) {
        return (
          <ComposedComponent {...props} />
        );
      }


      return (
        <Shortcuts
          map={shortcuts.map}
          scope={shortcuts.scope}
          options={shortcuts.options}
        >
          <ComposedComponent {...props} />
        </Shortcuts>
      );
    }
  };
}
