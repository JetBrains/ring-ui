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

  gemini.suite('Low header', suite => {
    suite.
      setUrl('header/low-header.html').
      setCaptureElements('#header').
      capture('header');
  });
});
