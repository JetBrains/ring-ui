import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import List from './list';

import okIcon from 'jetbrains-icons/ok.svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

describe('List', () => {
  const Type = List.ListProps.Type;
  let list;

  function getFirstListItem() {
    return ReactDOM.findDOMNode(list.refs.inner).childNodes[1];
  }

  beforeEach(() => {
    list = TestUtils.renderIntoDocument(React.createElement(List));
  });

  it('should be empty by default', () => {
    list.refs.inner.tagName.toLowerCase().should.equal('div');
    list.refs.inner.childNodes.length.should.equal(2);
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


  describe('should render items', () => {
    it('should render for empty element', () => {
      list.rerender({data: [
        {}
      ]});

      getFirstListItem().should.have.class('ring-list__item_action');
      getFirstListItem().innerHTML.should.equal('');
    });

    it('should render list item if type is not defined', () => {
      list.rerender({data: [
        {label: 'Hello!'}
      ]});

      ReactDOM.findDOMNode(list.refs.inner).querySelector('.ring-list__item').should.be.defined;
    });

    it('should render a if href defined', () => {
      list.rerender({data: [
        {label: 'Hello!', href: 'http://www.jetbrains.com'}
      ]});

      getFirstListItem().should.have.class('ring-link');
      getFirstListItem().innerHTML.should.equal('Hello!');
      getFirstListItem().tagName.toLowerCase().should.equal('a');
      getFirstListItem().getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render a if url defined', () => {
      list.rerender({data: [
        {label: 'Hello!', url: 'http://www.jetbrains.com'}
      ]});

      getFirstListItem().should.have.class('ring-link');
      getFirstListItem().innerHTML.should.equal('Hello!');
      getFirstListItem().tagName.toLowerCase().should.equal('a');
      getFirstListItem().getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render separator', () => {
      list.rerender({data: [
        {rgItemType: List.ListProps.Type.SEPARATOR}
      ]});

      getFirstListItem().should.have.class('ring-list__separator');
    });

    it('should render title', () => {
      list.rerender({data: [
        {type: List.ListProps.Type.TITLE, label: 'Foo', description: 'Bar'}
      ]});

      getFirstListItem().should.have.text('FooBar');
    });

    it('should render span if link without href', () => {
      list.rerender({data: [
        {label: 'Hello!', rgItemType: List.ListProps.Type.LINK}
      ]});

      getFirstListItem().should.have.class('ring-link');
      getFirstListItem().innerHTML.should.equal('Hello!');
      getFirstListItem().tagName.toLowerCase().should.equal('span');
    });

    it('should not render icon if not provided', () => {
      list.rerender({data: [
        {label: 'Hello!', type: List.ListProps.Type.ITEM}
      ]});

      getFirstListItem().should.not.contain('.ring-list__icon');
    });

    it('should render icon if provided', () => {
      list.rerender({data: [
        {label: 'Hello!', icon: 'http://some.url/', type: List.ListProps.Type.ITEM}
      ]});

      const icon = getFirstListItem().querySelector('.ring-list__icon');
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

        getFirstListItem().should.have.class('ring-link');
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

    it('Should support disable property for custom elements', () => {
      list.rerender({data: [
        {
          template: React.createElement('span', {}, 'custom item'),
          rgItemType: List.ListProps.Type.CUSTOM,
          disabled: true
        }
      ]});
      getFirstListItem().should.not.have.class('ring-list__item_action');
    });
  });
});
