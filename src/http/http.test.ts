import * as Sinon from 'sinon';

import HTTP, {defaultFetchConfig, HTTPAuth, HTTPError} from './http';

const OK = 200;
const METHOD_NOT_ALLOWED = 405;
const SERVER_ERROR = 500;


describe('HTTP', () => {
  const FAKE_TOKEN = 'fake-token';
  class FakeAuth implements HTTPAuth {
    static shouldRefreshToken = sandbox.stub().returns(false);
    requestToken = sandbox.stub().returns(FAKE_TOKEN);
    forceTokenUpdate = sandbox.stub();
  }
  let fakeAuth: FakeAuth;
  let http: HTTP;
  let fetchResult: {
    isResponseOk: boolean
  };

  function mockFetch(httpInstance: HTTP) {
    sandbox.stub(httpInstance, '_fetch').resolves({
      status: OK,
      headers: new Headers({'content-type': 'application/json'}),
      json: () => fetchResult
    });
  }

  beforeEach(function beforeEach() {
    fakeAuth = new FakeAuth();

    fetchResult = {
      isResponseOk: true
    };

    http = new HTTP(fakeAuth);

    mockFetch(http);
  });

  it('should export http service', () => http.should.exist);

  it('should read token and perform authorized fetch', async () => {
    await http.request('testurl', {cache: 'default'});

    fakeAuth.requestToken.should.have.been.called;

    http._fetch.should.have.been.calledWith('testurl', {
      cache: 'default',
      headers: {
        ...defaultFetchConfig.headers,
        Authorization: `Bearer ${FAKE_TOKEN}`
      },
      credentials: 'same-origin',
      body: undefined
    });
  });

  it('should perform unauthorized fetch', async () => {
    await http.fetch('testurl', {cache: 'default'});

    fakeAuth.requestToken.should.not.have.been.called;

    http._fetch.should.have.been.calledWith('testurl', {
      cache: 'default',
      headers: undefined,
      body: undefined
    });
  });

  it('should perform request and return result', async () => {
    const res = await http.request<typeof fetchResult>('testurl');
    res.should.equal(fetchResult);
  });

  it('should perform request and return text result if no "application/json" header', async () => {
    (http._fetch as Sinon.SinonStub).resolves({
      status: OK,
      headers: new Headers({'content-type': 'text/html'}),
      json: () => sandbox.spy(),
      text: () => 'some text'
    });

    const res = await http.request<{data: string}>('testurl');
    res.should.deep.equal({data: 'some text'});
  });

  it('should allow to get meta information of response', async () => {
    const res = await http.request<{}>('testurl');

    const meta = http.getMetaForResponse(res);
    OK.should.equal(meta?.status);
    'application/json'.should.equal(meta?.headers?.get('content-type'));
  });

  it('should allow to get meta information of string response', async () => {
    (http._fetch as Sinon.SinonStub).resolves({
      status: OK,
      headers: new Headers({'content-type': 'text/html'}),
      json: () => sandbox.spy(),
      text: () => 'some text'
    });
    const res = await http.request<{}>('testurl');

    const meta = http.getMetaForResponse(res);
    OK.should.equal(meta?.status);
    'text/html'.should.equal(meta?.headers?.get('content-type'));
  });


  it('should encode query params in url', async () => {
    await http.request('http://testurl', {query: {
      foo: 'bar',
      test: ['a', 'b']
    }});

    http._fetch.should.have.been.
      calledWith('http://testurl?foo=bar&test=a,b', sinon.match(Object));
  });

  it('should support base url setting', async () => {
    http.setBaseUrl('http://test');
    await http.request('/foo');
    http._fetch.should.have.been.calledWith('http://test/foo', sinon.match(Object));
  });

  it('should perform request convert "body" as object into string', async () => {
    await http.request('testurl', {
      method: 'POST',
      body: {foo: 'bar'}
    });

    http._fetch.should.have.been.calledWithMatch('testurl', {
      method: 'POST',
      body: '{"foo":"bar"}'
    });
  });

  it('should not refresh token if server responds OK', async () => {
    await http.request('testurl');
    fakeAuth.forceTokenUpdate.should.not.have.been.called;
  });

  it('should throw if response status is not OK', async () => {
    (http._fetch as Sinon.SinonStub).resolves({
      status: METHOD_NOT_ALLOWED,
      json: () => fetchResult
    });

    const onError = sandbox.spy();
    await http.request('testurl').catch(onError);

    onError.should.have.been.called;
  });

  it('should include error information', async () => {
    (http._fetch as Sinon.SinonStub).resolves({
      status: SERVER_ERROR,
      headers: {
        get: () => 'application/json'
      },
      json: () => ({
        error: 'Failed',
        errorDescription: 'Failure description'
      })
    });

    try {
      await http.get('testurl');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      e.should.be.instanceof(HTTPError);
      e.status.should.equal(SERVER_ERROR);

      e.data.should.be.deep.equal({
        error: 'Failed',
        errorDescription: 'Failure description'
      });
    }
  });

  it('should refresh token and request again if invalid token error returned', async () => {
    (fakeAuth.constructor as typeof FakeAuth).shouldRefreshToken.returns(true);

    (http._fetch as Sinon.SinonStub).
      onFirstCall().resolves({
        status: METHOD_NOT_ALLOWED,
        json: () => ({error: 'invalid_token'}),
        headers: new Headers({'content-type': 'application/json'})
      }).
      onSecondCall().resolves({
        status: OK,
        json: () => fetchResult,
        headers: new Headers({'content-type': 'application/json'})
      });

    const res = await http.request<typeof fetchResult>('testurl');

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

  it('"delete" method should call request with DELETE type', async () => {
    sandbox.stub(http, 'request');
    await http.delete('testurl', {body: {foo: 'bar'}});

    http.request.should.have.been.calledWith('testurl', {method: 'DELETE', body: {foo: 'bar'}});
  });

  it('"put" method should call request with PUT type', async () => {
    sandbox.stub(http, 'request');
    await http.put('testurl', {body: {foo: 'bar'}});

    http.request.should.have.been.calledWith('testurl', {method: 'PUT', body: {foo: 'bar'}});
  });

  describe('abortify', () => {
    it('should abort request', () => {
      const abortSpy = sandbox.spy();
      sandbox.stub(window, 'AbortController').value(class FakeAbortController {
        signal = '';
        abort = abortSpy;
      });

      const {abort} = http.abortify(http.request<{id: string}>)('test');

      abort();

      abortSpy.should.have.been.called;
    });
  });
});
