import {ComponentRef, Ref} from 'react';

import {render, screen, fireEvent} from '@testing-library/react';

import {RadioProps} from './radio__item';

import Radio from './radio';

describe('Radio', () => {
  const factory = (
    props?: RadioProps,
    refOne?: Ref<ComponentRef<typeof Radio.Item>>,
    refTwo?: Ref<ComponentRef<typeof Radio.Item>>,
  ) => (
    <Radio {...props}>
      <Radio.Item ref={refOne} value="one">
        {'One'}
      </Radio.Item>
      <Radio.Item ref={refTwo} value="two">
        {'Two'}
      </Radio.Item>
      <Radio.Item value="three">{'Three'}</Radio.Item>
    </Radio>
  );
  const renderRadio = (
    props?: RadioProps,
    refOne?: Ref<ComponentRef<typeof Radio.Item>>,
    refTwo?: Ref<ComponentRef<typeof Radio.Item>>,
  ) => render(factory(props, refOne, refTwo));

  it('should create component', () => {
    renderRadio();
    expect(screen.getAllByRole('radio')).to.exist;
  });

  it('should pass only child as is', () => {
    render(
      <Radio>
        <section />
      </Radio>,
    );

    expect(document.querySelector('section')!).to.exist;
  });

  describe('refs', () => {
    it('should generate same name for items', () => {
      let item1: ComponentRef<typeof Radio.Item>;
      let item2: ComponentRef<typeof Radio.Item>;
      renderRadio(
        {},
        itemRef => {
          item1 = itemRef!;
        },
        itemRef2 => {
          item2 = itemRef2!;
        },
      );
      const name = item1!.input!.getAttribute('name') ?? undefined;

      expect(item2!.input!).to.have.attribute('name', name);
    });

    it('should select item with value equal to one provided to group', () => {
      let item: ComponentRef<typeof Radio.Item>;
      renderRadio(
        {
          onChange: () => {}, // avoid "checked without onChange" warning
          value: 'one',
        },
        itemRef => {
          item = itemRef!;
        },
      );

      expect(item!.input!).to.have.property('checked', true);
    });

    it('should call handler for onChange event', () => {
      const onChange = sandbox.spy();
      let item: ComponentRef<typeof Radio.Item>;
      renderRadio({onChange}, itemRef => {
        item = itemRef!;
      });
      fireEvent.click(item!.input!);

      expect(onChange).to.have.been.called;
    });
  });
});
