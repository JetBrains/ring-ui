describe('Icon', function () {
  var $ = require('jquery');
  var TestUtils = require('react-addons-test-utils');
  var Icon = require('./icon');
  var expandIcon = require('icon/source/expand.svg');

  beforeEach(function () {
    this.icon = TestUtils.renderIntoDocument(Icon.factory({
      glyph: expandIcon
    }));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(this.icon, Icon).should.equal(true);
  });

  it('should render passed glyph', function() {
    $(this.icon.node).find('use').attr('xlink:href').should.contain(expandIcon);
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
