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

  utils.now = function () {
    return +(new Date());
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

  return utils;
});