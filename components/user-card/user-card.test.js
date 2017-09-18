import React from 'react';
import {shallow, mount} from 'enzyme';

import {UserCard} from './user-card';

describe('UserCard', () => {
  const fakeUser = {
    login: 'testuser',
    name: 'Test User',
    profile: {
      email: {email: 'testuser@mail.com'},
      avatar: {
        url: 'http://some-url'
      }
    }
  };

  const shallowCard = props => shallow(<UserCard user={fakeUser} {...props}/>);
  const mountCard = props => mount(<UserCard user={fakeUser} {...props}/>);

  it('should create component', () => {
    mountCard().should.have.type(UserCard);
  });

  it('should wrap children with span', () => {
    shallowCard().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowCard({className: 'test-class'}).should.have.className('test-class');
  });

  it('should use pass rest props to dom node', () => {
    shallowCard({'data-test': 'foo'}).should.have.data('test', 'foo');
  });
});
