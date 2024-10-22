import ExtendableError from 'es6-error';

import type Auth from '../auth/auth';
import {encodeURL, joinBaseURLAndPath} from '../global/url';

/**
 * @name HTTP
 */

const TOKEN_TYPE = 'Bearer';

export const defaultFetchConfig: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  credentials: 'same-origin',
};

export type HTTPErrorData = Record<string, unknown>;

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
  UNAUTHORIZED: 401,
};

type Method<T> = (url: string, params?: RequestParams) => Promise<T>;

export interface FetchParams<T = unknown> extends Omit<RequestInit, 'body' | 'headers'> {
  body?: T;
  query?: Record<string, unknown> | undefined;
  headers?: HeadersInit | Record<string, null | undefined>;
}

export interface RequestParams<RawBody extends boolean = true | false>
  extends FetchParams<RawBody extends true ? BodyInit | null : unknown> {
  sendRawBody?: RawBody;
}

export type RequestParamsWithoutMethod<RawBody extends boolean = boolean> = Omit<RequestParams<RawBody>, 'method'>;

function isRawBody(params: RequestParams): params is RequestParams<true> {
  return params.sendRawBody === true;
}

export interface HTTPAuth {
  requestToken(): Promise<string | null> | string | null;
  forceTokenUpdate(): Promise<string | null>;
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
        ...fetchConfig.headers,
      },
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

  _fetch(...args: Parameters<typeof fetch>): Promise<Response> {
    return fetch(...args);
  }

  private _makeRequestUrl(url: string, queryObject: Record<string, unknown>) {
    const urlWithQuery = encodeURL(url, queryObject);
    return joinBaseURLAndPath(this.baseUrl, urlWithQuery);
  }

  private _performRequest(url: string, token?: string | null | boolean, params: RequestParams = {}) {
    const {headers, body, query = {}, sendRawBody, ...fetchConfig} = params;

    const combinedHeaders = {
      ...this.fetchConfig.headers,
      ...(token ? {Authorization: `${TOKEN_TYPE} ${token}`} : {}),
      ...headers,
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
      bodyToSend =
        params.body === null || params.body === undefined || params.body === '' ? params.body : JSON.stringify(body);
    }

    return this._fetch(this._makeRequestUrl(url, query), {
      ...this.fetchConfig,
      headers: combinedHeaders as HeadersInit,
      ...fetchConfig,
      body: bodyToSend,
    });
  }

  private _storeRequestMeta(parsedResponse: object, rawResponse: Partial<Response>) {
    const {headers, ok, redirected, status, statusText, type, url} = rawResponse;
    this._requestsMeta.set(parsedResponse, {headers, ok, redirected, status, statusText, type, url});
  }

  private async _processResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.indexOf('application/json') !== -1;

    if (!response.ok) {
      let resJson;
      try {
        resJson = await (isJson ? response.json() : response.text());
      } catch (err) {
        // noop
      }

      throw new HTTPError(response, resJson);
    }

    try {
      const parsedResponse = await (isJson ? response.json() : {data: await response.text()});
      this._storeRequestMeta(parsedResponse, response);
      return parsedResponse;
    } catch (err) {
      return response;
    }
  }

  fetch = async <T = unknown>(url: string, params: FetchParams = {}): Promise<T> => {
    const {body, query = {}, ...fetchConfig} = params;

    const response = await this._fetch(this._makeRequestUrl(url, query), {
      ...fetchConfig,
      headers: fetchConfig.headers as HeadersInit | undefined,
      body: body !== null && body !== undefined && body !== '' ? JSON.stringify(body) : body,
    });

    return this._processResponse(response);
  };

  async authorizedFetch(...args: Parameters<HTTP['_performRequest']>) {
    const response = await this._performRequest(...args);

    return this._processResponse(response);
  }

  request = async <T = unknown>(url: string, params?: RequestParams): Promise<T> => {
    let token = await this.requestToken?.();
    let response = await this._performRequest(url, token, params);

    try {
      // Wait for result to catch an HTTP error
      return await this._processResponse(response);
    } catch (error) {
      if (!(error instanceof HTTPError)) {
        throw error;
      }

      const shouldRefreshToken =
        typeof error.data.error === 'string' ? this.shouldRefreshToken?.(error.data.error) : false;

      if (shouldRefreshToken) {
        token = await this.forceTokenUpdate?.();
        response = await this._performRequest(url, token, params);

        return this._processResponse(response);
      }

      throw error;
    }
  };

  getMetaForResponse = (response: object) => this._requestsMeta.get(response);

  get = <T = unknown>(url: string, params?: RequestParamsWithoutMethod): Promise<T> =>
    this.request<T>(url, {
      ...params,
      method: 'GET',
    });

  post = <T = unknown>(url: string, params?: RequestParamsWithoutMethod): Promise<T> =>
    this.request<T>(url, {
      ...params,
      method: 'POST',
    });

  delete = <T = unknown>(url: string, params?: RequestParamsWithoutMethod): Promise<T> =>
    this.request<T>(url, {
      ...params,
      method: 'DELETE',
    });

  put = <T = unknown>(url: string, params?: RequestParamsWithoutMethod): Promise<T> =>
    this.request<T>(url, {
      ...params,
      method: 'PUT',
    });

  /**
   * Usage: const {promise, abort} = http.abortify(http.get<{id: string}>)('http://test.com');
   * @param method
   */
  abortify =
    <T>(method: Method<T>): ((...p: Parameters<Method<T>>) => {promise: Promise<T>; abort: () => void}) =>
    (...[url, params]: Parameters<Method<T>>) => {
      const ctrl = new AbortController();

      if (params && !('signal' in params)) {
        (params as RequestInit).signal = ctrl.signal;
      }

      return {
        promise: method.call(this, url, params),
        abort: () => ctrl.abort(),
      };
    };
}
