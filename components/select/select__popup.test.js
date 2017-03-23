/* eslint-disable func-names */
import 'dom4';
import SelectPopup from './select__popup';
import List from '../list/list';
import React from 'react';
import renderIntoDocument from 'render-into-document';
import last from 'mout/array/last';
import guid from 'mout/random/guid';
import randString from 'mout/random/randString';

import simulateKeypress from 'simulate-keypress';


describe('SelectPopup', () => {
  function createListItemMock(itemLabel, id) {
    const key = id || guid();
    const label = itemLabel || randString();

    return {
      key,
      label,
      type: List.ListProps.Type.ITEM
    };
  }


  let testData;
  beforeEach(function () {
    testData = [
      createListItemMock(),
      createListItemMock()
    ];


    this.selectPopup = renderIntoDocument(React.createElement(SelectPopup, {
      data: testData,
      filter: true,
      onSelect: this.sinon.spy(),
      onFilter: this.sinon.spy()
    }));
    this.selectPopup.willReceiveProps({hidden: false});
  });


  it('should initialize', function () {
    expect(this.selectPopup).to.be.defined;
  });


  describe('navigation', () => {
    const ArrowDown = 40;
    const ArrowUp = 38;
    const Enter = 13;


    it('should highlight first item', function () {
      const firstItem = testData[0];

      simulateKeypress(null, ArrowDown);

      expect(this.selectPopup.list.getSelected()).to.be.equal(firstItem);
    });


    it('should highlight last item', function () {
      const lastItem = last(testData);

      simulateKeypress(null, ArrowUp);

      expect(this.selectPopup.list.getSelected()).to.be.equal(lastItem);
    });


    it('should select item', function () {
      const firstItem = testData[0];

      simulateKeypress(null, ArrowDown);
      simulateKeypress(null, Enter);

      expect(this.selectPopup.props.onSelect).to.be.calledWith(firstItem);
    });
  });
});
