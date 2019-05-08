!function(n){function e(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return n[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var t={};e.m=n,e.c=t,e.i=function(n){return n},e.d=function(n,t,r){e.o(n,t)||Object.defineProperty(n,t,{configurable:!1,enumerable:!0,get:r})},e.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(t,"a",t),t},e.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},e.p="/",e(e.s=1172)}({0:function(n,e){n.exports=vendor_lib},1:function(n,e,t){n.exports=t(0)(452)},10:function(n,e,t){n.exports=t(0)(402)},11:function(n,e,t){n.exports=t(0)(259)},1172:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=t(19),o=(t.n(r),t(2)),i=t.n(o),a=t(670);t.i(r.render)(i.a.createElement(a.a,null),document.getElementById("toggle-unchecked")),t.i(r.render)(i.a.createElement(a.a,{defaultChecked:!0}),document.getElementById("toggle-checked")),t.i(r.render)(i.a.createElement(a.a,{disabled:!0}),document.getElementById("toggle-unchecked-disabled")),t.i(r.render)(i.a.createElement(a.a,{disabled:!0,defaultChecked:!0}),document.getElementById("toggle-checked-disabled")),t.i(r.render)(i.a.createElement(a.a,{pale:!0}),document.getElementById("pale-toggle-unchecked")),t.i(r.render)(i.a.createElement(a.a,{pale:!0,defaultChecked:!0}),document.getElementById("pale-toggle-checked")),t.i(r.render)(i.a.createElement(a.a,{pale:!0,disabled:!0}),document.getElementById("pale-toggle-unchecked-disabled")),t.i(r.render)(i.a.createElement(a.a,{pale:!0,disabled:!0,defaultChecked:!0}),document.getElementById("pale-toggle-checked-disabled")),t.i(r.render)(i.a.createElement(a.a,null,"Label"),document.getElementById("with-label"))},12:function(n,e,t){n.exports=t(0)(390)},13:function(n,e,t){e=n.exports=t(9)(!1),e.push([n.i,'/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #263b4c;\n  --ring-borders-color: #b8d1e5;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: var(--ring-border-disabled-color);\n  --ring-border-hover-color: #80c6ff;\n  --ring-icon-hover-color: var(--ring-border-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1c8c32;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #f2f9ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #808080;\n  --ring-code-meta-color: #808000;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #008000;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n\n  /* TODO: return raw value back if this issue fixed https://github.com/JLHwung/postcss-font-family-system-ui/issues/65 */\n  --ring-font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, "Bitstream Vera Sans Mono", "Ubuntu Mono", Consolas, "Courier New", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n',""])},14:function(n,e,t){function r(n,e){for(var t=0;t<n.length;t++){var r=n[t],o=b[r.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](r.parts[i]);for(;i<r.parts.length;i++)o.parts.push(u(r.parts[i],e))}else{for(var a=[],i=0;i<r.parts.length;i++)a.push(u(r.parts[i],e));b[r.id]={id:r.id,refs:1,parts:a}}}}function o(n,e){for(var t=[],r={},o=0;o<n.length;o++){var i=n[o],a=e.base?i[0]+e.base:i[0],c=i[1],l=i[2],s=i[3],f={css:c,media:l,sourceMap:s};r[a]?r[a].parts.push(f):t.push(r[a]={id:a,parts:[f]})}return t}function i(n,e){var t=v(n.insertInto);if(!t)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=w[w.length-1];if("top"===n.insertAt)r?r.nextSibling?t.insertBefore(e,r.nextSibling):t.appendChild(e):t.insertBefore(e,t.firstChild),w.push(e);else if("bottom"===n.insertAt)t.appendChild(e);else{if("object"!=typeof n.insertAt||!n.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var o=v(n.insertAt.before,t);t.insertBefore(e,o)}}function a(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n);var e=w.indexOf(n);e>=0&&w.splice(e,1)}function c(n){var e=document.createElement("style");if(void 0===n.attrs.type&&(n.attrs.type="text/css"),void 0===n.attrs.nonce){var t=f();t&&(n.attrs.nonce=t)}return s(e,n.attrs),i(n,e),e}function l(n){var e=document.createElement("link");return void 0===n.attrs.type&&(n.attrs.type="text/css"),n.attrs.rel="stylesheet",s(e,n.attrs),i(n,e),e}function s(n,e){Object.keys(e).forEach(function(t){n.setAttribute(t,e[t])})}function f(){return t.nc}function u(n,e){var t,r,o,i;if(e.transform&&n.css){if(!(i="function"==typeof e.transform?e.transform(n.css):e.transform.default(n.css)))return function(){};n.css=i}if(e.singleton){var s=x++;t=y||(y=c(e)),r=d.bind(null,t,s,!1),o=d.bind(null,t,s,!0)}else n.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(t=l(e),r=g.bind(null,t,e),o=function(){a(t),t.href&&URL.revokeObjectURL(t.href)}):(t=c(e),r=p.bind(null,t),o=function(){a(t)});return r(n),function(e){if(e){if(e.css===n.css&&e.media===n.media&&e.sourceMap===n.sourceMap)return;r(n=e)}else o()}}function d(n,e,t,r){var o=t?"":r.css;if(n.styleSheet)n.styleSheet.cssText=_(e,o);else{var i=document.createTextNode(o),a=n.childNodes;a[e]&&n.removeChild(a[e]),a.length?n.insertBefore(i,a[e]):n.appendChild(i)}}function p(n,e){var t=e.css,r=e.media;if(r&&n.setAttribute("media",r),n.styleSheet)n.styleSheet.cssText=t;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(t))}}function g(n,e,t){var r=t.css,o=t.sourceMap,i=void 0===e.convertToAbsoluteUrls&&o;(e.convertToAbsoluteUrls||i)&&(r=k(r)),o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var a=new Blob([r],{type:"text/css"}),c=n.href;n.href=URL.createObjectURL(a),c&&URL.revokeObjectURL(c)}var b={},h=function(n){var e;return function(){return void 0===e&&(e=n.apply(this,arguments)),e}}(function(){return window&&document&&document.all&&!window.atob}),m=function(n,e){return e?e.querySelector(n):document.querySelector(n)},v=function(n){var e={};return function(n,t){if("function"==typeof n)return n();if(void 0===e[n]){var r=m.call(this,n,t);if(window.HTMLIFrameElement&&r instanceof window.HTMLIFrameElement)try{r=r.contentDocument.head}catch(n){r=null}e[n]=r}return e[n]}}(),y=null,x=0,w=[],k=t(60);n.exports=function(n,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");e=e||{},e.attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=h()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var t=o(n,e);return r(t,e),function(n){for(var i=[],a=0;a<t.length;a++){var c=t[a],l=b[c.id];l.refs--,i.push(l)}n&&r(o(n,e),e);for(var a=0;a<i.length;a++){var l=i[a];if(0===l.refs){for(var s=0;s<l.parts.length;s++)l.parts[s]();delete b[l.id]}}}};var _=function(){var n=[];return function(e,t){return n[e]=t,n.filter(Boolean).join("\n")}}()},19:function(n,e,t){n.exports=t(0)(262)},2:function(n,e,t){n.exports=t(0)(61)},20:function(n,e,t){"use strict";function r(n){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(n)}function o(n){return c(n)||a(n)||i()}function i(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function a(n){if(Symbol.iterator in Object(n)||"[object Arguments]"===Object.prototype.toString.call(n))return Array.from(n)}function c(n){if(Array.isArray(n)){for(var e=0,t=new Array(n.length);e<n.length;e++)t[e]=n[e];return t}}function l(n,e){return u(n)||f(n,e)||s()}function s(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function f(n,e){var t=[],r=!0,o=!1,i=void 0;try{for(var a,c=n[Symbol.iterator]();!(r=(a=c.next()).done)&&(t.push(a.value),!e||t.length!==e);r=!0);}catch(n){o=!0,i=n}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return t}function u(n){if(Array.isArray(n))return n}function d(n){return Object.entries(n).reduce(function(n,e){var t=l(e,2),r=t[0];return t[1]?o(n).concat([r]):n},[])}function p(){for(var n=arguments.length,e=new Array(n),t=0;t<n;t++)e[t]=arguments[t];return e.filter(function(n){return!!n}).reduce(function(n,e){return"object"===r(e)?o(n).concat(o(d(e))):o(n).concat([e])},[]).join(" ")}e.a=p;var g=t(23),b=(t.n(g),t(59)),h=(t.n(b),t(21)),m=(t.n(h),t(3)),v=(t.n(m),t(1)),y=(t.n(v),t(7)),x=(t.n(y),t(8)),w=(t.n(x),t(5)),k=(t.n(w),t(32));t.n(k)},21:function(n,e,t){n.exports=t(0)(428)},23:function(n,e,t){n.exports=t(0)(442)},3:function(n,e,t){n.exports=t(0)(476)},32:function(n,e,t){n.exports=t(0)(468)},36:function(n,e,t){"use strict";function r(n){n&&n.element&&n.currentTheme&&(n.prevTheme&&n.element.classList.remove(n.prevTheme),n.element.classList.add(n.currentTheme))}t.d(e,"b",function(){return r});var o={LIGHT:"light",DARK:"dark"};e.a=o},4:function(n,e,t){e=n.exports=t(9)(!1),e.push([n.i,'/* https://readymag.com/artemtiunov/RingUILanguage/colours/ */\n\n/*\nUnit shouldn\'t be CSS custom property because it is not intended to change\nAlso it won\'t form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/\n\n.clearfix_1e8::after {\n    display: block;\n    clear: both;\n\n    content: \'\';\n  }\n\n.font_3f3 {\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, Arial, sans-serif;\n  font-family: var(--ring-font-family);\n  font-size: 13px;\n  font-size: var(--ring-font-size);\n  line-height: 20px;\n  line-height: var(--ring-line-height);\n}\n\n.font-lower_cf2 {\n\n  line-height: 18px;\n\n  line-height: var(--ring-line-height-lower);\n}\n\n.font-smaller_1da {\n\n  font-size: 12px;\n\n  font-size: var(--ring-font-size-smaller);\n}\n\n.font-smaller-lower_c69 {\n\n  line-height: 16px;\n\n  line-height: var(--ring-line-height-lowest);\n}\n\n.font-larger-lower_fa1 {\n\n  font-size: 14px;\n\n  font-size: var(--ring-font-size-larger);\n}\n\n.font-larger_938 {\n\n  line-height: 21px;\n\n  line-height: var(--ring-line-height-taller);\n}\n\n/* To be used at large sizes */\n/* As close as possible to Helvetica Neue Thin (to replace Gotham) */\n.thin-font_52b {\n  font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;\n  font-size: 13px;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}\n\n.monospace-font_b2e {\n  font-family: Menlo, "Bitstream Vera Sans Mono", "Ubuntu Mono", Consolas, "Courier New", Courier, monospace;\n  font-family: var(--ring-font-family-monospace);\n  font-size: 12px;\n  font-size: var(--ring-font-size-smaller);\n}\n\n.ellipsis_894 {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\n/* Note: footer also has top margin which isn\'t taken into account here */\n\n/* Media breakpoints (minimal values) */\n\n/* Media queries */\n',""]),e.locals={unit:"8px","footer-height":"64px","breakpoint-small":"640px","breakpoint-middle":"960px","breakpoint-large":"1200px","extra-small-screen-media":"(max-width: 639px)","small-screen-media":"(min-width: 640px) and (max-width: 959px)","middle-screen-media":"(min-width: 960px) and (max-width: 1199px)","large-screen-media":"(min-width: 1200px)",clearfix:"clearfix_1e8",font:"font_3f3","font-lower":"font-lower_cf2 font_3f3","font-smaller":"font-smaller_1da font-lower_cf2 font_3f3","font-smaller-lower":"font-smaller-lower_c69 font-smaller_1da font-lower_cf2 font_3f3","font-larger-lower":"font-larger-lower_fa1 font-lower_cf2 font_3f3","font-larger":"font-larger_938 font-larger-lower_fa1 font-lower_cf2 font_3f3","thin-font":"thin-font_52b","monospace-font":"monospace-font_b2e",ellipsis:"ellipsis_894"}},5:function(n,e,t){n.exports=t(0)(406)},59:function(n,e,t){n.exports=t(0)(339)},6:function(n,e,t){n.exports=t(0)(91)},60:function(n,e){n.exports=function(n){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!n||"string"!=typeof n)return n;var t=e.protocol+"//"+e.host,r=t+e.pathname.replace(/\/[^\/]*$/,"/");return n.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(n,e){var o=e.trim().replace(/^"(.*)"$/,function(n,e){return e}).replace(/^'(.*)'$/,function(n,e){return e});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(o))return n;var i;return i=0===o.indexOf("//")?o:0===o.indexOf("/")?t+o:r+o.replace(/^\.\//,""),"url("+JSON.stringify(i)+")"})}},670:function(n,e,t){"use strict";function r(n){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(n)}function o(){return o=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},o.apply(this,arguments)}function i(n,e){if(null==n)return{};var t,r,o=a(n,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);for(r=0;r<i.length;r++)t=i[r],e.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(n,t)&&(o[t]=n[t])}return o}function a(n,e){if(null==n)return{};var t,r,o={},i=Object.keys(n);for(r=0;r<i.length;r++)t=i[r],e.indexOf(t)>=0||(o[t]=n[t]);return o}function c(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}function l(n,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(n,r.key,r)}}function s(n,e,t){return e&&l(n.prototype,e),t&&l(n,t),n}function f(n,e){return!e||"object"!==r(e)&&"function"!=typeof e?u(n):e}function u(n){if(void 0===n)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}function d(n){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(n){return n.__proto__||Object.getPrototypeOf(n)})(n)}function p(n,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");n.prototype=Object.create(e&&e.prototype,{constructor:{value:n,writable:!0,configurable:!0}}),e&&g(n,e)}function g(n,e){return(g=Object.setPrototypeOf||function(n,e){return n.__proto__=e,n})(n,e)}function b(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}t.d(e,"a",function(){return T});var h=t(3),m=(t.n(h),t(12)),v=(t.n(m),t(1)),y=(t.n(v),t(7)),x=(t.n(y),t(8)),w=(t.n(x),t(5)),k=(t.n(w),t(10)),_=(t.n(k),t(2)),E=t.n(_),O=t(6),S=t.n(O),j=t(11),z=t.n(j),C=t(36),L=t(20),U=t(797),I=t.n(U),T=function(n){function e(){return c(this,e),f(this,d(e).apply(this,arguments))}return p(e,n),s(e,[{key:"render",value:function(){var n=this.props,e=n.className,r=n.children,a=n.disabled,c=n.pale,l=n.title,s=n.leftLabel,f=n.theme,u=n["data-test"],d=n.onTransitionEnd,p=i(n,["className","children","disabled","pale","title","leftLabel","theme","data-test","onTransitionEnd"]),g=z()(e,I.a.toggle,I.a[f],a&&I.a.disabled);return E.a.createElement("label",{className:g,title:l,"data-test":t.i(L.a)("ring-toggle",u)},s&&E.a.createElement("span",{className:I.a.leftLabel},s),E.a.createElement("span",{className:I.a.switchWrapper},E.a.createElement("input",o({"data-test":"ring-toggle-input"},p,{type:"checkbox",disabled:a,className:I.a.input})),E.a.createElement("span",{className:z()(I.a.switch,c&&I.a.paleSwitch),onTransitionEnd:d})),r&&E.a.createElement("span",{className:I.a.label},r))}}]),e}(_.PureComponent);b(T,"propTypes",{children:S.a.node,name:S.a.string,className:S.a.string,title:S.a.string,leftLabel:S.a.node,defaultChecked:S.a.bool,checked:S.a.bool,disabled:S.a.bool,pale:S.a.bool,onChange:S.a.func,onTransitionEnd:S.a.func,theme:S.a.string,"data-test":S.a.string}),b(T,"defaultProps",{theme:C.a.LIGHT})},7:function(n,e,t){n.exports=t(0)(477)},723:function(n,e,t){e=n.exports=t(9)(!1),e.i(t(13),""),e.i(t(4),void 0),e.push([n.i,'.toggle_9b0 {\n  cursor: pointer\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.toggle_9b0:hover .switch_acb {\n      background-color: #80c6ff;\n      background-color: var(--ring-border-hover-color);\n    }}\n\n.toggle_9b0.disabled_a57 {\n    pointer-events: none;\n  }\n\n.label_505 {\n  margin-left: 4px;\n}\n\n.leftLabel_422 {\n  margin-right: 4px;\n}\n\n.light_253 .switch_acb {\n    background-color: #b8d1e5;\n    background-color: var(--ring-icon-color)\n  }\n\n.light_253 .switch_acb::before {\n      background-color: #fff;\n      background-color: var(--ring-content-background-color);\n    }\n\n.dark_3d4 .switch_acb {\n    background-color: #406380;\n    background-color: var(--ring-hint-color)\n  }\n\n.dark_3d4 .switch_acb::before {\n      background-color: #000;\n      background-color: var(--ring-navigation-background-color);\n    }\n\n.switchWrapper_3c3 {\n  position: relative;\n\n  display: inline-block;\n\n  width: 24px;\n  height: 16px;\n\n  vertical-align: -3px;\n}\n\n.input_b2e {\n  position: absolute;\n  top: 0;\n  left: 0;\n\n  width: 100%;\n  height: 100%;\n\n  margin: 0;\n\n  opacity: 0;\n}\n\n.switch_acb {\n  position: relative;\n\n  display: block;\n\n  width: 100%;\n  height: 100%;\n\n  transition: background-color cubic-bezier(0.23, 1, 0.32, 1) 300ms;\n\n  border-radius: 8px\n}\n\n.input_b2e:focus + .switch_acb {\n    box-shadow: inset 0 0 0 1px #80c6ff, 0 0 0 1px #80c6ff;\n    box-shadow: inset 0 0 0 1px var(--ring-border-hover-color), 0 0 0 1px var(--ring-border-hover-color)\n}\n\n.switch_acb::before {\n    position: absolute;\n    top: 2px;\n    left: 0;\n\n    width: 12px;\n    height: 12px;\n\n    content: "";\n\n    transition: transform cubic-bezier(0.23, 1, 0.32, 1) 300ms;\n\n    transform: translateX(2px);\n\n    border-radius: 6px;\n  }\n\n.input_b2e:checked + .switch_acb {\n  background-color: #008eff;\n  background-color: var(--ring-main-color);\n}\n\n.input_b2e:checked + ::before {\n  transform: translateX(10px);\n}\n\n.input_b2e[disabled] + ::after {\n  position: absolute;\n  top: 0;\n  left: 0;\n\n  width: 100%;\n  height: 100%;\n\n  content: "";\n\n  border-radius: 8px;\n  background-image:\n    linear-gradient(\n      45deg,\n      transparent,\n      transparent 37.5%,\n      rgba(255, 255, 255, 0.9) 37.5%,\n      rgba(255, 255, 255, 0.9) 50%,\n      transparent 50%,\n      transparent 87.5%,\n      rgba(255, 255, 255, 0.9) 87.5%,\n      rgba(255, 255, 255, 0.9)\n    );\n  background-repeat: repeat;\n  background-size: 4px 4px;\n}\n\n.paleSwitch_e89.paleSwitch_e89 {\n  background-color: #cfdbe5;\n  background-color: var(--ring-pale-control-color);\n}\n\n.input_b2e:checked + .paleSwitch_e89 {\n  background-color: #80c6ff;\n  background-color: var(--ring-border-hover-color);\n}\n',""]),e.locals={unit:""+t(4).locals.unit,padding:"2px","disabled-line-color":"rgba(255, 255, 255, 0.9)",duration:"300ms","timing-function":"cubic-bezier(0.23, 1, 0.32, 1)",toggle:"toggle_9b0",switch:"switch_acb",disabled:"disabled_a57",label:"label_505",leftLabel:"leftLabel_422",light:"light_253",dark:"dark_3d4",switchWrapper:"switchWrapper_3c3",input:"input_b2e",paleSwitch:"paleSwitch_e89"}},797:function(n,e,t){var r=t(723);"string"==typeof r&&(r=[[n.i,r,""]]);var o={hmr:!0};o.transform=void 0,o.insertInto=void 0,t(14)(r,o),r.locals&&(n.exports=r.locals)},8:function(n,e,t){n.exports=t(0)(90)},9:function(n,e){function t(n,e){var t=n[1]||"",o=n[3];if(!o)return t;if(e&&"function"==typeof btoa){var i=r(o);return[t].concat(o.sources.map(function(n){return"/*# sourceURL="+o.sourceRoot+n+" */"})).concat([i]).join("\n")}return[t].join("\n")}function r(n){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */"}n.exports=function(n){var e=[];return e.toString=function(){return this.map(function(e){var r=t(e,n);return e[2]?"@media "+e[2]+"{"+r+"}":r}).join("")},e.i=function(n,t){"string"==typeof n&&(n=[[null,n,""]]);for(var r={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(r[i]=!0)}for(o=0;o<n.length;o++){var a=n[o];"number"==typeof a[0]&&r[a[0]]||(t&&!a[2]?a[2]=t:t&&(a[2]="("+a[2]+") and ("+t+")"),e.push(a))}},e}}});