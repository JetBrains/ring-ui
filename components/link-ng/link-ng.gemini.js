/* global gemini: false */

gemini.suite('LinkNg', suite => {
  suite.
    setUrl('/example-link-ng/').
    setCaptureElements('#link').
    capture('link-ng');
});
