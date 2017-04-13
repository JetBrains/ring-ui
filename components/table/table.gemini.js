/* global gemini: false */

const UNHOVER_DELAY = 500;

gemini.suite('Table', suite => {
  suite.
    setUrl('/table/table.html').
    setCaptureElements('#demo').
    capture('table', (actions, find) => {
      actions.click(find('[data-test=ring-table-cell]:first-child'));
      actions.wait(UNHOVER_DELAY);
    });
});

