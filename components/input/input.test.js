import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Input from './input';

describe('Input', () => {
  let component;

  beforeEach(() => {
    component = TestUtils.renderIntoDocument(React.createElement(Input));
  });

  it('should create component', () => {
    TestUtils.isCompositeComponentWithType(component, Input).should.be.true;
  });
});
