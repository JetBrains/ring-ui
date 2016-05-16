import gemini from 'gemini';

gemini.suite('IconNg', suite => {
  suite
    .setUrl('/example-icon-ng/')
    .setCaptureElements('body > div')
    .capture('icons', actions => {
      actions.executeJS(() => {
        // Disable loading buttons (ignore is too slow on IE)
        Array.prototype.forEach.call(document.querySelectorAll('.ring-icon_loading'), node => { // eslint-disable-line prefer-reflect
          node.classList.remove('ring-icon_loading');
        });
      });
    });
});
