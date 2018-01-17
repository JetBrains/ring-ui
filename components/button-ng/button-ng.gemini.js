/* global gemini: false */

gemini.suite('Button Ng', suite => {
  suite.
    setUrl('button-ng/button-ng.html').
    setCaptureElements('body > div').
    ignoreElements({every: '[loader="true"]'}).
    capture('buttons');
});
