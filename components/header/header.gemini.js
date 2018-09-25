/* global gemini: false */

gemini.suite('Header', () => {
  gemini.suite('Header', suite => {
    suite.
      setUrl('header/header.html').
      setCaptureElements('#header').
      capture('header');
  });

  gemini.suite('Header Light', suite => {
    suite.
      setUrl('header/light-header.html').
      setCaptureElements('#header').
      capture('header');
  });

  gemini.suite('Compact header', suite => {
    suite.
      setUrl('header/compact-header.html').
      setCaptureElements('#header').
      capture('header');
  });
});
