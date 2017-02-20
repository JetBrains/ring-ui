/* global gemini: false */

gemini.suite('Header', suite => {
  suite.
    setUrl('/header/header.html').
    setCaptureElements('#header').
    capture('header');
});
