import React from 'react';
import TestUtils from 'react-dom/test-utils';
import ButtonGroup from './button-group';

describe('Button Group', () => {
  let button;

  beforeEach(() => {
    button = TestUtils.renderIntoDocument(React.createElement(ButtonGroup));
  });

  it('should create component', () => {
    TestUtils.isCompositeComponentWithType(button, ButtonGroup).should.equal(true);
  });
});
