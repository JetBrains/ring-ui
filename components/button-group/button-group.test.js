import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ButtonGroup from './button-group';

describe('ButtonGroup', function () {
  let button;

  beforeEach(function () {
    button = TestUtils.renderIntoDocument(React.createElement(ButtonGroup));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(button, ButtonGroup).should.equal(true);
  });
});
