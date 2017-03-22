/* global gemini: false */

gemini.suite('Heading', suite => {
  suite.
    setUrl('/heading/heading.html').
    setCaptureElements('#heading').
    capture('heading');
});
