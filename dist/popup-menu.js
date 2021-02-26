import { e as _objectWithoutProperties, _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, c as _createClass, i as _objectSpread2, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React from 'react';
import PropTypes from 'prop-types';
import { P as Popup } from './popup-442f4003.js';
import { L as List } from './list-2403b1cd.js';
import 'react-dom';
import 'classnames';
import './get-uid-bf3ab014.js';
import './schedule-raf-edeb21db.js';
import './dom-0ae85140.js';
import './shortcuts.js';
import 'combokeys';
import './sniffer-c9d1f40e.js';
import 'sniffr';
import './data-tests-1a367745.js';
import './tab-trap.js';
import 'style-inject';
import './popup.target-9daf0591.js';
import 'react-virtualized/dist/es/List';
import 'react-virtualized/dist/es/AutoSizer';
import 'react-virtualized/dist/es/WindowScroller';
import 'react-virtualized/dist/es/CellMeasurer';
import 'util-deprecate';
import 'memoize-one';
import './memoize-ad2c954c.js';
import './link.js';
import 'focus-visible';
import './clickableLink-3fc5662b.js';
import './avatar.js';
import './url-a3cbb96f.js';
import './checkbox.js';
import '@jetbrains/icons/checkmark';
import '@jetbrains/icons/remove-10px';
import './icon.js';

var _ref = Popup.propTypes || {};
    _ref.children;
    var popupPropTypes = _objectWithoutProperties(_ref, ["children"]);
/**
 * @name Popup Menu
 */


var PopupMenu = /*#__PURE__*/function (_Popup) {
  _inherits(PopupMenu, _Popup);

  var _super = _createSuper(PopupMenu);

  function PopupMenu() {
    var _this;

    _classCallCheck(this, PopupMenu);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "onSelect", function (item, event) {
      if (_this.props.closeOnSelect) {
        _this._onCloseAttempt(event);
      }

      _this.props.onSelect(item, event);
    });

    _defineProperty(_assertThisInitialized(_this), "listRef", function (el) {
      _this.list = el;
    });

    return _this;
  }

  _createClass(PopupMenu, [{
    key: "getInternalContent",

    /** @override */
    value: function getInternalContent() {
      var _this$props = this.props;
          _this$props.className;
          var props = _objectWithoutProperties(_this$props, ["className"]);

      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(List, _extends({
        ref: this.listRef
      }, props, {
        maxHeight: this.popup && this.popup.style.maxHeight,
        shortcuts: this.shouldUseShortcuts(),
        onSelect: this.onSelect
      })));
    }
  }]);

  return PopupMenu;
}(Popup);

_defineProperty(PopupMenu, "isItemType", List.isItemType);

_defineProperty(PopupMenu, "ListProps", List.ListProps);

_defineProperty(PopupMenu, "propTypes", _objectSpread2(_objectSpread2(_objectSpread2({}, popupPropTypes), List.propTypes), {}, {
  closeOnSelect: PropTypes.bool
}));

_defineProperty(PopupMenu, "defaultProps", _objectSpread2(_objectSpread2(_objectSpread2({}, List.defaultProps), Popup.defaultProps), {}, {
  renderOptimization: false,
  closeOnSelect: false
}));
var ListProps = List.ListProps;

export default PopupMenu;
export { ListProps };
