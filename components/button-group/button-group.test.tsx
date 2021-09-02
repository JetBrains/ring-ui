import React from 'react';
import {mount} from 'enzyme';

import ButtonGroup from './button-group';

describe('Button Group', () => {
  it('should create component', () => {
    mount(<ButtonGroup/>).should.have.type(ButtonGroup);
  });
});
