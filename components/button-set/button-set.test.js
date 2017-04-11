import React from 'react';
import TestUtils from 'react-dom/test-utils';
import ButtonSet from './button-set';

describe('Button Set', () => {
  let component;

  beforeEach(() => {
    component = TestUtils.renderIntoDocument(React.createElement(ButtonSet));
  });

  it('should create component', () => {
    TestUtils.isCompositeComponentWithType(component, ButtonSet).should.equal(true);
  });
});
