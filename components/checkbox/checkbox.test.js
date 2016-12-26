/* eslint-disable func-names */

import React from 'react';

import renderIntoDocument from 'render-into-document';
import {Simulate} from 'react-addons-test-utils';

import Checkbox from './checkbox';

describe('Checkbox', () => {
  beforeEach(function () {
    this.checkbox = renderIntoDocument(React.createElement(Checkbox, {
      onChange: () => {
        this.onChange && this.onChange();
      }
    }));
  });

  it('should create component', function () {
    this.checkbox.should.exist;
  });

  it('should render checkbox', function () {
    this.checkbox.refs.input.should.have.property('type', 'checkbox');
  });

  it('should set name', function () {
    this.checkbox.rerender({
      name: 'test'
    });

    this.checkbox.refs.input.should.have.property('name', 'test');
  });

  it('should call handler for click event', function () {
    const clickHandler = sinon.stub();

    this.checkbox.rerender({
      onClick: clickHandler
    });

    Simulate.click(this.checkbox.refs.input);
    clickHandler.should.have.been.called;
  });

  it('should not call handler on change event if disabled', function () {
    const onChange = sinon.stub();

    this.checkbox.rerender({
      disabled: true,
      onChange
    });

    Simulate.click(this.checkbox.node);
    onChange.should.have.not.been.called;
  });

  it('should be unchecked by default', function () {
    this.checkbox.node.should.not.be.checked;
  });

  it('should check control', function () {
    this.checkbox.rerender({
      checked: true
    });

    this.checkbox.refs.input.should.be.checked;
  });

  it('should be disabled', function () {
    this.checkbox.rerender({
      disabled: true
    });

    this.checkbox.refs.input.should.be.disabled;
  });

  it('should check control on change event', function () {
    const eventMock = {
      target: {
        checked: true
      }
    };

    Simulate.change(this.checkbox.refs.input, eventMock);
    this.checkbox.refs.input.should.be.checked;
  });
});
