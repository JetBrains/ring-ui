/* eslint-disable func-names */

import React from 'react';
import {renderIntoDocument, Simulate} from 'react-dom/test-utils';

import RadioItem from './radio__item';

describe('Radio Item', () => {
  beforeEach(function () {
    this.radioItem = renderIntoDocument(
      <RadioItem
        checked={false}
        value="test"
      >
        {'test'}
      </RadioItem>
    );
  });

  it('should create component', function () {
    this.radioItem.should.exist;
  });

  it('should render radio item', function () {
    this.radioItem.input.should.have.property('type', 'radio');
  });

  it('should generate id if not passed', function () {
    this.radioItem.input.should.have.property('id');
  });

  it('should generate unique id', function () {
    const secondRadioItem = renderIntoDocument(
      <RadioItem>
        {'test'}
      </RadioItem>
    );
    const secondRadioId = secondRadioItem.input.getAttribute('id');
    this.radioItem.input.should.not.have.id(secondRadioId);
  });

  it('should set custom id', function () {
    this.radioItem.rerender({
      id: 'test'
    });

    this.radioItem.input.should.have.id('test');
  });

  it('should set name', function () {
    this.radioItem.rerender({
      name: 'test'
    });

    this.radioItem.input.should.have.property('name', 'test');
  });

  it('should call handler for click event', function () {
    const clickHandler = sinon.stub();

    this.radioItem.rerender({
      onClick: clickHandler
    });

    Simulate.click(this.radioItem.input);
    clickHandler.should.have.been.called;
  });

  it('should be unchecked by default', function () {
    this.radioItem.input.should.not.have.property('checked', true);
  });

  it('should check control', function () {
    this.radioItem.rerender({
      checked: true
    });

    this.radioItem.input.should.have.property('checked', true);
  });

  it('should be disabled', function () {
    this.radioItem.rerender({
      disabled: true
    });

    this.radioItem.input.should.be.disabled;
  });


  it('should connect labels with input by id', function () {
    const id = this.radioItem.input.getAttribute('id');

    this.radioItem.label.should.have.attribute('for', id);
    this.radioItem.textLabel.should.have.attribute('for', id);
  });
});
