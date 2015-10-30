import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import List from './list';

describe('List', function () {
  const Type = List.ListProps.Type;
  let list;

  function getFirstListItem() {
    return ReactDOM.findDOMNode(list.refs.inner).firstChild;
  }

  beforeEach(function () {
    list = TestUtils.renderIntoDocument(React.createElement(List));
  });

  it('should be empty by default', function () {
    list.refs.inner.tagName.toLowerCase().should.equal('div');
    list.refs.inner.hasChildNodes().should.equal(false);
  });

  it('should check type of item', function () {
    const itemMock = {
      rgItemType: Type.SEPARATOR
    };

    List.isItemType(Type.SEPARATOR, itemMock).should.been.equal(true);
  });

  it('should support deprecated property `type`', function () {
    const itemMock = {
      type: Type.SEPARATOR
    };

    List.isItemType(Type.SEPARATOR, itemMock).should.been.equal(true);
  });

  it('by default item has type equal ITEM', function () {
    const itemMock = {};

    List.isItemType(Type.ITEM, itemMock).should.been.equal(true);
    List.isItemType(Type.SEPARATOR, itemMock).should.been.equal(false);
  });

  it('should deselect item', function () {
    list.rerender({data: [
      {}
    ],
      activeIndex: 0});

    list.clearSelected();

    expect(list.getSelected()).to.be.undefined;
  });


  describe('should render items', function () {
    it('should render for empty element', function () {
      list.rerender({data: [
        {}
      ]});

      $(getFirstListItem()).should.have.class('ring-list__item_action');
      getFirstListItem().innerHTML.should.equal('');
    });

    it('should render list item if type is not definded', function () {
      list.rerender({data: [
        {label: 'Hello!'}
      ]});

      $(getFirstListItem()).should.have.class('ring-list__item');
      $(getFirstListItem()).should.have.class('ring-list__item_action');
      // React creates unexpected additional span
      getFirstListItem().firstChild.innerHTML.should.equal('Hello!');
    });

    it('should render a if href defined', function () {
      list.rerender({data: [
        {label: 'Hello!', href: 'http://www.jetbrains.com'}
      ]});

      $(getFirstListItem()).should.have.class('ring-link');
      getFirstListItem().innerHTML.should.equal('Hello!');
      getFirstListItem().tagName.toLowerCase().should.equal('a');
      getFirstListItem().getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render a if url defined', function () {
      list.rerender({data: [
        {label: 'Hello!', url: 'http://www.jetbrains.com'}
      ]});

      $(getFirstListItem()).should.have.class('ring-link');
      getFirstListItem().innerHTML.should.equal('Hello!');
      getFirstListItem().tagName.toLowerCase().should.equal('a');
      getFirstListItem().getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render separator', function () {
      list.rerender({data: [
        {rgItemType: List.ListProps.Type.SEPARATOR}
      ]});

      $(getFirstListItem()).should.have.class('ring-list__separator');
    });

    it('should render title', function () {
      list.rerender({data: [
        {type: List.ListProps.Type.TITLE, label: 'Foo', description: 'Bar'}
      ]});

      $(getFirstListItem()).text().should.be.equal('BarFoo');
    });

    it('should render span if link without href', function () {
      list.rerender({data: [
        {label: 'Hello!', rgItemType: List.ListProps.Type.LINK}
      ]});

      $(getFirstListItem()).should.have.class('ring-link');
      getFirstListItem().innerHTML.should.equal('Hello!');
      getFirstListItem().tagName.toLowerCase().should.equal('span');
    });

    it('should not render icon if not provided', function () {
      list.rerender({data: [
        {label: 'Hello!', type: List.ListProps.Type.ITEM}
      ]});
      $(getFirstListItem()).should.not.have.descendants('.ring-list__icon');
    });

    it('should render icon if provided', function () {
      list.rerender({data: [
        {label: 'Hello!', icon: 'http://some.url/', type: List.ListProps.Type.ITEM}
      ]});
      const icon = getFirstListItem().querySelector('.ring-list__icon');
      expect(icon.style.backgroundImage).to.contain('http://some.url');
    });

    it('should throw error on unknown type', function () {

      expect(function () {
        list.rerender({data: [
          {label: 'Hello!', rgItemType: 'none'}
        ]});

        $(getFirstListItem()).should.have.class('ring-link');
        getFirstListItem().innerHTML.should.equal('Hello!');
        getFirstListItem().tagName.toLowerCase().should.equal('span');
      }).to.throw(Error, 'Unknown menu element type: none');
    });

    it('should handle click', function () {
      const clicked = sinon.stub();

      list.rerender({data: [
        {label: 'Hello!', onClick: clicked}
      ]});

      TestUtils.Simulate.click(getFirstListItem());
      clicked.should.have.been.called;
    });
  });
});
