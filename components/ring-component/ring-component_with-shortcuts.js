import RingComponent from '../ring-component/ring-component';
import shortcuts from '../shortcuts/core';

export default class RingComponentWithShortcuts extends RingComponent {
  static letOverrideLifecycleMethods = true;

  toggleShortcuts(props) {
    if (!this.getShortcutsProps) {
      return;
    }

    function enableShortcuts(params) {
      shortcuts.pushScope(params.shortcutsScope, params.shortcutsOptions);
    }

    function disableShortcuts(params) {
      shortcuts.spliceScope(params.shortcutsScope);
    }

    function initializeShortcuts(component) {
      const shortcutsProps = component.getShortcutsProps();

      if (!shortcutsProps || !shortcutsProps.map || !shortcutsProps.scope) {
        throw new Error('Shortcuts\' props weren\'t provided');
      }

      shortcuts.bindMap(shortcutsProps.map, shortcutsProps);
      component.shortcutsScope = shortcutsProps.scope;
      component.shortcutsOptions = shortcutsProps.options;
    }

    const isEnableShortcuts = props.shortcuts;
    const isShortcutsAlreadyEnabled = this.shortcutsEnabled();

    if (isEnableShortcuts && !this.shortcutsScope) {
      initializeShortcuts(this);
    }

    if (isEnableShortcuts && !isShortcutsAlreadyEnabled) {
      enableShortcuts(this);
    } else if (!isEnableShortcuts && isShortcutsAlreadyEnabled) {
      disableShortcuts(this);
    }
  }

  setShortcutsEnabled(flag) {
    this.toggleShortcuts(Object.assign({}, this.props, {shortcuts: !!flag}));
  }

  shortcutsEnabled() {
    return shortcuts.hasScope(this.shortcutsScope);
  }

  // React Lifecycle Methods

  componentWillMount() {
    super.componentWillMount();
    this.toggleShortcuts(this.props);
  }

  componentWillUpdate(nextProps, nextState) {
    super.componentWillUpdate(nextProps, nextState);
    this.toggleShortcuts(Object.assign({}, nextProps, nextState));
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    if (this.shortcutsScope) {
      shortcuts.unbindScope(this.shortcutsScope);
      shortcuts.spliceScope(this.shortcutsScope);
    }
  }
}
