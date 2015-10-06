import HubUsersGroupsSource from './hub-users-groups-source';
import {TOP_ALL} from 'hub-source/hub-source';

describe('HubUsersGroupsSource', function () {

  beforeEach(function () {
    this.fakeAuth = {
      requestToken: this.sinon.stub().returns(Promise.resolve('testToken')),
      getApi: this.sinon.stub().returns(Promise.resolve({}))
    }
  });

  it('Should make request for users', function () {
    let source = new HubUsersGroupsSource(this.fakeAuth);
    this.sinon.stub(source.usersSource, 'get').returns(Promise.resolve([]));

    return source.getUsers()
      .then(() => {
        source.usersSource.get.should.have.been.calledWith('', {
          query: '',
          fields: 'id,name,login,total,profile/avatar/url',
          orderBy: 'name'
        });
      });
  });

  it('Should construct correct query for users', function () {
    let source = new HubUsersGroupsSource(this.fakeAuth);
    this.sinon.stub(source.usersSource, 'get').returns(Promise.resolve([]));

    return source.getUsers('nam')
      .then(() => {
        source.usersSource.get.should.have.been.calledWith('nam', {
          query: 'nameStartsWith: nam or loginStartsWith: nam',
          fields: sinon.match.string,
          orderBy: sinon.match.string
        });
      });
  });

  it('Should not wrap name with braces if filter is one word', function () {
    let sameFilter = HubUsersGroupsSource.prepareQuery('oneword');
    sameFilter.should.equal('oneword');
  });

  it('Should wrap name with braces if filter has spaces', function () {
    let wrappedFilter = HubUsersGroupsSource.prepareQuery('two words');
    wrappedFilter.should.equal('{two words}');
  });

  it('Should make request for groups', function () {
    let source = new HubUsersGroupsSource(this.fakeAuth);
    this.sinon.stub(source.groupsSource, 'get').returns(Promise.resolve([]));

    return source.getGroups()
      .then(() => {
        source.groupsSource.get.should.have.been.calledWith('', {
          fields: 'id,name,total,userCount',
          orderBy: 'name',
          query: ''
        });
      });
  });

  it('Should cache request for groups', function () {
    this.fakeAuth.getApi = this.sinon.stub().returns(Promise.resolve({total: 1, usergroups: []}));

    let source = new HubUsersGroupsSource(this.fakeAuth);
    source.getGroups();
    source.getGroups();
    return source.getGroups()
      .then(() => {
        this.fakeAuth.getApi.should.have.been.called.once;
      });
  });

  it('Should clear cache after interval provided', function () {
    this.fakeAuth.getApi = this.sinon.stub().returns(Promise.resolve({total: 1, usergroups: []}));
    let clock = this.sinon.useFakeTimers();
    let source = new HubUsersGroupsSource(this.fakeAuth, {cacheExpireTime: 1000});

    source.getGroups();
    clock.tick(2000);
    return source.getGroups()
      .then(() => {
        this.fakeAuth.getApi.should.have.been.called.twice;
      });

  });
});
