'use strict';

describe('Input', function () {
  var React = require('react/addons');
  var Input = require('./input.jsx');
  var component;

  beforeEach(function () {
    component = React.addons.TestUtils.renderIntoDocument(new Input());
  });

  it('should create component', function () {
    React.addons.TestUtils.isCompositeComponentWithType(component, Input).should.be.true;
  });
});
