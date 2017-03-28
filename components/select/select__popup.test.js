/* eslint-disable func-names */
import 'dom4';
import SelectPopup from './select__popup';
import List from '../list/list';
import React from 'react';
import {findDOMNode} from 'react-dom';
import renderIntoDocument from 'render-into-document';
import last from 'mout/array/last';
import guid from 'mout/random/guid';
import randString from 'mout/random/randString';

import TestUtils from 'react-addons-test-utils';
import simulateCombo from 'simulate-combo';

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
    it('should highlight first item', function () {
      const firstItem = testData[0];

      simulateCombo('down');

      expect(this.selectPopup.list.getSelected()).to.be.equal(firstItem);
    });


    it('should highlight last item', function () {
      const lastItem = last(testData);

      simulateCombo('up');

      expect(this.selectPopup.list.getSelected()).to.be.equal(lastItem);
    });


    it('should select item', function () {
      const firstItem = testData[0];

      simulateCombo('down enter');

      expect(this.selectPopup.props.onSelect).to.be.calledWith(firstItem);
    });
  });

  describe('filter', () => {
    function expectPopupFilterShortuctsDisabled(selectPopup, value) {
      expect(selectPopup.setState).
        to.
        be.
        calledWith({
          popupFilterShortcutsOptions: {
            modal: true,
            disabled: value
          }
        });
    }

    beforeEach(function () {
      this.sinon.spy(this.selectPopup, 'setState');
    });


    it('should enable shortcuts on focus', function () {
      this.selectPopup.willReceiveProps({filter: true});

      TestUtils.Simulate.focus(findDOMNode(this.selectPopup.filter));

      expectPopupFilterShortuctsDisabled(this.selectPopup, false);
    });


    it('should disable shortcuts on blur', function () {
      this.selectPopup.willReceiveProps({filter: true});

      TestUtils.Simulate.blur(findDOMNode(this.selectPopup.filter));

      expectPopupFilterShortuctsDisabled(this.selectPopup, true);
    });
  });
});
