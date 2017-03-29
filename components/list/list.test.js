import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import List from './list';

import styles from './list.css';
import linkStyles from '../link/link.css';

import okIcon from 'jetbrains-icons/ok.svg';
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
    list = TestUtils.renderIntoDocument(React.createElement(List));
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
    list.rerender({data: [
      {}
    ],
      activeIndex: 0});

    list.clearSelected();

    expect(list.getSelected()).to.be.undefined;
  });

  describe('should track activeIndex', () => {
    beforeEach(() => {
      list = TestUtils.renderIntoDocument(React.createElement(List, {
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
      list.rerender({data: [
        {}
      ]});

      getFirstListItem().should.have.class(styles.action);
      getFirstListItem().innerText.should.equal('');
    });

    it('should render list item if type is not defined', () => {
      list.rerender({data: [
        {label: 'Hello!'}
      ]});

      list.inner.querySelector('[data-test=ring-list-item]').should.be.defined;
    });

    it('should render a if href defined', () => {
      list.rerender({data: [
        {label: 'Hello!', href: 'http://www.jetbrains.com'}
      ]});

      getFirstListItem().should.match('[data-test=ring-link]');
      getFirstListItem().innerHTML.should.equal('Hello!');
      getFirstListItem().tagName.toLowerCase().should.equal('a');
      getFirstListItem().getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render a if url defined', () => {
      list.rerender({data: [
        {label: 'Hello!', url: 'http://www.jetbrains.com'}
      ]});

      getFirstListItem().should.match('[data-test=ring-link]');
      getFirstListItem().innerHTML.should.equal('Hello!');
      getFirstListItem().tagName.toLowerCase().should.equal('a');
      getFirstListItem().getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render separator', () => {
      list.rerender({data: [
        {rgItemType: List.ListProps.Type.SEPARATOR}
      ]});

      getFirstListItem().should.have.class(styles.separator);
    });

    it('should render title', () => {
      list.rerender({data: [
        {type: List.ListProps.Type.TITLE, label: 'Foo', description: 'Bar'}
      ]});

      getFirstListItem().should.have.text('FooBar');
    });

    it('should render pseudo link if link without href', () => {
      list.rerender({data: [
        {label: 'Hello!', rgItemType: List.ListProps.Type.LINK}
      ]});

      getFirstListItem().should.match(`[data-test=ring-link].${linkStyles.pseudo}`);
      getFirstListItem().innerHTML.should.equal('Hello!');
      getFirstListItem().tagName.toLowerCase().should.equal('a');
    });

    it('should not render icon if not provided', () => {
      list.rerender({data: [
        {label: 'Hello!', type: List.ListProps.Type.ITEM}
      ]});

      getFirstListItem().should.not.contain(`.${styles.icon}`);
    });

    it('should render icon if provided', () => {
      list.rerender({data: [
        {label: 'Hello!', icon: 'http://some.url/', type: List.ListProps.Type.ITEM}
      ]});

      const icon = getFirstListItem().querySelector(`.${styles.icon}`);
      expect(icon.style.backgroundImage).to.contain('http://some.url');
    });

    it('should not render glyph if not provided', () => {
      list.rerender({data: [
        {label: 'Hello!', type: List.ListProps.Type.ITEM}
      ]});

      should.not.exist(getFirstListItem().query('use'));
    });

    it('should render glyph if provided', () => {
      list.rerender({data: [
        {label: 'Hello!', glyph: okIcon, type: List.ListProps.Type.ITEM}
      ]});

      getFirstListItem().query('use').getAttributeNS(XLINK_NS, 'href').should.equal(okIcon);
    });

    it('should throw error on unknown type', () => {
      expect(() => {
        list.rerender({data: [
          {label: 'Hello!', rgItemType: 'none'}
        ]});

        getFirstListItem().should.match('[data-test=ring-link]');
        getFirstListItem().innerHTML.should.equal('Hello!');
        getFirstListItem().tagName.toLowerCase().should.equal('span');
      }).to.throw(Error, 'Unknown menu element type: none');
    });

    it('should handle click', () => {
      const clicked = sinon.stub();

      list.rerender({data: [
        {label: 'Hello!', onClick: clicked}
      ]});

      TestUtils.Simulate.click(getFirstListItem());
      clicked.should.have.been.called;
    });

    it('should handle select', () => {
      const onSelect = sinon.stub();

      list.rerender({
        onSelect,
        data: [{label: 'Hello!'}]
      });

      TestUtils.Simulate.click(getFirstListItem());
      onSelect.should.have.been.called;
    });

    it('Should support custom elements', () => {
      list.rerender({data: [
        {
          template: React.createElement('span', {}, 'custom item'),
          rgItemType: List.ListProps.Type.CUSTOM
        }
      ]});
      getFirstListItem().should.contain.text('custom item');
    });

    it('Should support click on custom elements', () => {
      const onClick = sinon.stub();
      list.rerender({data: [
        {
          template: React.createElement('span', {}, 'custom item'),
          rgItemType: List.ListProps.Type.CUSTOM,
          onClick
        }
      ]});
      TestUtils.Simulate.click(getFirstListItem());
      onClick.should.have.been.clicked;
    });

    it('Should support disable property for custom elements', () => {
      list.rerender({data: [
        {
          template: React.createElement('span', {}, 'custom item'),
          rgItemType: List.ListProps.Type.CUSTOM,
          disabled: true
        }
      ]});
      getFirstListItem().should.not.have.class(styles.action);
    });
  });
});
