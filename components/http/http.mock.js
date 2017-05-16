
import HTTP from './http';

const authMock = {
  requestToken: async () => 'mock token',
  shouldRefreshToken: () => false,
  forceTokenUpdate: async () => {}
};

export default class HTTPMock extends HTTP {
  constructor() {
    super(authMock);

    this.defaultResponse = null;
    this.requests = [];
    this.responsesByUrlMap = new Map();
  }

  async _fetch(url, params) {
    this.requests = [...this.requests, {
      url,
      params: {
        ...params,
        body: params.body ? JSON.parse(params.body) : params.body
      }
    }];

    return {
      status: 200,
      headers: new Headers({'content-type': 'application/json'}),
      json: async () => (this._getResponseForUrl(url) || this.defaultResponse)
    };
  }

  respondDefault(response) {
    this.defaultResponse = response;
  }

  respondForUrl(url, response) {
    this.responsesByUrlMap.set(url, response);
  }

  _getResponseForUrl(urlToMatch) {
    const urls = this.responsesByUrlMap.keys();

    for (const url of urls) {
      if (url === urlToMatch) {
        return this.responsesByUrlMap.get(url);
      }

      if (url.test && url.test(urlToMatch)) {
        return this.responsesByUrlMap.get(url);
      }
    }

    return null;
  }

  getRequestsByUrlPart(url) {
    return this.requests.filter(it => it.url.indexOf(url) !== -1);
  }
}
