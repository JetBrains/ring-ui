import UsersGroupsSource from './users-groups-source';

describe('UsersGroupsSource', function () {
  let fakeAuth;
  let TOP = 42;

  beforeEach(function () {
    fakeAuth = {
      requestToken: this.sinon.stub().returns(Promise.resolve('testToken')),
      getApi: this.sinon.stub().returns(Promise.resolve({}))
    }
  });

  it('Should make request for users', function (done) {
    let source = new UsersGroupsSource(fakeAuth);
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
    let source = new UsersGroupsSource(fakeAuth);
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
    let source = new UsersGroupsSource(fakeAuth);
    source.getGroups()
      .then(() => {
        fakeAuth.getApi.should.have.been.calledWith('usergroups', 'testToken', {
          query: '',
          fields: 'id,name,userCount',
          orderBy: 'name',
          $top: TOP
        });
        done();
      })
  });

  it('Should construct query for groups', function (done) {
    let source = new UsersGroupsSource(fakeAuth);
    source.getGroups('nam')
      .then(() => {
        fakeAuth.getApi.should.have.been.calledWith(sinon.match.string, sinon.match.string, {
          query: 'nam* or nam',
          fields: sinon.match.string,
          orderBy: sinon.match.string,
          $top: sinon.match.number
        });
        done();
      })
  });
});
