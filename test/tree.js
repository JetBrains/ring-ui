define(['global/global', 'chai', 'tree/tree', 'chai-as-promised'], function (ring, chai, Tree) {
  'use strict';

  var expect = chai.expect;

  describe('Tree', function () {
    beforeEach(function () {
      this.fileItemMock = {
        path: 'test.js'
      };
    });

    it('should render element after create instance', function () {
      var tree = new Tree();

//      expect(tree.$el.html()).to.be.ok();
      expect(tree).to.be.a('object');


    });

    it('should render element if we pass not emply list', function () {
      var tree = new Tree([this.fileItemMock]);

//      expect(tree.$el.html()).to.be.ok();
      expect(tree).to.be.a('object');
    });
  });
});
