/* global gemini: false */

gemini.suite('Icon', () => {
  gemini.suite('Example icons', suite => {
    suite.
      setUrl('icon/icon.html').
      setCaptureElements('#some-icons').
      capture('some icons');
  });

  gemini.suite('Icons in text', suite => {
    suite.
      setUrl('icon/icons-in-text.html').
      setCaptureElements('#some-icons').
      capture('icons in text');
  });

  gemini.suite('All icons', suite => {
    suite.
      setUrl('icon/icons-list.html').
      setCaptureElements('#all-icons').
      capture('all icons');
  });

  gemini.suite('All logos', suite => {
    suite.
      setUrl('icon/list-of-jet-brains-product-logos.html').
      setCaptureElements('#logos').
      capture('all logos');
  });
});
