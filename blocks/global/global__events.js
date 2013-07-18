define(function() {
  'use strict';

  // Event constructor
  var NAMESPACE_DELIM = '::';
  var MODULE_DELIM = ':';

  var uid = 1;
  var empty = {};

  var Event = function(signature, module, handler, one) {
    if (typeof signature !== 'string') {
      // log here
      return empty;
    }

    if (!module.global) {
      signature = module.name + MODULE_DELIM + signature;
    }

    var parts = signature.split(NAMESPACE_DELIM);

    this.name = parts[0];
    this.namespace = parts[1] || null;
    this.uid = uid++;

    this.handler = one ? runAndRemove(this, handler) : handler;
  };

  // Internal methods
  var cache = {};

  var add = function(event) {
    if (!(event instanceof Event)) {
      return false;
    } else {
      if (!cache[event.name]) {
        cache[event.name] = [];
      }

      cache[event.name].push(event);

      return true;
    }
  };

  var remove = function(event, useUid) {
    var ret = false;
    var paramName = useUid ? 'uid' : 'namespace';
    var param = event[paramName];
    var subscriptions = cache[event.name];

    if (param) {
      for (var i = subscriptions.length; i--; i > 0) {
        if (subscriptions[i][paramName] === param) {
          subscriptions.splice(i);
          ret = true;
        }
      }

      if (!subscriptions.length) {
        delete cache[event.name];
      }
    } else {
      ret = delete cache[event.name];
    }

    return ret;
  };

  var runAndRemove = function(event, handler) {
    return function(data) {
      remove(event, true);
      handler(data);
    };
  };

  // Public
  var events = {};

  events.on = function(scope, signature, handler, one) {
    if (typeof handler !== 'function') {
      // log here
      return false;
    } else {
      return add(new Event(signature, scope, handler, one)) !== empty;
    }
  };

  events.one = function(scope, signature, handler) {
    return this.on(signature, handler, true);
  };

  events.off = function(scope, signature) {
    var event = new Event(signature, scope);

    if (!cache[event.name]) {
      // log here
      return false;
    } else {
      return remove(event, false);
    }
  };


  events.trigger = function(scope, signature, data) {
    var event = new Event(signature, scope);
    var subscriptions = cache[event.name];

    if (subscriptions) {
      for (var i = subscriptions.length; i--; i > 0) {
        subscriptions[i].handler(data);
      }

      return true;
    } else {
      return false;
    }
  };

  return events;
});
