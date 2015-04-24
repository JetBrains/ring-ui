var gemini = require('gemini');

gemini.suite('Table', function(suite) {
  suite
    .setUrl('/example-table-ng/index.html')
    .setCaptureElements('.ring-table')
    .before(function(actions, find) {
      this.firstLine = find('.ring-table__row:first-child');
    })
    .capture('plain')
    .capture('hovered', function(actions, find) {
      actions.mouseMove(this.firstLine);
    })
    .capture('clicked', function(actions, find) {
      actions.mouseDown(this.firstLine);
      actions.mouseUp(this.firstLine);
    });
});
