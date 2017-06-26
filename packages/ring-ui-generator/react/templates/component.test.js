import React from 'react';
import {shallow, mount} from 'enzyme';

import <%= pascalCaseName %> from './<%= paramCaseName %>';

describe('<%= titleCaseName %>', () => {
  const shallow<%= pascalCaseName %> = props => shallow(<<%= pascalCaseName %> {...props}/>);
  const mount<%= pascalCaseName %> = props => mount(<<%= pascalCaseName %> {...props}/>);

  it('should create component', () => {
    mount<%= pascalCaseName %>().should.have.type(<%= pascalCaseName %>);
  });

  it('should wrap children with div', () => {
    shallow<%= pascalCaseName %>().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallow<%= pascalCaseName %>({
      className: 'test-class'
    }).should.have.className('test-class');
  });

  // TODO Add more tests
});
