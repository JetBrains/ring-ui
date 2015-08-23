describe('ButtonGroup', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var ButtonGroup = require('./button-group');
  var button;

  beforeEach(function () {
    button = TestUtils.renderIntoDocument(React.createElement(ButtonGroup));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(button, ButtonGroup).should.equal(true);
  });
});
