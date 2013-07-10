define(['jquery'], function($) {
  'use strict';

  var ring = $.noop;
  var invoke = $.noop;

  ring.invoke = invoke;

  return function() {
    return ring;
  };
});
