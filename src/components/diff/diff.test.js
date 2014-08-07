'use strict';

describe('Diff', function () {
  var React = require('react/addons');
  var Diff = require('./diff.jsx');
  var component;
  var container;
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

  beforeEach(function () {
    container = document.createElement('div');
    this.DOMContainer.appendChild(container);

    component = null;
  });

  it('should create component', function () {
    component = React.renderComponent(new Diff({
      originalContent: diffDataMock.original,
      modifiedContent: diffDataMock.modified,
      diff: diffDataMock.diff
    }), container);

    expect(React.addons.TestUtils.isCompositeComponentWithType(component, Diff)).toEqual(true);
  });

  it('should create double pane diff', function () {
    component = React.renderComponent(new Diff({
      mode: Diff.Mode.DOUBLE_PANE,
      originalContent: diffDataMock.original,
      modifiedContent: diffDataMock.modified,
      diff: diffDataMock.diff
    }), container);

    expect(React.addons.TestUtils.isCompositeComponentWithType(component, Diff)).toEqual(true);
  });

  it('should correct unmount double pane diff', function () {
    component = React.renderComponent(new Diff({
      mode: Diff.Mode.DOUBLE_PANE,
      originalContent: diffDataMock.original,
      modifiedContent: diffDataMock.modified,
      diff: diffDataMock.diff
    }), container);

    component.unmountComponent(container);

    expect(component.isMounted()).toEqual(false);
  });
});
