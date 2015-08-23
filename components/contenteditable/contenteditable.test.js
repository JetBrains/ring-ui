describe('ContentEditable', function () {
  var React = require('react/addons');
  var ContentEditable = require('./contenteditable');
  var stub;
  var component;

  beforeEach(function () {
    stub = this.sinon.stub();

    component = React.addons.TestUtils.renderIntoDocument(React.createElement(ContentEditable, {
      className: 'test',
      onComponentUpdate: stub,
      dangerousHTML: '<b>bold</b>'
    }));
  });

  it('should create component', function () {
    React.addons.TestUtils.isCompositeComponentWithType(component, ContentEditable).should.be.true;
  });

  it('should pass other properties', function () {
    component.getDOMNode().className.should.equal('test');
  });


  it('should dangerously set html', function () {
    component.getDOMNode().innerHTML.should.equal('<b>bold</b>');
  });

  it('should reander only on html / disabled change', function () {
    component.setProps({
      disabled: true
    });

    component.setProps({
      dangerousHTML: ''
    });

    stub.should.have.been.called.twice;
  });

  it('should not render on other props change', function () {
    component.setProps({
      className: 'testtest'
    });

    stub.should.not.have.been.called;
  });
});
