define([
  'jquery',
  'mousetrap',
  'global/global__modules'
], function($, mousetrap,  Module) {
  'use strict';

  var MODULE = 'shortcuts';
  var ROOT_SCOPE = 'ROOT';
  var ALLOW_SHORTCUTS_SELECTOR = '.ring-js-shortcuts';

  var scopes = {};
  var scopeChain;

  var dispatcher = function(e, key) {
    var currentScope;

    for (var i = scopeChain.length - 1; i >= 0; i--) {
      currentScope = scopes[scopeChain[i]];

      if (currentScope && currentScope[key]) {
        var ret = currentScope[key](e, key, scopeChain[i]);

        // Fall down in chain when returning true
        if (ret !== true) {
          return ret;
        }
      }
    }
  };


  /**
   * Binds events to key
   *
   * @params Event params
   * @params.key {string | Array.<string>) Keys to bind
   * @params.handler {Function} Events handle
   * @params.scope {string} Scope (optional)
   * @params.type {string} Event type, will be passed to Mousetrap (optional)
   */
  var bind = function(params) {
    if (typeof params !== 'object' || typeof params.key !== 'string' || typeof params.handler !== 'function') {
      return;
    }

    if (!params.scope) {
      params.scope = ROOT_SCOPE;
    }

    if ($.isArray(params.key)) {
      $.each(params.key, function(i, key) {
        bind($.extend({}, params, {key: key}));
      });

      return;
    }

    scopes[params.scope] = scopes[params.scope] || {};
    scopes[params.scope][params.key] = params.handler;

    mousetrap.bind(params.key, dispatcher, params.type);
  };

  /**
   * Binds events list to keys
   *
   * @params Event params
   * @params.handler {Function} Events handle
   * @params.scope {string} Scope (optional)
   * @params.type {string} Event type, will be passed to Mousetrap (optional)
   * @params.list {Object) Keys to handlers map
   */
  var bindList = function(options, list) {
    if (list === undefined) {
      list = options;
    }

    $.each(list, function(key, handler) {
      bind($.extend({}, options, {key: key, handler: handler}));
    });
  };

  var unBindList = function(scope) {
    scopes[scope] = null;
  };

  var getScope = function() {
    return scopeChain.slice(1);
  };

  var pushScope = function(scope) {
    if (scope) {
      var position = $.inArray(scope, scopeChain);

      if (position !== -1) {
        scopeChain.splice(position, 1);
      }

      scopeChain.push(scope);
    }
  };

  var popScope = function(scope) {
    if (scope) {
      var position = $.inArray(scope, scopeChain);

      if (position !== -1) {
        scopeChain.length = position;
      }
    }
  };

  var spliceScope = function(scope) {
    if (scope) {
      var position = $.inArray(scope, scopeChain);

      if (position !== -1) {
        scopeChain.splice(position, 1);
      }
    }
  };

  var setScope = function(scope) {
    if (scope) {
      if (typeof scope === 'string') {
        scope = [scope];
      }

      if (!$.isArray(scope)) {
        return;
      }

      scopeChain = [ROOT_SCOPE].concat(scope);
    } else {
      scopeChain = [ROOT_SCOPE];
    }
  };

  var hasKey = function(key, scope) {
    return !!(scopes[scope] && scopes[scope][key]);
  };

  var defaultFilter = function(e, element/*, key*/) {
    var $element = $(element);

    // if the element or its parents have the class "ring-js-shortcuts" then no need to stop
    if ($element.is(ALLOW_SHORTCUTS_SELECTOR) || $element.closest(ALLOW_SHORTCUTS_SELECTOR).length) {
      return false;
    }

    // stop for input, select, and textarea
    return $element.is(':input:not(:button)') || (element.contentEditable && element.contentEditable === 'true');
  };

  var setFilter = function(fn) {
    mousetrap.stopCallback = typeof fn === 'function' ? fn : defaultFilter;
  };

  // Set defaults on start
  setFilter();
  setScope();

  // Public methods
  Module.add(MODULE, {
    bind: bind,
    bindList: bindList,
    unBindList: unBindList,
    trigger: {
      method: mousetrap.trigger,
      override: true
    },
    hasKey: {
      method: hasKey,
      override: true
    },
    getScope: {
      method: getScope,
      override: true
    },
    setScope: setScope,
    pushScope: pushScope,
    popScope: popScope,
    spliceScope: spliceScope,
    setFilter: setFilter
  });

});