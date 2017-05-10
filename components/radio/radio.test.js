/* eslint-disable func-names */

import React from 'react';
import {findDOMNode} from 'react-dom';
import {Simulate, renderIntoDocument} from 'react-dom/test-utils';

import Radio from './radio';

describe('Radio', () => {
  beforeEach(function () {
    this.renderRadio = (props, refOne, refTwo) => renderIntoDocument(
      <Radio
        value={null}
        className="test-class"
        {...props}
      >
        <Radio.Item
          ref={refOne}
          value="one"
        >
          {'One'}
        </Radio.Item>
        <Radio.Item
          ref={refTwo}
          value="two"
        >
          {'Two'}
        </Radio.Item>
        <Radio.Item value="three">{'Three'}</Radio.Item>
      </Radio>
    );
  });

  it('should create component', function () {
    this.renderRadio().should.exist;
  });

  it('should generate same name for items', function () {
    let item1;
    let item2;
    this.renderRadio(
      {},
      itemRef => {
        item1 = itemRef;
      },
      itemRef2 => {
        item2 = itemRef2;
      }
    );
    const name = item1.input.getAttribute('name');

    item2.input.should.have.attribute('name', name);
  });

  it('should pass only child as is', () => {
    const radio = renderIntoDocument(
      <Radio>
        <test/>
      </Radio>
    );

    findDOMNode(radio).should.match('test');
  });

  it('should pass rest props to children', function () {
    findDOMNode(this.renderRadio()).should.have.class('test-class');
  });

  it('should not pass value to children', function () {
    findDOMNode(this.renderRadio()).should.not.have.attribute('value');
  });

  it('should select item with value equal to one provided to group', function () {
    let item;
    this.renderRadio(
      {
        onChange: () => {}, // avoid "checked without onChange" warning
        value: 'one'
      },
      itemRef => {
        item = itemRef;
      }
    );

    item.input.should.have.property('checked', true);
  });

  it('should call handler for onChange event', function () {
    const onChange = this.sinon.spy();
    let item;
    this.renderRadio({onChange}, itemRef => {
      item = itemRef;
    });
    Simulate.change(item.input);

    onChange.should.have.been.called;
  });
});
