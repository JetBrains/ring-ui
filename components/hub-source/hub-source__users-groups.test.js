/* eslint-disable func-names */

import HubSourceUsersGroups from './hub-source__users-groups';

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
    const source = new HubSourceUsersGroups(this.fakeAuth, {searchSideThreshold: 123});
    source.usersSource.options.searchSideThreshold.should.equal(123);
    source.groupsSource.options.searchSideThreshold.should.equal(123);
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
