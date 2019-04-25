!function(n){function e(t){if(r[t])return r[t].exports;var o=r[t]={i:t,l:!1,exports:{}};return n[t].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var r={};e.m=n,e.c=r,e.i=function(n){return n},e.d=function(n,r,t){e.o(n,r)||Object.defineProperty(n,r,{configurable:!1,enumerable:!0,get:t})},e.n=function(n){var r=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(r,"a",r),r},e.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},e.p="/",e(e.s=983)}({0:function(n,e){n.exports=vendor_lib},1:function(n,e,r){n.exports=r(0)(453)},10:function(n,e,r){n.exports=r(0)(403)},12:function(n,e,r){n.exports=r(0)(391)},13:function(n,e,r){e=n.exports=r(9)(!1),e.push([n.i,'/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #263b4c;\n  --ring-borders-color: #b8d1e5;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: var(--ring-border-disabled-color);\n  --ring-border-hover-color: #80c6ff;\n  --ring-icon-hover-color: var(--ring-border-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1c8c32;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #f2f9ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #808080;\n  --ring-code-meta-color: #808000;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #008000;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n\n  /* TODO: return raw value back if this issue fixed https://github.com/JLHwung/postcss-font-family-system-ui/issues/65 */\n  --ring-font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, "Bitstream Vera Sans Mono", "Ubuntu Mono", Consolas, "Courier New", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n',""])},14:function(n,e,r){function t(n,e){for(var r=0;r<n.length;r++){var t=n[r],o=h[t.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](t.parts[i]);for(;i<t.parts.length;i++)o.parts.push(f(t.parts[i],e))}else{for(var a=[],i=0;i<t.parts.length;i++)a.push(f(t.parts[i],e));h[t.id]={id:t.id,refs:1,parts:a}}}}function o(n,e){for(var r=[],t={},o=0;o<n.length;o++){var i=n[o],a=e.base?i[0]+e.base:i[0],c=i[1],l=i[2],s=i[3],u={css:c,media:l,sourceMap:s};t[a]?t[a].parts.push(u):r.push(t[a]={id:a,parts:[u]})}return r}function i(n,e){var r=m(n.insertInto);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var t=w[w.length-1];if("top"===n.insertAt)t?t.nextSibling?r.insertBefore(e,t.nextSibling):r.appendChild(e):r.insertBefore(e,r.firstChild),w.push(e);else if("bottom"===n.insertAt)r.appendChild(e);else{if("object"!=typeof n.insertAt||!n.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var o=m(n.insertAt.before,r);r.insertBefore(e,o)}}function a(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n);var e=w.indexOf(n);e>=0&&w.splice(e,1)}function c(n){var e=document.createElement("style");if(void 0===n.attrs.type&&(n.attrs.type="text/css"),void 0===n.attrs.nonce){var r=u();r&&(n.attrs.nonce=r)}return s(e,n.attrs),i(n,e),e}function l(n){var e=document.createElement("link");return void 0===n.attrs.type&&(n.attrs.type="text/css"),n.attrs.rel="stylesheet",s(e,n.attrs),i(n,e),e}function s(n,e){Object.keys(e).forEach(function(r){n.setAttribute(r,e[r])})}function u(){return r.nc}function f(n,e){var r,t,o,i;if(e.transform&&n.css){if(!(i="function"==typeof e.transform?e.transform(n.css):e.transform.default(n.css)))return function(){};n.css=i}if(e.singleton){var s=x++;r=y||(y=c(e)),t=d.bind(null,r,s,!1),o=d.bind(null,r,s,!0)}else n.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(r=l(e),t=p.bind(null,r,e),o=function(){a(r),r.href&&URL.revokeObjectURL(r.href)}):(r=c(e),t=g.bind(null,r),o=function(){a(r)});return t(n),function(e){if(e){if(e.css===n.css&&e.media===n.media&&e.sourceMap===n.sourceMap)return;t(n=e)}else o()}}function d(n,e,r,t){var o=r?"":t.css;if(n.styleSheet)n.styleSheet.cssText=E(e,o);else{var i=document.createTextNode(o),a=n.childNodes;a[e]&&n.removeChild(a[e]),a.length?n.insertBefore(i,a[e]):n.appendChild(i)}}function g(n,e){var r=e.css,t=e.media;if(t&&n.setAttribute("media",t),n.styleSheet)n.styleSheet.cssText=r;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(r))}}function p(n,e,r){var t=r.css,o=r.sourceMap,i=void 0===e.convertToAbsoluteUrls&&o;(e.convertToAbsoluteUrls||i)&&(t=k(t)),o&&(t+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var a=new Blob([t],{type:"text/css"}),c=n.href;n.href=URL.createObjectURL(a),c&&URL.revokeObjectURL(c)}var h={},b=function(n){var e;return function(){return void 0===e&&(e=n.apply(this,arguments)),e}}(function(){return window&&document&&document.all&&!window.atob}),v=function(n,e){return e?e.querySelector(n):document.querySelector(n)},m=function(n){var e={};return function(n,r){if("function"==typeof n)return n();if(void 0===e[n]){var t=v.call(this,n,r);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(n){t=null}e[n]=t}return e[n]}}(),y=null,x=0,w=[],k=r(60);n.exports=function(n,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");e=e||{},e.attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=b()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var r=o(n,e);return t(r,e),function(n){for(var i=[],a=0;a<r.length;a++){var c=r[a],l=h[c.id];l.refs--,i.push(l)}n&&t(o(n,e),e);for(var a=0;a<i.length;a++){var l=i[a];if(0===l.refs){for(var s=0;s<l.parts.length;s++)l.parts[s]();delete h[l.id]}}}};var E=function(){var n=[];return function(e,r){return n[e]=r,n.filter(Boolean).join("\n")}}()},21:function(n,e,r){n.exports=r(0)(429)},23:function(n,e,r){n.exports=r(0)(443)},24:function(n,e,r){n.exports=r(0)(426)},3:function(n,e,r){n.exports=r(0)(477)},31:function(n,e,r){"use strict";function t(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}function o(n,e){for(var r=0;r<e.length;r++){var t=e[r];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(n,t.key,t)}}function i(n,e,r){return e&&o(n.prototype,e),r&&o(n,r),n}function a(n,e,r){return e in n?Object.defineProperty(n,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[e]=r,n}function c(n){return n===document||n instanceof Node&&document.documentElement.contains(n.parentNode)}function l(n){if(n instanceof Range||c(n)){var e=n.getBoundingClientRect();return{top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.width,height:e.height}}return Object.assign({},S)}function s(){return"devicePixelRatio"in window?window.devicePixelRatio:1}function u(){return window.innerHeight}function f(){return document.documentElement&&document.documentElement.scrollTop||document.body.scrollTop}function d(){return document.documentElement&&document.documentElement.scrollLeft||document.body.scrollLeft}function g(n){n.preventDefault&&n.preventDefault()}r.d(e,"d",function(){return O}),e.h=c,e.a=l,e.b=s,e.g=u,e.e=f,e.f=d,r.d(e,"l",function(){return R}),r.d(e,"j",function(){return U}),r.d(e,"k",function(){return j}),r.d(e,"c",function(){return L}),e.i=g;var p=r(3),h=(r.n(p),r(1)),b=(r.n(h),r(23)),v=(r.n(b),r(80)),m=(r.n(v),r(10)),y=(r.n(m),r(7)),x=(r.n(y),r(8)),w=(r.n(x),r(5)),k=(r.n(w),r(32)),E=(r.n(k),r(34)),C=(r.n(E),r(12)),O=(r.n(C),window.getComputedStyle.bind(window)),S={top:0,right:0,bottom:0,left:0,width:0,height:0},R=function(n){return function(e){(arguments.length>1&&void 0!==arguments[1]?arguments[1]:"").split(/\s+/g).filter(function(n){return!!n}).forEach(function(r){return e[n](r)})}},U=R("add"),j=R("remove"),L=function(){function n(){t(this,n),a(this,"_all",new Set)}return i(n,[{key:"add",value:function(n,e,r,t){n.addEventListener(e,r,t);var o=function(){return n.removeEventListener(e,r,t)};return this._all.add(o),o}},{key:"remove",value:function(n){n(),this._all.delete(n)}},{key:"removeAll",value:function(){var n=this;this._all.forEach(function(e){return n.remove(e)})}}]),n}()},32:function(n,e,r){n.exports=r(0)(469)},34:function(n,e,r){n.exports=r(0)(428)},419:function(n,e,r){"use strict";function t(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}function o(n,e){for(var r=0;r<e.length;r++){var t=e[r];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(n,t.key,t)}}function i(n,e,r){return e&&o(n.prototype,e),r&&o(n,r),n}r.d(e,"a",function(){return u});var a=r(21),c=(r.n(a),r(5)),l=(r.n(c),r(24)),s=(r.n(l),r(31)),u=function(){function n(e){t(this,n),this.target=e}return i(n,null,[{key:"normalizeNewlines",value:function(n){return"string"==typeof n?n.replace(this.returnRE,""):n}}]),i(n,[{key:"isContentEditable",value:function(){return"true"===this.target.contentEditable}},{key:"focus",value:function(){document.activeElement&&document.activeElement===this.target||this.target.focus()}},{key:"getPosition",value:function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(this.isContentEditable()){n.avoidFocus||this.focus();var e=window.getSelection();if(!e.rangeCount)return 0;var r=e.getRangeAt(0);if(r.startOffset!==r.endOffset)return-1;var t=r.cloneRange();return t.selectNodeContents(this.target),t.setEnd(r.endContainer,r.endOffset),t.toString().length}return this.target.selectionStart!==this.target.selectionEnd?-1:this.target.selectionStart}},{key:"setPosition",value:function(n){var e,r=this.isContentEditable();if(e=-1===n?(r?this.target.textContent:this.constructor.normalizeNewlines(this.target.value)).length:n,r){this.focus();try{window.getSelection().collapse(this.target.firstChild||this.target,e)}catch(n){}}else this.target.setSelectionRange(e,e);return e}},{key:"getOffset",value:function(){var n,e=0;try{n=window.getSelection().getRangeAt(0).cloneRange(),n.setStart(n.startContainer,n.startOffset-1)}catch(n){return e}return n&&0!==n.endOffset&&""!==n.toString()&&(e=r.i(s.a)(n).right-r.i(s.a)(this.target).left-(n.startContainer.offsetLeft||0)),e}}]),n}();!function(n,e,r){e in n?Object.defineProperty(n,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[e]=r}(u,"returnRE",/\r/g)},5:function(n,e,r){n.exports=r(0)(407)},567:function(n,e,r){var t=r(648);"string"==typeof t&&(t=[[n.i,t,""]]);var o={hmr:!0};o.transform=void 0,o.insertInto=void 0,r(14)(t,o),t.locals&&(n.exports=t.locals)},569:function(n,e,r){var t=r(585);"string"==typeof t&&(t=[[n.i,t,""]]);var o={hmr:!0};o.transform=void 0,o.insertInto=void 0,r(14)(t,o),t.locals&&(n.exports=t.locals)},585:function(n,e,r){e=n.exports=r(9)(!1),e.push([n.i,".ring-input{-webkit-appearance:none;-moz-appearance:none;appearance:none;border-radius:0;box-sizing:border-box;margin:0;padding-right:4px;padding-left:4px;padding-bottom:3px;border:1px solid #b8d1e5;border:1px solid var(--ring-borders-color);background-color:#fff;background-color:var(--ring-content-background-color);color:#1f2326;color:var(--ring-text-color);font-size:13px;font-size:var(--ring-font-size);font-family:system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, Arial, sans-serif;font-family:var(--ring-font-family);line-height:20px;height:24px;width:100%}.ring-input:active,.ring-input:focus,.ring-input_active,.ring-input_focus{border-color:#008eff;border-color:var(--ring-main-color);outline:0}.ring-input_correct{border-color:#1c8c32;border-color:var(--ring-success-color)}.ring-input_error{border-color:#c22731;border-color:var(--ring-error-color)}.ring-input_no-resize{resize:none}.ring-input_filter-popup{min-width:200px;width:100%}.ring-input_material{padding-left:0;padding-right:0;border-top:0;border-left:0;border-right:0}.ring-input.ring-input:disabled,.ring-input.ring-input[disabled],.ring-input.ring-input_disabled{border-color:#dbdbdb;border-color:var(--ring-border-disabled-color);background-color:#f7f9fa;background-color:var(--ring-sidebar-background-color);color:#999;color:var(--ring-disabled-color)}textarea.ring-input{height:auto;min-height:64px;resize:vertical;vertical-align:top}textarea.ring-input:-ms-input-placeholder{color:#999;color:var(--ring-disabled-color)}textarea.ring-input::-ms-input-placeholder{color:#999;color:var(--ring-disabled-color)}textarea.ring-input::placeholder{color:#999;color:var(--ring-disabled-color)}",""])},60:function(n,e){n.exports=function(n){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!n||"string"!=typeof n)return n;var r=e.protocol+"//"+e.host,t=r+e.pathname.replace(/\/[^\/]*$/,"/");return n.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(n,e){var o=e.trim().replace(/^"(.*)"$/,function(n,e){return e}).replace(/^'(.*)'$/,function(n,e){return e});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(o))return n;var i;return i=0===o.indexOf("//")?o:0===o.indexOf("/")?r+o:t+o.replace(/^\.\//,""),"url("+JSON.stringify(i)+")"})}},648:function(n,e,r){e=n.exports=r(9)(!1),e.i(r(13),""),e.push([n.i,'/**\n  These styles are deprecated and kept for backward compatibility with direct class usages\n  like `<a class="ring-link">link</a>\n */\n\n.ring-link {\n    cursor: pointer;\n    transition: color 0.15s ease-out;\n    transition: color var(--ring-fast-ease);\n\n    text-decoration: none;\n\n    color: #0f5b99;\n\n    color: var(--ring-link-color);\n  }\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.ring-link:hover {\n    transition: none;\n\n    text-decoration: underline;\n\n    color: #ff008c;\n\n    color: var(--ring-link-hover-color);\n  }}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.ring-link_inherit:not(:hover) {\n  color: inherit;\n}}\n',""])},7:function(n,e,r){n.exports=r(0)(478)},8:function(n,e,r){n.exports=r(0)(90)},80:function(n,e,r){n.exports=r(0)(430)},9:function(n,e){function r(n,e){var r=n[1]||"",o=n[3];if(!o)return r;if(e&&"function"==typeof btoa){var i=t(o);return[r].concat(o.sources.map(function(n){return"/*# sourceURL="+o.sourceRoot+n+" */"})).concat([i]).join("\n")}return[r].join("\n")}function t(n){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */"}n.exports=function(n){var e=[];return e.toString=function(){return this.map(function(e){var t=r(e,n);return e[2]?"@media "+e[2]+"{"+t+"}":t}).join("")},e.i=function(n,r){"string"==typeof n&&(n=[[null,n,""]]);for(var t={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(t[i]=!0)}for(o=0;o<n.length;o++){var a=n[o];"number"==typeof a[0]&&t[a[0]]||(r&&!a[2]?a[2]=r:r&&(a[2]="("+a[2]+") and ("+r+")"),e.push(a))}},e}},983:function(n,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var t=r(569),o=(r.n(t),r(567)),i=(r.n(o),r(419)),a=document.getElementById("test-input"),c=new i.a(a);document.getElementById("cursor-action").addEventListener("click",function(n){c.focus(),c.setPosition(4),n.preventDefault()})}});