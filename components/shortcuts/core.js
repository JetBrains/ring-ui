import 'core-js/modules/es6.array.find-index';
import 'dom4';
import Combokeys from 'combokeys';

import sniffr from '../global/sniffer';

class Shortcuts {
  ALLOW_SHORTCUTS_SELECTOR = '.ring-js-shortcuts';
  ROOT_SCOPE = {
    scopeId: 'ROOT',
    options: {}
  };

  _scopes = {};

  combokeys = new Combokeys(document.documentElement);
  trigger = combo => this.combokeys.trigger(combo);

  constructor() {
    this.setFilter();
    this.setScope();
  }

  _dispatcher = (e, key) => {
    let currentScope;

    for (let i = this._scopeChain.length - 1; i >= 0; i--) {
      const scopeInChain = this._scopeChain[i];
      currentScope = this._scopes[scopeInChain.scopeId];

      if (currentScope && currentScope[key]) {
        const ret = currentScope[key](e, key, scopeInChain.scopeId);

        // Fall down in chain when returning true
        if (ret !== true) {
          return ret;
        }
      }

      if (scopeInChain.options.modal) {
        return true;
      }
    }

    return undefined;
  }

  /**
   * Binds a handler to a shortcut
   *
   * @param params.key {string | Array.<string>) Keys to bind
   * @param params.handler {Function} Events handle
   * @param params.scope {string} Scope (optional)
   * @param params.type {string} Event type, will be passed to Combokeys (optional)
   */
  bind(params) {
    if (!(params instanceof Object) || typeof params.handler !== 'function') {
      throw new Error('Shortcut handler should exist');
    }

    if (!params.scope) {
      params.scope = this.ROOT_SCOPE.scopeId;
    }

    if (Array.isArray(params.key)) {
      for (let i = 0; i < params.key.length; i++) {
        this.bind(Object.assign({}, params, {key: params.key[i]}));
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

    this.combokeys.bind(params.key, this._dispatcher, this._getKeyboardEventType(params));
  }

  /**
   * Binds a map of shortcuts to handlers with common options
   *
   * @map {Object) Keys to handlers map
   * @options.scope {string} Scope (optional)
   * @options.type {string} Event type, will be passed to Combokeys (optional)
   */
  bindMap(map, options) {
    if (!(map instanceof Object)) {
      throw new Error('Shortcuts map shouldn\'t be empty');
    }

    for (const key in map) {
      if (map.hasOwnProperty(key)) {
        this.bind(Object.assign({}, options || {}, {key, handler: map[key]}));
      }
    }
  }

  unbindScope(scope) {
    this._scopes[scope] = null;
  }

  getScope() {
    return this._scopeChain.slice(1);
  }

  hasScope(scopeId) {
    return this.indexOfScope(scopeId) !== -1;
  }

  /**
   * Adds a scope to the chain
   * @param scopeId id of scope to add
   * @param options options for pushing scope
   * @param options.modal whether keys should fall through this scope or not.
   * Useful for modals or overlays
   */
  pushScope(scopeId, options = {}) {
    if (scopeId) {
      const position = this.indexOfScope(scopeId);

      if (position !== -1) {
        this._scopeChain.splice(position, 1);
      }

      this._scopeChain.push(this.wrapScope(scopeId, options));
    }
  }

  popScope(scopeId) {
    if (scopeId) {
      const position = this.indexOfScope(scopeId);

      if (position !== -1) {
        return this._scopeChain.splice(position, this._scopeChain.length - 1);
      }
    }

    return undefined;
  }

  spliceScope(scopeId) {
    if (scopeId) {
      const position = this.indexOfScope(scopeId);

      if (position !== -1) {
        this._scopeChain.splice(position, 1);
      }
    }
  }

  setScope(scope) {
    if (scope) {
      let scopeChain;

      if (typeof scope === 'string' || (!Array.isArray(scope) && typeof scope === 'object' && scope !== null)) {
        scopeChain = [scope];
      } else {
        scopeChain = scope;
      }

      if (!Array.isArray(scopeChain)) {
        return;
      }

      scopeChain = scopeChain.map(scopeItem => {
        const isScopeId = typeof scopeItem === 'string';
        return isScopeId ? this.wrapScope(scopeItem) : scopeItem;
      });

      this._scopeChain = [this.ROOT_SCOPE].concat(scopeChain);
    } else {
      this._scopeChain = [this.ROOT_SCOPE];
    }
  }

  wrapScope(scopeId, options = {}) {
    return {scopeId, options};
  }

  hasKey(key, scope) {
    return !!(this._scopes[scope] && this._scopes[scope][key]);
  }

  _defaultFilter = (e, element/*, key*/) => {
    // if the element or its parents have the class "ring-js-shortcuts" then no need to stop
    if (
      element === document ||
      element.matches(this.ALLOW_SHORTCUTS_SELECTOR) ||
      element.closest(this.ALLOW_SHORTCUTS_SELECTOR)
    ) {
      return false;
    }

    // stop for input, select, and textarea
    return element.matches('input,select,textarea') || (element.contentEditable && element.contentEditable === 'true');
  }

  _getKeyboardEventType(params) {
    if (!params.type && sniffr.os.name === 'windows') {
      const isSystemShortcut = params.key.match(/ctrl/i) && params.key.match(/shift/i) && params.key.match(/[0-9]/);
      /**
       * Windows system shortcuts (ctrl+shift+[0-9] are caught by the OS on 'keydown', so let's use 'keyup'
       */
      if (isSystemShortcut) {
        return 'keyup';
      }
    }
    return params.type;
  }

  setFilter(fn) {
    this.combokeys.stopCallback = typeof fn === 'function' ? fn : this._defaultFilter;
  }

  indexOfScope(scopeId) {
    return this._scopeChain.findIndex(scope => scope.scopeId === scopeId);
  }

  reset() {
    this._scopes = {};
    this.setScope();
    this.combokeys.reset();
  }
}

export default new Shortcuts();
