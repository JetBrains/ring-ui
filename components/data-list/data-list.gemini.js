/* global gemini: false */

gemini.suite('Data List', suite => {
  suite.
  setUrl('/data-list/data-list.html').
    setCaptureElements('#data-list').
    capture('data-list');
});
