import * as Sinon from 'sinon';

import {fireEvent, render, screen} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import {act} from 'react';

import Popup, {PopupProps} from '../popup/popup';

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
    >
      {'foo'}
    </Popup>
  );

  const renderDropdown = (props?: Partial<DropdownAttrs>, children = popupElement) =>
    render(
      <Dropdown anchor={anchorElement} {...props}>
        {children}
      </Dropdown>,
    );

  it('should create component', () => {
    renderDropdown();
    expect(screen.getByTestId('ring-dropdown')).to.exist;
  });

  it('should wrap children with div', () => {
    renderDropdown();
    expect(screen.getByTestId('ring-dropdown')).to.have.tagName('div');
  });

  it('should use passed className', () => {
    renderDropdown({className: 'test-class'});
    expect(screen.getByTestId('ring-dropdown')).to.have.class('test-class');
  });

  it('should not show popup by default', () => {
    renderDropdown();
    expect(popup).to.exist;
    expect(popup?.isVisible()).to.be.false;
  });

  it('should show popup on anchor click', async () => {
    renderDropdown();
    expect(anchor).to.exist;
    anchor && (await userEvent.click(anchor));
    expect(popup).to.exist;
    expect(popup?.isVisible()).to.be.true;
  });

  it('should hide popup on second anchor click', async () => {
    renderDropdown();
    expect(anchor).to.exist;
    anchor && (await userEvent.click(anchor));
    anchor && (await userEvent.click(anchor));
    expect(popup).to.exist;
    expect(popup?.isVisible()).to.be.false;
  });

  it('should hide popup on outside pointer down event', async () => {
    renderDropdown();
    expect(anchor).to.exist;
    anchor && (await userEvent.click(anchor));

    await new Promise<void>(resolve => {
      setTimeout(() => {
        fireEvent.pointerDown(document);
        expect(popup).to.exist;
        expect(popup?.isVisible()).to.be.false;
        resolve();
      }, 0);
    });
  });

  it('should show popup when initialized with initShown=true', () => {
    renderDropdown({initShown: true});
    expect(popup).to.exist;
    expect(popup?.isVisible()).to.be.true;
  });

  it('should accept function as anchor', () => {
    const anchorFunc = sandbox.stub().returns(anchorElement);
    renderDropdown({anchor: anchorFunc});

    expect(anchorFunc).to.have.been.calledWithMatch({active: false});
  });

  it('should pass active property to anchor function', async () => {
    const anchorFunc = sandbox.stub().returns(anchorElement);
    renderDropdown({anchor: anchorFunc});
    expect(anchor).to.exist;
    anchor && (await userEvent.click(anchor));

    expect(anchorFunc).to.have.been.calledTwice;
    expect(anchorFunc.getCall(1).calledWithMatch({active: true})).to.be.true;
  });

  it('should render <Anchor> with child if type of anchor property is string', () => {
    const anchorText = 'Test anchor text';
    renderDropdown({anchor: anchorText});
    expect(screen.getByText(anchorText)).to.exist;
  });

  describe('hoverMode', () => {
    let popupEl: Popup | null;
    let clock: Sinon.SinonFakeTimers;

    const dropDownProps = {
      hoverMode: true,
      hoverShowTimeOut: 100,
      hoverHideTimeOut: 300,
    };

    beforeEach(() => {
      clock = sandbox.useFakeTimers({toFake: ['setTimeout']});

      const popupComponent = (
        <Popup<PopupProps>
          ref={function popupRef(el) {
            popupEl = el;
          }}
        >
          {'foo'}
        </Popup>
      );

      renderDropdown(dropDownProps, popupComponent);
    });

    it('should show popup on mouse enter', () => {
      const dropdown = screen.getByTestId('ring-dropdown');
      fireEvent.mouseEnter(dropdown);
      act(() => clock.tick(dropDownProps.hoverShowTimeOut));

      expect(popupEl).to.exist;
      expect(popupEl?.isVisible()).to.be.true;
    });

    it('should hide popup on mouse leave', () => {
      const dropdown = screen.getByTestId('ring-dropdown');
      fireEvent.mouseEnter(dropdown);
      act(() => clock.tick(dropDownProps.hoverShowTimeOut));

      fireEvent.mouseLeave(dropdown);
      act(() => clock.tick(dropDownProps.hoverHideTimeOut));

      expect(popupEl).to.exist;
      expect(popupEl?.isVisible()).to.be.false;
    });

    it('should not hide popup on mouse leave if wrapper was clicked', () => {
      const dropdown = screen.getByTestId('ring-dropdown');
      fireEvent.click(dropdown);

      fireEvent.mouseLeave(dropdown);
      act(() => clock.tick(dropDownProps.hoverHideTimeOut));

      expect(popupEl).to.exist;
      expect(popupEl?.isVisible()).to.be.true;
    });

    it('should not hide popup on click if popup is already opened by hover popup', () => {
      const dropdown = screen.getByTestId('ring-dropdown');
      fireEvent.mouseEnter(dropdown);
      act(() => clock.tick(dropDownProps.hoverShowTimeOut));

      fireEvent.click(dropdown);

      expect(popupEl).to.exist;
      expect(popupEl?.isVisible()).to.be.true;
    });
  });
});
