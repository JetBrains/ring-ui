import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';
import hubConfig from '../../.storybook/hub-config';
import {UserCard, UserCardTooltip, SmartUserCardTooltip} from '../user-card/user-card';
import Auth from '../auth/auth';
import {createHubUserCardSource} from '../hub-source/hub-source__user';

export default {
  title: 'Components|User Card',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'A component that displays user details.'
  }
};

export const inline = () => {
  const user = {
    login: 'testuser',
    name: 'Test User',
    email: 'testuser@mail.com',
    avatarUrl: `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`,
    href: `${hubConfig.serverUri}/users/0`
  };

  return (
    <div>
      <div>Inline user card:</div>
      <UserCard user={user} data-test="user-card-inline"/>

      <UserCardTooltip user={user}>
        <span>Hover this text see card in tooltip mode</span>
      </UserCardTooltip>
    </div>
  );
};

inline.story = {
  name: 'inline'
};

export const smartTooltip = () => {
  const user = {
    login: 'testuser',
    name: 'Test User',
    email: 'testuser@mail.com',
    avatarUrl: `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`,
    href: `${hubConfig.serverUri}/users/0`,
    banned: true,
    online: false,
    banReason: 'Bad guy: is accused of stealing potatoes'
  };

  async function loadUser() {
    return new Promise(resolve => setTimeout(resolve, 10000)).then(() => user);
  }

  return (
    <SmartUserCardTooltip userDataSource={loadUser}>
      <span>Hover this text load user information</span>
    </SmartUserCardTooltip>
  );
};

smartTooltip.story = {
  name: 'smart tooltip',
  parameters: {hermione: {skip: true}}
};

export const hubUserCard = () => {
  const auth = new Auth(hubConfig);

  const waitForAuthAndGetUser = async () => {
    await auth.init();
    const userSource = createHubUserCardSource(auth, auth.user.id);
    return userSource();
  };

  return (
    <SmartUserCardTooltip userDataSource={waitForAuthAndGetUser}>
      <span>Hover this text load user information</span>
    </SmartUserCardTooltip>
  );
};

hubUserCard.story = {
  name: 'hub user card',
  parameters: {hermione: {skip: true}}
};
