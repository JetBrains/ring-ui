import gemini from 'gemini';

gemini.suite('Radio button', suite => {
  suite.
    setUrl('/example-radio-button/').
    setCaptureElements('#container').
    capture('radio button');
});
