import gemini from 'gemini';

gemini.suite('ButtonNg', suite => {
  suite.
    setUrl('/example-button-ng/').
    setCaptureElements('body > div').
    capture('buttons', actions => {
      actions.executeJS(() => {
        // Disable loading buttons (ignore is too slow on IE)
        Array.prototype.forEach.call(document.querySelectorAll('.ring-button_loader'), node => { // eslint-disable-line prefer-reflect
          node.classList.remove('ring-button_loader');
        });
      });
    });
});
