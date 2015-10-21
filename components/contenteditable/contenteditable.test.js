import React from 'react';
import ContentEditable from './contenteditable';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

describe('ContentEditable', function () {
  beforeEach(function () {
    this.stub = this.sinon.stub();

    this.component = renderIntoDocument(React.createElement(ContentEditable, {
      className: 'test',
      onComponentUpdate: this.stub

    }, <b>bold</b>));
  });

  it('should create component', function () {
    isCompositeComponentWithType(this.component, ContentEditable).should.be.true;
  });

  it('should pass other properties', function () {
    this.component.node.className.should.equal('test');
  });


  it('should dangerously set html', function () {
    this.component.node.innerHTML.should.equal('<b>bold</b>');
  });

  it('should reander only on html / disabled change', function () {
    this.component.rerender({
      disabled: true
    });

    this.component.rerender({
      children: <span></span>
    });

    this.stub.should.have.been.called.twice;
  });

  it('should not render on other props change', function () {
    this.component.rerender({
      className: 'testtest'
    });

    this.stub.should.not.have.been.called;
  });
});
