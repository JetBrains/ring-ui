import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Input from './input';

describe('Input', function () {
  let component;

  beforeEach(function () {
    component = TestUtils.renderIntoDocument(React.createElement(Input));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(component, Input).should.be.true;
  });
});
