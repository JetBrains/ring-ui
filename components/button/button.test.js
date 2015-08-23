describe('Button', function () {
  var $ = require('jquery');
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var Button = require('./button');

  beforeEach(function () {
    this.button = TestUtils.renderIntoDocument(React.createElement(Button));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(this.button, Button).should.equal(true);
  });

  it('should set theme', function () {
    this.button.setProps({
      modifier: Button.Modifiers.BLUE
    });

    $(this.button.getDOMNode()).should.have.class('ring-btn_blue');
  });

  it('should set custom class', function () {
    var CUSTOM_CLASS = 'test';

    this.button.setProps({
      className: CUSTOM_CLASS
    });

    $(this.button.getDOMNode()).should.have.class(CUSTOM_CLASS);
  });
});
