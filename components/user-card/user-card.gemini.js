/* global gemini: false */

gemini.suite('UserCard', suite => {
  suite.
    setUrl('user-card/user-card.html').
    setCaptureElements('[data-test="user-card-inline"]').
    ignoreElements('img').
    capture('user card');
});
