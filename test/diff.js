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
      var d = ring('diff').invoke('getDiffToolUtils');

      it('ring can init single-pane diff', function() {
        var element = document.createElement('div');
        var singlePaneDiff = ring('diff').invoke('singlePaneDiff', element,
            'original', 'modified', [{
          newLines: 1,
          oldLines: 1,
          type: 'modified'
        }]);

        expect(singlePaneDiff).to.be.an.instanceof(DiffTool);
        expect(singlePaneDiff.getController().isEnabled()).to.equal(true);
        expect(singlePaneDiff.getController().isEnabled()).to.equal(true);
        expect(singlePaneDiff.getController().contentOriginal_).to.equal('original');
        expect(singlePaneDiff.getController().contentModified_).to.equal('modified');
        expect(singlePaneDiff.getController().diff_).to.eql([{
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

        expect(singlePaneDiff).to.be.an.instanceof(DiffTool);
        expect(singlePaneDiff.getController().isEnabled()).to.equal(true);
        expect(singlePaneDiff.getController().contentOriginal_).to.equal('original');
        expect(singlePaneDiff.getController().contentModified_).to.equal('modified');
        expect(singlePaneDiff.getController().diff_).to.eql([{
          newLines: 1,
          oldLines: 1,
          type: 'modified'
        }]);
      });
    });
  });

  describe('DiffTool constructor', function() {
    var DiffTool = ring('diff').invoke('getDiffTool');
    var dInstance;

    it('DiffTool creates instance without parameters and ' +
        'set correct default values', function() {
      dInstance = new DiffTool();
      // todo(igor.alexeenko): Find out, how to test an empty <div/> element.
      expect(dInstance.element_.tagName).to.equal('DIV');
      expect(dInstance.mode_).to.equal(DiffTool.Mode.SINGLE_PANE);
    });

    it('DiffTool creates instance with all possible parameters — ' +
        'editable, element and default mode', function() {
      var element = document.createElement('div');

      dInstance = new DiffTool(element, DiffTool.Mode.DOUBLE_PANE);
      expect(dInstance.element_).to.equal(element);
      expect(dInstance.mode_).to.equal(DiffTool.Mode.DOUBLE_PANE);
    });

    it('DiffTool normalizes given parameters and replace them to ' +
        'default values if they are not correct', function() {
      dInstance = new DiffTool(undefined, DiffTool.Mode.ALL);
      expect(dInstance.element_.tagName).to.equal('DIV');
      expect(dInstance.mode_).to.equal(DiffTool.Mode.SINGLE_PANE);
    });

    it('DiffTool constructor adds all required fields', function() {
      dInstance = new DiffTool();
      expect(dInstance.mode_).to.be.a('number');
      expect(dInstance.element_).to.be.an.instanceof(Element);
    });
  });

  describe('DiffTool modes', function() {
    var DiffTool = ring('diff').invoke('getDiffTool');
    var d = ring('diff').invoke('getDiffToolUtils');
    var dInstance = new DiffTool();

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
        expect(dInstance.getMode()).to.equal(
            dInstance.defaultMode);
        expect(dInstance.getMode()).to.equal(
            DiffTool.Mode.SINGLE_PANE);
      });

      describe('DiffTool setMode', function() {
        it('DiffTool sets valid mode, which is one ' +
            'of allowed modes', function() {
          dInstance.setMode(DiffTool.Mode.DOUBLE_PANE);
          expect(dInstance.getMode()).to.equal(
              DiffTool.Mode.DOUBLE_PANE);
        });

        it('DiffTool does not allow to set mode, which is not listed in ' +
            'list of available modes. It that case it does nothing with' +
            'current mode', function() {
          dInstance.setMode(DiffTool.Mode.SINGLE_PANE);
          dInstance.setMode(DiffTool.Mode.TRIPLE_PANE);
          expect(dInstance.getMode()).to.equal(
              DiffTool.Mode.SINGLE_PANE);
        });
      });
    });

    describe.skip('DiffTool controller\'s for modes', function() {
      it('DiffTool has a controller for every available mode', function() {
        dInstance.activateMode();
        expect(dInstance.modeToController_).to.be.an('object');
      });

      // todo(igor.alexeenko): Very complex test. It checks two cases. Simplify.
      it('IDs of modes in DiffTool.modeToController_ are taken ' +
          'from DiffTool.availableModes and each controller, ' +
          'corresponding to mode inherited from ' +
          'd.EditorController.', function() {
        var currentController;

        for (var mode in dInstance.modeToController_) {
          expect(Boolean(mode & dInstance.availableModes)).to.equal(
              true);

          currentController = dInstance.modeToController_[mode];
          expect(currentController).to.be.an.instanceof(
              d.EditorController);
        }
      });

      it('DiffTool.setModeInternal changes instance of controller', function() {
        it('d.setModeInternal sets SINGLE_PANE mode', function() {
          dInstance.setMode(DiffTool.Mode.SINGLE_PANE);
          expect(dInstance.getController()).to.be.an.instanceof(
              d.SingleEditorController);
        });

        it('d.setModeInternal sets DOUBLE_PANE mode', function() {
          dInstance.setMode(DiffTool.Mode.DOUBLE_PANE);
          expect(dInstance.getController()).to.be.an.instanceof(
              d.DoubleEditorController);
        });
      });

      it('DiffTool.setModeInternal enables active controller' +
          'and disables inactive.', function() {
        var activeController;
        var disabledController;

        dInstance.setMode(DiffTool.Mode.SINGLE_PANE);
        dInstance.setContent('asd', 'dsa', []);

        activeController = dInstance.modeToController_[
            DiffTool.Mode.SINGLE_PANE];
        disabledController = dInstance.modeToController_[
            DiffTool.Mode.DOUBLE_PANE];
        expect(activeController.isEnabled()).to.equal(true);
        expect(disabledController.isEnabled()).to.equal(false);

        dInstance.setMode(DiffTool.Mode.DOUBLE_PANE);
        dInstance.setContent('asd', 'dsa', []);

        activeController = dInstance.modeToController_[
            DiffTool.Mode.DOUBLE_PANE];
        disabledController = dInstance.modeToController_[
            DiffTool.Mode.SINGLE_PANE];
        expect(activeController.isEnabled()).to.equal(true);
        expect(disabledController.isEnabled()).to.equal(false);
      });
    });
  });

  describe.skip('DiffTool.getController', function() {
    var DiffTool = ring('diff').invoke('getDiffTool');
    var d = ring('diff').invoke('getDiffToolUtils');
    var dInstance = new DiffTool();

    it('DiffTool.getController returns current controller', function() {
      expect(dInstance.getController).to.be.a('function');
      expect(dInstance.getController()).to.be.an.instanceof(
          d.EditorController);
    });
  });

  describe('DiffTool.setContent', function() {
    var DiffTool = ring('diff').invoke('getDiffTool');
    var d = ring('diff').invoke('getDiffToolUtils');
    var dInstance = new DiffTool();

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

      dInstance.setContent(original, modified, diff);

      var controller = dInstance.controller_;

      expect(controller.enabled_).to.equal(true);
      expect(controller.contentOriginal_).to.equal(original);
      expect(controller.contentModified_).to.equal(modified);
      expect(controller.diff_).to.equal(diff);
    });
  });

  describe('DiffTool.dispose', function() {
    var DiffTool = ring('diff').invoke('getDiffTool');
    var d = ring('diff').invoke('getDiffToolUtils');
    var dInstance = new DiffTool();

    dInstance.setContent('asd', 'dsa', []);

    it('DiffTool.dispose cleans memory — disables controller, equates its ' +
        'link to null, cleans html and removes all instance properties ' +
        'by equating them to null as well.', function() {
      var dController = dInstance.controller_;
      var dElement = dInstance.element_;

      expect(dController).to.be.an.instanceof(d.EditorController);
      expect(dController.enabled_).to.equal(true);
      expect(dElement).to.be.an.instanceof(Element);
      expect(dInstance.mode_).to.equal(DiffTool.Mode.SINGLE_PANE);

      dInstance.dispose();

      it('d.EditorController is disabled after dispose of ' +
          'DiffTool and its link is null.', function() {
        expect(dController.enabled_).to.equal(false);
        expect(dInstance.controller_).to.equal(null);
      });

      it('DiffTool.element_ is cleaned and its link is null ' +
          'after dispose.', function() {
        expect(dElement.innerHTML).to.equal('');
        expect(dInstance.element_).to.equal(null);
      });

      it('DiffTool.mode_ is null after dispose.', function() {
        expect(dInstance.mode_).to.equal(null);
      });
    });
  });
});
