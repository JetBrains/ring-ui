describe('Textarea', function () {
  var React = require('react/addons');
  var Textarea = require('./textarea');
  var component;

  beforeEach(function () {
    component = React.addons.TestUtils.renderIntoDocument(React.createElement(Textarea));
  });

  it('should create component', function () {
    React.addons.TestUtils.isCompositeComponentWithType(component, Textarea).should.be.true;
  });
});
