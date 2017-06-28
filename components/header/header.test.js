import React from 'react';
import {shallow, mount} from 'enzyme';

import Header from './header';

describe('Header', () => {
  const shallowHeader = props => shallow(<Header {...props}/>);
  const mountHeader = props => mount(<Header {...props}/>);

  it('should create component', () => {
    mountHeader().should.have.type(Header);
  });

  it('should wrap children with div', () => {
    shallowHeader().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowHeader({className: 'test-class'}).should.have.className('test-class');
  });

  // TODO Add more tests
});
