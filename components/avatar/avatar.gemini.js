/* global gemini: false */

gemini.suite('Avatar', suite => {
  suite.
    setUrl('/avatar/avatar.html').
    setCaptureElements('#avatar').
    ignoreElements({every: 'img:first-of-type'}).
    capture('avatar');
});
