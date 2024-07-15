import {ComponentRef, Ref} from 'react';
import {Simulate} from 'react-dom/test-utils';
import {shallow, mount} from 'enzyme';

import {RadioProps} from './radio__item';

import Radio from './radio';


describe('Radio', () => {
  const factory = (
    props?: RadioProps,
    refOne?: Ref<ComponentRef<typeof Radio.Item>>,
    refTwo?: Ref<ComponentRef<typeof Radio.Item>>,
  ) => (
    <Radio {...props}>
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
  const shallowRadio = (
    props?: RadioProps,
    refOne?: Ref<ComponentRef<typeof Radio.Item>>,
    refTwo?: Ref<ComponentRef<typeof Radio.Item>>,
  ) => shallow(factory(props, refOne, refTwo));

  it('should create component', () => {
    shallowRadio().should.exist;
  });

  it('should pass only child as is', () => {
    const radio = shallow(
      <Radio>
        <section/>
      </Radio>
    );

    radio.should.have.tagName('section');
  });

  describe('refs', () => {
    const mountRadio = (
      props?: RadioProps,
      refOne?: Ref<ComponentRef<typeof Radio.Item>>,
      refTwo?: Ref<ComponentRef<typeof Radio.Item>>,
    ) => mount(factory(props, refOne, refTwo));
    it('should generate same name for items', () => {
      let item1: ComponentRef<typeof Radio.Item>;
      let item2: ComponentRef<typeof Radio.Item>;
      mountRadio(
        {},
        itemRef => {
          item1 = itemRef!;
        },
        itemRef2 => {
          item2 = itemRef2!;
        }
      );
      const name = item1!.input!.getAttribute('name') ?? undefined;

      item2!.input!.should.have.attribute('name', name);
    });


    it('should select item with value equal to one provided to group', () => {
      let item: ComponentRef<typeof Radio.Item>;
      mountRadio(
        {
          onChange: () => {}, // avoid "checked without onChange" warning
          value: 'one'
        },
        itemRef => {
          item = itemRef!;
        }
      );

      item!.input!.should.have.property('checked', true);
    });

    it('should call handler for onChange event', () => {
      const onChange = sandbox.spy();
      let item: ComponentRef<typeof Radio.Item>;
      mountRadio({onChange}, itemRef => {
        item = itemRef!;
      });
      Simulate.change(item!.input!);

      onChange.should.have.been.called;
    });
  });
});
