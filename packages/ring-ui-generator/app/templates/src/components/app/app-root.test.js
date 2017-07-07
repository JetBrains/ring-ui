import React from 'react';
import {shallow} from 'enzyme';

import AppRoot from './app-root';

describe('AppRoot', () => {
  it('Should render', () => {
    shallow(<AppRoot/>).should.exist;
  });
});
