var gemini = require('gemini');

gemini.suite('Button-group', function (suite) {
  suite
    .setUrl('/example-button-group/index.html')
    .setCaptureElements('#button-group')
    .before(function (actions, find) {
      this.firstButton = find('.ring-btn_default:first-child');
    })
    .capture('plain')
    .capture('hovered', function (actions) {
      actions.mouseMove(this.firstButton);
    })
    .capture('pressed', function (actions) {
      actions.mouseDown(this.firstButton);
    });
});
