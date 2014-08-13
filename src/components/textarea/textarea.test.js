'use strict';

describe('Textarea', function () {
  var React = require('react/addons');
  var Textarea = require('./textarea.jsx');
  var component;

  beforeEach(function () {
    component = React.addons.TestUtils.renderIntoDocument(new Textarea());
  });

  it('should create component', function () {
    React.addons.TestUtils.isCompositeComponentWithType(component, Textarea).should.be.true;
  });
});
