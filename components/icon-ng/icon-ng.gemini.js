/* global gemini: false */
/* eslint-disable prefer-reflect, prefer-arrow-callback */

gemini.suite('Icon Ng', suite => {
  suite.
    setUrl('/icon-ng/icon-ng.html').
    setCaptureElements('body > div').
    capture('icons', actions => {
      actions.executeJS(function () {
        // Disable loading buttons (ignore is too slow on IE)
        Array.prototype.forEach.call(document.querySelectorAll('.ring-icon_loading'), function (node) {
          node.classList.remove('ring-icon_loading');
        });
      });
    });
});
