/* global inject, angular */
/* eslint-disable angular/no-angular-mock */

import 'angular';
import 'angular-mocks';
import Tooltip from './tooltip-ng';

describe('tooltipNg', () => {
  const INNER_TEXT = 'test foo';
  let RgTooltipPopup;
  let element;
  let popupWrapper;

  beforeEach(angular.mock.module(Tooltip));

  beforeEach(inject(_RgTooltipPopup_ => {
    RgTooltipPopup = _RgTooltipPopup_;
  }));

  beforeEach(() => {
    const container = document.createElement('div');
    element = document.createElement('div');
    container.appendChild(element);
    popupWrapper = new RgTooltipPopup(element, INNER_TEXT);
  });

  it('Should open popup', () => {
    popupWrapper.displayTooltip();

    popupWrapper.popup.props.hidden.should.be.false;
  });

  it('Should set ring-tooltip-ng class for popup', () => {
    popupWrapper.displayTooltip();
    const popup = popupWrapper.popup.node;

    popup.should.have.class('ring-tooltip-ng');
  });

  it('Should set custom class for popup', () => {
    popupWrapper.displayTooltip('custom-class');
    const popup = popupWrapper.popup.node;

    popup.should.have.class('custom-class');
  });

  it('Should display message inside', () => {
    popupWrapper.displayTooltip();
    popupWrapper.popup.node.should.have.text(INNER_TEXT);
  });

  it('Should close popup', function () {
    const popup = popupWrapper.popup = {
      close: this.sinon.spy()
    };

    popupWrapper.hideTooltip();

    popup.close.should.been.called;
  });
});
