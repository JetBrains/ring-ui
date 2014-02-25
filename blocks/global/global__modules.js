define(['jquery', 'global/global__events', 'global/global__utils'], function ($, events, utils) {
  'use strict';

  // Function.prototype.bind polyfill
  // TODO include as component
  if (!Function.prototype.bind || Function.prototype.bind.toString().indexOf('[native code]') === -1) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        Noop = function () {
      },
        fBound = function () {
          return fToBind.apply(this instanceof Noop && oThis ? this : oThis,
            aArgs.concat(Array.prototype.slice.call(arguments)));
        };

      Noop.prototype = this.prototype;
      fBound.prototype = new Noop();

      return fBound;
    };
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
      utils.log('Method "' + name + '" must be a function');
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
      utils.log('There is nothing to update in module "' + name + '" config');
    }

    return props;
  };

  Module.prototype.get = function (scope, name) {
    if (typeof name !== 'string') {
      utils.log('Method name must be a string');
      return $.noop;
    }

    var methods = scope.methods;
    var properties = scope.properties;

    if (methods[name]) {
      return methods[name];
    } else if (properties[name]) {
      return properties[name];
    } else {
      utils.log('There is no method or property ' + name + ' in module "' + scope.name + '"');
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
      utils.log('Module name must be a string');
      return false;
    }

    if (typeof props !== 'object') {
      utils.log('Module properties must be an object');
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
      utils.log('Module name must be a string');
      return false;
    }

    if (!modules[name]) {
      utils.log('There is no module "' + name + '"');
      return false;
    }

    if (name === Module.GLOBAL) {
      utils.log('Can not remove "' + name + '" module');
      return false;
    }

    return delete modules[name];
  };

  Module.get = function (name) {
    if (!modules[name]) {
      utils.log('There is no module "' + name + '"');
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
      utils.log('Modules list in multi-method "' + method + '" must be an object');
      return $.Deferred().reject().promise();
    }

    $.each(list, function (name, data) {
      var promise, ret;
      var module = modules[name];

      if (!module) {
        utils.log('There is no module "' + name + '"');
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
