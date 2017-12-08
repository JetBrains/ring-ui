/* global gemini: false */

gemini.suite('Heading', suite => {
  suite.
    setUrl('heading/headings-1-to-5.html').
    setCaptureElements('#heading').
    capture('heading');
});
