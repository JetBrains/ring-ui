define([
  'global/global',
  'chai',
  'diff/diff',
  'diff/diff__tools',
  'diff/diff__editorcontroller'
], function(ring, chai) {
  'use strict';

  var expect = chai.expect;

  describe('d.EditorController base functionality', function() {
    var d = ring('diff').invoke('getDiffToolUtils');
    var dEditorController = d.EditorController;

    it('d.EditorController loads from ring module', function() {
      expect(d).to.be.an('object');
      expect(dEditorController).to.be.a('function');
    });
  });

  describe('d.EditorController constructor', function() {
    var d = ring('diff').invoke('getDiffToolUtils');

    it('d.EditorController creates new instance', function() {
      var dInstance = new d.EditorController();

      expect(dInstance).to.be.an.instanceof(d.EditorController);
      expect(dInstance.enabled_).to.equal(false);
    });

    it('d.EditorController creates new instance with ' +
        'overridden parameter', function() {
      var element = document.createElement('div');
      var dInstance = new d.EditorController(element, true);
      expect(dInstance.element_).to.equal(element);
    });
  });

  describe('d.Editor controller setters and getters', function() {
    it('d.EditorController.setContent()', function() {
      var d = ring('diff').invoke('getDiffToolUtils');
      var dInstance = new d.EditorController();
      dInstance.setEnabled(true);

      expect(dInstance.contentOriginal_).to.be.an('undefined');
      expect(dInstance.contentModified_).to.be.an('undefined');

      dInstance.setContent('original', 'modified');

      expect(dInstance.contentOriginal_).to.equal('original');
      expect(dInstance.contentModified_).to.equal('modified');
    });

    it('d.EditorController.setContent() does not work ' +
        'if element is disabled', function() {
      var d = ring('diff').invoke('getDiffToolUtils');
      var dInstance = new d.EditorController();

      var setContentFn = function() {
        dInstance.setContent('original', 'modified')
      };

      expect(setContentFn).to.throw(Error);
    });

    it('d.EditorController.setEnabled()', function() {
      var d = ring('diff').invoke('getDiffToolUtils');
      var dInstance = new d.EditorController();

      expect(dInstance.enabled_).to.equal(false);
      dInstance.setEnabled(true);
      expect(dInstance.enabled_).to.equal(true);
    });
  });
});
