define(['jquery', 'global/global__events'], function($, events) {
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

  var Module = function(props, name) {
    var scope = {
      methods: {},
      global: name === Module.GLOBAL,
      name: name
    };

    // Setup API defined module methods
    this.set(scope, props);

    // Always run invoke in module context
    this.invoke = this.invoke.bind(this);

    // Encapsulate scope in base methods
    for (var method in this) {
      if (method !== 'invoke') {
        this[method] = this[method].bind(this, scope);
      }
      // Pretend invoke is module itself
      this.invoke[method] = this[method];
    }
  };

  // Mixin events
  $.extend(Module.prototype, events);

  // Instance
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

  // Global module name
  Module.GLOBAL = 'global';

  return Module;
});
