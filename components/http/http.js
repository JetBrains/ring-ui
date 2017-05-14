import 'whatwg-fetch';
import ExtendableError from 'es6-error';

import {encodeURL, joinBaseURLAndPath} from '../global/url';

/**
 * @name HTTP
 * @category Utilities
 * @description Provides a way to perform authorized network requests
 * @example-file ./http.examples.html
 */

const TOKEN_TYPE = 'Bearer';
const STATUS_OK_IF_MORE_THAN = 200;
const STATUS_BAD_IF_MORE_THAN = 300;

export const defaultFetchConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
};

export class HTTPError extends ExtendableError {
  constructor(response, data = {}) {
    super(`${response.status} ${response.statusText || ''}`);
    this.data = data;
    this.status = response.status;
  }
}

export const CODE = {
  UNAUTHORIZED: 401
};

export default class HTTP {
  baseUrl = null;

  constructor(auth, baseUrl, fetchConfig = {}) {
    if (auth) {
      this.setAuth(auth);
    }
    this.setBaseUrl(baseUrl);
    this.fetchConfig = {
      ...fetchConfig,
      headers: {
        ...defaultFetchConfig.headers,
        ...fetchConfig.headers
      }
    };
  }

  setAuth(auth) {
    this.requestToken = () => auth.requestToken();
    this.shouldRefreshToken = auth.constructor.shouldRefreshToken;
    this.forceTokenUpdate = () => auth.forceTokenUpdate();
  }

  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
  }

  _fetch(...args) {
    return fetch(...args);
  }

  _makeRequestUrl(url, queryObject) {
    const urlWithQuery = encodeURL(url, queryObject);
    return joinBaseURLAndPath(this.baseUrl, urlWithQuery);
  }

  _performRequest(url, token, params = {}) {
    const {headers, body, query = {}, ...fetchConfig} = params;

    return this._fetch(
      this._makeRequestUrl(url, query),
      {
        ...this.fetchConfig,
        headers: {
          ...this.fetchConfig.headers,
          Authorization: `${TOKEN_TYPE} ${token}`,
          ...headers
        },
        ...fetchConfig,
        body: body ? JSON.stringify(body) : body
      }
    );
  }

  async _processResponse(response) {
    if (HTTP._isErrorStatus(response.status)) {
      let resJson;
      try {
        resJson = await response.json();
      } catch (err) {
        // noop
      }

      throw new HTTPError(response, resJson);
    }

    try {
      return await response.json();
    } catch (err) {
      return response;
    }
  }

  static _isErrorStatus(status) {
    return status < STATUS_OK_IF_MORE_THAN || status >= STATUS_BAD_IF_MORE_THAN;
  }

  async fetch(url, params = {}) {
    const {headers, body, query = {}, ...fetchConfig} = params;

    const response = await this._fetch(
      this._makeRequestUrl(url, query),
      {
        ...this.fetchConfig,
        headers: {
          ...this.fetchConfig.headers,
          ...headers
        },
        ...fetchConfig,
        body: body ? JSON.stringify(body) : body
      }
    );

    return this._processResponse(response);
  }

  async authorizedFetch(...args) {
    const response = await this._performRequest(...args);

    return this._processResponse(response);
  }

  async request(url, params) {
    let token = await this.requestToken();
    let response = await this._performRequest(url, token, params);

    try {
      // Wait for result to catch an HTTP error
      return await this._processResponse(response);
    } catch (error) {
      if (!(error instanceof HTTPError)) {
        throw error;
      }

      const shouldRefreshToken = error.data.error !== undefined
        ? this.shouldRefreshToken(error.data.error)
        : false;

      if (shouldRefreshToken) {
        token = await this.forceTokenUpdate();
        response = await this._performRequest(url, token, params);

        return this._processResponse(response);
      }

      throw error;
    }
  }

  get(url, params) {
    return this.request(url, {
      method: 'GET',
      ...params
    });
  }

  post(url, params) {
    return this.request(url, {
      method: 'POST',
      ...params
    });
  }
}
