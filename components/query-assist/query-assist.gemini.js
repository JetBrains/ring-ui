/* global gemini: false */

gemini.suite('Query Assist', suite => {
  suite.
    setUrl('/query-assist/query-assist-no-auth.html').
    setCaptureElements('#query-assist').
    capture('default');

  gemini.suite('with popup', child => {
    child.
      setCaptureElements(['#query-assist', '.ring-popup']).
      capture('focused', (actions, find) => {
        actions.click(find('.ring-query-assist__input'));
        // eslint-disable-next-line prefer-arrow-callback
        actions.executeJS(function hideCaret() {
          document.querySelector('[data-test=ring-query-assist-input]').style = 'color: transparent;';
        });
        actions.waitForElementToShow('.ring-popup');
      }).
      capture('input', (actions, find) => {
        actions.sendKeys(find('.ring-query-assist__input'), 'test ');
        // eslint-disable-next-line prefer-arrow-callback
        actions.executeJS(function hideCaret() {
          document.querySelector('[data-test=ring-query-assist-last-letter]').style = 'color: transparent;';
        });
        actions.waitForElementToShow('.ring-popup');
      });
  });
});
