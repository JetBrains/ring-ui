/* eslint-disable func-names */

import HubSourceUsersGroups from './hub-source__users-groups';

const SEARCH_THRESHOLD = 123;

describe('Hub Users Groups Source', () => {
  let httpMock;

  beforeEach(function () {
    httpMock = {
      get: this.sinon.stub().returns(Promise.resolve({}))
    };
    this.fakeAuth = {
      requestToken: this.sinon.stub().returns(Promise.resolve('testToken')),
      http: httpMock
    };
  });

  it('Should pass searchSideThreshold to HubSource', function () {
    const source = new HubSourceUsersGroups(this.fakeAuth, {searchSideThreshold: SEARCH_THRESHOLD});
    source.usersSource.options.searchSideThreshold.should.equal(SEARCH_THRESHOLD);
    source.groupsSource.options.searchSideThreshold.should.equal(SEARCH_THRESHOLD);
  });

  it('Should make request for users', async function () {
    const source = new HubSourceUsersGroups(this.fakeAuth);
    this.sinon.stub(source.usersSource, 'get').returns(Promise.resolve([]));

    await source.getUsers();
    source.usersSource.get.should.have.been.calledWith('', {
      fields: 'id,name,login,total,profile/avatar/url',
      orderBy: 'name'
    });
  });

  it('Should pass query for users', async function () {
    const source = new HubSourceUsersGroups(this.fakeAuth);
    this.sinon.stub(source.usersSource, 'get').returns(Promise.resolve([]));

    await source.getUsers('nam');
    source.usersSource.get.should.have.been.calledWith('nam', {
      fields: sinon.match.string,
      orderBy: sinon.match.string
    });
  });

  it('Should construct multi-word query for users', function () {
    const source = new HubSourceUsersGroups(this.fakeAuth);

    const formatted = source.usersSource.options.queryFormatter('two words');
    formatted.should.equal('nameStartsWith: {two words} or loginStartsWith: {two words}');
  });

  it('Should filter user by login on clientside', async function () {
    const source = new HubSourceUsersGroups(this.fakeAuth);
    const user1 = {name: 'some-name1', login: 'login1'};
    this.sinon.stub(source.usersSource, 'makeRequest').returns(Promise.resolve({
      total: 2,
      users: [
        user1,
        {name: 'some-name2', login: 'login2'}
      ]
    }));

    const res = await source.getUsers('login1');
    res.length.should.equal(1);
    res[0].should.equal(user1);
  });

  it('Should make request for groups', async function () {
    const source = new HubSourceUsersGroups(this.fakeAuth);
    this.sinon.stub(source.groupsSource, 'get').returns(Promise.resolve([]));

    await source.getGroups();
    source.groupsSource.get.should.have.been.calledWith('', {
      fields: 'id,name,total,userCount',
      orderBy: 'name'
    });
  });

  it('Should cache request for groups', async function () {
    httpMock.get = this.sinon.stub().
      returns(Promise.resolve({total: 1, usergroups: []}));

    const source = new HubSourceUsersGroups(this.fakeAuth);
    source.getGroups();
    source.getGroups();
    await source.getGroups();
    httpMock.get.should.have.been.called.once;
  });
});
