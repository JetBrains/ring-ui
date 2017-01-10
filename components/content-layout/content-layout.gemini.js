/* global gemini: false */

gemini.suite('Content Layout', suite => {
  suite.
    setUrl('/content-layout/content-layout.html').
    setCaptureElements('#example').
    capture('content-layout');
});

gemini.suite('Content Layout with sidebar on the left', suite => {
  suite.
    setUrl('/content-layout/content-layout-with-sidebar-on-the-left.html').
    setCaptureElements('#example').
    capture('content-layout-with-sidebar-on-the-left');
});

gemini.suite('Content Layout with sidebar on the right', suite => {
  suite.
    setUrl('/content-layout/content-layout-with-sidebar-on-the-right.html').
    setCaptureElements('#example').
    capture('content-layout-with-sidebar-on-the-right');
});
