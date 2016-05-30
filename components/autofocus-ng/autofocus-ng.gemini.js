import gemini from 'gemini';

gemini.suite('Autofocus', () => {
  gemini.suite('On input', child => {
    child.
      setUrl('/example-autofocus').
      setCaptureElements('input[rg-autofocus]').
      capture('autofocused-input');
  });

  gemini.suite('On select', child => {
    child.
      setUrl('/example-autofocus-on-select').
      setCaptureElements('.ring-select').
      capture('autofocused-select');
  });
});
