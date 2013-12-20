define([
  'jquery',
  'mousetrap',
  'global/global__modules'
], function($, mousetrap,  Module) {
  'use strict';

  var MODULE = 'shortcuts';
  var ROOT_SCOPE = '';
  var ALLOW_SHORTCUTS_CLASS = 'ring-js-shortcuts';

  var scopes = {};
  var scopeChain;
  var scopeModal;


  var dispatcher = function(e, key) {
    var currentScope;

    if (scopeModal) {
      currentScope = scopes[scopeModal];

      if (currentScope && currentScope[key]) {
        return currentScope[key](e, key, scopeModal);
      }

      return;
    }

    for (var i = scopeChain.length - 1; i >= 0; i--) {
      currentScope = scopes[scopeChain[i]];

      if (currentScope && currentScope[key]) {
        return currentScope[key](e, key, scopeChain[i]);
      }
    }
  };


  /**
   * Binds events to key
   *
   * @param Event params
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

  var bindList = function(options, list) {
    if (list === undefined) {
      list = options;
    }

    $.each(list, function(key, handler) {
      bind($.extend({}, options, {key: key, handler: handler}));
    });
  };

  var getModalScope = function() {
    return scopeModal;
  };

  var setModalScope = function(scope) {
    if (typeof scope === 'string') {
      scopeModal = scope;
    } else {
      scopeModal = null;
    }
  };


  var getScope = function() {
    return scopeChain.slice();
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
        scopeChain.splice(position);
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
      scopeChain = [ROOT_SCOPE, scope];
    } else {
      scopeChain = [ROOT_SCOPE];
    }
  };

  var defaultFilter = function(e, element/*, key*/) {
    var $element = $(element);

    // if the element has the class "ring-js-shortcut" then no need to stop
    if ($element.hasClass(ALLOW_SHORTCUTS_CLASS)) {
      return false;
    }

    // stop for input, select, and textarea
    return $element.is(':input') || (element.contentEditable && element.contentEditable === 'true');
  };

  var setFilter = function(fn) {
    mousetrap.stopCallback = typeof fn === 'function' ? fn : defaultFilter;
  };

  // Set defaults on start
  setFilter();
  setModalScope();
  setScope();

  // Public methods
  Module.add(MODULE, {
    bind: bind,
    bindList: bindList,
    getModalScope: {
      method: getModalScope,
      override: true
    },
    setModalScope: setModalScope,
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