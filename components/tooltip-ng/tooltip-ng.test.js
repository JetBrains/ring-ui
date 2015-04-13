require('angular/angular');
require('angular-mocks/angular-mocks');
var $ = require('jquery');

require('./tooltip-ng');
/* global inject, angular */

describe('tooltipNg', function(){
  var RgTooltipPopup;
  var element;
  var popupWrapper;
  var INNER_TEXT = 'test foo';

  beforeEach(angular.mock.module('Ring.tooltip'));

  beforeEach(inject(function (_RgTooltipPopup_) {
    RgTooltipPopup = _RgTooltipPopup_;
  }));

  beforeEach(function () {
    element = document.createElement('div');
    popupWrapper = new RgTooltipPopup(element, INNER_TEXT);
  });

  it('Should open popup', function () {
    popupWrapper.displayTooltip();

    expect(popupWrapper.popup.props.hidden).to.be.false;
  });

  it('Should set tooltip-ng class for popup', function () {
    popupWrapper.displayTooltip();
    var $popup = $(popupWrapper.popup.getDOMNode());

    $popup.should.have.class('tooltip-ng');
  });

  it('Should display message inside', function () {
    popupWrapper.displayTooltip();
    var text = popupWrapper.popup.getDOMNode().textContent;

    text.should.be.equal(INNER_TEXT);
  });

  it('Should close popup', function () {
    var popup = popupWrapper.popup = {
      close: this.sinon.spy()
    };

    popupWrapper.hideTooltip();

    popup.close.should.been.called;
  });

});
