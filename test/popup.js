define(['global/global', 'chai', 'global/global__utils', 'chai-as-promised', 'popup/popup'], function (ring, chai, utils) {
  'use strict';

  var expect = chai.expect;
  var popupModule = ring('popup');

  describe('Popup', function () {
    var popup;
    beforeEach(function () {
      popup = popupModule('create', {
          target: '.demo__select-example',
          items: [
            {
              'label': 'test'
            }
          ]
        }
      );
    });

    it('Popup return wrapper', function () {
      expect(popup.el instanceof $ || utils.isNode(popup.el)).to.equal(true);
    });

    it('Popup return target', function () {
      expect(popup.target instanceof $ || utils.isNode(popup.target)).to.equal(true);
    });

    it('Popup return getPos function', function () {
      expect(popup.getPos).to.be.a('function');
    });

    it('Popup return innerHTML function', function () {
      expect(popup.getPos).to.be.a('function');
    });

  });
});
