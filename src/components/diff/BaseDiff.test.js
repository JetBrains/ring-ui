'use strict';

describe('Diff', function () {
  var BaseDiff = require('./BaseDiff');
  var DiffTool = BaseDiff.getDiffTool();
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

  beforeEach(function () {
    dInstance = new DiffTool();
  });

  it('should create instance', function () {
    expect(dInstance).toBeInstanceOf(DiffTool);
  });

  it('should have enumerable list of modes.', function () {
    expect(DiffTool.Mode).toBeDefined();
  });

  it('should create sinle pane diff by default', function () {
    expect(dInstance.getMode()).toEqual(DiffTool.Mode.SINGLE_PANE);
  });

  it('should create container by default', function () {
    expect(dInstance.getElement().tagName).toEqual('DIV');
  });

  it('should create diff with specific mode and element', function () {
    var element = document.createElement('div');
    this.DOMContainer.appendChild(element);

    dInstance = new DiffTool(element, DiffTool.Mode.PLAIN_FILE);

    expect(dInstance.getMode()).toEqual(DiffTool.Mode.PLAIN_FILE);
    expect(dInstance.getElement()).toEqual(element);
  });

  it('should normalizes given parameters and replace them to default values if they are not correct', function () {
    dInstance = new DiffTool(undefined, DiffTool.Mode.ALL);

    expect(dInstance.getElement().tagName).toEqual('DIV');
    expect(dInstance.getMode()).toEqual(DiffTool.Mode.SINGLE_PANE);
  });

  it('should initialize plain diff', function () {
    var element = document.createElement('div');
    this.DOMContainer.appendChild(element);

    var plainDiff = BaseDiff.Plain(element,
      diffDataMock.original,
      diffDataMock.modified,
      diffDataMock.diff
    );

    expect(plainDiff.getController().isEnabled()).toEqual(true);
    expect(plainDiff.getController().getOriginal()).toEqual(diffDataMock.original);
    expect(plainDiff.getController().getModified()).toEqual(diffDataMock.modified);
    expect(plainDiff.getController().getDiff()).toEqual(diffDataMock.diff);
  });

  it('should initialize single pane diff', function () {
    var element = document.createElement('div');
    this.DOMContainer.appendChild(element);

    dInstance = BaseDiff.SinglePane(element,
      diffDataMock.original,
      diffDataMock.modified,
      diffDataMock.diff
    );

    expect(dInstance).toBeDefined();
  });

  it('Every item of list DiffTool.Mode is a number and it bites ' +
    'does not intersect with bites of other items, so every ' +
    'item can be used as bit mask.', function () {

    /*
     Following modes should be skipped, because it is aliases for
     quick access to enable/disable all modes or check, whether all
     of them enabled or disabled.
     */
    var skipModes = {};
    skipModes[DiffTool.Mode.ALL] = true;
    skipModes[DiffTool.Mode.NONE] = true;

    var currentState = 0x00;
    var currentMode;

    for (var modeID in DiffTool.Mode) {
      if (DiffTool.Mode.hasOwnProperty(modeID)) {
        currentMode = DiffTool.Mode[modeID];
        expect(typeof currentMode).toBe('number');

        if (!(currentMode in skipModes)) {
          currentState = currentState & currentMode;
          expect(currentState).toEqual(0x00);
        }
      }
    }
  });

  it('Every instance of DiffTool has a bit mask of available modes ' +
    'and those mods are taken from list of modes and was not ' +
    'randomly made up', function () {
    expect(typeof DiffTool.prototype.availableModes).toBe('number');

    for (var modeID in DiffTool.Mode) {
      if (DiffTool.Mode.hasOwnProperty(modeID)) {
        expect(Boolean(DiffTool.Mode[modeID] |
          DiffTool.prototype.availableModes)).toBeTruthy();
      }
    }
  });

  it('should not set mode, which is not listed in available modes list', function () {
    dInstance.setMode(DiffTool.Mode.SINGLE_PANE);
    dInstance.setMode(DiffTool.Mode.TRIPLE_PANE);

    expect(dInstance.getMode()).toEqual(
      DiffTool.Mode.SINGLE_PANE);
  });

  it('should disable previous controller between switch mode', function () {
    var prevController = dInstance.getController();

    dInstance.setMode(DiffTool.Mode.PLAIN_FILE);

    expect(dInstance.getController().isEnabled()).toEqual(true);
    expect(prevController.isEnabled()).toEqual(false);
  });

  it('should dispose diff component', function () {
    var controller = dInstance.getController();
    var element = dInstance.getElement();

    dInstance.setContent('asd', 'dsa', []);
    dInstance.dispose();

    expect(controller.isEnabled()).toEqual(false);
    expect(dInstance.getController()).toEqual(null);
    expect(dInstance.getMode()).toEqual(null);
    expect(dInstance.getElement()).toEqual(null);
    expect(element.innerHTML).toEqual('');
  });
});
