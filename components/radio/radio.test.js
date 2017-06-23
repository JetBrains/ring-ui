import React from 'react';
import {Simulate} from 'react-dom/test-utils';
import {shallow, mount} from 'enzyme';

import Radio from './radio';

describe('Radio', () => {
  const factory = (props, refOne, refTwo) => (
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
  const shallowRadio = (props, refOne, refTwo) => shallow(factory(props, refOne, refTwo));
  const mountRadio = (props, refOne, refTwo) => mount(factory(props, refOne, refTwo));

  it('should create component', () => {
    shallowRadio().should.exist;
  });

  it('should generate same name for items', () => {
    let item1;
    let item2;
    mountRadio(
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
    const radio = shallow(
      <Radio>
        <test/>
      </Radio>
    );

    radio.should.have.tagName('test');
  });

  it('should pass rest props to children', () => {
    shallowRadio().should.have.className('test-class');
  });

  it('should not pass value to children', () => {
    shallowRadio().should.not.have.prop('value');
  });

  it('should select item with value equal to one provided to group', () => {
    let item;
    mountRadio(
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

  it('should call handler for onChange event', () => {
    const onChange = sandbox.spy();
    let item;
    mountRadio({onChange}, itemRef => {
      item = itemRef;
    });
    Simulate.change(item.input);

    onChange.should.have.been.called;
  });
});
