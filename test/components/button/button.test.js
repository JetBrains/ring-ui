/**
 * Describe using progress bar
 */
describe('button', function () {
  var React = require('react/addons');
  var Button = require('../../../src/components/button/button.jsx');
  var container = null;

  function renderIntoDocument(instance) {
    container = document.createElement('div');
    return React.renderComponent(instance, container);
  }

  beforeEach(function () {
    this.button = renderIntoDocument(new Button());
  });

  it('should create component', function () {
    expect(this.button).toBeDefined();
  });

  it('should set theme', function () {
    this.button.setProps({
      theme: 'blue'
    });

    expect(this.button.getDOMNode()).toHaveClass('ring-btn_blue');
  });

  it('should set custom class', function () {
    this.button.setProps({
      className: 'test'
    });

    expect(this.button.getDOMNode()).toHaveClass('test');
  });
});
