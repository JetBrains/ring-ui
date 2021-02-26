import { d as _defineProperty, i as _objectSpread2, _ as _inherits, a as _createSuper, b as _classCallCheck, g as _assertThisInitialized, c as _createClass, e as _objectWithoutProperties, f as _extends, k as _toConsumableArray } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

var composeRefs = (function () {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }

  return function (value) {
    return refs.forEach(function (ref) {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
});

function focusSensorHOC(ComposedComponent) {
  var _class, _temp;

  return _temp = _class = /*#__PURE__*/function (_Component) {
    _inherits(FocusSensor, _Component);

    var _super = _createSuper(FocusSensor);

    function FocusSensor() {
      var _this;

      _classCallCheck(this, FocusSensor);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "state", {
        focused: _this.props.focused
      });

      _defineProperty(_assertThisInitialized(_this), "_skipNextCapture", false);

      _defineProperty(_assertThisInitialized(_this), "onRefUpdate", function (node) {
        if (node) {
          _this.node = node;
        }
      });

      _defineProperty(_assertThisInitialized(_this), "onFocusCapture", function (_ref) {
        var target = _ref.target;

        if (_this._skipNextCapture) {
          _this._skipNextCapture = false;
          return;
        }

        var focused = _this.node.contains(target);

        if (focused && !_this.state.focused) {
          _this.setState({
            focused: true
          });

          _this.props.onFocus();
        }
      });

      _defineProperty(_assertThisInitialized(_this), "onBlurCapture", function (_ref2) {
        var target = _ref2.target;

        var _assertThisInitialize = _assertThisInitialized(_this),
            focused = _assertThisInitialize.state.focused,
            node = _assertThisInitialize.node;

        if (focused) {
          setTimeout(function () {
            var blurred = node.contains(target) && !node.contains(document.activeElement);

            if (blurred) {
              _this.setState({
                focused: false
              });

              _this.props.onBlur();
            }
          }, 1);
        }
      });

      _defineProperty(_assertThisInitialized(_this), "onFocusRestore", function () {
        _this._skipNextCapture = true;

        _this.node.focus();
      });

      _defineProperty(_assertThisInitialized(_this), "onFocusReset", function () {
        _this.node.blur();
      });

      return _this;
    }

    _createClass(FocusSensor, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var autofocus = this.props.autofocus,
            node = this.node;
        node.setAttribute('tabindex', '0');
        node.style.outline = 'none';
        document.addEventListener('focus', this.onFocusCapture, true);
        document.addEventListener('blur', this.onBlurCapture, true);

        if (autofocus) {
          node.focus();
        }
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        var focused = this.props.focused;

        if (focused && !prevProps.focused) {
          this.onFocusRestore();
        } else if (!focused && prevProps.focused) {
          this.onFocusReset();
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        document.removeEventListener('focus', this.onFocusCapture, true);
        document.removeEventListener('blur', this.onBlurCapture, true);
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props;
            _this$props.autofocus;
            _this$props.focused;
            _this$props.onFocus;
            _this$props.onBlur;
            var innerRef = _this$props.innerRef,
            rest = _objectWithoutProperties(_this$props, ["autofocus", "focused", "onFocus", "onBlur", "innerRef"]);

        return /*#__PURE__*/React.createElement(ComposedComponent, _extends({}, rest, {
          innerRef: composeRefs(innerRef, this.onRefUpdate),
          focused: this.state.focused,
          onFocusReset: this.onFocusReset,
          onFocusRestore: this.onFocusRestore
        }));
      }
    }]);

    return FocusSensor;
  }(Component), _defineProperty(_class, "propTypes", _objectSpread2(_objectSpread2({}, ComposedComponent.propTypes), {}, {
    focused: PropTypes.bool,
    autofocus: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
  })), _defineProperty(_class, "defaultProps", _objectSpread2(_objectSpread2({}, ComposedComponent.defaultProps), {}, {
    focused: false,
    autofocus: false,
    onFocus: function onFocus() {},
    onBlur: function onBlur() {}
  })), _temp;
}

var Selection = /*#__PURE__*/function () {
  function Selection() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data,
        _ref$selected = _ref.selected,
        selected = _ref$selected === void 0 ? new Set() : _ref$selected,
        _ref$focused = _ref.focused,
        focused = _ref$focused === void 0 ? null : _ref$focused,
        _ref$getKey = _ref.getKey,
        getKey = _ref$getKey === void 0 ? function (item) {
      return item.id;
    } : _ref$getKey,
        _ref$getChildren = _ref.getChildren,
        getChildren = _ref$getChildren === void 0 ? function () {
      return [];
    } : _ref$getChildren,
        _ref$isItemSelectable = _ref.isItemSelectable,
        isItemSelectable = _ref$isItemSelectable === void 0 ? function () {
      return true;
    } : _ref$isItemSelectable;

    _classCallCheck(this, Selection);

    this._rawData = data;
    this._getChildren = getChildren;
    this._data = this._buildData(data);
    this._selected = selected;
    this._focused = focused;
    this._getKey = getKey;
    this._isItemSelectable = isItemSelectable;
  }

  _createClass(Selection, [{
    key: "_buildData",
    value: function _buildData(data) {
      return new Set(data);
    }
  }, {
    key: "_buildSelected",
    value: function _buildSelected(data, selected) {
      return new Set(selected);
    }
  }, {
    key: "cloneWith",
    value: function cloneWith(_ref2) {
      var _this = this;

      var data = _ref2.data,
          selected = _ref2.selected,
          focused = _ref2.focused;
      var newData = data || this._rawData;
      var newSelected;

      if (data && !selected) {
        newSelected = new Set(_toConsumableArray(this._buildData(newData)).filter(function (item) {
          return _toConsumableArray(_this._selected).some(function (it) {
            return _this._getKey(item) === _this._getKey(it);
          });
        }));
        newSelected = this._buildSelected(this._buildData(newData), newSelected);
      } else if (selected) {
        newSelected = selected;
      } else {
        newSelected = this._selected;
      }

      newSelected = new Set(_toConsumableArray(newSelected).filter(function (item) {
        return _this._isItemSelectable(item);
      }));

      var cloneFocus = function cloneFocus() {
        return _toConsumableArray(_this._buildData(data)).filter(function (item) {
          return _this._focused && _this._getKey(item) === _this._getKey(_this._focused);
        })[0];
      };

      var newFocused = focused === undefined ? this._focused : focused;
      return new this.constructor({
        data: newData,
        selected: newSelected,
        focused: data && !focused ? cloneFocus() : newFocused,
        getKey: this._getKey,
        getChildren: this._getChildren,
        isItemSelectable: this._isItemSelectable
      });
    }
  }, {
    key: "focus",
    value: function focus(value) {
      return this.cloneWith({
        focused: value
      });
    }
  }, {
    key: "moveUp",
    value: function moveUp() {
      var focused = this._focused;

      var data = _toConsumableArray(this._data);

      if (!focused) {
        return this.cloneWith({
          focused: data[data.length - 1]
        });
      }

      var nextItem = data[data.indexOf(focused) - 1];

      if (nextItem) {
        return this.cloneWith({
          focused: nextItem
        });
      }

      return undefined;
    }
  }, {
    key: "moveDown",
    value: function moveDown() {
      var focused = this._focused;

      var data = _toConsumableArray(this._data);

      if (!focused) {
        return this.cloneWith({
          focused: data[0]
        });
      }

      var nextItem = data[data.indexOf(focused) + 1];

      if (nextItem) {
        return this.cloneWith({
          focused: nextItem
        });
      }

      return undefined;
    }
  }, {
    key: "moveStart",
    value: function moveStart() {
      var data = _toConsumableArray(this._data);

      if (data.length) {
        return this.cloneWith({
          focused: data[0]
        });
      }

      return undefined;
    }
  }, {
    key: "moveEnd",
    value: function moveEnd() {
      var data = _toConsumableArray(this._data);

      if (data.length) {
        return this.cloneWith({
          focused: data.pop()
        });
      }

      return undefined;
    }
  }, {
    key: "select",
    value: function select() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._focused;

      if (!value || !this._isItemSelectable(value)) {
        return this;
      }

      var selected = new Set(this._selected);
      selected.add(value);
      return this.cloneWith({
        selected: selected
      });
    }
  }, {
    key: "deselect",
    value: function deselect() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._focused;

      if (!value || !this._isItemSelectable(value)) {
        return this;
      }

      var selected = new Set(this._selected);
      selected.delete(value);
      return this.cloneWith({
        selected: selected
      });
    }
  }, {
    key: "toggleSelection",
    value: function toggleSelection() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._focused;

      if (this.isSelected(value)) {
        return this.deselect(value);
      } else {
        return this.select(value);
      }
    }
  }, {
    key: "selectAll",
    value: function selectAll() {
      return this.cloneWith({
        selected: _toConsumableArray(this._data)
      });
    }
  }, {
    key: "resetFocus",
    value: function resetFocus() {
      return this.cloneWith({
        focused: null
      });
    }
  }, {
    key: "resetSelection",
    value: function resetSelection() {
      return this.cloneWith({
        selected: new Set()
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      return this.resetFocus().resetSelection();
    }
  }, {
    key: "isFocused",
    value: function isFocused(value) {
      return this._focused === value;
    }
  }, {
    key: "isSelected",
    value: function isSelected(value) {
      return this._selected.has(value);
    }
  }, {
    key: "getFocused",
    value: function getFocused() {
      return this._focused;
    }
  }, {
    key: "getSelected",
    value: function getSelected() {
      return new Set(this._selected);
    }
  }, {
    key: "getActive",
    value: function getActive() {
      if (this._selected.size) {
        return new Set(this._selected);
      } else if (this._focused) {
        return new Set([this._focused]);
      } else {
        return new Set();
      }
    }
  }]);

  return Selection;
}();

function selectionShortcutsHOC(ComposedComponent) {
  var _class, _temp;

  return _temp = _class = /*#__PURE__*/function (_PureComponent) {
    _inherits(SelectionShortcuts, _PureComponent);

    var _super = _createSuper(SelectionShortcuts);

    function SelectionShortcuts() {
      var _this;

      _classCallCheck(this, SelectionShortcuts);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "onUpPress", function () {
        var _this$props = _this.props,
            selection = _this$props.selection,
            onSelect = _this$props.onSelect;
        var newSelection = selection.moveUp();

        if (newSelection) {
          onSelect(newSelection);
        }

        return false;
      });

      _defineProperty(_assertThisInitialized(_this), "onDownPress", function () {
        var _this$props2 = _this.props,
            selection = _this$props2.selection,
            onSelect = _this$props2.onSelect;
        var newSelection = selection.moveDown();

        if (newSelection) {
          onSelect(newSelection);
        }

        return false;
      });

      _defineProperty(_assertThisInitialized(_this), "onShiftKeyDown", function () {
        var selection = _this.props.selection;

        if (selection.isSelected(selection.getFocused())) {
          _this.shiftSelectionMode = 'deletion';
        } else {
          _this.shiftSelectionMode = 'addition';
        }
      });

      _defineProperty(_assertThisInitialized(_this), "shiftSelect", function (selection) {
        if (_this.shiftSelectionMode === 'addition') {
          return selection.select();
        } else {
          return selection.deselect();
        }
      });

      _defineProperty(_assertThisInitialized(_this), "onShiftUpPress", function (e) {
        e.preventDefault();
        var _this$props3 = _this.props,
            selectable = _this$props3.selectable,
            selection = _this$props3.selection,
            onSelect = _this$props3.onSelect;

        if (!selectable) {
          return;
        }

        var newSelection = _this.shiftSelect(selection);

        var newMovedSelection = newSelection.moveUp();

        if (newMovedSelection) {
          onSelect(newMovedSelection);
        } else {
          onSelect(newSelection);
        }
      });

      _defineProperty(_assertThisInitialized(_this), "onShiftDownPress", function (e) {
        e.preventDefault();
        var _this$props4 = _this.props,
            selectable = _this$props4.selectable,
            selection = _this$props4.selection,
            onSelect = _this$props4.onSelect;

        if (!selectable) {
          return;
        }

        var newSelection = _this.shiftSelect(selection);

        var newMovedSelection = newSelection.moveDown();

        if (newMovedSelection) {
          onSelect(newMovedSelection);
        } else {
          onSelect(newSelection);
        }
      });

      _defineProperty(_assertThisInitialized(_this), "onHomePress", function () {
        var _this$props5 = _this.props,
            selection = _this$props5.selection,
            onSelect = _this$props5.onSelect;
        var newSelection = selection.moveStart();

        if (newSelection) {
          onSelect(newSelection);
        }

        return false;
      });

      _defineProperty(_assertThisInitialized(_this), "onEndPress", function () {
        var _this$props6 = _this.props,
            selection = _this$props6.selection,
            onSelect = _this$props6.onSelect;
        var newSelection = selection.moveEnd();

        if (newSelection) {
          onSelect(newSelection);
        }

        return false;
      });

      _defineProperty(_assertThisInitialized(_this), "onSpacePress", function () {
        var _this$props7 = _this.props,
            selectable = _this$props7.selectable,
            selection = _this$props7.selection,
            onSelect = _this$props7.onSelect;

        if (!selectable) {
          return true;
        }

        onSelect(selection.toggleSelection());
        return false;
      });

      _defineProperty(_assertThisInitialized(_this), "onEscPress", function () {
        var _this$props8 = _this.props,
            selection = _this$props8.selection,
            onSelect = _this$props8.onSelect;
        onSelect(selection.reset()); //this.restoreFocusWithoutScroll();
      });

      _defineProperty(_assertThisInitialized(_this), "onCmdAPress", function () {
        var _this$props9 = _this.props,
            selectable = _this$props9.selectable,
            selection = _this$props9.selection,
            onSelect = _this$props9.onSelect;

        if (!selectable) {
          return true;
        }

        onSelect(selection.selectAll());
        return false;
      });

      _defineProperty(_assertThisInitialized(_this), "shortcutsMap", {
        up: _this.onUpPress,
        down: _this.onDownPress,
        shift: _this.onShiftKeyDown,
        'shift+up': _this.onShiftUpPress,
        'shift+down': _this.onShiftDownPress,
        home: _this.onHomePress,
        end: _this.onEndPress,
        space: _this.onSpacePress,
        esc: _this.onEscPress,
        'command+a': _this.onCmdAPress,
        'ctrl+a': _this.onCmdAPress
      });

      return _this;
    }

    _createClass(SelectionShortcuts, [{
      key: "render",
      value: function render() {
        var _this$props10 = this.props,
            selection = _this$props10.selection,
            selectable = _this$props10.selectable,
            onSelect = _this$props10.onSelect;
        return /*#__PURE__*/React.createElement(ComposedComponent, _extends({}, this.props, {
          selection: selection,
          selectable: selectable,
          onSelect: onSelect,
          shortcutsMap: _objectSpread2(_objectSpread2({}, this.shortcutsMap), this.props.shortcuts)
        }));
      }
    }]);

    return SelectionShortcuts;
  }(PureComponent), _defineProperty(_class, "propTypes", _objectSpread2(_objectSpread2({}, ComposedComponent.propTypes), {}, {
    selection: PropTypes.instanceOf(Selection).isRequired,
    selectable: PropTypes.bool,
    onSelect: PropTypes.func,
    shortcuts: PropTypes.object
  })), _defineProperty(_class, "defaultProps", _objectSpread2(_objectSpread2({}, ComposedComponent.defaultProps), {}, {
    selectable: true,
    onSelect: function onSelect() {},
    shortcuts: {}
  })), _temp;
}

function disableHoverHOC(ComposedComponent) {
  var _class, _temp;

  return _temp = _class = /*#__PURE__*/function (_PureComponent) {
    _inherits(DisableHover, _PureComponent);

    var _super = _createSuper(DisableHover);

    function DisableHover() {
      var _this;

      _classCallCheck(this, DisableHover);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "state", {
        disabledHover: false
      });

      _defineProperty(_assertThisInitialized(_this), "onMouseMove", function () {
        if (_this.state.disabledHover) {
          _this.setState({
            disabledHover: false
          });
        }
      });

      _defineProperty(_assertThisInitialized(_this), "onKeyDown", function (e) {
        var metaKeys = [16, 17, 18, 19, 20, 91]; // eslint-disable-line no-magic-numbers

        if (!_this.state.disabledHover && !metaKeys.includes(e.keyCode)) {
          _this.setState({
            disabledHover: true
          });
        }
      });

      return _this;
    }

    _createClass(DisableHover, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('keydown', this.onKeyDown, true);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('keydown', this.onKeyDown, true);
      }
    }, {
      key: "render",
      value: function render() {
        return /*#__PURE__*/React.createElement(ComposedComponent, _extends({}, this.props, {
          disabledHover: this.state.disabledHover
        }));
      }
    }]);

    return DisableHover;
  }(PureComponent), _defineProperty(_class, "propTypes", ComposedComponent.propTypes), _defineProperty(_class, "defaultProps", ComposedComponent.defaultProps), _temp;
}

export { Selection as S, composeRefs as c, disableHoverHOC as d, focusSensorHOC as f, selectionShortcutsHOC as s };
