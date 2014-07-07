describe('checkobx', function () {
  var React = require('react/addons');
  var Popup = require('../../../src/blocks/popup/popup.jsx');
  var popup;

  function renderIntoDocument(instance) {
    var container = document.createElement('div');
    return React.renderComponent(instance, container);
  }

  beforeEach(function () {
    popup = renderIntoDocument(new Popup());
  });

  it('should create component', function () {
    expect(popup).toBeDefined();
  });
});
