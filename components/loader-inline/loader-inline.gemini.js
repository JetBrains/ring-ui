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
      setUrl('loader-inline/inline-loader-on-non-white-background.html?block-animations').
      setCaptureElements('body').
      capture('loader');
  });
});
