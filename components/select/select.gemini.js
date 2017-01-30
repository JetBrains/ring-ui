/* global gemini: false */

const FOCUS_DELAY = 500;

gemini.suite('Select', () => {
  gemini.suite('Input based select', child => {
    child.
      setUrl('/select/simple-input-based-select.html').
      setCaptureElements('[data-test=ring-select]', '[data-test=ring-popup]').
      capture('selectPopup', (actions, find) => {
        actions.click(find('[data-test=ring-input]'));
        actions.wait(FOCUS_DELAY);
      });
  });

  gemini.suite('Select button', child => {
    child.
      setUrl('/select/select-with-a-customized-filter-and-an-add-item-button.html').
      setCaptureElements('[data-test=ring-select]').
      capture('button');
  });

  gemini.suite('Select with filter', child => {
    child.
      setUrl('/select/simple-select-with-the-default-filter-mode.html').
      setCaptureElements('[data-test=ring-select]', '[data-test=ring-popup]').
      capture('selectPopup', (actions, find) => {
        actions.click(find('[data-test=ring-select]'));
        actions.click(find('[data-test=ring-popup] input'));
        actions.wait(FOCUS_DELAY);
      });
  });

  gemini.suite('Multivalue select with options descriptions', child => {
    child.
      setUrl('/select/multiple-select-with-a-description.html').
      setCaptureElements('[data-test=ring-popup]').
      capture('selectPopup', (actions, find) => {
        actions.click(find('[data-test=ring-select]'));
      });
  });

});
