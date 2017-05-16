import HTTP, {defaultFetchConfig} from './http';

describe('HTTP', () => {
  const FAKE_TOKEN = 'fake-token';
  let fakeAuth;
  let sandbox;
  let http;
  let fetchResult;

  function mockFetch(httpInstance) {
    sandbox.stub(httpInstance, '_fetch').resolves({
      status: 200,
      json: async () => fetchResult
    });
  }

  beforeEach(function () {
    sandbox = this.sinon;
    fakeAuth = {
      constructor: {
        shouldRefreshToken: sandbox.stub().returns(false)
      },
      requestToken: sandbox.stub().returns(FAKE_TOKEN),
      forceTokenUpdate: sandbox.stub()
    };

    fetchResult = {
      isResponseOk: true
    };

    http = new HTTP(fakeAuth);

    mockFetch(http);
  });

  it('should export http service', () => http.should.be.defined);

  it('should read token and perform authorized fetch', async () => {
    await http.request('testurl', {foo: 'bar'});

    fakeAuth.requestToken.should.have.been.called;

    http._fetch.should.have.been.calledWith('testurl', {
      foo: 'bar',
      headers: {
        ...defaultFetchConfig.headers,
        Authorization: `Bearer ${FAKE_TOKEN}`
      },
      body: undefined
    });
  });

  it('should perform unauthorized fetch', async () => {
    await http.fetch('testurl', {foo: 'bar'});

    fakeAuth.requestToken.should.not.have.been.called;

    http._fetch.should.have.been.calledWith('testurl', {
      foo: 'bar',
      body: undefined
    });
  });

  it('should perform request and return result', async () => {
    const res = await http.request('testurl');
    res.should.equal(fetchResult);
  });


  it('should encode query params in url', async () => {
    await http.request('http://testurl', {query: {
      foo: 'bar',
      test: ['a', 'b']
    }});

    http._fetch.should.have.been.
      calledWith('http://testurl?foo=bar&test=a%2Cb', sinon.match(Object));
  });

  it('should support base url setting', async () => {
    http.setBaseUrl('http://test');
    await http.request('/foo');
    http._fetch.should.have.been.calledWith('http://test/foo', sinon.match(Object));
  });

  it('should perform request convert "body" as object inro string', async () => {
    await http.request('testurl', {
      method: 'POST',
      body: {foo: 'bar'}
    });

    http._fetch.should.have.been.calledWithMatch('testurl', {
      method: 'POST',
      body: '{"foo":"bar"}'
    });
  });

  it('should not refresh token if server reponds OK', async () => {
    await http.request('testurl');
    fakeAuth.forceTokenUpdate.should.not.have.been.called;
  });

  it('should throw if response status is not OK', async () => {
    http._fetch.resolves({
      status: 405,
      json: async () => fetchResult
    });

    const onError = sinon.spy();
    await http.request('testurl').catch(onError);

    onError.should.have.been.called;
  });

  it('should refresh token and request again if invalide token error returned', async () => {
    fakeAuth.constructor.shouldRefreshToken.returns(true);

    http._fetch.
      onFirstCall().resolves({status: 405, json: async () => ({error: 'invalid_token'})}).
      onSecondCall().resolves({status: 200, json: async () => fetchResult});

    const res = await http.request('testurl');

    fakeAuth.forceTokenUpdate.should.have.been.called;

    res.should.equal(fetchResult);
  });

  it('"get" method should call request with GET type', async () => {
    sandbox.stub(http, 'request');
    await http.get('testurl');

    http.request.should.have.been.calledWith('testurl', {method: 'GET'});
  });

  it('"post" method should call request with POST type', async () => {
    sandbox.stub(http, 'request');
    await http.post('testurl', {body: {foo: 'bar'}});

    http.request.should.have.been.calledWith('testurl', {method: 'POST', body: {foo: 'bar'}});
  });
});
