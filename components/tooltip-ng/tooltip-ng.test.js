/* global inject, angular */
/* eslint-disable angular/no-angular-mock */

import 'angular';
import 'angular-mocks';
import Tooltip from './tooltip-ng';

describe('tooltipNg', function () {
  const INNER_TEXT = 'test foo';
  let RgTooltipPopup;
  let element;
  let popupWrapper;

  beforeEach(angular.mock.module(Tooltip));

  beforeEach(inject(function (_RgTooltipPopup_) {
    RgTooltipPopup = _RgTooltipPopup_;
  }));

  beforeEach(function () {
    const container = document.createElement('div');
    element = document.createElement('div');
    container.appendChild(element);
    popupWrapper = new RgTooltipPopup(element, INNER_TEXT);
  });

  it('Should open popup', function () {
    popupWrapper.displayTooltip();

    popupWrapper.popup.props.hidden.should.be.false;
  });

  it('Should set ring-tooltip-ng class for popup', function () {
    popupWrapper.displayTooltip();
    const popup = popupWrapper.popup.node;

    popup.should.have.class('ring-tooltip-ng');
  });

  it('Should display message inside', function () {
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
