define(['jquery'], function($) {
  'use strict';

  // bind polyfill
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

  var Module = function(props, moduleName) {
    var methods = {};

    // True and evil encapsulation
    this.set = this.set.bind(this, methods);
    this.get = this.get.bind(this, methods);

    // Always run invoke in module context
    this.invoke = this.invoke.bind(this);
    this.invoke.invoke = this.invoke;

    // Pretend invoke is module
    $.extend(this.invoke, this);

    // Setup module
    this.name = moduleName;
    this.set(props);
  };

  // TODO Events
  Module.prototype.on = $.noop;
  Module.prototype.off = $.noop;
  Module.prototype.trigger = $.noop;

  Module.prototype.invoke = function(name) {
    var dfd, ret;

    var method = this.get(name);
    var func = method.method || method;
    var override = !!method.override;

    if (typeof func === 'function') {
      ret = func.apply(null, Array.prototype.slice.call(arguments, 1));
    } else {
      ret = null;
      log('Method "' + name + '" must be a function');
    }

    if (util.isDeferred(ret) || override) {
      dfd = ret;
    } else {
      dfd = $.Deferred();
      dfd.resolve(ret);
    }
    return dfd;
  };

  Module.prototype.set = function(methods, props) {
    var method;

    for (var name in props) {
      method = props[name];
      if (typeof method === 'function' || typeof method.method === 'function') {
        methods[name] = method;
      }
    }
  };

  Module.prototype.get = function(methods, name) {
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

    if (name === GLOBAL) {
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

  // Ring
  var GLOBAL = 'global';

  var ring = function(module, method) {
    // Get method
    if (module && method) {
      return Module.get(module).bind({}, method);

    // Get module
    } else if (module) {
      return Module.get(module);

    // Get global module
    } else {
      return Module.get(GLOBAL);
    }
  };


  // Basic methods
  ring.add = Module.add;
  ring.remove = Module.remove;

  // Global module
  ring.add(GLOBAL, {
    add: {
      method: Module.add,
      override: true
    },
    remove: {
      method: Module.remove,
      override: true
    }
  });

  return ring;
});
