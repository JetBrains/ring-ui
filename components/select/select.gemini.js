/* global gemini: false */

const UNHOVER_DELAY = 500;

gemini.suite('Select', () => {
  gemini.suite('Input based select', child => {
    child.
      setUrl('select/simple-input-based-select.html').
      setCaptureElements('[data-test=ring-select]', '[data-test~=ring-popup]').
      capture('selectPopup', (actions, find) => {
        actions.click(find('[data-test=ring-input]'));
        actions.mouseMove(find('body'), {x: 800, y: 1024});
        actions.wait(UNHOVER_DELAY);
      });
  });

  gemini.suite('Select button', child => {
    child.
      setUrl('select/select-with-a-customized-filter-and-an-add-item-button.html').
      setCaptureElements('[data-test=ring-select]', '[data-test~=ring-popup]').
      capture('selectPopup', (actions, find) => {
        actions.click(find('[data-test=ring-select]'));
        actions.mouseMove(find('body'), {x: 800, y: 1024});
        actions.wait(UNHOVER_DELAY);
      }).
      capture('after clear', (actions, find) => {
        actions.click(find('[data-test=ring-input-clear]'));
      });
  });

  gemini.suite('Select with filter', child => {
    child.
      setUrl('select/simple-select-with-default-filter-mode-enabled.html').
      setCaptureElements('[data-test=ring-select]', '[data-test~=ring-popup]').
      capture('selectPopup', (actions, find) => {
        actions.click(find('[data-test=ring-select]'));
        actions.mouseMove(find('body'), {x: 800, y: 1024});
        actions.wait(UNHOVER_DELAY);
      });
  });

  gemini.suite('Inline select', child => {
    child.
      setUrl('select/inline-select-with-a-filter.html').
      setCaptureElements('[data-test=ring-select]', '[data-test~=ring-popup]').
      capture('selectPopup', (actions, find) => {
        actions.click(find('[data-test=ring-select]'));
        actions.mouseMove(find('body'), {x: 800, y: 1024});
        actions.wait(UNHOVER_DELAY);
      });
  });

  gemini.suite('Inline select (opens to left)', child => {
    child.
      setUrl('select/inline-select-opens-to-left.html').
      setCaptureElements('[data-test=ring-select]', '[data-test~=ring-popup]').
      capture('selectPopup', (actions, find) => {
        actions.click(find('[data-test=ring-select]'));
        actions.mouseMove(find('body'), {x: 800, y: 1024});
        actions.wait(UNHOVER_DELAY);
      });
  });

  gemini.suite('Multi-value select with options descriptions', child => {
    child.
      setUrl('select/multiple-select-with-a-description.html').
      skip('ie', 'Disabled in IE because of weird rendering artefact').
      setCaptureElements('[data-test~=ring-popup]').
      capture('selectPopup', (actions, find) => {
        actions.click(find('[data-test=ring-select]'));
        actions.mouseMove(find('body'), {x: 800, y: 1024});
        actions.wait(UNHOVER_DELAY);
      });
  });

});
