describe('checkobx', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var Checkbox = require('../../../src/components/checkbox/checkbox.jsx');
  var checkbox;

  function renderIntoDocument(instance) {
    var container = document.createElement('div');
    return React.renderComponent(instance, container);
  }

  beforeEach(function () {
    checkbox = renderIntoDocument(new Checkbox());
  });

  it('should create component', function () {
    expect(checkbox).toBeDefined();
  });

  it('should render checkobx', function () {
    expect(checkbox.getInputDOMNode().getAttribute('type')).toEqual('checkbox');
  });

  it('should set custom class', function () {
    checkbox.setProps({
      className: 'test'
    });

    expect(checkbox.getDOMNode()).toHaveClass('test');
  });

  it('should generate unique id if not passed', function () {
    expect(checkbox.getInputDOMNode().getAttribute('id')).not.toEqual(null);
  });

  it('should set custom id', function () {
    checkbox.setProps({
      id: 'test'
    });

    expect(checkbox.getInputDOMNode().getAttribute('id')).toEqual('test');
  });

  it('should set name', function () {
    checkbox.setProps({
      name: 'test'
    });

    expect(checkbox.getInputDOMNode().getAttribute('name')).toEqual('test');
  });

  it('should call handler for click event', function () {
    var clickHandler = jasmine.createSpy('clickHandler');

    checkbox.setProps({
      onClick: clickHandler
    });

    TestUtils.Simulate.click(checkbox.getInputDOMNode());
    expect(clickHandler).toHaveBeenCalled();
  });

  it('should be unchecked by default', function () {
    expect(checkbox.getInputDOMNode().checked).toEqual(false);
  });

  it('should check control', function () {
    checkbox.setProps({
      checked: true
    });

    expect(checkbox.getInputDOMNode().checked).toEqual(true);
  });

  it('should check controll on change event', function () {
    var eventMock = {
      target: {
        checked: true
      }
    };

    TestUtils.Simulate.change(checkbox.refs.input.getDOMNode(), eventMock);

    expect(checkbox.getInputDOMNode().checked).toEqual(true);
  });

  it('should connect label with input by id', function () {
    var inputId = checkbox.refs.input.getDOMNode().getAttribute('id');

    expect(checkbox.getLabelDOMNode().getAttribute('for')).toEqual(inputId);
  });
});
