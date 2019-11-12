import React from 'react';
import {
  Simulate
} from 'react-dom/test-utils';
import {shallow, mount} from 'enzyme';

import Popup from '../popup/popup';

import Anchor from './anchor';
import Dropdown from './dropdown';

describe('Dropdown', () => {
  let anchor;
  let popup;

  const anchorElement = (
    <span
      ref={function anchorRef(el) {
        anchor = el;
      }}
    />
  );

  const popupElement = (
    <Popup
      ref={function popupRef(el) {
        popup = el;
      }}
    />
  );

  const shallowDropdown = (props, children = popupElement) => shallow(
    <Dropdown
      anchor={anchorElement}
      {...props}
    >
      {children}
    </Dropdown>
  );
  const mountDropdown = (props, children = popupElement) => mount(
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
    popup.isVisible().should.be.false;
  });

  it('should show popup on anchor click', () => {
    mountDropdown();
    Simulate.click(anchor);
    popup.isVisible().should.be.true;
  });

  it('should hide popup on second anchor click', () => {
    mountDropdown();
    Simulate.click(anchor);
    Simulate.click(anchor);
    popup.isVisible().should.be.false;
  });

  it('should hide popup on outside click', done => {
    mountDropdown();
    Simulate.click(anchor);
    setTimeout(() => {
      document.dispatchEvent(new Event('click'));
      popup.isVisible().should.be.false;
      done();
    }, 0);
  });

  it('should show popup when initialized with initShown=true', () => {
    mountDropdown({initShown: true});
    popup.isVisible().should.be.true;
  });

  it('should accept function as anchor', () => {
    const anchorFunc = sandbox.stub().returns(anchorElement);
    mountDropdown({anchor: anchorFunc});

    anchorFunc.should.have.been.calledWithMatch({active: false});
  });

  it('should pass active property to anchor function', () => {
    const anchorFunc = sandbox.stub().returns(anchorElement);
    mountDropdown({anchor: anchorFunc});
    Simulate.click(anchor);

    anchorFunc.should.have.been.calledTwice;
    anchorFunc.getCall(1).calledWithMatch({active: true}).should.be.true;
  });

  it('should render <Anchor> with child if type of anchor property is string', () => {
    const anchorText = 'Test anchor text';
    shallowDropdown({anchor: anchorText}).find(Anchor).children().should.have.text(anchorText);
  });

  describe('hoverMode', () => {
    let wrapper;
    let popupEl;
    let clock;

    const dropDownProps = {
      hoverMode: true,
      hoverShowTimeOut: 100,
      hoverHideTimeOut: 300
    };

    beforeEach(() => {
      clock = sandbox.useFakeTimers({toFake: ['setTimeout']});

      const popupComponent = (
        <Popup
          ref={function popupRef(el) {
            popupEl = el;
          }}
        />
      );

      wrapper = mountDropdown(dropDownProps, popupComponent);
    });

    it('should show popup on mouse enter', () => {
      wrapper.simulate('mouseenter');
      clock.tick(dropDownProps.hoverShowTimeOut);

      popupEl.isVisible().should.be.true;
    });

    it('should hide popup on mouse leave', () => {
      wrapper.simulate('mouseenter');
      clock.tick(dropDownProps.hoverShowTimeOut);

      wrapper.simulate('mouseleave');
      clock.tick(dropDownProps.hoverHideTimeOut);

      popupEl.isVisible().should.be.false;
    });

    it('should no hide popup on mouse leave if wrapper was clicked', () => {
      wrapper.simulate('click');

      wrapper.simulate('mouseleave');
      clock.tick(dropDownProps.hoverHideTimeOut);

      popupEl.isVisible().should.be.true;
    });

    it('should no hide popup on click if popup is already opened by hover popup', () => {
      wrapper.simulate('mouseenter');
      clock.tick(dropDownProps.hoverShowTimeOut);

      wrapper.simulate('click');

      popupEl.isVisible().should.be.true;
    });
  });
});
