/* global gemini: false */

gemini.suite('Error Message', suite => {
  suite.
    setUrl('/error-message/error-message.html').
    setCaptureElements('#error-message').
    capture('error-message');
});
