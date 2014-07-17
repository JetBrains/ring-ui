'use strict';

describe('Textarea', function () {
  var React = require('react/addons');
  var Input = require('./input.jsx');
  var component;
  var container;

  function renderIntoDocument(instance) {
    container = document.createElement('div');
    return React.renderComponent(instance, container);
  }

  beforeEach(function () {
    component = renderIntoDocument(new Input());
  });

  it('should create component', function () {
    expect(React.addons.TestUtils.isComponentOfType(component, Input)).toEqual(true);
  });
});
