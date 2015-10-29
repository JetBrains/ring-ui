var keyEvent = require('imports?window=>{}!exports?window.KeyEvent!mousetrap/tests/libs/key-event');

module.exports = function (char, keyCode) {
  var charCode = char && char.charCodeAt(0) || 0;

  return keyEvent.simulate(charCode, keyCode || 0);
};
