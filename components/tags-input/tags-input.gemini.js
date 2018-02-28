/* global gemini: false */

gemini.suite('TagsInput', suite => {
  suite.
    setUrl('tags-input/tags-input.html').
    setCaptureElements('body', '[data-test=ring-popup]').
    capture('tags-input').
    capture('tags-input-dropdown', (actions, find) => {
      actions.click(find('[data-test=ring-select__focus]'));
      actions.sendKeys(find('[data-test=ring-select__focus]'), 'test');
      actions.waitForElementToShow('[data-test=ring-popup]');
    });
});
