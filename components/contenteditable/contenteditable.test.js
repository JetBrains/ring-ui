/* eslint-disable func-names */

import React from 'react';
import ContentEditable from './contenteditable';
import {
  isCompositeComponentWithType,
  renderIntoDocument
} from 'react-dom/test-utils';

describe('ContentEditable', () => {
  beforeEach(function () {
    this.stub = this.sinon.stub();

    this.renderContentEditable = function (props) {
      this.component = renderIntoDocument(
        React.createElement(ContentEditable, props, <b>{'bold'}</b>)
      );
    };

    this.renderContentEditable({
      className: 'test',
      onComponentUpdate: this.stub
    });
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

  it('should render only on html / disabled change', function () {
    this.component.rerender({
      disabled: true
    });

    this.component.rerender({
      children: <span />
    });

    this.stub.should.have.been.called.twice;
  });

  it('should not render on other props change', function () {
    this.component.rerender({
      className: 'testtest'
    });

    this.stub.should.not.have.been.called;
  });

  it('should set tabindex equal zero by default', function () {
    this.component.node.getAttribute('tabindex').should.equal('0');
  });

  it('should allow pass custom tabindex', function () {
    this.renderContentEditable({
      tabIndex: -1
    });

    this.component.node.getAttribute('tabindex').should.equal('-1');
  });
});
