import HTTP from '../http/http';
import Auth from '../auth/auth';

import HubSourceUsersGroups from './hub-source__users-groups';

const SEARCH_THRESHOLD = 123;

describe('Hub Users Groups Source', () => {
  let httpMock: HTTP;
  let fakeAuth: Auth;

  beforeEach(() => {
    const get: HTTP['get'] = sandbox.stub().returns(Promise.resolve({}));
    httpMock = {get} as HTTP;
    const requestToken: Auth['requestToken'] = sandbox.stub().returns(Promise.resolve('testToken'));
    fakeAuth = {requestToken, http: httpMock} as Auth;
  });

  it('Should pass searchSideThreshold to HubSource', () => {
    const source = new HubSourceUsersGroups(fakeAuth, {searchSideThreshold: SEARCH_THRESHOLD});
    expect(source.usersSource.options.searchSideThreshold).to.equal(SEARCH_THRESHOLD);
    expect(source.groupsSource.options.searchSideThreshold).to.equal(SEARCH_THRESHOLD);
  });

  it('Should make request for users', async () => {
    const source = new HubSourceUsersGroups(fakeAuth);
    sandbox.stub(source.usersSource, 'get').returns(Promise.resolve([]));

    await source.getUsers();
    expect(source.usersSource.get).to.have.been.calledWith('', {
      fields: 'id,name,login,total,profile/avatar/url',
      orderBy: 'name',
    });
  });

  it('Should pass query for users', async () => {
    const source = new HubSourceUsersGroups(fakeAuth);
    sandbox.stub(source.usersSource, 'get').returns(Promise.resolve([]));

    await source.getUsers('nam');
    expect(source.usersSource.get).to.have.been.calledWith('nam', {
      fields: sinon.match.string,
      orderBy: sinon.match.string,
    });
  });

  it('Should construct multi-word query for users', () => {
    const source = new HubSourceUsersGroups(fakeAuth);

    const formatted = source.usersSource.options.queryFormatter('two words');
    expect(formatted).to.equal('nameStartsWith: {two words} or loginStartsWith: {two words}');
  });

  it('Should filter user by login on the client side', async () => {
    const source = new HubSourceUsersGroups(fakeAuth);
    const user1 = {name: 'some-name1', login: 'login1'};
    sandbox.stub(source.usersSource, 'makeRequest').returns(
      Promise.resolve({
        total: 2,
        users: [user1, {name: 'some-name2', login: 'login2'}],
      }),
    );

    const res = await source.getUsers('login1');
    expect(res.length).to.equal(1);
    expect(res[0]).to.equal(user1);
  });

  it('Should make request for groups', async () => {
    const source = new HubSourceUsersGroups(fakeAuth);
    sandbox.stub(source.groupsSource, 'get').returns(Promise.resolve([]));

    await source.getGroups();
    expect(source.groupsSource.get).to.have.been.calledWith('', {
      fields: 'id,name,total,userCount,iconUrl',
      orderBy: 'name',
    });
  });

  it('Should cache request for groups', async () => {
    httpMock.get = sandbox.stub().returns(Promise.resolve({total: 1, usergroups: []}));

    const source = new HubSourceUsersGroups(fakeAuth);
    await source.getGroups();
    source.getGroups();
    source.getGroups();
    expect(httpMock.get).to.have.been.calledOnce;
  });
});
