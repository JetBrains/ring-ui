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

/**
 * @mixin {Shortcuts.Mixin}
 */
Shortcuts.Mixin = {
  /** @override */
  componentDidMount: function () {
    if (this.props.shortcuts) {
      var shortcuts = Shortcuts.getInstance();
      var props = this.getShortcutsProps();

      if (!props || !props.map || !props.scope) {
        throw new Error('Shortcuts\' props weren\'t provided');
      }

      shortcuts.bindMap(props.map, props);
      shortcuts.pushScope(props.scope);
      this.shortcutsScope = props.scope;
    }
  },

  componentDidUpdate: function () {
    if (this.props.shortcuts) {
      var shortcuts = Shortcuts.getInstance();

      shortcuts.pushScope(this.shortcutsScope);
    }
  },

  /** @override */
  componentWillUnmount: function () {
    if (this.props.shortcuts) {
      var shortcuts = Shortcuts.getInstance();

      shortcuts.unbindScope(this.shortcutsScope);
      shortcuts.spliceScope(this.shortcutsScope);
    }
  }
};

Global.addSingletonGetter(Shortcuts);

var ShortcutsProto = Shortcuts.prototype;

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
 * Binds handler to shortcut
 *
 * @param params.key {string | Array.<string>) Keys to bind
 * @param params.handler {Function} Events handle
 * @param params.scope {string} Scope (optional)
 * @param params.type {string} Event type, will be passed to Mousetrap (optional)
 */
ShortcutsProto.bind = function (params) {
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
ShortcutsProto.bindMap = function (map, options) {
  if (!(map instanceof Object)) {
    throw new Error('Shortcuts map shouldn\'t be empty');
  }

  for (var key in map) {
    if (map.hasOwnProperty(key)) {
      this.bind($.extend({}, options || {}, {key: key, handler: map[key]}));
    }
  }
};

ShortcutsProto.unbindScope = function (scope) {
  this._scopes[scope] = null;
};

ShortcutsProto.getScope = function () {
  return this._scopeChain.slice(1);
};

ShortcutsProto.pushScope = function (scope) {
  if (scope) {
    var position = $.inArray(scope, this._scopeChain);

    if (position !== -1) {
      this._scopeChain.splice(position, 1);
    }

    this._scopeChain.push(scope);
  }
};

ShortcutsProto.popScope = function (scope) {
  if (scope) {
    var position = $.inArray(scope, this._scopeChain);

    if (position !== -1) {
      return this._scopeChain.splice(position, this._scopeChain.length - 1);
    }
  }
};

ShortcutsProto.spliceScope = function (scope) {
  if (scope) {
    var position = $.inArray(scope, this._scopeChain);

    if (position !== -1) {
      return this._scopeChain.splice(position, 1);
    }
  }
};

ShortcutsProto.setScope = function (scope) {
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

ShortcutsProto.hasKey = function (key, scope) {
  return !!(this._scopes[scope] && this._scopes[scope][key]);
};

ShortcutsProto._defaultFilter = function (e, element/*, key*/) {
  var $element = $(element);

  // if the element or its parents have the class "ring-js-shortcuts" then no need to stop
  if ($element.is(Shortcuts.ALLOW_SHORTCUTS_SELECTOR) || $element.closest(Shortcuts.ALLOW_SHORTCUTS_SELECTOR).length) {
    return false;
  }

  // stop for input, select, and textarea
  return $element.is(':input:not(:button)') || (element.contentEditable && element.contentEditable === 'true');
};

ShortcutsProto.setFilter = function (fn) {
  mousetrap.stopCallback = typeof fn === 'function' ? fn : this._defaultFilter;
};


ShortcutsProto.reset = function () {
  this._scopes = {};
  mousetrap.reset();
};

module.exports = Shortcuts;