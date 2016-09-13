/* global gemini: false */

gemini.suite('Error Bubble', suite => {
  suite.
    setUrl('/example-error-bubble/').
    setCaptureElements('#container').
    capture('error bubble').
    capture('error bubble hidden', (actions, find) => {
      actions.sendKeys(find('.ring-input'), 'something');
    });
});
