describe('ContentEditable', function () {
  var React = require('react');
  var TestUtils = require('react-addons-test-utils');
  var ContentEditable = require('./contenteditable');
  var stub;
  var component;

  beforeEach(function () {
    stub = this.sinon.stub();

    component = TestUtils.renderIntoDocument(React.createElement(ContentEditable, {
      className: 'test',
      onComponentUpdate: stub,
      dangerousHTML: '<b>bold</b>'
    }));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(component, ContentEditable).should.be.true;
  });

  it('should pass other properties', function () {
    component.node.className.should.equal('test');
  });


  it('should dangerously set html', function () {
    component.node.innerHTML.should.equal('<b>bold</b>');
  });

  it('should reander only on html / disabled change', function () {
    component.rerender({
      disabled: true
    });

    component.rerender({
      dangerousHTML: ''
    });

    stub.should.have.been.called.twice;
  });

  it('should not render on other props change', function () {
    component.rerender({
      className: 'testtest'
    });

    stub.should.not.have.been.called;
  });
});
