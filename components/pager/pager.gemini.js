/* global gemini: false */

gemini.suite('Pager', suite => {
  suite.
    setUrl('/example-pager/').
    setCaptureElements('#pager').
    capture('pager');
});
