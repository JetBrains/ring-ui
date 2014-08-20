describe('checkbox', function () {
  var $ = require('jquery');
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var Checkbox = require('./checkbox.jsx');
  var checkbox;

  function renderIntoDocument(instance) {
    var container = document.createElement('div');
    return React.renderComponent(instance, container);
  }

  beforeEach(function () {
    checkbox = renderIntoDocument(new Checkbox());
  });

  it('should create component', function () {
    checkbox.should.exist;
  });

  it('should render checkbox', function () {
    $(checkbox.getInputDOMNode()).should.have.prop('type', 'checkbox');
  });

  it('should set custom class', function () {
    checkbox.setProps({
      className: 'test'
    });

    $(checkbox.getDOMNode()).should.have.class('test');
  });

  it('should generate id if not passed', function () {
    $(checkbox.getInputDOMNode()).prop('id').should.exist;
  });

  it('should generate unique id', function () {
    var secondCheckboxId = renderIntoDocument(new Checkbox()).getInputDOMNode().getAttribute('id');
    $(checkbox.getInputDOMNode()).should.not.have.id(secondCheckboxId);
  });

  it('should set custom id', function () {
    checkbox.setProps({
      id: 'test'
    });

    $(checkbox.getInputDOMNode()).should.have.id('test');
  });

  it('should set name', function () {
    checkbox.setProps({
      name: 'test'
    });

    $(checkbox.getInputDOMNode()).should.have.prop('name', 'test');
  });

  it('should call handler for click event', function () {
    var clickHandler = sinon.stub();

    checkbox.setProps({
      onClick: clickHandler
    });

    TestUtils.Simulate.click(checkbox.getInputDOMNode());
    clickHandler.should.have.been.called;
  });

  it('should be unchecked by default', function () {
    $(checkbox.getInputDOMNode()).should.not.be.checked;
  });

  it('should check control', function () {
    checkbox.setProps({
      checked: true
    });

    $(checkbox.getInputDOMNode()).should.be.checked;
  });

  it('should check controll on change event', function () {
    var eventMock = {
      target: {
        checked: true
      }
    };

    TestUtils.Simulate.change(checkbox.refs.input.getDOMNode(), eventMock);

    $(checkbox.getInputDOMNode()).should.be.checked;
  });

  it('should connect label with input by id', function () {
    var inputId = checkbox.refs.input.getDOMNode().getAttribute('id');

    $(checkbox.getLabelDOMNode()).should.have.prop('for', inputId);
  });
});
