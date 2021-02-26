import { _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass, d as _defineProperty, i as _objectSpread2, e as _objectWithoutProperties, l as _asyncToGenerator } from './_rollupPluginBabelHelpers-ab14fb00.js';
import ExtendableError from 'es6-error';
import { e as encodeURL, j as joinBaseURLAndPath } from './url-a3cbb96f.js';

/**
 * @name HTTP
 */

var TOKEN_TYPE = 'Bearer';
var STATUS_OK_IF_MORE_THAN = 200;
var STATUS_BAD_IF_MORE_THAN = 300;
var defaultFetchConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  credentials: 'same-origin'
};
var HTTPError = /*#__PURE__*/function (_ExtendableError) {
  _inherits(HTTPError, _ExtendableError);

  var _super = _createSuper(HTTPError);

  function HTTPError(response) {
    var _this;

    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, HTTPError);

    _this = _super.call(this, "".concat(response.status, " ").concat(response.statusText || ''));
    _this.data = data;
    _this.status = response.status;
    return _this;
  }

  return HTTPError;
}(ExtendableError);
var CODE = {
  UNAUTHORIZED: 401
};

var HTTP = /*#__PURE__*/function () {
  function HTTP(_auth, _baseUrl) {
    var _this2 = this;

    var _fetchConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, HTTP);

    _defineProperty(this, "baseUrl", null);

    _defineProperty(this, "_requestsMeta", new WeakMap());

    _defineProperty(this, "setAuth", function (auth) {
      _this2.requestToken = function () {
        return auth.requestToken();
      };

      _this2.shouldRefreshToken = auth.constructor.shouldRefreshToken;

      _this2.forceTokenUpdate = function () {
        return auth.forceTokenUpdate();
      };
    });

    _defineProperty(this, "setBaseUrl", function (baseUrl) {
      _this2.baseUrl = baseUrl;
    });

    _defineProperty(this, "fetch", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
        var params,
            body,
            _params$query,
            query,
            fetchConfig,
            response,
            _args = arguments;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                params = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                body = params.body, _params$query = params.query, query = _params$query === void 0 ? {} : _params$query, fetchConfig = _objectWithoutProperties(params, ["body", "query"]);
                _context.next = 4;
                return _this2._fetch(_this2._makeRequestUrl(url, query), _objectSpread2(_objectSpread2({}, fetchConfig), {}, {
                  body: body ? JSON.stringify(body) : body
                }));

              case 4:
                response = _context.sent;
                return _context.abrupt("return", _this2._processResponse(response));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(this, "request", /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url, params) {
        var token, response, shouldRefreshToken;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _this2.requestToken();

              case 2:
                token = _context2.sent;
                _context2.next = 5;
                return _this2._performRequest(url, token, params);

              case 5:
                response = _context2.sent;
                _context2.prev = 6;
                _context2.next = 9;
                return _this2._processResponse(response);

              case 9:
                return _context2.abrupt("return", _context2.sent);

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](6);

                if (_context2.t0 instanceof HTTPError) {
                  _context2.next = 16;
                  break;
                }

                throw _context2.t0;

              case 16:
                shouldRefreshToken = _context2.t0.data.error !== undefined ? _this2.shouldRefreshToken(_context2.t0.data.error) : false;

                if (!shouldRefreshToken) {
                  _context2.next = 25;
                  break;
                }

                _context2.next = 20;
                return _this2.forceTokenUpdate();

              case 20:
                token = _context2.sent;
                _context2.next = 23;
                return _this2._performRequest(url, token, params);

              case 23:
                response = _context2.sent;
                return _context2.abrupt("return", _this2._processResponse(response));

              case 25:
                throw _context2.t0;

              case 26:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[6, 12]]);
      }));

      return function (_x2, _x3) {
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty(this, "getMetaForResponse", function (response) {
      return _this2._requestsMeta.get(response);
    });

    _defineProperty(this, "get", function (url, params) {
      return _this2.request(url, _objectSpread2({
        method: 'GET'
      }, params));
    });

    _defineProperty(this, "post", function (url, params) {
      return _this2.request(url, _objectSpread2({
        method: 'POST'
      }, params));
    });

    if (_auth) {
      this.setAuth(_auth);
    }

    this.setBaseUrl(_baseUrl);

    var headers = defaultFetchConfig.headers,
        defaultConfig = _objectWithoutProperties(defaultFetchConfig, ["headers"]);

    this.fetchConfig = _objectSpread2(_objectSpread2(_objectSpread2({}, defaultConfig), _fetchConfig), {}, {
      headers: _objectSpread2(_objectSpread2({}, headers), _fetchConfig.headers)
    });
  }

  _createClass(HTTP, [{
    key: "_fetch",
    value: function _fetch() {
      return fetch.apply(void 0, arguments);
    }
  }, {
    key: "_makeRequestUrl",
    value: function _makeRequestUrl(url, queryObject) {
      var urlWithQuery = encodeURL(url, queryObject);
      return joinBaseURLAndPath(this.baseUrl, urlWithQuery);
    }
  }, {
    key: "_performRequest",
    value: function _performRequest(url, token) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var headers = params.headers,
          body = params.body,
          _params$query2 = params.query,
          query = _params$query2 === void 0 ? {} : _params$query2,
          sendRawBody = params.sendRawBody,
          fetchConfig = _objectWithoutProperties(params, ["headers", "body", "query", "sendRawBody"]);

      var combinedHeaders = _objectSpread2(_objectSpread2(_objectSpread2({}, this.fetchConfig.headers), token ? {
        Authorization: "".concat(TOKEN_TYPE, " ").concat(token)
      } : {}), headers);

      Object.keys(combinedHeaders).forEach(function (key) {
        if (combinedHeaders[key] === null || combinedHeaders[key] === undefined) {
          Reflect.deleteProperty(combinedHeaders, key);
        }
      });
      return this._fetch(this._makeRequestUrl(url, query), _objectSpread2(_objectSpread2(_objectSpread2({}, this.fetchConfig), {}, {
        headers: combinedHeaders
      }, fetchConfig), {}, {
        body: body && !sendRawBody ? JSON.stringify(body) : body
      }));
    }
  }, {
    key: "_storeRequestMeta",
    value: function _storeRequestMeta(parsedResponse, rawResponse) {
      var headers = rawResponse.headers,
          ok = rawResponse.ok,
          redirected = rawResponse.redirected,
          status = rawResponse.status,
          statusText = rawResponse.statusText,
          type = rawResponse.type,
          url = rawResponse.url;

      this._requestsMeta.set(parsedResponse, {
        headers: headers,
        ok: ok,
        redirected: redirected,
        status: status,
        statusText: statusText,
        type: type,
        url: url
      });
    }
  }, {
    key: "_processResponse",
    value: function () {
      var _processResponse2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(response) {
        var contentType, isJson, resJson, parsedResponse;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                contentType = response.headers.get('content-type');
                isJson = contentType && contentType.indexOf('application/json') !== -1;

                if (!HTTP._isErrorStatus(response.status)) {
                  _context3.next = 12;
                  break;
                }

                _context3.prev = 3;
                _context3.next = 6;
                return isJson ? response.json() : response.text();

              case 6:
                resJson = _context3.sent;
                _context3.next = 11;
                break;

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](3);

              case 11:
                throw new HTTPError(response, resJson);

              case 12:
                _context3.prev = 12;

                if (!isJson) {
                  _context3.next = 17;
                  break;
                }

                _context3.t1 = response.json();
                _context3.next = 21;
                break;

              case 17:
                _context3.next = 19;
                return response.text();

              case 19:
                _context3.t2 = _context3.sent;
                _context3.t1 = {
                  data: _context3.t2
                };

              case 21:
                _context3.next = 23;
                return _context3.t1;

              case 23:
                parsedResponse = _context3.sent;

                this._storeRequestMeta(parsedResponse, response);

                return _context3.abrupt("return", parsedResponse);

              case 28:
                _context3.prev = 28;
                _context3.t3 = _context3["catch"](12);
                return _context3.abrupt("return", response);

              case 31:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 9], [12, 28]]);
      }));

      function _processResponse(_x4) {
        return _processResponse2.apply(this, arguments);
      }

      return _processResponse;
    }()
  }, {
    key: "authorizedFetch",
    value: function () {
      var _authorizedFetch = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var response,
            _args4 = arguments;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this._performRequest.apply(this, _args4);

              case 2:
                response = _context4.sent;
                return _context4.abrupt("return", this._processResponse(response));

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function authorizedFetch() {
        return _authorizedFetch.apply(this, arguments);
      }

      return authorizedFetch;
    }()
  }], [{
    key: "_isErrorStatus",
    value: function _isErrorStatus(status) {
      return status < STATUS_OK_IF_MORE_THAN || status >= STATUS_BAD_IF_MORE_THAN;
    }
  }]);

  return HTTP;
}();

export default HTTP;
export { CODE, HTTPError, defaultFetchConfig };
