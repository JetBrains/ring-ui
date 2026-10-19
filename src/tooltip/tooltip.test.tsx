// Mock the Popup module
import {render, screen, fireEvent, within, act} from '@testing-library/react';

import Popup from '../popup/popup';
import Tooltip, {type TooltipAttrs} from './tooltip';

// Import the mocked Popup for assertions

vi.mock('../popup/popup', () => {
  // Define a type for our mock
  type MockPopupType = ReturnType<typeof vi.fn> & {
    isVisible: ReturnType<typeof vi.fn>;
    PopupProps: {
      Directions: {
        TOP_LEFT: string;
        BOTTOM_RIGHT: string;
      };
    };
  };

  const MockPopup = vi.fn().mockImplementation(({children, className, hidden, ...props}) =>
    hidden ? null : (
      <div data-testid='mock-popup' className={className} {...props}>
        {children}
      </div>
    ),
  ) as MockPopupType;

  // Add isVisible method to the mock
  MockPopup.isVisible = vi.fn().mockReturnValue(true);

  // Add PopupProps to the mock
  MockPopup.PopupProps = {
    Directions: {
      TOP_LEFT: 'top-left',
      BOTTOM_RIGHT: 'bottom-right',
    },
  };

  return {
    __esModule: true,
    default: MockPopup,
  };
});

describe('Tooltip', () => {
  const defaultProps: TooltipAttrs = {
    title: 'test tooltip',
    className: 'test-class',
    children: 'test elem',
  };
  const renderTooltip = (props?: Partial<TooltipAttrs>) => render(<Tooltip {...defaultProps} {...props} />);

  // Constants for test timing
  const SHORT_DELAY = 10;
  const MEDIUM_DELAY = 50;
  const LONG_DELAY = 100;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create component', () => {
    renderTooltip();
    expect(screen.getByText('test elem')).to.exist;
  });

  describe('Children', () => {
    it('should wrap text children', () => {
      renderTooltip();
      const wrapper = screen.getByText('test elem');
      expect(wrapper).to.have.text('test elem');
      expect(wrapper.tagName.toLowerCase()).to.equal('span');
    });

    it('should wrap children', () => {
      renderTooltip({
        title: 'test tooltip',
        children: <span>{'test span'}</span>,
      });

      // Using a more specific selector that matches the actual DOM structure
      const wrapper = screen.getByRole('tooltip');
      expect(wrapper.tagName.toLowerCase()).to.equal('span');

      expect(within(wrapper).getByText('test span').tagName.toLowerCase()).to.equal('span');
    });

    it('should pass props to children', () => {
      renderTooltip();
      // Using a more specific selector
      expect(screen.getByRole('tooltip')).to.have.class('test-class');
    });

    it('should not pass title to children', () => {
      renderTooltip();
      expect(screen.getByText('test elem')).to.not.have.attribute('title');
    });
  });

  describe('Popup', () => {
    it('should defer popup and theme wrapper until first opening', () => {
      renderTooltip();
      const anchor = screen.getByRole('tooltip');

      expect(Popup).not.toHaveBeenCalled();
      expect(anchor.children).to.have.length(0);

      fireEvent.mouseEnter(anchor);

      expect(Popup).toHaveBeenCalledWith(expect.objectContaining({hidden: false}), undefined);
      expect(anchor.children).to.have.length(1);

      fireEvent.mouseLeave(anchor);

      expect(Popup).toHaveBeenLastCalledWith(expect.objectContaining({hidden: true}), undefined);
      expect(anchor.children).to.have.length(1);

      fireEvent.mouseEnter(anchor);

      expect(Popup).toHaveBeenLastCalledWith(expect.objectContaining({hidden: false}), undefined);
    });

    it('should defer popup with inherited theme', () => {
      renderTooltip({theme: 'inherit'});
      const anchor = screen.getByRole('tooltip');

      expect(Popup).not.toHaveBeenCalled();

      fireEvent.focusIn(anchor);

      expect(Popup).toHaveBeenCalledWith(expect.objectContaining({hidden: false}), undefined);
    });

    it('should mount popup immediately when keepMounted is requested', () => {
      renderTooltip({popupProps: {keepMounted: true}});

      expect(Popup).toHaveBeenCalledWith(expect.objectContaining({hidden: true, keepMounted: true}), undefined);
    });

    it('should mount popup immediately when explicitly visible', () => {
      renderTooltip({popupProps: {hidden: false}});

      expect(screen.getByText('test tooltip')).to.exist;
    });

    it('should not mount popup when the anchor does not overflow', () => {
      renderTooltip({selfOverflowOnly: true});
      const anchor = screen.getByRole('tooltip');
      Object.defineProperties(anchor, {
        clientWidth: {value: 100},
        scrollWidth: {value: 100},
        clientHeight: {value: 20},
        scrollHeight: {value: 20},
      });

      fireEvent.mouseEnter(anchor);

      expect(Popup).not.toHaveBeenCalled();
    });

    it('should cancel delayed opening when the pointer leaves', () => {
      renderTooltip({delay: LONG_DELAY});
      const anchor = screen.getByRole('tooltip');

      fireEvent.mouseEnter(anchor);
      fireEvent.mouseLeave(anchor);
      act(() => vi.advanceTimersByTime(LONG_DELAY));

      expect(Popup).not.toHaveBeenCalled();
    });

    beforeEach(() => {
      vi.useFakeTimers({toFake: ['setTimeout', 'clearTimeout']});
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should unbind listeners when empty title is provided', () => {
      const {rerender} = renderTooltip();
      const tooltipElement = screen.getByRole('tooltip');
      const removeEventListener = vi.spyOn(tooltipElement, 'removeEventListener');

      rerender(<Tooltip {...defaultProps} title='' />);

      const TOOLTIP_HANDLED_EVENTS = ['mouseenter', 'mouseleave', 'focusin', 'focusout'];

      expect(removeEventListener).toHaveBeenCalledTimes(TOOLTIP_HANDLED_EVENTS.length);
    });

    it('should not render popup when title changes to empty value', () => {
      const {rerender} = renderTooltip();
      const tooltipElement = screen.getByRole('tooltip');

      if (!tooltipElement) throw new Error('Tooltip element not found');

      act(() => {
        fireEvent.mouseEnter(tooltipElement);
        vi.advanceTimersByTime(SHORT_DELAY);
      });

      rerender(<Tooltip {...defaultProps} title='' />);

      // Popup should remain hidden
      expect(Popup).toHaveBeenLastCalledWith(expect.objectContaining({hidden: true}), undefined);
    });

    it('should not render popup with the hide flag', () => {
      const {rerender} = renderTooltip();
      const tooltipElement = screen.getByRole('tooltip');

      if (!tooltipElement) throw new Error('Tooltip element not found');

      act(() => {
        fireEvent.mouseEnter(tooltipElement);
        vi.advanceTimersByTime(SHORT_DELAY);
      });

      rerender(<Tooltip {...defaultProps} hide />);

      expect(Popup).toHaveBeenLastCalledWith(expect.objectContaining({hidden: true}), undefined);
    });

    it('should render popup on mouseenter', () => {
      renderTooltip();
      const tooltipElement = screen.getByText('test elem').closest('span');

      if (!tooltipElement) throw new Error('Tooltip element not found');

      expect(Popup).not.toHaveBeenCalled();

      act(() => {
        fireEvent.mouseEnter(tooltipElement);
        vi.advanceTimersByTime(SHORT_DELAY);
      });

      // After mouseenter, Popup should be visible with the correct title
      expect(Popup).toHaveBeenLastCalledWith(
        expect.objectContaining({
          hidden: false,
          children: 'test tooltip',
        }),
        undefined,
      );
    });

    it('should not render popup when empty title is provided', () => {
      renderTooltip({
        title: '',
      });
      const tooltipElement = screen.getByText('test elem').closest('span');

      if (!tooltipElement) throw new Error('Tooltip element not found');

      act(() => {
        fireEvent.mouseEnter(tooltipElement);
        vi.advanceTimersByTime(SHORT_DELAY);
      });

      expect(Popup).not.toHaveBeenCalled();
    });

    it('should render with delay when provided', () => {
      renderTooltip({
        delay: LONG_DELAY,
      });
      const tooltipElement = screen.getByText('test elem').closest('span');

      if (!tooltipElement) throw new Error('Tooltip element not found');

      act(() => {
        fireEvent.mouseEnter(tooltipElement);
        vi.advanceTimersByTime(MEDIUM_DELAY); // Not enough time for the popup to show
      });

      expect(Popup).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(LONG_DELAY); // Now the popup should be visible
      });

      // Now the popup should be visible
      expect(Popup).toHaveBeenLastCalledWith(
        expect.objectContaining({
          hidden: false,
          children: 'test tooltip',
        }),
        undefined,
      );
    });

    it('should pass custom props to popup', () => {
      const customClassName = 'tooltip-test-popup';

      renderTooltip({
        popupProps: {
          className: customClassName,
        },
      });
      const tooltipElement = screen.getByText('test elem').closest('span');

      if (!tooltipElement) throw new Error('Tooltip element not found');

      act(() => {
        fireEvent.mouseEnter(tooltipElement);
        vi.advanceTimersByTime(SHORT_DELAY);
      });

      // Check that custom props are passed to Popup
      expect(Popup).toHaveBeenLastCalledWith(
        expect.objectContaining({
          className: expect.stringContaining(customClassName),
        }),
        undefined,
      );
    });

    it('should close popup on unmount', () => {
      const {unmount} = renderTooltip();
      const tooltipElement = screen.getByText('test elem').closest('span');

      if (!tooltipElement) throw new Error('Tooltip element not found');

      act(() => {
        fireEvent.mouseEnter(tooltipElement);
        vi.advanceTimersByTime(SHORT_DELAY);
      });

      // Popup should be visible
      expect(Popup).toHaveBeenLastCalledWith(expect.objectContaining({hidden: false}), undefined);

      unmount();

      // After unmount, the component should be cleaned up
      // We can't directly test this with the mock, but we can verify
      // that no errors are thrown during unmount
    });

    it('should not close popup on click on tooltip', () => {
      renderTooltip();
      const tooltipElement = screen.getByText('test elem').closest('span');

      if (!tooltipElement) throw new Error('Tooltip element not found');

      act(() => {
        fireEvent.mouseEnter(tooltipElement);
        vi.advanceTimersByTime(SHORT_DELAY);
      });

      // Popup should be visible
      expect(Popup).toHaveBeenLastCalledWith(expect.objectContaining({hidden: false}), undefined);

      // Store the number of calls to Popup before the click
      // @ts-expect-error - mock property access
      const callCountBeforeClick = Popup.mock.calls.length;

      act(() => {
        fireEvent.click(tooltipElement);
      });

      // Popup should still be visible after click
      expect(Popup).toHaveBeenLastCalledWith(expect.objectContaining({hidden: false}), undefined);

      // The number of calls should not have increased (no re-render with hidden=true)
      // @ts-expect-error - mock property access
      expect(Popup.mock.calls.length).to.equal(callCountBeforeClick);
    });

    it('should show and hide popup when focused/blurred', () => {
      renderTooltip();

      const tooltipElement = screen.getByText('test elem').closest('span');

      if (!tooltipElement) throw new Error('Tooltip element not found');

      act(() => {
        fireEvent.focusIn(tooltipElement);
        vi.advanceTimersByTime(SHORT_DELAY);
      });

      // Popup should be visible
      expect(Popup).toHaveBeenLastCalledWith(expect.objectContaining({hidden: false}), undefined);

      act(() => {
        fireEvent.focusOut(tooltipElement);
        vi.advanceTimersByTime(SHORT_DELAY);
      });

      // Popup should be hidden
      expect(Popup).toHaveBeenLastCalledWith(expect.objectContaining({hidden: true}), undefined);
    });
  });
});
