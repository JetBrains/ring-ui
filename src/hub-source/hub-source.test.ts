import HTTP from '../http/http';
import Auth from '../auth/auth';

import HubSource from './hub-source';

describe('Hub Source', () => {
  let httpMock: HTTP;
  let fakeAuth: Auth;
  beforeEach(() => {
    const get: HTTP['get'] = sandbox.stub().returns(Promise.resolve({}));
    httpMock = {get} as HTTP;
    const requestToken: Auth['requestToken'] = sandbox.stub().returns(Promise.resolve('testToken'));
    fakeAuth = {requestToken, http: httpMock} as Auth;
  });

  it('Should initialize', () => {
    const source = new HubSource(fakeAuth, '');
    expect(source).to.exist;
  });

  it('Should merge objects', () => {
    expect(HubSource.mergeParams({foo: 'bar'}, {test: 'foo'})).to.be.deep.equal({foo: 'bar', test: 'foo'});
  });

  it('Should make request', async () => {
    const source = new HubSource(fakeAuth, 'test');
    await source.makeRequest({test: 'foo'});
    expect(httpMock.get).to.have.been.calledWith('test', {query: {test: 'foo'}});
  });

  it('Should not make cached request if data is already requested', async () => {
    const source = new HubSource(fakeAuth, 'test');
    source.storedData = {total: 0};

    await source.makeCachedRequest({test: 'foo'});
    expect(httpMock.get).to.not.have.been.called;
  });

  it('Should detect client-side threshold', () => {
    const source = new HubSource(fakeAuth, 'test', {searchSideThreshold: 142});
    expect(source.checkIsClientSideSearch({total: 143})).to.be.false;
  });

  it('Should detect server-side threshold', () => {
    const source = new HubSource(fakeAuth, 'test', {searchSideThreshold: 142});
    expect(source.checkIsClientSideSearch({total: 142})).to.be.true;
  });

  it('Should provide filter by name function by default', () => {
    const source = new HubSource(fakeAuth, 'test');
    const defaultFilterFn = source.getDefaultFilterFn('testQuery');

    expect(defaultFilterFn({name: 'testQuery name'})).to.be.true;
  });

  it('Should filter on client-side while processing results if client-side is used', () => {
    const source = new HubSource(fakeAuth, 'testItems');
    source.isClientSideSearch = true;
    source.filterFn = source.getDefaultFilterFn('testQuery');

    const res = source.processResults({testItems: [{name: 'not test query'}, {name: 'contain testQuery'}], total: 2});

    expect(res).to.deep.equal([{name: 'contain testQuery'}]);
  });

  it('Should not filter on client-side if server-side is used', () => {
    const source = new HubSource(fakeAuth, 'testItems');
    source.isClientSideSearch = false;
    source.filterFn = source.getDefaultFilterFn('testQuery');

    const res = source.processResults({testItems: [{name: 'not test query'}, {name: 'contain testQuery'}], total: 2});

    expect(res).to.deep.equal([{name: 'not test query'}, {name: 'contain testQuery'}]);
  });

  it('Should return empty array if result field is not presented (no results)', () => {
    const source = new HubSource(fakeAuth, 'testItems');
    source.isClientSideSearch = false;
    source.filterFn = source.getDefaultFilterFn('testQuery');

    const res = source.processResults({total: 0});

    expect(res).to.deep.equal([]);
  });

  it('Should detect client-side filtering if total is smaller than threshold', async () => {
    httpMock.get = sandbox.stub().returns(Promise.resolve({total: 10, testItems: []}));

    const source = new HubSource(fakeAuth, 'testItems', {searchSideThreshold: 15});

    await source.sideDetectionRequest({});
    expect(true).to.equal(source.isClientSideSearch);
  });

  it('Should detect server-side filtering if total is smaller than threshold', async () => {
    httpMock.get = sandbox.stub().returns(Promise.resolve({total: 20, testItems: []}));

    const source = new HubSource(fakeAuth, 'testItems', {searchSideThreshold: 15});

    await source.sideDetectionRequest({});
    expect(false).to.equal(source.isClientSideSearch);
  });

  it('Should do cached request and filter on client-side', async () => {
    const source = new HubSource(fakeAuth, 'testItems');
    source.makeCachedRequest = sandbox.stub().returns(
      Promise.resolve({
        total: 20,
        testItems: [],
      }),
    );

    await source.doClientSideSearch();
    expect(source.makeCachedRequest).to.have.been.calledWith({$top: -1});
  });

  it('Should do not cached request to server-side', async () => {
    const source = new HubSource(fakeAuth, 'testItems', {searchMax: 142});
    source.makeRequest = sandbox.stub().returns(
      Promise.resolve({
        total: 20,
        testItems: [],
      }),
    );

    await source.doServerSideSearch({}, 'test-query');
    expect(source.makeRequest).to.have.been.calledWith({
      $top: 142,
      query: sinon.match.string,
    });
  });

  it('Should produce empty query if no filter string provided', () => {
    const source = new HubSource(fakeAuth, 'testItems');
    expect(source.formatQuery('')).to.equal('');
  });

  it('Should construct default query', () => {
    const source = new HubSource(fakeAuth, 'testItems');
    expect(source.formatQuery('foo')).to.equal('foo or foo*');
  });

  it('Should construct multi-word query', () => {
    const source = new HubSource(fakeAuth, 'testItems');
    expect(source.formatQuery('foo bar')).to.equal('foo bar or foo bar*');
  });

  it('Should support custom queryFormatter', () => {
    const source = new HubSource(fakeAuth, 'testItems', {
      queryFormatter: query => `${query} custom format`,
    });
    expect(source.formatQuery('foo')).to.equal('foo custom format');
  });

  describe('Public interface', () => {
    it('Should store filterFn', () => {
      const filterFn = sandbox.spy();
      const source = new HubSource(fakeAuth, 'testItems');

      source.get('testQuery', {}, filterFn);

      expect(source.filterFn).to.be.equal(filterFn);
    });

    it('Should do side detection request first', () => {
      const source = new HubSource(fakeAuth, 'testItems');
      source.sideDetectionRequest = sandbox.stub().returns(Promise.resolve({total: 20, testItems: []}));

      source.get('testQuery', {testParams: 'test'});

      expect(source.sideDetectionRequest).to.have.been.calledWith({testParams: 'test'}, 'testQuery');
    });

    it('Should do client-side filtering if previously detected', () => {
      const source = new HubSource(fakeAuth, 'testItems');
      source.doClientSideSearch = sandbox.stub().returns(Promise.resolve({total: 20, testItems: []}));
      source.isClientSideSearch = true;

      source.get('testQuery', {testParams: 'test'});

      expect(source.doClientSideSearch).to.have.been.calledWith({testParams: 'test'});
    });

    it('Should do server-side filtering if previously detected', () => {
      const source = new HubSource(fakeAuth, 'testItems');
      source.doServerSideSearch = sandbox.stub().returns(Promise.resolve({total: 20, testItems: []}));
      source.isClientSideSearch = false;

      source.get('testQuery', {testParams: 'test'});

      expect(source.doServerSideSearch).to.have.been.calledWith({testParams: 'test'}, 'testQuery');
    });
  });
});
