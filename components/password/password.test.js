import React from 'react';
import {mount} from 'enzyme';

import Password from './password';

describe('Password', () => {
  const mountComponent = props => mount(
    <Password
      {...props}
    />
  );

  it('should create component', () => {
    mountComponent().should.have.type(Password);
  });
});
