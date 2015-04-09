var $ = require('jquery');
var mousetrap = require('mousetrap');

var Global = require('global/global');

/**
 * @constructor
 **/
var Shortcuts = function () {
  this._scopes = {};
  this._dispatcher = Shortcuts._dispatcher.bind(this);

  this.setFilter();
  this.setScope();
};

/**
 * @const {string}
 */
Shortcuts.ROOT_SCOPE = 'ROOT';

/**
 * @const {string}
 */
Shortcuts.ALLOW_SHORTCUTS_SELECTOR = '.ring-js-shortcuts';

Shortcuts.trigger = mousetrap.trigger;
Global.addSingletonGetter(Shortcuts);

Shortcuts._dispatcher = function (e, key) {
  var currentScope;

  for (var i = this._scopeChain.length - 1; i >= 0; i--) {
    currentScope = this._scopes[this._scopeChain[i]];

    if (currentScope && currentScope[key]) {
      var ret = currentScope[key](e, key, this._scopeChain[i]);

      // Fall down in chain when returning true
      if (ret !== true) {
        return ret;
      }
    }
  }
};

/**
 * @mixin {Shortcuts.Mixin}
 */
Shortcuts.Mixin = {
  /**
   * Lazy inits component's shortcuts and synchronizes their state with scope chain
   * @private
   */
  toggleShortcuts: function(props) {
    var shortcuts = Shortcuts.getInstance();

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

  shortcutsEnabled: function() {
    var shortcuts = Shortcuts.getInstance();
    return shortcuts.hasScope(this.shortcutsScope);
  },

  /** @override */
  componentWillMount: function () {
    this.toggleShortcuts(this.props);
  },

  /** @override */
  componentWillUpdate: function(props, state) {
    this.toggleShortcuts($.extend({}, props, state));
  },

  /** @override */
  componentWillUnmount: function () {
    if (this.shortcutsScope) {
      var shortcuts = Shortcuts.getInstance();

      shortcuts.unbindScope(this.shortcutsScope);
      shortcuts.spliceScope(this.shortcutsScope);
    }
  }
};

/**
 * Binds handler to shortcut
 *
 * @param params.key {string | Array.<string>) Keys to bind
 * @param params.handler {Function} Events handle
 * @param params.scope {string} Scope (optional)
 * @param params.type {string} Event type, will be passed to Mousetrap (optional)
 */
Shortcuts.prototype.bind = function (params) {
  if (!(params instanceof Object) || typeof params.handler !== 'function') {
    throw new Error('Shortcut handler should exist');
  }

  if (!params.scope) {
    params.scope = Shortcuts.ROOT_SCOPE;
  }

  if ($.isArray(params.key)) {
    for (var i = 0; i < params.key.length; i++) {
      this.bind($.extend({}, params, {key: params.key[i]}));
    }

    return;
  }

  if (typeof params.key !== 'string') {
    throw new Error('Shortcut key should exist');
  }

  if (!this._scopes[params.scope]) {
    this._scopes[params.scope] = {};
  }
  this._scopes[params.scope][params.key] = params.handler;

  mousetrap.bind(params.key, this._dispatcher, params.type);
};

/**
 * Binds map of shorcuts to handlers with common options
 *
 * @map {Object) Keys to handlers map
 * @options.scope {string} Scope (optional)
 * @options.type {string} Event type, will be passed to Mousetrap (optional)
 */
Shortcuts.prototype.bindMap = function (map, options) {
  if (!(map instanceof Object)) {
    throw new Error('Shortcuts map shouldn\'t be empty');
  }

  for (var key in map) {
    if (map.hasOwnProperty(key)) {
      this.bind($.extend({}, options || {}, {key: key, handler: map[key]}));
    }
  }
};

Shortcuts.prototype.unbindScope = function (scope) {
  this._scopes[scope] = null;
};

Shortcuts.prototype.getScope = function () {
  return this._scopeChain.slice(1);
};

Shortcuts.prototype.hasScope = function (scope) {
  return $.inArray(scope, this._scopeChain) !== -1;
};

Shortcuts.prototype.pushScope = function (scope) {
  if (scope) {
    var position = $.inArray(scope, this._scopeChain);

    if (position !== -1) {
      this._scopeChain.splice(position, 1);
    }

    this._scopeChain.push(scope);
  }
};

Shortcuts.prototype.popScope = function (scope) {
  if (scope) {
    var position = $.inArray(scope, this._scopeChain);

    if (position !== -1) {
      return this._scopeChain.splice(position, this._scopeChain.length - 1);
    }
  }
};

Shortcuts.prototype.spliceScope = function (scope) {
  if (scope) {
    var position = $.inArray(scope, this._scopeChain);

    if (position !== -1) {
      this._scopeChain.splice(position, 1);
    }
  }
};

Shortcuts.prototype.setScope = function (scope) {
  if (scope) {
    if (typeof scope === 'string') {
      scope = [scope];
    }

    if (!$.isArray(scope)) {
      return;
    }

    this._scopeChain = [Shortcuts.ROOT_SCOPE].concat(scope);
  } else {
    this._scopeChain = [Shortcuts.ROOT_SCOPE];
  }
};

Shortcuts.prototype.hasKey = function (key, scope) {
  return !!(this._scopes[scope] && this._scopes[scope][key]);
};

Shortcuts.prototype._defaultFilter = function (e, element/*, key*/) {
  var $element = $(element);

  // if the element or its parents have the class "ring-js-shortcuts" then no need to stop
  if ($element.is(Shortcuts.ALLOW_SHORTCUTS_SELECTOR) || $element.closest(Shortcuts.ALLOW_SHORTCUTS_SELECTOR).length) {
    return false;
  }

  // stop for input, select, and textarea
  return $element.is(':input:not(:button)') || (element.contentEditable && element.contentEditable === 'true');
};

Shortcuts.prototype.setFilter = function (fn) {
  mousetrap.stopCallback = typeof fn === 'function' ? fn : this._defaultFilter;
};


Shortcuts.prototype.reset = function () {
  this._scopes = {};
  mousetrap.reset();
};

module.exports = Shortcuts;
