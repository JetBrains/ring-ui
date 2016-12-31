/* global gemini: false */

gemini.suite('Pager', suite => {
  suite.
    setUrl('/pager/pager.html').
    setCaptureElements('#pager').
    capture('pager');
});
