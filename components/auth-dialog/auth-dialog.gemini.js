/* global gemini: false */

gemini.suite('AuthDialog', suite => {
  suite.
    setUrl('/auth-dialog/auth-dialog.html').
    setCaptureElements('*[data-test=ring-dialog]').
    capture('auth-dialog');
});
