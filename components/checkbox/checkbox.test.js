import React from 'react';
import $ from 'jquery';

import renderIntoDocument from 'render-into-document';
import { Simulate } from 'react-addons-test-utils';

import Checkbox from './checkbox';

describe('Checkbox', function () {
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
    $(this.checkbox.refs.input).should.have.prop('type', 'checkbox');
  });

  it('should generate id if not passed', function () {
    $(this.checkbox.node).prop('id').should.exist;
  });

  it('should generate unique id', function () {
    var secondCheckboxId = renderIntoDocument(React.createElement(Checkbox)).node.getAttribute('id');
    $(this.checkbox.node).should.not.have.id(secondCheckboxId);
  });

  it('should set custom id', function () {
    this.checkbox.rerender({
      id: 'test'
    });

    $(this.checkbox.refs.input).should.have.id('test');
  });

  it('should set name', function () {
    this.checkbox.rerender({
      name: 'test'
    });

    $(this.checkbox.refs.input).should.have.prop('name', 'test');
  });

  it('should call handler for click event', function () {
    var clickHandler = sinon.stub();

    this.checkbox.rerender({
      onClick: clickHandler
    });

    Simulate.click(this.checkbox.refs.input);
    clickHandler.should.have.been.called;
  });

  it('should not call handler on change event if disabled', function () {
    var inputChange = sinon.stub();

    this.checkbox.rerender({
      disabled: true,
      inputChange: inputChange
    });

    Simulate.click(this.checkbox.node);
    inputChange.should.have.not.been.called;
  });

  it('should be unchecked by default', function () {
    $(this.checkbox.node).should.not.be.checked;
  });

  it('should check control', function () {
    this.checkbox.rerender({
      checked: true
    });

    $(this.checkbox.refs.input).should.be.checked;
  });

  it('should be disabled', function () {
    this.checkbox.rerender({
      disabled: true
    });

    $(this.checkbox.refs.input).should.be.disabled;
  });

  it('should check control on change event', function () {
    const eventMock = {
      target: {
        checked: true
      }
    };

    Simulate.change(this.checkbox.refs.input, eventMock);
    $(this.checkbox.refs.input).should.be.checked;
  });

  it('should connect label with input by id', function () {
    var inputId = this.checkbox.refs.input.getAttribute('id');
    var forId = this.checkbox.node.getAttribute('for');

    expect(inputId).eq(forId);
  });
});
