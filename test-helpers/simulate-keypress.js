/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var keyEvent = require('combokeys/test/lib/key-event');

module.exports = function (char, keyCode) {
  var charCode = char && char.charCodeAt(0) || 0;

  return keyEvent.simulate(charCode, keyCode || 0);
};
