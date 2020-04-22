import React from 'react';
import {mount} from 'enzyme';

import Header from './header';

describe('Header', () => {
  const mountHeader = props => mount(<Header {...props}/>);
  const getHeaderDiv = props => mountHeader(props).find('header');

  it('should create component', () => {
    mountHeader().type().should.equal(Header.type);
  });

  it('should wrap children with руфвук', () => {
    getHeaderDiv().should.exist;
  });

  it('should use passed className', () => {
    getHeaderDiv({className: 'test-class'}).should.have.className('test-class');
  });
});
