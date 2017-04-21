/* eslint-disable func-names */
import 'dom4';
import {renderIntoDocument, Simulate} from 'react-dom/test-utils';
import React from 'react';
import {findDOMNode} from 'react-dom';
import last from 'mout/array/last';
import guid from 'mout/random/guid';
import randString from 'mout/random/randString';

import List from '../list/list';

import SelectPopup from './select__popup';

import simulateCombo from 'simulate-combo';

describe('SelectPopup', () => {
  describe('hidden', () => {
    beforeEach(function () {
      this.selectPopup = renderIntoDocument(React.createElement(SelectPopup, {
        data: [],
        filter: true,
        onSelect: this.sinon.spy(),
        onFilter: this.sinon.spy()
      }));
    });


    describe('filter', () => {
      it('should disable shortcuts', function () {
        this.sinon.spy(this.selectPopup, 'tabPress');

        simulateCombo('tab');

        expect(this.selectPopup.tabPress).to.not.be.called;
      });
    });
  });


  describe('visible', () => {
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


    it('should call select handler when user press tab and we have an active item in the list', function () {
      this.selectPopup.list.state.activeItem = {};

      simulateCombo('tab');

      expect(this.selectPopup.props.onSelect).to.be.called;
    });


    describe('popup without data', () => {
      beforeEach(function () {
        this.selectPopup = renderIntoDocument(React.createElement(SelectPopup, {
          data: [],
          filter: true
        }));
        this.selectPopup.willReceiveProps({hidden: false});
      });


      it('should not throw error when user press tab but we do not have the list', () => {
        expect(() => {
          simulateCombo('tab');
        }).to.not.throw();
      });
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

        Simulate.focus(findDOMNode(this.selectPopup.filter));

        expectPopupFilterShortuctsDisabled(this.selectPopup, false);
      });


      it('should disable shortcuts on blur', function () {
        this.selectPopup.willReceiveProps({filter: true});

        Simulate.blur(findDOMNode(this.selectPopup.filter));

        expectPopupFilterShortuctsDisabled(this.selectPopup, true);
      });
    });
  });
});
