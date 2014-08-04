describe('icon', function () {
  var React = require('react/addons');
  var Icon = require('./icon.jsx');
  var container = null;

  function renderIntoDocument(instance) {
    container = document.createElement('div');
    return React.renderComponent(instance, container);
  }

  beforeEach(function () {
    this.icon = renderIntoDocument(new Icon());
  });

  it('should create component', function () {
    expect(React.addons.TestUtils.isComponentOfType(this.icon, Icon)).toEqual(true);
  });

  it('should set size 16', function () {
    this.icon.setProps({
      modifier: 16
    });
    expect(this.icon.getDOMNode()).toHaveClass('ring-icon_16');
  });

  it('should set custom class', function () {
    var CUSTOM_CSS_CLASS = 'my-icon';
    this.icon.setProps({
      className: CUSTOM_CSS_CLASS
    });
    expect(this.icon.getDOMNode()).toHaveClass(CUSTOM_CSS_CLASS);
  });
});
