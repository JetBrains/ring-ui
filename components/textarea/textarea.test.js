describe('Textarea', function () {
  var React = require('react');
  var TestUtils = require('react-addons-test-utils');
  var Textarea = require('./textarea');
  var component;

  beforeEach(function () {
    component = TestUtils.renderIntoDocument(React.createElement(Textarea));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(component, Textarea).should.be.true;
  });
});
