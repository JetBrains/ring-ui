define(['jquery'], function($) {
  'use strict';

  // Utils
  var utils = {};

  // Ported from Chai as Promised
  utils.isDeferred = function(obj) {
    return obj != null &&
      typeof obj.always === 'function' &&
      typeof obj.done === 'function' &&
      typeof obj.fail === 'function' &&
      typeof obj.pipe === 'function' &&
      typeof obj.progress === 'function' &&
      typeof obj.state === 'function';
  };

  utils.isPromise = function(obj) {
    return obj != null && typeof obj.then === 'function';
  };

  utils.wrapPromise = function(obj) {
    if (utils.isPromise(obj) && !utils.isDeferred(obj)) {
      var dfd = $.Deferred();

      obj.then(function(result) {
        dfd.resolve(result);
      }, function(error) {
        dfd.reject(error);
      });

      return dfd.promise();
    }

    return $.when(obj);
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