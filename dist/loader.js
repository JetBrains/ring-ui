import { d as _defineProperty, c as _createClass, b as _classCallCheck, _ as _inherits, a as _createSuper, g as _assertThisInitialized, e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { j as joinDataTestAttributes } from './data-tests-1a367745.js';
import { a as getPixelRatio } from './dom-0ae85140.js';
import styleInject from 'style-inject';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n@keyframes loader_rotation-keyframes__1S8wN {\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n.loader_canvas__38F8d {\n  display: block;\n\n  margin: 16px auto;\n\n  pointer-events: none;\n}\n\n.loader_animate__1KFQA {\n  animation: loader_rotation-keyframes__1S8wN 36s linear infinite;\n}\n\n.loader_text__2LDMT {\n  text-align: center;\n\n  font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n\n  font-family: var(--ring-font-family);\n  font-size: 13px;\n  font-size: var(--ring-font-size);\n  line-height: 20px;\n  line-height: var(--ring-line-height);\n}\n";
var styles = {"unit":"8px","canvas":"loader_canvas__38F8d","animate":"loader_animate__1KFQA","rotation-keyframes":"loader_rotation-keyframes__1S8wN","text":"loader_text__2LDMT"};
styleInject(css_248z);

var INITIAL_TICKS = 100;

var Particle = /*#__PURE__*/function () {
  function Particle(_ref) {
    var x = _ref.x,
        y = _ref.y,
        radius = _ref.radius,
        color = _ref.color;

    _classCallCheck(this, Particle);

    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;
    this.decay = 0.01;
    this.life = 1;
  }

  _createClass(Particle, [{
    key: "step",
    value: function step() {
      this.life -= this.decay;
    }
  }, {
    key: "isAlive",
    value: function isAlive() {
      return this.life >= 0;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      var alpha = this.life >= 0 ? this.life : 0;
      ctx.fillStyle = "rgba(".concat(this.color.r, ", ").concat(this.color.g, ", ").concat(this.color.b, ", ").concat(alpha, ")");
      ctx.beginPath();
      ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }]);

  return Particle;
}();

var DETERMINISTIC_VALUE = 0.5;

function deterministic() {
  return DETERMINISTIC_VALUE;
}

var LoaderCore = /*#__PURE__*/function () {
  _createClass(LoaderCore, null, [{
    key: "calculateGradient",
    value: function calculateGradient(startColor, stopColor, position) {
      var calculateChannelValue = function calculateChannelValue(a, b) {
        return a + Math.round((b - a) * position);
      };

      return {
        r: calculateChannelValue(startColor.r, stopColor.r),
        g: calculateChannelValue(startColor.g, stopColor.g),
        b: calculateChannelValue(startColor.b, stopColor.b)
      };
    }
  }]);

  function LoaderCore(containerNode, props) {
    _classCallCheck(this, LoaderCore);

    this.props = Object.assign({}, LoaderCore.defaultProps, props);
    this.renderInNode(containerNode);
    this.initializeLoader();
    this.isRunning = !this.props.stop;

    if (this.isRunning) {
      this.startAnimation();
    } else {
      this.draw();
    }
  }

  _createClass(LoaderCore, [{
    key: "setCanvasSize",
    value: function setCanvasSize() {
      var pixelRatio = LoaderCore.getPixelRatio();
      var canvasSize = this.props.size * pixelRatio;
      this.canvas.width = canvasSize;
      this.canvas.height = canvasSize; //Fixate canvas physical size to avoid real size scaling

      this.canvas.style.width = "".concat(this.props.size, "px");
      this.canvas.style.height = "".concat(this.props.size, "px");
      this.ctx = this.canvas.getContext('2d');
      this.ctx.scale(pixelRatio, pixelRatio);
    }
  }, {
    key: "initializeLoader",
    value: function initializeLoader() {
      this.setCanvasSize();
      this.height = this.props.size;
      this.width = this.props.size;
      this.particles = []; //Configuration

      this.baseSpeed = 1.0;
      this.colorIndex = 0;
      this.maxRadius = 10;
      this.minRadius = 6;
      this.colorChangeTick = 40; //State

      this.x = 0;
      this.y = 0;
      this.radius = 8;
      this.hSpeed = 1.5;
      this.vSpeed = 0.5;
      this.radiusSpeed = 0.05;
      this.tick = 0;
      this.prepareInitialState(INITIAL_TICKS);
    }
  }, {
    key: "prepareInitialState",
    value: function prepareInitialState(ticks) {
      for (var i = 0; i < ticks; i++) {
        this.step();
      }
    }
  }, {
    key: "handleLimits",
    value: function handleLimits(coord, radius, speed, limit) {
      var randomFunc = this.props.deterministic ? deterministic : Math.random;
      var randomizedSpeedChange = randomFunc(this.baseSpeed) - this.baseSpeed / 2;

      if (coord + radius * 2 + this.baseSpeed >= limit) {
        return -(this.baseSpeed + randomizedSpeedChange);
      } else if (coord <= this.baseSpeed) {
        return this.baseSpeed + randomizedSpeedChange;
      }

      return speed;
    }
  }, {
    key: "calculateNextCoordinates",
    value: function calculateNextCoordinates() {
      this.x += this.hSpeed;
      this.y += this.vSpeed;
      this.hSpeed = this.handleLimits(this.x, this.radius, this.hSpeed, this.width);
      this.vSpeed = this.handleLimits(this.y, this.radius, this.vSpeed, this.height);
    }
  }, {
    key: "calculateNextRadius",
    value: function calculateNextRadius() {
      this.radius += this.radiusSpeed;

      if (this.radius > this.maxRadius || this.radius < this.minRadius) {
        this.radiusSpeed = -this.radiusSpeed;
      }
    }
  }, {
    key: "getNextColor",
    value: function getNextColor() {
      var colors = this.props.colors;
      var currentColor = colors[this.colorIndex];
      var nextColor = colors[this.colorIndex + 1] || colors[0];
      return LoaderCore.calculateGradient(currentColor, nextColor, this.tick / this.colorChangeTick);
    }
  }, {
    key: "nextTick",
    value: function nextTick() {
      this.tick++;

      if (this.tick > this.colorChangeTick) {
        this.tick = 0;
        this.colorIndex++;

        if (this.colorIndex > this.props.colors.length - 1) {
          this.colorIndex = 0;
        }
      }
    }
  }, {
    key: "step",
    value: function step() {
      this.nextTick();
      this.calculateNextCoordinates();
      this.calculateNextRadius();
      this.particles.forEach(function (particle) {
        return particle.step();
      });
      this.particles.push(new Particle({
        x: this.x,
        y: this.y,
        radius: this.radius,
        color: this.getNextColor()
      }));
    }
  }, {
    key: "removeDeadParticles",
    value: function removeDeadParticles() {
      this.particles = this.particles.filter(function (it) {
        return it.isAlive();
      });
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this = this;

      this.ctx.clearRect(0, 0, this.width, this.height);
      this.removeDeadParticles();
      this.particles.forEach(function (particle) {
        return particle.draw(_this.ctx);
      });
    }
  }, {
    key: "loop",
    value: function loop() {
      var _this2 = this;

      this.step();
      this.draw();

      if (this.isRunning) {
        window.requestAnimationFrame(function () {
          return _this2.loop();
        });
      }
    }
  }, {
    key: "updateMessage",
    value: function updateMessage(text) {
      this.textNode.textContent = text || '';
    }
  }, {
    key: "stopAnimation",
    value: function stopAnimation() {
      this.isRunning = false;
      this.canvas.classList.remove(styles.animate);
    }
  }, {
    key: "startAnimation",
    value: function startAnimation() {
      this.isRunning = true;
      this.canvas.classList.add(styles.animate);
      this.loop();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.isRunning = false;
    }
  }, {
    key: "renderInNode",
    value: function renderInNode(node) {
      this.canvas = document.createElement('canvas');
      this.canvas.dataset.test = 'ring-loader';
      this.canvas.classList.add(styles.canvas);
      this.textNode = document.createElement('div');
      this.textNode.dataset.test = 'ring-loader-text';
      this.textNode.classList.add(styles.text);
      this.textNode.textContent = this.props.message ? this.props.message : '';
      node.appendChild(this.canvas);
      node.appendChild(this.textNode);
      return node;
    }
  }], [{
    key: "getPixelRatio",
    value: function getPixelRatio$1() {
      return getPixelRatio();
    }
  }]);

  return LoaderCore;
}();

_defineProperty(LoaderCore, "defaultProps", {
  size: 64,
  stop: false,
  deterministic: false,
  colors: [{
    r: 215,
    g: 60,
    b: 234
  }, //#D73CEA
  {
    r: 145,
    g: 53,
    b: 224
  }, //#9135E0
  {
    r: 88,
    g: 72,
    b: 224
  }, //#5848F4
  {
    r: 37,
    g: 183,
    b: 255
  }, //#25B7FF
  {
    r: 89,
    g: 189,
    b: 0
  }, //#59BD00
  {
    r: 251,
    g: 172,
    b: 2
  }, //#FBAC02
  {
    r: 227,
    g: 37,
    b: 129
  } //#E32581
  ]
});

/**
 * @name Loader
 */

/**
 * Displays a large animated loader with an optional caption. Typical use cases: page loading animation, major action animation.
 */

var Loader = /*#__PURE__*/function (_PureComponent) {
  _inherits(Loader, _PureComponent);

  var _super = _createSuper(Loader);

  function Loader() {
    var _this;

    _classCallCheck(this, Loader);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "initLoader", function (el) {
      if (el) {
        _this.loader = new LoaderCore(el, _this.props);
      }
    });

    return _this;
  }

  _createClass(Loader, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.loader) {
        if (!prevProps.stop && this.props.stop) {
          this.loader.stopAnimation();
        } else if (prevProps.stop && !this.props.stop) {
          this.loader.startAnimation();
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.loader.destroy();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props;
          _this$props.message;
          _this$props.size;
          _this$props.colors;
          var dataTest = _this$props['data-test'];
          _this$props.stop;
          _this$props.deterministic;
          var restProps = _objectWithoutProperties(_this$props, ["message", "size", "colors", "data-test", "stop", "deterministic"]);

      return /*#__PURE__*/React.createElement("div", _extends({
        "data-test": joinDataTestAttributes('ring-loader', dataTest)
      }, restProps, {
        ref: this.initLoader
      }));
    }
  }]);

  return Loader;
}(PureComponent);

_defineProperty(Loader, "propTypes", {
  className: PropTypes.string,
  size: PropTypes.number,
  colors: PropTypes.array,
  message: PropTypes.string,
  'data-test': PropTypes.string,
  stop: PropTypes.bool,
  deterministic: PropTypes.bool
});

export default Loader;
