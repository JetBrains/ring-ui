import gemini from 'gemini';

gemini.suite('Select', () => {
  gemini.suite('Input based select', child => {
    child.
      setUrl('/example-simple-input-based-select').
      setCaptureElements('.ring-select', '.ring-popup').
      capture('selectPopup', (actions, find) => {
        actions.click(find('.ring-input'));
      });
  });

  gemini.suite('Select button', child => {
    child.
      setUrl('/example-select-with-customized-filter-and-an-add-item-button').
      setCaptureElements('.ring-select').
      capture('button');
  });

  gemini.suite('Select with filter', child => {
    child.
      setUrl('/example-simple-select-with-default-filter-mode').
      setCaptureElements('.ring-select', '.ring-popup').
      capture('selectPopup', (actions, find) => {
        actions.click(find('.ring-select'));
        actions.click(find('.ring-popup .ring-input'));
      });
  });

  gemini.suite('Multivalue select with options descriptions', child => {
    child.
      setUrl('/example-multiple-select-with-description').
      setCaptureElements('.ring-popup').
      capture('selectPopup', (actions, find) => {
        actions.click(find('.ring-button'));
      });
  });

});
