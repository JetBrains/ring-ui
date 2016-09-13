/* global gemini: false */

gemini.suite('Checkbox', parent => {
  parent.setUrl('/example-checkbox/');

  gemini.suite('Base checkboxes', child => {
    child.
      setCaptureElements('#checkbox-base').
      capture('base checkboxes');
  });

  gemini.suite('Additional checkboxes', child => {
    child.
      setCaptureElements('#checkbox-additional').
      capture('additional checkboxes');
  });
});
