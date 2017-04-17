import React from 'react';
import {isCompositeComponentWithType, renderIntoDocument} from 'react-dom/test-utils';

import ButtonSet from './button-set';

describe('Button Set', () => {
  let component;

  beforeEach(() => {
    component = renderIntoDocument(React.createElement(ButtonSet));
  });

  it('should create component', () => {
    isCompositeComponentWithType(component, ButtonSet).should.equal(true);
  });
});
