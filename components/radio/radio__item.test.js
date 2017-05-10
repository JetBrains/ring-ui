/* eslint-disable func-names */

import React from 'react';
import {renderIntoDocument, Simulate} from 'react-dom/test-utils';

import RadioItem from './radio__item';

describe('Radio Item', () => {
  beforeEach(function () {
    this.renderRadioItem = props => renderIntoDocument(
      <RadioItem
        checked={false}
        value="test"
        {...props}
      >
        {'test'}
      </RadioItem>
    );
  });

  it('should create component', function () {
    this.renderRadioItem().should.exist;
  });

  it('should render radio item', function () {
    this.renderRadioItem().input.should.have.property('type', 'radio');
  });

  it('should generate id if not passed', function () {
    this.renderRadioItem().input.should.have.property('id');
  });

  it('should generate unique id', function () {
    const firstRadioItem = this.renderRadioItem();
    const secondRadioItem = this.renderRadioItem();
    const secondRadioId = secondRadioItem.input.getAttribute('id');
    firstRadioItem.input.should.not.have.id(secondRadioId);
  });

  it('should set custom id', function () {
    const radioItem = this.renderRadioItem({
      id: 'test'
    });

    radioItem.input.should.have.id('test');
  });

  it('should set name', function () {
    const radioItem = this.renderRadioItem({
      name: 'test'
    });

    radioItem.input.should.have.property('name', 'test');
  });

  it('should call handler for click event', function () {
    const clickHandler = sinon.stub();
    const radioItem = this.renderRadioItem({
      onClick: clickHandler
    });

    Simulate.click(radioItem.input);
    clickHandler.should.have.been.called;
  });

  it('should be unchecked by default', function () {
    const radioItem = this.renderRadioItem();

    radioItem.input.should.not.have.property('checked', true);
  });

  it('should check control', function () {
    const radioItem = this.renderRadioItem({
      checked: true,
      onChange: () => {} // avoid "checked without onChange" warning
    });

    radioItem.input.should.have.property('checked', true);
  });

  it('should be disabled', function () {
    const radioItem = this.renderRadioItem({
      disabled: true
    });

    radioItem.input.should.be.disabled;
  });


  it('should connect labels with input by id', function () {
    const radioItem = this.renderRadioItem();
    const id = radioItem.input.getAttribute('id');

    radioItem.label.should.have.attribute('for', id);
    radioItem.textLabel.should.have.attribute('for', id);
  });
});
