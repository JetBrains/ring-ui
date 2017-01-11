/* global gemini: false */

const UNHOVER_DELAY = 500;

gemini.suite('Date Picker', () => {
  gemini.suite('Single date', child => {
    child.
      setUrl('/date-picker/date-picker-single-date.html').
      setCaptureElements('#date-picker', '.test-popup').
      capture('datePickerPopup', (actions, find) => {
        actions.click(find('button'));
        actions.mouseMove(find('body'), [0, 0]);
        actions.wait(UNHOVER_DELAY);
      });
  });

  gemini.suite('Range', child => {
    child.
      setUrl('/date-picker/date-picker-range.html').
      setCaptureElements('#date-picker', '.test-popup').
      capture('datePickerPopup', (actions, find) => {
        actions.click(find('button'));
        actions.mouseMove(find('body'), [0, 0]);
        actions.wait(UNHOVER_DELAY);
      });
  });

  gemini.suite('Clearable', child => {
    child.
      setUrl('/date-picker/date-picker-clearable.html').
      setCaptureElements('#date-picker', '.test-popup').
      capture('datePickerPopup', (actions, find) => {
        actions.click(find('button'));
        actions.mouseMove(find('body'), [0, 0]);
        actions.wait(UNHOVER_DELAY);
      });
  });

});
