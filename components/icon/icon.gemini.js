/* global gemini: false */

gemini.suite('Icon', () => {
  gemini.suite('Example icons', suite => {
    suite.
      setUrl('/icon.html').
      setCaptureElements('#some-icons').
      capture('some icons');
  });

  gemini.suite('All icons', suite => {
    suite.
      setUrl('/icons-list.html').
      setCaptureElements('#all-icons').
      capture('all icons');
  });

  gemini.suite('All logos', suite => {
    suite.
      setUrl('/icon/list-of-jet-brains-product-logos.html').
      setCaptureElements('#logos').
      capture('all logos');
  });
});
