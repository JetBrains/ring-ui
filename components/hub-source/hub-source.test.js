import HubSource from './hub-source';

describe('HubSource', function () {

  beforeEach(function () {
    this.fakeAuth = {
      requestToken: this.sinon.stub().returns(Promise.resolve('testToken')),
      getApi: this.sinon.stub().returns(Promise.resolve({}))
    }
  });

  it('Should initalize', function () {
    let source = new HubSource(this.fakeAuth);
    source.should.be.defined;
  });

  it('Should merge objects', function () {
    HubSource.mergeParams({foo: 'bar'}, {test: 'foo'}).should.be.deep.equal({foo: 'bar', test: 'foo'});
  });

  it('Should make request', function () {
    let source = new HubSource(this.fakeAuth, 'test');
    return source.makeRequest({test: 'foo'})
      .then(() => {
        this.fakeAuth.getApi.should.have.been.calledWith('test', 'testToken', {test: 'foo'});
      });
  });

  it('Should not make cached request if data is already requested', function () {
    let source = new HubSource(this.fakeAuth, 'test');
    source.storedData = {};

    return source.makeCachedRequest({test: 'foo'})
      .then(() => {
        this.fakeAuth.getApi.should.not.have.been.called;
      });
  });

  it('Should detect clientside threshold', function () {
    let source = new HubSource(this.fakeAuth, 'test', {searchSideThreshold: 142});
    source.checkIsClientSideSearch({total: 143}).should.be.false;
  });

  it('Should detect serverside threshold', function () {
    let source = new HubSource(this.fakeAuth, 'test', {searchSideThreshold: 142});
    source.checkIsClientSideSearch({total: 142}).should.be.true;
  });

  it('Should provide filter by name function by default', function () {
    let source = new HubSource(this.fakeAuth, 'test');
    let defaultFilterFn = source.getDefaultFilterFn('testQuery');

    defaultFilterFn({name: 'testQuery name'}).should.be.true;
  });

  it('Should filter on clientside while processing results if clientside is used', function () {
    let source = new HubSource(this.fakeAuth, 'testItems');
    source.isClientSideSearch = true;
    source.filterFn = source.getDefaultFilterFn('testQuery');

    let res = source.processResults({testItems: [{name: 'not test query'}, {name: 'contain testQuery'}]});

    res.should.deep.equal([{name: 'contain testQuery'}]);
  });

  it('Should not filter on clientside if serverside is used', function () {
    let source = new HubSource(this.fakeAuth, 'testItems');
    source.isClientSideSearch = false;
    source.filterFn = source.getDefaultFilterFn('testQuery');

    let res = source.processResults({testItems: [{name: 'not test query'}, {name: 'contain testQuery'}]});

    res.should.deep.equal([{name: 'not test query'}, {name: 'contain testQuery'}]);
  });

  it('Should return empty array if result field is not presented (no results)', function () {
    let source = new HubSource(this.fakeAuth, 'testItems');
    source.isClientSideSearch = false;
    source.filterFn = source.getDefaultFilterFn('testQuery');

    let res = source.processResults({});

    res.should.deep.equal([]);
  });

  it('Should detect clientside filtering if total is smaller than threshold', function () {
    this.fakeAuth.getApi = this.sinon.stub().returns(Promise.resolve({total: 10, testItems: []}));

    let source = new HubSource(this.fakeAuth, 'testItems', {searchSideThreshold: 15});

    return source.sideDetectionRequest({})
      .then(() => {
        source.isClientSideSearch.should.be.true;
      });
  });

  it('Should detect serverside filtering if total is smaller than threshold', function () {
    this.fakeAuth.getApi = this.sinon.stub().returns(Promise.resolve({total: 20, testItems: []}));

    let source = new HubSource(this.fakeAuth, 'testItems', {searchSideThreshold: 15});

    return source.sideDetectionRequest({})
      .then(() => {
        source.isClientSideSearch.should.be.false;
      });
  });

  it('Should do cached request and filter on clientside', function () {
    let source = new HubSource(this.fakeAuth, 'testItems');
    source.makeCachedRequest = this.sinon.stub().returns(Promise.resolve({
      total: 20,
      testItems: []
    }));


    return source.doClientSideSearch()
      .then(() => {
        source.makeCachedRequest.should.have.been.calledWith({$top: -1})
      });
  });

  it('Should do not cached request to serverside', function () {
    let source = new HubSource(this.fakeAuth, 'testItems', {searchMax: 142});
    source.makeRequest = this.sinon.stub().returns(Promise.resolve({
      total: 20,
      testItems: []
    }));


    return source.doServerSideSearch({}, 'test-query')
      .then(() => {
        source.makeRequest.should.have.been.calledWith({
          $top: 142,
          query: sinon.match.string
        });
      });
  });

  it('Should produce empty query if no filter string provided', function () {
    let source = new HubSource(this.fakeAuth, 'testItems');
    source.formatQuery('').should.equal('');
  });

  it('Should construct default query', function () {
    let source = new HubSource(this.fakeAuth, 'testItems');
    source.formatQuery('foo').should.equal('foo or foo*');
  });

  it('Should construct multiword query', function () {
    let source = new HubSource(this.fakeAuth, 'testItems');
    source.formatQuery('foo bar').should.equal('{foo bar} or {foo bar}*');
  });

  it('Should support custom queryFormatter', function () {
    let source = new HubSource(this.fakeAuth, 'testItems', {
      queryFormatter: (query) => `${query} custom format`
    });
    source.formatQuery('foo').should.equal('foo custom format');
  });

  describe('Public interface', function () {
    it('Should store filterFn', function () {
      let filterFn = this.sinon.spy();
      let source = new HubSource(this.fakeAuth, 'testItems');

      source.get('testQuery', {}, filterFn);

      source.filterFn.should.be.equal(filterFn);
    });

    it('Should do side detection request first', function () {
      let source = new HubSource(this.fakeAuth, 'testItems');
      source.sideDetectionRequest = this.sinon.stub().returns(Promise.resolve({total: 20, testItems: []}));

      source.get('testQuery', {testParams: 'test'});

      source.sideDetectionRequest.should.have.been.calledWith({testParams: 'test'}, 'testQuery')
    });

    it('Should do clientside filtering if previously detected', function () {
      let source = new HubSource(this.fakeAuth, 'testItems');
      source.doClientSideSearch = this.sinon.stub().returns(Promise.resolve({total: 20, testItems: []}));
      source.isClientSideSearch = true;

      source.get('testQuery', {testParams: 'test'});

      source.doClientSideSearch.should.have.been.calledWith({testParams: 'test'});
    });

    it('Should do serverside filtering if previously detected', function () {
      let source = new HubSource(this.fakeAuth, 'testItems');
      source.doServerSideSearch = this.sinon.stub().returns(Promise.resolve({total: 20, testItems: []}));
      source.isClientSideSearch = false;

      source.get('testQuery', {testParams: 'test'});

      source.doServerSideSearch.should.have.been.calledWith({testParams: 'test'}, 'testQuery');
    });
  });
});
