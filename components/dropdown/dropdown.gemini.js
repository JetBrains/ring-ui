/* global gemini: false */

gemini.suite('Dropdown', () => {
  gemini.suite('Simple', suite => {
    suite.
      setUrl('/dropdown/dropdown.html').
      setCaptureElements('[data-test=ring-dropdown]', '[data-test=ring-popup]').
      capture('dropdown', (actions, find) => {
        actions.click(find('[data-test=ring-dropdown]'));
        actions.mouseMove(find('body'), [0, 0]);
      });
  });

  gemini.suite('Custom', suite => {
    suite.
      setUrl('/dropdown/dropdown-with-custom-anchor-and-popup.html').
      setCaptureElements('[data-test=ring-dropdown]', '[data-test=ring-popup]').
      capture('dropdown', (actions, find) => {
        actions.click(find('[data-test=ring-dropdown]'));
      });
  });
});
