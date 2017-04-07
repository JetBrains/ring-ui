/* eslint-disable func-names */

import ListUsersGroupsSource from './list__users-groups-source';

describe('List Users Groups Source', () => {
  beforeEach(function () {
    this.fakeAuth = {
      requestToken: this.sinon.stub().returns(Promise.resolve('testToken')),
      getApi: this.sinon.stub().returns(Promise.resolve({}))
    };
  });

  it('Should convert users to list model', async function () {
    const source = new ListUsersGroupsSource(this.fakeAuth);

    this.sinon.stub(source, 'getUsers').returns(Promise.resolve([{
      id: 1,
      name: 'test user',
      login: 'testUser',
      type: 'user',
      profile: {avatar: {url: 'http://test.com.url'}}
    }]));

    this.sinon.stub(source, 'getGroups').returns(Promise.resolve([{
      id: 1,
      name: 'test group',
      type: 'userGroup',
      userCount: 123
    }]));

    const dataForList = await source.getForList();

    dataForList.should.contain({
      id: 1,
      login: 'testUser',
      profile: {avatar: {url: 'http://test.com.url'}},
      name: 'test user',
      key: 1,
      type: 'user',
      label: 'test user',
      description: 'testUser',
      avatar: 'http://test.com.url'
    });

  });

  it('Should convert usergroups to list model', async function () {
    const source = new ListUsersGroupsSource(this.fakeAuth);

    this.sinon.stub(source, 'getUsers').returns(Promise.resolve([{
      id: 1,
      name: 'test user',
      profile: {avatar: {url: 'http://test.com.url'}}
    }]));

    this.sinon.stub(source, 'getGroups').returns(Promise.resolve([{
      id: 1,
      name: 'test group',
      type: 'userGroup',
      userCount: 123
    }]));

    const dataForList = await source.getForList();
    dataForList.should.contain({
      id: 1,
      key: 1,
      name: 'test group',
      label: 'test group',
      type: 'userGroup',
      description: '',
      userCount: 123
    });
  });

  it('Should support userCount plural formatter', async function () {
    const source = new ListUsersGroupsSource(this.fakeAuth, {
      getPluralForUserCount: count => `${count} text`
    });

    this.sinon.stub(source, 'getUsers').returns(Promise.resolve([{
      id: 1,
      name: 'test user',
      profile: {avatar: {url: 'http://test.com.url'}}
    }]));

    this.sinon.stub(source, 'getGroups').returns(Promise.resolve([{
      id: 1,
      name: 'test group',
      userCount: 123
    }]));

    const dataForList = await source.getForList();
    dataForList[1].description.should.equal('123 text');
  });

  it('Should display "No users" title if no users found', async function () {
    const source = new ListUsersGroupsSource(this.fakeAuth, {});

    this.sinon.stub(source, 'getUsers').returns(Promise.resolve([]));

    this.sinon.stub(source, 'getGroups').
      returns(Promise.resolve([{id: 1, name: 'test group'}]));

    const dataForList = await source.getForList();
    dataForList[2].description.should.equal('No users');
  });

  it('Should display "No groups" title if no groups found', async function () {
    const source = new ListUsersGroupsSource(this.fakeAuth, {});

    this.sinon.stub(source, 'getUsers').returns(Promise.resolve([{
      id: 1,
      name: 'test user',
      profile: {avatar: {url: 'http://test.com.url'}}
    }]));

    this.sinon.stub(source, 'getGroups').returns(Promise.resolve([]));

    const dataForList = await source.getForList();
    dataForList[0].description.should.equal('No groups');
  });
});
