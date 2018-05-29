/* global gemini: false */

gemini.suite('Radio button', () => {
  gemini.suite('Controlled', suite => {
    suite.
      setUrl('radio/controlled.html').
      setCaptureElements('#container').
      capture('radio button');
  });

  gemini.suite('Uncontrolled', suite => {
    suite.
      setUrl('radio/uncontrolled.html').
      setCaptureElements('#container').
      capture('radio button');
  });

  gemini.suite('Disabled', suite => {
    suite.
      setUrl('radio/disabled.html').
      setCaptureElements('#container').
      capture('radio button');
  });
});
