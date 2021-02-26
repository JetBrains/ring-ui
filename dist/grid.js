import { _ as _inherits, a as _createSuper, b as _classCallCheck, c as _createClass, d as _defineProperty, e as _objectWithoutProperties, f as _extends } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styleInject from 'style-inject';

var css_248z = "/* https://readymag.com/artemtiunov/RingUILanguage/colours/ *//*\nUnit shouldn't be CSS custom property because it is not intended to change\nAlso it won't form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/.global_clearfix__1FS6o {\n  &::after {\n    display: block;\n    clear: both;\n\n    content: '';\n  }\n}.global_font__2H0e4 {\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}.global_font-lower__11Bp7 {\n\n  line-height: var(--ring-line-height-lower);\n}.global_font-smaller__2YCID {\n\n  font-size: var(--ring-font-size-smaller);\n}.global_font-smaller-lower__33Wmu {\n\n  line-height: var(--ring-line-height-lowest);\n}.global_font-larger-lower__2rrRR {\n\n  font-size: var(--ring-font-size-larger);\n}.global_font-larger__1-iV9 {\n\n  line-height: var(--ring-line-height-taller);\n}/* To be used at large sizes *//* As close as possible to Helvetica Neue Thin (to replace Gotham) */.global_thin-font__1F7aK {\n  font-family: \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}.global_monospace-font__1XOVq {\n  font-family: var(--ring-font-family-monospace);\n  font-size: var(--ring-font-size-smaller);\n}.global_ellipsis__xhH6M {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}.global_resetButton__WQfrm {\n  overflow: visible;\n\n  padding: 0;\n\n  text-align: left;\n\n  color: inherit;\n  border: 0;\n\n  background-color: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}/* Note: footer also has top margin which isn't taken into account here *//* Media breakpoints (minimal values) *//* Media queries */\n\n/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #475159;\n  --ring-borders-color: #b8d1e5;\n  --ring-dark-borders-color: #406380;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: #bbb;\n  --ring-border-hover-color: #80c6ff;\n  --ring-dark-border-hover-color: #70b1e6;\n  --ring-icon-hover-color: var(--ring-link-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n  --ring-pinned-shadow-color: #737577;\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1b8833;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #ebf6ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n  --ring-removed-background-color: #ffd5cb;\n  --ring-warning-background-color: #faeccd;\n  --ring-added-background-color: #bce8bb;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #707070;\n  --ring-code-meta-color: #707070;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #007a00;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n  --ring-font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, \"Bitstream Vera Sans Mono\", \"Ubuntu Mono\", Consolas, \"Courier New\", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n\n.grid_container-fluid__3iEi0,\n.grid_container__1IuF9 {\n  margin-right: auto;\n  margin-left: auto;\n}\n\n.grid_container-fluid__3iEi0 {\n  min-width: 320px;\n  padding-right: 16px;\n  padding-left: 16px;\n}\n\n.grid_row__9DCyr {\n  display: flex;\n  flex: 0 1 auto;\n  flex-flow: row wrap;\n\n  box-sizing: border-box;\n  margin-right: -8px;\n  margin-left: -8px;\n}\n\n.grid_row__9DCyr.grid_reverse__w_FRt {\n  flex-direction: row-reverse;\n}\n\n.grid_col__1JQpM {\n  margin-top: 8px;\n  margin-bottom: 8px;\n}\n\n.grid_col__1JQpM.grid_reverse__w_FRt {\n  flex-direction: column-reverse;\n}\n\n.grid_col-xs__1USaI,\n.grid_col-xs-1__2KRVo,\n.grid_col-xs-2__dx46W,\n.grid_col-xs-3__1Bv3T,\n.grid_col-xs-4__30B7a,\n.grid_col-xs-5__hoRt5,\n.grid_col-xs-6__3aUzX,\n.grid_col-xs-7__1d8gc,\n.grid_col-xs-8__16KfK,\n.grid_col-xs-9__3x7T_,\n.grid_col-xs-10__3e3-v,\n.grid_col-xs-11__1Tkke,\n.grid_col-xs-12__txxXp,\n.grid_col-xs-offset-0__3YdD7,\n.grid_col-xs-offset-1__2iuGm,\n.grid_col-xs-offset-2__MySSU,\n.grid_col-xs-offset-3__Z9I92,\n.grid_col-xs-offset-4__iO-1S,\n.grid_col-xs-offset-5__3mY6y,\n.grid_col-xs-offset-6__3hxel,\n.grid_col-xs-offset-7__2MC4A,\n.grid_col-xs-offset-8__3uQrq,\n.grid_col-xs-offset-9__2s5E-,\n.grid_col-xs-offset-10__1Dcmf,\n.grid_col-xs-offset-11__3v2h6,\n.grid_col-xs-offset-12__1gy6s {\n  flex: 0 0 auto;\n\n  box-sizing: border-box;\n  padding-right: 8px;\n  padding-left: 8px;\n}\n\n.grid_col-xs__1USaI {\n  flex-basis: 0;\n  flex-grow: 1;\n\n  max-width: 100%;\n}\n\n.grid_col-xs-1__2KRVo {\n  flex-basis: 8.33333333%;\n\n  max-width: 8.33333333%;\n}\n\n.grid_col-xs-2__dx46W {\n  flex-basis: 16.66666667%;\n\n  max-width: 16.66666667%;\n}\n\n.grid_col-xs-3__1Bv3T {\n  flex-basis: 25%;\n\n  max-width: 25%;\n}\n\n.grid_col-xs-4__30B7a {\n  flex-basis: 33.33333333%;\n\n  max-width: 33.33333333%;\n}\n\n.grid_col-xs-5__hoRt5 {\n  flex-basis: 41.66666667%;\n\n  max-width: 41.66666667%;\n}\n\n.grid_col-xs-6__3aUzX {\n  flex-basis: 50%;\n\n  max-width: 50%;\n}\n\n.grid_col-xs-7__1d8gc {\n  flex-basis: 58.33333333%;\n\n  max-width: 58.33333333%;\n}\n\n.grid_col-xs-8__16KfK {\n  flex-basis: 66.66666667%;\n\n  max-width: 66.66666667%;\n}\n\n.grid_col-xs-9__3x7T_ {\n  flex-basis: 75%;\n\n  max-width: 75%;\n}\n\n.grid_col-xs-10__3e3-v {\n  flex-basis: 83.33333333%;\n\n  max-width: 83.33333333%;\n}\n\n.grid_col-xs-11__1Tkke {\n  flex-basis: 91.66666667%;\n\n  max-width: 91.66666667%;\n}\n\n.grid_col-xs-12__txxXp {\n  flex-basis: 100%;\n\n  max-width: 100%;\n}\n\n.grid_col-xs-offset-0__3YdD7 {\n  margin-left: 0;\n}\n\n.grid_col-xs-offset-1__2iuGm {\n  margin-left: 8.33333333%;\n}\n\n.grid_col-xs-offset-2__MySSU {\n  margin-left: 16.66666667%;\n}\n\n.grid_col-xs-offset-3__Z9I92 {\n  margin-left: 25%;\n}\n\n.grid_col-xs-offset-4__iO-1S {\n  margin-left: 33.33333333%;\n}\n\n.grid_col-xs-offset-5__3mY6y {\n  margin-left: 41.66666667%;\n}\n\n.grid_col-xs-offset-6__3hxel {\n  margin-left: 50%;\n}\n\n.grid_col-xs-offset-7__2MC4A {\n  margin-left: 58.33333333%;\n}\n\n.grid_col-xs-offset-8__3uQrq {\n  margin-left: 66.66666667%;\n}\n\n.grid_col-xs-offset-9__2s5E- {\n  margin-left: 75%;\n}\n\n.grid_col-xs-offset-10__1Dcmf {\n  margin-left: 83.33333333%;\n}\n\n.grid_col-xs-offset-11__3v2h6 {\n  margin-left: 91.66666667%;\n}\n\n.grid_start-xs__1j-hV {\n  justify-content: flex-start;\n\n  text-align: start;\n}\n\n.grid_center-xs__ZvIb7 {\n  justify-content: center;\n\n  text-align: center;\n}\n\n.grid_end-xs__2BXXX {\n  justify-content: flex-end;\n\n  text-align: end;\n}\n\n.grid_top-xs__1-1ng {\n  align-items: flex-start;\n}\n\n.grid_middle-xs__39mVd {\n  align-items: center;\n}\n\n.grid_baseline-xs__1zJkn {\n  align-items: baseline;\n}\n\n.grid_bottom-xs__eQlZE {\n  align-items: flex-end;\n}\n\n.grid_around-xs__2UI8S {\n  justify-content: space-around;\n}\n\n.grid_between-xs__1fftt {\n  justify-content: space-between;\n}\n\n.grid_first-xs__39PBd {\n  order: -1;\n}\n\n.grid_last-xs__2Fa4h {\n  order: 1;\n}\n\n@media (min-width: 640px) and (max-width: 959px) {\n  .grid_container__1IuF9 {\n    width: 656px;\n  }\n\n  .grid_col-sm__y9dgt,\n  .grid_col-sm-1__11SFY,\n  .grid_col-sm-2__3R4xV,\n  .grid_col-sm-3__2hTCM,\n  .grid_col-sm-4__2nEwh,\n  .grid_col-sm-5__3C4Vj,\n  .grid_col-sm-6__10YV0,\n  .grid_col-sm-7__Uo69t,\n  .grid_col-sm-8__2q9Kc,\n  .grid_col-sm-9__BP58C,\n  .grid_col-sm-10__ySK3Q,\n  .grid_col-sm-11__2EU-2,\n  .grid_col-sm-12__1jbd3,\n  .grid_col-sm-offset-0__3a6p0,\n  .grid_col-sm-offset-1__19S6P,\n  .grid_col-sm-offset-2__18dpu,\n  .grid_col-sm-offset-3__1KBg4,\n  .grid_col-sm-offset-4__3Ermo,\n  .grid_col-sm-offset-5__1Tf3g,\n  .grid_col-sm-offset-6__qQYho,\n  .grid_col-sm-offset-7__3xgQO,\n  .grid_col-sm-offset-8__35QR1,\n  .grid_col-sm-offset-9__2hZBZ,\n  .grid_col-sm-offset-10__2qfn9,\n  .grid_col-sm-offset-11__tBSLt,\n  .grid_col-sm-offset-12__1oAwC {\n    flex: 0 0 auto;\n\n    box-sizing: border-box;\n    padding-right: 8px;\n    padding-left: 8px;\n  }\n\n  .grid_col-sm__y9dgt {\n    flex-basis: 0;\n    flex-grow: 1;\n\n    max-width: 100%;\n  }\n\n  .grid_col-sm-1__11SFY {\n    flex-basis: 8.33333333%;\n\n    max-width: 8.33333333%;\n  }\n\n  .grid_col-sm-2__3R4xV {\n    flex-basis: 16.66666667%;\n\n    max-width: 16.66666667%;\n  }\n\n  .grid_col-sm-3__2hTCM {\n    flex-basis: 25%;\n\n    max-width: 25%;\n  }\n\n  .grid_col-sm-4__2nEwh {\n    flex-basis: 33.33333333%;\n\n    max-width: 33.33333333%;\n  }\n\n  .grid_col-sm-5__3C4Vj {\n    flex-basis: 41.66666667%;\n\n    max-width: 41.66666667%;\n  }\n\n  .grid_col-sm-6__10YV0 {\n    flex-basis: 50%;\n\n    max-width: 50%;\n  }\n\n  .grid_col-sm-7__Uo69t {\n    flex-basis: 58.33333333%;\n\n    max-width: 58.33333333%;\n  }\n\n  .grid_col-sm-8__2q9Kc {\n    flex-basis: 66.66666667%;\n\n    max-width: 66.66666667%;\n  }\n\n  .grid_col-sm-9__BP58C {\n    flex-basis: 75%;\n\n    max-width: 75%;\n  }\n\n  .grid_col-sm-10__ySK3Q {\n    flex-basis: 83.33333333%;\n\n    max-width: 83.33333333%;\n  }\n\n  .grid_col-sm-11__2EU-2 {\n    flex-basis: 91.66666667%;\n\n    max-width: 91.66666667%;\n  }\n\n  .grid_col-sm-12__1jbd3 {\n    flex-basis: 100%;\n\n    max-width: 100%;\n  }\n\n  .grid_col-sm-offset-0__3a6p0 {\n    margin-left: 0;\n  }\n\n  .grid_col-sm-offset-1__19S6P {\n    margin-left: 8.33333333%;\n  }\n\n  .grid_col-sm-offset-2__18dpu {\n    margin-left: 16.66666667%;\n  }\n\n  .grid_col-sm-offset-3__1KBg4 {\n    margin-left: 25%;\n  }\n\n  .grid_col-sm-offset-4__3Ermo {\n    margin-left: 33.33333333%;\n  }\n\n  .grid_col-sm-offset-5__1Tf3g {\n    margin-left: 41.66666667%;\n  }\n\n  .grid_col-sm-offset-6__qQYho {\n    margin-left: 50%;\n  }\n\n  .grid_col-sm-offset-7__3xgQO {\n    margin-left: 58.33333333%;\n  }\n\n  .grid_col-sm-offset-8__35QR1 {\n    margin-left: 66.66666667%;\n  }\n\n  .grid_col-sm-offset-9__2hZBZ {\n    margin-left: 75%;\n  }\n\n  .grid_col-sm-offset-10__2qfn9 {\n    margin-left: 83.33333333%;\n  }\n\n  .grid_col-sm-offset-11__tBSLt {\n    margin-left: 91.66666667%;\n  }\n\n  .grid_start-sm__1hzYt {\n    justify-content: flex-start;\n\n    text-align: start;\n  }\n\n  .grid_center-sm__1dli2 {\n    justify-content: center;\n\n    text-align: center;\n  }\n\n  .grid_end-sm__2MbIJ {\n    justify-content: flex-end;\n\n    text-align: end;\n  }\n\n  .grid_top-sm__3iCNt {\n    align-items: flex-start;\n  }\n\n  .grid_middle-sm__2BKyy {\n    align-items: center;\n  }\n\n  .grid_baseline-sm__3GIL5 {\n    align-items: baseline;\n  }\n\n  .grid_bottom-sm__1v9V4 {\n    align-items: flex-end;\n  }\n\n  .grid_around-sm__3JDWA {\n    justify-content: space-around;\n  }\n\n  .grid_between-sm__1oGqQ {\n    justify-content: space-between;\n  }\n\n  .grid_first-sm__1x4mm {\n    order: -1;\n  }\n\n  .grid_last-sm__ctQaW {\n    order: 1;\n  }\n}\n\n@media (min-width: 960px) and (max-width: 1199px) {\n  .grid_container__1IuF9 {\n    width: 976px;\n  }\n\n  .grid_col-md__1ZsPn,\n  .grid_col-md-1__3JD87,\n  .grid_col-md-2__2LjNb,\n  .grid_col-md-3__3M5x9,\n  .grid_col-md-4__3gzkM,\n  .grid_col-md-5__37FFI,\n  .grid_col-md-6__21Odt,\n  .grid_col-md-7__2omzN,\n  .grid_col-md-8__2H71w,\n  .grid_col-md-9__WO8eW,\n  .grid_col-md-10__1wios,\n  .grid_col-md-11__PpHNS,\n  .grid_col-md-12__3vwkZ,\n  .grid_col-md-offset-0__1LKyV,\n  .grid_col-md-offset-1__21SrG,\n  .grid_col-md-offset-2__3R95W,\n  .grid_col-md-offset-3__1nW-1,\n  .grid_col-md-offset-4__2jZpq,\n  .grid_col-md-offset-5__O-m1P,\n  .grid_col-md-offset-6__2BRCs,\n  .grid_col-md-offset-7__wWuuq,\n  .grid_col-md-offset-8__2tMkM,\n  .grid_col-md-offset-9__193SC,\n  .grid_col-md-offset-10__1kln_,\n  .grid_col-md-offset-11__y5-5i,\n  .grid_col-md-offset-12__2Cudt {\n    flex: 0 0 auto;\n\n    box-sizing: border-box;\n    padding-right: 8px;\n    padding-left: 8px;\n  }\n\n  .grid_col-md__1ZsPn {\n    flex-basis: 0;\n    flex-grow: 1;\n\n    max-width: 100%;\n  }\n\n  .grid_col-md-1__3JD87 {\n    flex-basis: 8.33333333%;\n\n    max-width: 8.33333333%;\n  }\n\n  .grid_col-md-2__2LjNb {\n    flex-basis: 16.66666667%;\n\n    max-width: 16.66666667%;\n  }\n\n  .grid_col-md-3__3M5x9 {\n    flex-basis: 25%;\n\n    max-width: 25%;\n  }\n\n  .grid_col-md-4__3gzkM {\n    flex-basis: 33.33333333%;\n\n    max-width: 33.33333333%;\n  }\n\n  .grid_col-md-5__37FFI {\n    flex-basis: 41.66666667%;\n\n    max-width: 41.66666667%;\n  }\n\n  .grid_col-md-6__21Odt {\n    flex-basis: 50%;\n\n    max-width: 50%;\n  }\n\n  .grid_col-md-7__2omzN {\n    flex-basis: 58.33333333%;\n\n    max-width: 58.33333333%;\n  }\n\n  .grid_col-md-8__2H71w {\n    flex-basis: 66.66666667%;\n\n    max-width: 66.66666667%;\n  }\n\n  .grid_col-md-9__WO8eW {\n    flex-basis: 75%;\n\n    max-width: 75%;\n  }\n\n  .grid_col-md-10__1wios {\n    flex-basis: 83.33333333%;\n\n    max-width: 83.33333333%;\n  }\n\n  .grid_col-md-11__PpHNS {\n    flex-basis: 91.66666667%;\n\n    max-width: 91.66666667%;\n  }\n\n  .grid_col-md-12__3vwkZ {\n    flex-basis: 100%;\n\n    max-width: 100%;\n  }\n\n  .grid_col-md-offset-0__1LKyV {\n    margin-left: 0;\n  }\n\n  .grid_col-md-offset-1__21SrG {\n    margin-left: 8.33333333%;\n  }\n\n  .grid_col-md-offset-2__3R95W {\n    margin-left: 16.66666667%;\n  }\n\n  .grid_col-md-offset-3__1nW-1 {\n    margin-left: 25%;\n  }\n\n  .grid_col-md-offset-4__2jZpq {\n    margin-left: 33.33333333%;\n  }\n\n  .grid_col-md-offset-5__O-m1P {\n    margin-left: 41.66666667%;\n  }\n\n  .grid_col-md-offset-6__2BRCs {\n    margin-left: 50%;\n  }\n\n  .grid_col-md-offset-7__wWuuq {\n    margin-left: 58.33333333%;\n  }\n\n  .grid_col-md-offset-8__2tMkM {\n    margin-left: 66.66666667%;\n  }\n\n  .grid_col-md-offset-9__193SC {\n    margin-left: 75%;\n  }\n\n  .grid_col-md-offset-10__1kln_ {\n    margin-left: 83.33333333%;\n  }\n\n  .grid_col-md-offset-11__y5-5i {\n    margin-left: 91.66666667%;\n  }\n\n  .grid_start-md__2C4cn {\n    justify-content: flex-start;\n\n    text-align: start;\n  }\n\n  .grid_center-md__3CSmt {\n    justify-content: center;\n\n    text-align: center;\n  }\n\n  .grid_end-md__2rxQR {\n    justify-content: flex-end;\n\n    text-align: end;\n  }\n\n  .grid_top-md__Jb2ZO {\n    align-items: flex-start;\n  }\n\n  .grid_middle-md__3yR86 {\n    align-items: center;\n  }\n\n  .grid_baseline-md__2h843 {\n    align-items: baseline;\n  }\n\n  .grid_bottom-md__Q6cmx {\n    align-items: flex-end;\n  }\n\n  .grid_around-md__YeERo {\n    justify-content: space-around;\n  }\n\n  .grid_between-md__87xoY {\n    justify-content: space-between;\n  }\n\n  .grid_first-md__3pWi_ {\n    order: -1;\n  }\n\n  .grid_last-md__3okz6 {\n    order: 1;\n  }\n}\n\n@media (min-width: 1200px) {\n  .grid_container__1IuF9 {\n    width: 1216px;\n  }\n\n  .grid_col-lg__138FE,\n  .grid_col-lg-1__4YQCA,\n  .grid_col-lg-2__24zU-,\n  .grid_col-lg-3__3TcGz,\n  .grid_col-lg-4__2tOfx,\n  .grid_col-lg-5__2jDfs,\n  .grid_col-lg-6__1lYpw,\n  .grid_col-lg-7__3P-_V,\n  .grid_col-lg-8__1D0Hy,\n  .grid_col-lg-9__3FDbM,\n  .grid_col-lg-10__1WD0C,\n  .grid_col-lg-11__RrPKB,\n  .grid_col-lg-12__3Or1j,\n  .grid_col-lg-offset-0__2-KRt,\n  .grid_col-lg-offset-1__3aRHK,\n  .grid_col-lg-offset-2__1homZ,\n  .grid_col-lg-offset-3__juST8,\n  .grid_col-lg-offset-4__1jXKB,\n  .grid_col-lg-offset-5__3q-DL,\n  .grid_col-lg-offset-6__18A6R,\n  .grid_col-lg-offset-7__3vj7C,\n  .grid_col-lg-offset-8__3ish_,\n  .grid_col-lg-offset-9__1jots,\n  .grid_col-lg-offset-10__1Xp55,\n  .grid_col-lg-offset-11__11S0p,\n  .grid_col-lg-offset-12__31fZS {\n    flex: 0 0 auto;\n\n    box-sizing: border-box;\n    padding-right: 8px;\n    padding-left: 8px;\n  }\n\n  .grid_col-lg__138FE {\n    flex-basis: 0;\n    flex-grow: 1;\n\n    max-width: 100%;\n  }\n\n  .grid_col-lg-1__4YQCA {\n    flex-basis: 8.33333333%;\n\n    max-width: 8.33333333%;\n  }\n\n  .grid_col-lg-2__24zU- {\n    flex-basis: 16.66666667%;\n\n    max-width: 16.66666667%;\n  }\n\n  .grid_col-lg-3__3TcGz {\n    flex-basis: 25%;\n\n    max-width: 25%;\n  }\n\n  .grid_col-lg-4__2tOfx {\n    flex-basis: 33.33333333%;\n\n    max-width: 33.33333333%;\n  }\n\n  .grid_col-lg-5__2jDfs {\n    flex-basis: 41.66666667%;\n\n    max-width: 41.66666667%;\n  }\n\n  .grid_col-lg-6__1lYpw {\n    flex-basis: 50%;\n\n    max-width: 50%;\n  }\n\n  .grid_col-lg-7__3P-_V {\n    flex-basis: 58.33333333%;\n\n    max-width: 58.33333333%;\n  }\n\n  .grid_col-lg-8__1D0Hy {\n    flex-basis: 66.66666667%;\n\n    max-width: 66.66666667%;\n  }\n\n  .grid_col-lg-9__3FDbM {\n    flex-basis: 75%;\n\n    max-width: 75%;\n  }\n\n  .grid_col-lg-10__1WD0C {\n    flex-basis: 83.33333333%;\n\n    max-width: 83.33333333%;\n  }\n\n  .grid_col-lg-11__RrPKB {\n    flex-basis: 91.66666667%;\n\n    max-width: 91.66666667%;\n  }\n\n  .grid_col-lg-12__3Or1j {\n    flex-basis: 100%;\n\n    max-width: 100%;\n  }\n\n  .grid_col-lg-offset-0__2-KRt {\n    margin-left: 0;\n  }\n\n  .grid_col-lg-offset-1__3aRHK {\n    margin-left: 8.33333333%;\n  }\n\n  .grid_col-lg-offset-2__1homZ {\n    margin-left: 16.66666667%;\n  }\n\n  .grid_col-lg-offset-3__juST8 {\n    margin-left: 25%;\n  }\n\n  .grid_col-lg-offset-4__1jXKB {\n    margin-left: 33.33333333%;\n  }\n\n  .grid_col-lg-offset-5__3q-DL {\n    margin-left: 41.66666667%;\n  }\n\n  .grid_col-lg-offset-6__18A6R {\n    margin-left: 50%;\n  }\n\n  .grid_col-lg-offset-7__3vj7C {\n    margin-left: 58.33333333%;\n  }\n\n  .grid_col-lg-offset-8__3ish_ {\n    margin-left: 66.66666667%;\n  }\n\n  .grid_col-lg-offset-9__1jots {\n    margin-left: 75%;\n  }\n\n  .grid_col-lg-offset-10__1Xp55 {\n    margin-left: 83.33333333%;\n  }\n\n  .grid_col-lg-offset-11__11S0p {\n    margin-left: 91.66666667%;\n  }\n\n  .grid_start-lg__2Mqi4 {\n    justify-content: flex-start;\n\n    text-align: start;\n  }\n\n  .grid_center-lg__W1DjB {\n    justify-content: center;\n\n    text-align: center;\n  }\n\n  .grid_end-lg__S_DRY {\n    justify-content: flex-end;\n\n    text-align: end;\n  }\n\n  .grid_top-lg__2rXab {\n    align-items: flex-start;\n  }\n\n  .grid_middle-lg__3242- {\n    align-items: center;\n  }\n\n  .grid_baseline-lg__1AgAK {\n    align-items: baseline;\n  }\n\n  .grid_bottom-lg__1ijzp {\n    align-items: flex-end;\n  }\n\n  .grid_around-lg__2p39R {\n    justify-content: space-around;\n  }\n\n  .grid_between-lg__1kW4E {\n    justify-content: space-between;\n  }\n\n  .grid_first-lg__3sags {\n    order: -1;\n  }\n\n  .grid_last-lg__1-zcn {\n    order: 1;\n  }\n}\n";
var styles = {"unit":"8px","breakpoint-small":"640px","breakpoint-middle":"960px","breakpoint-large":"1200px","large-screen-media":"(min-width: 1200px)","middle-screen-media":"(min-width: 960px) and (max-width: calc(1200px - 1px))","small-screen-media":"(min-width: 640px) and (max-width: calc(960px - 1px))","gutterWidth":"(8px*2)","gutterCompensation":"calc((8px*2) / -2)","outerMargin":"calc(8px*2)","containerSmall":"calc(640px + (8px*2))","containerMedium":"calc(960px + (8px*2))","containerLarge":"calc(1200px + (8px*2))","width-1":"8.33333333%","width-2":"16.66666667%","width-3":"25%","width-4":"33.33333333%","width-5":"41.66666667%","width-6":"50%","width-7":"58.33333333%","width-8":"66.66666667%","width-9":"75%","width-10":"83.33333333%","width-11":"91.66666667%","width-12":"100%","container-fluid":"grid_container-fluid__3iEi0","container":"grid_container__1IuF9","row":"grid_row__9DCyr","reverse":"grid_reverse__w_FRt","col":"grid_col__1JQpM","col-xs":"grid_col-xs__1USaI","col-xs-1":"grid_col-xs-1__2KRVo","col-xs-2":"grid_col-xs-2__dx46W","col-xs-3":"grid_col-xs-3__1Bv3T","col-xs-4":"grid_col-xs-4__30B7a","col-xs-5":"grid_col-xs-5__hoRt5","col-xs-6":"grid_col-xs-6__3aUzX","col-xs-7":"grid_col-xs-7__1d8gc","col-xs-8":"grid_col-xs-8__16KfK","col-xs-9":"grid_col-xs-9__3x7T_","col-xs-10":"grid_col-xs-10__3e3-v","col-xs-11":"grid_col-xs-11__1Tkke","col-xs-12":"grid_col-xs-12__txxXp","col-xs-offset-0":"grid_col-xs-offset-0__3YdD7","col-xs-offset-1":"grid_col-xs-offset-1__2iuGm","col-xs-offset-2":"grid_col-xs-offset-2__MySSU","col-xs-offset-3":"grid_col-xs-offset-3__Z9I92","col-xs-offset-4":"grid_col-xs-offset-4__iO-1S","col-xs-offset-5":"grid_col-xs-offset-5__3mY6y","col-xs-offset-6":"grid_col-xs-offset-6__3hxel","col-xs-offset-7":"grid_col-xs-offset-7__2MC4A","col-xs-offset-8":"grid_col-xs-offset-8__3uQrq","col-xs-offset-9":"grid_col-xs-offset-9__2s5E-","col-xs-offset-10":"grid_col-xs-offset-10__1Dcmf","col-xs-offset-11":"grid_col-xs-offset-11__3v2h6","col-xs-offset-12":"grid_col-xs-offset-12__1gy6s","start-xs":"grid_start-xs__1j-hV","center-xs":"grid_center-xs__ZvIb7","end-xs":"grid_end-xs__2BXXX","top-xs":"grid_top-xs__1-1ng","middle-xs":"grid_middle-xs__39mVd","baseline-xs":"grid_baseline-xs__1zJkn","bottom-xs":"grid_bottom-xs__eQlZE","around-xs":"grid_around-xs__2UI8S","between-xs":"grid_between-xs__1fftt","first-xs":"grid_first-xs__39PBd","last-xs":"grid_last-xs__2Fa4h","col-sm":"grid_col-sm__y9dgt","col-sm-1":"grid_col-sm-1__11SFY","col-sm-2":"grid_col-sm-2__3R4xV","col-sm-3":"grid_col-sm-3__2hTCM","col-sm-4":"grid_col-sm-4__2nEwh","col-sm-5":"grid_col-sm-5__3C4Vj","col-sm-6":"grid_col-sm-6__10YV0","col-sm-7":"grid_col-sm-7__Uo69t","col-sm-8":"grid_col-sm-8__2q9Kc","col-sm-9":"grid_col-sm-9__BP58C","col-sm-10":"grid_col-sm-10__ySK3Q","col-sm-11":"grid_col-sm-11__2EU-2","col-sm-12":"grid_col-sm-12__1jbd3","col-sm-offset-0":"grid_col-sm-offset-0__3a6p0","col-sm-offset-1":"grid_col-sm-offset-1__19S6P","col-sm-offset-2":"grid_col-sm-offset-2__18dpu","col-sm-offset-3":"grid_col-sm-offset-3__1KBg4","col-sm-offset-4":"grid_col-sm-offset-4__3Ermo","col-sm-offset-5":"grid_col-sm-offset-5__1Tf3g","col-sm-offset-6":"grid_col-sm-offset-6__qQYho","col-sm-offset-7":"grid_col-sm-offset-7__3xgQO","col-sm-offset-8":"grid_col-sm-offset-8__35QR1","col-sm-offset-9":"grid_col-sm-offset-9__2hZBZ","col-sm-offset-10":"grid_col-sm-offset-10__2qfn9","col-sm-offset-11":"grid_col-sm-offset-11__tBSLt","col-sm-offset-12":"grid_col-sm-offset-12__1oAwC","start-sm":"grid_start-sm__1hzYt","center-sm":"grid_center-sm__1dli2","end-sm":"grid_end-sm__2MbIJ","top-sm":"grid_top-sm__3iCNt","middle-sm":"grid_middle-sm__2BKyy","baseline-sm":"grid_baseline-sm__3GIL5","bottom-sm":"grid_bottom-sm__1v9V4","around-sm":"grid_around-sm__3JDWA","between-sm":"grid_between-sm__1oGqQ","first-sm":"grid_first-sm__1x4mm","last-sm":"grid_last-sm__ctQaW","col-md":"grid_col-md__1ZsPn","col-md-1":"grid_col-md-1__3JD87","col-md-2":"grid_col-md-2__2LjNb","col-md-3":"grid_col-md-3__3M5x9","col-md-4":"grid_col-md-4__3gzkM","col-md-5":"grid_col-md-5__37FFI","col-md-6":"grid_col-md-6__21Odt","col-md-7":"grid_col-md-7__2omzN","col-md-8":"grid_col-md-8__2H71w","col-md-9":"grid_col-md-9__WO8eW","col-md-10":"grid_col-md-10__1wios","col-md-11":"grid_col-md-11__PpHNS","col-md-12":"grid_col-md-12__3vwkZ","col-md-offset-0":"grid_col-md-offset-0__1LKyV","col-md-offset-1":"grid_col-md-offset-1__21SrG","col-md-offset-2":"grid_col-md-offset-2__3R95W","col-md-offset-3":"grid_col-md-offset-3__1nW-1","col-md-offset-4":"grid_col-md-offset-4__2jZpq","col-md-offset-5":"grid_col-md-offset-5__O-m1P","col-md-offset-6":"grid_col-md-offset-6__2BRCs","col-md-offset-7":"grid_col-md-offset-7__wWuuq","col-md-offset-8":"grid_col-md-offset-8__2tMkM","col-md-offset-9":"grid_col-md-offset-9__193SC","col-md-offset-10":"grid_col-md-offset-10__1kln_","col-md-offset-11":"grid_col-md-offset-11__y5-5i","col-md-offset-12":"grid_col-md-offset-12__2Cudt","start-md":"grid_start-md__2C4cn","center-md":"grid_center-md__3CSmt","end-md":"grid_end-md__2rxQR","top-md":"grid_top-md__Jb2ZO","middle-md":"grid_middle-md__3yR86","baseline-md":"grid_baseline-md__2h843","bottom-md":"grid_bottom-md__Q6cmx","around-md":"grid_around-md__YeERo","between-md":"grid_between-md__87xoY","first-md":"grid_first-md__3pWi_","last-md":"grid_last-md__3okz6","col-lg":"grid_col-lg__138FE","col-lg-1":"grid_col-lg-1__4YQCA","col-lg-2":"grid_col-lg-2__24zU-","col-lg-3":"grid_col-lg-3__3TcGz","col-lg-4":"grid_col-lg-4__2tOfx","col-lg-5":"grid_col-lg-5__2jDfs","col-lg-6":"grid_col-lg-6__1lYpw","col-lg-7":"grid_col-lg-7__3P-_V","col-lg-8":"grid_col-lg-8__1D0Hy","col-lg-9":"grid_col-lg-9__3FDbM","col-lg-10":"grid_col-lg-10__1WD0C","col-lg-11":"grid_col-lg-11__RrPKB","col-lg-12":"grid_col-lg-12__3Or1j","col-lg-offset-0":"grid_col-lg-offset-0__2-KRt","col-lg-offset-1":"grid_col-lg-offset-1__3aRHK","col-lg-offset-2":"grid_col-lg-offset-2__1homZ","col-lg-offset-3":"grid_col-lg-offset-3__juST8","col-lg-offset-4":"grid_col-lg-offset-4__1jXKB","col-lg-offset-5":"grid_col-lg-offset-5__3q-DL","col-lg-offset-6":"grid_col-lg-offset-6__18A6R","col-lg-offset-7":"grid_col-lg-offset-7__3vj7C","col-lg-offset-8":"grid_col-lg-offset-8__3ish_","col-lg-offset-9":"grid_col-lg-offset-9__1jots","col-lg-offset-10":"grid_col-lg-offset-10__1Xp55","col-lg-offset-11":"grid_col-lg-offset-11__11S0p","col-lg-offset-12":"grid_col-lg-offset-12__31fZS","start-lg":"grid_start-lg__2Mqi4","center-lg":"grid_center-lg__W1DjB","end-lg":"grid_end-lg__S_DRY","top-lg":"grid_top-lg__2rXab","middle-lg":"grid_middle-lg__3242-","baseline-lg":"grid_baseline-lg__1AgAK","bottom-lg":"grid_bottom-lg__1ijzp","around-lg":"grid_around-lg__2p39R","between-lg":"grid_between-lg__1kW4E","first-lg":"grid_first-lg__3sags","last-lg":"grid_last-lg__1-zcn"};
styleInject(css_248z);

var ModifierType = PropTypes.oneOf(['xs', 'sm', 'md', 'lg']);
var modifierKeys = ['start', 'center', 'end', // text-align, justify-content
'around', 'between', // justify-content
'top', 'middle', 'baseline', 'bottom', // align-items
'first', 'last' // order
];
/**
 * Converts xs="middle" to class "middle-xs"
 * @param {Object} props incoming props
 * @returns {Array} result modifier classes
 */

function getModifierClassNames(props) {
  return modifierKeys.reduce(function (result, key) {
    if (props[key]) {
      return result.concat(styles["".concat(key, "-").concat(props[key])]);
    }

    return result;
  }, []);
}

var Row = /*#__PURE__*/function (_Component) {
  _inherits(Row, _Component);

  var _super = _createSuper(Row);

  function Row() {
    _classCallCheck(this, Row);

    return _super.apply(this, arguments);
  }

  _createClass(Row, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          reverse = _this$props.reverse,
          restProps = _objectWithoutProperties(_this$props, ["children", "className", "reverse"]);

      var classes = classNames(className, styles.row, getModifierClassNames(restProps), _defineProperty({}, styles.reverse, reverse));
      return /*#__PURE__*/React.createElement("div", {
        className: classes
      }, children);
    }
  }]);

  return Row;
}(Component);

_defineProperty(Row, "propTypes", {
  reverse: PropTypes.bool,
  start: ModifierType,
  center: ModifierType,
  end: ModifierType,
  top: ModifierType,
  middle: ModifierType,
  baseline: ModifierType,
  bottom: ModifierType,
  around: ModifierType,
  between: ModifierType,
  first: ModifierType,
  last: ModifierType,
  className: PropTypes.string,
  children: PropTypes.node
});

var ModifierType$1 = PropTypes.oneOfType([PropTypes.number, PropTypes.bool]);
var classMap = {
  xs: 'col-xs',
  sm: 'col-sm',
  md: 'col-md',
  lg: 'col-lg',
  xsOffset: 'col-xs-offset',
  smOffset: 'col-sm-offset',
  mdOffset: 'col-md-offset',
  lgOffset: 'col-lg-offset'
};
/**
 * Converts props like "xs=9 xsOffset={2}" to classes "col-xs-9 col-xs-offset-2"
 * @param {Object} props incoming props
 * @returns {Array} result classnames
 */

function getClassNames(props) {
  return Object.keys(props).filter(function (key) {
    return classMap[key];
  }).map(function (key) {
    return styles[Number.isInteger(props[key]) ? "".concat(classMap[key], "-").concat(props[key]) : classMap[key]];
  });
}

var Col = /*#__PURE__*/function (_Component) {
  _inherits(Col, _Component);

  var _super = _createSuper(Col);

  function Col() {
    _classCallCheck(this, Col);

    return _super.apply(this, arguments);
  }

  _createClass(Col, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          reverse = _this$props.reverse,
          restProps = _objectWithoutProperties(_this$props, ["children", "className", "reverse"]);

      var classes = classNames(styles.col, className, getClassNames(restProps), _defineProperty({}, styles.reverse, reverse));
      return /*#__PURE__*/React.createElement("div", {
        className: classes
      }, children);
    }
  }]);

  return Col;
}(Component);

_defineProperty(Col, "propTypes", {
  xs: ModifierType$1,
  sm: ModifierType$1,
  md: ModifierType$1,
  lg: ModifierType$1,
  xsOffset: PropTypes.number,
  smOffset: PropTypes.number,
  mdOffset: PropTypes.number,
  lgOffset: PropTypes.number,
  reverse: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
});

/**
 * @name Grid
 */

var Grid = /*#__PURE__*/function (_Component) {
  _inherits(Grid, _Component);

  var _super = _createSuper(Grid);

  function Grid() {
    _classCallCheck(this, Grid);

    return _super.apply(this, arguments);
  }

  _createClass(Grid, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          restProps = _objectWithoutProperties(_this$props, ["children", "className"]);

      var classes = classNames(styles['container-fluid'], className);
      return /*#__PURE__*/React.createElement("div", _extends({}, restProps, {
        className: classes
      }), children);
    }
  }]);

  return Grid;
}(Component);

_defineProperty(Grid, "propTypes", {
  className: PropTypes.string,
  children: PropTypes.node
});

export { Col, Grid, Row };
