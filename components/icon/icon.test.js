describe('Icon', function () {
  var $ = require('jquery');
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var Icon = require('./icon');

  beforeEach(function () {
    this.icon = TestUtils.renderIntoDocument(React.createElement(Icon, {
      glyph: 'expand'
    }));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(this.icon, Icon).should.equal(true);
  });

  it('should render passed glyph', function() {
    $(this.icon.node).attr('class').should.contain('ring-icon_expand');
    $(this.icon.node).find('use').attr('xlink:href').should.contain('#ring-icon_expand');
  });

  it('should rerender component if we change icon', function () {
    this.icon.rerender({ glyph: 'collapse' });

    $(this.icon.node).attr('class').should.contain('ring-icon_collapse');
  });

  it('should set size 16', function () {
    this.icon.rerender({ size: Icon.Size.Size16 });

    $(this.icon.node).attr('class').should.contain('ring-icon_16');
  });

  it('should set custom class', function () {
    var CUSTOM_CSS_CLASS = 'my-icon';

    this.icon.rerender({ className: CUSTOM_CSS_CLASS });
    $(this.icon.node).attr('class').should.contain(CUSTOM_CSS_CLASS);
  });
});
