/* eslint-disable no-magic-numbers */
import React from 'react';
import ReactDOM from 'react-dom';
import {renderIntoDocument, Simulate} from 'react-dom/test-utils';
import okIcon from 'jetbrains-icons/ok.svg';
import guid from 'mout/random/guid';

import linkStyles from '../link/link.css';

import List from './list';

const Dimension = List.ListProps.Dimension;
const XLINK_NS = 'http://www.w3.org/1999/xlink';

describe('List', () => {
  const Type = List.ListProps.Type;
  let list;

  function getItemsContainer() {
    return ReactDOM.findDOMNode(list.items);
  }

  function getFirstListItem() {
    return getItemsContainer().childNodes[0];
  }

  beforeEach(() => {
    list = renderIntoDocument(React.createElement(List));
  });

  describe('recalculateVisibleOptions', () => {
    function enableOptimization(_, props) {
      list = renderIntoDocument(React.createElement(List, Object.assign({
        renderOptimization: true,
        maxHeight: 100
      }, props)));
      return list;
    }

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

    function getItemDimension(itemIndex, items) {
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
      sinon.spy(list, 'setState');

      list.recalculateVisibleOptions();

      list.setState.should.have.been.calledWith({data: list.state.data});
    });

    it('should not throw error if we render list with optimization and without data', () => {
      list = enableOptimization(list);

      expect(list.state.data).to.deep.equal([]);
      expect(list.state.renderOptimizationSkip).to.equal(null);
      expect(list.state.renderOptimizationPaddingTop).to.equal(0);
      expect(list.state.renderOptimizationPaddingBottom).to.equal(0);
    });

    it('should not throw error if we render list with optimization and pass data', () => {
      const data = [createItemMock(List.ListProps.Type.ITEM)];
      list = enableOptimization(list, {data});

      expect(list.state.data.length).to.equal(data.length);
      expect(list.state.renderOptimizationSkip).to.equal(0);
      expect(list.state.renderOptimizationPaddingTop).to.equal(0);
      expect(list.state.renderOptimizationPaddingBottom).to.equal(0);
    });

    it('should calculate the size and position of the item', () => {
      const data = [
        createItemMock(List.ListProps.Type.ITEM),
        createItemMock(List.ListProps.Type.ITEM)
      ];

      list.recalculateVisibleOptionsWithOptimization(false, null, {data});

      expect(list.cachedSizes.length).to.equal(data.length);
      expect(list.cachedSizes[0]).to.deep.equal({
        begin: Dimension.MARGIN,
        size: Dimension.ITEM_HEIGHT,
        end: 28
      });
      expect(list.cachedSizes[1]).to.deep.equal({
        begin: list.cachedSizes[0].end,
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

      list.setState({activeIndex});

      stubInnerContainer(list);
      scrollPosition(list, getItemDimension(activeIndex, data).end + 1);

      list.recalculateVisibleOptionsWithOptimization(false, false, {
        data,
        maxHeight
      });

      expect(scrollPosition(list)).to.equal(14);
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

      list.setState({activeIndex});

      stubInnerContainer(list);
      scrollPosition(list, getItemDimension(activeIndex, data).end + 1);

      list.recalculateVisibleOptionsWithOptimization(false, false, {
        data,
        maxHeight
      });

      expect(scrollPosition(list)).to.equal(0);
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

      list.setState({activeIndex});

      stubInnerContainer(list);
      scrollPosition(list, 0);

      list.recalculateVisibleOptionsWithOptimization(false, false, {
        data,
        maxHeight
      });

      expect(scrollPosition(list)).to.equal(62);
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

      list.setState({activeIndex});

      stubInnerContainer(list);
      scrollPosition(list, 0);

      list.recalculateVisibleOptionsWithOptimization(false, false, {
        data,
        maxHeight
      });

      expect(scrollPosition(list)).to.equal(86);
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
      const activeItemDimension = getItemDimension(activeIndex, data);

      list.setState({activeIndex});

      stubInnerContainer(list);
      scrollPosition(list, activeItemDimension.end - (Dimension.ITEM_HEIGHT / 2));

      list.recalculateVisibleOptionsWithOptimization(false, false, {
        data,
        maxHeight
      });

      expect(scrollPosition(list)).to.equal(activeItemDimension.begin);
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
      const activeItemDimension = getItemDimension(activeIndex, data);

      list.setState({activeIndex});

      stubInnerContainer(list);
      scrollPosition(list, getItemDimension(activeIndex - COUNT_VISIBLE_ITEMS, data).begin +
        (Dimension.ITEM_HEIGHT / 2));

      list.recalculateVisibleOptionsWithOptimization(false, false, {
        data,
        maxHeight
      });

      expect(scrollPosition(list)).
        to.
        equal(activeItemDimension.end - list.getVisibleListHeight({maxHeight}));
    });

    describe('calculateVisibleOptions', () => {
      it('should not throw exception on empty cache', () => {
        const COUNT_VISIBLE_ITEMS = 2;
        const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);

        list.calculateVisibleOptions({maxHeight}, []);
      });

      it('should calculate visible options if items less then visible height', () => {
        const data = [
          createItemMock(List.ListProps.Type.ITEM)
        ];

        const COUNT_VISIBLE_ITEMS = 2;
        const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);

        stubInnerContainer(list);
        scrollPosition(list, 0);

        const visibleOptions = list.calculateVisibleOptions({maxHeight},
          list.calculateItemsSize(data));

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

        stubInnerContainer(list);
        scrollPosition(list, 0);

        const visibleOptions = list.calculateVisibleOptions({maxHeight},
          list.calculateItemsSize(data));

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

        stubInnerContainer(list);
        scrollPosition(list, 0);

        const visibleOptions = list.calculateVisibleOptions({maxHeight},
          list.calculateItemsSize(data));

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

        stubInnerContainer(list);
        scrollPosition(list, 0);

        const visibleOptions = list.calculateVisibleOptions({maxHeight},
          list.calculateItemsSize(data));

        expect(visibleOptions.stopIndex).to.equal(data.length - 1);
      });

      it('should set stopIndex equal item`s index which depends from buffer`s size', () => {
        const data = (new Array(list._bufferSize * 3)).join(',').
          split(',').
          map(createItemMock.bind(null, List.ListProps.Type.ITEM));

        const COUNT_VISIBLE_ITEMS = 2;
        const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);
        const expectedStopIndex = COUNT_VISIBLE_ITEMS + list._bufferSize;

        stubInnerContainer(list);
        scrollPosition(list, 0);

        const visibleOptions = list.calculateVisibleOptions({maxHeight},
          list.calculateItemsSize(data));

        expect(visibleOptions.stopIndex).to.equal(expectedStopIndex);
      });

      it('should calculate height of unrendered below items', () => {
        const data = (new Array(list._bufferSize * 3)).join(',').
          split(',').
          map(createItemMock.bind(null, List.ListProps.Type.ITEM));

        const COUNT_VISIBLE_ITEMS = 2;
        const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);
        const expectedStopIndex = COUNT_VISIBLE_ITEMS + list._bufferSize;

        stubInnerContainer(list);
        scrollPosition(list, 0);

        const visibleOptions = list.calculateVisibleOptions({maxHeight},
          list.calculateItemsSize(data));

        expect(visibleOptions.paddingTop).to.equal(0);
        expect(visibleOptions.paddingBottom).to.equal(
          getItemDimension(data.length - 1, data).end -
          getItemDimension(expectedStopIndex, data).end
        );
      });

      it('should calculate height of unrendered above items', () => {
        const data = (new Array(list._bufferSize * 3)).join(',').
          split(',').
          map(createItemMock.bind(null, List.ListProps.Type.ITEM));

        const COUNT_VISIBLE_ITEMS = 2;
        const maxHeight = getVisibleFrameMaxHeight(COUNT_VISIBLE_ITEMS);
        const expectedStartIndex = (data.length - (COUNT_VISIBLE_ITEMS)) - list._bufferSize;

        stubInnerContainer(list);
        scrollPosition(list, getItemDimension(data.length - (COUNT_VISIBLE_ITEMS + 1), data).end);

        const visibleOptions = list.calculateVisibleOptions({maxHeight},
          list.calculateItemsSize(data));

        expect(visibleOptions.paddingTop).to.equal(
          getItemDimension(expectedStartIndex, data).begin - Dimension.MARGIN
        );
        expect(visibleOptions.paddingBottom).to.equal(0);
      });
    });
  });

  it('should be empty by default', () => {
    list.inner.tagName.toLowerCase().should.equal('div');
    getItemsContainer().childNodes.length.should.equal(0);
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
    list.rerender({
      data: [
        {}
      ],
      activeIndex: 0
    });

    list.clearSelected();

    expect(list.getSelected()).to.be.undefined;
  });

  describe('should track activeIndex', () => {
    beforeEach(() => {
      list = renderIntoDocument(React.createElement(List, {
        data: [{key: 0}, {key: 1}, {key: 2}],
        activeIndex: 0,
        restoreActiveIndex: true
      }));
    });

    it('should set activeIndex from props', () => {
      list.state.activeIndex.should.equal(0);
      list.state.activeItem.key.should.equal(0);
    });

    it('should activate item', () => {
      list.hoverHandler(1)();
      list.state.activeIndex.should.equal(1);
      list.state.activeItem.key.should.equal(1);
    });

    it('should reset activeIndex when it\'s changed in props', () => {
      list.hoverHandler(1)();
      const activeIndex = 2;
      list.rerender({
        activeIndex
      });
      list.state.activeIndex.should.equal(activeIndex);
      list.state.activeItem.key.should.equal(activeIndex);
    });

    it('shouldn\'t reset activeIndex when it isn\'t changed in props', () => {
      list.hoverHandler(1)();
      list.rerender({
        activeIndex: 0
      });
      list.state.activeIndex.should.equal(1);
      list.state.activeItem.key.should.equal(1);
    });
  });

  describe('should render items', () => {
    it('should render for empty element', () => {
      list.rerender({
        data: [
          {}
        ]
      });

      getFirstListItem().should.have.class('ring-list__item_action');
      getFirstListItem().innerText.should.equal('');
    });

    it('should render list item if type is not defined', () => {
      list.rerender({
        data: [
          {label: 'Hello!'}
        ]
      });

      list.inner.querySelector('.ring-list__item').should.be.defined;
    });

    it('should render a if href defined', () => {
      list.rerender({
        data: [
          {label: 'Hello!', href: 'http://www.jetbrains.com'}
        ]
      });

      getFirstListItem().should.have.class(linkStyles.link);
      getFirstListItem().innerHTML.should.equal('Hello!');
      getFirstListItem().tagName.toLowerCase().should.equal('a');
      getFirstListItem().getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render a if url defined', () => {
      list.rerender({
        data: [
          {label: 'Hello!', url: 'http://www.jetbrains.com'}
        ]
      });

      getFirstListItem().should.have.class(linkStyles.link);
      getFirstListItem().innerHTML.should.equal('Hello!');
      getFirstListItem().tagName.toLowerCase().should.equal('a');
      getFirstListItem().getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render separator', () => {
      list.rerender({
        data: [
          {rgItemType: List.ListProps.Type.SEPARATOR}
        ]
      });

      getFirstListItem().should.have.class('ring-list__separator');
    });

    it('should render title', () => {
      list.rerender({
        data: [
          {type: List.ListProps.Type.TITLE, label: 'Foo', description: 'Bar'}
        ]
      });

      getFirstListItem().should.have.text('FooBar');
    });

    it('should render pseudo link if link without href', () => {
      list.rerender({
        data: [
          {label: 'Hello!', rgItemType: List.ListProps.Type.LINK}
        ]
      });

      getFirstListItem().should.have.class(linkStyles.link);
      getFirstListItem().should.have.class(linkStyles.pseudo);
      getFirstListItem().innerHTML.should.equal('Hello!');
      getFirstListItem().tagName.toLowerCase().should.equal('a');
    });

    it('should not render icon if not provided', () => {
      list.rerender({
        data: [
          {label: 'Hello!', type: List.ListProps.Type.ITEM}
        ]
      });

      getFirstListItem().should.not.contain('.ring-list__icon');
    });

    it('should render icon if provided', () => {
      list.rerender({
        data: [
          {label: 'Hello!', icon: 'http://some.url/', type: List.ListProps.Type.ITEM}
        ]
      });

      const icon = getFirstListItem().querySelector('.ring-list__icon');
      expect(icon.style.backgroundImage).to.contain('http://some.url');
    });

    it('should not render glyph if not provided', () => {
      list.rerender({
        data: [
          {label: 'Hello!', type: List.ListProps.Type.ITEM}
        ]
      });

      should.not.exist(getFirstListItem().query('use'));
    });

    it('should render glyph if provided', () => {
      list.rerender({
        data: [
          {label: 'Hello!', glyph: okIcon, type: List.ListProps.Type.ITEM}
        ]
      });

      getFirstListItem().query('use').getAttributeNS(XLINK_NS, 'href').should.equal(okIcon);
    });

    it('should throw error on unknown type', () => {
      expect(() => {
        list.rerender({
          data: [
            {label: 'Hello!', rgItemType: 'none'}
          ]
        });

        getFirstListItem().should.have.class('ring-link');
        getFirstListItem().innerHTML.should.equal('Hello!');
        getFirstListItem().tagName.toLowerCase().should.equal('span');
      }).to.throw(Error, 'Unknown menu element type: none');
    });

    it('should handle click', () => {
      const clicked = sinon.stub();

      list.rerender({
        data: [
          {label: 'Hello!', onClick: clicked}
        ]
      });

      Simulate.click(getFirstListItem());
      clicked.should.have.been.called;
    });

    it('should handle select', () => {
      const onSelect = sinon.stub();

      list.rerender({
        onSelect,
        data: [{label: 'Hello!'}]
      });

      Simulate.click(getFirstListItem());
      onSelect.should.have.been.called;
    });

    it('Should support custom elements', () => {
      list.rerender({
        data: [
          {
            template: React.createElement('span', {}, 'custom item'),
            rgItemType: List.ListProps.Type.CUSTOM
          }
        ]
      });
      getFirstListItem().should.contain.text('custom item');
    });

    it('Should support click on custom elements', () => {
      const onClick = sinon.stub();
      list.rerender({
        data: [
          {
            template: React.createElement('span', {}, 'custom item'),
            rgItemType: List.ListProps.Type.CUSTOM,
            onClick
          }
        ]
      });
      Simulate.click(getFirstListItem());
      onClick.should.have.been.clicked;
    });

    it('Should support disable property for custom elements', () => {
      list.rerender({
        data: [
          {
            template: React.createElement('span', {}, 'custom item'),
            rgItemType: List.ListProps.Type.CUSTOM,
            disabled: true
          }
        ]
      });
      getFirstListItem().should.not.have.class('ring-list__item_action');
    });
  });
});
