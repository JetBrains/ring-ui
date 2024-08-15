import Combokeys from 'combokeys';

import sniffr from '../global/sniffer';

export interface ShortcutsScopeOptions {
  modal?: boolean | null | undefined
}

export interface ShortcutsScope {
  scopeId: string
  options: ShortcutsScopeOptions
}

type ShortcutsHandler = (e: KeyboardEvent, key: string, scopeId: string) => boolean | null | void

export interface ShortcutsOptions {
  scope?: string | null | undefined
  type?: string | undefined
}

export interface ShortcutsParams extends ShortcutsOptions{
  key: string | string[],
  handler: ShortcutsHandler
}

export type ShortcutsMap = Record<string, ShortcutsHandler>

class Shortcuts {
  ALLOW_SHORTCUTS_SELECTOR = '.ring-js-shortcuts';
  ROOT_SCOPE = {
    scopeId: 'ROOT',
    options: {}
  };

  _scopes: Record<string, Record<string, ShortcutsHandler> | null> = {};

  private _scopeChain: ShortcutsScope[] = [];

  combokeys = new Combokeys(document.documentElement);
  trigger = (combo: string) => this.combokeys.trigger(combo);

  constructor() {
    this.setFilter();
    this.setScope();
  }

  private _dispatcher = (e: KeyboardEvent, key?: string) => {
    let currentScope;

    for (let i = this._scopeChain.length - 1; i >= 0; i--) {
      const scopeInChain = this._scopeChain[i];
      currentScope = this._scopes[scopeInChain.scopeId];

      if (currentScope && key != null && currentScope[key]) {
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
  };

  /**
   * Binds a handler to a shortcut
   *
   * @param params.key {string | Array.<string>) Keys to bind
   * @param params.handler {Function} Events handle
   * @param params.scope {string} Scope (optional)
   * @param params.type {string} Event type, will be passed to Combokeys (optional)
   */
  bind(params: ShortcutsParams) {
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

    let scope = this._scopes[params.scope];
    if (!scope) {
      scope = this._scopes[params.scope] = {};
    }
    scope[params.key] = params.handler;

    this.combokeys.bind(params.key, this._dispatcher, this._getKeyboardEventType(params));
  }

  /**
   * Binds a map of shortcuts to handlers with common options
   *
   * @map {Object) Keys to handlers map
   * @options.scope {string} Scope (optional)
   * @options.type {string} Event type, will be passed to Combokeys (optional)
   */
  bindMap(map: ShortcutsMap, options?: ShortcutsOptions) {
    if (!(map instanceof Object)) {
      throw new Error('Shortcuts map shouldn\'t be empty');
    }

    for (const key in map) {
      if (map.hasOwnProperty(key)) {
        this.bind(Object.assign({}, options || {}, {key, handler: map[key]}));
      }
    }
  }

  unbindScope(scope: string) {
    this._scopes[scope] = null;
  }

  getScope() {
    return this._scopeChain.slice(1);
  }

  hasScope(scopeId: string) {
    return this.indexOfScope(scopeId) !== -1;
  }

  /**
   * Adds a scope to the chain
   * @param scopeId id of scope to add
   * @param options options for pushing scope
   * @param options.modal whether keys should fall through this scope or not.
   * Useful for modals or overlays
   */
  pushScope(scopeId: string, options: ShortcutsScopeOptions = {}) {
    if (scopeId) {
      const position = this.indexOfScope(scopeId);

      if (position !== -1) {
        this._scopeChain.splice(position, 1);
      }

      this._scopeChain.push(this.wrapScope(scopeId, options));
    }
  }

  popScope(scopeId: string) {
    if (scopeId) {
      const position = this.indexOfScope(scopeId);

      if (position !== -1) {
        return this._scopeChain.splice(position, this._scopeChain.length - 1);
      }
    }

    return undefined;
  }

  spliceScope(scopeId: string) {
    if (scopeId) {
      const position = this.indexOfScope(scopeId);

      if (position !== -1) {
        this._scopeChain.splice(position, 1);
      }
    }
  }

  setScope(scope?: ShortcutsScope | string | (ShortcutsScope | string)[] | null | undefined) {
    if (scope) {
      let scopeChain: (ShortcutsScope | string)[];

      if (typeof scope === 'string' || (!Array.isArray(scope) && typeof scope === 'object' && scope !== null)) {
        scopeChain = [scope];
      } else {
        scopeChain = scope;
      }

      if (!Array.isArray(scopeChain)) {
        return;
      }

      const scopes = scopeChain.map(scopeItem => {
        const isScopeId = typeof scopeItem === 'string';
        return isScopeId ? this.wrapScope(scopeItem) : scopeItem;
      });

      this._scopeChain = [this.ROOT_SCOPE].concat(scopes);
    } else {
      this._scopeChain = [this.ROOT_SCOPE];
    }
  }

  wrapScope(scopeId: string, options: ShortcutsScopeOptions = {}) {
    return {scopeId, options};
  }

  hasKey(key: string, scope: string) {
    return !!(this._scopes[scope]?.[key]);
  }

  private _defaultFilter = (e: Event, element: Element | Document, key?: string): boolean => {
    // if the element or its parents have the class "ring-js-shortcuts" then no need to stop
    if (
      element === document ||
      !(element instanceof HTMLElement) ||
      key == null ||
      element.matches(this.ALLOW_SHORTCUTS_SELECTOR) ||
      element.closest(this.ALLOW_SHORTCUTS_SELECTOR) != null ||
      (
        element.dataset.enabledShortcuts != null &&
        element.dataset.enabledShortcuts.split(',').includes(key)
      )
    ) {
      return false;
    }

    const elementContentEditableAttribute = element.contentEditable;
    const isElementContentEditable = elementContentEditableAttribute === 'true' || elementContentEditableAttribute === 'plaintext-only';

    // stop for input, select, textarea and content-editable elements
    return element.matches('input:not([type=checkbox]),select,textarea') || isElementContentEditable;
  };

  private _getKeyboardEventType(params: ShortcutsParams) {
    if (!params.type && sniffr.os.name === 'windows') {
      const isSystemShortcut = typeof params.key === 'string' && params.key.match(/ctrl/i) && params.key.match(/shift/i) && params.key.match(/[0-9]/);
      /**
       * Windows system shortcuts (ctrl+shift+[0-9] are caught by the OS on 'keydown', so let's use 'keyup'
       */
      if (isSystemShortcut) {
        return 'keyup';
      }
    }
    return params.type;
  }

  setFilter(fn?: (e: Event, element: Element, key?: string) => boolean) {
    this.combokeys.stopCallback = typeof fn === 'function' ? fn : this._defaultFilter;
  }

  indexOfScope(scopeId: string) {
    return this._scopeChain.findIndex(scope => scope.scopeId === scopeId);
  }

  reset() {
    this._scopes = {};
    this.setScope();
    this.combokeys.reset();
  }
}

export default new Shortcuts();
