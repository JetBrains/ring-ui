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
      expect(diffToolInstance.editable_).to.equal(true);
    });

    it('diffTool.EditorController creates new instance with ' +
        'overridden parameter', function() {
      var element = document.createElement('div');
      var diffToolInstance = new diffTool.EditorController(element, true);
      expect(diffToolInstance.element_).to.equal(element);
      expect(diffToolInstance.editable_).to.equal(true);
    });
  });

  describe('diffTool.Editor controller setters and getters', function() {
    it('diffTool.EditorController.setEditable()/' +
        'diffTool.EditorController.isEditable()', function() {
      var diffTool = ring('diff').invoke('getDiffToolUtils');
      var diffToolInstance = new diffTool.EditorController();

      expect(diffToolInstance.isEditable()).to.equal(true);
      diffToolInstance.setEditable(false);
      expect(diffToolInstance.isEditable()).to.equal(false);
    });

    it('diffTool.EditorController.setContent()', function() {
      var diffTool = ring('diff').invoke('getDiffToolUtils');
      var diffToolInstance = new diffTool.EditorController();
      diffToolInstance.setEnabled(true);

      expect(diffToolInstance.contentOriginal_).to.be.an('undefined');
      expect(diffToolInstance.contentModified_).to.be.an('undefined');

      diffToolInstance.setContent('original', 'modified');

      expect(diffToolInstance.contentOriginal_).to.equal('original');
      expect(diffToolInstance.contentModified_).to.equal('modified');
    });

    it('diffTool.EditorController.setContent() does not work ' +
        'if element is disabled', function() {
      var diffTool = ring('diff').invoke('getDiffToolUtils');
      var diffToolInstance = new diffTool.EditorController();

      diffToolInstance.setContent('original', 'modified');

      expect(diffToolInstance.contentOriginal_).to.be.an('undefined');
      expect(diffToolInstance.contentModified_).to.be.an('undefined');
    });

    it('diffTool.EditorController.setEnabled()', function() {
      var diffTool = ring('diff').invoke('getDiffToolUtils');
      var diffToolInstance = new diffTool.EditorController();

      expect(diffToolInstance.enabled_).to.equal(false);
      diffToolInstance.setEnabled(true);
      expect(diffToolInstance.enabled_).to.equal(true);
    });
  });
});