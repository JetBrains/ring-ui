import HubUsersGroupsSource from './hub-users-groups-source';
import {TOP_ALL} from 'hub-source/hub-source';

describe('HubUsersGroupsSource', function () {
  const TOP = 20;
  const TOP_THESHOLD = 100;

  beforeEach(function () {
    this.fakeAuth = {
      requestToken: this.sinon.stub().returns(Promise.resolve('testToken')),
      getApi: this.sinon.stub().returns(Promise.resolve({}))
    }
  });

  it('Should make request for users', function () {
    let source = new HubUsersGroupsSource(this.fakeAuth);
    return source.getUsers()
      .then(() => {
        this.fakeAuth.getApi.should.have.been.calledWith('users', 'testToken', {
          query: '',
          fields: 'id,name,login,profile/avatar/url',
          orderBy: 'name',
          $top: TOP_ALL
        });
      });
  });

  it('Should construct correct query for users', function () {
    let source = new HubUsersGroupsSource(this.fakeAuth);
    return source.getUsers('nam')
      .then(() => {
        this.fakeAuth.getApi.should.have.been.calledWith(sinon.match.string, sinon.match.string, {
          query: 'nameStartsWith: nam or loginStartsWith: nam',
          fields: sinon.match.string,
          orderBy: sinon.match.string,
          $top: sinon.match.number
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
    return source.getGroups()
      .then(() => {
        this.fakeAuth.getApi.should.have.been.calledWith('usergroups', 'testToken', {
          fields: 'id,name,userCount',
          orderBy: 'name',
          $top: TOP_ALL
        });
      });
  });

  it('Should cache request for groups', function () {
    this.fakeAuth.getApi = this.sinon.stub().returns(Promise.resolve({}));

    let source = new HubUsersGroupsSource(this.fakeAuth);
    source.getGroups();
    source.getGroups();
    return source.getGroups()
      .then(() => {
        this.fakeAuth.getApi.should.have.been.called.once;
      });
  });

  it('Should clear cache after interval provided', function () {
    this.fakeAuth.getApi = this.sinon.stub().returns(Promise.resolve({}));
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
