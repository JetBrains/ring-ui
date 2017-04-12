import 'whatwg-fetch';
import ExtendableError from 'es6-error';

/**
 * @name Http
 * @category Utilities
 * @description Provides a way to perform authorized network requests
 * @example-file ./http.examples.html
 */

const TOKEN_TYPE = 'Bearer';
const STATUS_OK_IF_MORE_THAN = 200;
const STATUS_BAD_IF_MORE_THAN = 300;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

export class HTTPError extends ExtendableError {
  constructor(response, data) {
    super(`${response.status} ${response.statusText}`);
    this.response = response;
    this.data = data;
    this.status = response.status;
  }
}

class Http {
  setAuth(auth) {
    this.requestToken = () => auth.requestToken();
    this.shouldRefreshToken = errorType => auth.constructor.shouldRefreshToken(errorType);
    this.forceTokenUpdate = () => auth.forceTokenUpdate();
  }

  _fetch(...args) {
    return fetch(...args);
  }

  async _authorizedFetch(url, params = {}) {
    if (!this.requestToken) {
      throw new Error('RingUI Http: setAuth should have been called before performing authorized requests');
    }
    const token = await this.requestToken();

    const body = params.body ? JSON.stringify(params.body) : params.body;

    return this._fetch(url, {
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `${TOKEN_TYPE} ${token}`
      },
      ...params,
      body
    });
  }

  async _checkIfShouldRefreshToken(response) {
    try {
      const res = await response.json();
      return this.shouldRefreshToken(res.data.error);
    } catch (err) {
      return false;
    }
  }

  _isErrorStatus(status) {
    return status < STATUS_OK_IF_MORE_THAN || status >= STATUS_BAD_IF_MORE_THAN;
  }

  async performRequest(url, params) {
    let response = await this._authorizedFetch(url, params);

    if (this._isErrorStatus(response.status)) {
      const shouldRefreshToken = await this._checkIfShouldRefreshToken(response);
      if (shouldRefreshToken) {
        await this.forceTokenUpdate();
        response = await this._authorizedFetch(url, params);
      }
    }

    if (this._isErrorStatus(response.status)) {
      try {
        const resJson = await response.json();
        throw new HTTPError(response, resJson);
      } catch (err) {
        throw new HTTPError(response);
      }
    }

    return await response.json();
  }

  get(url, params) {
    return this.performRequest(url, {
      method: 'GET',
      ...params
    });
  }

  post(url, params) {
    return this.performRequest(url, {
      method: 'POST',
      ...params
    });
  }
}

export default new Http();
