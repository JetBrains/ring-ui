'use strict';

var LocalStorage = require('./storage_local.js');
var FallbackStorage = require('./storage_fallback.js');

/**
 * @constructor
 * @extends {LocalStorage}
 */
var Storage = LocalStorage;

// Using try/catch here because of IE10+ protected mode and other browsers' quirks
// See https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
try {
  var temp = 'testStorage';
  localStorage.setItem(temp, temp);
  localStorage.removeItem(temp);
} catch(e) {
  Storage = FallbackStorage;
}

module.exports = Storage;