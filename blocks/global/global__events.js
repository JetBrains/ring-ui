define(['jquery', 'global/global__utils'], function($, utils) {
  'use strict';

  // Event constructor
  var uid = 1;
  var empty = {};

  // TODO Use separate signature parser
  var Event = function(signature, module, handler, one) {
    if (typeof signature !== 'string') {
      utils.log('Event was not bound, signature is not string');
      return empty;
    }

    if (!module.global) {
      signature = module.name + Event.MODULE_DELIM + signature;
    }

    var parts = signature.split(Event.NAMESPACE_DELIM);

    this.name = parts[0];
    this.namespace = parts[1] || null;
    this.uid = uid++;

    this.handler = one ? runAndRemove(this, handler) : handler;
  };

  Event.NAMESPACE_DELIM = '::';
  Event.MODULE_DELIM = ':';
  Event.SELECTOR = '.ring-js-event';
  Event.DATA = 'ring-event';

  // Internal methods
  var cache = {};

  var add = function(event) {
    if (event === empty) {
      return false;
    }

    if (!cache[event.name]) {
      cache[event.name] = [];
    }

    utils.log('Event "' + event.name + '" was bound');
    cache[event.name].push(event);

    return true;
  };

  var remove = function(event, useUid) {
    var ret = false;
    var paramName = useUid ? 'uid' : 'namespace';
    var param = event[paramName];
    var subscriptions = cache[event.name];

    if (param) {
      for (var i = subscriptions.length; i--; i > 0) {
        if (subscriptions[i][paramName] === param) {
          subscriptions.splice(i, 1);
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
      utils.log('Event "' + event.name + '" was not bound. Handler is not a function.');
      return false;
    } else {
      return add(new Event(signature, scope, handler, one));
    }
  };

  events.one = function(scope, signature, handler) {
    return this.on(signature, handler, true);
  };

  events.off = function(scope, signature) {
    var event = new Event(signature, scope);

    if (!cache[event.name]) {
      utils.log('There is no event "' + event.name + '" to unbind');
      return false;
    } else {
      utils.log('Event "' + event.name + '" was unbound');
      return remove(event, false);
    }
  };

  events.trigger = function(scope, signature, data) {
    var ret = true;
    var event = new Event(signature, scope);
    var subscriptions = cache[event.name];

    utils.log('Event triggered: ' + (scope.global && 'root:'|| '') + event.name);

    if (subscriptions) {
      for (var i = subscriptions.length; i--; i > 0) {
        ret = subscriptions[i].handler(data);
      }
    }

    return ret;
  };

  events.stateTrigger = function(scope, method, state) {
    var signature = method + Event.MODULE_DELIM + state;
    var trigger = this.trigger;

    return function(result) {
      trigger(signature, result);
    };
  };

  Event.events = events;

  // Events from DOM
  var handler = function(e) {
    var $target = $(e.currentTarget);
    var event = $target.data(Event.DATA);

    if (typeof event === 'object') {
      return events.trigger({global: true}, event.name, event.data);
    } else {
      return events.trigger({global: true}, event);
    }
  };

  // Using delegate because of compatibility with YouTrack's jQuery 1.5.1
  $(document).delegate(Event.SELECTOR, 'click.ring.event', handler);

  return Event;
});
