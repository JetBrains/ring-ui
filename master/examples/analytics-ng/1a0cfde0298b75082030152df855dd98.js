!function(n){function e(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return n[o].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var t={};e.m=n,e.c=t,e.i=function(n){return n},e.d=function(n,t,o){e.o(n,t)||Object.defineProperty(n,t,{configurable:!1,enumerable:!0,get:o})},e.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(t,"a",t),t},e.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},e.p="/",e(e.s=1085)}({0:function(n,e){n.exports=vendor_lib},1085:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=t(47),r=t.n(o),i=t(925),a=t(663);r.a.module("Example.analyticsDemo",[i.a,a.a]).config(["analyticsProvider","AnalyticsCustomPlugin","AnalyticsGAPlugin",function(n,e,t){var o=new e(function(n){console.log("Here you can send data to server",n)},!0,600);n.plugins([o])}]).controller("TrackEventDemoCtrl",["analytics",function(n){n.trackEvent("track-event-demo","show")}])},13:function(n,e,t){e=n.exports=t(9)(!1),e.push([n.i,'/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #263b4c;\n  --ring-borders-color: #b8d1e5;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: var(--ring-border-disabled-color);\n  --ring-border-hover-color: #80c6ff;\n  --ring-icon-hover-color: var(--ring-border-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1c8c32;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #f2f9ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #808080;\n  --ring-code-meta-color: #808000;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #008000;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n\n  /* TODO: return raw value back if this issue fixed https://github.com/JLHwung/postcss-font-family-system-ui/issues/65 */\n  --ring-font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, "Bitstream Vera Sans Mono", "Ubuntu Mono", Consolas, "Courier New", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n',""])},14:function(n,e,t){function o(n,e){for(var t=0;t<n.length;t++){var o=n[t],r=p[o.id];if(r){r.refs++;for(var i=0;i<r.parts.length;i++)r.parts[i](o.parts[i]);for(;i<o.parts.length;i++)r.parts.push(f(o.parts[i],e))}else{for(var a=[],i=0;i<o.parts.length;i++)a.push(f(o.parts[i],e));p[o.id]={id:o.id,refs:1,parts:a}}}}function r(n,e){for(var t=[],o={},r=0;r<n.length;r++){var i=n[r],a=e.base?i[0]+e.base:i[0],c=i[1],s=i[2],l=i[3],u={css:c,media:s,sourceMap:l};o[a]?o[a].parts.push(u):t.push(o[a]={id:a,parts:[u]})}return t}function i(n,e){var t=b(n.insertInto);if(!t)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var o=y[y.length-1];if("top"===n.insertAt)o?o.nextSibling?t.insertBefore(e,o.nextSibling):t.appendChild(e):t.insertBefore(e,t.firstChild),y.push(e);else if("bottom"===n.insertAt)t.appendChild(e);else{if("object"!=typeof n.insertAt||!n.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var r=b(n.insertAt.before,t);t.insertBefore(e,r)}}function a(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n);var e=y.indexOf(n);e>=0&&y.splice(e,1)}function c(n){var e=document.createElement("style");if(void 0===n.attrs.type&&(n.attrs.type="text/css"),void 0===n.attrs.nonce){var t=u();t&&(n.attrs.nonce=t)}return l(e,n.attrs),i(n,e),e}function s(n){var e=document.createElement("link");return void 0===n.attrs.type&&(n.attrs.type="text/css"),n.attrs.rel="stylesheet",l(e,n.attrs),i(n,e),e}function l(n,e){Object.keys(e).forEach(function(t){n.setAttribute(t,e[t])})}function u(){return t.nc}function f(n,e){var t,o,r,i;if(e.transform&&n.css){if(!(i="function"==typeof e.transform?e.transform(n.css):e.transform.default(n.css)))return function(){};n.css=i}if(e.singleton){var l=x++;t=_||(_=c(e)),o=d.bind(null,t,l,!1),r=d.bind(null,t,l,!0)}else n.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(t=s(e),o=h.bind(null,t,e),r=function(){a(t),t.href&&URL.revokeObjectURL(t.href)}):(t=c(e),o=g.bind(null,t),r=function(){a(t)});return o(n),function(e){if(e){if(e.css===n.css&&e.media===n.media&&e.sourceMap===n.sourceMap)return;o(n=e)}else r()}}function d(n,e,t,o){var r=t?"":o.css;if(n.styleSheet)n.styleSheet.cssText=k(e,r);else{var i=document.createTextNode(r),a=n.childNodes;a[e]&&n.removeChild(a[e]),a.length?n.insertBefore(i,a[e]):n.appendChild(i)}}function g(n,e){var t=e.css,o=e.media;if(o&&n.setAttribute("media",o),n.styleSheet)n.styleSheet.cssText=t;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(t))}}function h(n,e,t){var o=t.css,r=t.sourceMap,i=void 0===e.convertToAbsoluteUrls&&r;(e.convertToAbsoluteUrls||i)&&(o=w(o)),r&&(o+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var a=new Blob([o],{type:"text/css"}),c=n.href;n.href=URL.createObjectURL(a),c&&URL.revokeObjectURL(c)}var p={},v=function(n){var e;return function(){return void 0===e&&(e=n.apply(this,arguments)),e}}(function(){return window&&document&&document.all&&!window.atob}),m=function(n,e){return e?e.querySelector(n):document.querySelector(n)},b=function(n){var e={};return function(n,t){if("function"==typeof n)return n();if(void 0===e[n]){var o=m.call(this,n,t);if(window.HTMLIFrameElement&&o instanceof window.HTMLIFrameElement)try{o=o.contentDocument.head}catch(n){o=null}e[n]=o}return e[n]}}(),_=null,x=0,y=[],w=t(60);n.exports=function(n,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");e=e||{},e.attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=v()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var t=r(n,e);return o(t,e),function(n){for(var i=[],a=0;a<t.length;a++){var c=t[a],s=p[c.id];s.refs--,i.push(s)}n&&o(r(n,e),e);for(var a=0;a<i.length;a++){var s=i[a];if(0===s.refs){for(var l=0;l<s.parts.length;l++)s.parts[l]();delete p[s.id]}}}};var k=function(){var n=[];return function(e,t){return n[e]=t,n.filter(Boolean).join("\n")}}()},18:function(n,e,t){n.exports=t(0)(359)},24:function(n,e,t){n.exports=t(0)(425)},265:function(n,e,t){n.exports=t(0)(265)},266:function(n,e,t){n.exports=t(0)(443)},302:function(n,e,t){var o=t(303);"string"==typeof o&&(o=[[n.i,o,""]]);var r={hmr:!0};r.transform=void 0,r.insertInto=void 0,t(14)(o,r),o.locals&&(n.exports=o.locals)},303:function(n,e,t){e=n.exports=t(9)(!1),e.i(t(13),""),e.i(t(61),void 0),e.push([n.i,"@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_46b:hover {\n    transition: none;\n\n    color: #ff008c;\n\n    color: var(--ring-link-hover-color);\n  }}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_46b:hover {\n    text-decoration: none;\n  }}\n\n.link_46b { /* To override link stiles inside alert */\n\n    cursor: pointer;\n    transition: color 0.15s ease-out;\n    transition: color var(--ring-fast-ease);\n\n    color: #0f5b99;\n\n    color: var(--ring-link-color);\n  }\n\n.link_46b {\n    text-decoration: none;\n  }\n\n.link_46b.hover_723 {\n    transition: none;\n\n    color: #ff008c;\n\n    color: var(--ring-link-hover-color);\n  }\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_46b:hover .inner_e7d {\n    border-width: 0;\n    border-bottom: 2px solid;\n    border-image-source: linear-gradient(currentcolor 50%, transparent 50%);\n    border-image-slice: 0 0 100% 0;\n  }}\n\n.link_46b.active_8b4 {\n    color: inherit;\n  }\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_46b.compatibilityUnderlineMode_a72:hover {\n    text-decoration: underline\n\n    /* stylelint-disable-next-line selector-max-specificity */\n  }}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_46b.compatibilityUnderlineMode_a72:hover .inner_e7d {\n      border: none;\n    }}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_46b.pseudo_b5d:hover {\n    text-decoration: none\n\n    /* stylelint-disable-next-line selector-max-specificity */\n  }}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_46b.pseudo_b5d:hover .inner_e7d {\n      border: none;\n    }}\n\n@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_46b:hover .inner_e7d {\n    border-bottom-width: 1px;\n  }}\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.inherit_bc0:not(:hover) {\n  color: inherit;\n}}\n\n.pseudo_b5d {\n  padding: 0;\n\n  text-align: left;\n\n  border: 0;\n\n  background: transparent;\n\n  font: inherit\n}\n\n.pseudo_b5d::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n",""]),e.locals={link:"link_46b "+t(61).locals.link,hover:"hover_723",inner:"inner_e7d",active:"active_8b4",compatibilityUnderlineMode:"compatibilityUnderlineMode_a72",pseudo:"pseudo_b5d",inherit:"inherit_bc0"}},34:function(n,e,t){n.exports=t(0)(427)},4:function(n,e,t){e=n.exports=t(9)(!1),e.push([n.i,'/* https://readymag.com/artemtiunov/RingUILanguage/colours/ */\n\n/*\nUnit shouldn\'t be CSS custom property because it is not intended to change\nAlso it won\'t form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/\n\n.clearfix_1e8::after {\n    display: block;\n    clear: both;\n\n    content: \'\';\n  }\n\n.font_3f3 {\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, Arial, sans-serif;\n  font-family: var(--ring-font-family);\n  font-size: 13px;\n  font-size: var(--ring-font-size);\n  line-height: 20px;\n  line-height: var(--ring-line-height);\n}\n\n.font-lower_cf2 {\n\n  line-height: 18px;\n\n  line-height: var(--ring-line-height-lower);\n}\n\n.font-smaller_1da {\n\n  font-size: 12px;\n\n  font-size: var(--ring-font-size-smaller);\n}\n\n.font-smaller-lower_c69 {\n\n  line-height: 16px;\n\n  line-height: var(--ring-line-height-lowest);\n}\n\n.font-larger-lower_fa1 {\n\n  font-size: 14px;\n\n  font-size: var(--ring-font-size-larger);\n}\n\n.font-larger_938 {\n\n  line-height: 21px;\n\n  line-height: var(--ring-line-height-taller);\n}\n\n/* To be used at large sizes */\n/* As close as possible to Helvetica Neue Thin (to replace Gotham) */\n.thin-font_52b {\n  font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;\n  font-size: 13px;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}\n\n.monospace-font_b2e {\n  font-family: Menlo, "Bitstream Vera Sans Mono", "Ubuntu Mono", Consolas, "Courier New", Courier, monospace;\n  font-family: var(--ring-font-family-monospace);\n  font-size: 12px;\n  font-size: var(--ring-font-size-smaller);\n}\n\n.ellipsis_894 {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\n/* Note: footer also has top margin which isn\'t taken into account here */\n\n/* Media breakpoints (minimal values) */\n\n/* Media queries */\n',""]),e.locals={unit:"8px","footer-height":"64px","breakpoint-small":"640px","breakpoint-middle":"960px","breakpoint-large":"1200px","extra-small-screen-media":"(max-width: 639px)","small-screen-media":"(min-width: 640px) and (max-width: 959px)","middle-screen-media":"(min-width: 960px) and (max-width: 1199px)","large-screen-media":"(min-width: 1200px)",clearfix:"clearfix_1e8",font:"font_3f3","font-lower":"font-lower_cf2 font_3f3","font-smaller":"font-smaller_1da font-lower_cf2 font_3f3","font-smaller-lower":"font-smaller-lower_c69 font-smaller_1da font-lower_cf2 font_3f3","font-larger-lower":"font-larger-lower_fa1 font-lower_cf2 font_3f3","font-larger":"font-larger_938 font-larger-lower_fa1 font-lower_cf2 font_3f3","thin-font":"thin-font_52b","monospace-font":"monospace-font_b2e",ellipsis:"ellipsis_894"}},46:function(n,e,t){"use strict";var o=t(265),r=t.n(o),i=new r.a;i.sniff(),e.a=i},47:function(n,e,t){n.exports=t(0)(258)},60:function(n,e){n.exports=function(n){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!n||"string"!=typeof n)return n;var t=e.protocol+"//"+e.host,o=t+e.pathname.replace(/\/[^\/]*$/,"/");return n.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(n,e){var r=e.trim().replace(/^"(.*)"$/,function(n,e){return e}).replace(/^'(.*)'$/,function(n,e){return e});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(r))return n;var i;return i=0===r.indexOf("//")?r:0===r.indexOf("/")?t+r:o+r.replace(/^\.\//,""),"url("+JSON.stringify(i)+")"})}},61:function(n,e,t){e=n.exports=t(9)(!1),e.i(t(13),""),e.i(t(4),void 0),e.push([n.i,"@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.close_247:hover {\n    color: #ff008c;\n    color: var(--ring-link-hover-color);\n  }}\n\n.alert_435 {\n  position: relative;\n\n  box-sizing: border-box;\n  min-height: 40px;\n  margin: 8px auto;\n  padding: 0 16px;\n\n  transition:\n    transform 300ms ease-out,\n    margin-bottom 300ms ease-out,\n    opacity 300ms ease-out;\n  white-space: nowrap;\n  pointer-events: auto;\n\n  border-radius: 3px;\n\n  border-radius: var(--ring-border-radius);\n  background-color: #111314;\n  background-color: var(--ring-message-background-color);\n  box-shadow: 0 2px 16px rgba(0, 42, 76, 0.15);\n  box-shadow: 0 2px 16px var(--ring-popup-shadow-color);\n\n  font-size: 13px;\n\n  font-size: var(--ring-font-size);\n  line-height: 40px;\n}\n\n.alertInline_539 {\n  margin: 8px;\n}\n\n.error_b59 {\n  word-wrap: break-word;\n\n  color: #c22731;\n\n  color: var(--ring-error-color);\n}\n\n.icon_ca6 {\n  margin-right: 8px;\n\n  vertical-align: -2px;\n}\n\n.caption_a16 {\n  display: inline-block;\n\n  max-width: calc(100% - 40px);\n\n  margin: 12px 40px 12px 0;\n\n  vertical-align: middle;\n  white-space: normal;\n\n  color: #fff;\n\n  color: var(--ring-dark-text-color);\n\n  line-height: 20px\n}\n\n.caption_a16 .ring-link,\n  \n  .caption_a16 .link_e30 {\n    color: #008eff;\n    color: var(--ring-main-color);\n  }\n\n.badge_ca3 {\n  margin-left: 8px;\n\n  vertical-align: baseline;\n}\n\n.loader_641 {\n  top: 2px;\n\n  margin-right: 8px;\n}\n\n.close_247 {\n  position: absolute;\n  top: 2px;\n  right: 0;\n\n  margin: 4px;\n  padding: 8px;\n\n  cursor: pointer;\n\n  color: #888;\n\n  color: var(--ring-dark-secondary-color);\n  border: none;\n  background: transparent;\n\n  font-size: 0;\n  line-height: 0\n}\n\n.close_247:focus {\n    color: #ff008c;\n    color: var(--ring-link-hover-color);\n  }\n\n@keyframes show_eec {\n  from {\n    transform: translateY(100%);\n\n    opacity: 0;\n  }\n\n  to {\n    transform: translateY(0);\n\n    opacity: 1;\n  }\n}\n\n@keyframes shaking_85f {\n  10%,\n  90% {\n    transform: translateX(-1px);\n  }\n\n  20%,\n  80% {\n    transform: translateX(2px);\n  }\n\n  30%,\n  50%,\n  70% {\n    transform: translateX(-4px);\n  }\n\n  40%,\n  60% {\n    transform: translateX(4px);\n  }\n}\n\n.animationOpen_c23 {\n  animation-name: show_eec;\n  animation-duration: 300ms;\n}\n\n.animationClosing_d66 {\n  z-index: -1;\n  z-index: var(--ring-invisible-element-z-index);\n\n  opacity: 0;\n}\n\n.animationShaking_28d {\n  animation-name: shaking_85f;\n  animation-duration: 500ms;\n}\n",""]),e.locals={unit:""+t(4).locals.unit,"animation-duration":"300ms","animation-easing":"ease-out",close:"close_247",alert:"alert_435",alertInline:"alertInline_539",error:"error_b59",icon:"icon_ca6",caption:"caption_a16",link:"link_e30",badge:"badge_ca3",loader:"loader_641",animationOpen:"animationOpen_c23",show:"show_eec",animationClosing:"animationClosing_d66",animationShaking:"animationShaking_28d",shaking:"shaking_85f"}},663:function(n,e,t){"use strict";function o(){return{restrict:"E",transclude:!0,replace:!0,template:'\n<a class="'.concat(l.a.link," ").concat(l.a.compatibilityUnderlineMode,'"\n><span class="').concat(l.a.inner,'" ng-transclude></span></a>\n    ')}}var r=t(18),i=(t.n(r),t(266)),a=(t.n(i),t(47)),c=t.n(a),s=t(302),l=t.n(s),u=c.a.module("Ring.link",[]);u.directive("rgLink",o),e.a=u.name},888:function(n,e,t){"use strict";function o(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}function r(n,e){for(var t=0;t<e.length;t++){var o=e[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(n,o.key,o)}}function i(n,e,t){return e&&r(n.prototype,e),t&&r(n,t),n}var a=t(24),c=(t.n(a),t(34)),s=(t.n(c),function(){function n(){o(this,n),this._plugins=[]}return i(n,[{key:"config",value:function(n){this._plugins=n}},{key:"track",value:function(n,e){if(n){var t=n.indexOf(":");t<0&&(t=n.indexOf("_")),t<0&&(t=n.length);var o=n.substr(0,t),r=n.substr(t+1);this.trackEvent(o,r,e)}}},{key:"trackPageView",value:function(n){this._plugins.forEach(function(e){e.trackPageView(n)})}},{key:"trackEvent",value:function(n,e,t){var o=t?e+this._buildSuffix(t):null;this._plugins.forEach(function(t){t.trackEvent(n,e),o&&t.trackEvent(n,o)})}},{key:"trackShortcutEvent",value:function(n,e,t){this.trackEvent(n,e,t),this.trackEvent("ring-shortcut","".concat(n,"$").concat(e),t)}},{key:"trackEntityProperties",value:function(n,e,t,o){for(var r=0;r<t.length;++r){var i=t[r].split("."),a=e;if(i.length){for(var c=0;c<i.length;++c){if(!a.hasOwnProperty(i[c])){a="no-value";break}a=a[i[c]]}"string"==typeof a&&(a=a.toLowerCase().replace(/[._]+/g,"-"));var s="".concat(i.join("-"),"__").concat(a);this.trackEvent(n,s,o)}}}},{key:"_buildSuffix",value:function(n){if(!n)return"";var e,t="";for(e in n)n.hasOwnProperty(e)&&(t+="__".concat(e,"$").concat(n[e]));return t}}]),n}());e.a=new s},889:function(n,e,t){"use strict";function o(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}function r(n,e){for(var t=0;t<e.length;t++){var o=e[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(n,o.key,o)}}function i(n,e,t){return e&&r(n.prototype,e),t&&r(n,t),n}t.d(e,"a",function(){return c});var a=t(900),c=function(){function n(e,t,r,i){o(this,n),this._data=[],this.config({send:e,isDevelopment:t,flushInterval:r,flushingAllowedChecker:i})}return i(n,[{key:"config",value:function(n){var e=this,t=n.flushingAllowedChecker;"function"!=typeof t&&(t=function(){return!0}),this._flush=function(){e._data.length>0&&t()&&(n.send(e._data),e._data=[])},this._isDevelopment=n.isDevelopment,this._flushInterval=n.flushInterval||1e4,this._flushMaxPackSize=n.flushMaxPackSize||100}},{key:"trackEvent",value:function(n,e){this._processEvent(n,e)}},{key:"trackPageView",value:function(n){this._lastPagePath!==n&&(this._trackPageViewAdditionalInfo(n),this._processEvent("ring-page",n),this._processEvent("ring-navigator_user-agent",a.a.getUserAgentPresentation()),this._processEvent("ring-navigator_platform",a.a.npeSaveLowerCase(navigator.platform)),this._processEvent("ring-navigator_lang",a.a.npeSaveLowerCase(navigator.language)),this._processEvent("ring-device-pixel-ratio",a.a.getDevicePixelRatioPresentation()),this._processEvent("ring-screen-width",a.a.getScreenWidthPresentation()))}},{key:"_initSendSchedule",value:function(){var n=this;window.addEventListener("beforeunload",function(){return n._trackPageViewAdditionalInfo(),n._flush()}),setInterval(this._flush,this._flushInterval),this._hasSendSchedule=!0}},{key:"_processEvent",value:function(n,e){!this._hasSendSchedule&&this._flush&&this._initSendSchedule();var t=a.a.reformatString(n,!0),o=a.a.reformatString(e);this._isDevelopment&&console.log("TRACKING DATA = ",t,o),this._addDataToFlushingPack({category:t,action:o})}},{key:"_trackPageViewAdditionalInfo",value:function(n){var e=(new Date).getTime();if(this._lastPagePath&&this._lastPageViewTime){var t=a.a.getPageViewDurationPresentation(e-this._lastPageViewTime);this._processEvent("ring-pageview-duration_".concat(this._lastPagePath),t)}this._lastPageViewTime=e,this._lastPagePath=n}},{key:"_addDataToFlushingPack",value:function(n){this._data.push(n),this._data.length>=this._flushMaxPackSize&&this._flush()}}]),n}()},9:function(n,e){function t(n,e){var t=n[1]||"",r=n[3];if(!r)return t;if(e&&"function"==typeof btoa){var i=o(r);return[t].concat(r.sources.map(function(n){return"/*# sourceURL="+r.sourceRoot+n+" */"})).concat([i]).join("\n")}return[t].join("\n")}function o(n){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */"}n.exports=function(n){var e=[];return e.toString=function(){return this.map(function(e){var o=t(e,n);return e[2]?"@media "+e[2]+"{"+o+"}":o}).join("")},e.i=function(n,t){"string"==typeof n&&(n=[[null,n,""]]);for(var o={},r=0;r<this.length;r++){var i=this[r][0];"number"==typeof i&&(o[i]=!0)}for(r=0;r<n.length;r++){var a=n[r];"number"==typeof a[0]&&o[a[0]]||(t&&!a[2]?a[2]=t:t&&(a[2]="("+a[2]+") and ("+t+")"),e.push(a))}},e}},900:function(n,e,t){"use strict";var o=t(18),r=(t.n(o),t(921)),i=(t.n(r),t(24)),a=(t.n(i),t(46)),c={};c.reformatString=function(n,e){var t=String(n),o=e?/[.:;!@#^&*(){}\[\]?,%=+\\\/]+/g:/[.:;!@#^&*(){}\[\]?,%=+\\]+/g;return t.replace(o,"_")},c.getPageViewDurationPresentation=function(n){var e=n/1e3;if(e>3600)return"more-than-hour";var t=Math.floor(Math.pow(2,Math.floor(Math.log2(e))+1));return t=t>0?t:1,"less-than-".concat(t,"-sec")},c.getScreenWidthPresentation=function(){for(var n=[0,768,992,1200],e=1;e<n.length;++e)if(window.innerWidth<n[e])return"[".concat(n[e-1],"px;").concat(n[e],"px)");return"[1200px;inf)"},c.npeSaveLowerCase=function(n){return(n||"unknown").toLowerCase()},c.getUserAgentPresentation=function(){var n=c.npeSaveLowerCase(a.a.browser.name||"unknown"),e=a.a.browser.version[0],t=e||"unknown";return"".concat(n,"$").concat(t)},c.getDevicePixelRatioPresentation=function(){return window.devicePixelRatio&&window.devicePixelRatio.toFixed?String(window.devicePixelRatio.toFixed(1)):"unknown"},e.a=c},921:function(n,e,t){n.exports=t(0)(373)},925:function(n,e,t){"use strict";var o=t(18),r=(t.n(o),t(47)),i=t.n(r),a=t(888),c=t(965),s=t(889),l=i.a.module("Ring.analytics",[]);l.provider("analytics",function(){var n=[];this.plugins=function(e){n=e},this.$get=["$log","$injector",function(e,t){for(var o=[],r=0;r<n.length;++r)if("string"==typeof n[r])try{var i=t.get(n[r]);o.push(i),e.debug("analytics: loaded plugin ".concat(n[r]))}catch(t){e.debug("analytics: unable to load factory ".concat(n[r]))}else o.push(n[r]);return a.a.config(o),a.a}]}),l.constant("AnalyticsGAPlugin",c.a),l.constant("AnalyticsCustomPlugin",s.a),l.run(["$rootScope","analytics",function(n,e){n.$on("$routeChangeSuccess",function(n,t){t&&t.$$route&&t.$$route.originalPath&&e.trackPageView(t.$$route.originalPath)})}]),l.directive("rgAnalytics",["analytics",function(n){return{restrict:"A",replace:!1,link:function(e,t){var o=t.attr("rg-analytics-on")||"click";i.a.element(t).bind(o,function(){n.track(t.attr("rg-analytics"))})}}}]),e.a=l.name},965:function(n,e,t){"use strict";function o(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}function r(n,e){for(var t=0;t<e.length;t++){var o=e[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(n,o.key,o)}}function i(n,e,t){return e&&r(n.prototype,e),t&&r(n,t),n}t.d(e,"a",function(){return a});var a=function(){function n(e,t){if(o(this,n),e||t){!function(n,e,t,o,r,i,a){n.GoogleAnalyticsObject=r,n[r]=n[r]||function(){(n[r].q=n[r].q||[]).push(arguments)},n[r].l=1*new Date,i=e.createElement(t),a=e.getElementsByTagName(t)[0],i.async=1,i.src="//www.google-analytics.com/analytics.js",a.parentNode.insertBefore(i,a)}(window,document,"script",0,"ga");var r=e||"UA-57284711-1";ga("create",r,e?{}:{cookieDomain:"none"})}}return i(n,[{key:"trackEvent",value:function(n,e){if(window.ga){var t={eventCategory:n,eventAction:e};ga("send","event",t)}}},{key:"trackPageView",value:function(n){window.ga&&ga("send","pageview",n)}}]),n}()}});