import HubSourceUsersGroups from './hub-source__users-groups';
import {TOP_ALL} from './hub-source';

describe('HubUsersGroupsSource', function () {

  beforeEach(function () {
    this.fakeAuth = {
      requestToken: this.sinon.stub().returns(Promise.resolve('testToken')),
      getApi: this.sinon.stub().returns(Promise.resolve({}))
    }
  });

  it('Should make request for users', function () {
    let source = new HubSourceUsersGroups(this.fakeAuth);
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
    let source = new HubSourceUsersGroups(this.fakeAuth);
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
    let source = new HubSourceUsersGroups(this.fakeAuth);

    let formatted = source.usersSource.options.queryFormatter('two words');
    formatted.should.equal('nameStartsWith: {two words} or loginStartsWith: {two words}');
  });

  it('Should make request for groups', function () {
    let source = new HubSourceUsersGroups(this.fakeAuth);
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

    let source = new HubSourceUsersGroups(this.fakeAuth);
    source.getGroups();
    source.getGroups();
    return source.getGroups()
      .then(() => {
        this.fakeAuth.getApi.should.have.been.called.once;
      });
  });
});
