describe('Diff', function () {
  describe('EditorController', function () {
    var EditorController = require('./diff__editorcontroller');
    var dInstance;

    beforeEach(function () {
      dInstance = new EditorController();
    });

    it('should export module', function () {
      EditorController.should.exist;
    });

    it('should creates new instance', function () {
      dInstance.should.be.instanceOf(EditorController);
    });

    it('should be disabled by default', function () {
      dInstance.isEnabled().should.be.false;
    });

    it('should associate controller with element', function () {
      var element = document.createElement('div');
      dInstance = new EditorController(element);

      dInstance.getElement().should.equal(element);
    });

    it('should set content', function () {
      dInstance.setEnabled(true);

      expect(dInstance.getOriginal()).not.to.exist;
      expect(dInstance.getModified()).not.to.exist;

      dInstance.setContent('original', 'modified');

      dInstance.getOriginal().should.equal('original');
      dInstance.getModified().should.equal('modified');
    });

    it('should throw error if try set content to disabled controller', function () {
      dInstance.setContent.bind(dInstance, 'original', 'modified').should.throw;
    });
  });
});
