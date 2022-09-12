import HTTP, {defaultFetchConfig} from './http';

const OK = 200;
const METHOD_NOT_ALLOWED = 405;

describe('HTTP', () => {
  const FAKE_TOKEN = 'fake-token';
  let fakeAuth;
  let http;
  let fetchResult;

  function mockFetch(httpInstance) {
    sandbox.stub(httpInstance, '_fetch').resolves({
      status: OK,
      headers: new Headers({'content-type': 'application/json'}),
      json: () => fetchResult
    });
  }

  beforeEach(function beforeEach() {
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

  it('should export http service', () => http.should.exist);

  it('should read token and perform authorized fetch', async () => {
    await http.request('testurl', {foo: 'bar'});

    fakeAuth.requestToken.should.have.been.called;

    http._fetch.should.have.been.calledWith('testurl', {
      foo: 'bar',
      headers: {
        ...defaultFetchConfig.headers,
        Authorization: `Bearer ${FAKE_TOKEN}`
      },
      credentials: 'same-origin',
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

  it('should perform request and return text result if no "application/json" header', async () => {
    http._fetch.resolves({
      status: OK,
      headers: new Headers({'content-type': 'text/html'}),
      json: () => sandbox.spy(),
      text: () => 'some text'
    });

    const res = await http.request('testurl');
    res.should.deep.equal({data: 'some text'});
  });

  it('should allow to get meta information of response', async () => {
    const res = await http.request('testurl');

    const meta = http.getMetaForResponse(res);
    meta.status.should.equal(OK);
    meta.headers.get('content-type').should.equal('application/json');
  });

  it('should allow to get meta information of string response', async () => {
    http._fetch.resolves({
      status: OK,
      headers: new Headers({'content-type': 'text/html'}),
      json: () => sandbox.spy(),
      text: () => 'some text'
    });
    const res = await http.request('testurl');

    const meta = http.getMetaForResponse(res);
    meta.status.should.equal(OK);
    meta.headers.get('content-type').should.equal('text/html');
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
    http._fetch.resolves({
      status: METHOD_NOT_ALLOWED,
      json: () => fetchResult
    });

    const onError = sandbox.spy();
    await http.request('testurl').catch(onError);

    onError.should.have.been.called;
  });

  it('should refresh token and request again if invalid token error returned', async () => {
    fakeAuth.constructor.shouldRefreshToken.returns(true);

    http._fetch.
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
});
