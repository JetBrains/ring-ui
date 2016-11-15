/* global gemini: false */

gemini.suite('Date Picker', () => {
  gemini.suite('Single date', child => {
    child.
      setUrl('/example-date-picker-single-date').
      setCaptureElements('#date-picker', '.ring-popup').
      capture('datePickerPopup', (actions, find) => {
        actions.click(find('button'));
      });
  });

  gemini.suite('Range', child => {
    child.
      setUrl('/example-date-picker-range').
      setCaptureElements('#date-picker', '.ring-popup').
      capture('datePickerPopup', (actions, find) => {
        actions.click(find('button'));
      });
  });

});
