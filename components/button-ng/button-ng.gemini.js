/* global gemini: false */

gemini.suite('Button Ng', suite => {
  suite.
    setUrl('/button-ng/button-ng.html').
    setCaptureElements('body > div').
    capture('buttons', actions => {
      actions.executeJS(function disableLoadingButtons() {
        // ignore is too slow on IE
        Array.prototype.forEach.call(
          document.querySelectorAll('.ring-button_loader'),
          function removeClass(node) {
            node.classList.remove('ring-button_loader');
          }
        );
      });
    });
});
