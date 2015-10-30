import HubSourceUsersGroups from './hub-source__users-groups';

describe('HubUsersGroupsSource', function () {
  beforeEach(function () {
    this.fakeAuth = {
      requestToken: this.sinon.stub().returns(Promise.resolve('testToken')),
      getApi: this.sinon.stub().returns(Promise.resolve({}))
    };
  });

  it('Should pass searchSideThreshold to HubSource', function () {
    const source = new HubSourceUsersGroups(this.fakeAuth, {searchSideThreshold: 123});
    source.usersSource.options.searchSideThreshold.should.equal(123);
    source.groupsSource.options.searchSideThreshold.should.equal(123);
  });

  it('Should make request for users', function () {
    const source = new HubSourceUsersGroups(this.fakeAuth);
    this.sinon.stub(source.usersSource, 'get').returns(Promise.resolve([]));

    return source.getUsers()
      .then(() => {
        source.usersSource.get.should.have.been.calledWith('', {
          fields: 'id,name,login,total,profile/avatar/url',
          orderBy: 'name'
        });
      });
  });

  it('Should pass query for users', function () {
    const source = new HubSourceUsersGroups(this.fakeAuth);
    this.sinon.stub(source.usersSource, 'get').returns(Promise.resolve([]));

    return source.getUsers('nam')
      .then(() => {
        source.usersSource.get.should.have.been.calledWith('nam', {
          fields: sinon.match.string,
          orderBy: sinon.match.string
        });
      });
  });

  it('Should construct multiword query for users', function () {
    const source = new HubSourceUsersGroups(this.fakeAuth);

    const formatted = source.usersSource.options.queryFormatter('two words');
    formatted.should.equal('nameStartsWith: {two words} or loginStartsWith: {two words}');
  });

  it('Should make request for groups', function () {
    const source = new HubSourceUsersGroups(this.fakeAuth);
    this.sinon.stub(source.groupsSource, 'get').returns(Promise.resolve([]));

    return source.getGroups()
      .then(() => {
        source.groupsSource.get.should.have.been.calledWith('', {
          fields: 'id,name,total,userCount',
          orderBy: 'name'
        });
      });
  });

  it('Should cache request for groups', function () {
    this.fakeAuth.getApi = this.sinon.stub().returns(Promise.resolve({total: 1, usergroups: []}));

    const source = new HubSourceUsersGroups(this.fakeAuth);
    source.getGroups();
    source.getGroups();
    return source.getGroups()
      .then(() => {
        this.fakeAuth.getApi.should.have.been.called.once;
      });
  });
});
