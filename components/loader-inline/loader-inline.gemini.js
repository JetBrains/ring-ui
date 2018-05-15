/* global gemini: false */

gemini.suite('Loader inline', () => {
  gemini.suite('White background', suite => {
    suite.
      setUrl('loader-inline/inline-loader.html?block-animations').
      setCaptureElements('body').
      capture('loader');
  });

  gemini.suite('Black background', suite => {
    suite.
      setUrl('loader-inline/inline-loader-on-black-background.html?block-animations').
      setCaptureElements('body').
      capture('loader');
  });

  gemini.suite('Custom background', suite => {
    suite.
      setUrl('loader-inline/inline-loader-on-custom-background.html?block-animations').
      setCaptureElements('body').
      capture('loader');
  });

  gemini.suite('Without React', suite => {
    suite.
      setUrl('loader-inline/inline-loader-without-react.html?block-animations').
      setCaptureElements('body').
      capture('loader');
  });
});
