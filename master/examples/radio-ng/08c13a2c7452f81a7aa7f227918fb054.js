!function(n){function e(o){if(r[o])return r[o].exports;var t=r[o]={i:o,l:!1,exports:{}};return n[o].call(t.exports,t,t.exports,e),t.l=!0,t.exports}var r={};e.m=n,e.c=r,e.i=function(n){return n},e.d=function(n,r,o){e.o(n,r)||Object.defineProperty(n,r,{configurable:!1,enumerable:!0,get:o})},e.n=function(n){var r=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(r,"a",r),r},e.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},e.p="/",e(e.s=1129)}({0:function(n,e){n.exports=vendor_lib},10:function(n,e,r){n.exports=r(0)(403)},1129:function(n,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=r(47),t=r.n(o),i=r(946);t.a.module("Example.radio",[i.a]).controller("ExampleCtrl",function(){this.selected="two"})},13:function(n,e,r){e=n.exports=r(9)(!1),e.push([n.i,'/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #263b4c;\n  --ring-borders-color: #b8d1e5;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: var(--ring-border-disabled-color);\n  --ring-border-hover-color: #80c6ff;\n  --ring-icon-hover-color: var(--ring-border-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1c8c32;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #f2f9ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #808080;\n  --ring-code-meta-color: #808000;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #008000;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n\n  /* TODO: return raw value back if this issue fixed https://github.com/JLHwung/postcss-font-family-system-ui/issues/65 */\n  --ring-font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, "Bitstream Vera Sans Mono", "Ubuntu Mono", Consolas, "Courier New", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n',""])},14:function(n,e,r){function o(n,e){for(var r=0;r<n.length;r++){var o=n[r],t=b[o.id];if(t){t.refs++;for(var i=0;i<t.parts.length;i++)t.parts[i](o.parts[i]);for(;i<o.parts.length;i++)t.parts.push(d(o.parts[i],e))}else{for(var a=[],i=0;i<o.parts.length;i++)a.push(d(o.parts[i],e));b[o.id]={id:o.id,refs:1,parts:a}}}}function t(n,e){for(var r=[],o={},t=0;t<n.length;t++){var i=n[t],a=e.base?i[0]+e.base:i[0],c=i[1],l=i[2],s=i[3],f={css:c,media:l,sourceMap:s};o[a]?o[a].parts.push(f):r.push(o[a]={id:a,parts:[f]})}return r}function i(n,e){var r=v(n.insertInto);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var o=w[w.length-1];if("top"===n.insertAt)o?o.nextSibling?r.insertBefore(e,o.nextSibling):r.appendChild(e):r.insertBefore(e,r.firstChild),w.push(e);else if("bottom"===n.insertAt)r.appendChild(e);else{if("object"!=typeof n.insertAt||!n.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var t=v(n.insertAt.before,r);r.insertBefore(e,t)}}function a(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n);var e=w.indexOf(n);e>=0&&w.splice(e,1)}function c(n){var e=document.createElement("style");if(void 0===n.attrs.type&&(n.attrs.type="text/css"),void 0===n.attrs.nonce){var r=f();r&&(n.attrs.nonce=r)}return s(e,n.attrs),i(n,e),e}function l(n){var e=document.createElement("link");return void 0===n.attrs.type&&(n.attrs.type="text/css"),n.attrs.rel="stylesheet",s(e,n.attrs),i(n,e),e}function s(n,e){Object.keys(e).forEach(function(r){n.setAttribute(r,e[r])})}function f(){return r.nc}function d(n,e){var r,o,t,i;if(e.transform&&n.css){if(!(i="function"==typeof e.transform?e.transform(n.css):e.transform.default(n.css)))return function(){};n.css=i}if(e.singleton){var s=y++;r=x||(x=c(e)),o=u.bind(null,r,s,!1),t=u.bind(null,r,s,!0)}else n.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(r=l(e),o=g.bind(null,r,e),t=function(){a(r),r.href&&URL.revokeObjectURL(r.href)}):(r=c(e),o=p.bind(null,r),t=function(){a(r)});return o(n),function(e){if(e){if(e.css===n.css&&e.media===n.media&&e.sourceMap===n.sourceMap)return;o(n=e)}else t()}}function u(n,e,r,o){var t=r?"":o.css;if(n.styleSheet)n.styleSheet.cssText=k(e,t);else{var i=document.createTextNode(t),a=n.childNodes;a[e]&&n.removeChild(a[e]),a.length?n.insertBefore(i,a[e]):n.appendChild(i)}}function p(n,e){var r=e.css,o=e.media;if(o&&n.setAttribute("media",o),n.styleSheet)n.styleSheet.cssText=r;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(r))}}function g(n,e,r){var o=r.css,t=r.sourceMap,i=void 0===e.convertToAbsoluteUrls&&t;(e.convertToAbsoluteUrls||i)&&(o=_(o)),t&&(o+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(t))))+" */");var a=new Blob([o],{type:"text/css"}),c=n.href;n.href=URL.createObjectURL(a),c&&URL.revokeObjectURL(c)}var b={},h=function(n){var e;return function(){return void 0===e&&(e=n.apply(this,arguments)),e}}(function(){return window&&document&&document.all&&!window.atob}),m=function(n,e){return e?e.querySelector(n):document.querySelector(n)},v=function(n){var e={};return function(n,r){if("function"==typeof n)return n();if(void 0===e[n]){var o=m.call(this,n,r);if(window.HTMLIFrameElement&&o instanceof window.HTMLIFrameElement)try{o=o.contentDocument.head}catch(n){o=null}e[n]=o}return e[n]}}(),x=null,y=0,w=[],_=r(60);n.exports=function(n,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");e=e||{},e.attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=h()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var r=t(n,e);return o(r,e),function(n){for(var i=[],a=0;a<r.length;a++){var c=r[a],l=b[c.id];l.refs--,i.push(l)}n&&o(t(n,e),e);for(var a=0;a<i.length;a++){var l=i[a];if(0===l.refs){for(var s=0;s<l.parts.length;s++)l.parts[s]();delete b[l.id]}}}};var k=function(){var n=[];return function(e,r){return n[e]=r,n.filter(Boolean).join("\n")}}()},18:function(n,e,r){n.exports=r(0)(360)},24:function(n,e,r){n.exports=r(0)(426)},35:function(n,e,r){"use strict";function o(n){if(!n)throw Error('Argument "name" is required in getUID()');return t[n]||(t[n]=0),n+String(t[n]++)}e.a=o;var t={}},4:function(n,e,r){e=n.exports=r(9)(!1),e.push([n.i,'/* https://readymag.com/artemtiunov/RingUILanguage/colours/ */\n\n/*\nUnit shouldn\'t be CSS custom property because it is not intended to change\nAlso it won\'t form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/\n\n.clearfix_1e8::after {\n    display: block;\n    clear: both;\n\n    content: \'\';\n  }\n\n.font_3f3 {\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, Arial, sans-serif;\n  font-family: var(--ring-font-family);\n  font-size: 13px;\n  font-size: var(--ring-font-size);\n  line-height: 20px;\n  line-height: var(--ring-line-height);\n}\n\n.font-lower_cf2 {\n\n  line-height: 18px;\n\n  line-height: var(--ring-line-height-lower);\n}\n\n.font-smaller_1da {\n\n  font-size: 12px;\n\n  font-size: var(--ring-font-size-smaller);\n}\n\n.font-smaller-lower_c69 {\n\n  line-height: 16px;\n\n  line-height: var(--ring-line-height-lowest);\n}\n\n.font-larger-lower_fa1 {\n\n  font-size: 14px;\n\n  font-size: var(--ring-font-size-larger);\n}\n\n.font-larger_938 {\n\n  line-height: 21px;\n\n  line-height: var(--ring-line-height-taller);\n}\n\n/* To be used at large sizes */\n/* As close as possible to Helvetica Neue Thin (to replace Gotham) */\n.thin-font_52b {\n  font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;\n  font-size: 13px;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}\n\n.monospace-font_b2e {\n  font-family: Menlo, "Bitstream Vera Sans Mono", "Ubuntu Mono", Consolas, "Courier New", Courier, monospace;\n  font-family: var(--ring-font-family-monospace);\n  font-size: 12px;\n  font-size: var(--ring-font-size-smaller);\n}\n\n.ellipsis_894 {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\n/* Note: footer also has top margin which isn\'t taken into account here */\n\n/* Media breakpoints (minimal values) */\n\n/* Media queries */\n',""]),e.locals={unit:"8px","footer-height":"64px","breakpoint-small":"640px","breakpoint-middle":"960px","breakpoint-large":"1200px","extra-small-screen-media":"(max-width: 639px)","small-screen-media":"(min-width: 640px) and (max-width: 959px)","middle-screen-media":"(min-width: 960px) and (max-width: 1199px)","large-screen-media":"(min-width: 1200px)",clearfix:"clearfix_1e8",font:"font_3f3","font-lower":"font-lower_cf2 font_3f3","font-smaller":"font-smaller_1da font-lower_cf2 font_3f3","font-smaller-lower":"font-smaller-lower_c69 font-smaller_1da font-lower_cf2 font_3f3","font-larger-lower":"font-larger-lower_fa1 font-lower_cf2 font_3f3","font-larger":"font-larger_938 font-larger-lower_fa1 font-lower_cf2 font_3f3","thin-font":"thin-font_52b","monospace-font":"monospace-font_b2e",ellipsis:"ellipsis_894"}},47:function(n,e,r){n.exports=r(0)(258)},5:function(n,e,r){n.exports=r(0)(407)},556:function(n,e,r){"use strict";function o(n,e){return function(r,o){var t=e||Object.keys(o.$attr),i=n;return t.forEach(function(n){if(void 0!==o[n]){var e=o.$attr[n],r=o[n],t="".concat("data-proxy-").concat(e).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),a="".concat(e,'="').concat(r,'"');i=i.replace(RegExp("".concat(t,'(="")*'),"g"),a)}}),i}}var t=r(565),i=(r.n(t),r(24)),a=(r.n(i),r(7)),c=(r.n(a),r(8)),l=(r.n(c),r(5)),s=(r.n(l),r(10));r.n(s),e.a=o},565:function(n,e,r){n.exports=r(0)(424)},60:function(n,e){n.exports=function(n){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!n||"string"!=typeof n)return n;var r=e.protocol+"//"+e.host,o=r+e.pathname.replace(/\/[^\/]*$/,"/");return n.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(n,e){var t=e.trim().replace(/^"(.*)"$/,function(n,e){return e}).replace(/^'(.*)'$/,function(n,e){return e});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(t))return n;var i;return i=0===t.indexOf("//")?t:0===t.indexOf("/")?r+t:o+t.replace(/^\.\//,""),"url("+JSON.stringify(i)+")"})}},7:function(n,e,r){n.exports=r(0)(478)},718:function(n,e,r){e=n.exports=r(9)(!1),e.i(r(13),""),e.i(r(4),void 0),e.push([n.i,'.radio_b03 {\n  position: relative;\n\n  display: block;\n\n  text-align: left;\n\n  color: #1f2326;\n\n  color: var(--ring-text-color);\n  outline: none\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.radio_b03:hover .circle_d7d {\n    transition: none;\n\n    border-color: #80c6ff;\n\n    border-color: var(--ring-border-hover-color);\n  }}\n\n.circle_d7d {\n  position: relative;\n  top: -2px;\n\n  display: inline-block;\n\n  box-sizing: border-box;\n  width: 16px;\n  height: 16px;\n\n  -webkit-user-select: none;\n\n     -moz-user-select: none;\n\n      -ms-user-select: none;\n\n          user-select: none;\n  transition: border-color 0.3s ease-out, box-shadow 0.3s ease-out;\n  transition: border-color var(--ring-ease), box-shadow var(--ring-ease);\n  vertical-align: middle;\n  pointer-events: none;\n\n  border: 1px solid #b8d1e5;\n\n  border: 1px solid var(--ring-borders-color);\n  border-radius: 8px;\n  background-color: #fff;\n  background-color: var(--ring-content-background-color)\n}\n\n.circle_d7d::after {\n    position: absolute;\n    top: 3px;\n    left: 3px;\n\n    width: 8px;\n    height: 8px;\n\n    content: "";\n\n    transition: opacity 0.15s ease-out, transform 0.15s ease-out;\n\n    transition: opacity var(--ring-fast-ease), transform var(--ring-fast-ease);\n\n    transform: scale(0);\n\n    opacity: 0;\n\n    border-radius: 4px;\n    background-color: #008eff;\n    background-color: var(--ring-main-color);\n  }\n\n.input_7e6 {\n  position: absolute;\n  top: 0;\n  left: 0;\n\n  width: 100%;\n  height: 100%;\n  margin: 0;\n\n  cursor: pointer;\n\n  opacity: 0\n}\n\n.input_7e6[disabled] + .circle_d7d {\n    border-color: #b8d1e5;\n    border-color: var(--ring-borders-color);\n  }\n\n.input_7e6:checked + .circle_d7d {\n    border-color: #80c6ff;\n    border-color: var(--ring-border-hover-color)\n\n    /* stylelint-disable-next-line selector-max-specificity */\n  }\n\n.input_7e6:checked + .circle_d7d::after {\n      transition: none;\n\n      transform: scale(1);\n\n      opacity: 1;\n    }\n\n.input_7e6:focus + .circle_d7d,\n  .input_7e6.focus_c63 + .circle_d7d {\n    border-color: #80c6ff;\n    border-color: var(--ring-border-hover-color);\n    box-shadow: 0 0 0 1px #80c6ff;\n    box-shadow: 0 0 0 1px var(--ring-border-hover-color);\n  }\n\n.input_7e6[disabled] {\n    pointer-events: none;\n  }\n\n.input_7e6 {\n\n  /* stylelint-disable-next-line selector-max-specificity */\n}\n\n.input_7e6[disabled]:checked + .circle_d7d::after {\n    opacity: 0.5;\n  }\n\n.input_7e6[disabled] ~ .label_56b {\n    color: #999;\n    color: var(--ring-disabled-color);\n  }\n\n.label_56b {\n  margin-left: 8px;\n\n  line-height: 32px;\n}\n',""]),e.locals={unit:""+r(4).locals.unit,"radio-size":"16px",radio:"radio_b03",circle:"circle_d7d",input:"input_7e6",focus:"focus_c63",label:"label_56b"}},792:function(n,e,r){var o=r(718);"string"==typeof o&&(o=[[n.i,o,""]]);var t={hmr:!0};t.transform=void 0,t.insertInto=void 0,r(14)(o,t),o.locals&&(n.exports=o.locals)},8:function(n,e,r){n.exports=r(0)(90)},9:function(n,e){function r(n,e){var r=n[1]||"",t=n[3];if(!t)return r;if(e&&"function"==typeof btoa){var i=o(t);return[r].concat(t.sources.map(function(n){return"/*# sourceURL="+t.sourceRoot+n+" */"})).concat([i]).join("\n")}return[r].join("\n")}function o(n){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */"}n.exports=function(n){var e=[];return e.toString=function(){return this.map(function(e){var o=r(e,n);return e[2]?"@media "+e[2]+"{"+o+"}":o}).join("")},e.i=function(n,r){"string"==typeof n&&(n=[[null,n,""]]);for(var o={},t=0;t<this.length;t++){var i=this[t][0];"number"==typeof i&&(o[i]=!0)}for(t=0;t<n.length;t++){var a=n[t];"number"==typeof a[0]&&o[a[0]]||(r&&!a[2]?a[2]=r:r&&(a[2]="("+a[2]+") and ("+r+")"),e.push(a))}},e}},946:function(n,e,r){"use strict";var o=r(18),t=(r.n(o),r(47)),i=r.n(t),a=r(792),c=r.n(a),l=r(556),s=r(35),f=i.a.module("Ring.radio",[]);f.directive("rgRadio",function(){return{restrict:"E",transclude:!0,replace:!0,template:r.i(l.a)('\n      <label class="'.concat(c.a.radio,'" data-test="ring-radio">\n        <input\n          type="radio"\n          class=').concat(c.a.input,'\n          \n          data-proxy-ng-disabled\n          data-proxy-ng-model\n          data-proxy-ng-change\n          data-proxy-name\n          data-proxy-value\n          data-proxy-ng-value\n        />\n        <span class="').concat(c.a.circle,'"></span><span\n         class="').concat(c.a.label,'" ng-transclude></span>\n      </label>\n\n')),link:function(n,e){var o=e[0],t=o.querySelector('input[type="radio"]');o.id?function(){var n=o.id;o.setAttribute("for",n),t.setAttribute("id",n),o.removeAttribute("id")}():function(){var n=r.i(s.a)("ring-radio-item-");o.setAttribute("for",n),t.setAttribute("id",n)}()}}}),e.a=f.name}});