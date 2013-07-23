define(['jquery', 'global/global__events', 'global/global__templates'], function($, Event, Template) {
  'use strict';

  // Function.prototype.bind polyfill
  // TODO include as component
  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        Noop = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof Noop && oThis ? this: oThis,
            aArgs.concat(Array.prototype.slice.call(arguments)));
        };

      Noop.prototype = this.prototype;
      fBound.prototype = new Noop();

      return fBound;
    };
  }

  // Object.keys polyfill
  if (!Object.keys) {
    Object.keys = (function () {
      var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

      return function (obj) {
        if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) {
          throw new TypeError('Object.keys called on non-object');
        }

        var result = [];

        for (var prop in obj) {
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }

        if (hasDontEnumBug) {
          for (var i=0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
              result.push(dontEnums[i]);
            }
          }
        }
        return result;
      };
    })();
  }


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

  //
  // Modules
  //
  var modules = {};
  var config = {};

  var Module = function(props, name) {
    var scope = {
      methods: {},
      global: name === Module.GLOBAL,
      name: name
    };

    // Setup API defined module methods
    this.set(scope, props);

    // Base methods list
    var methods = Object.keys(Module.prototype);
    // Move invoke to the end of list
    methods.push(methods.splice($.inArray('invoke', methods),1)[0]);

    for (var i = methods.length, method; i--; i > 0) {
      method = methods[i];
      // Encapsulate scope in base methods
      this[method] = this[method].bind(this, scope);
      // Pretend invoke is module itself
      this.invoke[method] = this[method];
    }
  };

  // Mixin events
  $.extend(Module.prototype, Event.events);

  // Instance
  Module.prototype.invoke = function(scope, name) {
    var dfd, ret, action;
    var trigger = this.trigger || $.noop;

    var method = this.get(name);
    var func = method.method || method;
    var override = !!method.override;

    if (typeof func === 'function') {
      ret = func.apply(null, Array.prototype.slice.call(arguments, 2));
      action = 'resolve';
    } else {
      ret = null;
      action = 'reject';
      log('Method "' + name + '" must be a function');
    }

    if (override) {
      return ret;
    }

    var triggerOnState = function(state) {
      var signature = name + Event.MODULE_DELIM + state;

      return function(result) {
        trigger(signature, result);
      };
    };

    if (util.isDeferred(ret)) {
      dfd = ret;
      action = null;
    } else {
      dfd = $.Deferred();
    }

    dfd
      .always(triggerOnState('always'))
      .done(triggerOnState('done'))
      .fail(triggerOnState('fail'));

    if (action) {
      dfd[action](ret);
    }

    return dfd.promise();
  };

  Module.prototype.set = function(scope, props) {
    var method;
    var methods = scope.methods;

    for (var name in props) {
      method = props[name];
      if (typeof method === 'function' || typeof method.method === 'function') {
        methods[name] = method;
      }
    }
  };

  Module.prototype.get = function(scope, name) {
    if (typeof name !== 'string') {
      log('Method name must be a string');
      return $.noop;
    }

    var method;
    var methods = scope.methods;

    if ((method = methods[name])) {
      return method;
    } else {
      log('There is no method ' + name + ' in module "' + this.name + '"');
      return $.noop;
    }
  };


  // Static
  Module.add = function(name, props) {
    if (typeof name !== 'string') {
      log('Module name must be a string');
      return false;
    }

    if (typeof props !== 'object') {
      log('Module properties must be an object');
      return false;
    }

    if (modules[name]) {
      modules[name].set(props);
      return false;
    }

    modules[name] = new Module(props, name);
    return true;
  };

  Module.remove = function(name) {
    if (typeof name !== 'string') {
      log('Module name must be a string');
      return false;
    }

    if (!modules[name]) {
      log('There is no module "' + name + '"');
      return false;
    }

    if (name === Module.GLOBAL) {
      log('Can not remove "' + name + '" module');
      return false;
    }

    return delete modules[name];
  };

  Module.get = function(name) {
    if (!modules[name]) {
      log('There is no module "' + name + '"');
      return $.noop;
    } else {
      return modules[name].invoke;
    }
  };

  Module.config = function(data) {
    if (typeof data !== 'object') {
      return config;
    }

    $.extend(config, data);
    return config;
  };

  Module.init = function(list) {
    var promises = [];

    if (typeof list !== 'object') {
      log('Modules list must be an object');
      return $.Deferred().reject().promise();
    }

    $.each(function(name, data) {
      var promise, ret;
      var module = modules[name];

      if (!module) {
        log('There is no module "' + name + '"');
      } else {
        ret = module.invoke('init', data);

        if (util.isDeferred(ret)) {
          promise = ret;
        } else {
          promise = $.Deferred();
          promise.resolve(ret);
        }

        promises.push(promise);
      }
    });

    if (!promises.length) {
      log('There is no modules in init object');
      return $.Deferred().reject().promise();
    }


    return $.when.apply($, promises);
  };

  // Global module name
  Module.GLOBAL = 'root';

  // Global module
  Module.add(Module.GLOBAL, {
    add: {
      method: Module.add,
      override: true
    },
    remove: {
      method: Module.remove,
      override: true
    },
    config: {
      method: Module.config,
      override: true
    },
    init: Module.init,
    render: {
      method: Template.render,
      override: true
    }
  });

  return Module;
});
