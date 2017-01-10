/* global gemini: false */

gemini.suite('Select', () => {
  gemini.suite('Input based select', child => {
    child.
      setUrl('/select/simple-input-based-select.html').
      setCaptureElements('.ring-select', '.ring-popup').
      capture('selectPopup', (actions, find) => {
        actions.click(find('.ring-input'));
      });
  });

  gemini.suite('Select button', child => {
    child.
      setUrl('/select/select-with-a-customized-filter-and-an-add-item-button.html').
      setCaptureElements('.ring-select').
      capture('button');
  });

  gemini.suite('Select with filter', child => {
    child.
      setUrl('/select/simple-select-with-the-default-filter-mode.html').
      setCaptureElements('.ring-select', '.ring-popup').
      capture('selectPopup', (actions, find) => {
        actions.click(find('.ring-select'));
        actions.click(find('.ring-popup .ring-input'));
      });
  });

  gemini.suite('Multivalue select with options descriptions', child => {
    child.
      setUrl('/select/multiple-select-with-a-description.html').
      setCaptureElements('.ring-popup').
      capture('selectPopup', (actions, find) => {
        actions.click(find('.ring-button'));
      });
  });

});
