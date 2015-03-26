/* eslint-disable no-bitwise */
describe('Diff', function () {
  describe('base', function () {
    var BaseDiff = require('./diff__base');
    var diffDataMock = {
      original: 'original',
      modified: 'modified',
      diff: [
        {
          newLines: 1,
          oldLines: 1,
          type: 'modified'
        }
      ]
    };
    var dInstance;

    var DOMContainer;

    // We need attached contantainer here because of CodeMirror
    beforeEach(function () {
      dInstance = new BaseDiff();

      DOMContainer = document.createElement('div');
      document.documentElement.appendChild(DOMContainer);
    });

    afterEach(function () {
      document.documentElement.removeChild(DOMContainer);
    });

    it('should create instance', function () {
      dInstance.should.be.instanceOf(BaseDiff);
    });

    it('should have enumerable list of modes.', function () {
      BaseDiff.Mode.should.exist;
    });

    it('should create sinle pane diff by default', function () {
      dInstance.getMode().should.equal(BaseDiff.Mode.SINGLE_PANE);
    });

    it('should create container by default', function () {
      dInstance.getElement().tagName.should.equal('DIV');
    });

    it('should create diff with specific mode and element', function () {
      var element = document.createElement('div');
      DOMContainer.appendChild(element);

      dInstance = new BaseDiff(element, BaseDiff.Mode.PLAIN_FILE);

      dInstance.getMode().should.equal(BaseDiff.Mode.PLAIN_FILE);
      dInstance.getElement().should.equal(element);
    });

    it('should normalizes given parameters and replace them to default values if they are not correct', function () {
      dInstance = new BaseDiff(undefined, BaseDiff.Mode.ALL);

      dInstance.getElement().tagName.should.equal('DIV');
      dInstance.getMode().should.equal(BaseDiff.Mode.SINGLE_PANE);
    });

    it('should initialize plain diff', function () {
      var element = document.createElement('div');
      DOMContainer.appendChild(element);

      var plainDiff = new BaseDiff(element, BaseDiff.Mode.PLAIN_FILE);
      plainDiff.setContent(
        diffDataMock.original,
        diffDataMock.modified,
        diffDataMock.diff
      );

      plainDiff.getController().isEnabled().should.be.true;
      plainDiff.getController().getOriginal().should.equal(diffDataMock.original);
      plainDiff.getController().getModified().should.equal(diffDataMock.modified);
      plainDiff.getController().getDiff().should.equal(diffDataMock.diff);
    });

    it('should initialize single pane diff', function () {
      var element = document.createElement('div');
      DOMContainer.appendChild(element);

      dInstance = new BaseDiff(element, BaseDiff.Mode.SINGLE_PANE);
      dInstance.setContent(
        diffDataMock.original,
        diffDataMock.modified,
        diffDataMock.diff
      );

      dInstance.should.exist;
    });

    it('Every item of list BaseDiff.Mode is a number and it bites ' +
    'does not intersect with bites of other items, so every ' +
    'item can be used as bit mask.', function () {

      /*
       Following modes should be skipped, because it is aliases for
       quick access to enable/disable all modes or check, whether all
       of them enabled or disabled.
       */
      var skipModes = {};
      skipModes[BaseDiff.Mode.ALL] = true;
      skipModes[BaseDiff.Mode.NONE] = true;

      var currentState = 0x00;
      var currentMode;

      for (var modeID in BaseDiff.Mode) {
        if (BaseDiff.Mode.hasOwnProperty(modeID)) {
          currentMode = BaseDiff.Mode[modeID];
          currentMode.should.be.a('number');

          if (!(currentMode in skipModes)) {
            currentState = currentState & currentMode;
            currentState.should.equal(0x00);
          }
        }
      }
    });

    it('Every instance of BaseDiff has a bit mask of available modes ' +
    'and those mods are taken from list of modes and was not ' +
    'randomly made up', function () {
      BaseDiff.prototype.availableModes.should.be.a('number');

      for (var modeID in BaseDiff.Mode) {
        if (BaseDiff.Mode.hasOwnProperty(modeID)) {
          expect(Boolean(BaseDiff.Mode[modeID] |
          BaseDiff.prototype.availableModes)).to.be.true;
        }
      }
    });

    it('should not set mode, which is not listed in available modes list', function () {
      dInstance.setMode(BaseDiff.Mode.SINGLE_PANE);
      dInstance.setMode(BaseDiff.Mode.TRIPLE_PANE);

      dInstance.getMode().should.equal(
        BaseDiff.Mode.SINGLE_PANE);
    });

    it('should disable previous controller between switch mode', function () {
      var prevController = dInstance.getController();

      dInstance.setMode(BaseDiff.Mode.PLAIN_FILE);

      dInstance.getController().isEnabled().should.be.true;
      prevController.isEnabled().should.be.false;
    });

    it('should dispose diff component', function () {
      var controller = dInstance.getController();
      var element = dInstance.getElement();

      dInstance.setContent('asd', 'dsa', []);
      dInstance.dispose();

      controller.isEnabled().should.be.false;
      expect(dInstance.getController()).to.be.null;
      expect(dInstance.getMode()).to.be.null;
      expect(dInstance.getElement()).to.be.null;
      element.innerHTML.should.equal('');
    });
  });
});
