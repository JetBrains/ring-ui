define(['jquery'], function($) {
  'use strict';

  // Utils
  var util = {};

  util.isDeferred = function(obj) {
    return $.isFunction(obj) && obj.promise && $.isFunction(obj.promise);
  };

  // Logging
  // TODO Proper logging
  var RingError = function(message) {
    this.name = 'RingError';
    this.message = message || 'Hello, I\'m new shiny metal^W Ring Error';
  };

  RingError.prototype = new Error();
  RingError.prototype.constructor = RingError;

  var DEBUG = false;
  var TEST = true;
  var log = function(message) {
    if (DEBUG) {
      throw new RingError(message);
    } else if (console && !TEST) {
      console.log(message);
    }
  };

  // Modules
  var modules = {};
  var GLOBAL = 'global';

  var Module = function(props, moduleName) {
    var self = this;
    var methods = {};

    var set = function(props) {
      var method;

      for (var prop in props) {
        method = props[prop];
        if (typeof method === 'function' || ($.isArray(method) && typeof method[0] === 'function')) {
          methods[prop] = method;
        }
      }
    };

    var get = function(name) {
      if (typeof name !== 'string') {
        log('Method name must be a string');
        return $.noop;
      }

      var method;

      if ((method = methods[name])) {
        return method;
      } else {
        log('There is no method ' + name + ' in module "' + moduleName + '"');
        return $.noop;
      }
    };

    var invoke = function(name) {
      return self.run(get(name), Array.prototype.slice.call(arguments, 1));
    };

    invoke.get = get;
    invoke.set = set;
    invoke.run = self.run;
    invoke.invoke = invoke;

    // TODO Events
    invoke.on = $.noop;
    invoke.off = $.noop;
    invoke.trigger = $.noop;

    set(props);

    return invoke;
  };

  Module.prototype.run = function(method, args) {
    var dfd;

    var func = (typeof method === 'function') ? method : method[0];
    var ret = func.apply(null, args);

    var override = method[1] && !!method[1].override;

    if (util.isDeferred(ret) || override) {
      dfd = ret;
    } else {
      dfd = $.Deferred();
      dfd.resolve(ret);
    }
    return dfd;
  };

  var addModule = function(name, props) {
    if (typeof name !== 'string') {
      log('Module name must be a string');
      return false;
    }

    if (typeof props !== 'object') {
      log('Module name must be an object');
      return false;
    }

    if (modules[name]) {
      modules[name].set(props);
      return false;
    }

    modules[name] = new Module(props, name);
    return true;
  };

  var removeModule = function(name) {
    if (typeof name !== 'string') {
      log('Module name must be a string');
      return false;
    }

    if (!modules[name]) {
      log('There is no module "' + name + '"');
      return false;
    }

    if (name === GLOBAL) {
      log('Can not remove "' + name + '" module');
      return false;
    }

    return delete modules[name];
  };

  // Definitions
  var ring = function(moduleName, methodName) {
    // Get method
    if (moduleName && methodName) {
      var module = invoke(moduleName);
      var method = module.get(methodName);

      return function() {
        return module.run(method, arguments);
      };

    // Get module
    } else if (moduleName) {
      return invoke(moduleName);

    // Get global
    } else {
      return invoke(GLOBAL);
    }
  };

  ring.add = addModule;
  ring.remove = removeModule;

  var options = {
    override: true
  };

  ring.add(GLOBAL, {
    add: [addModule, options],
    remove: [removeModule, options]
  });

  var invoke = function(name) {
    if (!modules[name]) {
      log('There is no module "' + name + '"');
      return $.noop;
    } else {
      return modules[name];
    }
  };

  return ring;
});
