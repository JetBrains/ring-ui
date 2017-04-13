/* eslint-disable func-names */

import HubSource from './hub-source';

describe('Hub Source', () => {
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

  it('Should initialize', function () {
    const source = new HubSource(this.fakeAuth);
    source.should.be.defined;
  });

  it('Should merge objects', () => {
    HubSource.mergeParams({foo: 'bar'}, {test: 'foo'}).
      should.be.deep.equal({foo: 'bar', test: 'foo'});
  });

  it('Should make request', async function () {
    const source = new HubSource(this.fakeAuth, 'test');
    await source.makeRequest({test: 'foo'});
    httpMock.get.should.have.been.calledWith('test', {query: {test: 'foo'}});
  });

  it('Should not make cached request if data is already requested', async function () {
    const source = new HubSource(this.fakeAuth, 'test');
    source.storedData = {};

    await source.makeCachedRequest({test: 'foo'});
    httpMock.get.should.not.have.been.called;
  });

  it('Should detect client-side threshold', function () {
    const source = new HubSource(this.fakeAuth, 'test', {searchSideThreshold: 142});
    source.checkIsClientSideSearch({total: 143}).should.be.false;
  });

  it('Should detect server-side threshold', function () {
    const source = new HubSource(this.fakeAuth, 'test', {searchSideThreshold: 142});
    source.checkIsClientSideSearch({total: 142}).should.be.true;
  });

  it('Should provide filter by name function by default', function () {
    const source = new HubSource(this.fakeAuth, 'test');
    const defaultFilterFn = source.getDefaultFilterFn('testQuery');

    defaultFilterFn({name: 'testQuery name'}).should.be.true;
  });

  it('Should filter on client-side while processing results if client-side is used', function () {
    const source = new HubSource(this.fakeAuth, 'testItems');
    source.isClientSideSearch = true;
    source.filterFn = source.getDefaultFilterFn('testQuery');

    const res = source.processResults({testItems: [{name: 'not test query'}, {name: 'contain testQuery'}]});

    res.should.deep.equal([{name: 'contain testQuery'}]);
  });

  it('Should not filter on client-side if server-side is used', function () {
    const source = new HubSource(this.fakeAuth, 'testItems');
    source.isClientSideSearch = false;
    source.filterFn = source.getDefaultFilterFn('testQuery');

    const res = source.processResults({testItems: [{name: 'not test query'}, {name: 'contain testQuery'}]});

    res.should.deep.equal([{name: 'not test query'}, {name: 'contain testQuery'}]);
  });

  it('Should return empty array if result field is not presented (no results)', function () {
    const source = new HubSource(this.fakeAuth, 'testItems');
    source.isClientSideSearch = false;
    source.filterFn = source.getDefaultFilterFn('testQuery');

    const res = source.processResults({});

    res.should.deep.equal([]);
  });

  it('Should detect client-side filtering if total is smaller than threshold', async function () {
    httpMock.get = this.sinon.stub().
      returns(Promise.resolve({total: 10, testItems: []}));

    const source = new HubSource(this.fakeAuth, 'testItems', {searchSideThreshold: 15});

    await source.sideDetectionRequest({});
    source.isClientSideSearch.should.be.true;
  });

  it('Should detect server-side filtering if total is smaller than threshold', async function () {
    httpMock.get = this.sinon.stub().
      returns(Promise.resolve({total: 20, testItems: []}));

    const source = new HubSource(this.fakeAuth, 'testItems', {searchSideThreshold: 15});

    await source.sideDetectionRequest({});
    source.isClientSideSearch.should.be.false;
  });

  it('Should do cached request and filter on client-side', async function () {
    const source = new HubSource(this.fakeAuth, 'testItems');
    source.makeCachedRequest = this.sinon.stub().returns(Promise.resolve({
      total: 20,
      testItems: []
    }));


    await source.doClientSideSearch();
    source.makeCachedRequest.should.have.been.calledWith({$top: -1});
  });

  it('Should do not cached request to server-side', async function () {
    const source = new HubSource(this.fakeAuth, 'testItems', {searchMax: 142});
    source.makeRequest = this.sinon.stub().returns(Promise.resolve({
      total: 20,
      testItems: []
    }));


    await source.doServerSideSearch({}, 'test-query');
    source.makeRequest.should.have.been.calledWith({
      $top: 142,
      query: sinon.match.string
    });
  });

  it('Should produce empty query if no filter string provided', function () {
    const source = new HubSource(this.fakeAuth, 'testItems');
    source.formatQuery('').should.equal('');
  });

  it('Should construct default query', function () {
    const source = new HubSource(this.fakeAuth, 'testItems');
    source.formatQuery('foo').should.equal('foo or foo*');
  });

  it('Should construct multi-word query', function () {
    const source = new HubSource(this.fakeAuth, 'testItems');
    source.formatQuery('foo bar').should.equal('foo bar or foo bar*');
  });

  it('Should support custom queryFormatter', function () {
    const source = new HubSource(this.fakeAuth, 'testItems', {
      queryFormatter: query => `${query} custom format`
    });
    source.formatQuery('foo').should.equal('foo custom format');
  });

  describe('Public interface', () => {
    it('Should store filterFn', function () {
      const filterFn = this.sinon.spy();
      const source = new HubSource(this.fakeAuth, 'testItems');

      source.get('testQuery', {}, filterFn);

      source.filterFn.should.be.equal(filterFn);
    });

    it('Should do side detection request first', function () {
      const source = new HubSource(this.fakeAuth, 'testItems');
      source.sideDetectionRequest = this.sinon.stub().
        returns(Promise.resolve({total: 20, testItems: []}));

      source.get('testQuery', {testParams: 'test'});

      source.sideDetectionRequest.should.have.been.calledWith({testParams: 'test'}, 'testQuery');
    });

    it('Should do client-side filtering if previously detected', function () {
      const source = new HubSource(this.fakeAuth, 'testItems');
      source.doClientSideSearch = this.sinon.stub().
        returns(Promise.resolve({total: 20, testItems: []}));
      source.isClientSideSearch = true;

      source.get('testQuery', {testParams: 'test'});

      source.doClientSideSearch.should.have.been.calledWith({testParams: 'test'});
    });

    it('Should do server-side filtering if previously detected', function () {
      const source = new HubSource(this.fakeAuth, 'testItems');
      source.doServerSideSearch = this.sinon.stub().
        returns(Promise.resolve({total: 20, testItems: []}));
      source.isClientSideSearch = false;

      source.get('testQuery', {testParams: 'test'});

      source.doServerSideSearch.should.have.been.calledWith({testParams: 'test'}, 'testQuery');
    });
  });
});
