'use strict';

describe('Textarea', function () {
  var React = require('react/addons');
  var Textarea = require('../../../src/components/textarea/textarea.jsx');
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
    expect(React.addons.TestUtils.isComponentOfType(component, Textarea)).toEqual(true);
  });
});
