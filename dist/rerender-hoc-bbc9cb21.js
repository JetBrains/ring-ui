import { _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, c as _createClass } from './_rollupPluginBabelHelpers-ab14fb00.js';
import { createElement } from 'react';
import { render } from 'react-dom';

/**
 * Wraps a component to add a "rerender" method
 * @param ComposedComponent
 * @param captureNode, whether the wrapper should capture this.node itself. Set to false if the component already has "node" property captured
 * @returns {Rerenderer}
 */

function rerenderHOC(ComposedComponent) {
  var _temp;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    captureNode: false
  },
      captureNode = _ref.captureNode;

  if (captureNode) {
    throw new Error('rerenderHOC: captureNode={true} is deprecated. Wrapped component must have "node" property captured itself');
  }

  return _temp = /*#__PURE__*/function (_ComposedComponent) {
    _inherits(Rerenderer, _ComposedComponent);

    var _super = _createSuper(Rerenderer);

    function Rerenderer() {
      var _this;

      _classCallCheck(this, Rerenderer);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "_propsCache", {});

      return _this;
    }

    _createClass(Rerenderer, [{
      key: "rerender",
      value: function rerender() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = arguments.length > 1 ? arguments[1] : undefined;
        var container;

        try {
          container = this.node.parentNode;
        } finally {
          if (!container) {
            throw new Error("".concat(this.constructor.name, " component isn't mounted"));
          }
        }

        this._propsCache = Object.assign({}, this.props, this._propsCache, props);
        return render( /*#__PURE__*/createElement(this.constructor, this._propsCache), container, callback);
      }
    }]);

    return Rerenderer;
  }(ComposedComponent), _temp;
}

export { rerenderHOC as r };
