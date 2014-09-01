describe('button', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var ButtonGroup = require('./button__group');
  var button;

  beforeEach(function () {
    button = TestUtils.renderIntoDocument(new ButtonGroup());
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(button, ButtonGroup).should.equal(true);
  });
});
