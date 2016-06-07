import gemini from 'gemini';

gemini.suite('Panel', suite => {
  suite.
    setUrl('/example-panel/').
    setCaptureElements('body > div').
    capture('panel');
});
