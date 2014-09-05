describe('icon', function () {
  var $ = require('jquery');
  var React = require('react/addons');
  var Icon = require('./icon');

  beforeEach(function () {
    this.icon = React.addons.TestUtils.renderIntoDocument(new Icon());
  });

  it('should create component', function () {
    expect(React.addons.TestUtils.isCompositeComponentWithType(this.icon, Icon)).should.equal(true);
  });

  it('should set size 16', function () {
    this.icon.setProps({
      modifier: 16
    });
    $(this.icon.getDOMNode()).should.have.class('ring-icon_16');
  });

  it('should set custom class', function () {
    var CUSTOM_CSS_CLASS = 'my-icon';

    this.icon.setProps({
      className: CUSTOM_CSS_CLASS
    });
    $(this.icon.getDOMNode()).should.have.class(CUSTOM_CSS_CLASS);
  });
});