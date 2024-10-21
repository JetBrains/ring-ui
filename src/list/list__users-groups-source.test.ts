/* eslint-disable @typescript-eslint/no-magic-numbers */
import Auth from '../auth/auth';

import ListUsersGroupsSource from './list__users-groups-source';

describe('List Users Groups Source', () => {
  let fakeAuth: Auth;
  beforeEach(() => {
    const requestToken: Auth['requestToken'] = sandbox.stub().returns(Promise.resolve('testToken'));
    fakeAuth = {requestToken} as Auth;
  });

  it('Should convert users to list model', async () => {
    const source = new ListUsersGroupsSource(fakeAuth);

    sandbox.stub(source, 'getUsers').returns(
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

    sandbox.stub(source, 'getGroups').returns(
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
    dataForList.should.deep.contain({
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

    sandbox.stub(source, 'getUsers').returns(
      Promise.resolve([
        {
          id: 'test-user',
          name: 'test user',
          login: 'test user',
          profile: {avatar: {url: 'http://test.com.url'}},
        },
      ]),
    );

    sandbox.stub(source, 'getGroups').returns(
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
    dataForList.should.deep.contain({
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

    sandbox.stub(source, 'getUsers').returns(
      Promise.resolve([
        {
          id: 'test-user',
          name: 'test user',
          login: 'test user',
          profile: {avatar: {url: 'http://test.com.url'}},
        },
      ]),
    );

    sandbox.stub(source, 'getGroups').returns(
      Promise.resolve([
        {
          id: 'test-group',
          name: 'test group',
          userCount: 123,
        },
      ]),
    );

    const dataForList = await source.getForList();
    dataForList[3].description.should.equal('123 text');
  });

  it('Should display "No users" title if no users found', async () => {
    const source = new ListUsersGroupsSource(fakeAuth, {});

    sandbox.stub(source, 'getUsers').returns(Promise.resolve([]));

    sandbox.stub(source, 'getGroups').returns(Promise.resolve([{id: 'test-group', name: 'test group', userCount: 0}]));

    const dataForList = await source.getForList();
    dataForList[0].description.should.equal('No users');
  });

  it('Should display "No groups" title if no groups found', async () => {
    const source = new ListUsersGroupsSource(fakeAuth, {});

    sandbox.stub(source, 'getUsers').returns(
      Promise.resolve([
        {
          id: 'test-group',
          name: 'test user',
          login: 'test user',
          profile: {avatar: {url: 'http://test.com.url'}},
        },
      ]),
    );

    sandbox.stub(source, 'getGroups').returns(Promise.resolve([]));

    const dataForList = await source.getForList();
    dataForList[2].description.should.equal('No groups');
  });
});
