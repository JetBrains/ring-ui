import { c as _createClass, j as _typeof, b as _classCallCheck, d as _defineProperty, _ as _inherits, a as _createSuper } from './_rollupPluginBabelHelpers-ab14fb00.js';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Combokeys from 'combokeys';
import { s as sniffr } from './sniffer-c9d1f40e.js';
import 'sniffr';

var Shortcuts = /*#__PURE__*/function () {
  function Shortcuts() {
    var _this = this;

    _classCallCheck(this, Shortcuts);

    _defineProperty(this, "ALLOW_SHORTCUTS_SELECTOR", '.ring-js-shortcuts');

    _defineProperty(this, "ROOT_SCOPE", {
      scopeId: 'ROOT',
      options: {}
    });

    _defineProperty(this, "_scopes", {});

    _defineProperty(this, "combokeys", new Combokeys(document.documentElement));

    _defineProperty(this, "trigger", function (combo) {
      return _this.combokeys.trigger(combo);
    });

    _defineProperty(this, "_dispatcher", function (e, key) {
      var currentScope;

      for (var i = _this._scopeChain.length - 1; i >= 0; i--) {
        var scopeInChain = _this._scopeChain[i];
        currentScope = _this._scopes[scopeInChain.scopeId];

        if (currentScope && currentScope[key]) {
          var ret = currentScope[key](e, key, scopeInChain.scopeId); // Fall down in chain when returning true

          if (ret !== true) {
            return ret;
          }
        }

        if (scopeInChain.options.modal) {
          return true;
        }
      }

      return undefined;
    });

    _defineProperty(this, "_defaultFilter", function (e, element, key) {
      // if the element or its parents have the class "ring-js-shortcuts" then no need to stop
      if (element === document || element.matches(_this.ALLOW_SHORTCUTS_SELECTOR) || element.closest(_this.ALLOW_SHORTCUTS_SELECTOR) || element.dataset.enabledShortcuts != null && element.dataset.enabledShortcuts.split(',').includes(key)) {
        return false;
      } // stop for input, select, and textarea


      return element.matches('input,select,textarea') || element.contentEditable && element.contentEditable === 'true';
    });

    this.setFilter();
    this.setScope();
  }

  _createClass(Shortcuts, [{
    key: "bind",

    /**
     * Binds a handler to a shortcut
     *
     * @param params.key {string | Array.<string>) Keys to bind
     * @param params.handler {Function} Events handle
     * @param params.scope {string} Scope (optional)
     * @param params.type {string} Event type, will be passed to Combokeys (optional)
     */
    value: function bind(params) {
      if (!(params instanceof Object) || typeof params.handler !== 'function') {
        throw new Error('Shortcut handler should exist');
      }

      if (!params.scope) {
        params.scope = this.ROOT_SCOPE.scopeId;
      }

      if (Array.isArray(params.key)) {
        for (var i = 0; i < params.key.length; i++) {
          this.bind(Object.assign({}, params, {
            key: params.key[i]
          }));
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

  }, {
    key: "bindMap",
    value: function bindMap(map, options) {
      if (!(map instanceof Object)) {
        throw new Error('Shortcuts map shouldn\'t be empty');
      }

      for (var key in map) {
        if (map.hasOwnProperty(key)) {
          this.bind(Object.assign({}, options || {}, {
            key: key,
            handler: map[key]
          }));
        }
      }
    }
  }, {
    key: "unbindScope",
    value: function unbindScope(scope) {
      this._scopes[scope] = null;
    }
  }, {
    key: "getScope",
    value: function getScope() {
      return this._scopeChain.slice(1);
    }
  }, {
    key: "hasScope",
    value: function hasScope(scopeId) {
      return this.indexOfScope(scopeId) !== -1;
    }
    /**
     * Adds a scope to the chain
     * @param scopeId id of scope to add
     * @param options options for pushing scope
     * @param options.modal whether keys should fall through this scope or not.
     * Useful for modals or overlays
     */

  }, {
    key: "pushScope",
    value: function pushScope(scopeId) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (scopeId) {
        var position = this.indexOfScope(scopeId);

        if (position !== -1) {
          this._scopeChain.splice(position, 1);
        }

        this._scopeChain.push(this.wrapScope(scopeId, options));
      }
    }
  }, {
    key: "popScope",
    value: function popScope(scopeId) {
      if (scopeId) {
        var position = this.indexOfScope(scopeId);

        if (position !== -1) {
          return this._scopeChain.splice(position, this._scopeChain.length - 1);
        }
      }

      return undefined;
    }
  }, {
    key: "spliceScope",
    value: function spliceScope(scopeId) {
      if (scopeId) {
        var position = this.indexOfScope(scopeId);

        if (position !== -1) {
          this._scopeChain.splice(position, 1);
        }
      }
    }
  }, {
    key: "setScope",
    value: function setScope(scope) {
      var _this2 = this;

      if (scope) {
        var scopeChain;

        if (typeof scope === 'string' || !Array.isArray(scope) && _typeof(scope) === 'object' && scope !== null) {
          scopeChain = [scope];
        } else {
          scopeChain = scope;
        }

        if (!Array.isArray(scopeChain)) {
          return;
        }

        scopeChain = scopeChain.map(function (scopeItem) {
          var isScopeId = typeof scopeItem === 'string';
          return isScopeId ? _this2.wrapScope(scopeItem) : scopeItem;
        });
        this._scopeChain = [this.ROOT_SCOPE].concat(scopeChain);
      } else {
        this._scopeChain = [this.ROOT_SCOPE];
      }
    }
  }, {
    key: "wrapScope",
    value: function wrapScope(scopeId) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return {
        scopeId: scopeId,
        options: options
      };
    }
  }, {
    key: "hasKey",
    value: function hasKey(key, scope) {
      return !!(this._scopes[scope] && this._scopes[scope][key]);
    }
  }, {
    key: "_getKeyboardEventType",
    value: function _getKeyboardEventType(params) {
      if (!params.type && sniffr.os.name === 'windows') {
        var isSystemShortcut = params.key.match(/ctrl/i) && params.key.match(/shift/i) && params.key.match(/[0-9]/);
        /**
         * Windows system shortcuts (ctrl+shift+[0-9] are caught by the OS on 'keydown', so let's use 'keyup'
         */

        if (isSystemShortcut) {
          return 'keyup';
        }
      }

      return params.type;
    }
  }, {
    key: "setFilter",
    value: function setFilter(fn) {
      this.combokeys.stopCallback = typeof fn === 'function' ? fn : this._defaultFilter;
    }
  }, {
    key: "indexOfScope",
    value: function indexOfScope(scopeId) {
      return this._scopeChain.findIndex(function (scope) {
        return scope.scopeId === scopeId;
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this._scopes = {};
      this.setScope();
      this.combokeys.reset();
    }
  }]);

  return Shortcuts;
}();

var shortcuts = new Shortcuts();

var Shortcuts$1 = /*#__PURE__*/function (_PureComponent) {
  _inherits(Shortcuts, _PureComponent);

  var _super = _createSuper(Shortcuts);

  function Shortcuts() {
    _classCallCheck(this, Shortcuts);

    return _super.apply(this, arguments);
  }

  _createClass(Shortcuts, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.props.disabled) {
        this.turnShorcutsOn();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var disabled = this.props.disabled;

      if (!prevProps.disabled && disabled) {
        this.turnShorcutsOff();
      }

      if (prevProps.disabled && !disabled) {
        this.turnShorcutsOn();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!this.props.disabled) {
        this.turnShorcutsOff();
      }
    }
  }, {
    key: "turnShorcutsOn",
    value: function turnShorcutsOn() {
      var _this$props = this.props,
          map = _this$props.map,
          scope = _this$props.scope,
          options = _this$props.options;
      shortcuts.bindMap(map, this.props);
      shortcuts.pushScope(scope, options);
    }
  }, {
    key: "turnShorcutsOff",
    value: function turnShorcutsOff() {
      var scope = this.props.scope;
      shortcuts.unbindScope(scope);
      shortcuts.spliceScope(scope);
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children || null;
    }
  }]);

  return Shortcuts;
}(PureComponent);

_defineProperty(Shortcuts$1, "propTypes", {
  map: PropTypes.object.isRequired,
  scope: PropTypes.string.isRequired,
  options: PropTypes.object,
  disabled: PropTypes.bool,
  children: PropTypes.node
});

_defineProperty(Shortcuts$1, "defaultProps", {
  options: {}
});

export default Shortcuts$1;
