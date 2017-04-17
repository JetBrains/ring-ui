import React from 'react';
import {isCompositeComponentWithType, renderIntoDocument} from 'react-dom/test-utils';

import ButtonGroup from './button-group';

describe('Button Group', () => {
  let button;

  beforeEach(() => {
    button = renderIntoDocument(React.createElement(ButtonGroup));
  });

  it('should create component', () => {
    isCompositeComponentWithType(button, ButtonGroup).should.equal(true);
  });
});
