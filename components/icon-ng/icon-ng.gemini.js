/* global gemini: false */

gemini.suite('Icon Ng', suite => {
  suite.
    setUrl('/icon-ng/icon-ng.html').
    setCaptureElements('body > div').
    capture('icons', actions => {
      actions.executeJS(function disableLoadingButtons() {
        // ignore is too slow on IE
        Array.prototype.forEach.call(
          document.querySelectorAll('.ring-icon_loading'),
          function removeClass(node) {
            node.classList.remove('ring-icon_loading');
          }
        );
      });
    });
});
