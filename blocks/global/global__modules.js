define(['jquery', 'global/global__events', 'global/global__utils'], function ($, events, utils) {
  'use strict';

  // Function.prototype.bind polyfill
  // TODO include as component
  if (!Function.prototype.bind || Function.prototype.bind.toString().indexOf('[native code]') === -1) {
    /* jshint ignore:start */
    var slice = Array.prototype.slice;

    Function.prototype.bind = function(context) {
      var func = this;
      var args = slice.call(arguments, 1);

      function bound() {
        var invokedAsConstructor = func.prototype && (this instanceof func);
        return func.apply(
          // Ignore the context parameter when invoking the bound function
          // as a constructor. Note that this includes not only constructor
          // invocations using the new keyword but also calls to base class
          // constructors such as BaseClass.call(this, ...) or super(...).
          !invokedAsConstructor && context || this,
          args.concat(slice.call(arguments))
        );
      }

      // The bound function must share the .prototype of the unbound
      // function so that any object created by one constructor will count
      // as an instance of both constructors.
      bound.prototype = func.prototype;

      return bound;
    };
    /* jshint ignore:end */
  }

  var modules = {};
  var methodsList = [];

  var Module = function (props, name) {
    var scope = {
      methods: {},
      properties: {},
      global: name === Module.GLOBAL,
      name: name
    };

    // Setup API defined module methods
    this.set(scope, props);

    for (var i = methodsList.length, method; i--; i > 0) {
      method = methodsList[i];
      // Encapsulate scope in base methods
      this[method] = this[method].bind(this, scope);
      // Pretend invoke is module itself
      this.invoke[method] = this[method];
    }
  };

  // Mixin events
  $.extend(Module.prototype, events.methods);

  // Instance
  Module.prototype.invoke = function (scope, name) {
    var dfd, ret, action;

    var method = this.get(name);
    var func = method.method || method;
    var override = !!method.override;

    if (typeof func === 'function') {
      ret = func.apply(null, Array.prototype.slice.call(arguments, 2));
      action = 'resolve';
    } else {
      ret = null;
      action = 'reject';
    }

    if (utils.isDeferred(ret)) {
      dfd = ret;
      action = null;
    } else {
      dfd = $.Deferred();
    }

    this.trigger(name);

    dfd
      .done(this.stateTrigger(name, 'done'))
      .fail(this.stateTrigger(name, 'fail'));

    if (typeof dfd.always === 'function') {
      dfd.always(this.stateTrigger(name, 'always'));
    }

    if (action) {
      dfd[action](ret);
    }

    return override ? ret : dfd.promise();
  };

  Module.prototype.set = function (scope, props) {
    var field;
    var methods = scope.methods;
    var properties = scope.properties;

    for (var name in props) {
      field = props[name];
      if (typeof field === 'function' || typeof field.method === 'function') {
        methods[name] = field;
      } else {
        properties[name] = field;
      }
    }

    return true;
  };

  Module.prototype.update = function (scope, name) {
    var part, path, data, newData, pathParts;
    var props = this.get(name);
    var args = Array.prototype.slice.call(arguments, 2);

    if (props) {
      var extenders = [true, props];

      while (args.length) {
        path = args[0];
        data = args[1];

        if (path === '.') {
          newData = data;
        } else {
          pathParts = args[0].split('.');

          while ((part = pathParts.pop())) {
            if (isNaN(Number(part))) {
              newData = {};
            } else {
              newData = [];
            }
            newData[part] = data;
            data = newData;
          }
        }

        extenders.push(newData);
        args.splice(0, 2);
      }

      $.extend.apply($, extenders);
    } else {
    }

    return props;
  };

  Module.prototype.get = function (scope, name) {
    if (typeof name !== 'string') {
      return $.noop;
    }

    var methods = scope.methods;
    var properties = scope.properties;

    if (methods[name]) {
      return methods[name];
    } else if (properties[name]) {
      return properties[name];
    } else {
      return $.noop;
    }
  };

  // Form methods list
  (function (obj, primary) {
    // Collect methods
    for (var method in obj) {
      if (obj.hasOwnProperty(method)) {
        methodsList.push(method);
      }
    }

    // Move primary method to the end of list
    methodsList.push(methodsList.splice($.inArray(primary, methodsList), 1)[0]);
  }(Module.prototype, 'invoke'));

  // Static
  Module.add = function (name, props) {
    if (typeof name !== 'string') {
      return false;
    }

    if (typeof props !== 'object') {
      return false;
    }

    if (modules[name]) {
      modules[name].set(props);
      return false;
    }

    modules[name] = new Module(props, name);
    return true;
  };

  Module.remove = function (name) {
    if (typeof name !== 'string') {
      return false;
    }

    if (!modules[name]) {
      return false;
    }

    if (name === Module.GLOBAL) {
      return false;
    }

    return delete modules[name];
  };

  Module.get = function (name) {
    if (!modules[name]) {
      return $.noop;
    } else {
      return modules[name].invoke;
    }
  };

  Module.has = function (name) {
    return !!modules[name];
  };

  Module.multi = function (method, list) {
    var promises = [];

    if (typeof list !== 'object') {
      return $.Deferred().reject().promise();
    }

    $.each(list, function (name, data) {
      var promise, ret;
      var module = modules[name];

      if (!module) {
        ret = null;
      } else {
        ret = module.invoke(method, data);
      }

      if (utils.isDeferred(ret)) {
        promise = ret;
      } else {
        promise = $.Deferred();
        promise.resolve(ret);
      }

      promises.push(promise);
    });

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
    config: function (data) {
      return Module.get(Module.GLOBAL).set({
        config: data
      });
    },
    init: Module.multi.bind(Module, 'init'),
    update: Module.multi.bind(Module, 'update')
  });

  return Module;
});
