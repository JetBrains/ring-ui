/* global gemini: false */

gemini.suite('Pager', suite => {
  suite.
    setUrl('pager/pager-with-a-page-size-selector.html').
    setCaptureElements('#pager').
    capture('pager');
});
