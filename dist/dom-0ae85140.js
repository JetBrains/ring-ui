import { c as _createClass, b as _classCallCheck, d as _defineProperty } from './_rollupPluginBabelHelpers-ab14fb00.js';

/**
 * @name DOM
 */
var getStyles = window.getComputedStyle.bind(window);
function isMounted(node) {
  if (node === document) {
    return true;
  }

  return node instanceof Node && document.documentElement.contains(node.parentNode);
}
var rectStub = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0
};
function getRect(node) {
  if (node instanceof Range || isMounted(node)) {
    var _node$getBoundingClie = node.getBoundingClientRect(),
        top = _node$getBoundingClie.top,
        right = _node$getBoundingClie.right,
        bottom = _node$getBoundingClie.bottom,
        left = _node$getBoundingClie.left,
        width = _node$getBoundingClie.width,
        height = _node$getBoundingClie.height;

    return {
      top: top,
      right: right,
      bottom: bottom,
      left: left,
      width: width,
      height: height
    };
  } else {
    return Object.assign({}, rectStub);
  }
}
function getPixelRatio() {
  return 'devicePixelRatio' in window ? window.devicePixelRatio : 1;
}
function getWindowHeight() {
  return window.innerHeight;
}
function getWindowWidth() {
  return window.innerWidth;
}
function isNodeInVisiblePartOfPage(node) {
  var _getRect = getRect(node),
      top = _getRect.top,
      bottom = _getRect.bottom,
      left = _getRect.left,
      right = _getRect.right;

  return !(bottom < 0 || right < 0 || getWindowHeight() - top < 0 || getWindowWidth() - left < 0);
}
function getDocumentScrollTop() {
  return document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
}
function getDocumentScrollLeft() {
  return document.documentElement && document.documentElement.scrollLeft || document.body.scrollLeft;
}
var Listeners = /*#__PURE__*/function () {
  function Listeners() {
    _classCallCheck(this, Listeners);

    _defineProperty(this, "_all", new Set());
  }

  _createClass(Listeners, [{
    key: "add",
    value: function add(el, event, handler, useCapture) {
      el.addEventListener(event, handler, useCapture);

      var dispatchFn = function dispatchFn() {
        return el.removeEventListener(event, handler, useCapture);
      };

      this._all.add(dispatchFn);

      return dispatchFn;
    }
  }, {
    key: "remove",
    value: function remove(fn) {
      fn();

      this._all.delete(fn);
    }
  }, {
    key: "removeAll",
    value: function removeAll() {
      var _this = this;

      this._all.forEach(function (fn) {
        return _this.remove(fn);
      });
    }
  }]);

  return Listeners;
}(); // Synthetic events from Combokeys#trigger are plain objects

function preventDefault(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
}

export { Listeners as L, getPixelRatio as a, isMounted as b, getDocumentScrollTop as c, getDocumentScrollLeft as d, getWindowHeight as e, getStyles as f, getRect as g, isNodeInVisiblePartOfPage as i, preventDefault as p };
