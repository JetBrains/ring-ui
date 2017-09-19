import React from 'react';
import {shallow, mount} from 'enzyme';

import {HubUserCardTooltip, UserCard, UserCardTooltip} from './user-card';

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

  const getHref = () => 'http://foo';

  describe('Card', () => {
    const shallowCard = props => shallow(
      <UserCard user={fakeUser} getHref={getHref} {...props}/>
    );
    const mountCard = props => mount(<UserCard user={fakeUser} getHref={getHref} {...props}/>);

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

  describe('UserCardTooltip', () => {
    const anchor = <span data-test="anchor">{'foo'}</span>;

    const mountTooltip = props => mount(
      <UserCardTooltip user={fakeUser} getHref={getHref} {...props}>
        {anchor}
      </UserCardTooltip>
    );

    it('should render anchor', () => {
      const wrapper = mountTooltip();

      wrapper.should.have.descendants('[data-test="anchor"]');
    });
  });

  describe('HubUserCardTooltip', () => {
    const anchor = <span>{'foo'}</span>;

    const mountTooltip = props => mount(
      <HubUserCardTooltip userId="test-id" {...props}>
        {anchor}
      </HubUserCardTooltip>
    );

    it('should load user on hover', () => {
      const wrapper = mountTooltip();
      sandbox.stub(wrapper.instance(), 'loadUser').callsFake(() => {});

      // Force the component and wrapper to update so that the stub is used https://github.com/airbnb/enzyme/issues/586
      wrapper.instance().forceUpdate();
      wrapper.update();

      wrapper.simulate('mouseenter');

      wrapper.instance().loadUser.should.have.been.called;
    });
  });
});
