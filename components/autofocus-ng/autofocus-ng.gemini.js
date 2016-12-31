/* global gemini: false */

gemini.suite('Autofocus Ng', () => {
  gemini.suite('input', child => {
    child.
      setUrl('/autofocus-ng/autofocus-ng.html').
      setCaptureElements('input[rg-autofocus]').
      capture('autofocused-input');
  });

  gemini.suite('select', child => {
    child.
      setUrl('/autofocus-ng/autofocus-on-select.html').
      setCaptureElements('.ring-select').
      capture('autofocused-select');
  });
});
