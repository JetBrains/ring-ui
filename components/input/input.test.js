describe('Input', function () {
  var React = require('react/addons');
  var Input = require('./input');
  var component;

  beforeEach(function () {
    component = React.addons.TestUtils.renderIntoDocument(React.createElement(Input));
  });

  it('should create component', function () {
    React.addons.TestUtils.isCompositeComponentWithType(component, Input).should.be.true;
  });
});
