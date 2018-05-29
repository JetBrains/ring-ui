/* global gemini: false */

gemini.suite('Message', suite => {
  suite.
    setUrl('message/message.html').
    setCaptureElements('#message').
    capture('message');
});
