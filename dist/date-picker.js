import { _ as _inherits, a as _createSuper, b as _classCallCheck, d as _defineProperty, g as _assertThisInitialized, c as _createClass, f as _extends, h as _slicedToArray, i as _objectSpread2, m as _createForOfIteratorHelper, e as _objectWithoutProperties } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import format from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import isSameMonth from 'date-fns/isSameMonth';
import isSameYear from 'date-fns/isSameYear';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';
import set from 'date-fns/set';
import { m as memoize } from './memoize-ad2c954c.js';
import { P as Popup } from './popup-442f4003.js';
import Dropdown, { Anchor } from './dropdown.js';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import startOfDay from 'date-fns/startOfDay';
import calendarIcon from '@jetbrains/icons/calendar';
import Icon from './icon.js';
import Input from './input.js';
import add from 'date-fns/add';
import styleInject from 'style-inject';
import addMonths from 'date-fns/addMonths';
import getDay from 'date-fns/getDay';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import startOfHour from 'date-fns/startOfHour';
import startOfMonth from 'date-fns/startOfMonth';
import subMonths from 'date-fns/subMonths';
import endOfMonth from 'date-fns/endOfMonth';
import { s as scheduleRAF } from './schedule-raf-edeb21db.js';
import { l as linearFunction } from './linear-function-3bd43cfe.js';
import addDays from 'date-fns/addDays';
import setDay from 'date-fns/setDay';
import getDate from 'date-fns/getDate';
import isToday from 'date-fns/isToday';
import isThisMonth from 'date-fns/isThisMonth';
import startOfYear from 'date-fns/startOfYear';
import addYears from 'date-fns/addYears';
import subYears from 'date-fns/subYears';
import getYear from 'date-fns/getYear';
import isThisYear from 'date-fns/isThisYear';
import _setYear from 'date-fns/setYear';
import 'react-dom';
import './get-uid-bf3ab014.js';
import './dom-0ae85140.js';
import './shortcuts.js';
import 'combokeys';
import './sniffer-c9d1f40e.js';
import 'sniffr';
import './data-tests-1a367745.js';
import './tab-trap.js';
import './popup.target-9daf0591.js';
import '@jetbrains/icons/chevron-10px';
import './button-c0bc1992.js';
import 'focus-visible';
import './theme-9a053da9.js';
import './clickableLink-3fc5662b.js';
import 'util-deprecate';
import '@jetbrains/icons/close';

var unit = 8; // px;

var units = {
  unit: unit,

  /* eslint-disable no-magic-numbers */
  cellSize: unit * 3,
  calHeight: unit * 36,
  yearHeight: unit * 4
  /* eslint-enable */

};
var YEAR = 12;
var WEEK = 7;
var weekdays = {
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
  SU: 0
};
var MIDDLE_DAY = 15;

var durationToMillis = function durationToMillis(duration) {
  return +add(0, duration);
};

var yearDuration = durationToMillis({
  years: 1
});
var yearScrollSpeed = yearDuration / (YEAR * units.cellSize);
var DOUBLE = 2;
var HALF = 0.5;
var deprecatedPropType = function deprecatedPropType(replacement) {
  return function (props, propName) {
    if (propName in props) {
      return new Error("\"".concat(propName, "\" prop is deprecated and will be removed in 4.0. ").concat(replacement, " instead. See https://github.com/JetBrains/ring-ui/blob/master/CHANGELOG.md#310 for details"));
    }

    return undefined;
  };
};
var dateType = PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string, PropTypes.number]);
function parseTime(time) {
  var result = null;

  if (/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    result = time;
  } else if (/^([0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    result = "0".concat(time);
  }

  return result;
}

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */@import \"../global/variables.css\";.select-popup_filterWithTags__-Mbf7 {\n  overflow: hidden;\n\n  margin: 16px 8px 0;\n  padding: 1px;\n\n  text-align: left;\n\n  border: 1px solid var(--ring-borders-color);\n\n  & .select-popup_filterWrapper__3ek3A {\n    border-bottom: none;\n  }\n}.select-popup_filterWithTagsFocused__3RCHp {\n  border: 1px solid var(--ring-border-hover-color);\n}.select-popup_filter__3niGK {\n  width: 100%;\n\n  & input {\n    font-weight: 200;\n  }\n}.select-popup_filterWrapper__3ek3A {\n  position: relative;\n\n  margin: 0;\n  padding-right: 8px;\n  padding-left: 44px;\n\n  border-bottom: 1px solid var(--ring-borders-color);\n\n  @nest [dir=rtl] & {\n    padding-right: 44px;\n    padding-left: 8px;\n  }\n}.select-popup_filterIcon__3wU3S {\n  position: absolute;\n  top: 7px;\n  left: 16px;\n\n  color: var(--ring-icon-color);\n\n  @nest [dir=rtl] & {\n    right: 16px;\n    left: auto;\n  }\n}.select-popup_bottomLine__3PYTj {\n  text-align: center;\n}.select-popup_message__2lDgT {\n  display: inline-block;\n\n  margin: 8px 0;\n  padding: 0 16px;\n}.select-popup_selectAll__2gSGp {\n  display: flex;\n  justify-content: space-between;\n\n  padding: 8px 16px 0;\n}\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n:root {\n  /* stylelint-disable-next-line color-no-hex */\n  --ring-date-picker-hover-color: #b3dfff;\n}\n\n.date-picker_container__1AkrO {\n  display: inline-block;\n}\n\n.date-picker_hoverable__r3nDy {\n  cursor: pointer;\n  transition: color 0.2s ease-out 0s;\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.date-picker_hoverable__r3nDy:hover {\n  transition: none;\n\n  color: #ff008c;\n\n  color: var(--ring-link-hover-color);\n}}\n\n.date-picker_datePicker__VgAfL.date-picker_datePicker__VgAfL {\n  padding-right: 8px;\n}\n\n.date-picker_displayDate__1D-UH {\n  display: inline-block;\n\n  min-width: 88px;\n\n  text-align: left;\n}\n\n.date-picker_displayDate__1D-UH.date-picker_displayRange__vabWd {\n  min-width: 176px;\n}\n\n.date-picker_clear__3U3Y6 {\n  cursor: pointer;\n  transition: opacity 0.3s ease-out;\n  transition: opacity var(--ring-ease);\n\n  opacity: 0.3;\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.date-picker_datePicker__VgAfL:hover .date-picker_clear__3U3Y6 {\n  opacity: 0.5;\n}}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.date-picker_datePicker__VgAfL .date-picker_clear__3U3Y6:hover {\n  transition: none;\n\n  opacity: 1;\n}}\n\n.date-picker_datePopup__35X7I {\n  -webkit-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  text-align: left;\n}\n\n.date-picker_datePopup__35X7I * {\n  box-sizing: border-box;\n}\n\n.date-picker_filterWrapper__1L4xf {\n\n  display: flex;\n}\n\n.date-picker_filter__2rRMJ {\n}\n\n.date-picker_filterIcon__2xKT8 {\n}\n\n.date-picker_fromInput__3L-ax {\n  position: relative;\n\n  flex-basis: 104px;\n  flex-grow: 0;\n  flex-shrink: 0;\n}\n\n.date-picker_fromInputWithDivider__24Jty::after {\n    position: absolute;\n    right: 8px;\n\n    content: '—';\n\n    line-height: 30px;\n  }\n\n.date-picker_toInput__2kX3A {\n  flex-basis: 104px;\n  flex-grow: 1;\n  flex-shrink: 0;\n\n  width: 104px;\n}\n\n.date-picker_dateInput__2VY8o {\n  flex-basis: 88px;\n  flex-grow: 1;\n  flex-shrink: 0;\n}\n\n.date-picker_timeInputWithDivider__cGOTX {\n  position: relative\n}\n\n.date-picker_timeInputWithDivider__cGOTX::before {\n    position: absolute;\n    left: -8px;\n\n    content: ',';\n\n    line-height: 29px;\n  }\n\n.date-picker_weekdays__37hUj {\n  height: 32px;\n  padding: 5px 16px 0;\n\n  color: #737577;\n\n  color: var(--ring-secondary-color);\n}\n\n.date-picker_weekday__1wj0b {\n  display: inline-block;\n\n  width: 24px;\n\n  text-align: center;\n  text-transform: capitalize;\n}\n\n.date-picker_weekend__1iB3w {\n  color: #c22731;\n  color: var(--ring-error-color);\n}\n\n.date-picker_calendar__2wrQL {\n  position: relative;\n\n  overflow: hidden;\n\n  width: 296px;\n  height: 288px;\n\n  box-shadow: 0 -1px #dfe5eb;\n\n  box-shadow: 0 -1px var(--ring-line-color);\n}\n\n.date-picker_months__3i5L6 {\n  position: absolute;\n  top: 0;\n  right: 48px;\n  bottom: 0;\n  left: 0;\n}\n\n.date-picker_days__12g6_ {\n  position: relative;\n  left: 0;\n}\n\n.date-picker_month__x5bPl {\n  display: flex;\n  flex-wrap: wrap;\n\n  width: 168px;\n  margin: 16px;\n}\n\n.date-picker_month__x5bPl > * {\n  flex-shrink: 0;\n\n  height: 24px;\n\n  line-height: 24px;\n}\n\n.date-picker_monthTitle__2c8BH {\n  /* IE workaround, see https://github.com/philipwalton/flexbugs#7-flex-basis-doesnt-account-for-box-sizingborder-box */\n\n  width: 96px;\n\n  padding-left: 4px;\n\n  text-align: left;\n\n  font-weight: bold\n}\n\n@supports (flex-basis: 1px) {\n\n.date-picker_monthTitle__2c8BH {\n    flex-basis: 96px;\n\n    width: auto\n}\n  }\n\n.date-picker_day__n-ysW {\n\n  position: relative;\n\n  flex-basis: 24px;\n\n  margin: 0;\n\n  cursor: pointer;\n  transition: background-color 0.3s ease-out, color 0.3s ease-out;\n  transition: background-color var(--ring-ease), color var(--ring-ease);\n  text-align: center\n}\n\n.date-picker_day__n-ysW::before,\n  .date-picker_day__n-ysW::after {\n    pointer-events: none;\n  }\n\n.date-picker_between__3iRbr {\n  transition: none;\n\n  background-color: #d4edff;\n\n  background-color: var(--ring-selected-background-color);\n}\n\n.date-picker_activeBetween__16z8B {\n  transition: none;\n\n  background-color: #b3dfff;\n\n  background-color: var(--ring-date-picker-hover-color);\n}\n\n.date-picker_current__ZjXah {\n  color: #fff;\n  color: var(--ring-dark-text-color);\n  border-radius: 3px;\n  border-radius: var(--ring-border-radius);\n  background-color: #008eff;\n  background-color: var(--ring-main-color);\n}\n\n.date-picker_active__2I5rR {\n  transition: none;\n\n  color: #ff008c;\n\n  color: var(--ring-link-hover-color);\n  border-radius: 3px;\n  border-radius: var(--ring-border-radius);\n  background-color: #b3dfff;\n  background-color: var(--ring-date-picker-hover-color);\n}\n\n.date-picker_disabled__3XMwb {\n  cursor: not-allowed;\n\n  color: #999;\n\n  color: var(--ring-disabled-color);\n}\n\n.date-picker_from__zZqvu {\n  border-radius: 3px 0 0 3px;\n  border-radius: var(--ring-border-radius) 0 0 var(--ring-border-radius);\n}\n\n.date-picker_to__pBmgE {\n  border-radius: 0 3px 3px 0;\n  border-radius: 0 var(--ring-border-radius) var(--ring-border-radius) 0;\n}\n\n.date-picker_from__zZqvu.date-picker_to__pBmgE {\n  border-radius: 3px;\n  border-radius: var(--ring-border-radius);\n}\n\n.date-picker_Monday__126TG {\n  position: relative\n}\n\n.date-picker_Monday__126TG::before,\n  .date-picker_Monday__126TG::after {\n    position: absolute;\n\n    width: 16px;\n    height: 100%;\n\n    content: '';\n    transition: background-color 0.3s ease-out;\n    transition: background-color var(--ring-ease);\n  }\n\n.date-picker_Monday__126TG::before {\n    right: 100%;\n  }\n\n.date-picker_Monday__126TG::after {\n    bottom: 100%;\n    left: 700%;\n  }\n\n.date-picker_Monday__126TG.date-picker_spread__1e6I0::before,\n    .date-picker_Monday__126TG.date-picker_spread__1e6I0::after {\n      transition: none;\n\n      background-color: #d4edff;\n\n      background-color: var(--ring-selected-background-color);\n    }\n\n.date-picker_Monday__126TG.date-picker_activeSpread__XdtiE::before,\n    .date-picker_Monday__126TG.date-picker_activeSpread__XdtiE::after {\n      transition: none;\n\n      background-color: #b3dfff;\n\n      background-color: var(--ring-date-picker-hover-color);\n    }\n\n.date-picker_first__3MlZc {\n  position: relative\n}\n\n.date-picker_first__3MlZc::before,\n  .date-picker_first__3MlZc::after {\n    position: absolute;\n    z-index: -1;\n    z-index: var(--ring-invisible-element-z-index);\n\n    width: 184px;\n    height: 64px;\n\n    content: '';\n    transition: background-color 0.3s ease-out;\n    transition: background-color var(--ring-ease);\n  }\n\n.date-picker_first__3MlZc::before {\n    right: 100%;\n    bottom: 0;\n  }\n\n.date-picker_first__3MlZc::after {\n    bottom: 100%;\n    left: 0;\n  }\n\n.date-picker_first__3MlZc.date-picker_Monday__126TG::after {\n      height: 40px;\n    }\n\n.date-picker_first__3MlZc + .date-picker_Tuesday__3dqRZ {\n    position: relative\n  }\n\n.date-picker_first__3MlZc + .date-picker_Tuesday__3dqRZ::before {\n      position: absolute;\n      z-index: -1;\n      z-index: var(--ring-invisible-element-z-index);\n      top: -64px;\n      left: 600%;\n\n      width: 16px;\n      height: 100%;\n\n      content: '';\n      transition: background-color 0.3s ease-out;\n      transition: background-color var(--ring-ease);\n    }\n\n.date-picker_Friday__1Da-5::before,\n  .date-picker_Friday__1Da-5::after,\n  .date-picker_Saturday__2p1n2::before,\n  .date-picker_Saturday__2p1n2::after,\n  .date-picker_Sunday__rZbWn::before,\n  .date-picker_Sunday__rZbWn::after {\n    height: 40px;\n  }\n\n.date-picker_spread__1e6I0::before,\n  .date-picker_spread__1e6I0::after,\n  .date-picker_spread__1e6I0 + .date-picker_Tuesday__3dqRZ::before {\n    transition: none;\n\n    background-color: #d4edff;\n\n    background-color: var(--ring-selected-background-color);\n  }\n\n.date-picker_activeSpread__XdtiE::before,\n  .date-picker_activeSpread__XdtiE::after,\n  .date-picker_activeSpread__XdtiE + .date-picker_Tuesday__3dqRZ::before {\n    transition: none;\n\n    background-color: #b3dfff;\n\n    background-color: var(--ring-date-picker-hover-color);\n  }\n\n.date-picker_empty__Ipjm4 {\n  pointer-events: none;\n\n  opacity: 0;\n}\n\n.date-picker_today__3o6jk {\n  position: relative;\n\n  font-weight: bold;\n}\n\n.date-picker_today__3o6jk::before {\n  position: absolute;\n  top: 0;\n  left: 4px;\n\n  content: '•';\n\n  font-size: 12px;\n\n  font-size: var(--ring-font-size-smaller);\n}\n\n.date-picker_day__n-ysW > .date-picker_today__3o6jk::before {\n  top: 4px;\n  left: 0;\n\n  width: 100%;\n\n  text-align: center;\n}\n\n.date-picker_year__3Latt.date-picker_today__3o6jk::before {\n  top: -1px;\n  left: 2px;\n}\n\n.date-picker_monthNames__3k5js {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n\n  width: 48px;\n\n  background-color: #fff;\n\n  background-color: var(--ring-content-background-color);\n  box-shadow: -1px 0 #dfe5eb;\n  box-shadow: -1px 0 var(--ring-line-color);\n}\n\n.date-picker_monthName__1cqy- {\n\n  position: relative;\n\n  width: 100%;\n\n  height: 24px;\n  padding-left: 12px;\n\n  line-height: 24px;\n}\n\n.date-picker_monthSlider__1XJeb {\n\n  position: absolute;\n  z-index: 1;\n  z-index: var(--ring-fixed-z-index);\n  right: 0;\n  left: -1px;\n\n  width: calc(100% + 1px);\n\n  height: 48px;\n\n  cursor: grab;\n\n  opacity: 0.17;\n  background-color: #008eff;\n  background-color: var(--ring-main-color);\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.date-picker_monthSlider__1XJeb:hover {\n  opacity: 0.3;\n}}\n\n.date-picker_dragging__20g3F.date-picker_dragging__20g3F {\n  cursor: grabbing;\n\n  opacity: 0.35;\n}\n\n.date-picker_range__2hk2U {\n  position: absolute;\n  left: 0;\n\n  width: 2px;\n\n  background-color: #008eff;\n\n  background-color: var(--ring-main-color);\n}\n\n.date-picker_years__2iABr {\n  position: absolute;\n  top: 0;\n  right: 0;\n\n  width: 48px;\n\n  background-color: #fff;\n\n  background-color: var(--ring-content-background-color);\n  box-shadow: -1px 0 #dfe5eb;\n  box-shadow: -1px 0 var(--ring-line-color);\n\n  font-size: 12px;\n\n  font-size: var(--ring-font-size-smaller);\n}\n\n.date-picker_year__3Latt {\n\n  position: relative;\n\n  width: 100%;\n\n  height: 32px;\n\n  text-align: center;\n\n  color: #737577;\n\n  color: var(--ring-secondary-color);\n\n  line-height: 32px;\n}\n\n.date-picker_currentYear__2H6FU {\n  cursor: auto;\n  transition: none;\n\n  color: #1f2326;\n\n  color: var(--ring-text-color);\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.date-picker_currentYear__2H6FU:hover {\n  color: #1f2326;\n  color: var(--ring-text-color);\n}}\n";
var styles = {"unit":"8px","resetButton":"global_resetButton__WQfrm","cellSize":"calc(8px * 3)","calHeight":"calc(8px * 36)","calWidth":"calc(8px * 37)","yearHeight":"calc(8px * 4)","yearWidth":"calc(8px * 6)","container":"date-picker_container__1AkrO","hoverable":"date-picker_hoverable__r3nDy","datePicker":"date-picker_datePicker__VgAfL","displayDate":"date-picker_displayDate__1D-UH","displayRange":"date-picker_displayRange__vabWd","clear":"date-picker_clear__3U3Y6","datePopup":"date-picker_datePopup__35X7I","filterWrapper":"date-picker_filterWrapper__1L4xf select-popup_filterWrapper__3ek3A","filter":"date-picker_filter__2rRMJ select-popup_filter__3niGK","filterIcon":"date-picker_filterIcon__2xKT8 select-popup_filterIcon__3wU3S","fromInput":"date-picker_fromInput__3L-ax","fromInputWithDivider":"date-picker_fromInputWithDivider__24Jty","toInput":"date-picker_toInput__2kX3A","dateInput":"date-picker_dateInput__2VY8o","timeInputWithDivider":"date-picker_timeInputWithDivider__cGOTX","weekdays":"date-picker_weekdays__37hUj","weekday":"date-picker_weekday__1wj0b","weekend":"date-picker_weekend__1iB3w","calendar":"date-picker_calendar__2wrQL","months":"date-picker_months__3i5L6","days":"date-picker_days__12g6_","month":"date-picker_month__x5bPl","monthTitle":"date-picker_monthTitle__2c8BH","day":"date-picker_day__n-ysW global_resetButton__WQfrm","between":"date-picker_between__3iRbr","activeBetween":"date-picker_activeBetween__16z8B","current":"date-picker_current__ZjXah","active":"date-picker_active__2I5rR","disabled":"date-picker_disabled__3XMwb","from":"date-picker_from__zZqvu","to":"date-picker_to__pBmgE","Monday":"date-picker_Monday__126TG","spread":"date-picker_spread__1e6I0","activeSpread":"date-picker_activeSpread__XdtiE","first":"date-picker_first__3MlZc","Tuesday":"date-picker_Tuesday__3dqRZ","Friday":"date-picker_Friday__1Da-5","Saturday":"date-picker_Saturday__2p1n2","Sunday":"date-picker_Sunday__rZbWn","empty":"date-picker_empty__Ipjm4","today":"date-picker_today__3o6jk","year":"date-picker_year__3Latt date-picker_hoverable__r3nDy global_resetButton__WQfrm","monthNames":"date-picker_monthNames__3k5js","monthName":"date-picker_monthName__1cqy- date-picker_hoverable__r3nDy global_resetButton__WQfrm","monthSlider":"date-picker_monthSlider__1XJeb global_resetButton__WQfrm","dragging":"date-picker_dragging__20g3F","range":"date-picker_range__2hk2U","years":"date-picker_years__2iABr","currentYear":"date-picker_currentYear__2H6FU"};
styleInject(css_248z);

var DateInput = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(DateInput, _React$PureComponent);

  var _super = _createSuper(DateInput);

  function DateInput() {
    var _this;

    _classCallCheck(this, DateInput);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "inputRef", function (el) {
      _this.input = el;

      _this.updateInput(_this.props);
    });

    _defineProperty(_assertThisInitialized(_this), "handleChange", function (e) {
      return _this.props.onInput(e.target.value, e.target.dataset.name);
    });

    _defineProperty(_assertThisInitialized(_this), "handleKeyDown", function (e) {
      return e.key === 'Enter' && _this.props.onConfirm();
    });

    return _this;
  }

  _createClass(DateInput, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props = this.props,
          hidden = _this$props.hidden,
          text = _this$props.text,
          active = _this$props.active;

      if (!hidden && prevProps.hidden || text !== prevProps.text || active !== prevProps.active) {
        this.updateInput({
          text: text,
          active: active
        });
      }
    }
  }, {
    key: "updateInput",
    value: function updateInput(_ref) {
      var text = _ref.text,
          active = _ref.active;
      var el = this.input;

      if (!el) {
        return;
      }

      if (active) {
        el.focus();

        if (!text) {
          el.select();
        }
      } else {
        el.blur();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          active = _this$props2.active,
          divider = _this$props2.divider,
          text = _this$props2.text,
          time = _this$props2.time,
          name = _this$props2.name,
          hoverDate = _this$props2.hoverDate,
          date = _this$props2.date,
          displayFormat = _this$props2.displayFormat,
          translations = _this$props2.translations,
          onActivate = _this$props2.onActivate,
          onClear = _this$props2.onClear,
          fromPlaceholder = _this$props2.fromPlaceholder,
          toPlaceholder = _this$props2.toPlaceholder,
          timePlaceholder = _this$props2.timePlaceholder;
      var displayText = '';

      if (active && hoverDate) {
        displayText = displayFormat(hoverDate);
      } else if (active && text != null) {
        displayText = text;
      } else if (date) {
        displayText = displayFormat(date);
      } else if (name === 'time') {
        displayText = time || '';
      }

      var placeholder = function () {
        switch (name) {
          case 'from':
            return fromPlaceholder || translations.addFirstDate;

          case 'to':
            return toPlaceholder || translations.addSecondDate;

          case 'time':
            return timePlaceholder || translations.addTime;

          default:
            return translations.selectName.replace('%name%', name);
        }
      }();

      var classes = classNames(styles.filter, styles["".concat(name, "Input")], divider && styles["".concat(name, "InputWithDivider")], 'ring-js-shortcuts');
      return /*#__PURE__*/React.createElement(Input, {
        autoComplete: "off",
        borderless: true,
        "data-name": name,
        inputRef: this.inputRef,
        className: classes,
        value: displayText,
        onChange: this.handleChange,
        onFocus: onActivate,
        onKeyDown: this.handleKeyDown,
        onClear: onClear,
        placeholder: placeholder
      });
    }
  }]);

  return DateInput;
}(React.PureComponent);

_defineProperty(DateInput, "propTypes", {
  active: PropTypes.bool,
  divider: PropTypes.bool,
  name: PropTypes.string,
  text: PropTypes.string,
  hoverDate: dateType,
  date: dateType,
  time: PropTypes.string,
  displayFormat: PropTypes.func,
  hidden: PropTypes.bool,
  translations: PropTypes.object,
  fromPlaceholder: PropTypes.string,
  toPlaceholder: PropTypes.string,
  timePlaceholder: PropTypes.string,
  onInput: PropTypes.func,
  onActivate: PropTypes.func,
  onConfirm: PropTypes.func,
  onClear: PropTypes.func
});

_defineProperty(DateInput, "defaultProps", {
  fromPlaceholder: null,
  toPlaceholder: null,
  timePlaceholder: null,
  translations: {
    addFirstDate: 'Add first date',
    addSecondDate: 'Add second date',
    addTime: 'Add time',
    selectName: 'Select %name%'
  }
});

var hoverTO;

var Day = /*#__PURE__*/function (_Component) {
  _inherits(Day, _Component);

  var _super = _createSuper(Day);

  function Day() {
    var _this;

    _classCallCheck(this, Day);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleClick", function () {
      return _this.props.onSelect(_this.props.day);
    });

    _defineProperty(_assertThisInitialized(_this), "handleMouseOver", function () {
      if (hoverTO) {
        window.clearTimeout(hoverTO);
        hoverTO = null;
      }

      _this.props.onHover(_this.props.day);
    });

    _defineProperty(_assertThisInitialized(_this), "handleMouseOut", function () {
      hoverTO = window.setTimeout(_this.props.onHover, 0);
    });

    _defineProperty(_assertThisInitialized(_this), "isDay", function (date) {
      return isSameDay(_this.props.day, date);
    });

    _defineProperty(_assertThisInitialized(_this), "is", function (name) {
      return _this.props[name] && _this.isDay(_this.props[name]);
    });

    _defineProperty(_assertThisInitialized(_this), "inRange", function (range) {
      return range && isAfter(startOfDay(_this.props.day), startOfDay(range[0])) && isBefore(startOfDay(_this.props.day), startOfDay(range[1]));
    });

    _defineProperty(_assertThisInitialized(_this), "isDisabled", function (date) {
      var min = _this.parse(_this.props.minDate);

      var max = _this.parse(_this.props.maxDate);

      return _this.props.minDate && isBefore(startOfDay(date), startOfDay(min)) || _this.props.maxDate && isAfter(startOfDay(date), startOfDay(max));
    });

    return _this;
  }

  _createClass(Day, [{
    key: "parse",
    value: function parse(text) {
      return this.props.parseDateInput(text);
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props = this.props,
          day = _this$props.day,
          from = _this$props.from,
          currentRange = _this$props.currentRange,
          activeRange = _this$props.activeRange,
          empty = _this$props.empty;
      var reverse = activeRange && activeRange[1] === from;

      function makeSpreadRange(range) {
        return range && [range[0], addDays(range[1], 1)];
      }

      var spreadRange = makeSpreadRange(currentRange);
      var disabled = this.isDisabled(day);
      var activeSpreadRange = makeSpreadRange(activeRange);
      return (
        /*#__PURE__*/
        // TODO make keyboard navigation actually work
        React.createElement("button", {
          type: "button",
          className: classNames(styles.day, styles[format(day, 'EEEE')], (_classNames = {}, _defineProperty(_classNames, styles.current, ['date', 'from', 'to'].some(this.is)), _defineProperty(_classNames, styles.active, !disabled && this.is('activeDate')), _defineProperty(_classNames, styles.weekend, [weekdays.SA, weekdays.SU].includes(getDay(day))), _defineProperty(_classNames, styles.empty, empty), _defineProperty(_classNames, styles.from, currentRange && this.isDay(currentRange[0]) && !reverse || activeRange && this.isDay(activeRange[0])), _defineProperty(_classNames, styles.to, currentRange && this.isDay(currentRange[1]) || activeRange && this.isDay(activeRange[1])), _defineProperty(_classNames, styles.between, this.inRange(currentRange)), _defineProperty(_classNames, styles.activeBetween, !disabled && this.inRange(activeRange)), _defineProperty(_classNames, styles.first, getDate(day) === 1), _defineProperty(_classNames, styles.spread, this.inRange(spreadRange)), _defineProperty(_classNames, styles.activeSpread, !disabled && this.inRange(activeSpreadRange)), _defineProperty(_classNames, styles.disabled, disabled), _classNames)),
          onClick: this.handleClick,
          onMouseOver: this.handleMouseOver,
          onFocus: this.handleMouseOver,
          onMouseOut: this.handleMouseOut,
          onBlur: this.handleMouseOut,
          disabled: disabled
        }, empty || /*#__PURE__*/React.createElement("span", {
          className: classNames(_defineProperty({}, styles.today, isToday(day)))
        }, format(day, 'd')))
      );
    }
  }]);

  return Day;
}(Component);
Day.propTypes = {
  day: dateType,
  from: dateType,
  currentRange: PropTypes.arrayOf(dateType),
  activeRange: PropTypes.arrayOf(dateType),
  empty: PropTypes.bool,
  onSelect: PropTypes.func,
  parseDateInput: PropTypes.func,
  onHover: PropTypes.func,
  minDate: dateType,
  maxDate: dateType
};

function Month(props) {
  var start = props.month;
  var end = endOfMonth(start); // pad with empty cells starting from last friday

  var weekday = getDay(start);
  var day = setDay(start, weekday >= weekdays.FR ? weekdays.FR : weekdays.FR - WEEK);
  var days = [];

  while (day < end) {
    days.push(day);
    day = addDays(day, 1);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: styles.month
  }, /*#__PURE__*/React.createElement("span", {
    className: styles.monthTitle
  }, format(props.month, 'MMMM')), days.map(function (date) {
    return /*#__PURE__*/React.createElement(Day, _extends({}, props, {
      day: date,
      empty: date < start,
      key: +date
    }));
  }));
}
Month.propTypes = {
  month: dateType
};

var COVERYEARS = 3;

var MonthSlider = /*#__PURE__*/function (_PureComponent) {
  _inherits(MonthSlider, _PureComponent);

  var _super = _createSuper(MonthSlider);

  function MonthSlider() {
    var _this;

    _classCallCheck(this, MonthSlider);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      dragging: false
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseDown", function () {
      _this.setState({
        dragging: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseUp", function () {
      _this.setState({
        dragging: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseMove", function (e) {
      _this.props.onScroll(linearFunction(0, _this.props.scrollDate, yearScrollSpeed).y(e.movementY));
    });

    return _this;
  }

  _createClass(MonthSlider, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.state.dragging && !prevState.dragging) {
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
      } else if (!this.state.dragging && prevState.dragging) {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var year = subYears(startOfDay(this.props.scrollDate), 1);
      var years = [year];

      for (var i = 0; i <= COVERYEARS; i++) {
        year = addYears(year, 1);
        years.push(year);
      }

      var classes = classNames(styles.monthSlider, _defineProperty({}, styles.dragging, this.state.dragging));
      return /*#__PURE__*/React.createElement("div", null, years.map(function (date) {
        return /*#__PURE__*/React.createElement("button", {
          type: "button",
          key: +date,
          className: classes,
          style: {
            top: Math.floor(_this2.props.pxToDate.x(date) - units.cellSize)
          },
          onMouseDown: _this2.onMouseDown
        });
      }));
    }
  }]);

  return MonthSlider;
}(PureComponent);

_defineProperty(MonthSlider, "propTypes", {
  scrollDate: dateType,
  onScroll: PropTypes.func,
  pxToDate: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  })
});

var MonthName = /*#__PURE__*/function (_PureComponent) {
  _inherits(MonthName, _PureComponent);

  var _super = _createSuper(MonthName);

  function MonthName() {
    var _this;

    _classCallCheck(this, MonthName);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleClick", function () {
      var end = endOfMonth(_this.props.month);

      _this.props.onScrollChange((+_this.props.month + +end) * HALF);
    });

    return _this;
  }

  _createClass(MonthName, [{
    key: "render",
    value: function render() {
      var month = this.props.month;
      return /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: classNames(styles.monthName, _defineProperty({}, styles.today, isThisMonth(month))),
        onClick: this.handleClick
      }, format(month, 'MMM'));
    }
  }]);

  return MonthName;
}(PureComponent);

MonthName.propTypes = {
  month: dateType,
  onScrollChange: PropTypes.func
};
function MonthNames(props) {
  var scrollDate = props.scrollDate;
  var months = [];

  for (var i = 0; i < YEAR; i++) {
    var middleDay = set(scrollDate, {
      month: i,
      date: MIDDLE_DAY
    });
    months.push(startOfDay(middleDay));
  }

  var pxToDate = linearFunction(0, startOfYear(scrollDate), yearScrollSpeed);
  var top = 0;
  var bottom = 0;

  if (props.currentRange) {
    var _props$currentRange$m = props.currentRange.map(function (date) {
      return Math.floor(pxToDate.x(date));
    });

    var _props$currentRange$m2 = _slicedToArray(_props$currentRange$m, 2);

    top = _props$currentRange$m2[0];
    bottom = _props$currentRange$m2[1];
  }

  return /*#__PURE__*/React.createElement("div", {
    className: styles.monthNames
  }, months.map(function (month) {
    return /*#__PURE__*/React.createElement(MonthName, {
      key: +month,
      month: month,
      onScrollChange: props.onScrollChange
    });
  }), props.currentRange && /*#__PURE__*/React.createElement("div", {
    className: styles.range,
    style: {
      top: top - 1,
      height: bottom + 1 - (top - 1)
    }
  }), /*#__PURE__*/React.createElement(MonthSlider, _extends({}, props, {
    pxToDate: pxToDate
  })));
}
MonthNames.propTypes = {
  scrollDate: dateType,
  onScrollChange: PropTypes.func,
  currentRange: PropTypes.arrayOf(dateType)
};

var unit$1 = units.unit,
    cellSize = units.cellSize,
    calHeight = units.calHeight;
var FridayToSunday = WEEK + weekdays.SU - weekdays.FR;
var FIVELINES = 31;
var TALLMONTH = 6;
var SHORTMONTH = 5;
var PADDING = 2;
var MONTHSBACK = 2;

function monthHeight(date) {
  var monthStart = startOfMonth(date);
  var daysSinceLastFriday = (getDay(monthStart) + FridayToSunday) % WEEK;
  var monthLines = daysSinceLastFriday + getDaysInMonth(monthStart) > FIVELINES ? TALLMONTH : SHORTMONTH;
  return monthLines * cellSize + unit$1 * PADDING;
} // in milliseconds per pixel


function scrollSpeed(date) {
  var monthStart = startOfMonth(date);
  var monthEnd = endOfMonth(date);
  return (monthEnd - monthStart) / monthHeight(monthStart);
}

var scrollSchedule = scheduleRAF();
var dy = 0;
function Months(props) {
  var scrollDate = props.scrollDate; // prevent switching from april to march because of daylight saving time

  var monthStart = startOfHour(set(scrollDate, {
    date: 1,
    hours: 1
  }));
  var month = subMonths(monthStart, MONTHSBACK);
  var months = [month];

  for (var i = 0; i < MONTHSBACK * DOUBLE; i++) {
    month = addMonths(month, 1);
    months.push(month);
  }

  var currentSpeed = scrollSpeed(scrollDate);
  var pxToDate = linearFunction(0, scrollDate, currentSpeed);
  var offset = pxToDate.x(monthStart); // is a negative number

  var bottomOffset = monthHeight(scrollDate) + offset;
  return /*#__PURE__*/React.createElement("div", {
    className: styles.months,
    onWheel: function handleWheel(e) {
      e.preventDefault();
      dy += e.deltaY;
      scrollSchedule(function () {
        var date; // adjust scroll speed to prevent glitches

        if (dy < offset) {
          date = pxToDate.y(offset) + (dy - offset) * scrollSpeed(months[1]);
        } else if (dy > bottomOffset) {
          date = pxToDate.y(bottomOffset) + (dy - bottomOffset) * scrollSpeed(months[MONTHSBACK + 1]);
        } else {
          date = pxToDate.y(dy);
        }

        props.onScroll(date);
        dy = 0;
      });
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      top: Math.floor(calHeight * HALF - monthHeight(months[0]) - monthHeight(months[1]) + offset)
    },
    className: styles.days
  }, months.map(function (date) {
    return /*#__PURE__*/React.createElement(Month, _extends({}, props, {
      month: date,
      key: +date
    }));
  })), /*#__PURE__*/React.createElement(MonthNames, props));
}
Months.propTypes = {
  onScroll: PropTypes.func,
  scrollDate: dateType
};

var yearHeight = units.yearHeight,
    calHeight$1 = units.calHeight;
var scrollTO;
var YEARSBACK = 5;
var scrollDelay = 100;

var Years = /*#__PURE__*/function (_PureComponent) {
  _inherits(Years, _PureComponent);

  var _super = _createSuper(Years);

  function Years() {
    var _this;

    _classCallCheck(this, Years);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      scrollDate: null
    });

    return _this;
  }

  _createClass(Years, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      this.stoppedScrolling = prevState.scrollDate && !this.state.scrollDate;
    }
  }, {
    key: "setYear",
    value: function setYear(date) {
      if (scrollTO) {
        window.clearTimeout(scrollTO);
        scrollTO = null;
      }

      this.setState({
        scrollDate: null
      });
      this.props.onScroll(_setYear(this.props.scrollDate, getYear(date)));
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          onScrollChange = _this$props.onScrollChange,
          scrollDate = _this$props.scrollDate;
      var date = this.state.scrollDate || scrollDate;
      var yearStart = startOfYear(date);
      var year = subYears(yearStart, YEARSBACK);
      var years = [year];

      for (var i = 0; i < YEARSBACK * DOUBLE; i++) {
        year = addYears(year, 1);
        years.push(year);
      }

      var pxToDate = linearFunction(0, years[0], yearDuration / yearHeight);

      var handleWheel = function handleWheel(e) {
        e.preventDefault();
        var newScrollDate = linearFunction(0, date, yearDuration / yearHeight).y(e.deltaY);

        _this2.setState({
          scrollDate: newScrollDate
        });

        if (scrollTO) {
          window.clearTimeout(scrollTO);
        }

        scrollTO = window.setTimeout(function () {
          return _this2.setYear(newScrollDate);
        }, scrollDelay);
      };

      return /*#__PURE__*/React.createElement("div", {
        className: styles.years,
        onWheel: handleWheel,
        style: {
          transition: this.stoppedScrolling ? 'top .2s ease-out 0s' : 'none',
          top: Math.floor(calHeight$1 * HALF - pxToDate.x(date))
        }
      }, years.map(function (item) {
        var _classNames;

        return /*#__PURE__*/React.createElement("button", {
          type: "button",
          key: +item,
          className: classNames(styles.year, (_classNames = {}, _defineProperty(_classNames, styles.currentYear, isSameYear(item, date)), _defineProperty(_classNames, styles.today, isThisYear(item)), _classNames)),
          onClick: function handleClick() {
            onScrollChange(_setYear(scrollDate, getYear(item)));
          }
        }, format(item, 'yyyy'));
      }));
    }
  }]);

  return Years;
}(PureComponent);

_defineProperty(Years, "propTypes", {
  scrollDate: dateType,
  onScroll: PropTypes.func,
  onScrollChange: PropTypes.func
});

function Weekdays() {
  var days = Object.keys(weekdays).map(function (key) {
    return startOfDay(setDay(new Date(), weekdays[key]));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: styles.weekdays
  }, days.map(function (day) {
    return /*#__PURE__*/React.createElement("span", {
      className: classNames(styles.weekday, _defineProperty({}, styles.weekend, [weekdays.SA, weekdays.SU].includes(getDay(day)))),
      key: +day
    }, format(day, 'EEEEEE'));
  }));
}

var scrollExpDelay = 10;

var DatePopup = /*#__PURE__*/function (_Component) {
  _inherits(DatePopup, _Component);

  var _super = _createSuper(DatePopup);

  _createClass(DatePopup, null, [{
    key: "sameDay",
    value: function sameDay(next, prev) {
      if (next && prev) {
        return isSameDay(next, prev);
      }

      return next === prev;
    }
  }]);

  function DatePopup(props) {
    var _this;

    _classCallCheck(this, DatePopup);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "isInTimeMode", function () {
      return !_this.props.range && _this.props.withTime || false;
    });

    _defineProperty(_assertThisInitialized(_this), "componentRef", /*#__PURE__*/React.createRef());

    _defineProperty(_assertThisInitialized(_this), "handleWheel", function (e) {
      e.preventDefault();
    });

    _defineProperty(_assertThisInitialized(_this), "isValidDate", function (parsedText) {
      var minDate = _this.parse(_this.props.minDate, 'date');

      var maxDate = _this.parse(_this.props.maxDate, 'date');

      if (parsedText) {
        return !(minDate && isBefore(parsedText, minDate) || maxDate && isAfter(parsedText, maxDate));
      }

      return false;
    });

    _defineProperty(_assertThisInitialized(_this), "scheduleScroll", function () {
      var current = _this.state.scrollDate && _this.parse(_this.state.scrollDate, 'date') || _this.parse(_this.props[_this.state.active], 'date') || new Date();
      var goal = _this._scrollDate;

      if (!current || !goal || DatePopup.sameDay(goal, current)) {
        _this._scrollDate = null;
        _this._scrollTS = null;
        return;
      }

      if (_this._scrollTS) {
        var diff = goal - current;

        var dt = Date.now() - _this._scrollTS;

        var next = goal - diff * Math.pow(Math.E, -dt / scrollExpDelay);

        _this.setState({
          scrollDate: next
        });
      }

      _this._scrollTS = Date.now();
      window.requestAnimationFrame(_this.scheduleScroll);
    });

    _defineProperty(_assertThisInitialized(_this), "scrollTo", function (scrollDate) {
      _this._scrollDate = scrollDate;

      if (!_this._scrollTS) {
        _this.scheduleScroll();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "hoverHandler", function (hoverDate) {
      return _this.setState({
        hoverDate: hoverDate
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleActivate", memoize(function (name) {
      return function () {
        return _this.setState({
          active: name
        });
      };
    }));

    _defineProperty(_assertThisInitialized(_this), "handleInput", function (text, name) {
      var parsed = _this.parse(text, name);

      if (name !== 'time' && _this.isValidDate(parsed)) {
        _this.scrollTo(parsed);
      }

      _this.setState({
        text: text,
        hoverDate: null
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleConfirm", memoize(function (name) {
      return function () {
        return _this.confirm(name);
      };
    }));

    _defineProperty(_assertThisInitialized(_this), "selectHandler", function (date) {
      if (_this.isInTimeMode()) {
        _this.setState({
          active: 'time'
        }, function () {
          return _this.select({
            date: date
          });
        });
      } else {
        _this.select(_defineProperty({}, _this.state.active, date));
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleScroll", function (scrollDate) {
      return _this.setState({
        scrollDate: scrollDate
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onClear", function (e) {
      _this.setState({
        active: undefined
      });

      _this.props.onClear(e);
    });

    var defaultState = {
      text: null,
      hoverDate: null,
      scrollDate: null
    };
    var range = props.range,
        from = props.from,
        to = props.to,
        _date = props.date,
        time = props.time,
        withTime = props.withTime;

    if (!range) {
      var parsedDate = _this.parse(_date, 'date');

      var active = withTime && parsedDate && !time ? 'time' : 'date';
      _this.state = _objectSpread2(_objectSpread2({}, defaultState), {}, {
        active: active
      });
    } else if (from && !to) {
      _this.state = _objectSpread2(_objectSpread2({}, defaultState), {}, {
        active: 'to'
      });
    } else {
      _this.state = _objectSpread2(_objectSpread2({}, defaultState), {}, {
        active: 'from'
      });
    }

    return _this;
  }

  _createClass(DatePopup, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.componentRef.current) {
        this.componentRef.current.addEventListener('wheel', this.handleWheel);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.state.active !== prevState.active) {
        if (this.state.text && prevState.active) {
          this.confirm(prevState.active);
        } // eslint-disable-next-line react/no-did-update-set-state


        this.setState({
          text: null
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.componentRef.current) {
        this.componentRef.current.removeEventListener('wheel', this.handleWheel);
      }
    }
  }, {
    key: "parse",
    value: function parse(text, type) {
      if (type === 'time') {
        return parseTime(text);
      }

      return this.props.parseDateInput(text);
    }
  }, {
    key: "select",
    value: function select(changes) {
      var _this$props = this.props,
          range = _this$props.range,
          withTime = _this$props.withTime;
      var prevActive = this.state.active;
      var date = this.parse(this.props.date, 'date');
      var time = this.parse(this.props.time, 'time');

      if (!range && !withTime) {
        this.setState({
          text: null,
          scrollDate: null
        });
        this.props.onChange(changes.date);
        this.props.onComplete();
      } else if (!range && withTime) {
        var changeToSubmit = {
          date: changes.date || date,
          time: changes.time || time
        };
        this.setState({
          active: changes.date ? 'time' : 'date',
          text: null,
          scrollDate: null
        });
        this.props.onChange(changeToSubmit);

        if (!changes.date && prevActive === 'time' && changeToSubmit.date && changeToSubmit.time) {
          this.props.onComplete();
        }
      } else {
        var _this$props$changes = _objectSpread2(_objectSpread2({}, this.props), changes),
            from = _this$props$changes.from,
            to = _this$props$changes.to;

        from = this.parse(from, 'from');
        to = this.parse(to, 'to'); // proceed to setting the end by default

        var active = 'to';
        var complete = false; // end is before beginning

        if (from && to && isAfter(startOfDay(from), startOfDay(to))) {
          // ignore the old end when beginning is changed
          if (changes.from) {
            to = null; // treat range as reverse when end is changed
          } else if (changes.to) {
            to = from;
            from = changes.to;
          }
        } else if (changes.to) {
          active = 'from';
          complete = !!from;
        }

        this.setState({
          active: active,
          hoverDate: null,
          text: null
        });
        this.props.onChange({
          from: from,
          to: to
        });

        if (complete) {
          this.props.onComplete();
        }
      }
    }
  }, {
    key: "confirm",
    value: function confirm(name) {
      var text = this.state.text;
      var result = this.parse(text, name);

      if (name === 'time') {
        var time = this.parse(this.props.time, 'time');
        var emptyCase = this.state.active === 'time' ? '00:00' : null;
        result = result || time || emptyCase;
      } else if (!this.isValidDate(result)) {
        result = this.parse(this.props[name], name);
      }

      this.select(_defineProperty({}, name, result));
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          range = _this$props2.range,
          hidden = _this$props2.hidden,
          withTime = _this$props2.withTime,
          time = _this$props2.time;
      var parsedDate = this.parse(this.props.date, 'date');
      var parsedTo = this.parse(this.props.to, 'to');
      var names = range ? ['from', 'to'] : ['date'];
      var dates = names.reduce(function (obj, key) {
        var date = _this2.props[key];
        return _objectSpread2(_objectSpread2({}, obj), {}, _defineProperty({}, key, _this2.parse(date, key)));
      }, {});
      var activeDate = this.state.active !== 'time' ? this.state.hoverDate || this.state.text && this.parse(this.state.text, 'date') : this.state.hoverDate || null;
      var currentRange = range && dates.from && dates.to && [dates.from, dates.to] || null;
      var activeRange = null;

      if (range && activeDate) {
        switch (this.state.active) {
          case 'from':
            if (dates.to && isAfter(startOfDay(activeDate), startOfDay(dates.to))) {
              activeRange = [activeDate, dates.to];
            }

            break;

          case 'to':
            if (!dates.from) {
              break;
            }

            if (isBefore(startOfDay(activeDate), startOfDay(dates.from))) {
              activeRange = [activeDate, dates.from];
            } else {
              activeRange = [dates.from, activeDate];
            }

            break;
        }
      }

      var scrollDate = withTime && !range ? this.state.scrollDate || dates.date || new Date() : this.state.scrollDate || dates[this.state.active] || new Date();

      var calendarProps = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, this.props), this.state), dates), {}, {
        scrollDate: scrollDate,
        activeDate: activeDate,
        currentRange: currentRange,
        activeRange: activeRange,
        onScroll: this.handleScroll,
        onScrollChange: this.scrollTo
      });

      var clearable = Boolean(this.props.onClear);
      return /*#__PURE__*/React.createElement("div", {
        className: styles.datePopup,
        "data-test": "ring-date-popup",
        ref: this.componentRef
      }, /*#__PURE__*/React.createElement("div", {
        className: styles.filterWrapper
      }, /*#__PURE__*/React.createElement(Icon, {
        glyph: calendarIcon,
        className: styles.filterIcon
      }), names.map(function (name) {
        var onClear;

        if (clearable && name !== 'from' && !_this2.isInTimeMode()) {
          onClear = _this2.onClear.bind(_this2);
        }

        return /*#__PURE__*/React.createElement(DateInput, _extends({}, _this2.props, _this2.state, {
          divider: name === 'from' && (dates[name] != null || parsedTo != null),
          name: name,
          key: name,
          date: dates[name],
          active: _this2.state.active === name,
          hidden: hidden,
          onActivate: _this2.handleActivate(name),
          onInput: _this2.handleInput,
          onConfirm: _this2.handleConfirm(name),
          onClear: onClear
        }));
      }), this.isInTimeMode() ? /*#__PURE__*/React.createElement(DateInput, _extends({}, this.props, this.state, {
        divider: !!parsedDate,
        hoverDate: null,
        name: 'time',
        key: 'time',
        date: null,
        time: time,
        active: this.state.active === 'time',
        hidden: hidden,
        onActivate: this.handleActivate('time'),
        onInput: this.handleInput,
        onConfirm: this.handleConfirm('time'),
        onClear: clearable && this.onClear || undefined
      })) : ''), /*#__PURE__*/React.createElement(Weekdays, null), /*#__PURE__*/React.createElement("div", {
        className: styles.calendar
      }, /*#__PURE__*/React.createElement(Months, _extends({}, calendarProps, {
        onHover: this.hoverHandler,
        onSelect: this.selectHandler
      })), /*#__PURE__*/React.createElement(Years, calendarProps)), this.props.renderAfterCalendar && this.props.renderAfterCalendar(this.state));
    }
  }]);

  return DatePopup;
}(Component);

_defineProperty(DatePopup, "propTypes", {
  className: PropTypes.string,
  date: dateType,
  range: PropTypes.bool,
  withTime: PropTypes.bool,
  time: PropTypes.string,
  from: dateType,
  to: dateType,
  renderAfterCalendar: PropTypes.func,
  displayFormat: PropTypes.func,
  parseDateInput: PropTypes.func,
  onChange: PropTypes.func,
  onComplete: PropTypes.func,
  onClear: PropTypes.func,
  minDate: dateType,
  maxDate: dateType,
  hidden: PropTypes.bool,
  fromPlaceholder: PropTypes.string,
  toPlaceholder: PropTypes.string,
  timePlaceholder: PropTypes.string
});

_defineProperty(DatePopup, "defaultProps", {
  onChange: function onChange() {}
});

var formats = ['d M', 'dd M', 'dd MM', 'd-M', 'dd-M', 'dd-MM', 'd.M', 'dd.M', 'dd.MM', 'd\\M', 'dd\\M', 'dd\\MM', 'd/M', 'dd/M', 'dd/MM', 'd M yy', 'dd M yy', 'dd MM yy', 'd M yyyy', 'dd M yyyy', 'dd MM yyyy', 'd-M-yy', 'dd-M-yy', 'dd-MM-yy', 'd-M-yyyy', 'dd-M-yyyy', 'dd-MM-yyyy', 'd.M.yy', 'dd.M.yy', 'dd.MM.yy', 'd.M.yyyy', 'dd.M.yyyy', 'dd.MM.yyyy', 'd\\M\\yy', 'dd\\M\\yy', 'dd\\MM\\yy', 'd\\M\\yyyy', 'dd\\M\\yyyy', 'dd\\MM\\yyyy', 'd/M/yy', 'dd/M/yy', 'dd/MM/yy', 'd/M/yyyy', 'dd/M/yyyy', 'dd/MM/yyyy', 'd M yy', 'dd M yy', 'dd MM yy', 'd M yyyy', 'dd M yyyy', 'dd MM yyyy', 'd-M-yy', 'dd-M-yy', 'dd-MM-yy', 'd-M-yyyy', 'dd-M-yyyy', 'dd-MM-yyyy', 'd.M.yy', 'dd.M.yy', 'dd.MM.yy', 'd.M.yyyy', 'dd.M.yyyy', 'dd.MM.yyyy', 'd\\M\\yy', 'dd\\M\\yy', 'dd\\MM\\yy', 'd\\M\\yyyy', 'dd\\M\\yyyy', 'dd\\MM\\yyyy', 'd/M/yy', 'dd/M/yy', 'dd/MM/yy', 'd/M/yyyy', 'dd/M/yyyy', 'dd/MM/yyyy', 'yy M d', 'yy M dd', 'yy MM dd', 'yyyy M d', 'yyyy M dd', 'yyyy MM dd', 'yy-M-d', 'yy-M-dd', 'yy-MM-dd', 'yyyy-M-d', 'yyyy-M-dd', 'yyyy-MM-dd', 'yy.M.d', 'yy.M.dd', 'yy.MM.dd', 'yyyy.M.d', 'yyyy.M.dd', 'yyyy.MM.dd', 'yy\\M\\d', 'yy\\M\\dd', 'yy\\MM\\dd', 'yyyy\\M\\d', 'yyyy\\M\\dd', 'yyyy\\MM\\dd', 'yy/M/d', 'yy/M/dd', 'yy/MM/dd', 'yyyy/M/d', 'yyyy/M/dd', 'yyyy/MM/dd', 'yy d M', 'yy dd M', 'yy dd MM', 'yyyy d M', 'yyyy dd MM', 'yyyy dd MM', 'yy-d-M', 'yy-dd-M', 'yy-dd-MM', 'yyyy-d-M', 'yyyy-dd-MM', 'yyyy-dd-MM', 'yy.d.M', 'yy.dd.M', 'yy.dd.MM', 'yyyy.d.M', 'yyyy.dd.MM', 'yyyy.dd.MM', 'yy\\d\\M', 'yy\\dd\\M', 'yy\\dd\\MM', 'yyyy\\d\\M', 'yyyy\\dd\\MM', 'yyyy\\dd\\MM', 'yy/d/M', 'yy/dd/M', 'yy/dd/MM', 'yyyy/d/M', 'yyyy/dd/MM', 'yyyy/dd/MM', 'd MMM', 'd MMMM', 'dd MMM', 'dd MMMM', 'd M HH:mm', 'd M, HH:mm', 'dd M HH:mm', 'dd M, HH:mm', 'dd MM HH:mm', 'dd MM, HH:mm', 'd-M HH:mm', 'd-M, HH:mm', 'dd-M HH:mm', 'dd-M, HH:mm', 'dd-MM HH:mm', 'dd-MM, HH:mm', 'd.M HH:mm', 'd.M, HH:mm', 'dd.M HH:mm', 'dd.M, HH:mm', 'dd.MM HH:mm', 'dd.MM, HH:mm', 'd\\M HH:mm', 'd\\M, HH:mm', 'dd\\M HH:mm', 'dd\\M, HH:mm', 'dd\\MM HH:mm', 'dd\\MM, HH:mm', 'd/M HH:mm', 'd/M, HH:mm', 'dd/M HH:mm', 'dd/M, HH:mm', 'dd/MM HH:mm', 'dd/MM, HH:mm', 'd M yy HH:mm', 'd M yy, HH:mm', 'dd M yy HH:mm', 'dd M yy, HH:mm', 'dd MM yy HH:mm', 'dd MM yy, HH:mm', 'd M yyyy HH:mm', 'd M yyyy, HH:mm', 'dd M yyyy HH:mm', 'dd M yyyy, HH:mm', 'dd MM yyyy HH:mm', 'dd MM yyyy, HH:mm', 'd-M-yy HH:mm', 'd-M-yy, HH:mm', 'dd-M-yy HH:mm', 'dd-M-yy, HH:mm', 'dd-MM-yy HH:mm', 'dd-MM-yy, HH:mm', 'd-M-yyyy HH:mm', 'd-M-yyyy, HH:mm', 'dd-M-yyyy HH:mm', 'dd-M-yyyy, HH:mm', 'dd-MM-yyyy HH:mm', 'dd-MM-yyyy, HH:mm', 'd.M.yy HH:mm', 'd.M.yy, HH:mm', 'dd.M.yy HH:mm', 'dd.M.yy, HH:mm', 'dd.MM.yy HH:mm', 'dd.MM.yy, HH:mm', 'd.M.yyyy HH:mm', 'd.M.yyyy, HH:mm', 'dd.M.yyyy HH:mm', 'dd.M.yyyy, HH:mm', 'dd.MM.yyyy HH:mm', 'dd.MM.yyyy, HH:mm', 'd\\M\\yy HH:mm', 'd\\M\\yy, HH:mm', 'dd\\M\\yy HH:mm', 'dd\\M\\yy, HH:mm', 'dd\\MM\\yy HH:mm', 'dd\\MM\\yy, HH:mm', 'd\\M\\yyyy HH:mm', 'd\\M\\yyyy, HH:mm', 'dd\\M\\yyyy HH:mm', 'dd\\M\\yyyy, HH:mm', 'dd\\MM\\yyyy HH:mm', 'dd\\MM\\yyyy, HH:mm', 'd/M/yy HH:mm', 'd/M/yy, HH:mm', 'dd/M/yy HH:mm', 'dd/M/yy, HH:mm', 'dd/MM/yy HH:mm', 'dd/MM/yy, HH:mm', 'd/M/yyyy HH:mm', 'd/M/yyyy, HH:mm', 'dd/M/yyyy HH:mm', 'dd/M/yyyy, HH:mm', 'dd/MM/yyyy HH:mm', 'dd/MM/yyyy, HH:mm', 'd M yy HH:mm', 'd M yy, HH:mm', 'dd M yy HH:mm', 'dd M yy, HH:mm', 'dd MM yy HH:mm', 'dd MM yy, HH:mm', 'd M yyyy HH:mm', 'd M yyyy, HH:mm', 'dd M yyyy HH:mm', 'dd M yyyy, HH:mm', 'dd MM yyyy HH:mm', 'dd MM yyyy, HH:mm', 'd-M-yy HH:mm', 'd-M-yy, HH:mm', 'dd-M-yy HH:mm', 'dd-M-yy, HH:mm', 'dd-MM-yy HH:mm', 'dd-MM-yy, HH:mm', 'd-M-yyyy HH:mm', 'd-M-yyyy, HH:mm', 'dd-M-yyyy HH:mm', 'dd-M-yyyy, HH:mm', 'dd-MM-yyyy HH:mm', 'dd-MM-yyyy, HH:mm', 'd.M.yy HH:mm', 'd.M.yy, HH:mm', 'dd.M.yy HH:mm', 'dd.M.yy, HH:mm', 'dd.MM.yy HH:mm', 'dd.MM.yy, HH:mm', 'd.M.yyyy HH:mm', 'd.M.yyyy, HH:mm', 'dd.M.yyyy HH:mm', 'dd.M.yyyy, HH:mm', 'dd.MM.yyyy HH:mm', 'dd.MM.yyyy, HH:mm', 'd\\M\\yy HH:mm', 'd\\M\\yy, HH:mm', 'dd\\M\\yy HH:mm', 'dd\\M\\yy, HH:mm', 'dd\\MM\\yy HH:mm', 'dd\\MM\\yy, HH:mm', 'd\\M\\yyyy HH:mm', 'd\\M\\yyyy, HH:mm', 'dd\\M\\yyyy HH:mm', 'dd\\M\\yyyy, HH:mm', 'dd\\MM\\yyyy HH:mm', 'dd\\MM\\yyyy, HH:mm', 'd/M/yy HH:mm', 'd/M/yy, HH:mm', 'dd/M/yy HH:mm', 'dd/M/yy, HH:mm', 'dd/MM/yy HH:mm', 'dd/MM/yy, HH:mm', 'd/M/yyyy HH:mm', 'd/M/yyyy, HH:mm', 'dd/M/yyyy HH:mm', 'dd/M/yyyy, HH:mm', 'dd/MM/yyyy HH:mm', 'dd/MM/yyyy, HH:mm', 'yy M d HH:mm', 'yy M d, HH:mm', 'yy M dd HH:mm', 'yy M dd, HH:mm', 'yy MM dd HH:mm', 'yy MM dd, HH:mm', 'yyyy M d HH:mm', 'yyyy M d, HH:mm', 'yyyy M dd HH:mm', 'yyyy M dd, HH:mm', 'yyyy MM dd HH:mm', 'yyyy MM dd, HH:mm', 'yy-M-d HH:mm', 'yy-M-d, HH:mm', 'yy-M-dd HH:mm', 'yy-M-dd, HH:mm', 'yy-MM-dd HH:mm', 'yy-MM-dd, HH:mm', 'yyyy-M-d HH:mm', 'yyyy-M-d, HH:mm', 'yyyy-M-dd HH:mm', 'yyyy-M-dd, HH:mm', 'yyyy-MM-dd HH:mm', 'yyyy-MM-dd, HH:mm', 'yy.M.d HH:mm', 'yy.M.d, HH:mm', 'yy.M.dd HH:mm', 'yy.M.dd, HH:mm', 'yy.MM.dd HH:mm', 'yy.MM.dd, HH:mm', 'yyyy.M.d HH:mm', 'yyyy.M.d, HH:mm', 'yyyy.M.dd HH:mm', 'yyyy.M.dd, HH:mm', 'yyyy.MM.dd HH:mm', 'yyyy.MM.dd, HH:mm', 'yy\\M\\d HH:mm', 'yy\\M\\d, HH:mm', 'yy\\M\\dd HH:mm', 'yy\\M\\dd, HH:mm', 'yy\\MM\\dd HH:mm', 'yy\\MM\\dd, HH:mm', 'yyyy\\M\\d HH:mm', 'yyyy\\M\\d, HH:mm', 'yyyy\\M\\dd HH:mm', 'yyyy\\M\\dd, HH:mm', 'yyyy\\MM\\dd HH:mm', 'yyyy\\MM\\dd, HH:mm', 'yy/M/d HH:mm', 'yy/M/d, HH:mm', 'yy/M/dd HH:mm', 'yy/M/dd, HH:mm', 'yy/MM/dd HH:mm', 'yy/MM/dd, HH:mm', 'yyyy/M/d HH:mm', 'yyyy/M/d, HH:mm', 'yyyy/M/dd HH:mm', 'yyyy/M/dd, HH:mm', 'yyyy/MM/dd HH:mm', 'yyyy/MM/dd, HH:mm', 'yy d M HH:mm', 'yy d M, HH:mm', 'yy dd M HH:mm', 'yy dd M, HH:mm', 'yy dd MM HH:mm', 'yy dd MM, HH:mm', 'yyyy d M HH:mm', 'yyyy d M, HH:mm', 'yyyy dd MM HH:mm', 'yyyy dd MM, HH:mm', 'yyyy dd MM HH:mm', 'yyyy dd MM, HH:mm', 'yy-d-M HH:mm', 'yy-d-M, HH:mm', 'yy-dd-M HH:mm', 'yy-dd-M, HH:mm', 'yy-dd-MM HH:mm', 'yy-dd-MM, HH:mm', 'yyyy-d-M HH:mm', 'yyyy-d-M, HH:mm', 'yyyy-dd-MM HH:mm', 'yyyy-dd-MM, HH:mm', 'yyyy-dd-MM HH:mm', 'yyyy-dd-MM, HH:mm', 'yy.d.M HH:mm', 'yy.d.M, HH:mm', 'yy.dd.M HH:mm', 'yy.dd.M, HH:mm', 'yy.dd.MM HH:mm', 'yy.dd.MM, HH:mm', 'yyyy.d.M HH:mm', 'yyyy.d.M, HH:mm', 'yyyy.dd.MM HH:mm', 'yyyy.dd.MM, HH:mm', 'yyyy.dd.MM HH:mm', 'yyyy.dd.MM, HH:mm', 'yy\\d\\M HH:mm', 'yy\\d\\M, HH:mm', 'yy\\dd\\M HH:mm', 'yy\\dd\\M, HH:mm', 'yy\\dd\\MM HH:mm', 'yy\\dd\\MM, HH:mm', 'yyyy\\d\\M HH:mm', 'yyyy\\d\\M, HH:mm', 'yyyy\\dd\\MM HH:mm', 'yyyy\\dd\\MM, HH:mm', 'yyyy\\dd\\MM HH:mm', 'yyyy\\dd\\MM, HH:mm', 'yy/d/M HH:mm', 'yy/d/M, HH:mm', 'yy/dd/M HH:mm', 'yy/dd/M, HH:mm', 'yy/dd/MM HH:mm', 'yy/dd/MM, HH:mm', 'yyyy/d/M HH:mm', 'yyyy/d/M, HH:mm', 'yyyy/dd/MM HH:mm', 'yyyy/dd/MM, HH:mm', 'yyyy/dd/MM HH:mm', 'yyyy/dd/MM, HH:mm', 'd MMM HH:mm', 'd MMM, HH:mm', 'd MMMM HH:mm', 'd MMMM, HH:mm', 'dd MMM HH:mm', 'dd MMM, HH:mm', 'dd MMMM HH:mm', 'dd MMMM, HH:mm', 'yyyy MMM d', 'yyyy MMMM d', 'yyyy MMM dd', 'yyyy MMMM dd', 'yyyy d MMM', 'yyyy d MMMM', 'yyyy dd MMM', 'yyyy dd MMMM', 'd MMM yy', 'd MMMM yy', 'dd MMM yy', 'dd MMMM yy', 'd MMM yyyy', 'd MMMM yyyy', 'dd MMM yyyy', 'dd MMMM yyyy', 'd MMM yy', 'd MMMM yy', 'dd MMM yy', 'dd MMMM yy', 'd MMM yyyy', 'd MMMM yyyy', 'dd MMM yyyy', 'dd MMMM yyyy', 'MMM d yyyy', 'MMMM d yyyy', 'MMM dd yyyy', 'MMMM dd yyyy', 'yy MMM d', 'yy MMMM d', 'yy MMM dd', 'yy MMMM dd', 'yy d MMM', 'yy d MMMM', 'yy dd MMM', 'yy dd MMMM', 'd MMM', 'd MMMM', 'dd MMM', 'dd MMMM', 'yyyy MMM d HH:mm', 'yyyy MMM d, HH:mm', 'yyyy MMMM d HH:mm', 'yyyy MMMM d, HH:mm', 'yyyy MMM dd HH:mm', 'yyyy MMM dd, HH:mm', 'yyyy MMMM dd HH:mm', 'yyyy MMMM dd, HH:mm', 'yyyy d MMM HH:mm', 'yyyy d MMM, HH:mm', 'yyyy d MMMM HH:mm', 'yyyy d MMMM, HH:mm', 'yyyy dd MMM HH:mm', 'yyyy dd MMM, HH:mm', 'yyyy dd MMMM HH:mm', 'yyyy dd MMMM, HH:mm', 'd MMM yy HH:mm', 'd MMM yy, HH:mm', 'd MMMM yy HH:mm', 'd MMMM yy, HH:mm', 'dd MMM yy HH:mm', 'dd MMM yy, HH:mm', 'dd MMMM yy HH:mm', 'dd MMMM yy, HH:mm', 'd MMM yyyy HH:mm', 'd MMM yyyy, HH:mm', 'd MMMM yyyy HH:mm', 'd MMMM yyyy, HH:mm', 'dd MMM yyyy HH:mm', 'dd MMM yyyy, HH:mm', 'dd MMMM yyyy HH:mm', 'dd MMMM yyyy, HH:mm', 'd MMM yy HH:mm', 'd MMM yy, HH:mm', 'd MMMM yy HH:mm', 'd MMMM yy, HH:mm', 'dd MMM yy HH:mm', 'dd MMM yy, HH:mm', 'dd MMMM yy HH:mm', 'dd MMMM yy, HH:mm', 'd MMM yyyy HH:mm', 'd MMM yyyy, HH:mm', 'd MMMM yyyy HH:mm', 'd MMMM yyyy, HH:mm', 'dd MMM yyyy HH:mm', 'dd MMM yyyy, HH:mm', 'dd MMMM yyyy HH:mm', 'dd MMMM yyyy, HH:mm', 'MMM d yyyy HH:mm', 'MMM d yyyy, HH:mm', 'MMMM d yyyy HH:mm', 'MMMM d yyyy, HH:mm', 'MMM dd yyyy HH:mm', 'MMM dd yyyy, HH:mm', 'MMMM dd yyyy HH:mm', 'MMMM dd yyyy, HH:mm', 'yy MMM d HH:mm', 'yy MMM d, HH:mm', 'yy MMMM d HH:mm', 'yy MMMM d, HH:mm', 'yy MMM dd HH:mm', 'yy MMM dd, HH:mm', 'yy MMMM dd HH:mm', 'yy MMMM dd, HH:mm', 'yy d MMM HH:mm', 'yy d MMM, HH:mm', 'yy d MMMM HH:mm', 'yy d MMMM, HH:mm', 'yy dd MMM HH:mm', 'yy dd MMM, HH:mm', 'yy dd MMMM HH:mm', 'yy dd MMMM, HH:mm', 'd MMM HH:mm', 'd MMM, HH:mm', 'd MMMM HH:mm', 'd MMMM, HH:mm', 'dd MMM HH:mm', 'dd MMM, HH:mm', 'dd MMMM HH:mm', 'dd MMMM, HH:mm', 'yyyy MMM d', 'yyyy MMMM d', 'yyyy MMM dd', 'yyyy MMMM dd', 'yyyy d MMM', 'yyyy d MMMM', 'yyyy dd MMM', 'yyyy dd MMMM', 'd MMM yy', 'd MMMM yy', 'dd MMM yy', 'dd MMMM yy', 'd MMM yyyy', 'd MMMM yyyy', 'dd MMM yyyy', 'dd MMMM yyyy', 'd MMM yy', 'd MMMM yy', 'dd MMM yy', 'dd MMMM yy', 'd MMM yyyy', 'd MMMM yyyy', 'dd MMM yyyy', 'dd MMMM yyyy', 'MMM d yyyy', 'MMMM d yyyy', 'MMM dd yyyy', 'MMMM dd yyyy', 'yy MMM d', 'yy MMMM d', 'yy MMM dd', 'yy MMMM dd', 'yy d MMM', 'yy d MMMM', 'yy dd MMM', 'yy dd MMMM', 'yyyy MMM d HH:mm', 'yyyy MMM d, HH:mm', 'yyyy MMMM d HH:mm', 'yyyy MMMM d, HH:mm', 'yyyy MMM dd HH:mm', 'yyyy MMM dd, HH:mm', 'yyyy MMMM dd HH:mm', 'yyyy MMMM dd, HH:mm', 'yyyy d MMM HH:mm', 'yyyy d MMM, HH:mm', 'yyyy d MMMM HH:mm', 'yyyy d MMMM, HH:mm', 'yyyy dd MMM HH:mm', 'yyyy dd MMM, HH:mm', 'yyyy dd MMMM HH:mm', 'yyyy dd MMMM, HH:mm', 'd MMM yy HH:mm', 'd MMM yy, HH:mm', 'd MMMM yy HH:mm', 'd MMMM yy, HH:mm', 'dd MMM yy HH:mm', 'dd MMM yy, HH:mm', 'dd MMMM yy HH:mm', 'dd MMMM yy, HH:mm', 'd MMM yyyy HH:mm', 'd MMM yyyy, HH:mm', 'd MMMM yyyy HH:mm', 'd MMMM yyyy, HH:mm', 'dd MMM yyyy HH:mm', 'dd MMM yyyy, HH:mm', 'dd MMMM yyyy HH:mm', 'dd MMMM yyyy, HH:mm', 'd MMM yy HH:mm', 'd MMM yy, HH:mm', 'd MMMM yy HH:mm', 'd MMMM yy, HH:mm', 'dd MMM yy HH:mm', 'dd MMM yy, HH:mm', 'dd MMMM yy HH:mm', 'dd MMMM yy, HH:mm', 'd MMM yyyy HH:mm', 'd MMM yyyy, HH:mm', 'd MMMM yyyy HH:mm', 'd MMMM yyyy, HH:mm', 'dd MMM yyyy HH:mm', 'dd MMM yyyy, HH:mm', 'dd MMMM yyyy HH:mm', 'dd MMMM yyyy, HH:mm', 'MMM d yyyy HH:mm', 'MMM d yyyy, HH:mm', 'MMMM d yyyy HH:mm', 'MMMM d yyyy, HH:mm', 'MMM dd yyyy HH:mm', 'MMM dd yyyy, HH:mm', 'MMMM dd yyyy HH:mm', 'MMMM dd yyyy, HH:mm', 'yy MMM d HH:mm', 'yy MMM d, HH:mm', 'yy MMMM d HH:mm', 'yy MMMM d, HH:mm', 'yy MMM dd HH:mm', 'yy MMM dd, HH:mm', 'yy MMMM dd HH:mm', 'yy MMMM dd, HH:mm', 'yy d MMM HH:mm', 'yy d MMM, HH:mm', 'yy d MMMM HH:mm', 'yy d MMMM, HH:mm', 'yy dd MMM HH:mm', 'yy dd MMM, HH:mm', 'yy dd MMMM HH:mm', 'yy dd MMMM, HH:mm'];

var PopupComponent = function PopupComponent(_ref) {
  var hidden = _ref.hidden,
      className = _ref.className,
      popupRef = _ref.popupRef,
      onClear = _ref.onClear,
      datePopupProps = _ref.datePopupProps,
      onComplete = _ref.onComplete,
      restProps = _objectWithoutProperties(_ref, ["hidden", "className", "popupRef", "onClear", "datePopupProps", "onComplete"]);

  return /*#__PURE__*/React.createElement(Popup, _extends({
    hidden: hidden,
    keepMounted: true,
    className: className,
    ref: popupRef,
    directions: [Popup.PopupProps.Directions.BOTTOM_RIGHT, Popup.PopupProps.Directions.BOTTOM_LEFT, Popup.PopupProps.Directions.TOP_LEFT, Popup.PopupProps.Directions.TOP_RIGHT]
  }, restProps), /*#__PURE__*/React.createElement(DatePopup, _extends({
    onClear: onClear
  }, datePopupProps, {
    onComplete: onComplete,
    hidden: hidden
  })));
};

PopupComponent.propTypes = {
  hidden: PropTypes.bool,
  className: PropTypes.string,
  popupRef: PropTypes.func,
  onClear: PropTypes.func,
  datePopupProps: PropTypes.shape(DatePopup.propTypes),
  onComplete: PropTypes.func
};
/**
 * @name Date Picker
 */

var DatePicker = /*#__PURE__*/function (_PureComponent) {
  _inherits(DatePicker, _PureComponent);

  var _super = _createSuper(DatePicker);

  function DatePicker() {
    var _this;

    _classCallCheck(this, DatePicker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleChange", function (change) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          onDateChange = _this$props.onDateChange,
          withTime = _this$props.withTime,
          applyTimeInput = _this$props.applyTimeInput;
      var adjustedChange = withTime && change.date != null ? applyTimeInput(change.date, change.time) : change;
      onChange(adjustedChange);

      if (onDateChange != null) {
        onDateChange(adjustedChange);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "clear", function () {
      var change = null;

      if (_this.props.range) {
        change = {
          from: null,
          to: null
        };
      }

      _this.handleChange(change);
    });

    _defineProperty(_assertThisInitialized(_this), "popupRef", function (el) {
      _this.popup = el;
    });

    _defineProperty(_assertThisInitialized(_this), "closePopup", function () {
      _this.popup._onCloseAttempt();
    });

    _defineProperty(_assertThisInitialized(_this), "parse", memoize(function (date) {
      var parseDateInput = _this.props.parseDateInput;

      if (date instanceof Date) {
        return date;
      }

      if (typeof date === 'number') {
        return new Date(date);
      }

      return parseDateInput(date);
    }));

    _defineProperty(_assertThisInitialized(_this), "getAnchorText", function () {
      var _this$props2 = _this.props,
          range = _this$props2.range,
          datePlaceholder = _this$props2.datePlaceholder,
          dateTimePlaceholder = _this$props2.dateTimePlaceholder,
          rangePlaceholder = _this$props2.rangePlaceholder,
          withTime = _this$props2.withTime,
          displayFormat = _this$props2.displayFormat,
          displayMonthFormat = _this$props2.displayMonthFormat,
          displayDayFormat = _this$props2.displayDayFormat,
          translations = _this$props2.translations;

      var date = _this.parse(_this.props.date);

      var from = _this.parse(_this.props.from);

      var to = _this.parse(_this.props.to);

      var time = _this.formatTime();

      var text;

      if (!range && !withTime) {
        text = date ? displayFormat(date) : datePlaceholder || translations.setDate;
      } else if (!range && withTime) {
        if (!date && !time) {
          text = dateTimePlaceholder || translations.setDateTime;
        } else {
          text = "".concat(date && displayFormat(date) || '—', ", ").concat(time || '—');
        }
      } else if (!from && !to) {
        text = rangePlaceholder || translations.setPeriod;
      } else if (!to) {
        text = "".concat(displayFormat(from), " \u2014");
      } else if (!from) {
        text = "\u2014 ".concat(displayFormat(to));
      } else if (!isSameYear(from, to)) {
        text = "".concat(displayFormat(from), " \u2014 ").concat(displayFormat(to));
      } else if (!isSameMonth(from, to)) {
        text = "".concat(displayMonthFormat(from), " \u2014 ").concat(displayFormat(to));
      } else if (!isSameDay(from, to)) {
        text = "".concat(displayDayFormat(from), " \u2014 ").concat(displayFormat(to));
      } else {
        text = "".concat(displayFormat(to));
      }

      return text;
    });

    return _this;
  }

  _createClass(DatePicker, [{
    key: "formatTime",
    value: function formatTime() {
      var displayTimeFormat = this.props.displayTimeFormat;
      var date = this.parse(this.props.date);

      if (date != null) {
        return displayTimeFormat(date);
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var text = this.getAnchorText();

      if (this.props.disabled) {
        return /*#__PURE__*/React.createElement(Anchor, {
          disabled: true
        }, text);
      }

      var _this$props3 = this.props,
          className = _this$props3.className,
          popupClassName = _this$props3.popupClassName,
          clear = _this$props3.clear,
          dropdownProps = _this$props3.dropdownProps,
          translations = _this$props3.translations,
          datePopupProps = _objectWithoutProperties(_this$props3, ["className", "popupClassName", "clear", "dropdownProps", "translations"]);

      var classes = classNames(styles.datePicker, className); // We want to provide translations further down to DateInput.
      // Yet we should pass at least DateInput default translations not to have them empty.

      datePopupProps.translations = Object.assign({}, DateInput.defaultProps.translations, translations);
      return /*#__PURE__*/React.createElement(Dropdown, _extends({
        className: classes,
        anchor: text
      }, dropdownProps), /*#__PURE__*/React.createElement(PopupComponent, {
        className: popupClassName,
        popupRef: this.popupRef,
        onClear: clear ? this.clear : null,
        datePopupProps: _objectSpread2(_objectSpread2({}, datePopupProps), {}, {
          onChange: this.handleChange,
          parseDateInput: this.parse,
          time: this.formatTime()
        }),
        onComplete: this.closePopup
      }));
    }
  }]);

  return DatePicker;
}(PureComponent);

_defineProperty(DatePicker, "propTypes", {
  className: PropTypes.string,
  popupClassName: PropTypes.string,
  date: dateType,
  withTime: PropTypes.bool,
  range: PropTypes.bool,
  from: dateType,
  to: dateType,
  clear: PropTypes.bool,
  displayFormat: PropTypes.func,
  displayMonthFormat: PropTypes.func,
  displayDayFormat: PropTypes.func,
  displayTimeFormat: PropTypes.func,
  parseDateInput: PropTypes.func,
  applyTimeInput: PropTypes.func,
  datePlaceholder: PropTypes.string,
  dateTimePlaceholder: PropTypes.string,
  rangePlaceholder: PropTypes.string,
  onChange: PropTypes.func,
  // TODO: Remove in 5.0
  onDateChange: deprecatedPropType('Use "onChange"'),
  dropdownProps: PropTypes.object,
  disabled: PropTypes.bool,
  minDate: dateType,
  maxDate: dateType,
  translations: PropTypes.object
});

_defineProperty(DatePicker, "defaultProps", {
  className: '',
  date: null,
  withTime: false,
  range: false,
  from: null,
  to: null,
  clear: false,
  displayFormat: function displayFormat(date) {
    return date ? format(date, 'd MMM yyyy') : '';
  },
  displayMonthFormat: function displayMonthFormat(date) {
    return date ? format(date, 'd MMM') : '';
  },
  displayDayFormat: function displayDayFormat(date) {
    return date ? format(date, 'd') : '';
  },
  displayTimeFormat: function displayTimeFormat(date) {
    return date ? format(date, 'HH:mm') : '';
  },
  datePlaceholder: 'Set a date',
  dateTimePlaceholder: 'Set date and time',
  rangePlaceholder: 'Set a period',
  minDate: null,
  maxDate: null,
  onChange: function onChange() {},
  translations: {
    setDate: 'Set a date',
    setDateTime: 'Set date and time',
    setPeriod: 'Set a period'
  },
  applyTimeInput: function applyTimeInput(date, timeString) {
    var _timeString$split;

    var _ref2 = (_timeString$split = timeString === null || timeString === void 0 ? void 0 : timeString.split(':')) !== null && _timeString$split !== void 0 ? _timeString$split : [],
        _ref3 = _slicedToArray(_ref2, 2),
        hours = _ref3[0],
        minutes = _ref3[1];

    return minutes != null ? set(date, {
      hours: hours,
      minutes: minutes
    }) : date;
  },
  parseDateInput: function parseDateInput(string) {
    if (!string) {
      return null;
    }

    var today = new Date();

    var _iterator = _createForOfIteratorHelper(formats),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var format = _step.value;
        var date = parse(string, format, today);

        if (isValid(date)) {
          return date;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return null;
  }
});

export default DatePicker;
