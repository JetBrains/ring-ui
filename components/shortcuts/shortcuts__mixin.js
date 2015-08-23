require('babel/polyfill');
var shortcuts = require('shortcuts/shortcuts');

/**
 * @mixin {ShortcutsMixin}
 */
var ShortcutsMixin = {
  /**
   * Lazy inits component's shortcuts and synchronizes their state with scope chain
   * @private
   */
  toggleShortcuts: function(props) {
    if (props.shortcuts && !this.shortcutsScope) {
      var shortcutsProps = this.getShortcutsProps();

      if (!shortcutsProps || !shortcutsProps.map || !shortcutsProps.scope) {
        throw new Error('Shortcuts\' props weren\'t provided');
      }

      shortcuts.bindMap(shortcutsProps.map, shortcutsProps);
      shortcuts.pushScope(shortcutsProps.scope);
      this.shortcutsScope = shortcutsProps.scope;

      return;
    }

    var hasScope = this.shortcutsEnabled();

    if (props.shortcuts && !hasScope) {
      shortcuts.pushScope(this.shortcutsScope);
    } else if (!props.shortcuts && hasScope) {
      shortcuts.spliceScope(this.shortcutsScope);
    }
  },

  setShortcutsEnabled: function (flag) {
    this.toggleShortcuts(Object.assign({}, this.props, {shortcuts: !!flag}));
  },

  shortcutsEnabled: function() {
    return shortcuts.hasScope(this.shortcutsScope);
  },

  /** @override */
  componentWillMount: function () {
    this.toggleShortcuts(this.props);
  },

  /** @override */
  componentWillUpdate: function(props, state) {
    this.toggleShortcuts(Object.assign({}, props, state));
  },

  /** @override */
  componentWillUnmount: function () {
    if (this.shortcutsScope) {
      shortcuts.unbindScope(this.shortcutsScope);
      shortcuts.spliceScope(this.shortcutsScope);
    }
  }
};

module.exports = ShortcutsMixin;
