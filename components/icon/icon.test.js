describe('Icon', function () {
  var $ = require('jquery');
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var Icon = require('./icon');
  var expandIcon = require('icon/source/expand.svg');

  beforeEach(function () {
    this.icon = TestUtils.renderIntoDocument(new Icon({
      glyph: expandIcon
    }));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(this.icon, Icon).should.equal(true);
  });

  it('should render passed glyph', function() {
    $(this.icon.getDOMNode()).attr('class').should.contain('ring-icon_expand');
    $(this.icon.getDOMNode()).find('use').attr('xlink:href').should.contain('#expand');
  });

  it('should rerender component if we change icon', function () {
    this.icon.setProps({ glyph: 'collapse' });

    $(this.icon.getDOMNode()).attr('class').should.contain('ring-icon_collapse');
  });

  it('should set size 16', function () {
    this.icon.setProps({ size: Icon.Size.Size16 });

    $(this.icon.getDOMNode()).attr('class').should.contain('ring-icon_16');
  });

  it('should set custom class', function () {
    var CUSTOM_CSS_CLASS = 'my-icon';

    this.icon.setProps({ className: CUSTOM_CSS_CLASS });
    $(this.icon.getDOMNode()).attr('class').should.contain(CUSTOM_CSS_CLASS);
  });
});
