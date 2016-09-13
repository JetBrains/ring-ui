/* global gemini: false */

gemini.suite('Icon', () => {
  gemini.suite('Example icons', suite => {
    suite.
      setUrl('/example-icon/').
      setCaptureElements('#some-icons').
      capture('some icons');
  });

  gemini.suite('All icons', suite => {
    suite.
      setUrl('/example-icons-list/').
      setCaptureElements('#all-icons').
      capture('all icons');
  });
});
