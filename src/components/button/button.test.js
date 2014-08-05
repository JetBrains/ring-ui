describe('button', function () {
  var React = require('react/addons');
  var ReactTestUtils = React.addons.TestUtils;
  var Button = require('./button.jsx');
  var container = null;

  function renderIntoDocument(instance) {
    container = document.createElement('div');
    return React.renderComponent(instance, container);
  }

  beforeEach(function () {
    this.button = renderIntoDocument(new Button());
  });

  it('should create component', function () {
    expect(ReactTestUtils.isCompositeComponentWithType(this.button, Button)).toEqual(true);
  });

  it('should set theme', function () {
    this.button.setProps({
      modifier: Button.Modifiers.BLUE
    });

    expect(this.button.getDOMNode()).toHaveClass('ring-btn_blue');
  });

  it('should set custom class', function () {
    var CUSTOM_CLASS = 'test';

    this.button.setProps({
      className: CUSTOM_CLASS
    });

    expect(this.button.getDOMNode()).toHaveClass(CUSTOM_CLASS);
  });
});
