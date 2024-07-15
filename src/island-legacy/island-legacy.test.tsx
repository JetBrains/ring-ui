import {HTMLAttributes} from 'react';
import {shallow, mount} from 'enzyme';

import Island from './island-legacy';

describe('Island Legacy', () => {
  const shallowIsland = (params?: HTMLAttributes<HTMLElement>) => shallow(<Island {...params}/>);
  const mountIsland = (params?: HTMLAttributes<HTMLElement>) => mount(<Island {...params}/>);

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
