import ListUsersGroupsSource from './list__users-groups-source';

describe('ListUsersGroupsSource', function () {

  beforeEach(function () {
    this.fakeAuth = {
      requestToken: this.sinon.stub().returns(Promise.resolve('testToken')),
      getApi: this.sinon.stub().returns(Promise.resolve({}))
    }
  });

  it('Should convert users to list model', function () {
    let source = new ListUsersGroupsSource(this.fakeAuth);

    this.sinon.stub(source, 'getUsers').returns(Promise.resolve([{
      id: 1,
      name: 'test user',
      login: 'testUser',
      profile: {avatar: {url: 'http://test.com.url'}}
    }]));

    this.sinon.stub(source, 'getGroups').returns(Promise.resolve([{
      id: 1,
      name: 'test group',
      userCount: 123
    }]));

    return source.getForList()
      .then((dataForList) => {
        dataForList.should.contain({
          id: 1,
          login: 'testUser',
          profile: {avatar: {url: 'http://test.com.url'}},
          name: 'test user',
          key: 1,
          label: 'test user',
          description: 'testUser',
          icon: 'http://test.com.url'
        });
      });
  });

  it('Should convert usergroups to list model', function () {
    let source = new ListUsersGroupsSource(this.fakeAuth);

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

    return source.getForList()
      .then((dataForList) => {
        dataForList.should.contain({
          id: 1,
          key: 1,
          name: 'test group',
          label: 'test group',
          description: '',
          userCount: 123
        });
      });
  });

  it('Should support userCount plural formatter', function () {
    let source = new ListUsersGroupsSource(this.fakeAuth, {
      getPluralForUserCount: (count) => `${count} text`
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

    return source.getForList()
      .then((dataForList) => {
        dataForList[1].description.should.equal('123 text');
      });
  });
});
