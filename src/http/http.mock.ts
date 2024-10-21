import HTTP, {FetchParams} from './http';

const authMock = {
  requestToken: () => 'mock token',
  shouldRefreshToken: () => false,
  forceTokenUpdate: () => Promise.resolve(null),
};

export interface HTTPMockRequest {
  url: string;
  params: FetchParams;
}

export default class HTTPMock extends HTTP {
  defaultResponse: unknown;
  requests: HTTPMockRequest[];
  responsesByUrlMap: Map<string | RegExp, unknown>;
  constructor() {
    super(authMock);

    this.defaultResponse = null;
    this.requests = [];
    this.responsesByUrlMap = new Map();
  }

  _fetch(url: string, params: RequestInit) {
    this.requests = [
      ...this.requests,
      {
        url,
        params: {
          ...params,
          body: typeof params.body === 'string' ? JSON.parse(params.body) : params.body,
        },
      },
    ];

    return Promise.resolve({
      status: 200,
      ok: true,
      headers: new Headers({'content-type': 'application/json'}),
      json: () => Promise.resolve(this._getResponseForUrl(url) || this.defaultResponse),
    } as Response);
  }

  respondDefault(response: unknown) {
    this.defaultResponse = response;
  }

  respondForUrl(url: string | RegExp, response: unknown) {
    this.responsesByUrlMap.set(url, response);
  }

  _getResponseForUrl(urlToMatch: string) {
    const urls = this.responsesByUrlMap.keys();

    for (const url of urls) {
      if (url === urlToMatch) {
        return this.responsesByUrlMap.get(url);
      }

      if (url instanceof RegExp && url.test(urlToMatch)) {
        return this.responsesByUrlMap.get(url);
      }
    }

    return null;
  }

  getRequestsByUrlPart(url: string) {
    return this.requests.filter(it => it.url.indexOf(url) !== -1);
  }
}
