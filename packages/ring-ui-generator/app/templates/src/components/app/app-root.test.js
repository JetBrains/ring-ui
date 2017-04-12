import React from 'react';
import {isCompositeComponent, renderIntoDocument} from 'react-dom/test-utils';

import AppRoot from './app-root';

describe('AppRoot', () => {
  it('Should be component', () => {
    isCompositeComponent(renderIntoDocument(<AppRoot />)).should.be.true;
  });
});
