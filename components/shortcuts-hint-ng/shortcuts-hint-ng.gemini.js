/* global gemini: false */

gemini.suite('Shortcuts hint popup', suite => {
  suite.
    setUrl('/shortcuts-hint-ng/shortcuts-ng-hint-popup.html').
    setCaptureElements('[data-test=ring-dialog]').
    capture('dialog', actions => {
      // Supports Edge
      // eslint-disable-next-line prefer-arrow-callback
      actions.waitForJSCondition(function () {
        return document.querySelector('[data-test=ring-dialog]') !== null;
      });
    });
});
