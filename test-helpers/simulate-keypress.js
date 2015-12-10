/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var keyEvent = require('imports?window=>{}!exports?window.KeyEvent!mousetrap/tests/libs/key-event');

// Dirty hack for mousetrap/tests/libs/key-event.js and IE
// See https://github.com/ccampbell/mousetrap/blob/1.4.6/tests/libs/key-event.js#L21
document.createEventObject = null;

module.exports = function (char, keyCode) {
  var charCode = char && char.charCodeAt(0) || 0;

  return keyEvent.simulate(charCode, keyCode || 0);
};
