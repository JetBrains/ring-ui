import { c as _createClass, b as _classCallCheck, _ as _inherits, a as _createSuper, d as _defineProperty, g as _assertThisInitialized, e as _objectWithoutProperties } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'just-debounce-it';
import classNames from 'classnames';
import deepEqual from 'deep-equal';
import searchIcon from '@jetbrains/icons/search';
import closeIcon from '@jetbrains/icons/close';
import { g as getUID } from './get-uid-bf3ab014.js';
import { j as joinDataTestAttributes } from './data-tests-1a367745.js';
import { p as preventDefault, g as getRect } from './dom-0ae85140.js';
import Caret from './caret.js';
import ContentEditable from './contenteditable.js';
import PopupMenu from './popup-menu.js';
import LoaderInline from './loader-inline.js';
import Shortcuts from './shortcuts.js';
import { r as rerenderHOC } from './rerender-hoc-bbc9cb21.js';
import { T as Theme } from './theme-9a053da9.js';
import { B as Button } from './button-c0bc1992.js';
import { L as List } from './list-2403b1cd.js';
import styleInject from 'style-inject';
import 'react-dom/server';
import './popup-442f4003.js';
import 'react-dom';
import './schedule-raf-edeb21db.js';
import './tab-trap.js';
import './popup.target-9daf0591.js';
import 'combokeys';
import './sniffer-c9d1f40e.js';
import 'sniffr';
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
import 'conic-gradient';
import '@jetbrains/icons/chevron-10px';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.query-assist_light__25Zf6.query-assist_queryAssist__BCKN2 {\n    height: 24px;\n\n    background: #fff;\n\n    background: var(--ring-content-background-color);\n  }\n\n.query-assist_light__25Zf6 .query-assist_input__2-mCm {\n    height: 22px;\n\n    box-shadow: 0 0 0 1px #b8d1e5;\n\n    box-shadow: 0 0 0 1px var(--ring-borders-color)\n\n    /* stylelint-disable-next-line selector-max-specificity */\n  }\n\n.query-assist_light__25Zf6 .query-assist_input__2-mCm:not([disabled]):active,\n    \n    .query-assist_light__25Zf6 .query-assist_input__2-mCm:not([disabled]):focus {\n      border-color: transparent;\n      box-shadow: 0 0 0 1px #008eff;\n      box-shadow: 0 0 0 1px var(--ring-main-color);\n    }\n\n.query-assist_light__25Zf6 .query-assist_placeholder__b0Fjy {\n    color: #737577;\n    color: var(--ring-secondary-color);\n  }\n\n.query-assist_light__25Zf6 .query-assist_letter-text__1zAfA {\n    color: #cc8b00;\n    color: var(--ring-warning-color);\n  }\n\n.query-assist_light__25Zf6 .query-assist_letterDefault__2RDdK,\n  .query-assist_light__25Zf6 .query-assist_letter-field-name__260nx {\n    color: #1f2326;\n    color: var(--ring-text-color);\n  }\n\n.query-assist_light__25Zf6 .query-assist_letter-field-value__fv9zG {\n    color: #0f5b99;\n    color: var(--ring-link-color);\n  }\n\n.query-assist_light__25Zf6 .query-assist_letter-operator__AYpYz {\n    color: #737577;\n    color: var(--ring-secondary-color);\n  }\n\n.query-assist_light__25Zf6 .query-assist_letter-error__3NPpW {\n    padding-bottom: 1px;\n\n    border-bottom: 1px solid #db5860;\n\n    border-bottom: 1px solid var(--ring-icon-error-color);\n  }\n\n.query-assist_light__25Zf6 .query-assist_iconInner__39nC6 {\n    color: #999;\n    color: var(--ring-icon-secondary-color);\n  }\n\n.query-assist_light__25Zf6 .query-assist_highlight__s5mVC {\n    font-weight: 600;\n  }\n\n.query-assist_light__25Zf6 .query-assist_service__2eFuT {\n    color: #737577;\n    color: var(--ring-secondary-color);\n  }\n\n.query-assist_dark__21alU.query-assist_queryAssist__BCKN2 {\n    height: 32px;\n\n    font-size: 16px;\n  }\n\n.query-assist_dark__21alU .query-assist_input__2-mCm {\n    top: 0;\n\n    height: 30px;\n\n    color: #669ecc;\n\n    color: var(--ring-search-color);\n\n    border-top-width: 5px;\n    background: #002a4d;\n    background: var(--ring-dark-selected-background-color)\n  }\n\n.query-assist_dark__21alU .query-assist_input__2-mCm:active,\n    .query-assist_dark__21alU .query-assist_input__2-mCm:focus {\n      border-color: #000;\n      border-color: var(--ring-navigation-background-color);\n\n      background-color: #000;\n\n      background-color: var(--ring-navigation-background-color);\n    }\n\n.query-assist_dark__21alU .query-assist_placeholder__b0Fjy {\n    top: 6px;\n\n    color: #b8d1e5;\n\n    color: var(--ring-icon-color)\n  }\n\n.query-assist_dark__21alU .query-assist_placeholder__b0Fjy :-ms-input-placeholder, :root .query-assist_dark__21alU .query-assist_placeholder__b0Fjy {\n      top: 7px\n  }\n\n@supports (-ms-ime-align:auto) {\n      .query-assist_dark__21alU .query-assist_placeholder__b0Fjy {\n        top: 7px;\n      }\n    }\n\n.query-assist_dark__21alU .query-assist_letter-text__1zAfA {\n    color: #cc8b00;\n    color: var(--ring-warning-color);\n  }\n\n.query-assist_dark__21alU .query-assist_letterDefault__2RDdK,\n  .query-assist_dark__21alU .query-assist_letter-field-name__260nx {\n    color: #669ecc;\n    color: var(--ring-search-color);\n  }\n\n.query-assist_dark__21alU .query-assist_letter-field-value__fv9zG {\n    color: #fff;\n    color: var(--ring-dark-text-color);\n  }\n\n.query-assist_dark__21alU .query-assist_letter-operator__AYpYz {\n    color: #737577;\n    color: var(--ring-secondary-color);\n  }\n\n.query-assist_dark__21alU .query-assist_letter-error__3NPpW {\n    padding-bottom: 1px;\n\n    border-bottom: 1px solid #db5860;\n\n    border-bottom: 1px solid var(--ring-icon-error-color);\n  }\n\n.query-assist_dark__21alU .query-assist_icon__zOwqw {\n    top: 8px;\n  }\n\n.query-assist_dark__21alU .query-assist_iconInner__39nC6 {\n    color: #b8d1e5;\n    color: var(--ring-icon-color);\n  }\n\n.query-assist_dark__21alU .query-assist_loader__1I9GT {\n    top: 6px;\n  }\n\n.query-assist_dark__21alU .query-assist_highlight__s5mVC {\n    font-weight: 600;\n  }\n\n.query-assist_dark__21alU .query-assist_service__2eFuT {\n    color: #737577;\n    color: var(--ring-secondary-color);\n  }\n\n.query-assist_dark__21alU .query-assist_actions__ADTJ- {\n    background-color: #002a4d;\n    background-color: var(--ring-dark-selected-background-color);\n  }\n\n.query-assist_dark__21alU {\n\n  /* stylelint-disable-next-line selector-max-specificity */\n}\n\n.query-assist_dark__21alU .query-assist_input__2-mCm:focus ~ .query-assist_actions__ADTJ- {\n    background-color: #000;\n    background-color: var(--ring-navigation-background-color);\n  }\n\n.query-assist_queryAssist__BCKN2 {\n\n  position: relative;\n\n  box-sizing: border-box;\n\n  line-height: normal;\n}\n\n.query-assist_input__2-mCm {\n  position: relative;\n\n  top: 1px;\n  left: 1px;\n\n  overflow: hidden;\n\n  box-sizing: border-box;\n\n  width: calc(100% - 2px);\n  margin: 0;\n\n  padding: 2px 4px 3px;\n\n  white-space: nowrap;\n\n  border-width: 0;\n  border-style: solid;\n  border-color: transparent;\n  background: transparent;\n\n  line-height: 16px\n}\n\n.query-assist_input__2-mCm:active,\n  .query-assist_input__2-mCm:focus {\n    outline: 0;\n  }\n\n.query-assist_input__2-mCm :-ms-input-placeholder, :root .query-assist_input__2-mCm {\n    line-height: 17px\n}\n\n@supports (-ms-ime-align:auto) {\n    .query-assist_input__2-mCm {\n      line-height: 17px;\n    }\n  }\n\n.query-assist_input__2-mCm .query-assist_iconInner__39nC6 {\n    color: #b8d1e5;\n    color: var(--ring-icon-color);\n  }\n\n.query-assist_input__2-mCm.query-assist_calc-8px---3-__uvYbj {\n    border-right-width: 24px;\n  }\n\n.query-assist_input__2-mCm.query-assist_inputGap2__3yV1J {\n    border-right-width: 48px;\n  }\n\n.query-assist_input__2-mCm.query-assist_inputLeftGap__dS8Qq {\n    border-left-width: 24px;\n  }\n\n.query-assist_input__2-mCm.query-assist_inputDisabled__3NAL8 {\n    color: #999;\n    color: var(--ring-disabled-color);\n    border-color: #dfe5eb;\n    border-color: var(--ring-line-color);\n  }\n\n.query-assist_placeholder__b0Fjy {\n\n  position: absolute;\n  top: 3px;\n\n  left: 5px;\n\n  display: block;\n\n  overflow: hidden;\n\n  width: calc(100% - 32px);\n\n  text-overflow: ellipsis;\n\n  pointer-events: none\n}\n\n.query-assist_placeholder__b0Fjy.query-assist_placeholderSpaced__bM9pk {\n    left: 29px;\n  }\n\n.query-assist_placeholder__b0Fjy :-ms-input-placeholder, :root .query-assist_placeholder__b0Fjy {\n    top: 4px\n}\n\n@supports (-ms-ime-align:auto) {\n    .query-assist_placeholder__b0Fjy {\n      top: 4px;\n    }\n  }\n\n.query-assist_letter__3DO1b {\n  display: inline;\n}\n\n.query-assist_actions__ADTJ- {\n  position: absolute;\n  z-index: 2;\n  top: 4px;\n  right: 1px;\n\n  background-color: #fff;\n\n  background-color: var(--ring-content-background-color);\n}\n\n.query-assist_icon__zOwqw {\n  position: absolute;\n  z-index: 2;\n  top: 4px;\n\n  box-sizing: border-box;\n\n  width: 24px;\n  height: 16px;\n\n  padding: 0 4px;\n\n  cursor: pointer;\n  -webkit-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n\n  line-height: normal\n}\n\n.query-assist_icon__zOwqw svg {\n    vertical-align: baseline;\n  }\n\n.query-assist_actions__ADTJ- .query-assist_icon__zOwqw {\n    position: relative;\n    top: 0;\n    left: -1px\n}\n\n.query-assist_loaderOnTheRight__3pe_d {\n  right: 1px;\n\n  left: auto;\n}\n\n.query-assist_focusUnderline__lWfFT {\n  width: 0;\n  height: 2px;\n\n  transition: width 0.15s ease-out;\n\n  background: #008eff;\n\n  background: var(--ring-main-color);\n}\n\n.query-assist_input__2-mCm:focus ~ .query-assist_focusUnderline__lWfFT,\n.query-assist_input__2-mCm:active ~ .query-assist_focusUnderline__lWfFT {\n  width: 100%;\n}\n";
var styles = {"unit":"8px","resetButton":"global_resetButton__WQfrm","overInputZIndex":"2","inputGap":"calc(8px * 3)","light":"query-assist_light__25Zf6","queryAssist":"query-assist_queryAssist__BCKN2 global_font__2H0e4","input":"query-assist_input__2-mCm","placeholder":"query-assist_placeholder__b0Fjy global_resetButton__WQfrm","letter-text":"query-assist_letter-text__1zAfA","letterDefault":"query-assist_letterDefault__2RDdK","letter-field-name":"query-assist_letter-field-name__260nx","letter-field-value":"query-assist_letter-field-value__fv9zG","letter-operator":"query-assist_letter-operator__AYpYz","letter-error":"query-assist_letter-error__3NPpW","iconInner":"query-assist_iconInner__39nC6","highlight":"query-assist_highlight__s5mVC","service":"query-assist_service__2eFuT","dark":"query-assist_dark__21alU","icon":"query-assist_icon__zOwqw","loader":"query-assist_loader__1I9GT","actions":"query-assist_actions__ADTJ-","calc(8px * 3)":"query-assist_calc-8px---3-__uvYbj","inputGap2":"query-assist_inputGap2__3yV1J","inputLeftGap":"query-assist_inputLeftGap__dS8Qq","inputDisabled":"query-assist_inputDisabled__3NAL8","placeholderSpaced":"query-assist_placeholderSpaced__bM9pk","letter":"query-assist_letter__3DO1b","loaderOnTheRight":"query-assist_loaderOnTheRight__3pe_d","focusUnderline":"query-assist_focusUnderline__lWfFT"};
styleInject(css_248z);

var ICON_ID_LENGTH = 44;

var QueryAssistSuggestions = /*#__PURE__*/function () {
  function QueryAssistSuggestions() {
    _classCallCheck(this, QueryAssistSuggestions);
  }

  _createClass(QueryAssistSuggestions, null, [{
    key: "createKey",

    /*
    * Pay attention that this method produces not a 100% unique key.
    * Consider to use a unique identifier provided by a server.
     */
    value: function createKey(suggestion) {
      var description = suggestion.description,
          group = suggestion.group,
          icon = suggestion.icon,
          option = suggestion.option,
          _suggestion$prefix = suggestion.prefix,
          prefix = _suggestion$prefix === void 0 ? '' : _suggestion$prefix,
          _suggestion$suffix = suggestion.suffix,
          suffix = _suggestion$suffix === void 0 ? '' : _suggestion$suffix;
      return prefix + option + suffix + group + description + (icon ? icon.substring(icon.length - ICON_ID_LENGTH) : '');
    }
  }, {
    key: "renderLabel",
    value: function renderLabel(suggestion) {
      var className = suggestion.className,
          matchingStart = suggestion.matchingStart,
          matchingEnd = suggestion.matchingEnd,
          option = suggestion.option,
          _suggestion$prefix2 = suggestion.prefix,
          prefix = _suggestion$prefix2 === void 0 ? '' : _suggestion$prefix2,
          _suggestion$suffix2 = suggestion.suffix,
          suffix = _suggestion$suffix2 === void 0 ? '' : _suggestion$suffix2;
      var wrappedOption;
      var before = '';
      var after = '';

      if (matchingStart !== matchingEnd) {
        before = option.substring(0, matchingStart);
        wrappedOption = /*#__PURE__*/React.createElement("span", {
          className: styles.highlight
        }, option.substring(matchingStart, matchingEnd));
        after = option.substring(matchingEnd);
      } else {
        wrappedOption = option;
      }

      var wrappedPrefix = prefix && /*#__PURE__*/React.createElement("span", {
        className: styles.service
      }, prefix);
      var wrappedSuffix = suffix && /*#__PURE__*/React.createElement("span", {
        className: styles.service
      }, suffix);
      return /*#__PURE__*/React.createElement("span", {
        className: className
      }, wrappedPrefix, before, wrappedOption, after, wrappedSuffix);
    }
  }, {
    key: "renderGroupSeparator",
    value: function renderGroupSeparator(suggestion, prevSuggestion) {
      var group = suggestion.group,
          option = suggestion.option;
      var SEPARATOR = List.ListProps.Type.SEPARATOR;

      if (prevSuggestion !== group) {
        return {
          key: option + group + SEPARATOR,
          description: group,
          rgItemType: SEPARATOR
        };
      }

      return null;
    }
  }, {
    key: "renderList",
    value: function renderList(suggestions, suggestionRenderer) {
      var renderedSuggestions = [];
      suggestions.forEach(function (suggestion, index, arr) {
        var prevSuggestionGroup = arr[index - 1] && arr[index - 1].group;
        var groupSeparator = QueryAssistSuggestions.renderGroupSeparator(suggestion, prevSuggestionGroup);

        if (groupSeparator) {
          renderedSuggestions.push(groupSeparator);
        }

        renderedSuggestions.push(suggestionRenderer(suggestion));
      });
      return renderedSuggestions;
    }
  }]);

  return QueryAssistSuggestions;
}();

var POPUP_COMPENSATION = PopupMenu.ListProps.Dimension.ITEM_PADDING + PopupMenu.PopupProps.Dimension.BORDER_WIDTH;
var ngModelStateField = 'query';

function noop() {}

function cleanText(text) {
  return text.trim().replace(/([\n\r])+/g, ' ');
}
/**
 * @name Query Assist
 */

/**
 * ## Data source function

 Component class calls a data source function when user input happens and passes an object with fields \`caret\`, \`focus\` and \`query\` as the only argument.
 The function must return an object with the fields described below. The object can be optionally wrapped in a Promise.

 ### Return object fields

 \`caret\` and \`query\` should just return server values provided to data source function.
 These fields allow the Query Assist component to recognise and drop earlier responses from the server.

 + __caret__ (\`string=0\`) Caret from request
 + __query__ (\`string=''\`) Query from request
 + __styleRanges__ (\`Array<suggestion>=\`) Array of \`styleRange\` objects, used to highlight the request in the input field
 + __suggestions__ (\`Array<styleRange>\`) Array of \`suggestion\` objects to show.

 ### **styleRange** object fields

 start \`number\` Range start (in characters)
 length \`number\` Range length (in characters)
 style \`string\` Style of the range. Possible values: \`text\`, \`field_value\`, \`field_name\`, \`operator\`

 ### **suggestion** object fields

 + __prefix__ \`string=\` Suggestion option prefix
 + __option__ \`string\` Suggestion option
 + __suffix__ \`string=\` Suggestion option suffix
 + __description__ \`string=\` Suggestion option description. Is not visible when a group is set
 + __matchingStart__ \`number\` (required when matchingEnd is set) Start of the highlighted part of an option in the suggestions list (in characters)
 + __matchingEnd__ \`number\` (required when matchingEnd is set) End of the highlighted part of an option in the suggestions list (in characters)
 + __caret__ \`number\` Caret position after option completion (in characters)
 + __completionStart__ \`number\` Where to start insertion (or replacement, when completing with the \`Tab\` key) of the completion option (in characters)
 + __completionEnd__ \`number\` Where to end insertion of the completion option (in characters)
 + __group__ \`string=\` Group title. Options with the same title are grouped under it
 + __icon__ \`string=\` Icon URI, Data URI is possible
 */


var QueryAssist = /*#__PURE__*/function (_Component) {
  _inherits(QueryAssist, _Component);

  var _super = _createSuper(QueryAssist);

  function QueryAssist() {
    var _this;

    _classCallCheck(this, QueryAssist);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      dirty: !_this.props.query,
      query: _this.props.query,
      placeholderEnabled: !_this.props.query,
      shortcuts: !!_this.props.focus,
      suggestions: [],
      showPopup: false
    });

    _defineProperty(_assertThisInitialized(_this), "ngModelStateField", ngModelStateField);

    _defineProperty(_assertThisInitialized(_this), "handleFocusChange", function (e) {
      // otherwise it's blur and false
      var focus = e.type === 'focus';
      _this.immediateState.focus = focus;

      if (!focus) {
        _this.blurInput(); // Close popup on blur by keyboard (mostly shift+tab)


        if (!_this.mouseIsDownOnPopup) {
          _this.closePopup();
        }
      } else {
        _this.setCaretPosition();
      }

      if (!_this.mouseIsDownOnPopup) {
        _this.props.onFocusChange({
          focus: focus
        });
      }

      _this.setState({
        shortcuts: !!focus
      });
    });

    _defineProperty(_assertThisInitialized(_this), "nodeRef", function (node) {
      _this.node = node;
    });

    _defineProperty(_assertThisInitialized(_this), "setCaretPosition", function () {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var queryLength = _this.immediateState.query != null && _this.immediateState.query.length;
      var newCaretPosition = _this.immediateState.caret < queryLength ? _this.immediateState.caret : queryLength;

      if (params.fromContentEditable) {
        _this.immediateState.selection = _this.state.query && _this.state.query.length;
      }

      if (_this.immediateState.focus && !_this.props.disabled) {
        if (Number.isInteger(_this.immediateState.selection) && _this.immediateState.selection > -1) {
          // Set to end of field value if newCaretPosition is inappropriate
          _this.caret.setPosition(newCaretPosition >= 0 ? newCaretPosition : -1);

          _this.scrollInput();
        } else if (_this.immediateState.selection && _this.immediateState.selection.startOffset !== undefined) {
          _this.caret.setPosition(_this.immediateState.selection);
        } else if (!_this.immediateState.selection || params.forceSetCaret) {
          _this.caret.setPosition(-1);
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "togglePlaceholder", function () {
      var query = _this.getQuery();

      var currentQueryIsEmpty = _this.immediateState.query === '';
      var newQueryIsEmpty = query === '';

      if (newQueryIsEmpty !== currentQueryIsEmpty) {
        _this.setState({
          placeholderEnabled: newQueryIsEmpty
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleInput", function (e) {
      _this.togglePlaceholder();

      var currentCaret = _this.caret.getPosition();

      var props = {
        dirty: true,
        query: _this.getQuery(),
        caret: Number.isInteger(currentCaret) ? currentCaret : currentCaret.position,
        focus: true
      };

      if (_this.immediateState.query === props.query && !_this.isComposing) {
        _this.handleCaretMove(e);

        return;
      }

      if (_this.isComposing) {
        return;
      }

      _this.immediateState = props;

      _this.props.onChange(props);

      _this.requestData();
    });

    _defineProperty(_assertThisInitialized(_this), "handleEnter", function (e) {
      if (e.key === 'Enter') {
        preventDefault(e);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleTab", function (e) {
      var list = _this._popup && _this._popup.list;
      var suggestion = list && (list.getSelected() || list.getFirst());

      if (suggestion && _this.state.showPopup) {
        preventDefault(e);

        if (_this.getQuery() !== _this.immediateState.suggestionsQuery) {
          return false;
        }

        return _this.handleComplete(suggestion, true);
      }

      if (_this.state.loading) {
        preventDefault(e);
        return false;
      }

      return true;
    });

    _defineProperty(_assertThisInitialized(_this), "handlePaste", function (e) {
      var INSERT_COMMAND = 'insertText';

      if (e.clipboardData && document.queryCommandSupported(INSERT_COMMAND)) {
        preventDefault(e);
        var text = cleanText(e.clipboardData.getData('text/plain'));
        document.execCommand(INSERT_COMMAND, false, text);

        _this.handleInput(e);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleCaretMove", function (e) {
      if (_this.isComposing) {
        return;
      }

      var currentCaret = _this.caret.getPosition();

      var caret = Number.isInteger(currentCaret) ? currentCaret : currentCaret.position;
      var popupHidden = !_this.state.showPopup && e.type === 'click';

      if (!_this.props.disabled && (caret !== _this.immediateState.caret || popupHidden)) {
        _this.immediateState.caret = caret;

        _this.scrollInput();

        _this.requestData();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleStyleRangesResponse", function (_ref) {
      _ref.suggestions;
          var restProps = _objectWithoutProperties(_ref, ["suggestions"]);

      return _this.handleResponse(restProps);
    });

    _defineProperty(_assertThisInitialized(_this), "handleResponse", function (_ref2) {
      var _ref2$query = _ref2.query,
          query = _ref2$query === void 0 ? '' : _ref2$query,
          _ref2$caret = _ref2.caret,
          caret = _ref2$caret === void 0 ? 0 : _ref2$caret,
          styleRanges = _ref2.styleRanges,
          _ref2$suggestions = _ref2.suggestions,
          suggestions = _ref2$suggestions === void 0 ? [] : _ref2$suggestions;
      return new Promise(function (resolve, reject) {
        if (query === _this.getQuery() && (caret === _this.immediateState.caret || _this.immediateState.caret === undefined)) {
          // Do not setState on unmounted component
          if (!_this.node) {
            return;
          }

          var state = {
            dirty: _this.immediateState.dirty,
            loading: false,
            placeholderEnabled: !query,
            query: query,
            suggestions: suggestions,
            showPopup: !!suggestions.length
          };
          _this.immediateState.suggestionsQuery = query; // Do not update deep equal styleRanges to simplify shouldComponentUpdate check

          if (!deepEqual(_this.state.styleRanges, styleRanges)) {
            state.styleRanges = styleRanges;
          }

          _this.immediateState.selection = _this.caret.getPosition({
            avoidFocus: true
          });

          _this.setState(state, resolve);
        } else {
          reject(new Error('Current and response queries mismatch'));
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleApply", function () {
      _this.closePopup();

      _this.immediateState.dirty = false; // Only set dirty to false when query is saved already

      if (_this.immediateState.query === _this.state.query) {
        _this.setState({
          dirty: false
        });
      }

      return _this.props.onApply(_this.immediateState);
    });

    _defineProperty(_assertThisInitialized(_this), "handleComplete", function (data, replace) {
      if (!data || !data.data) {
        _this.handleApply();

        return;
      }

      var query = _this.getQuery();

      var currentCaret = _this.immediateState.caret;
      var suggestion = data.data;
      var prefix = suggestion.prefix || '';
      var suffix = suggestion.suffix || '';
      var state = {
        caret: suggestion.caret,
        selection: suggestion.caret,
        query: query.substr(0, suggestion.completionStart) + prefix + suggestion.option + suffix
      };

      if (typeof replace === 'boolean' && replace) {
        state.query += _this.immediateState.query.substr(suggestion.completionEnd);
      } else {
        state.query += _this.immediateState.query.substr(_this.immediateState.caret);
      }

      _this.props.onChange(state);

      _this.props.onApplySuggestion(data.data, state);

      var focusState = {
        focus: true
      };

      _this.props.onFocusChange(focusState);

      if (state.query !== _this.immediateState.query) {
        _this.setState({
          placeholderEnabled: !state.query,
          query: state.query
        });
      }

      _this.immediateState = Object.assign(state, focusState);

      if (_this.immediateState.caret !== currentCaret) {
        _this.setCaretPosition();
      }

      _this.closePopup();

      _this.requestData();
    });

    _defineProperty(_assertThisInitialized(_this), "requestStyleRanges", function () {
      var _this$immediateState = _this.immediateState,
          query = _this$immediateState.query,
          caret = _this$immediateState.caret;

      if (!query) {
        return Promise.reject(new Error('Query is empty'));
      }

      return _this.sendRequest({
        query: query,
        caret: caret,
        omitSuggestions: true
      }).then(_this.handleStyleRangesResponse).catch(noop);
    });

    _defineProperty(_assertThisInitialized(_this), "requestHandler", function () {
      if (_this.props.disabled) {
        return Promise.reject(new Error('QueryAssist(@jetbrains/ring-ui): null exception'));
      }

      var _this$immediateState2 = _this.immediateState,
          query = _this$immediateState2.query,
          caret = _this$immediateState2.caret;
      return _this.sendRequest({
        query: query,
        caret: caret
      }).then(_this.handleResponse).catch(noop);
    });

    _defineProperty(_assertThisInitialized(_this), "handleCtrlSpace", function (e) {
      preventDefault(e);

      if (!_this.state.showPopup) {
        _this.requestData();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "trackPopupMouseState", function (e) {
      _this.mouseIsDownOnPopup = e.type === 'mousedown';
    });

    _defineProperty(_assertThisInitialized(_this), "trackCompositionState", function (e) {
      _this.isComposing = e.type !== 'compositionend';
    });

    _defineProperty(_assertThisInitialized(_this), "closePopup", function () {
      if (_this.node) {
        _this.setState({
          showPopup: false
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "clearQuery", function () {
      var state = {
        dirty: false,
        caret: 0,
        query: '',
        focus: true
      };

      _this.props.onChange(state);

      _this.props.onClear();

      _this.immediateState = state;

      _this.setState({
        dirty: false,
        query: '',
        placeholderEnabled: true,
        loading: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "inputRef", function (node) {
      if (!node) {
        return;
      }

      _this.input = node;
      _this.caret = new Caret(_this.input);
    });

    _defineProperty(_assertThisInitialized(_this), "popupRef", function (node) {
      _this._popup = node;
    });

    _defineProperty(_assertThisInitialized(_this), "placeholderRef", function (node) {
      _this.placeholder = node;
    });

    _defineProperty(_assertThisInitialized(_this), "glassRef", function (node) {
      _this.glass = node;
    });

    _defineProperty(_assertThisInitialized(_this), "loaderRef", function (node) {
      _this.loader = node;
    });

    _defineProperty(_assertThisInitialized(_this), "clearRef", function (node) {
      _this.clear = node;
    });

    _defineProperty(_assertThisInitialized(_this), "shortcutsScope", getUID('ring-query-assist-'));

    _defineProperty(_assertThisInitialized(_this), "shortcutsMap", {
      del: noop,
      enter: _this.handleComplete,
      'command+enter': _this.handleComplete,
      'ctrl+enter': _this.handleComplete,
      'ctrl+space': _this.handleCtrlSpace,
      tab: _this.handleTab,
      right: noop,
      left: noop,
      space: noop,
      home: noop,
      end: noop
    });

    return _this;
  }

  _createClass(QueryAssist, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var query = this.props.query || '';
      this.immediateState = {
        query: query,
        caret: Number.isFinite(this.props.caret) ? this.props.caret : query.length,
        focus: Boolean(this.props.autoOpen || this.props.focus)
      };
      this.setupRequestHandler(this.props.delay);

      if (this.props.autoOpen) {
        this.requestHandler().catch(noop);
      } else {
        this.requestStyleRanges().catch(noop);
      }

      this.setCaretPosition();
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(props, state) {
      return state.query !== this.state.query || state.dirty !== this.state.dirty || state.loading !== this.state.loading || state.showPopup !== this.state.showPopup || state.suggestions !== this.state.suggestions || state.styleRanges !== this.state.styleRanges || state.placeholderEnabled !== this.state.placeholderEnabled || props.placeholder !== this.props.placeholder || props.disabled !== this.props.disabled || props.clear !== this.props.clear || props.focus !== this.props.focus || props.actions !== this.props.actions || props.loader !== this.props.loader || props.glass !== this.props.glass;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props = this.props,
          caret = _this$props.caret,
          delay = _this$props.delay,
          query = _this$props.query;
      var queryChanged = query !== prevProps.query;
      this.updateFocus(prevProps);
      this.setupRequestHandler(delay);
      var shouldSetCaret = typeof caret === 'number' && caret !== prevProps.caret;

      if (shouldSetCaret) {
        this.immediateState.caret = caret;
      }

      if (typeof query === 'string' && queryChanged && query !== this.immediateState.query) {
        this.immediateState.query = query;

        if (query && prevProps.autoOpen) {
          this.requestData();
        } else if (query) {
          this.requestStyleRanges();
        }
      }
    }
  }, {
    key: "updateFocus",
    value: function updateFocus(_ref3) {
      var focus = _ref3.focus,
          caret = _ref3.caret;
      var isCaretChanged = caret !== this.props.caret;
      var isFocusChanged = focus !== this.props.focus;

      if (isFocusChanged || isCaretChanged) {
        var focusValue = isFocusChanged ? this.props.focus : true;
        this.setFocus(focusValue);
      }
    }
  }, {
    key: "scrollInput",
    value: function scrollInput() {
      var caretOffset = this.caret.getOffset();

      if (this.input.clientWidth !== this.input.scrollWidth && caretOffset > this.input.clientWidth) {
        this.input.scrollLeft += caretOffset;
      }
    }
  }, {
    key: "getQuery",
    value: function getQuery() {
      return this.input.textContent.replace(/\s/g, ' ');
    }
  }, {
    key: "isRenderingGlassOrLoader",
    value: function isRenderingGlassOrLoader() {
      var renderLoader = this.props.loader !== false && this.state.loading;
      return this.props.glass || renderLoader;
    }
  }, {
    key: "sendRequest",
    value: function sendRequest(params) {
      var _this2 = this;

      var value = this.props.dataSource(params);
      var dataPromise = Promise.resolve(value);
      var CLOSE_POPUP_TIMEOUT = 500; // Close popup after timeout between long requests

      var timeout = window.setTimeout(function () {
        if (_this2.node) {
          _this2.setState({
            loading: true
          });
        }

        if (params.query === _this2.immediateState.query) {
          _this2.closePopup();
        }
      }, CLOSE_POPUP_TIMEOUT);
      dataPromise.then(function () {
        return window.clearTimeout(timeout);
      }).catch(function () {
        window.clearTimeout(timeout);

        _this2.setState({
          loading: false
        });
      });
      return dataPromise;
    }
  }, {
    key: "getPopupOffset",
    value: function getPopupOffset(suggestions) {
      var ICON_SPACING = 12;
      var minOffset = this.isRenderingGlassOrLoader() ? ICON_SPACING : 0;

      if (!this.input) {
        return minOffset;
      } // First suggestion should be enough?


      var suggestion = suggestions && suggestions[0]; // Check if suggestion begins not from the end

      var completionStart = suggestion && suggestion.completionStart !== suggestion.completionEnd && suggestion.completionStart;
      var inputChildren = this.input.firstChild && this.input.firstChild.children;
      var completionStartNode = inputChildren && Number.isInteger(completionStart) && inputChildren[Math.min(completionStart, inputChildren.length - 1)];
      var offset = completionStartNode && getRect(completionStartNode).right - getRect(this.input).left;

      if (!offset) {
        var caret = this.caret.getOffset(); // Do not compensate caret in the beginning of field

        if (caret === 0) {
          return minOffset;
        } else {
          offset = caret;
        }
      }

      var result = offset - POPUP_COMPENSATION;
      return result < minOffset ? minOffset : result;
    }
  }, {
    key: "blurInput",
    value: function blurInput() {
      this.immediateState.selection = {};

      if (!this.props.focus) {
        this.caret.target.blur();
      }
    }
    /**
     * Optionally setup data request delay. For each component create a separate
     * instance of the delayed function. This may help reduce the load on the server
     * when the user quickly inputs data.
     */

  }, {
    key: "setupRequestHandler",
    value: function setupRequestHandler(delay) {
      var needDelay = typeof delay === 'number';
      var hasDelay = this.requestData !== this.requestHandler;

      if (!this.requestData || hasDelay !== needDelay) {
        if (needDelay) {
          this.requestData = debounce(this.requestHandler, delay);
        } else {
          this.requestData = this.requestHandler;
        }
      }
    }
  }, {
    key: "_renderSuggestion",
    value: function _renderSuggestion(suggestion) {
      var ITEM = PopupMenu.ListProps.Type.ITEM;
      var description = suggestion.description,
          icon = suggestion.icon,
          group = suggestion.group;
      var key = QueryAssistSuggestions.createKey(suggestion);
      var label = QueryAssistSuggestions.renderLabel(suggestion);
      return {
        key: key,
        icon: icon,
        label: label,
        description: description,
        group: group,
        rgItemType: ITEM,
        data: suggestion
      };
    }
  }, {
    key: "renderSuggestions",
    value: function renderSuggestions() {
      var suggestions = this.state.suggestions;

      if (!suggestions || !suggestions.length) {
        return [];
      }

      return QueryAssistSuggestions.renderList(suggestions, this._renderSuggestion);
    }
  }, {
    key: "renderQuery",
    value: function renderQuery() {
      var _this$state = this.state,
          dirty = _this$state.dirty,
          styleRanges = _this$state.styleRanges,
          query = _this$state.query;
      var classes = [];
      var LETTER_CLASS = 'letter';
      var LETTER_DEFAULT_CLASS = styles.letterDefault;

      if (styleRanges && styleRanges.length) {
        styleRanges.forEach(function (item, index) {
          if (dirty && index === styleRanges.length - 1 && item.style === 'text') {
            return;
          }

          var styleName = "".concat(LETTER_CLASS, "-").concat(item.style.replace('_', '-'));

          for (var i = item.start; i < item.start + item.length; i++) {
            classes[i] = styles[styleName];
          }
        });
      }

      return Array.from(query).map(function (letter, index, letters) {
        var className = classNames(styles.letter, classes[index] || LETTER_DEFAULT_CLASS);
        var dataTest = letters.length - 1 === index ? 'ring-query-assist-last-letter' : null; // \u00a0 === &nbsp;

        return /*#__PURE__*/React.createElement("span", {
          // eslint-disable-next-line react/no-array-index-key
          key: index + letter,
          className: className,
          "data-test": dataTest
        }, letter === ' ' ? "\xA0" : letter);
      });
    }
  }, {
    key: "setFocus",
    value: function setFocus(focus) {
      this.setState({
        shortcuts: !!focus
      });
      var isComponentFocused = Boolean(this.immediateState.focus);

      if (focus === false && isComponentFocused) {
        this.immediateState.focus = focus;
        this.blurInput();
      } else if (focus === true && !isComponentFocused) {
        this.immediateState.focus = focus;
        this.setCaretPosition({
          forceSetCaret: true
        });
      }
    }
  }, {
    key: "renderActions",
    value: function renderActions() {
      var actions = [].concat(this.props.actions || []);
      var renderClear = this.props.clear && !!this.state.query;

      if (renderClear) {
        actions.push( /*#__PURE__*/React.createElement(Button, {
          icon: closeIcon,
          key: 'clearAction',
          className: styles.icon,
          iconClassName: styles.iconInner,
          title: this.props.translations.clearTitle,
          ref: this.clearRef,
          onClick: this.clearQuery,
          "data-test": "query-assist-clear-icon"
        }));
      }

      return actions;
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames,
          _this3 = this;

      var _this$props2 = this.props,
          theme = _this$props2.theme,
          glass = _this$props2.glass,
          dataTest = _this$props2['data-test'],
          useCustomItemRender = _this$props2.useCustomItemRender;
      var renderPlaceholder = !!this.props.placeholder && this.state.placeholderEnabled;
      var renderLoader = this.props.loader !== false && this.state.loading;
      var renderGlass = glass && !renderLoader;
      var renderUnderline = theme === Theme.DARK;
      var actions = this.renderActions();
      var inputClasses = classNames((_classNames = {}, _defineProperty(_classNames, "".concat(styles.input, " ring-js-shortcuts"), true), _defineProperty(_classNames, styles.inputGap, actions.length || this.isRenderingGlassOrLoader() && !glass), _defineProperty(_classNames, styles.inputGap2, actions.length === 2), _defineProperty(_classNames, styles.inputLeftGap, this.isRenderingGlassOrLoader() && glass), _defineProperty(_classNames, styles.inputDisabled, this.props.disabled), _classNames));
      return /*#__PURE__*/React.createElement("div", {
        "data-test": joinDataTestAttributes('ring-query-assist', dataTest),
        className: classNames(styles.queryAssist, styles[theme]),
        role: "presentation",
        ref: this.nodeRef
      }, this.state.shortcuts && /*#__PURE__*/React.createElement(Shortcuts, {
        map: this.shortcutsMap,
        scope: this.shortcutsScope
      }), renderGlass && /*#__PURE__*/React.createElement(Button, {
        icon: searchIcon,
        className: styles.icon,
        iconClassName: styles.iconInner,
        title: this.props.translations.searchTitle,
        ref: this.glassRef,
        onClick: this.handleApply,
        "data-test": "query-assist-search-icon"
      }), renderLoader && /*#__PURE__*/React.createElement("div", {
        className: classNames(styles.icon, styles.loader, _defineProperty({}, styles.loaderOnTheRight, !glass)),
        ref: this.loaderRef
      }, /*#__PURE__*/React.createElement(LoaderInline, {
        theme: theme
      })), /*#__PURE__*/React.createElement(ContentEditable, {
        "aria-label": this.props.translations.searchTitle,
        className: inputClasses,
        "data-test": "ring-query-assist-input",
        inputRef: this.inputRef,
        disabled: this.props.disabled,
        onComponentUpdate: function onComponentUpdate() {
          return _this3.setCaretPosition({
            fromContentEditable: true
          });
        },
        onBlur: this.handleFocusChange,
        onClick: this.handleCaretMove,
        onCompositionStart: this.trackCompositionState,
        onCompositionEnd: this.trackCompositionState,
        onFocus: this.handleFocusChange,
        onInput: this.handleInput // To support IE use the same method
        ,
        onKeyUp: this.handleInput // to handle input and key up
        ,
        onKeyDown: this.handleEnter,
        onPaste: this.handlePaste,
        spellCheck: "false"
      }, this.state.query && /*#__PURE__*/React.createElement("span", null, this.renderQuery())), renderPlaceholder && /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: classNames(styles.placeholder, _defineProperty({}, styles.placeholderSpaced, glass)),
        ref: this.placeholderRef,
        onClick: this.handleCaretMove,
        "data-test": "query-assist-placeholder"
      }, this.props.placeholder), renderUnderline && /*#__PURE__*/React.createElement("div", {
        className: styles.focusUnderline
      }), actions && /*#__PURE__*/React.createElement("div", {
        "data-test": "ring-query-assist-actions",
        className: styles.actions
      }, actions), /*#__PURE__*/React.createElement(PopupMenu, {
        hidden: !this.state.showPopup,
        onCloseAttempt: this.closePopup,
        ref: this.popupRef,
        anchorElement: this.node,
        keepMounted: true,
        attached: true,
        className: classNames(styles[theme], this.props.popupClassName),
        directions: [PopupMenu.PopupProps.Directions.BOTTOM_RIGHT],
        data: useCustomItemRender ? this.state.suggestions : this.renderSuggestions(),
        "data-test": "ring-query-assist-popup",
        hint: this.props.hint,
        hintOnSelection: this.props.hintOnSelection,
        left: this.getPopupOffset(this.state.suggestions),
        maxHeight: PopupMenu.PopupProps.MaxHeight.SCREEN,
        onMouseDown: this.trackPopupMouseState,
        onMouseUp: this.trackPopupMouseState,
        onSelect: this.handleComplete
      }));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(_ref4, _ref5) {
      var query = _ref4.query;
      var prevQuery = _ref5.prevQuery;
      var nextState = {
        prevQuery: query
      };

      if (typeof query === 'string' && query !== prevQuery) {
        nextState.query = query;
        nextState.placeholderEnabled = !query;
      }

      return nextState;
    }
  }]);

  return QueryAssist;
}(Component);

_defineProperty(QueryAssist, "propTypes", {
  theme: PropTypes.string,

  /**
   * Open suggestions popup during the initial render
   */
  autoOpen: PropTypes.bool,

  /**
   * Initial caret position
   */
  caret: PropTypes.number,

  /**
   * Show clickable "cross" icon on the right which clears the query
   */
  clear: PropTypes.bool,

  /**
   * Additional class for the component
   */
  className: PropTypes.string,

  /**
   * Additional class for the popup
   */
  popupClassName: PropTypes.string,

  /**
   * Data source function
   */
  dataSource: PropTypes.func.isRequired,

  /**
   * Input debounce delay
   */
  delay: PropTypes.number,

  /**
   * Disable the component
   */
  disabled: PropTypes.bool,

  /**
   * Initial focus
   */
  focus: PropTypes.bool,

  /**
   * Hint under the suggestions list
   */
  hint: PropTypes.string,

  /**
   * Hint under the suggestions list visible when a suggestion is selected
   */
  hintOnSelection: PropTypes.string,

  /**
   * Show clickable "glass" icon on the right which applies the query
   */
  glass: PropTypes.bool,

  /**
   * Show loader when a data request is in process
   */
  loader: PropTypes.bool,

  /**
   * Field placeholder value
   */
  placeholder: PropTypes.string,

  /**
   * Called when the query is applied. An object with fields `caret`, `focus` and `query` is passed as an argument
   */
  onApply: PropTypes.func,

  /**
   * Called when the query is changed. An object with fields `caret` and `query` is passed as an argument
   */
  onChange: PropTypes.func,

  /**
   * Called when the query is cleared. Called without arguments
   */
  onClear: PropTypes.func,

  /**
   * Called when the suggestion is applied
   */
  onApplySuggestion: PropTypes.func,

  /**
   * Called when the focus status is changed. An object with fields `focus` is passed as an argument
   */
  onFocusChange: PropTypes.func,

  /**
   * Initial query
   */
  query: PropTypes.string,
  useCustomItemRender: PropTypes.bool,
  translations: PropTypes.object,
  actions: PropTypes.array,
  'data-test': PropTypes.string
});

_defineProperty(QueryAssist, "defaultProps", {
  theme: Theme.LIGHT,
  onApply: noop,
  onChange: noop,
  onApplySuggestion: noop,
  onClear: noop,
  onFocusChange: noop,
  translations: {
    searchTitle: 'Search',
    clearTitle: 'Clear search input'
  }
});

_defineProperty(QueryAssist, "ngModelStateField", ngModelStateField);

_defineProperty(QueryAssist, "Theme", Theme);
var RerenderableQueryAssist = rerenderHOC(QueryAssist);

export default QueryAssist;
export { RerenderableQueryAssist };
