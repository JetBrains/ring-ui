var gemini = require('gemini');

gemini.suite('Alert', function(suite) {
  suite
    .setUrl('/example-alert/index.html')
    .setCaptureElements('body > div')
    .capture('plain')
    .capture('hovered', function(actions, find) {
      actions.mouseMove(find('.ring-alert__close'));
    });
});
