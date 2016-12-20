/* global gemini: false */

gemini.suite('Query Assist', suite => {
  suite.
    setUrl('/example-query-assist-no-auth/').
    setCaptureElements('#query-assist').
    capture('default');

  gemini.suite('with popup', child => {
    child.
      setCaptureElements(['#query-assist', '.ring-popup']).
      capture('focused', (actions, find) => {
        actions.click(find('.ring-query-assist__input'));
        actions.waitForElementToShow('.ring-popup');
      }).
      capture('input', (actions, find) => {
        actions.sendKeys(find('.ring-query-assist__input'), 'test');
        actions.waitForElementToShow('.ring-popup');
      });
  });
});
