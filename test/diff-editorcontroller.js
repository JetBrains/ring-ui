define(['global/global', 'chai', 'diff/diff',
  'diff/diff__tools', 'diff/diff__editorcontroller'], function(ring, chai) {
  'use strict';

  var expect = chai.expect;

  describe('diffTool.EditorController base functionality', function() {
    var diffTool = ring('diff').invoke('getDiffToolUtils');
    var diffToolEditorController = diffTool.EditorController;

    it('diffTool.EditorController loads from ring module', function() {
      expect(diffTool).to.be.an('object');
      expect(diffToolEditorController).to.be.a('function');
    });
  });

  describe('diffTool.EditorController constructor', function() {
    var diffTool = ring('diff').invoke('getDiffToolUtils');

    it('diffTool.EditorController creates new instance', function() {
      var diffToolInstance = new diffTool.EditorController();

      expect(diffToolInstance).to.be.an.instanceof(diffTool.EditorController);
      expect(diffToolInstance.enabled_).to.equal(false);
      expect(diffToolInstance.editable_).to.equal(false);
    });

    it('diffTool.EditorController creates new instance with ' +
        'overridden parameter', function() {
      var diffToolInstance = new diffTool.EditorController(true);
      expect(diffToolInstance.editable_).to.equal(true);
    });
  });

  describe('diffTool.Editor controller setters and getters', function() {
    it('diffTool.EditorController.setEditable()', function() {
      var diffTool = ring('diff').invoke('getDiffToolUtils');
      var diffToolInstance = new diffTool.EditorController();

      expect(diffToolInstance.editable_).to.equal(false);
      diffToolInstance.setEditable(true);
      expect(diffToolInstance.editable_).to.equal(true);
    });

    it('diffTool.EditorController.setContent()', function() {
      var diffTool = ring('diff').invoke('getDiffToolUtils');
      var diffToolInstance = new diffTool.EditorController(true);

      expect(diffToolInstance.contentOriginal_).to.be.an('undefined');
      expect(diffToolInstance.contentModified_).to.be.an('undefined');

      diffToolInstance.setContent('original', 'modified');

      expect(diffToolInstance.contentOriginal_).to.equal('original');
      expect(diffToolInstance.contentModified_).to.equal('modified');
    });

    it('diffTool.EditorController.setEnabled()', function() {
      var diffTool = ring('diff').invoke('getDiffToolUtils');
      var diffToolInstance = new diffTool.EditorController(true);

      expect(diffToolInstance.enabled_).to.equal(false);
      diffToolInstance.setEnabled(true);
      expect(diffToolInstance.enabled_).to.equal(true);
    });
  });
});