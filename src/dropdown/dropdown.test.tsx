import * as Sinon from 'sinon';
import React from 'react';
import {
  Simulate
} from 'react-dom/test-utils';
import {shallow, mount, ReactWrapper} from 'enzyme';

import Popup, {PopupProps} from '../popup/popup';

import Anchor from './anchor';
import Dropdown, {DropdownAttrs} from './dropdown';

describe('Dropdown', () => {
  let anchor: HTMLElement | null;
  let popup: Popup | null;

  const anchorElement = (
    <span
      ref={function anchorRef(el) {
        anchor = el;
      }}
    />
  );

  const popupElement = (
    <Popup<PopupProps>
      ref={function popupRef(el) {
        popup = el;
      }}
    >{'foo'}</Popup>
  );

  const shallowDropdown = (props?: Partial<DropdownAttrs>, children = popupElement) => shallow(
    <Dropdown
      anchor={anchorElement}
      {...props}
    >
      {children}
    </Dropdown>
  );
  const mountDropdown = (props?: Partial<DropdownAttrs>, children = popupElement) => mount(
    <Dropdown
      anchor={anchorElement}
      {...props}
    >
      {children}
    </Dropdown>
  );

  it('should create component', () => {
    mountDropdown().should.have.type(Dropdown);
  });

  it('should wrap children with div', () => {
    shallowDropdown().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowDropdown({className: 'test-class'}).should.have.className('test-class');
  });

  it('should not show popup by default', () => {
    mountDropdown();
    should.exist(popup);
    popup?.isVisible().should.be.false;
  });

  it('should show popup on anchor click', () => {
    mountDropdown();
    should.exist(anchor);
    anchor && Simulate.click(anchor);
    should.exist(popup);
    popup?.isVisible().should.be.true;
  });

  it('should hide popup on second anchor click', () => {
    mountDropdown();
    should.exist(anchor);
    anchor && Simulate.click(anchor);
    anchor && Simulate.click(anchor);
    should.exist(popup);
    popup?.isVisible().should.be.false;
  });

  it('should hide popup on outside pointer down event', async () => {
    mountDropdown();
    should.exist(anchor);
    anchor && Simulate.click(anchor);

    await new Promise<void>(resolve => {
      setTimeout(() => {
        document.dispatchEvent(new PointerEvent('pointerdown'));
        should.exist(popup);
        popup?.isVisible().should.be.false;
        resolve();
      }, 0);
    });
  });

  it('should show popup when initialized with initShown=true', () => {
    mountDropdown({initShown: true});
    should.exist(popup);
    popup?.isVisible().should.be.true;
  });

  it('should accept function as anchor', () => {
    const anchorFunc = sandbox.stub().returns(anchorElement);
    mountDropdown({anchor: anchorFunc});

    anchorFunc.should.have.been.calledWithMatch({active: false});
  });

  it('should pass active property to anchor function', () => {
    const anchorFunc = sandbox.stub().returns(anchorElement);
    mountDropdown({anchor: anchorFunc});
    should.exist(anchor);
    anchor && Simulate.click(anchor);

    anchorFunc.should.have.been.calledTwice;
    anchorFunc.getCall(1).calledWithMatch({active: true}).should.be.true;
  });

  it('should render <Anchor> with child if type of anchor property is string', () => {
    const anchorText = 'Test anchor text';
    shallowDropdown({anchor: anchorText}).find(Anchor).children().should.have.text(anchorText);
  });

  describe('hoverMode', () => {
    let wrapper: ReactWrapper;
    let popupEl: Popup | null;
    let clock: Sinon.SinonFakeTimers;

    const dropDownProps = {
      hoverMode: true,
      hoverShowTimeOut: 100,
      hoverHideTimeOut: 300
    };

    beforeEach(() => {
      clock = sandbox.useFakeTimers({toFake: ['setTimeout']});

      const popupComponent = (
        <Popup<PopupProps>
          ref={function popupRef(el) {
            popupEl = el;
          }}
        >{'foo'}</Popup>
      );

      wrapper = mountDropdown(dropDownProps, popupComponent);
    });

    it('should show popup on mouse enter', () => {
      wrapper.simulate('mouseenter');
      clock.tick(dropDownProps.hoverShowTimeOut);

      should.exist(popupEl);
      popupEl?.isVisible().should.be.true;
    });

    it('should hide popup on mouse leave', () => {
      wrapper.simulate('mouseenter');
      clock.tick(dropDownProps.hoverShowTimeOut);

      wrapper.simulate('mouseleave');
      clock.tick(dropDownProps.hoverHideTimeOut);

      should.exist(popupEl);
      popupEl?.isVisible().should.be.false;
    });

    it('should no hide popup on mouse leave if wrapper was clicked', () => {
      wrapper.simulate('click');

      wrapper.simulate('mouseleave');
      clock.tick(dropDownProps.hoverHideTimeOut);

      should.exist(popupEl);
      popupEl?.isVisible().should.be.true;
    });

    it('should no hide popup on click if popup is already opened by hover popup', () => {
      wrapper.simulate('mouseenter');
      clock.tick(dropDownProps.hoverShowTimeOut);

      wrapper.simulate('click');

      should.exist(popupEl);
      popupEl?.isVisible().should.be.true;
    });
  });
});
