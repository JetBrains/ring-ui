import React from 'react';
import {Simulate} from 'react-dom/test-utils';
import {shallow, mount} from 'enzyme';

import getUID from '../global/get-uid';

import List from '../list/list';
import simulateCombo from '../../test-helpers/simulate-combo';

import SelectPopup from './select__popup';

describe('SelectPopup', () => {
  const factory = props => (
    <SelectPopup
      filter
      onSelect={sandbox.spy()}
      onFilter={sandbox.spy()}
      onCloseAttempt={sandbox.spy()}
      data={[]}
      {...props}
    />
  );
  const shallowSelectPopup = props => shallow(factory(props));
  const mountSelectPopup = props => mount(factory(props));

  describe('hidden', () => {
    describe('filter', () => {
      it('should disable shortcuts', () => {
        const wrapper = shallowSelectPopup();
        const instance = wrapper.instance();
        sandbox.spy(instance, 'tabPress');

        simulateCombo('tab');

        instance.tabPress.should.not.be.called;
      });
    });
  });


  describe('visible', () => {
    function createListItemMock(itemLabel, id) {
      const key = id || getUID('popup-test-');
      const label = itemLabel || getUID('popup-label-');

      return {
        key,
        label,
        type: List.ListProps.Type.ITEM
      };
    }


    let testData;
    beforeEach(() => {
      testData = [
        createListItemMock(),
        createListItemMock()
      ];
    });


    it('should initialize', () => {
      shallowSelectPopup().should.exist;
    });


    it('should call close handler when user press tab', () => {
      const wrapper = mountSelectPopup({data: testData});
      wrapper.setProps({hidden: false});
      wrapper.instance().list.state.activeItem = {};

      simulateCombo('tab');

      wrapper.prop('onCloseAttempt').should.be.called;
    });


    describe('popup without data', () => {
      it('should not throw error when user press tab but we do not have the list', () => {
        const wrapper = mountSelectPopup();
        wrapper.setProps({hidden: false});
        (() => {
          simulateCombo('tab');
        }).should.not.throw();
      });
    });


    describe('navigation', () => {
      it('should highlight first item', () => {
        const wrapper = mountSelectPopup({data: testData});
        wrapper.setProps({hidden: false});
        const firstItem = testData[0];

        wrapper.instance().list.getSelected().should.be.equal(firstItem);
      });


      it('should highlight last item', () => {
        const wrapper = mountSelectPopup({data: testData});
        wrapper.setProps({hidden: false});
        const lastItem = testData[testData.length - 1];

        simulateCombo('up');

        wrapper.instance().list.getSelected().should.be.equal(lastItem);
      });


      it('should select item', () => {
        const wrapper = mountSelectPopup({data: testData});
        wrapper.setProps({hidden: false});
        const firstItem = testData[0];

        simulateCombo('enter');

        wrapper.prop('onSelect').should.be.calledWith(firstItem);
      });
    });

    describe('filter', () => {
      function expectPopupFilterShortcutsDisabled(fn, value) {
        fn.should.be.calledWith({
          popupFilterShortcutsOptions: {
            modal: true,
            disabled: value
          }
        });
      }

      it('should enable shortcuts on focus', () => {
        const wrapper = mountSelectPopup({data: testData});
        wrapper.setProps({hidden: false});
        const instance = wrapper.instance();
        sandbox.spy(instance, 'setState');

        Simulate.focus(instance.filter);

        expectPopupFilterShortcutsDisabled(instance.setState, false);
      });


      it('should disable shortcuts on blur', () => {
        const wrapper = mountSelectPopup({data: testData});
        wrapper.setProps({hidden: false});
        const instance = wrapper.instance();
        sandbox.spy(instance, 'setState');

        Simulate.blur(instance.filter);

        expectPopupFilterShortcutsDisabled(instance.setState, true);
      });
    });
  });
});
