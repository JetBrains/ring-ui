'use strict';

describe('Diff', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var Diff = require('./diff.jsx');
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

  var DOMContainer;

  // We need custom renderIntoDocument with attached contantainer here because of CodeMirror
  var renderIntoDocument = function (instance) {
    return React.renderComponent(instance, DOMContainer);
  };

  beforeEach(function () {
    DOMContainer = document.createElement('div');
    document.documentElement.appendChild(DOMContainer);
  });

  afterEach(function () {
    document.documentElement.removeChild(DOMContainer);
  });

  it('should create component', function () {
    var component = renderIntoDocument(new Diff({
      originalContent: diffDataMock.original,
      modifiedContent: diffDataMock.modified,
      diff: diffDataMock.diff
    }));

    TestUtils.isCompositeComponentWithType(component, Diff).should.be.true;
  });

  it('should create double pane diff', function () {
    var component = renderIntoDocument(new Diff({
      mode: Diff.Mode.DOUBLE_PANE,
      originalContent: diffDataMock.original,
      modifiedContent: diffDataMock.modified,
      diff: diffDataMock.diff
    }));

    TestUtils.isCompositeComponentWithType(component, Diff).should.be.true;
  });

  it('should correct unmount double pane diff', function () {
    var component = renderIntoDocument(new Diff({
      mode: Diff.Mode.DOUBLE_PANE,
      originalContent: diffDataMock.original,
      modifiedContent: diffDataMock.modified,
      diff: diffDataMock.diff
    }));

    component.unmountComponent(component.getDOMNode().parent);

    component.isMounted().should.be.false;
  });

  it('should update code mirror editor when update diff', function () {
    var component = renderIntoDocument(new Diff({
      originalContent: diffDataMock.original,
      modifiedContent: diffDataMock.modified,
      diff: diffDataMock.diff
    }));
    var newDiff = [];

    component.setProps({
      diff: newDiff
    });

    component.diff_.getController().getDiff().should.be.equal(newDiff);
  });
});
