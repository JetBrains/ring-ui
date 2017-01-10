/* global gemini: false */

gemini.suite('Icon', () => {
  gemini.suite('Example icons', suite => {
    suite.
      setUrl('/icon/icon.html').
      setCaptureElements('#some-icons').
      capture('some icons');
  });

  gemini.suite('All icons', suite => {
    suite.
      setUrl('/icon/icons-list.html').
      setCaptureElements('#all-icons').
      capture('all icons');
  });
});
