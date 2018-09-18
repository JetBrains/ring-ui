import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {Simulate} from 'react-dom/test-utils';
import {shallow} from 'enzyme';

import Radio from './radio';

describe('Radio', () => {
  const factory = (props, refOne, refTwo) => (
    <Radio
      value={null}
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

  it('should create component', () => {
    shallowRadio().should.exist;
  });

  it('should pass only child as is', () => {
    const radio = shallow(
      <Radio>
        <test/>
      </Radio>
    );

    radio.should.have.tagName('test');
  });

  describe('refs', () => {
    // TODO move back to enzyme when https://github.com/airbnb/enzyme/pull/1592 gets released
    const container = document.createElement('div');
    const renderRadio = (props, refOne, refTwo) =>
      render(factory(props, refOne, refTwo), container);

    afterEach(() => {
      unmountComponentAtNode(container);
    });

    it('should generate same name for items', () => {
      let item1;
      let item2;
      renderRadio(
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


    it('should select item with value equal to one provided to group', () => {
      let item;
      renderRadio(
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
      renderRadio({onChange}, itemRef => {
        item = itemRef;
      });
      Simulate.change(item.input);

      onChange.should.have.been.called;
    });
  });
});
