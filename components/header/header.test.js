import React from 'react';
import {mount} from 'enzyme';

import Header from './header';

describe('Header', () => {
  const mountHeader = props => mount(<Header {...props}/>);
  const getHeaderDiv = props => mountHeader(props).find('div');

  it('should create component', () => {
    mountHeader().should.have.type(Header);
  });

  it('should wrap children with div', () => {
    getHeaderDiv().should.exist;
  });

  it('should use passed className', () => {
    getHeaderDiv({className: 'test-class'}).should.have.className('test-class');
  });
});
