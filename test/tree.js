define(['tree/tree'], function(Tree) {
  'use strict';

  describe('Tree', function() {
    beforeEach(function() {
      this.fileItemMock = {
        path: 'test.js'
      };
    });

    it('should render element after create instance', function() {
      var tree = new Tree();

      tree.$el.html().should.be.ok;
    });

    it('should render element if we pass not emply list', function() {
      var tree = new Tree([this.fileItemMock]);

      tree.$el.html().should.be.ok;
    });
  });
});
