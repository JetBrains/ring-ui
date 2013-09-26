define(['global/global', 'chai', 'diff/diff'], function(ring, chai) {
  'use strict';

  var expect = chai.expect;

  describe('DiffTool basics: loading, getting and creating ' +
      'instance', function() {
    it('DiffTool loads as ring module', function() {
      expect(ring('diff')).to.be.a('function');
    });

    it('Module returns constructor of DiffTool properly.', function() {
      var DiffTool = ring('diff').invoke('getDiffTool');
      var instance = new DiffTool();

      expect(DiffTool).to.be.a('function');
      expect(instance).to.be.an.instanceof(DiffTool);
    });

    describe('Shorthand initialization of DiffTool', function() {
      var DiffTool = ring('diff').invoke('getDiffTool');
      var diffTool = ring('diff').invoke('getDiffToolUtils');

      it('ring can init single-pane diff', function() {
        var element = document.createElement('div');
        var singlePaneDiff = ring('diff').invoke('singlePaneDiff', element,
            'original', 'modified', [{
          newLines: 1,
          oldLines: 1,
          type: 'modified'
        }]);

        expect(singlePaneDiff).to.be.an.instanceof(
            diffTool.SingleEditorController);
        expect(singlePaneDiff.isEnabled()).to.equal(true);
        expect(singlePaneDiff.isEnabled()).to.equal(true);
        expect(singlePaneDiff.contentOriginal_).to.equal('original');
        expect(singlePaneDiff.contentModified_).to.equal('modified');
        expect(singlePaneDiff.diff_).to.eql([{
          newLines: 1,
          oldLines: 1,
          type: 'modified'
        }]);
      });

      it('ring can init double-pane diff', function() {
        var element = document.createElement('div');
        var singlePaneDiff = ring('diff').invoke('doublePaneDiff', element,
            'original', 'modified', [{
          newLines: 1,
          oldLines: 1,
          type: 'modified'
        }]);

        expect(singlePaneDiff).to.be.an.instanceof(
            diffTool.DoubleEditorController);
        expect(singlePaneDiff.isEnabled()).to.equal(true);
        expect(singlePaneDiff.contentOriginal_).to.equal('original');
        expect(singlePaneDiff.contentModified_).to.equal('modified');
        expect(singlePaneDiff.diff_).to.eql([{
          newLines: 1,
          oldLines: 1,
          type: 'modified'
        }]);
      });
    });
  });

  describe('DiffTool constructor', function() {
    var DiffTool = ring('diff').invoke('getDiffTool');
    var diffToolInstance;

    it('DiffTool creates instance without parameters and ' +
        'set correct default values', function() {
      diffToolInstance = new DiffTool();
      // todo(igor.alexeenko): Find out, how to test an empty <div/> element.
      expect(diffToolInstance.element_.tagName).to.equal('DIV');
      expect(diffToolInstance.mode_).to.equal(DiffTool.Mode.SINGLE_PANE);
    });

    it('DiffTool creates instance with all possible parameters — ' +
        'editable, element and default mode', function() {
      var element = document.createElement('div');

      diffToolInstance = new DiffTool(element, DiffTool.Mode.DOUBLE_PANE);
      expect(diffToolInstance.element_).to.equal(element);
      expect(diffToolInstance.mode_).to.equal(DiffTool.Mode.DOUBLE_PANE);
    });

    it('DiffTool normalizes given parameters and replace them to ' +
        'default values if they are not correct', function() {
      diffToolInstance = new DiffTool(undefined, DiffTool.Mode.ALL);
      expect(diffToolInstance.element_.tagName).to.equal('DIV');
      expect(diffToolInstance.mode_).to.equal(DiffTool.Mode.SINGLE_PANE);
    });

    it('DiffTool constructor adds all required fields', function() {
      diffToolInstance = new DiffTool();
      expect(diffToolInstance.mode_).to.be.a('number');
      expect(diffToolInstance.element_).to.be.an.instanceof(Element);
    });
  });

  describe('DiffTool modes', function() {
    var DiffTool = ring('diff').invoke('getDiffTool');
    var diffTool = ring('diff').invoke('getDiffToolUtils');
    var diffToolInstance = new DiffTool();

    describe('DiffTool modes existence', function() {
      it('DiffTool has enumerable list of modes.', function() {
        expect(DiffTool.Mode).to.be.an('object');
      });

      it('Every item of list DiffTool.Mode is a number and it bites ' +
          'does not intersect with bites of other items, so every ' +
          'item can be used as bit mask.', function() {
        // Following modes should be skipped, because it is aliases for
        // quick access to enable/disable all modes or check, whether all
        // of them enabled or disabled.
        var skipModes = {};
        skipModes[DiffTool.Mode.ALL] = true;
        skipModes[DiffTool.Mode.NONE] = true;

        var currentState = 0x00;
        var currentMode;

        for (var modeID in DiffTool.Mode) {
          currentMode = DiffTool.Mode[modeID];
          expect(currentMode).to.be.a('number');

          if (!(currentMode in skipModes)) {
            currentState = currentState & currentMode;
            expect(currentState).to.equal(0x00);
          }
        }
      });

      it('Every instance of DiffTool has a bit mask of available modes ' +
          'and those mods are taken from list of modes and was not ' +
          'randomly made up', function() {
        expect(DiffTool.prototype.availableModes).to.be.a('number');

        for (var modeID in DiffTool.Mode) {
          expect(Boolean(DiffTool.Mode[modeID] |
              DiffTool.prototype.availableModes)).to.be(true);
        }
      });
    });

    describe('DiffTool modes setters and getters', function() {
      it('DiffTool getMode returns current mode and default value is ' +
          'DiffTool.Mode.SINGLE_PANE', function() {
        expect(diffToolInstance.getMode()).to.equal(
            diffToolInstance.defaultMode);
        expect(diffToolInstance.getMode()).to.equal(
            DiffTool.Mode.SINGLE_PANE);
      });

      describe('DiffTool setMode', function() {
        it('DiffTool sets valid mode, which is one ' +
            'of allowed modes', function() {
          diffToolInstance.setMode(DiffTool.Mode.DOUBLE_PANE);
          expect(diffToolInstance.getMode()).to.equal(
              DiffTool.Mode.DOUBLE_PANE);
        });

        it('DiffTool does not allow to set mode, which is not listed in ' +
            'list of available modes. It that case it does nothing with' +
            'current mode', function() {
          diffToolInstance.setMode(DiffTool.Mode.SINGLE_PANE);
          diffToolInstance.setMode(DiffTool.Mode.TRIPLE_PANE);
          expect(diffToolInstance.getMode()).to.equal(
              DiffTool.Mode.SINGLE_PANE);
        });
      });
    });

    describe('DiffTool controller\'s for modes', function() {
      it('DiffTool has a controller for every available mode', function() {
        expect(diffToolInstance.modeToController_).to.be.an('object');
      });

      // todo(igor.alexeenko): Very complex test. It checks two cases. Simplify.
      it('IDs of modes in DiffTool.modeToController_ are taken ' +
          'from DiffTool.availableModes and each controller, ' +
          'corresponding to mode inherited from ' +
          'diffTool.EditorController.', function() {
        var currentController;

        for (var mode in diffToolInstance.modeToController_) {
          expect(Boolean(mode & diffToolInstance.availableModes)).to.equal(
              true);

          currentController = diffToolInstance.modeToController_[mode];
          expect(currentController).to.be.an.instanceof(
              diffTool.EditorController);
        }
      });

      it('DiffTool.setModeInternal changes instance of controller', function() {
        it('diffTool.setModeInternal sets SINGLE_PANE mode', function() {
          diffToolInstance.setMode(DiffTool.Mode.SINGLE_PANE);
          expect(diffToolInstance.getController()).to.be.an.instanceof(
              diffTool.SingleEditorController);
        });

        it('diffTool.setModeInternal sets DOUBLE_PANE mode', function() {
          diffToolInstance.setMode(DiffTool.Mode.DOUBLE_PANE);
          expect(diffToolInstance.getController()).to.be.an.instanceof(
              diffTool.DoubleEditorController);
        });
      });

      it('DiffTool.setModeInternal enables active controller' +
          'and disables inactive.', function() {
        var activeController;
        var disabledController;

        diffToolInstance.setMode(DiffTool.Mode.SINGLE_PANE);
        activeController = diffToolInstance.modeToController_[
            DiffTool.Mode.SINGLE_PANE];
        disabledController = diffToolInstance.modeToController_[
            DiffTool.Mode.DOUBLE_PANE];
        expect(activeController.isEnabled()).to.equal(true);
        expect(disabledController.isEnabled()).to.equal(false);

        diffToolInstance.setMode(DiffTool.Mode.DOUBLE_PANE);
        activeController = diffToolInstance.modeToController_[
            DiffTool.Mode.DOUBLE_PANE];
        disabledController = diffToolInstance.modeToController_[
            DiffTool.Mode.SINGLE_PANE];
        expect(activeController.isEnabled()).to.equal(true);
        expect(disabledController.isEnabled()).to.equal(false);
      });
    });
  });

  describe('DiffTool.getController', function() {
    var DiffTool = ring('diff').invoke('getDiffTool');
    var diffTool = ring('diff').invoke('getDiffToolUtils');
    var diffToolInstance = new DiffTool();

    it('DiffTool.getController returns current controller', function() {
      expect(diffToolInstance.getController).to.be.a('function');
      expect(diffToolInstance.getController()).to.be.an.instanceof(
          diffTool.EditorController);
    });
  });

  describe('DiffTool.setContent', function() {
    var DiffTool = ring('diff').invoke('getDiffTool');
    var diffTool = ring('diff').invoke('getDiffToolUtils');
    var diffToolInstance = new DiffTool();

    it('DiffTool.setContent calls setContent of its controller', function() {
      var original = 'original\n';
      var modified = 'modified\n';
      var diff = [
        {
          type: 'modified',
          newLines: 1,
          oldLines: 1
        }
      ];

      diffToolInstance.setContent(original, modified, diff);

      var controller = diffToolInstance.controller_;

      expect(controller.enabled_).to.equal(true);
      expect(controller.contentOriginal_).to.equal(original);
      expect(controller.contentModified_).to.equal(modified);
      expect(controller.diff_).to.equal(diff);
    });
  });

  describe('DiffTool.dispose', function() {
    var DiffTool = ring('diff').invoke('getDiffTool');
    var diffTool = ring('diff').invoke('getDiffToolUtils');
    var diffToolInstance = new DiffTool();

    it('DiffTool.dispose cleans memory — disables controller, equates its ' +
        'link to null, cleans html and removes all instance properties ' +
        'by equating them to null as well.', function() {
      var diffToolController = diffToolInstance.controller_;
      var diffToolElement = diffToolInstance.element_;

      expect(diffToolController).to.be.an.instanceof(diffTool.EditorController);
      expect(diffToolController.enabled_).to.equal(true);
      expect(diffToolElement).to.be.an.instanceof(Element);
      expect(diffToolInstance.mode_).to.equal(DiffTool.Mode.SINGLE_PANE);

      diffToolInstance.dispose();

      it('diffTool.EditorController is disabled after dispose of ' +
          'DiffTool and its link is null.', function() {
        expect(diffToolController.enabled_).to.equal(false);
        expect(diffToolInstance.controller_).to.equal(null);
      });

      it('DiffTool.element_ is cleaned and its link is null ' +
          'after dispose.', function() {
        expect(diffToolElement.innerHTML).to.equal('');
        expect(diffToolInstance.element_).to.equal(null);
      });

      it('DiffTool.mode_ is null after dispose.', function() {
        expect(diffToolInstance.mode_).to.equal(null);
      });
    });
  });
});
