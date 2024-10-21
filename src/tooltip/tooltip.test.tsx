import {isCompositeComponentWithType} from 'react-dom/test-utils';
import {mount} from 'enzyme';

import Popup from '../popup/popup';

import Tooltip, {TooltipAttrs} from './tooltip';

describe('Tooltip', () => {
  const defaultProps: TooltipAttrs = {
    title: 'test tooltip',
    className: 'test-class',
    children: 'test elem',
  };
  const mountTooltip = (props?: TooltipAttrs) => mount<Tooltip>(<Tooltip {...defaultProps} {...props} />);

  it('should create component', () => {
    mountTooltip().should.have.type(Tooltip);
  });

  describe('Children', () => {
    it('should wrap text children', () => {
      const wrapper = mountTooltip();
      wrapper.should.have.text('test elem');
      wrapper.should.have.tagName('span');
    });

    it('should wrap children', () => {
      const wrapper = mountTooltip({
        title: 'test tooltip',
        children: <span>{'test span'}</span>,
      });

      wrapper.should.have.tagName('span');
      wrapper.children().first().should.have.text('test span');
      wrapper.children().first().should.have.tagName('span');
    });

    it('should pass props to children', () => {
      mountTooltip().should.have.className('test-class');
    });

    it('should not pass title to children', () => {
      const wrapper = mountTooltip();
      wrapper.children().first().should.not.have.prop('title');
    });
  });

  describe('Popup', () => {
    it('should unbind listeners when empty title is provided', () => {
      const wrapper = mountTooltip();
      const bindEvents = sandbox.spy(wrapper.getDOMNode(), 'removeEventListener');

      wrapper.setProps({
        title: '',
      });

      bindEvents.should.have.been.calledTwice;
    });

    it('should render popup', () => {
      const wrapper = mountTooltip();
      const instance = wrapper.instance();
      instance.tryToShowPopup();

      isCompositeComponentWithType(instance.popup!, Popup).should.be.true;
    });

    it('should not render popup when empty title is provided', () => {
      const wrapper = mountTooltip({
        title: '',
      });
      const instance = wrapper.instance();

      instance.tryToShowPopup();
      instance.popup!.isVisible().should.be.false;
    });

    it('should render with delay when provided', () => {
      const clock = sandbox.useFakeTimers({toFake: ['setTimeout']});
      const wrapper = mountTooltip({
        delay: 100,
      });
      const instance = wrapper.instance();

      instance.tryToShowPopup();

      instance.popup!.isVisible().should.be.false;

      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      clock.tick(200);
      instance.popup!.isVisible().should.be.true;
    });

    it('should pass custom props to popup', () => {
      const wrapper = mountTooltip({
        popupProps: {
          className: 'tooltip-test-popup',
        },
      });
      const instance = wrapper.instance();

      instance.tryToShowPopup();
      instance.popup!.popup!.should.have.class('tooltip-test-popup');
    });

    it('should close popup on unmount', () => {
      const wrapper = mountTooltip();
      const instance = wrapper.instance();
      instance.tryToShowPopup();
      wrapper.unmount();

      should.not.exist(instance.popup);
    });

    it('should not close popup on click on tooltip', () => {
      const wrapper = mountTooltip();
      const instance = wrapper.instance();
      instance.tryToShowPopup();
      wrapper.simulate('click');

      instance.popup!.isVisible().should.be.true;
    });
  });
});
