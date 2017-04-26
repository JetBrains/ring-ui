/* global gemini: false */

gemini.suite('Query Assist', suite => {
  suite.
    setUrl('/query-assist/query-assist-no-auth.html').
    setCaptureElements('#query-assist').
    capture('default');

  gemini.suite('with popup', child => {
    child.
      setCaptureElements(['#query-assist', '[data-test=ring-query-assist-popup]']).
      capture('focused', (actions, find) => {
        actions.click(find('[data-test=ring-query-assist-input]'));
        actions.executeJS(function hideCaret() {
          document.querySelector('[data-test=ring-query-assist-input]').style = 'color: transparent;';
        });
        actions.waitForElementToShow('[data-test=ring-query-assist-popup]');
      }).
      capture('input', (actions, find) => {
        actions.sendKeys(find('[data-test=ring-query-assist-input]'), 'test ');
        actions.executeJS(function hideCaret() {
          document.querySelector('[data-test=ring-query-assist-last-letter]').style = 'color: transparent;';
        });
        actions.waitForElementToShow('[data-test=ring-query-assist-popup]');
      });
  });
});
