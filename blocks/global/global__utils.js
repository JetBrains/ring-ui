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

  utils.log = function(message) {
    //@exclude
    if (window['console'] && window['console']['log']) {
      console.log(message);
    }
    //@endexclude
  };

  return utils;
});