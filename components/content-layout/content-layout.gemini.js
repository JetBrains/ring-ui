/* global gemini: false */

gemini.suite('Content Layout', suite => {
  suite.
    setUrl('/example-content-layout/').
    setCaptureElements('#example').
    capture('content-layout');
});

gemini.suite('Content Layout with sidebar on the left', suite => {
  suite.
    setUrl('/example-content-layout-with-sidebar-on-the-left/').
    setCaptureElements('#example').
    capture('content-layout-with-sidebar-on-the-left');
});

gemini.suite('Content Layout with sidebar on the right', suite => {
  suite.
    setUrl('/example-content-layout-with-sidebar-on-the-right/').
    setCaptureElements('#example').
    capture('content-layout-with-sidebar-on-the-right');
});
