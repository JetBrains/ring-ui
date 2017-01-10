/* global gemini: false */
/* eslint-disable prefer-reflect, prefer-arrow-callback */

gemini.suite('Button Ng', suite => {
  suite.
    setUrl('/button-ng/button-ng.html').
    setCaptureElements('body > div').
    capture('buttons', actions => {
      actions.executeJS(function () {
        // Disable loading buttons (ignore is too slow on IE)
        Array.prototype.forEach.call(document.querySelectorAll('.ring-button_loader'), function (node) {
          node.classList.remove('ring-button_loader');
        });
      });
    });
});
