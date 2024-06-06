import React from 'react';

import hubConfig from '../../.storybook/hub-config';

import Auth from '../auth/auth';
import {createHubUserCardSource} from '../hub-source/hub-source__user';

import {avatarDataUri} from '../avatar/avatar-example-datauri';

import Badge from '../badge/badge';

import {UserCard, UserCardTooltip, SmartUserCardTooltip} from './user-card';

export default {
  title: 'Components/User Card',

  parameters: {
    notes: 'A component that displays user details.'
  }
};

export const inline = () => {
  const user = {
    login: 'testuser',
    name: 'Test User',
    email: 'testuser@mail.com',
    avatarUrl: avatarDataUri,
    href: `${hubConfig.serverUri}/users/0`
  };

  return (
    <div>
      <div>Inline user card:</div>
      <UserCard user={user} data-test="user-card-inline"/>

      <UserCardTooltip user={user} info={<Badge gray>{'Reporter'}</Badge>}>
        <span>Hover this text see card in tooltip mode</span>
      </UserCardTooltip>
    </div>
  );
};

inline.storyName = 'inline';

export const smartTooltip = () => {
  const user = {
    login: 'testuser',
    name: 'Test User',
    email: 'testuser@mail.com',
    avatarUrl: avatarDataUri,
    href: `${hubConfig.serverUri}/users/0`,
    banned: true,
    online: false,
    banReason: 'Bad guy: is accused of stealing potatoes!'
  };

  function loadUser() {
    return new Promise(resolve => setTimeout(resolve, 10000)).then(() => user);
  }

  return (
    <SmartUserCardTooltip userDataSource={loadUser}>
      <span>Hover this text load user information</span>
    </SmartUserCardTooltip>
  );
};

smartTooltip.storyName = 'smart tooltip';
smartTooltip.parameters = {screenshots: {skip: true}};

export const hubUserCard = () => {
  const auth = new Auth(hubConfig);

  const waitForAuthAndGetUser = async () => {
    await auth.init();
    if (auth.user == null) {
      return null;
    }
    const userSource = createHubUserCardSource(auth, auth.user.id);
    return userSource();
  };

  return (
    <SmartUserCardTooltip userDataSource={waitForAuthAndGetUser}>
      <span>Hover this text load user information</span>
    </SmartUserCardTooltip>
  );
};

hubUserCard.storyName = 'hub user card';
hubUserCard.parameters = {screenshots: {skip: true}};
hubUserCard.tags = ['skip-test'];
