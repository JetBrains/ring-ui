import ExtendableError from 'es6-error';

import Auth from '../auth/auth';
import {encodeURL, joinBaseURLAndPath} from '../global/url';

/**
 * @name HTTP
 */

const TOKEN_TYPE = 'Bearer';
const STATUS_OK_IF_MORE_THAN = 200;
const STATUS_BAD_IF_MORE_THAN = 300;

export const defaultFetchConfig: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  credentials: 'same-origin'
};

export interface HTTPErrorData {
  error?: string
}
export class HTTPError extends ExtendableError {
  data: HTTPErrorData;
  status: number | undefined;
  constructor(response: Partial<Response>, data: HTTPErrorData = {}) {
    super(`${response.status} ${response.statusText || ''}`);
    this.data = data;
    this.status = response.status;
  }
}

export const CODE = {
  UNAUTHORIZED: 401
};

export interface FetchParams<T = unknown> extends Omit<RequestInit, 'body'> {
  body?: T
  query?: Record<string, unknown> | undefined
}

export interface RequestParams<
  RawBody extends boolean = true | false
> extends FetchParams<
  RawBody extends true ? (BodyInit | null) : unknown
> {
  sendRawBody?: RawBody;
}

export type RequestParamsWithoutMethod<
  RawBody extends boolean = boolean
  > = Omit<RequestParams<RawBody>, 'method'>;

function isRawBody(params: RequestParams): params is RequestParams<true> {
  return params.sendRawBody === true;
}


export interface HTTPAuth {
  requestToken(): Promise<string | null> | string | null
  forceTokenUpdate(): Promise<string | null>
}

export default class HTTP implements Partial<HTTPAuth> {
  baseUrl: string | null | undefined = null;
  _requestsMeta = new WeakMap<object, Partial<Response>>();
  fetchConfig: RequestInit;
  requestToken?: () => Promise<string | null> | string | null;
  shouldRefreshToken?: (error: string) => boolean;
  forceTokenUpdate?: () => Promise<string | null>;

  constructor(auth?: HTTPAuth, baseUrl?: string | null | undefined, fetchConfig: RequestInit = {}) {
    if (auth) {
      this.setAuth(auth);
    }
    this.setBaseUrl(baseUrl);

    const {headers, ...defaultConfig} = defaultFetchConfig;

    this.fetchConfig = {
      ...defaultConfig,
      ...fetchConfig,
      headers: {
        ...headers,
        ...fetchConfig.headers
      }
    };
  }

  setAuth = (auth: HTTPAuth) => {
    this.requestToken = () => auth.requestToken();
    this.shouldRefreshToken = (auth.constructor as typeof Auth).shouldRefreshToken;
    this.forceTokenUpdate = () => auth.forceTokenUpdate();
  };

  setBaseUrl = (baseUrl: string | null | undefined) => {
    this.baseUrl = baseUrl;
  };

  _fetch(...args: Parameters<typeof fetch>): Promise<Response> | Partial<Response> {
    return fetch(...args);
  }

  private _makeRequestUrl(url: string, queryObject: Record<string, unknown>) {
    const urlWithQuery = encodeURL(url, queryObject);
    return joinBaseURLAndPath(this.baseUrl, urlWithQuery);
  }

  private _performRequest(
    url: string,
    token?: string | null | boolean,
    params: RequestParams = {}
  ) {
    const {headers, body, query = {}, sendRawBody, ...fetchConfig} = params;

    const combinedHeaders = {
      ...this.fetchConfig.headers,
      ...(token ? {Authorization: `${TOKEN_TYPE} ${token}`} : {}),
      ...headers
    };

    Object.entries(combinedHeaders).forEach(([key, header]) => {
      if (header === null || header === undefined) {
        Reflect.deleteProperty(combinedHeaders, key);
      }
    });

    let bodyToSend: BodyInit | null | undefined;
    if (isRawBody(params)) {
      bodyToSend = params.body;
    } else {
      bodyToSend = params.body === null || params.body === undefined || params.body === ''
        ? params.body
        : JSON.stringify(body);
    }

    return this._fetch(
      this._makeRequestUrl(url, query),
      {
        ...this.fetchConfig,
        headers: combinedHeaders,
        ...fetchConfig,
        body: bodyToSend
      }
    );
  }

  private _storeRequestMeta(parsedResponse: object, rawResponse: Partial<Response>) {
    const {headers, ok, redirected, status, statusText, type, url} = rawResponse;
    this._requestsMeta.
      set(parsedResponse, {headers, ok, redirected, status, statusText, type, url});
  }

  private async _processResponse(response: Partial<Response>) {
    const contentType = response.headers?.get('content-type');
    const isJson = contentType && contentType.indexOf('application/json') !== -1;

    if (response.status != null && HTTP._isErrorStatus(response.status)) {
      let resJson;
      try {
        resJson = await (isJson ? response.json?.() : response.text?.());
      } catch (err) {
        // noop
      }

      throw new HTTPError(response, resJson);
    }

    try {
      const parsedResponse = await (isJson ? response.json?.() : {data: await response.text?.()});
      this._storeRequestMeta(parsedResponse, response);
      return parsedResponse;
    } catch (err) {
      return response;
    }
  }

  private static _isErrorStatus(status: number) {
    return status < STATUS_OK_IF_MORE_THAN || status >= STATUS_BAD_IF_MORE_THAN;
  }

  fetch = async (url: string, params: FetchParams = {}) => {
    const {body, query = {}, ...fetchConfig} = params;

    const response = await this._fetch(
      this._makeRequestUrl(url, query),
      {
        ...fetchConfig,
        body: body !== null && body !== undefined && body !== '' ? JSON.stringify(body) : body
      }
    );

    return this._processResponse(response);
  };

  async authorizedFetch(...args: Parameters<HTTP['_performRequest']>) {
    const response = await this._performRequest(...args);

    return this._processResponse(response);
  }

  request = async (url: string, params?: RequestParams) => {
    let token = await this.requestToken?.();
    let response = await this._performRequest(url, token, params);

    try {
      // Wait for result to catch an HTTP error
      return await this._processResponse(response);
    } catch (error) {
      if (!(error instanceof HTTPError)) {
        throw error;
      }

      const shouldRefreshToken = error.data.error !== undefined
        ? this.shouldRefreshToken?.(error.data.error)
        : false;

      if (shouldRefreshToken) {
        token = await this.forceTokenUpdate?.();
        response = await this._performRequest(url, token, params);

        return this._processResponse(response);
      }

      throw error;
    }
  };

  getMetaForResponse = (response: object) => this._requestsMeta.get(response);

  get = (url: string, params?: RequestParamsWithoutMethod) => (
    this.request(url, {
      ...params,
      method: 'GET'
    })
  );

  post = (url: string, params?: RequestParamsWithoutMethod) => (
    this.request(url, {
      ...params,
      method: 'POST'
    })
  );

  delete = (url: string, params?: RequestParamsWithoutMethod) => (
    this.request(url, {
      ...params,
      method: 'DELETE'
    })
  );

  put = (url: string, params?: RequestParamsWithoutMethod) => (
    this.request(url, {
      ...params,
      method: 'PUT'
    })
  );
}
