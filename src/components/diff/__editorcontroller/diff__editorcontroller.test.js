'use strict';

describe('Diff.EditorController', function () {
  var EditorController = require('./diff__editorcontroller');
  var dInstance;

  beforeEach(function () {
    dInstance = new EditorController();
  });

  it('should export module', function () {
    expect(EditorController).toBeDefined();
  });

  it('should creates new instance', function () {
    expect(dInstance).toBeInstanceOf(EditorController);
  });

  it('should be disabled by default', function () {
    expect(dInstance.isEnabled()).toEqual(false);
  });

  it('should associate controller with element', function () {
    var element = document.createElement('div');
    dInstance = new EditorController(element);

    expect(dInstance.getElement()).toEqual(element);
  });

  it('should set content', function () {
    dInstance.setEnabled(true);

    expect(dInstance.getOriginal()).not.toBeDefined();
    expect(dInstance.getModified()).not.toBeDefined();

    dInstance.setContent('original', 'modified');

    expect(dInstance.getOriginal()).toEqual('original');
    expect(dInstance.getModified()).toEqual('modified');
  });

  it('should throw error if try set content to disabled controller', function () {
    expect(dInstance.setContent.bind(dInstance, 'original', 'modified')).toThrow();
  });
});
