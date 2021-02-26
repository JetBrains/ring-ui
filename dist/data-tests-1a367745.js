import { j as _typeof, k as _toConsumableArray, h as _slicedToArray } from './_rollupPluginBabelHelpers-ab14fb00.js';

function expandMap(attrsMap) {
  return Object.entries(attrsMap).reduce(function (result, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    return value ? [].concat(_toConsumableArray(result), [key]) : result;
  }, []);
}

function joinDataTestAttributes() {
  for (var _len = arguments.length, attrs = new Array(_len), _key = 0; _key < _len; _key++) {
    attrs[_key] = arguments[_key];
  }

  return attrs.filter(function (attr) {
    return !!attr;
  }).reduce(function (result, attr) {
    if (_typeof(attr) === 'object') {
      return [].concat(_toConsumableArray(result), _toConsumableArray(expandMap(attr)));
    }

    return [].concat(_toConsumableArray(result), [attr]);
  }, []).join(' ');
}

export { joinDataTestAttributes as j };
