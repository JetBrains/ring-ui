import React from 'react';
import {mount} from 'enzyme';

import ButtonSet from './button-set';

describe('Button Set', () => {
  it('should create component', () => {
    mount(<ButtonSet/>).should.have.type(ButtonSet);
  });
});
