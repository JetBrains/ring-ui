import {render, screen, fireEvent, act} from '@testing-library/react';

import getUID from '../global/get-uid';

import List from '../list/list';
import simulateCombo from '../../test-helpers/simulate-combo';

import {ListDataItem} from '../list/consts';

import SelectPopup, {SelectPopupAttrs} from './select__popup';

describe('SelectPopup', () => {
  const factory = (props?: SelectPopupAttrs) => (
    <SelectPopup
      filter
      onSelect={sandbox.spy()}
      onFilter={sandbox.spy()}
      onCloseAttempt={sandbox.spy()}
      data={[]}
      {...props}
    />
  );

  const renderSelectPopup = (props?: SelectPopupAttrs) => render(factory(props));

  describe('rendering', () => {
    it('should initialize', () => {
      const {container} = renderSelectPopup();
      expect(container).to.exist;
    });

    it('should render filter when filter prop is true', () => {
      renderSelectPopup({hidden: false});
      expect(screen.getByTestId('ring-select-popup-filter')).to.exist;
    });

    it('should not render filter when filter prop is false', () => {
      renderSelectPopup({filter: false, hidden: false});
      expect(screen.queryByTestId('ring-select-popup-filter')).to.be.null;
    });
  });

  describe('hidden', () => {
    describe('filter', () => {
      it('should disable shortcuts', () => {
        // When popup is hidden, shortcuts should be disabled
        renderSelectPopup({hidden: true});

        // Simulate tab press - should not trigger onCloseAttempt
        simulateCombo('tab');

        // The spy from factory should not be called
        const onCloseAttempt = sandbox.spy();
        renderSelectPopup({onCloseAttempt, hidden: true});
        simulateCombo('tab');
        expect(onCloseAttempt).to.not.be.called;
      });
    });
  });

  describe('behavior', () => {
    function createListItemMock(): ListDataItem {
      const key = getUID('popup-test-');
      const label = getUID('popup-label-');

      return {
        key,
        label,
        rgItemType: List.ListProps.Type.ITEM,
      };
    }

    let testData: ListDataItem[];
    beforeEach(() => {
      testData = [createListItemMock(), createListItemMock()];
    });

    it('should call onSelect when enter is pressed', () => {
      const onSelect = sandbox.spy();
      const {rerender} = renderSelectPopup({data: testData, onSelect});

      rerender(factory({data: testData, hidden: false, onSelect}));

      simulateCombo('enter');

      expect(onSelect).to.be.calledWith(testData[0]);
    });

    it('should call onCloseAttempt when tab is pressed', () => {
      const onCloseAttempt = sandbox.spy();
      const {rerender} = renderSelectPopup({data: testData, onCloseAttempt});

      rerender(factory({data: testData, hidden: false, onCloseAttempt}));

      simulateCombo('tab');

      expect(onCloseAttempt).to.be.called;
    });

    it('should not throw error when tab is pressed but there is no data', () => {
      const {rerender} = renderSelectPopup();

      // Set hidden to false to make the component visible
      rerender(factory({hidden: false}));

      // This should not throw an error
      expect(() => {
        simulateCombo('tab');
      }).to.not.throw();
    });

    describe('navigation', () => {
      it('should select first item when enter is pressed', () => {
        const onSelect = sandbox.spy();
        const {rerender} = renderSelectPopup({data: testData, onSelect});

        rerender(factory({data: testData, hidden: false, onSelect}));

        // Press enter to select the first item (which should be active by default)
        simulateCombo('enter');

        // onSelect should be called with the first item
        expect(onSelect).to.be.calledWith(testData[0]);
      });

      it('should call onSelect when up and enter are pressed', () => {
        const onSelect = sandbox.spy();
        const {rerender} = renderSelectPopup({data: testData, onSelect});

        rerender(factory({data: testData, hidden: false, onSelect}));

        // Press up to highlight the last item, then enter to select it
        act(() => simulateCombo('up'));
        act(() => simulateCombo('enter'));

        // onSelect should be called
        expect(onSelect).to.be.called;
      });
    });

    describe('filter', () => {
      it('should call onFilter when filter input changes', () => {
        const onFilter = sandbox.spy();
        const {rerender} = renderSelectPopup({onFilter});

        rerender(factory({hidden: false, onFilter}));

        const filterWrapper = screen.getByTestId('ring-select-popup-filter');
        const filterInput = filterWrapper.querySelector('input');

        if (filterInput) {
          fireEvent.change(filterInput, {target: {value: 'test'}});
        }

        expect(onFilter).to.be.called;
      });

      it('should have a filter input that can be interacted with', () => {
        const {rerender} = renderSelectPopup();
        rerender(factory({hidden: false, data: testData}));

        const filterWrapper = screen.getByTestId('ring-select-popup-filter');
        const filterInput = filterWrapper.querySelector('input');

        // Verify that the filter input exists
        expect(filterInput).to.exist;

        // Verify that the filter input can be interacted with
        if (filterInput) {
          fireEvent.change(filterInput, {target: {value: 'test'}});
          expect(filterInput.value).to.equal('test');
        }
      });
    });
  });
});
