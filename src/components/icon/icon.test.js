describe('icon', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var Icon = require('./icon');

  beforeEach(function () {
    this.icon = TestUtils.renderIntoDocument(new Icon());
  });

  it('should create component', function () {
    expect(TestUtils.isCompositeComponentWithType(this.icon, Icon)).should.equal(true);
  });

  it('should set size 16', function () {
    this.icon.setProps({
      modifier: 16
    });
    expect(this.icon.getDOMNode()).should.have.class('ring-icon_16');
  });

  it('should set custom class', function () {
    var CUSTOM_CSS_CLASS = 'my-icon';
    this.icon.setProps({
      className: CUSTOM_CSS_CLASS
    });
    expect(this.icon.getDOMNode()).should.have.class(CUSTOM_CSS_CLASS);
  });
});