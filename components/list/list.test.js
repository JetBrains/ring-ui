/* eslint-disable no-magic-numbers */
import React from 'react';
import ReactDOM from 'react-dom';
import {Simulate} from 'react-dom/test-utils';
import okIcon from 'jetbrains-icons/ok.svg';
import guid from 'mout/random/guid';
import {shallow, mount} from 'enzyme';

import linkStyles from '../link/link.css';

import List from './list';

const Dimension = List.ListProps.Dimension;
const XLINK_NS = 'http://www.w3.org/1999/xlink';

describe('List', () => {
  const Type = List.ListProps.Type;

  function getItemsContainer(instance) {
    return ReactDOM.findDOMNode(instance.items);
  }

  function getFirstListItem(instance) {
    return getItemsContainer(instance).childNodes[0];
  }

  const shallowList = props => shallow(<List {...props}/>);
  const mountList = props => mount(<List {...props}/>);

  describe('recalculateVisibleOptions', () => {
    const shallowOptimizedList = props => shallowList({
      renderOptimization: true,
      maxHeight: 100,
      ...props
    });

    function createItemMock(itemType) {
      return {
        rgItemType: itemType,
        label: guid()
      };
    }

    function getVisibleFrameMaxHeight(amountVisibleItems) {
      return (Dimension.ITEM_HEIGHT + Dimension.INNER_PADDING) +
        (amountVisibleItems * (Dimension.ITEM_HEIGHT)) + Dimension.MARGIN;
    }

    function getItemDimension(list, itemIndex, items) {
      const itemsSize = list.calculateItemsSize(items);
      return itemsSize[itemIndex];
    }

    function scrollPosition(_list, scrollTop) {
      if (arguments.length > 1) {
        _list.inner.scrollTop = scrollTop;
      }
      return _list.inner.scrollTop;
    }

    function stubInnerContainer(_list) {
      _list.inner = {scrollTop: 0};
      return _list;
    }

    it('should do nothing if optimization disabled', () => {
      const instance = shallowList().instance();
      sinon.spy(instance, 'setState');

      instance.recalculateVisibleOptions();

      instance.setState.should.have.been.calledWith({data: instance.state.data});
    });

    it('should not throw error if we render list with optimization and without data', () => {
      const wrapper = shallowOptimizedList();

      wrapper.should.have.state('data').deep.equal([]);
      wrapper.should.have.state('renderOptimizationSkip', null);
      wrapper.should.have.state('renderOptimizationPaddingTop', 0);
      wrapper.should.have.state('renderOptimizationPaddingBottom', 0);
    });

    it('should not throw error if we render list with optimization and pass data', () => {
      const data = [createItemMock(List.ListProps.Type.ITEM)];
      const wrapper = shallowOptimizedList({data});

      wrapper.state('data').length.should.equal(data.length);
      wrapper.should.have.state('renderOptimizationSkip', 0);
      wrapper.should.have.state('renderOptimizationPaddingTop', 0);
      wrapper.should.have.state('renderOptimizationPaddingBottom', 0);
    });

    it('should calculate the size and position of the item', () => {
      const data = [
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM)
      ];

      const instance = shallowList().instance();
      instance.recalculateVisibleOptionsWithOptimization(false, null, {data});

      expect(instance.cachedSizes.length).to.equal(data.length);
      expect(instance.cachedSizes[0]).to.deep.equal({
        begin: Dimension.MARGIN,
        size: Dimension.ITEM_HEIGHT,
        end: 28
      });
      expect(instance.cachedSizes[1]).to.deep.equal({
        begin: instance.cachedSizes[0].end,
        size: Dimension.ITEM_HEIGHT,
        end: 52
      });
    });

    it('should scroll to the active item if the item`s bottom edge out of visible frame', () => {
      //
      // [.....]
      // [.....]<----- active item
      // [.....]
      //  _____|-----> frame's top edge
      // |     |
      // |     |<----- visible frame
      // |_____|
      //       |-----> frame's bottom edge
      //

      const data = [
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM)
      ];

      const activeIndex = 1;

      const COUNT_VISIBLE_ITEMS = 2;
      const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);

      const instance = shallowList().instance();
      instance.setState({activeIndex});

      stubInnerContainer(instance);
      scrollPosition(instance, getItemDimension(instance, activeIndex, data).end + 1);

      instance.recalculateVisibleOptionsWithOptimization(false, false, {
        data,
        maxHeight
      });

      expect(scrollPosition(instance)).to.equal(14);
    });

    it('should scroll to the active item if the item`s bottom edge out of visible frame and item is first item in the list', () => {
      //
      //
      // [.....]<----- active item
      //  _____|-----> frame's top edge
      // |     |
      // |     |<----- visible frame
      // |_____|
      //       |-----> frame's bottom edge
      //

      const data = [
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM)
      ];

      const activeIndex = 0;

      const COUNT_VISIBLE_ITEMS = 2;
      const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);

      const instance = shallowList().instance();
      instance.setState({activeIndex});

      stubInnerContainer(instance);
      scrollPosition(instance, getItemDimension(instance, activeIndex, data).end + 1);

      instance.recalculateVisibleOptionsWithOptimization(false, false, {
        data,
        maxHeight
      });

      expect(scrollPosition(instance)).to.equal(0);
    });

    it('should scroll to the active item if the item`s top edge out of visible frame', () => {
      //
      //
      //  _____|-----> frame's top edge
      // |     |
      // |     |<----- visible frame
      // |_____|
      //       |-----> frame's bottom edge
      // [.....]
      // [.....]<----- active item
      // [.....]
      //

      const data = [
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM)
      ];

      const activeIndex = 3;

      const COUNT_VISIBLE_ITEMS = 2;
      const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);

      const instance = shallowList().instance();
      instance.setState({activeIndex});

      stubInnerContainer(instance);
      scrollPosition(instance, 0);

      instance.recalculateVisibleOptionsWithOptimization(false, false, {
        data,
        maxHeight
      });

      expect(scrollPosition(instance)).to.equal(62);
    });

    it('should scroll to the last item', () => {
      //
      //
      //  _____|-----> frame's top edge
      // |     |
      // |     |<----- visible frame
      // |_____|
      //       |-----> frame's bottom edge
      // [.....]
      // [.....]
      // [.....]<----- active item
      //

      const data = [
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM)
      ];

      const activeIndex = 4;

      const COUNT_VISIBLE_ITEMS = 2;
      const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);

      const instance = shallowList().instance();
      instance.setState({activeIndex});

      stubInnerContainer(instance);
      scrollPosition(instance, 0);

      instance.recalculateVisibleOptionsWithOptimization(false, false, {
        data,
        maxHeight
      });

      expect(scrollPosition(instance)).to.equal(86);
    });

    it('should scroll to the top edge of the item if the top edge out of visible frame', () => {
      //
      //                  [.....]
      //                  [.....]
      // active item----->[-----]<----- frame's top edge
      //                  |     |
      //                  |     |<----- visible frame
      //                  |_____|
      //                        |-----> frame's bottom edge
      //

      const data = [
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM)
      ];

      const activeIndex = 2;

      const COUNT_VISIBLE_ITEMS = 2;
      const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);
      const instance = shallowList().instance();
      const activeItemDimension = getItemDimension(instance, activeIndex, data);

      instance.setState({activeIndex});

      stubInnerContainer(instance);
      scrollPosition(instance, activeItemDimension.end - (Dimension.ITEM_HEIGHT / 2));

      instance.recalculateVisibleOptionsWithOptimization(false, false, {
        data,
        maxHeight
      });

      expect(scrollPosition(instance)).to.equal(activeItemDimension.begin);
    });

    it('should scroll to the bottom edge of the item if the bottom edge out of visible frame', () => {
      //
      //                  [.....]
      //                   _____|-----> frame's top edge
      //                  |     |
      //                  |     |<----- visible frame
      // active item----->[-----]<----- frame's bottom edge
      //                  [.....]
      //

      const data = [
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM)
      ];

      const activeIndex = 3;

      const COUNT_VISIBLE_ITEMS = 2;
      const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);
      const instance = shallowList().instance();
      const activeItemDimension = getItemDimension(instance, activeIndex, data);

      instance.setState({activeIndex});

      stubInnerContainer(instance);
      scrollPosition(
        instance,
        getItemDimension(
          instance,
          activeIndex - COUNT_VISIBLE_ITEMS,
          data
        ).begin + (Dimension.ITEM_HEIGHT / 2)
      );

      instance.recalculateVisibleOptionsWithOptimization(false, false, {
        data,
        maxHeight
      });

      expect(scrollPosition(instance)).
        to.
        equal(activeItemDimension.end - instance.getVisibleListHeight({maxHeight}));
    });

    describe('calculateVisibleOptions', () => {
      it('should not throw exception on empty cache', () => {
        const COUNT_VISIBLE_ITEMS = 2;
        const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);

        const instance = shallowList().instance();
        instance.calculateVisibleOptions({maxHeight}, []);
      });

      it('should calculate visible options if items less then visible height', () => {
        const data = [
          createItemMock(List.ListProps.Type.ITEM)
        ];

        const COUNT_VISIBLE_ITEMS = 2;
        const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);

        const instance = shallowList().instance();
        stubInnerContainer(instance);
        scrollPosition(instance, 0);

        const visibleOptions = instance.calculateVisibleOptions({maxHeight},
          instance.calculateItemsSize(data));

        expect(visibleOptions.paddingTop).to.equal(0);
        expect(visibleOptions.paddingBottom).to.equal(0);
        expect(visibleOptions.startIndex).to.equal(0);
        expect(visibleOptions.stopIndex).to.equal(data.length);
      });

      it('should calculate visible options if items` height equal visible height', () => {
        const data = [
          createItemMock(List.ListProps.Type.ITEM),
          createItemMock(List.ListProps.Type.ITEM)
        ];

        const COUNT_VISIBLE_ITEMS = data.length;
        const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);

        const instance = shallowList().instance();
        stubInnerContainer(instance);
        scrollPosition(instance, 0);

        const visibleOptions = instance.calculateVisibleOptions({maxHeight},
          instance.calculateItemsSize(data));

        expect(visibleOptions.paddingTop).to.equal(0);
        expect(visibleOptions.paddingBottom).to.equal(0);
        expect(visibleOptions.startIndex).to.equal(0);
        expect(visibleOptions.stopIndex).to.equal(data.length);
      });

      it('should calculate visible options if items` height more then visible height and no scroll', () => {
        const data = [
          createItemMock(List.ListProps.Type.ITEM),
          createItemMock(List.ListProps.Type.ITEM),
          createItemMock(List.ListProps.Type.ITEM),
          createItemMock(List.ListProps.Type.ITEM)
        ];

        const COUNT_HIDDEN_ITEMS = 2;
        const COUNT_VISIBLE_ITEMS = data.length - COUNT_HIDDEN_ITEMS;
        const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);

        const instance = shallowList().instance();
        stubInnerContainer(instance);
        scrollPosition(instance, 0);

        const visibleOptions = instance.calculateVisibleOptions({maxHeight},
          instance.calculateItemsSize(data));

        expect(visibleOptions.paddingTop).to.equal(0);
        expect(visibleOptions.paddingBottom).to.equal(0);
        expect(visibleOptions.startIndex).to.equal(0);
        expect(visibleOptions.stopIndex).to.equal(data.length - 1);
      });

      it('should set last item as stopIndex if count hidden items less then buffer size', () => {
        const data = [
          createItemMock(List.ListProps.Type.ITEM),
          createItemMock(List.ListProps.Type.ITEM),
          createItemMock(List.ListProps.Type.ITEM),
          createItemMock(List.ListProps.Type.ITEM)
        ];

        const COUNT_VISIBLE_ITEMS = 2;
        const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);

        const instance = shallowList().instance();
        stubInnerContainer(instance);
        scrollPosition(instance, 0);

        const visibleOptions = instance.calculateVisibleOptions({maxHeight},
          instance.calculateItemsSize(data));

        expect(visibleOptions.stopIndex).to.equal(data.length - 1);
      });

      it('should set stopIndex equal item`s index which depends from buffer`s size', () => {
        const instance = shallowList().instance();
        const data = (new Array(instance._bufferSize * 3)).join(',').
          split(',').
          map(createItemMock.bind(null, List.ListProps.Type.ITEM));

        const COUNT_VISIBLE_ITEMS = 2;
        const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);
        const expectedStopIndex = COUNT_VISIBLE_ITEMS + instance._bufferSize;

        stubInnerContainer(instance);
        scrollPosition(instance, 0);

        const visibleOptions = instance.calculateVisibleOptions({maxHeight},
          instance.calculateItemsSize(data));

        expect(visibleOptions.stopIndex).to.equal(expectedStopIndex);
      });

      it('should calculate height of unrendered below items', () => {
        const instance = shallowList().instance();
        const data = (new Array(instance._bufferSize * 3)).join(',').
          split(',').
          map(createItemMock.bind(null, List.ListProps.Type.ITEM));

        const COUNT_VISIBLE_ITEMS = 2;
        const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);
        const expectedStopIndex = COUNT_VISIBLE_ITEMS + instance._bufferSize;

        stubInnerContainer(instance);
        scrollPosition(instance, 0);

        const visibleOptions = instance.calculateVisibleOptions({maxHeight},
          instance.calculateItemsSize(data));

        expect(visibleOptions.paddingTop).to.equal(0);
        expect(visibleOptions.paddingBottom).to.equal(
          getItemDimension(instance, data.length - 1, data).end -
          getItemDimension(instance, expectedStopIndex, data).end
        );
      });

      it('should calculate height of unrendered above items', () => {
        const instance = shallowList().instance();
        const data = (new Array(instance._bufferSize * 3)).join(',').
          split(',').
          map(createItemMock.bind(null, List.ListProps.Type.ITEM));

        const COUNT_VISIBLE_ITEMS = 2;
        const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);
        const expectedStartIndex = (data.length - (COUNT_VISIBLE_ITEMS)) - instance._bufferSize;

        stubInnerContainer(instance);
        scrollPosition(
          instance,
          getItemDimension(instance, data.length - (COUNT_VISIBLE_ITEMS + 1), data).end
        );

        const visibleOptions = instance.calculateVisibleOptions({maxHeight},
          instance.calculateItemsSize(data));

        expect(visibleOptions.paddingTop).to.equal(
          getItemDimension(instance, expectedStartIndex, data).begin - Dimension.MARGIN
        );
        expect(visibleOptions.paddingBottom).to.equal(0);
      });
    });
  });

  it('should be empty by default', () => {
    const instance = mountList().instance();
    instance.inner.tagName.toLowerCase().should.equal('div');
    getItemsContainer(instance).childNodes.length.should.equal(0);
  });

  it('should check type of item', () => {
    const itemMock = {
      rgItemType: Type.SEPARATOR
    };

    List.isItemType(Type.SEPARATOR, itemMock).should.been.equal(true);
  });

  it('should support deprecated property `type`', () => {
    const itemMock = {
      type: Type.SEPARATOR
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

    expect(instance.getSelected()).to.be.undefined;
  });

  describe('should track activeIndex', () => {
    let wrapper;
    let instance;
    beforeEach(() => {
      wrapper = shallowList({
        data: [{key: 0}, {key: 1}, {key: 2}],
        activeIndex: 0,
        restoreActiveIndex: true
      });
      instance = wrapper.instance();
    });

    it('should set activeIndex from props', () => {
      wrapper.should.have.state('activeIndex', 0);
      wrapper.state('activeItem').key.should.equal(0);
    });

    it('should activate item', () => {
      instance.hoverHandler(1)();
      wrapper.should.have.state('activeIndex', 1);
      wrapper.state('activeItem').key.should.equal(1);
    });

    it('should reset activeIndex when it\'s changed in props', () => {
      instance.hoverHandler(1)();
      const activeIndex = 2;
      wrapper.setProps({
        activeIndex
      });
      wrapper.should.have.state('activeIndex', activeIndex);
      wrapper.state('activeItem').key.should.equal(activeIndex);
    });

    it('shouldn\'t reset activeIndex when it isn\'t changed in props', () => {
      instance.hoverHandler(1)();
      wrapper.setProps({
        activeIndex: 0
      });
      wrapper.should.have.state('activeIndex', 1);
      wrapper.state('activeItem').key.should.equal(1);
    });
  });

  describe('should render items', () => {
    it('should render for empty element', () => {
      const instance = mountList({
        data: [
          {}
        ]
      }).instance();
      getFirstListItem(instance).should.have.class('ring-list__item_action');
      getFirstListItem(instance).innerText.should.equal('');
    });

    it('should render instance item if type is not defined', () => {
      const instance = mountList({
        data: [
          {label: 'Hello!'}
        ]
      }).instance();

      instance.inner.querySelector('.ring-list__item').should.be.defined;
    });

    it('should render a if href defined', () => {
      const instance = mountList({
        data: [
          {label: 'Hello!', href: 'http://www.jetbrains.com'}
        ]
      }).instance();

      getFirstListItem(instance).should.have.class(linkStyles.link);
      getFirstListItem(instance).innerHTML.should.equal('Hello!');
      getFirstListItem(instance).tagName.toLowerCase().should.equal('a');
      getFirstListItem(instance).getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render a if url defined', () => {
      const instance = mountList({
        data: [
          {label: 'Hello!', url: 'http://www.jetbrains.com'}
        ]
      }).instance();

      getFirstListItem(instance).should.have.class(linkStyles.link);
      getFirstListItem(instance).innerHTML.should.equal('Hello!');
      getFirstListItem(instance).tagName.toLowerCase().should.equal('a');
      getFirstListItem(instance).getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render separator', () => {
      const instance = mountList({
        data: [
          {rgItemType: List.ListProps.Type.SEPARATOR}
        ]
      }).instance();

      getFirstListItem(instance).should.have.class('ring-list__separator');
    });

    it('should render title', () => {
      const instance = mountList({
        data: [
          {type: List.ListProps.Type.TITLE, label: 'Foo', description: 'Bar'}
        ]
      }).instance();

      getFirstListItem(instance).should.have.text('FooBar');
    });

    it('should render pseudo link if link without href', () => {
      const instance = mountList({
        data: [
          {label: 'Hello!', rgItemType: List.ListProps.Type.LINK}
        ]
      }).instance();

      getFirstListItem(instance).should.have.class(linkStyles.link);
      getFirstListItem(instance).should.have.class(linkStyles.pseudo);
      getFirstListItem(instance).innerHTML.should.equal('Hello!');
      getFirstListItem(instance).tagName.toLowerCase().should.equal('a');
    });

    it('should not render icon if not provided', () => {
      const instance = mountList({
        data: [
          {label: 'Hello!', type: List.ListProps.Type.ITEM}
        ]
      }).instance();

      getFirstListItem(instance).should.not.contain('.ring-list__icon');
    });

    it('should render icon if provided', () => {
      const instance = mountList({
        data: [
          {label: 'Hello!', icon: 'http://some.url/', type: List.ListProps.Type.ITEM}
        ]
      }).instance();

      const icon = getFirstListItem(instance).querySelector('.ring-list__icon');
      expect(icon.style.backgroundImage).to.contain('http://some.url');
    });

    it('should not render glyph if not provided', () => {
      const instance = mountList({
        data: [
          {label: 'Hello!', type: List.ListProps.Type.ITEM}
        ]
      }).instance();

      should.not.exist(getFirstListItem(instance).query('use'));
    });

    it('should render glyph if provided', () => {
      const instance = mountList({
        data: [
          {label: 'Hello!', glyph: okIcon, type: List.ListProps.Type.ITEM}
        ]
      }).instance();

      getFirstListItem(instance).query('use').getAttributeNS(XLINK_NS, 'href').should.equal(okIcon);
    });

    it('should throw error on unknown type', () => {
      expect(() => {
        const instance = mountList({
          data: [
            {label: 'Hello!', rgItemType: 'none'}
          ]
        }).instance();

        getFirstListItem(instance).should.have.class('ring-link');
        getFirstListItem(instance).innerHTML.should.equal('Hello!');
        getFirstListItem(instance).tagName.toLowerCase().should.equal('span');
      }).to.throw(Error, 'Unknown menu element type: none');
    });

    it('should handle click', () => {
      const clicked = sinon.stub();

      const instance = mountList({
        data: [
          {label: 'Hello!', onClick: clicked}
        ]
      }).instance();

      Simulate.click(getFirstListItem(instance));
      clicked.should.have.been.called;
    });

    it('should handle select', () => {
      const onSelect = sinon.stub();

      const instance = mountList({
        onSelect,
        data: [{label: 'Hello!'}]
      }).instance();

      Simulate.click(getFirstListItem(instance));
      onSelect.should.have.been.called;
    });

    it('Should support custom elements', () => {
      const instance = mountList({
        data: [
          {
            template: React.createElement('span', {}, 'custom item'),
            rgItemType: List.ListProps.Type.CUSTOM
          }
        ]
      }).instance();
      getFirstListItem(instance).should.contain.text('custom item');
    });

    it('Should support click on custom elements', () => {
      const onClick = sinon.stub();
      const instance = mountList({
        data: [
          {
            template: React.createElement('span', {}, 'custom item'),
            rgItemType: List.ListProps.Type.CUSTOM,
            onClick
          }
        ]
      }).instance();
      Simulate.click(getFirstListItem(instance));
      onClick.should.have.been.clicked;
    });

    it('Should support disable property for custom elements', () => {
      const instance = mountList({
        data: [
          {
            template: React.createElement('span', {}, 'custom item'),
            rgItemType: List.ListProps.Type.CUSTOM,
            disabled: true
          }
        ]
      }).instance();
      getFirstListItem(instance).should.not.have.class('ring-list__item_action');
    });
  });
});
