import React from 'react';
import {shallow, mount} from 'enzyme';

import Group from './group';

describe('Group', () => {
  const shallowGroup = props => shallow(<Group {...props}/>);
  const mountGroup = props => mount(<Group {...props}/>);

  it('should create component', () => {
    mountGroup().should.have.type(Group);
  });

  it('should wrap children with div', () => {
    shallowGroup().should.have.tagName('span');
  });

  it('should use passed className', () => {
    shallowGroup({className: 'test-class'}).should.have.className('test-class');
  });
});
