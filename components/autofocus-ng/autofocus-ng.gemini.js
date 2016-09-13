/* global gemini: false */

gemini.suite('Autofocus Ng', () => {
  gemini.suite('input', child => {
    child.
      setUrl('/example-autofocus-ng').
      setCaptureElements('input[rg-autofocus]').
      capture('autofocused-input');
  });

  gemini.suite('select', child => {
    child.
      setUrl('/example-autofocus-on-select').
      setCaptureElements('.ring-select').
      capture('autofocused-select');
  });
});
