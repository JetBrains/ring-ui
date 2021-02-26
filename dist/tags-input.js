import { _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, l as _asyncToGenerator, c as _createClass } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { g as getEventKey } from './list-2403b1cd.js';
import Select from './select.js';
import TagsList from './tags-list.js';
import Caret from './caret.js';
import { m as memoize } from './memoize-ad2c954c.js';
import { r as rerenderHOC } from './rerender-hoc-bbc9cb21.js';
import styleInject from 'style-inject';
import 'react-virtualized/dist/es/List';
import 'react-virtualized/dist/es/AutoSizer';
import 'react-virtualized/dist/es/WindowScroller';
import 'react-virtualized/dist/es/CellMeasurer';
import 'util-deprecate';
import 'memoize-one';
import './data-tests-1a367745.js';
import './get-uid-bf3ab014.js';
import './schedule-raf-edeb21db.js';
import './dom-0ae85140.js';
import './shortcuts.js';
import 'combokeys';
import './sniffer-c9d1f40e.js';
import 'sniffr';
import './link.js';
import 'focus-visible';
import './clickableLink-3fc5662b.js';
import './avatar.js';
import './url-a3cbb96f.js';
import './checkbox.js';
import '@jetbrains/icons/checkmark';
import '@jetbrains/icons/remove-10px';
import './icon.js';
import '@jetbrains/icons/chevron-10px';
import '@jetbrains/icons/close';
import 'deep-equal';
import './dropdown.js';
import './button-c0bc1992.js';
import './theme-9a053da9.js';
import './popup-442f4003.js';
import 'react-dom';
import './tab-trap.js';
import './popup.target-9daf0591.js';
import './input.js';
import './global/fuzzy-highlight.js';
import '@jetbrains/icons/search';
import './loader-inline.js';
import 'conic-gradient';
import './text.js';
import './tag.js';

var css_248z = "/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.tags-input_tagsInput__8ZM_B {\n  padding-top: 2px;\n  padding-bottom: 2px;\n\n  white-space: normal;\n}\n\n.tags-input_tagsInputLegacyMode__WPPz_ {\n  padding-top: 0;\n  padding-bottom: 1px;\n\n  border: 1px solid #b8d1e5;\n\n  border: 1px solid var(--ring-borders-color);\n  background-color: #fff;\n  background-color: var(--ring-content-background-color)\n}\n\n.tags-input_tagsInputLegacyMode__WPPz_ .tags-input_tagsList__2EZb6 {\n    padding-top: 1px;\n\n    line-height: 20px;\n  }\n\n.tags-input_tagsInputLegacyMode__WPPz_ .tags-input_tag__3Y_MA {\n    margin-right: 2px;\n  }\n\n.tags-input_tagsInputDisabled__2CdwB {\n  pointer-events: none;\n\n  color: #999;\n\n  color: var(--ring-disabled-color)\n}\n\n.tags-input_tagsInputDisabled__2CdwB .tags-input_underline__ii8Ze {\n    border-bottom-style: dashed;\n  }\n\n.tags-input_tagsInputFocused__3irCL {\n  border-color: #008eff;\n  border-color: var(--ring-main-color);\n}\n\n.tags-input_tagsList__2EZb6 {\n  display: inline-block;\n\n  box-sizing: border-box;\n\n  width: 100%;\n  margin-bottom: -1px;\n\n  padding-left: 2px;\n\n  line-height: 22px;\n}\n\n.tags-input_tagsSelect__3ewdQ {\n  margin-bottom: -1px\n}\n\n.tags-input_tagsSelect__3ewdQ > div {\n    min-height: 20px;\n  }\n\n.tags-input_tagsSelect__3ewdQ input {\n    min-height: 20px;\n  }\n\n.tags-input_underline__ii8Ze {\n  height: 1px;\n\n  border-bottom: #b8d1e5 1px solid;\n\n  border-bottom: var(--ring-borders-color) 1px solid;\n}\n\n.tags-input_focusUnderline__3Voh4 {\n  width: 0;\n  height: 2px;\n\n  margin-top: -1px;\n\n  transition: width 0.15s ease-out;\n\n  background: #008eff;\n\n  background: var(--ring-main-color)\n}\n\n.tags-input_tagsInputFocused__3irCL .tags-input_focusUnderline__3Voh4 {\n    width: 100%\n}\n";
var styles = {"tagsInput":"tags-input_tagsInput__8ZM_B","tagsInputLegacyMode":"tags-input_tagsInputLegacyMode__WPPz_","tagsList":"tags-input_tagsList__2EZb6","tag":"tags-input_tag__3Y_MA","tagsInputDisabled":"tags-input_tagsInputDisabled__2CdwB","underline":"tags-input_underline__ii8Ze","tagsInputFocused":"tags-input_tagsInputFocused__3irCL","tagsSelect":"tags-input_tagsSelect__3ewdQ","focusUnderline":"tags-input_focusUnderline__3Voh4"};
styleInject(css_248z);

function noop() {}
/**
 * @name Tags Input
 */


var POPUP_VERTICAL_SHIFT = 2;

var TagsInput = /*#__PURE__*/function (_PureComponent) {
  _inherits(TagsInput, _PureComponent);

  var _super = _createSuper(TagsInput);

  function TagsInput() {
    var _this;

    _classCallCheck(this, TagsInput);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      tags: [],
      prevTags: null,
      suggestions: [],
      loading: true,
      focused: false,
      query: '',
      activeIndex: 0
    });

    _defineProperty(_assertThisInitialized(_this), "nodeRef", function (node) {
      _this.node = node;
    });

    _defineProperty(_assertThisInitialized(_this), "ngModelStateField", TagsInput.ngModelStateField);

    _defineProperty(_assertThisInitialized(_this), "focusInput", function () {
      _this.getInputNode().focus();
    });

    _defineProperty(_assertThisInitialized(_this), "addTag", function (tag) {
      var isUniqueTag = _this.state.tags.filter(function (item) {
        return tag.key === item.key;
      }).length === 0;

      _this.select.clear();

      _this.select.filterValue('');

      if (isUniqueTag) {
        _this.setState(function (prevState) {
          return {
            tags: prevState.tags.concat([tag])
          };
        });

        _this.props.onAddTag({
          tag: tag
        });

        _this.setActiveIndex();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "clickHandler", function (event) {
      if (event.target !== _this.node) {
        return;
      }

      _this.loadSuggestions(_this.getInputNode().value);

      _this.focusInput();
    });

    _defineProperty(_assertThisInitialized(_this), "filterExistingTags", function (suggestions) {
      var tagsMap = new Map(_this.state.tags.map(function (tag) {
        return [tag.key, tag];
      }));
      return suggestions.filter(function (suggestion) {
        return !tagsMap.has(suggestion.key);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "loadSuggestions", function () {
      var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return _this.setState({
        loading: true,
        query: query
      }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var allSuggestions, suggestions;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                allSuggestions = _this.props.dataSource({
                  query: query
                });

                if (!(typeof allSuggestions.then === 'function')) {
                  _context.next = 6;
                  break;
                }

                _context.next = 5;
                return allSuggestions;

              case 5:
                allSuggestions = _context.sent;

              case 6:
                suggestions = _this.filterExistingTags(allSuggestions);

                if (_this.node && query === _this.state.query) {
                  _this.setState({
                    suggestions: suggestions,
                    loading: false
                  });
                }

                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](0);

                _this.setState({
                  loading: false
                });

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 10]]);
      })));
    });

    _defineProperty(_assertThisInitialized(_this), "_focusHandler", function () {
      _this.setActiveIndex(null);

      _this.setState({
        focused: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_blurHandler", function () {
      _this.setState({
        focused: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "selectTag", function (moveForward) {
      var activeIndex = typeof _this.state.activeIndex === 'number' ? _this.state.activeIndex : _this.state.tags.length + 1;
      var newActiveIndex = activeIndex + (moveForward ? 1 : -1);

      if (newActiveIndex >= _this.state.tags.length) {
        newActiveIndex = _this.state.tags.length - 1;
      } else if (newActiveIndex < 0) {
        newActiveIndex = 0;
      }

      if (_this.state.activeIndex !== newActiveIndex) {
        _this.setActiveIndex(newActiveIndex);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleKeyDown", function (event) {
      var key = getEventKey(event);

      var isInputFocused = function isInputFocused() {
        return event.target.matches(_this.getInputNode().tagName);
      };

      if (key === ' ' && _this.props.allowAddNewTags) {
        event.stopPropagation();

        var value = _this.getInputNode().value;

        if (value !== '') {
          _this.handleTagCreation(value);
        }

        return true;
      }

      if (_this.select._popup.isVisible()) {
        return true;
      }

      if (key === 'ArrowLeft') {
        if (_this.getInputNode() && _this.caret.getPosition() > 0) {
          return true;
        }

        _this.selectTag();

        return false;
      }

      if (key === 'ArrowRight' && !isInputFocused()) {
        if (_this.state.activeIndex === _this.state.tags.length - 1) {
          if (!_this.props.disabled) {
            _this.getInputNode().focus();

            _this.setActiveIndex();
          }
        } else {
          _this.selectTag(true);
        }

        return false;
      }

      if (!_this.props.disabled) {
        if (key === 'Backspace' && !_this.getInputNode().value) {
          event.preventDefault();
          var tagsLength = _this.state.tags.length;

          _this.select._hidePopup(true); // otherwise confirmation may be overlapped by popup


          _this.onRemoveTag(_this.state.tags[tagsLength - 1]);

          return false;
        }

        if ((key === 'Delete' || key === 'Backspace') && _this.state.tags[_this.state.activeIndex]) {
          _this.onRemoveTag(_this.state.tags[_this.state.activeIndex]).then(function () {
            return _this.selectTag(true);
          });

          return false;
        }
      }

      return true;
    });

    _defineProperty(_assertThisInitialized(_this), "handleClick", memoize(function (tag) {
      return function () {
        _this.setActiveIndex(_this.state.tags.indexOf(tag));
      };
    }));

    _defineProperty(_assertThisInitialized(_this), "handleRemove", memoize(function (tag) {
      return function () {
        return _this.onRemoveTag(tag);
      };
    }));

    _defineProperty(_assertThisInitialized(_this), "handleTagCreation", function (label) {
      _this.addTag({
        key: label,
        label: label
      });
    });

    _defineProperty(_assertThisInitialized(_this), "selectRef", function (el) {
      _this.select = el;
    });

    return _this;
  }

  _createClass(TagsInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.autoOpen && !this.props.disabled) {
        this.focusInput();
        this.loadSuggestions();

        this.select._showPopup();
      }
    }
  }, {
    key: "getInputNode",
    value: function getInputNode() {
      if (!this.input) {
        this.input = this.select.filter;
        this.caret = new Caret(this.input);
      }

      return this.input;
    }
  }, {
    key: "setActiveIndex",
    value: function setActiveIndex(activeIndex) {
      this.setState({
        activeIndex: activeIndex
      });
    }
  }, {
    key: "onRemoveTag",
    value: function onRemoveTag(tagToRemove) {
      var _this2 = this;

      return Promise.resolve(this.props.onRemoveTag({
        tag: tagToRemove
      })).then(function () {
        var tags = _this2.state.tags.filter(function (tag) {
          return tag !== tagToRemove;
        });

        if (_this2.node) {
          _this2.setState({
            tags: tags
          });

          _this2.focusInput();
        }

        return tags;
      }, this.focusInput);
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames;

      var _this$state = this.state,
          focused = _this$state.focused,
          tags = _this$state.tags,
          activeIndex = _this$state.activeIndex;
      var _this$props = this.props,
          legacyMode = _this$props.legacyMode,
          disabled = _this$props.disabled,
          canNotBeEmpty = _this$props.canNotBeEmpty,
          allowAddNewTags = _this$props.allowAddNewTags,
          filter = _this$props.filter;
      var classes = classNames(styles.tagsInput, (_classNames = {}, _defineProperty(_classNames, styles.tagsInputDisabled, disabled), _defineProperty(_classNames, styles.tagsInputFocused, focused), _defineProperty(_classNames, styles.tagsInputLegacyMode, legacyMode), _classNames), this.props.className);
      return /*#__PURE__*/React.createElement("div", {
        // it transfers focus to input
        role: "presentation",
        className: classes,
        onKeyDown: this.handleKeyDown,
        onClick: this.clickHandler,
        ref: this.nodeRef
      }, /*#__PURE__*/React.createElement(TagsList, {
        tags: tags,
        activeIndex: activeIndex,
        disabled: disabled,
        canNotBeEmpty: canNotBeEmpty,
        handleRemove: this.handleRemove,
        className: styles.tagsList,
        tagClassName: styles.tag,
        handleClick: this.handleClick
      }, /*#__PURE__*/React.createElement(Select, {
        ref: this.selectRef,
        size: Select.Size.AUTO,
        type: Select.Type.INPUT_WITHOUT_CONTROLS,
        inputPlaceholder: this.props.placeholder,
        data: this.state.suggestions,
        className: classNames(styles.tagsSelect),
        onSelect: this.addTag,
        onFocus: this._focusHandler,
        onBlur: this._blurHandler,
        renderOptimization: this.props.renderOptimization,
        add: allowAddNewTags ? {
          prefix: 'Add new tag'
        } : undefined,
        onAdd: allowAddNewTags ? this.handleTagCreation : undefined,
        filter: filter,
        maxHeight: this.props.maxPopupHeight,
        minWidth: this.props.minPopupWidth,
        top: POPUP_VERTICAL_SHIFT,
        loading: this.state.loading,
        onFilter: this.loadSuggestions,
        onBeforeOpen: this.loadSuggestions,
        onKeyDown: this.handleKeyDown,
        disabled: this.props.disabled,
        loadingMessage: this.props.loadingMessage,
        notFoundMessage: this.props.notFoundMessage
      })), !legacyMode && /*#__PURE__*/React.createElement("div", {
        className: styles.underline
      }), !legacyMode && /*#__PURE__*/React.createElement("div", {
        className: styles.focusUnderline
      }));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(_ref2, _ref3) {
      var tags = _ref2.tags;
      var prevTags = _ref3.prevTags;
      var nextState = {
        prevTags: tags
      };

      if (tags != null && tags !== prevTags) {
        Object.assign(nextState, {
          tags: tags,
          activeIndex: tags.length
        });
      }

      return nextState;
    }
  }]);

  return TagsInput;
}(PureComponent);

_defineProperty(TagsInput, "propTypes", {
  className: PropTypes.string,
  tags: PropTypes.array,

  /**
   * Datasource should return array(or promise) of suggestions.
   * Each suggestion should contain key and label fields.
   * DataSource should handle caching and response racing (when later request
   * responded earlier) by himself.
   */
  dataSource: PropTypes.func,
  onAddTag: PropTypes.func,
  onRemoveTag: PropTypes.func,
  customTagComponent: function customTagComponent(props, propName, componentName) {
    if (props[propName] && !props[propName].prototype instanceof Component) {
      return new Error("Invalid prop ".concat(propName, " supplied to ").concat(componentName, ". Validation failed."));
    }

    return null;
  },
  maxPopupHeight: PropTypes.number,
  minPopupWidth: PropTypes.number,
  placeholder: PropTypes.string,
  canNotBeEmpty: PropTypes.bool,
  disabled: PropTypes.bool,
  autoOpen: PropTypes.bool,
  renderOptimization: PropTypes.bool,
  legacyMode: PropTypes.bool,
  filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({
    fn: PropTypes.func
  })]),
  loadingMessage: PropTypes.string,
  notFoundMessage: PropTypes.string,
  allowAddNewTags: PropTypes.bool
});

_defineProperty(TagsInput, "defaultProps", {
  dataSource: noop,
  onAddTag: noop,
  onRemoveTag: noop,
  customTagComponent: null,
  maxPopupHeight: 500,
  minPopupWidth: 360,
  canNotBeEmpty: false,
  disabled: false,
  autoOpen: false,
  renderOptimization: true,
  legacyMode: false,
  allowAddNewTags: false,
  filter: {
    fn: function fn() {
      return true;
    }
  },
  placeholder: 'Select an option'
});

_defineProperty(TagsInput, "ngModelStateField", 'tags');
var RerenderableTagsInput = rerenderHOC(TagsInput);

export default TagsInput;
export { RerenderableTagsInput };
