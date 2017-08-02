/* global inject */
/* eslint-disable angular/no-angular-mock */

import angular from 'angular';
import 'angular-mocks';

import Tooltip from './tooltip-ng';

describe('Tooltip Ng', () => {
  const INNER_TEXT = 'test foo';
  let RgTooltipPopup;
  let element;
  let popupWrapper;
  let innerTextGetter;

  beforeEach(angular.mock.module(Tooltip));

  beforeEach(inject(_RgTooltipPopup_ => {
    RgTooltipPopup = _RgTooltipPopup_;
    innerTextGetter = sandbox.spy(() => INNER_TEXT);
  }));

  beforeEach(() => {
    const container = document.createElement('div');
    element = document.createElement('div');
    container.appendChild(element);
    popupWrapper = new RgTooltipPopup(element, innerTextGetter);
  });

  it('Should open popup', () => {
    popupWrapper.displayTooltip();

    popupWrapper.popup.props.hidden.should.be.false;
  });

  it('Should set ring-tooltip-ng class for popup', () => {
    popupWrapper.displayTooltip();
    const popup = popupWrapper.popup.popup;

    popup.should.have.class('ring-tooltip-ng');
  });

  it('Should set custom class for popup', () => {
    popupWrapper.displayTooltip('custom-class');
    const popup = popupWrapper.popup.popup;

    popup.should.have.class('custom-class');
  });

  it('Should display message inside', () => {
    popupWrapper.displayTooltip();
    popupWrapper.popup.popup.should.have.text(INNER_TEXT);
  });

  it('Should recalculate text on each opening', () => {
    popupWrapper.displayTooltip();
    popupWrapper.hideTooltip();
    popupWrapper.displayTooltip();

    innerTextGetter.should.been.calledTwice;
  });

  it('Should close popup', () => {
    popupWrapper.displayTooltip();
    popupWrapper.hideTooltip();

    popupWrapper.popup.isVisible().should.be.false;
  });
});
