/* global gemini: false */

gemini.suite('Dropdown', suite => {
  suite.
    setUrl('/dropdown/dropdown.html').
    setCaptureElements('#dropdown', '[data-test=ring-popup]').
    capture('dropdown', (actions, find) => {
      actions.click(find('[data-test=ring-dropdown]'));
    });
});

gemini.suite('Custom', suite => {
  suite.
    setUrl('/dropdown/dropdown-with-custom-anchor-and-popup.html').
    setCaptureElements('#dropdown', '[data-test=ring-popup]').
    capture('dropdown', (actions, find) => {
      actions.click(find('[data-test=ring-dropdown]'));
    });
});
