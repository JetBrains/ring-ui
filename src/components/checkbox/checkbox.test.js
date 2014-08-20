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

    TestUtils.Simulate.click(checkbox.getLabelDOMNode());
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

    TestUtils.Simulate.change(checkbox.getInputDOMNode(), eventMock);

    $(checkbox.getInputDOMNode()).should.be.checked;
  });

  it('should check controll on click by lable', function () {
    TestUtils.Simulate.click(checkbox.getLabelDOMNode(), null);

    $(checkbox.getInputDOMNode()).should.be.checked;
  });
});
