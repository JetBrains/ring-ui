describe('ButtonGroup', function () {
  var React = require('react');
  var TestUtils = require('react-addons-test-utils');
  var ButtonGroup = require('./button-group');
  var button;

  beforeEach(function () {
    button = TestUtils.renderIntoDocument(React.createElement(ButtonGroup));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(button, ButtonGroup).should.equal(true);
  });
});
