import HubUsersGroupsSource from './hub-users-groups-source';

describe('HubUsersGroupsSource', function () {
  let fakeAuth;
  const TOP = 20;
  const TOP_ALL = 10000;

  beforeEach(function () {
    fakeAuth = {
      requestToken: this.sinon.stub().returns(Promise.resolve('testToken')),
      getApi: this.sinon.stub().returns(Promise.resolve({}))
    }
  });

  it('Should make request for users', function (done) {
    let source = new HubUsersGroupsSource(fakeAuth);
    source.getUsers()
      .then(() => {
        fakeAuth.getApi.should.have.been.calledWith('users', 'testToken', {
          query: '',
          fields: 'id,name,login,avatar/url',
          orderBy: 'name',
          $top: TOP
        });
        done();
      })
  });

  it('Should construct correct query for users', function (done) {
    let source = new HubUsersGroupsSource(fakeAuth);
    source.getUsers('nam')
      .then(() => {
        fakeAuth.getApi.should.have.been.calledWith(sinon.match.string, sinon.match.string, {
          query: 'nameStartsWith: nam or loginStartsWith: nam',
          fields: sinon.match.string,
          orderBy: sinon.match.string,
          $top: sinon.match.number
        });
        done();
      })
  });

  it('Should make request for groups', function (done) {
    let source = new HubUsersGroupsSource(fakeAuth);
    source.getGroups()
      .then(() => {
        fakeAuth.getApi.should.have.been.calledWith('usergroups', 'testToken', {
          fields: 'id,name,userCount',
          orderBy: 'name',
          $top: TOP_ALL
        });
        done();
      })
  });

  it('Should cache request for groups', function (done) {
    fakeAuth.getApi = this.sinon.stub().returns(Promise.resolve({}));

    let source = new HubUsersGroupsSource(fakeAuth);
    source.getGroups();
    source.getGroups();
    source.getGroups()
      .then(() => {
        fakeAuth.getApi.should.have.been.called.once;
        done();
      });
  });

  it('Should clear cache after interval provided', function (done) {
    fakeAuth.getApi = this.sinon.stub().returns(Promise.resolve({}));
    let clock = this.sinon.useFakeTimers();
    let source = new HubUsersGroupsSource(fakeAuth, {cacheExpireTime: 1000});

    source.getGroups();
    clock.tick(2000);
    source.getGroups()
      .then(() => {
        fakeAuth.getApi.should.have.been.called.twice;
        done();
      });

  });

  it('Should convert users to list model', function (done) {
    fakeAuth.getApi = this.sinon.stub();
    fakeAuth.getApi.onFirstCall().returns(Promise.resolve({users: [{
      id: 1,
      name: 'test user',
      login: 'testUser',
      avatar: {url: 'http://test.com.url'}
    }]}));

    fakeAuth.getApi.onSecondCall().returns(Promise.resolve({}));

    let source = new HubUsersGroupsSource(fakeAuth);

    source.getForList()
      .then((dataForList) => {
        dataForList.should.contain({
          id: 1,
          login: 'testUser',
          avatar: {url: 'http://test.com.url'},
          name: 'test user',
          key: 1,
          label: 'test user',
          description: 'testUser',
          icon: 'http://test.com.url'
        });
        done();
      });
  });

  it('Should convert usergroups to list model', function (done) {
    fakeAuth.getApi = this.sinon.stub();
    fakeAuth.getApi.onFirstCall().returns(Promise.resolve({}));
    fakeAuth.getApi.onSecondCall().returns({usergroups: [{
      id: 1,
      name: 'test group',
      userCount: 123
    }]});

    let source = new HubUsersGroupsSource(fakeAuth);

    source.getForList()
      .then((dataForList) => {
        dataForList.should.contain({
          id: 1,
          key: 1,
          name: 'test group',
          label: 'test group',
          description: '',
          userCount: 123
        });
        done();
      });
  });

  it('Should support userCount plural formatter', function (done) {
    fakeAuth.getApi = this.sinon.stub();
    fakeAuth.getApi.onFirstCall().returns(Promise.resolve({}));
    fakeAuth.getApi.onSecondCall().returns({usergroups: [{
      id: 1,
      name: 'test group',
      userCount: 123
    }]});

    let source = new HubUsersGroupsSource(fakeAuth, {
      getPluralForUserCount: (count) => `${count} text`
    });

    source.getForList()
      .then((dataForList) => {
        dataForList[1].description.should.equal('123 text');
        done();
      });
  });
});
