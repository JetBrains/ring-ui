var renderIntoDocument = require('render-into-document');

describe('Checkbox', function () {
  var $ = require('jquery');
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;

  var Checkbox = require('./checkbox');
  var checkbox;

  beforeEach(function () {
    checkbox = TestUtils.renderIntoDocument(React.createElement(Checkbox));
  });

  it('should create component', function () {
    checkbox.should.exist;
  });

  it('should render checkbox', function () {
    $(checkbox.refs.input).should.have.prop('type', 'checkbox');
  });

  it('should generate id if not passed', function () {
    $(checkbox.node).prop('id').should.exist;
  });

  it('should generate unique id', function () {
    var secondCheckboxId = renderIntoDocument(React.createElement(Checkbox)).node.getAttribute('id');
    $(checkbox.node).should.not.have.id(secondCheckboxId);
  });

  it('should set custom id', function () {
    checkbox.rerender({
      id: 'test'
    });

    $(checkbox.refs.input).should.have.id('test');
  });

  it('should set name', function () {
    checkbox.rerender({
      name: 'test'
    });

    $(checkbox.refs.input).should.have.prop('name', 'test');
  });

  it('should call handler for click event', function () {
    var clickHandler = sinon.stub();

    checkbox.rerender({
      onClick: clickHandler
    });

    TestUtils.Simulate.click(checkbox.refs.input);
    clickHandler.should.have.been.called;
  });

  it('should not call handler on change event if disabled', function () {
    var inputChange = sinon.stub();

    checkbox.rerender({
      disabled: true,
      inputChange: inputChange
    });

    TestUtils.Simulate.click(checkbox.node);
    inputChange.should.have.not.been.called;
  });

  it('should be unchecked by default', function () {
    $(checkbox.node).should.not.be.checked;
  });

  it('should check control', function () {
    checkbox.rerender({
      checked: true
    });

    $(checkbox.refs.input).should.be.checked;
  });

  it('should be disabled', function () {
    checkbox.rerender({
      disabled: true
    });

    $(checkbox.refs.input).should.be.disabled;
  });

  it('should check control on change event', function () {
    var eventMock = {
      target: {
        checked: true
      }
    };

    TestUtils.Simulate.change(checkbox.refs.input, eventMock);

    $(checkbox.refs.input).should.be.checked;
  });

  it('should connect label with input by id', function () {
    var inputId = checkbox.refs.input.getAttribute('id');
    var forId = checkbox.node.getAttribute('for');

    expect(inputId).eq(forId);
  });
});
