/* eslint-disable func-names */

import React from 'react';
import {Simulate, renderIntoDocument} from 'react-dom/test-utils';

import Radio from './radio';

describe('Radio', () => {
  beforeEach(function () {
    this.onChange = () => {};

    this.radioItemOneRef = item => {
      this.radioItemOne = item;
    };

    this.radioItemTwoRef = item => {
      this.radioItemTwo = item;
    };

    this.radio = renderIntoDocument(
      <Radio
        value={null}
        className="test-class"
        // eslint-disable-next-line react/jsx-no-bind
        onChange={() => this.onChange()}
      >
        <Radio.Item
          ref={this.radioItemOneRef}
          value="one"
        >
          {'One'}
        </Radio.Item>
        <Radio.Item
          ref={this.radioItemTwoRef}
          value="two"
        >
          {'Two'}
        </Radio.Item>
        <Radio.Item value="three">{'Three'}</Radio.Item>
      </Radio>
    );
  });

  it('should create component', function () {
    this.radio.should.exist;
  });

  it('should generate same name for items', function () {
    const name = this.radioItemOne.input.getAttribute('name');

    this.radioItemTwo.input.should.have.attribute('name', name);
  });

  it('should pass only child as is', () => {
    const radio = renderIntoDocument(
      <Radio>
        <test/>
      </Radio>
    );

    radio.node.should.match('test');
  });

  it('should pass rest props to children', function () {
    this.radio.node.should.have.class('test-class');
  });

  it('should not pass value to children', function () {
    this.radio.node.should.not.have.attribute('value');
  });

  it('should select item with value equal to one provided to group', function () {
    this.radio.rerender({
      value: 'one'
    });

    this.radioItemOne.input.should.have.property('checked', true);
  });

  it('should call handler for onChange event', function () {
    this.sinon.stub(this, 'onChange');

    Simulate.change(this.radioItemOne.input);

    this.onChange.should.have.been.called;
  });
});
