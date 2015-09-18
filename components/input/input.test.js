describe('Input', function () {
  var React = require('react');
  var TestUtils = require('react-addons-test-utils');
  var Input = require('./input');
  var component;

  beforeEach(function () {
    component = TestUtils.renderIntoDocument(React.createElement(Input));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(component, Input).should.be.true;
  });
});
