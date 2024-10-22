import {shallow, mount} from 'enzyme';

import {I18nContextHolder} from '../i18n/i18n-context';

import {SmartUserCardTooltip, UserCard, UserCardTooltip} from './user-card';
import {UserCardAttrs} from './card';
import {UserCardTooltipAttrs} from './tooltip';
import {SmartUserCardTooltipProps} from './smart-user-card-tooltip';

describe('UserCard', () => {
  const fakeUser = {
    login: 'testuser',
    name: 'Test User',
    email: 'testuser@mail.com',
    avatarUrl: 'http://some-url',
    href: 'http://foo',
  };

  describe('Card', () => {
    const shallowCard = (props?: Partial<UserCardAttrs>) =>
      shallow(
        <I18nContextHolder messages={{}}>
          <UserCard user={fakeUser} {...props} />
        </I18nContextHolder>,
      );
    const mountCard = (props?: Partial<UserCardAttrs>) => mount(<UserCard user={fakeUser} {...props} />);

    it('should create component', () => {
      mountCard().should.have.type(UserCard);
    });

    it('should wrap children with span', () => {
      shallowCard().should.have.tagName('div');
    });

    it('should render link', () => {
      shallowCard({user: {...fakeUser, href: null}}).should.not.have.descendants('a[href="http://foo"]');
    });

    it('should not render link if user has no href', () => {
      shallowCard({user: {...fakeUser, href: null}}).should.not.have.descendants('a');
    });

    it('should use passed className', () => {
      shallowCard({className: 'test-class'}).find(UserCard).should.have.className('test-class');
    });

    it('should use pass rest props to dom node', () => {
      shallowCard({'data-test': 'foo'}).should.have.data('test', 'foo');
    });
  });

  describe('UserCardTooltip', () => {
    const anchor = <span data-test="anchor">{'foo'}</span>;

    const mountTooltip = (props?: UserCardTooltipAttrs) =>
      mount(
        <UserCardTooltip user={fakeUser} {...props}>
          {anchor}
        </UserCardTooltip>,
      );

    it('should render anchor', () => {
      const wrapper = mountTooltip();

      wrapper.should.have.descendants('[data-test="anchor"]');
    });

    it('should allow to render multiple children', () => {
      const tooltip = (props?: UserCardTooltipAttrs) =>
        mount(
          <UserCardTooltip user={fakeUser} {...props}>
            <span data-test="anchor">{'foo'}</span>
            <span data-test="anchor">{'foo'}</span>
          </UserCardTooltip>,
        );

      const wrapper = tooltip();
      wrapper.should.have.descendants('[data-test="anchor"]');
    });
  });

  describe('SmartUserCardTooltip', () => {
    const anchor = <span>{'foo'}</span>;

    function userSource() {
      return fakeUser;
    }

    const mountTooltip = (props?: SmartUserCardTooltipProps) =>
      mount<SmartUserCardTooltip>(
        <SmartUserCardTooltip userDataSource={userSource} {...props}>
          {anchor}
        </SmartUserCardTooltip>,
      );

    it('should load user on hover', () => {
      const wrapper = mountTooltip();
      sandbox.stub(wrapper.instance(), 'loadUser').callsFake(async () => {});

      // Force the component and wrapper to update so that the stub is used https://github.com/airbnb/enzyme/issues/586
      wrapper.instance().forceUpdate();
      wrapper.update();

      wrapper.simulate('mouseenter');

      wrapper.instance().loadUser.should.have.been.called;
    });
  });
});
