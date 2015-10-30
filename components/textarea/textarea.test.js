import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Textarea from './textarea';

describe('Textarea', function () {
  let component;

  beforeEach(function () {
    component = TestUtils.renderIntoDocument(React.createElement(Textarea));
  });

  it('should create component', function () {
    TestUtils.isCompositeComponentWithType(component, Textarea).should.be.true;
  });
});
