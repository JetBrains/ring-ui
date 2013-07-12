define(['jquery'], function($) {
  'use strict';

  var ring = $.noop;
  var invoke = ring;
  var add = $.noop;
  var remove = $.noop;

  var on = $.noop;
  var trigger = $.noop;

  ring.invoke = invoke;
  ring.on = on;
  ring.trigger = trigger;
  ring.add = add;
  ring.remove = remove;

  return function() {
    return ring;
  };
});
