import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {beforeEach} from 'vitest';

import {I18nContextHolder} from '../i18n/i18n-context';

import {SmartUserCardTooltip, UserCard, UserCardTooltip} from './user-card';
import {UserCardAttrs, UserCardUser} from './card';
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
    const renderCard = (props?: Partial<UserCardAttrs>) =>
      render(
        <I18nContextHolder messages={{}}>
          <UserCard user={fakeUser} {...props} />
        </I18nContextHolder>,
      );

    it('should create component', () => {
      const {container} = renderCard();
      container.querySelector('div')?.should.exist;
    });

    it('should wrap children with span', () => {
      const {container} = renderCard();
      container.querySelector('div')?.should.exist;
    });

    it('should render link', () => {
      renderCard({user: {...fakeUser, href: 'http://example.com'}});
      screen.getByTestId('ring-link user-card-link').should.exist;
    });

    it('should not render link if user has no href', () => {
      const {container} = renderCard({user: {...fakeUser, href: null}});
      container.should.not.have.descendants('a[data-test~=user-card-link]');
    });

    it('should use passed className', () => {
      const {container} = renderCard({className: 'test-class'});
      container.querySelector('.test-class')?.should.exist;
    });

    it('should use pass rest props to dom node', () => {
      const {container} = renderCard({'data-test': 'foo'});
      container.querySelector('[data-test="foo"]')?.should.exist;
    });

    it('should render user avatar if available', () => {
      const {container} = renderCard();
      container.querySelector('img')?.should.exist;
    });
  });

  describe('UserCardTooltip', () => {
    const anchor = <span data-test="anchor">{'foo'}</span>;

    const renderTooltip = (props?: UserCardTooltipAttrs) =>
      render(
        <UserCardTooltip user={fakeUser} {...props}>
          {anchor}
        </UserCardTooltip>,
      );

    it('should render anchor', () => {
      renderTooltip();
      screen.getByTestId('anchor').should.exist;
    });

    it('should allow to render multiple children', () => {
      render(
        <UserCardTooltip user={fakeUser}>
          <span data-test="anchor">{'foo'}</span>
          <span data-test="anchor">{'foo'}</span>
        </UserCardTooltip>,
      );
      screen.getAllByTestId('anchor').should.have.length(2);
    });
  });

  describe('SmartUserCardTooltip', () => {
    const anchor = <span>{'foo'}</span>;
    let userSource: () => Promise<UserCardUser>;

    beforeEach(() => {
      userSource = sandbox.spy(() => Promise.resolve(fakeUser));
    });

    const renderTooltip = (props?: SmartUserCardTooltipProps) =>
      render(
        <SmartUserCardTooltip userDataSource={userSource} {...props}>
          {anchor}
        </SmartUserCardTooltip>,
      );

    it('should load user on hover', async () => {
      const {container} = renderTooltip();
      const tooltip = container.querySelector('div')!;

      userEvent.hover(tooltip);
      await screen.findByText('foo');

      userSource.should.have.been.called;
    });
  });
});
