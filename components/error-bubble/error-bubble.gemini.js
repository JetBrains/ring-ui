/* global gemini: false */

gemini.suite('Error Bubble', () => {
  gemini.suite('Error Bubble', child => {
    child.
      setUrl('error-bubble/error-bubble.html').
      setCaptureElements('#container').
      capture('error bubble');
  });

  gemini.suite('Error Bubble in dialog form', child => {
    child.
      setUrl('error-bubble/error-bubble-in-dialog-form.html').
      setCaptureElements('[data-test~="ring-dialog"]').
      capture('error bubble');
  });
});
