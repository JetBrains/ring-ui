/* global gemini: false */

gemini.suite('Avatar', suite => {
  suite.
    setUrl('/avatar/avatar.html').
    setCaptureElements('#avatar').
    ignoreElements({every: '.avatar-demo > :first-child'}).
    capture('avatar');
});
