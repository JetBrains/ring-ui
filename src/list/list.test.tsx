import {createElement} from 'react';
import {shallow, mount, ReactWrapper} from 'enzyme';
import VirtualizedList, {ListRowProps} from 'react-virtualized/dist/es/List';
import checkmarkIcon from '@jetbrains/icons/checkmark';

import getUID from '../global/get-uid';
import Icon from '../icon/icon';

import List, {ListAttrs, ListProps, ListState} from './list';
import ListItem from './list__item';
import ListCustom from './list__custom';
import ListLink from './list__link';
import ListTitle from './list__title';
import ListSeparator from './list__separator';
import styles from './list.css';
import {Type} from './consts';

const RAF_TIMEOUT = 100;

describe('List', () => {
  const shallowList = (props: ListAttrs) => shallow<List>(<List {...props}/>);
  const mountList = (props: ListAttrs) => mount<List>(<List {...props}/>);

  describe('virtualized', () => {
    function createItemMock(itemType: Type) {
      return {
        rgItemType: itemType,
        label: getUID('list-test-')
      };
    }

    it('should pad the list with top/bottom margins', () => {
      const data = [
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM)
      ];

      const instance = shallowList({data}).instance();

      shallow(
        instance.renderItem({index: 0}),
        {disableLifecycleMethods: true}
      ).should.have.tagName('div');
      shallow(
        instance.renderItem({index: 3}),
        {disableLifecycleMethods: true}
      ).should.have.tagName('div');
    });

    it('should apply styles from virtualized', () => {
      const data = [
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM)
      ];

      const instance = shallowList({data}).instance();
      const style = {
        top: -1000
      };
      const parent = {} as ListRowProps['parent'];

      shallow(
        instance.renderItem({index: 0, style, parent}),
        {disableLifecycleMethods: true}
      ).should.have.style('top', '-1000px');
      shallow(
        instance.renderItem({index: 1, style, parent}),
        {disableLifecycleMethods: true}
      ).should.have.style('top', '-1000px');
      shallow(
        instance.renderItem({index: 2, style, parent}),
        {disableLifecycleMethods: true}
      ).should.have.style('top', '-1000px');
      shallow(
        instance.renderItem({index: 3, style, parent}),
        {disableLifecycleMethods: true}
      ).should.have.style('top', '-1000px');
    });

    it('should scroll to the active item', () => {
      const data = [
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM)
      ];

      const activeIndex = 1;

      const wrapper = mountList({data});
      wrapper.setState({
        activeIndex,
        needScrollToActive: true
      });

      wrapper.find(VirtualizedList).should.have.prop('scrollToIndex', 2);
    });

    it('should\'n scroll to the active item when needScrollToActive is false', () => {
      const data = [
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM)
      ];

      const activeIndex = 1;

      const wrapper = mountList({data});
      wrapper.setState({
        activeIndex,
        needScrollToActive: false
      });

      wrapper.find(VirtualizedList).should.not.have.prop('scrollToIndex', 2);
    });
  });

  it('should check type of item', () => {
    const itemMock = {
      rgItemType: Type.SEPARATOR
    };

    List.isItemType(Type.SEPARATOR, itemMock).should.been.equal(true);
  });

  it('by default item has type equal ITEM', () => {
    const itemMock = {};

    List.isItemType(Type.ITEM, itemMock).should.been.equal(true);
    List.isItemType(Type.SEPARATOR, itemMock).should.been.equal(false);
  });

  it('should deselect item', () => {
    const instance = shallowList({
      data: [
        {}
      ],
      activeIndex: 0
    }).instance();

    instance.clearSelected();

    should.not.exist(instance.getSelected());
  });

  describe('should track activeIndex', () => {
    let wrapper: ReactWrapper<ListProps, ListState, List>;
    let instance: List;
    beforeEach(() => {
      sandbox.stub(window, 'requestAnimationFrame').callsFake(cb => {
        cb(0);
        return 0;
      });
      wrapper = mountList({
        data: [{key: 0}, {key: 1}, {key: 2}],
        activeIndex: 0,
        restoreActiveIndex: true
      });
      instance = wrapper.instance();
    });

    it('should set activeIndex from props', () => {
      wrapper.should.have.state('activeIndex', 0);
      (0).should.equal(wrapper.state('activeItem')?.key);
    });

    it('should activate item', async () => {
      instance.hoverHandler(1)();
      await new Promise<void>(resolve => setTimeout(resolve, RAF_TIMEOUT));
      wrapper.should.have.state('activeIndex', 1);
      (1).should.equal(wrapper.state('activeItem')?.key);
    });

    it('should reset activeIndex when it\'s changed in props', () => {
      instance.hoverHandler(1)();
      const activeIndex = 2;
      wrapper.setProps({
        activeIndex
      });
      wrapper.should.have.state('activeIndex', activeIndex);
      activeIndex.should.equal(wrapper.state('activeItem')?.key);
    });

    it('should reset activeIndex when data changed', () => {
      instance.hoverHandler(1)();
      wrapper.setProps({
        data: [{key: 5}]
      });
      wrapper.should.have.state('activeIndex', null);
      wrapper.should.have.state('activeItem', null);
    });

    it('shouldn\'t reset activeIndex when it isn\'t changed in props', async () => {
      instance.hoverHandler(1)();
      wrapper.setProps({
        activeIndex: 0
      });
      await new Promise<void>(resolve => setTimeout(resolve, RAF_TIMEOUT));
      wrapper.should.have.state('activeIndex', 1);
      (1).should.equal(wrapper.state('activeItem')?.key);
    });
  });

  describe('should render items', () => {
    const mountFirstItem = (instance: List) =>
      mount(instance.renderItem({index: 1}));

    it('should render for empty element', () => {
      const instance = shallowList({
        data: [
          {}
        ]
      }).instance();
      const firstItemWrapper = mountFirstItem(instance).find(ListItem).find('button');
      firstItemWrapper.should.have.className(styles.action);
      firstItemWrapper.should.have.text('');
    });

    it('should render instance item if type is not defined', () => {
      const instance = shallowList({
        data: [
          {label: 'Hello!'}
        ]
      }).instance();

      mount(instance.renderItem({index: 1})).
        should.have.descendants('[data-test~="ring-list-item"]');
    });

    it('should render a if href defined', () => {
      const instance = shallowList({
        data: [
          {label: 'Hello!', href: 'http://www.jetbrains.com'}
        ]
      }).instance();

      const firstItemWrapper = mountFirstItem(instance).find(ListLink);
      firstItemWrapper.should.exist;
      firstItemWrapper.should.have.data('test', 'ring-link ring-list-link ring-list-item');
      firstItemWrapper.should.have.text('Hello!');
      firstItemWrapper.should.have.tagName('a');
      firstItemWrapper.should.have.attr('href', 'http://www.jetbrains.com');
    });

    it('should render a if url defined', () => {
      const instance = shallowList({
        data: [
          {label: 'Hello!', url: 'http://www.jetbrains.com'}
        ]
      }).instance();

      const firstItemWrapper = mountFirstItem(instance).find(ListLink);
      firstItemWrapper.should.exist;
      firstItemWrapper.should.have.data('test', 'ring-link ring-list-link ring-list-item');
      firstItemWrapper.should.have.text('Hello!');
      firstItemWrapper.should.have.tagName('a');
      firstItemWrapper.should.have.attr('href', 'http://www.jetbrains.com');
    });

    it('should render separator', () => {
      const instance = shallowList({
        data: [
          {rgItemType: List.ListProps.Type.SEPARATOR, label: 'test'}
        ]
      }).instance();

      const firstItemWrapper = mountFirstItem(instance).find(ListSeparator);
      firstItemWrapper.should.exist;
      firstItemWrapper.should.have.className(styles.separator);
    });

    it('should render title', () => {
      const instance = shallowList({
        data: [
          {rgItemType: List.ListProps.Type.TITLE, label: 'Foo', description: 'Bar'}
        ]
      }).instance();

      const firstItemWrapper = mountFirstItem(instance).find(ListTitle);
      firstItemWrapper.should.exist;
      firstItemWrapper.should.have.text('FooBar');
    });

    it('should render pseudo link if link without href', () => {
      const instance = shallowList({
        data: [
          {label: 'Hello!', rgItemType: List.ListProps.Type.LINK}
        ]
      }).instance();

      const firstItemWrapper = mountFirstItem(instance).find(ListLink);
      firstItemWrapper.should.exist;
      firstItemWrapper.should.have.data('test', 'ring-link ring-list-link ring-list-item');
      firstItemWrapper.should.have.text('Hello!');
      firstItemWrapper.should.have.tagName('button');
    });

    it('should not render icon if not provided', () => {
      const instance = shallowList({
        data: [
          {label: 'Hello!', rgItemType: List.ListProps.Type.ITEM}
        ]
      }).instance();

      const firstItemWrapper = mountFirstItem(instance).find(ListItem);
      firstItemWrapper.should.not.have.descendants(`.${styles.icon}`);
    });

    it('should render icon if provided', () => {
      const instance = shallowList({
        data: [
          {label: 'Hello!', icon: 'http://some.url/', rgItemType: List.ListProps.Type.ITEM}
        ]
      }).instance();

      const icon = mountFirstItem(instance).find(`.${styles.icon}`);
      const backgroundImage = icon.prop('style')?.backgroundImage;
      should.exist(backgroundImage);
      backgroundImage?.should.contain('http://some.url');
    });

    it('should not render glyph if not provided', () => {
      const instance = shallowList({
        data: [
          {label: 'Hello!', rgItemType: List.ListProps.Type.ITEM}
        ]
      }).instance();

      mountFirstItem(instance).find('use').should.be.empty;
    });

    it('should render glyph if provided', () => {
      const instance = shallowList({
        data: [
          {label: 'Hello!', glyph: checkmarkIcon, rgItemType: List.ListProps.Type.ITEM}
        ]
      }).instance();

      mountFirstItem(instance).find(Icon).should.have.prop('glyph', checkmarkIcon);
    });

    it('should throw error on unknown type', () => {
      (() => {
        const instance = shallowList({
          data: [
            // @ts-expect-error testing a wrong usage
            {label: 'Hello!', rgItemType: 'none'}
          ]
        }).instance();

        mountFirstItem(instance);
      }).should.throw(Error, 'Unknown menu element type: none');
    });

    it('should handle click', () => {
      const clicked = sandbox.stub();

      const instance = mountList({
        data: [
          {label: 'Hello!', onClick: clicked}
        ]
      }).instance();

      const firstItemWrapper = mountFirstItem(instance).find(ListItem).find('button');
      firstItemWrapper.simulate('click');
      clicked.should.have.been.called;
    });

    it('should handle select', () => {
      const onSelect = sandbox.stub();

      const instance = mountList({
        onSelect,
        data: [{label: 'Hello!'}]
      }).instance();

      const firstItemWrapper = mountFirstItem(instance).find(ListItem).find('button');
      firstItemWrapper.simulate('click');
      onSelect.should.have.been.called;
    });

    it('Should support custom elements', () => {
      const instance = shallowList({
        data: [
          {
            template: createElement('span', {}, 'custom item'),
            key: 1,
            rgItemType: List.ListProps.Type.CUSTOM
          }
        ]
      }).instance();

      const firstItemWrapper = mountFirstItem(instance).find(ListCustom);
      firstItemWrapper.should.have.text('custom item');
    });

    it('Should support click on custom elements', () => {
      const onClick = sandbox.stub();
      const instance = mountList({
        data: [
          {
            template: createElement('span', {}, 'custom item'),
            key: 1,
            rgItemType: List.ListProps.Type.CUSTOM,
            onClick
          }
        ]
      }).instance();

      const firstItemWrapper = mountFirstItem(instance).find(ListCustom);
      firstItemWrapper.simulate('click');
      onClick.should.have.been.called;
    });

    it('Should support disable property for custom elements', () => {
      const instance = shallowList({
        data: [
          {
            template: createElement('span', {}, 'custom item'),
            key: 1,
            rgItemType: List.ListProps.Type.CUSTOM,
            disabled: true
          }
        ]
      }).instance();

      const firstItemWrapper = mountFirstItem(instance).find(ListCustom);
      firstItemWrapper.should.not.have.className(styles.action);
    });
  });
});
