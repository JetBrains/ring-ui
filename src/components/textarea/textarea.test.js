'use strict';

describe('Textarea', function () {
  var React = require('react/addons');
  var Textarea = require('./textarea.jsx');
  var component;
  var container;

  function renderIntoDocument(instance) {
    container = document.createElement('div');
    return React.renderComponent(instance, container);
  }

  beforeEach(function () {
    component = renderIntoDocument(new Textarea());
  });

  it('should create component', function () {
    expect(React.addons.TestUtils.isCompositeComponentWithType(component, Textarea)).toEqual(true);
  });
});
