window.source = {
  "title": "HTTP",
  "url": "http.html",
  "type": "js",
  "content": "import 'whatwg-fetch';\nimport ExtendableError from 'es6-error';\n\nimport {encodeURL, joinBaseURLAndPath} from '../global/url';\n\n/**\n * @name HTTP\n * @tags Ring UI Language\n * @category Utilities\n * @description Provides a way to perform authorized network requests.\n * @example-file ./http.examples.html\n */\n\nconst TOKEN_TYPE = 'Bearer';\nconst STATUS_OK_IF_MORE_THAN = 200;\nconst STATUS_BAD_IF_MORE_THAN = 300;\n\nexport const defaultFetchConfig = {\n  headers: {\n    'Content-Type': 'application/json',\n    Accept: 'application/json'\n  },\n  credentials: 'same-origin'\n};\n\nexport class HTTPError extends ExtendableError {\n  constructor(response, data = {}) {\n    super(`${response.status} ${response.statusText || ''}`);\n    this.data = data;\n    this.status = response.status;\n  }\n}\n\nexport const CODE = {\n  UNAUTHORIZED: 401\n};\n\nexport default class HTTP {\n  baseUrl = null;\n\n  constructor(auth, baseUrl, fetchConfig = {}) {\n    if (auth) {\n      this.setAuth(auth);\n    }\n    this.setBaseUrl(baseUrl);\n\n    const {headers, ...defaultConfig} = defaultFetchConfig;\n\n    this.fetchConfig = {\n      ...defaultConfig,\n      ...fetchConfig,\n      headers: {\n        ...headers,\n        ...fetchConfig.headers\n      }\n    };\n  }\n\n  setAuth = auth => {\n    this.requestToken = () => auth.requestToken();\n    this.shouldRefreshToken = auth.constructor.shouldRefreshToken;\n    this.forceTokenUpdate = () => auth.forceTokenUpdate();\n  }\n\n  setBaseUrl = baseUrl => {\n    this.baseUrl = baseUrl;\n  }\n\n  _fetch(...args) {\n    return fetch(...args);\n  }\n\n  _makeRequestUrl(url, queryObject) {\n    const urlWithQuery = encodeURL(url, queryObject);\n    return joinBaseURLAndPath(this.baseUrl, urlWithQuery);\n  }\n\n  _performRequest(url, token, params = {}) {\n    const {headers, body, query = {}, ...fetchConfig} = params;\n\n    return this._fetch(\n      this._makeRequestUrl(url, query),\n      {\n        ...this.fetchConfig,\n        headers: {\n          ...this.fetchConfig.headers,\n          Authorization: `${TOKEN_TYPE} ${token}`,\n          ...headers\n        },\n        ...fetchConfig,\n        body: body ? JSON.stringify(body) : body\n      }\n    );\n  }\n\n  async _processResponse(response) {\n    const contentType = response.headers.get('content-type');\n    const isJson = contentType && contentType.indexOf('application/json') !== -1;\n\n    if (HTTP._isErrorStatus(response.status)) {\n      let resJson;\n      try {\n        resJson = await (isJson ? response.json() : response.text());\n      } catch (err) {\n        // noop\n      }\n\n      throw new HTTPError(response, resJson);\n    }\n\n    try {\n      return await (isJson ? response.json() : response.text());\n    } catch (err) {\n      return response;\n    }\n  }\n\n  static _isErrorStatus(status) {\n    return status < STATUS_OK_IF_MORE_THAN || status >= STATUS_BAD_IF_MORE_THAN;\n  }\n\n  fetch = async (url, params = {}) => {\n    const {body, query = {}, ...fetchConfig} = params;\n\n    const response = await this._fetch(\n      this._makeRequestUrl(url, query),\n      {\n        ...fetchConfig,\n        body: body ? JSON.stringify(body) : body\n      }\n    );\n\n    return this._processResponse(response);\n  }\n\n  async authorizedFetch(...args) {\n    const response = await this._performRequest(...args);\n\n    return this._processResponse(response);\n  }\n\n  request = async (url, params) => {\n    let token = await this.requestToken();\n    let response = await this._performRequest(url, token, params);\n\n    try {\n      // Wait for result to catch an HTTP error\n      return await this._processResponse(response);\n    } catch (error) {\n      if (!(error instanceof HTTPError)) {\n        throw error;\n      }\n\n      const shouldRefreshToken = error.data.error !== undefined\n        ? this.shouldRefreshToken(error.data.error)\n        : false;\n\n      if (shouldRefreshToken) {\n        token = await this.forceTokenUpdate();\n        response = await this._performRequest(url, token, params);\n\n        return this._processResponse(response);\n      }\n\n      throw error;\n    }\n  }\n\n  get = (url, params) => (\n    this.request(url, {\n      method: 'GET',\n      ...params\n    })\n  )\n\n  post = (url, params) => (\n    this.request(url, {\n      method: 'POST',\n      ...params\n    })\n  )\n}\n",
  "examples": [
    {
      "name": "HTTP service",
      "url": "examples/http/http-service.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"output\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport Auth from '@jetbrains/ring-ui/components/auth/auth';\nimport hubConfig from '@ring-ui/docs/components/hub-config';\nimport HTTP from '@jetbrains/ring-ui/components/http/http';\n\nconst auth = new Auth(hubConfig);\nconst http = new HTTP(auth);\n\nasync function initializeExample() {\n  await auth.init();\n\n  const user = await http.get(`${hubConfig.serverUri}/api/rest/users/me?fields=name,login`);\n\n  document.querySelector('#output').innerText = JSON.stringify(user);\n}\n\ninitializeExample();\n\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides a way to perform authorized network requests.",
  "attrs": {
    "name": "HTTP",
    "tags": "Ring UI Language",
    "category": "Utilities",
    "description": "Provides a way to perform authorized network requests.",
    "example-file": "./http.examples.html"
  }
};