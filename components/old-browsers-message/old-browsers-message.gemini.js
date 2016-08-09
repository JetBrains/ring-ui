import gemini from 'gemini';

gemini.suite('old-browsers-message', suite => {
  suite.
    setUrl('/example-old-browsers-message/').
    setCaptureElements('.ring-old-browsers-message').
    capture('plain');
});
