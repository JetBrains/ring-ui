define(function() {
  'use strict';

  // Utils
  var utils = {};

  utils.isDeferred = function(obj) {
    return !!obj && typeof obj === 'object' && obj.hasOwnProperty('promise') && typeof obj.promise === 'function';
  };

  utils.isNode = function(obj) {
    return typeof Node === 'object' ? obj instanceof Node : obj && typeof obj === 'object' && typeof obj.nodeType === 'number';
  };

  utils.isEmptyString = function(str) {
    return str.replace(/\s+/, '') === '';
  };

  // Ported from jQuery to support contentEditable
  utils.isFocused = function(elem) {
    elem = elem[0] || elem;

    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex || elem.contentEditable === 'true');
  };

  //@exclude
  var debug = function() {
    return window.location.toString().indexOf('ring-debug') !== -1;
  };

  utils.log = function(message) {
    if (debug() && window['console'] && window['console']['log']) {
      console.log(message);
    }
  };
  //@endexclude

  utils.throttle = function(fn, threshhold, scope) {
    var last,
      deferTimer;
    threshhold = threshhold || 250;

    return function () {
      var context = scope || this;

      var now = +new Date(),
        args = arguments;
      if (last && now < last + threshhold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  };

  utils.uuid = function () {
    var d = new Date().getTime(),
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c==='x' ? r : (r&0x7|0x8)).toString(16);
        });
    return uuid;
  };

  return utils;
});