/* global gemini: false */

const UNHOVER_DELAY = 500;

gemini.suite('Dropdown', () => {
  gemini.suite('Simple', suite => {
    suite.
      setUrl('/dropdown/dropdown.html').
      setCaptureElements('#dropdown', '[data-test=ring-popup]').
      capture('dropdown', (actions, find) => {
        actions.click(find('[data-test=ring-dropdown]'));
        actions.mouseMove(find('[data-test=ring-popup]'), [1, 1]);
        actions.wait(UNHOVER_DELAY);
      });
  });

  gemini.suite('Custom', suite => {
    suite.
      setUrl('/dropdown/dropdown-with-custom-anchor-and-popup.html').
      setCaptureElements('#dropdown', '[data-test=ring-popup]').
      capture('dropdown', (actions, find) => {
        actions.click(find('[data-test=ring-dropdown]'));
        actions.mouseMove(find('[data-test=ring-popup]'), [1, 1]);
        actions.focus(find('[data-test=ring-popup]'));
        actions.wait(UNHOVER_DELAY);
      });
  });
});
