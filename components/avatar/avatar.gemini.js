/* global gemini: false */

gemini.suite('Avatar', suite => {
  suite.
    setUrl('/avatar/avatar.html').
    setCaptureElements('#avatar').
    capture('avatar');
});
