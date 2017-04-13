import HTTP, {DEFAULT_HEADERS} from './http';

describe('HTTP', () => {
  const FAKE_TOKEN = 'fake-token';
  let fakeAuth;
  let sandbox;
  let http;
  let fetchResult;

  function mockFetch(httpInstance) {
    const getFetchResponse = async () => ({
      status: 200,
      json: async () => fetchResult
    });
    sandbox.stub(httpInstance, '_fetch').callsFake(getFetchResponse);
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
      data: {
        isResponseOk: true
      }
    };

    http = new HTTP(fakeAuth);

    mockFetch(http);
  });

  it('should export http service', () => http.should.be.defined);

  it('should read token and perform authorized fetch', async () => {
    await http._getTokenAndFetch('testurl', {foo: 'bar'});

    fakeAuth.requestToken.should.have.been.called;

    http._fetch.should.have.been.calledWithMatch('testurl', {
      foo: 'bar',
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${FAKE_TOKEN}`
      }
    });
  });

  it('should perform request and return result', async () => {
    const res = await http.performRequest('testurl');
    res.should.equal(fetchResult);
  });


  it('should encode query params in url', async () => {
    await http.performRequest('http://testurl', {query: {
      foo: 'bar',
      test: ['a', 'b']
    }});
    http._fetch.should.have.been.calledWith('http://testurl?foo=bar&test=a%2Cb', sinon.match(Object));
  });

  it('should support base url setting', async () => {
    http.setBaseUrl('http://test');
    await http.performRequest('/foo');
    http._fetch.should.have.been.calledWith('http://test/foo', sinon.match(Object));
  });

  it('should perform request convert "body" as object inro string', async () => {
    await http.performRequest('testurl', {
      method: 'POST',
      body: {foo: 'bar'}
    });

    http._fetch.should.have.been.calledWithMatch('testurl', {
      method: 'POST',
      body: '{"foo":"bar"}'
    });
  });

  it('should not refresh token if server reponds OK', async () => {
    await http.performRequest('testurl');
    fakeAuth.forceTokenUpdate.should.not.have.been.called;
  });

  it('should throw if response status is not OK', async () => {
    http._fetch.callsFake(async () => ({
      status: 405,
      json: async () => fetchResult
    }));

    const onError = sinon.spy();
    await http.performRequest('testurl').catch(onError);

    onError.should.have.been.called;
  });

  it('should refresh token and request again if invalide token error returned', async () => {
    let isFirstCall = true;

    fakeAuth.constructor.shouldRefreshToken.returns(true);

    http._fetch.callsFake(async () => {
      if (isFirstCall) {
        isFirstCall = false;
        return {status: 405, json: async () => ({data: {error: 'invalid_token'}})};
      }
      return {status: 200, json: async () => fetchResult};
    });

    const res = await http.performRequest('testurl');

    fakeAuth.forceTokenUpdate.should.have.been.called;

    res.should.equal(fetchResult);
  });

  it('"get" method should call performRequest with GET type', async () => {
    sandbox.stub(http, 'performRequest');
    await http.get('testurl');

    http.performRequest.should.have.been.calledWith('testurl', {method: 'GET'});
  });

  it('"post" method should call performRequest with POST type', async () => {
    sandbox.stub(http, 'performRequest');
    await http.post('testurl', {body: {foo: 'bar'}});

    http.performRequest.should.have.been.calledWith('testurl', {method: 'POST', body: {foo: 'bar'}});
  });
});
