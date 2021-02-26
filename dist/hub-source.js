import { c as _createClass, d as _defineProperty, b as _classCallCheck, l as _asyncToGenerator } from './_rollupPluginBabelHelpers-ab14fb00.js';

var defaultOptions = {
  searchMax: 20,
  searchSideThreshold: 100,
  queryFormatter: function queryFormatter(query) {
    return "".concat(query, " or ").concat(query, "*");
  }
};
/**
 * HubSource is designed to speed up search requests for small installations.
 * If there are less than "searchSideThreshold" items, it uses client-side filtering
 * of cached results to greatly increase search speed. Useful for completion and
 * select data source.
 */

var HubSource = /*#__PURE__*/function () {
  function HubSource(auth, relativeUrl, options) {
    _classCallCheck(this, HubSource);

    this.http = auth.http;
    this.relativeUrl = relativeUrl;
    this.options = Object.assign({}, defaultOptions, options);
    this.storedData = null;
    this.isClientSideSearch = null;
    this.filterFn = null;
  }

  _createClass(HubSource, [{
    key: "makeRequest",
    value: function makeRequest(queryParams) {
      return this.http.get(this.relativeUrl, {
        query: queryParams
      });
    }
  }, {
    key: "makeCachedRequest",
    value: function () {
      var _makeCachedRequest = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.storedData) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", this.storedData);

              case 2:
                _context.next = 4;
                return this.makeRequest(params);

              case 4:
                res = _context.sent;
                this.storedData = res;
                return _context.abrupt("return", res);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function makeCachedRequest(_x) {
        return _makeCachedRequest.apply(this, arguments);
      }

      return makeCachedRequest;
    }()
  }, {
    key: "checkIsClientSideSearch",
    value: function checkIsClientSideSearch(res) {
      return res.total <= this.options.searchSideThreshold;
    }
  }, {
    key: "getDefaultFilterFn",
    value: function getDefaultFilterFn(query) {
      if (!query) {
        return function () {
          return true;
        };
      }

      return function (it) {
        return it.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      };
    }
  }, {
    key: "formatQuery",
    value: function formatQuery(query) {
      return query ? this.options.queryFormatter(query) : '';
    }
  }, {
    key: "processResults",
    value: function processResults(res) {
      var _this = this;

      var items = res[this.relativeUrl] || [];

      if (this.isClientSideSearch) {
        return items.filter(function (it) {
          return _this.filterFn(it);
        }).slice(0, this.options.searchMax);
      }

      return items;
    }
  }, {
    key: "sideDetectionRequest",
    value: function () {
      var _sideDetectionRequest = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(params, query) {
        var res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.makeCachedRequest(HubSource.mergeParams(params, {
                  $top: this.options.searchSideThreshold
                }));

              case 2:
                res = _context2.sent;
                this.isClientSideSearch = this.checkIsClientSideSearch(res);

                if (this.isClientSideSearch) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return", this.doServerSideSearch(params, query));

              case 6:
                return _context2.abrupt("return", res);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function sideDetectionRequest(_x2, _x3) {
        return _sideDetectionRequest.apply(this, arguments);
      }

      return sideDetectionRequest;
    }()
  }, {
    key: "doClientSideSearch",
    value: function doClientSideSearch(params) {
      return this.makeCachedRequest(HubSource.mergeParams(params, {
        $top: this.constructor.TOP_ALL
      }));
    }
  }, {
    key: "doServerSideSearch",
    value: function doServerSideSearch(params, query) {
      return this.makeRequest(HubSource.mergeParams(params, {
        query: this.formatQuery(query),
        $top: this.options.searchMax
      }));
    }
  }, {
    key: "getValueFromSuitableSource",
    value: function getValueFromSuitableSource(query, params) {
      if (this.isClientSideSearch === null) {
        return this.sideDetectionRequest(params, query);
      }

      if (this.isClientSideSearch) {
        return this.doClientSideSearch(params);
      }

      return this.doServerSideSearch(params, query);
    }
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(query, params, filterFn) {
        var res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                HubSource.validateInputParams(params);
                this.filterFn = filterFn || this.getDefaultFilterFn(query);
                _context3.next = 4;
                return this.getValueFromSuitableSource(query, params);

              case 4:
                res = _context3.sent;
                return _context3.abrupt("return", this.processResults(res));

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function get(_x4, _x5, _x6) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }], [{
    key: "mergeParams",
    value: function mergeParams(params, toMerge) {
      return Object.assign({}, params, toMerge);
    }
  }, {
    key: "validateInputParams",
    value: function validateInputParams(params) {
      if (params.top) {
        throw new Error('HubSource: params.top should not be filled, configure "options.searchMax" instead');
      }

      if (params.query) {
        throw new Error('HubSource: params.query should not be filled, configure "options.queryFormatter" instead');
      }
    }
  }]);

  return HubSource;
}();

_defineProperty(HubSource, "TOP_ALL", -1);

export default HubSource;
