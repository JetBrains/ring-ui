import 'babel/polyfill';
import RingComponent from 'ring-component/ring-component';
import shortcuts from 'shortcuts/shortcuts';

export default class RingComponentWithShortcuts extends RingComponent {
  static letOverrideLifecycleMethods = true;

  toggleShortcuts(props) {
    if (this.getShortcutsProps) {
      if (props.shortcuts && !this.shortcutsScope) {
        let shortcutsProps = this.getShortcutsProps();

        if (!shortcutsProps || !shortcutsProps.map || !shortcutsProps.scope) {
          throw new Error(`Shortcuts' props weren't provided`);
        }

        shortcuts.bindMap(shortcutsProps.map, shortcutsProps);
        shortcuts.pushScope(shortcutsProps.scope);
        this.shortcutsScope = shortcutsProps.scope;

        return;
      }

      let hasScope = this.shortcutsEnabled();

      if (props.shortcuts && !hasScope) {
        shortcuts.pushScope(this.shortcutsScope);
      } else if (!props.shortcuts && hasScope) {
        shortcuts.spliceScope(this.shortcutsScope);
      }
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
