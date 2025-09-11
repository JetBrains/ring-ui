
import ListUsersGroupsSource from './list-users-groups-source';

import type Auth from '../auth/auth';

describe('List Users Groups Source', () => {
  let fakeAuth: Auth;
  beforeEach(() => {
    const requestToken: Auth['requestToken'] = vi.fn().mockReturnValue(Promise.resolve('testToken'));
    fakeAuth = {requestToken} as Auth;
  });

  it('Should convert users to list model', async () => {
    const source = new ListUsersGroupsSource(fakeAuth);

    vi.spyOn(source, 'getUsers').mockReturnValue(
      Promise.resolve([
        {
          id: 'test-user',
          name: 'test user',
          login: 'testUser',
          type: 'user',
          profile: {avatar: {url: 'http://test.com.url'}},
        },
      ]),
    );

    vi.spyOn(source, 'getGroups').mockReturnValue(
      Promise.resolve([
        {
          id: 'test-group',
          name: 'test group',
          type: 'userGroup',
          userCount: 123,
          iconUrl: 'http://foo.bar',
        },
      ]),
    );

    const dataForList = await source.getForList();
    expect(dataForList).to.deep.contain({
      id: 'test-user',
      key: 'test-user',
      login: 'testUser',
      profile: {avatar: {url: 'http://test.com.url'}},
      name: 'test user',
      type: 'user',
      label: 'test user',
      description: 'testUser',
      avatar: 'http://test.com.url',
    });
  });

  it('Should convert usergroups to list model', async () => {
    const source = new ListUsersGroupsSource(fakeAuth);

    vi.spyOn(source, 'getUsers').mockReturnValue(
      Promise.resolve([
        {
          id: 'test-user',
          name: 'test user',
          login: 'test user',
          profile: {avatar: {url: 'http://test.com.url'}},
        },
      ]),
    );

    vi.spyOn(source, 'getGroups').mockReturnValue(
      Promise.resolve([
        {
          id: 'test-group',
          name: 'test group',
          type: 'userGroup',
          userCount: 123,
          iconUrl: 'http://foo.bar',
        },
      ]),
    );

    const dataForList = await source.getForList();
    expect(dataForList).to.deep.contain({
      id: 'test-group',
      key: 'test-group',
      name: 'test group',
      label: 'test group',
      type: 'userGroup',
      description: '123 members',
      userCount: 123,
      avatar: 'http://foo.bar',
      glyph: null,
      iconUrl: 'http://foo.bar',
    });
  });

  it('Should support userCount plural formatter', async () => {
    const source = new ListUsersGroupsSource(fakeAuth, {
      getPluralForUserCount: count => `${count} text`,
    });

    vi.spyOn(source, 'getUsers').mockReturnValue(
      Promise.resolve([
        {
          id: 'test-user',
          name: 'test user',
          login: 'test user',
          profile: {avatar: {url: 'http://test.com.url'}},
        },
      ]),
    );

    vi.spyOn(source, 'getGroups').mockReturnValue(
      Promise.resolve([
        {
          id: 'test-group',
          name: 'test group',
          userCount: 123,
        },
      ]),
    );

    const dataForList = await source.getForList();
    expect(dataForList[3].description).to.equal('123 text');
  });

  it('Should display "No users" title if no users found', async () => {
    const source = new ListUsersGroupsSource(fakeAuth, {});

    vi.spyOn(source, 'getUsers').mockReturnValue(Promise.resolve([]));

    vi.spyOn(source, 'getGroups').mockReturnValue(
      Promise.resolve([{id: 'test-group', name: 'test group', userCount: 0}]),
    );

    const dataForList = await source.getForList();
    expect(dataForList[0].description).to.equal('No users');
  });

  it('Should display "No groups" title if no groups found', async () => {
    const source = new ListUsersGroupsSource(fakeAuth, {});

    vi.spyOn(source, 'getUsers').mockReturnValue(
      Promise.resolve([
        {
          id: 'test-group',
          name: 'test user',
          login: 'test user',
          profile: {avatar: {url: 'http://test.com.url'}},
        },
      ]),
    );

    vi.spyOn(source, 'getGroups').mockReturnValue(Promise.resolve([]));

    const dataForList = await source.getForList();
    expect(dataForList[2].description).to.equal('No groups');
  });
});
