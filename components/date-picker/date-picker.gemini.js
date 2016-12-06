/* global gemini: false */

gemini.suite('Date Picker', () => {
  gemini.suite('Single date', child => {
    child.
      setUrl('/example-date-picker-single-date').
      setCaptureElements('#date-picker', '.ring-popup').
      capture('datePickerPopup', (actions, find) => {
        actions.click(find('button'));
        actions.mouseMove(find('body'), [0, 0]);
      });
  });

  gemini.suite('Range', child => {
    child.
      setUrl('/example-date-picker-range').
      setCaptureElements('#date-picker', '.ring-popup').
      capture('datePickerPopup', (actions, find) => {
        actions.click(find('button'));
        actions.mouseMove(find('body'), [0, 0]);
      });
  });

  gemini.suite('Clearable', child => {
    child.
      setUrl('/example-date-picker-clearable').
      setCaptureElements('#date-picker', '.ring-popup').
      capture('datePickerPopup', (actions, find) => {
        actions.click(find('button'));
        actions.mouseMove(find('body'), [0, 0]);
      });
  });

});
