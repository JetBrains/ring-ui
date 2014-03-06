define(['jquery', 'global/global__utils'], function($, utils) {
  'use strict';

  // Event constructor
  var uid = 1;
  var events = {
    EVENTS_DELIM: ' ',
    NAMESPACE_DELIM: '::',
    MODULE_DELIM: ':',
    EVENT_SELECTOR: '.ring-js-event',
    EVENT_DATA_ATTR: 'ring-event',
    DEFAULT_EVENT: 'click'
  };


  var parseSignature = function(signature, module, handler, one) {
    if (typeof signature !== 'string') {
      utils.log('Event was not bound, signature is not string');
      return false;
    }

    var eventsList = $.map(signature.split(events.EVENTS_DELIM), function(eventSignature) {
      var event = {};

      if (!module.global) {
        eventSignature = module.name + events.MODULE_DELIM + eventSignature;
      }

      var parts = eventSignature.split(events.NAMESPACE_DELIM);

      event.name = parts[0];
      event.namespace = parts[1] || null;
      event.uid = uid++;

      if (handler) {
        event.handler = one ? runAndRemove(event, handler) : handler;
      }

      return event;
    });

    return eventsList;
  };


  // Internal methods
  var cache = {};

  var add = function(eventsList) {
    if (!eventsList[0]) {
      return false;
    }

    for (var event, i = eventsList.length - 1; i >= 0; i--) {
      event = eventsList[i];

      if (!cache[event.name]) {
        cache[event.name] = [];
      }

      utils.log('Event "' + event.name + '" was bound');
      cache[event.name].push(event);
    }

    return true;
  };

  var remove = function(event, useUid) {
    var ret = false;
    var paramName = useUid ? 'uid' : 'namespace';
    var param = event[paramName];
    var subscriptions = cache[event.name];

    if (param) {
      for (var i = subscriptions.length - 1; i >= 0; i--) {
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
  var methods = {};

  methods.on = function(scope, signature, handler, one) {
    if (typeof handler !== 'function') {
      utils.log('Event "' + event.name + '" was not bound. Handler is not a function.');
      return false;
    } else {
      return add(parseSignature(signature, scope, handler, one));
    }
  };

  methods.one = function(scope, signature, handler) {
    return this.on(signature, handler, true);
  };

  methods.off = function(scope, signature) {
    var ret = false;
    var eventsList = parseSignature(signature, scope);

    for (var event, i = eventsList.length - 1; i >= 0; i--) {
      event = eventsList[i];

      if (!cache[event.name]) {
        utils.log('There is no event "' + event.name + '" to unbind');
      } else {
        utils.log('Event "' + event.name + '" was unbound');
        ret = remove(event, false);
      }
    }

    return ret;
  };

  methods.when = function(scope, signature) {
    var dfd = $.Deferred();

    this.on(signature, $.proxy(dfd, 'resolve'), true);

    return dfd;
  };

  methods.trigger = function(scope, signature, data, e) {
    var ret = true;
    var event = parseSignature(signature, scope)[0];
    var subscriptions = cache[event.name];

    utils.log('Event triggered: ' + (scope.global ? 'root:' : '') + event.name);

    if (subscriptions) {
      for (var i = subscriptions.length; i--; i > 0) {
        ret = subscriptions[i].handler(data, e);
      }
    }

    return ret;
  };

  methods.stateTrigger = function(scope, method, state) {
    var signature = method + events.MODULE_DELIM + state;
    var trigger = this.trigger;

    return function(result) {
      trigger(signature, result);
    };
  };

  var eventsMap = {
    'mouseenter': 'hover',
    'mouseleave': 'hover'
  };

  // Events from DOM
  var domEventHandler = function(e) {
    var $target = $(e.currentTarget);
    var type = eventsMap[e.type] || e.type || events.DEFAULT_EVENT;
    var storedEvents = $target.data(events.EVENT_DATA_ATTR);

    var fire = function(event) {
      if (event && (!event.type && type === events.DEFAULT_EVENT || event.type === type)) {
        return methods.trigger({global: true}, event.name || event, event.data, e);
      }
    };

    if ($.isArray(storedEvents)) {
      return $.map(storedEvents, fire).pop();
    } else {
      return fire(storedEvents);
    }
  };

  // Using delegate because of compatibility with YouTrack's jQuery 1.5.1
  $(document).delegate(events.EVENT_SELECTOR, 'click.ring-event', domEventHandler);

  events.methods = methods;
  events.domEventHandler = domEventHandler;

  return events;
});
