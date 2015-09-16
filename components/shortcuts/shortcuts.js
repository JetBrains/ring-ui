import 'babel/polyfill';
import 'dom4';
import mousetrap from 'mousetrap';

class Shortcuts {
  ALLOW_SHORTCUTS_SELECTOR = '.ring-js-shortcuts';
  ROOT_SCOPE = 'ROOT';

  _scopes = {};

  constructor() {
    this.setFilter();
    this.setScope();
  }

  _dispatcher(e, key) {
    let currentScope;

    for (let i = this._scopeChain.length - 1; i >= 0; i--) {
      currentScope = this._scopes[this._scopeChain[i]];

      if (currentScope && currentScope[key]) {
        let ret = currentScope[key](e, key, this._scopeChain[i]);

        // Fall down in chain when returning true
        if (ret !== true) {
          return ret;
        }
      }
    }
  }

  /**
   * Binds handler to shortcut
   *
   * @param params.key {string | Array.<string>) Keys to bind
   * @param params.handler {Function} Events handle
   * @param params.scope {string} Scope (optional)
   * @param params.type {string} Event type, will be passed to Mousetrap (optional)
   */
  bind(params) {
    if (!(params instanceof Object) || typeof params.handler !== 'function') {
      throw new Error('Shortcut handler should exist');
    }

    if (!params.scope) {
      params.scope = this.ROOT_SCOPE;
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

    mousetrap.bind(params.key, ::this._dispatcher, params.type);
  }

  /**
   * Binds map of shortcuts to handlers with common options
   *
   * @map {Object) Keys to handlers map
   * @options.scope {string} Scope (optional)
   * @options.type {string} Event type, will be passed to Mousetrap (optional)
   */
  bindMap(map, options) {
    if (!(map instanceof Object)) {
      throw new Error('Shortcuts map shouldn\'t be empty');
    }

    for (let key in map) {
      if (map.hasOwnProperty(key)) {
        this.bind(Object.assign({}, options || {}, {key: key, handler: map[key]}));
      }
    }
  }

  unbindScope(scope) {
    this._scopes[scope] = null;
  }

  getScope() {
    return this._scopeChain.slice(1);
  }

  hasScope(scope) {
    return this._scopeChain.indexOf(scope) !== -1;
  }

  pushScope(scope) {
    if (scope) {
      let position = this._scopeChain.indexOf(scope);

      if (position !== -1) {
        this._scopeChain.splice(position, 1);
      }

      this._scopeChain.push(scope);
    }
  }

  popScope(scope) {
    if (scope) {
      let position = this._scopeChain.indexOf(scope);

      if (position !== -1) {
        return this._scopeChain.splice(position, this._scopeChain.length - 1);
      }
    }
  }

  spliceScope(scope) {
    if (scope) {
      let position = this._scopeChain.indexOf(scope);

      if (position !== -1) {
        this._scopeChain.splice(position, 1);
      }
    }
  }

  setScope(scope) {
    if (scope) {
      if (typeof scope === 'string') {
        scope = [scope];
      }

      if (!Array.isArray(scope)) {
        return;
      }

      this._scopeChain = [this.ROOT_SCOPE].concat(scope);
    } else {
      this._scopeChain = [this.ROOT_SCOPE];
    }
  }

  hasKey(key, scope) {
    return !!(this._scopes[scope] && this._scopes[scope][key]);
  }

  _defaultFilter(e, element/*, key*/) {
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

  setFilter(fn) {
    mousetrap.stopCallback = typeof fn === 'function' ? fn : ::this._defaultFilter;
  }

  reset() {
    this._scopes = {};
    this.setScope();
    mousetrap.reset();
  }
}

export default new Shortcuts();
