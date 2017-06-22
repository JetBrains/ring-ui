import React from 'react';
import {shallow, mount} from 'enzyme';

import Island from './island-legacy';

describe('Island Legacy', () => {
  const shallowIsland = params => shallow(<Island {...params}/>);
  const mountIsland = params => mount(<Island {...params}/>);

  it('should create component', () => {
    mountIsland().should.have.type(Island);
  });

  it('should wrap children with div', () => {
    shallowIsland().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowIsland({className: 'test-class'}).should.have.className('test-class');
  });
});
