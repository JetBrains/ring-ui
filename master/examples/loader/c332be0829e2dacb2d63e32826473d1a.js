!function(n){function e(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return n[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var t={};e.m=n,e.c=t,e.i=function(n){return n},e.d=function(n,t,r){e.o(n,t)||Object.defineProperty(n,t,{configurable:!1,enumerable:!0,get:r})},e.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(t,"a",t),t},e.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},e.p="/",e(e.s=1003)}({0:function(n,e){n.exports=vendor_lib},1:function(n,e,t){n.exports=t(0)(452)},10:function(n,e,t){n.exports=t(0)(402)},1003:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=t(2),o=t.n(r),i=t(19),a=(t.n(i),t(545));t.i(i.render)(o.a.createElement(a.a,{message:"Loading..."}),document.getElementById("loader1")),t.i(i.render)(o.a.createElement(a.a,{message:"Loading..."}),document.getElementById("loader2"))},12:function(n,e,t){n.exports=t(0)(390)},13:function(n,e,t){e=n.exports=t(9)(!1),e.push([n.i,'/* stylelint-disable color-no-hex */\n\n:root {\n  --ring-unit: 8px;\n\n  /* Element */\n  --ring-line-color: #dfe5eb;\n  --ring-dark-line-color: #263b4c;\n  --ring-borders-color: #b8d1e5;\n  --ring-icon-color: var(--ring-borders-color);\n  --ring-icon-secondary-color: #999;\n  --ring-border-disabled-color: #dbdbdb;\n  --ring-icon-disabled-color: var(--ring-border-disabled-color);\n  --ring-border-hover-color: #80c6ff;\n  --ring-icon-hover-color: var(--ring-border-hover-color);\n  --ring-main-color: #008eff;\n  --ring-main-hover-color: #007ee5;\n  --ring-icon-error-color: #db5860;\n  --ring-icon-warning-color: #eda200;\n  --ring-icon-success-color: #59a869;\n  --ring-pale-control-color: #cfdbe5;\n  --ring-popup-border-components: 0, 42, 76;\n  --ring-popup-border-color: rgba(var(--ring-popup-border-components), 0.1);\n  --ring-popup-shadow-color: rgba(var(--ring-popup-border-components), 0.15);\n  --ring-message-shadow-color: rgba(var(--ring-popup-border-components), 0.3);\n\n  /* Text */\n  --ring-search-color: #669ecc;\n  --ring-hint-color: #406380;\n  --ring-link-color: #0f5b99;\n  --ring-link-hover-color: #ff008c;\n  --ring-error-color: #c22731;\n  --ring-warning-color: #cc8b00;\n  --ring-success-color: #1c8c32;\n  --ring-text-color: #1f2326;\n  --ring-dark-text-color: #fff;\n  --ring-heading-color: var(--ring-text-color);\n  --ring-secondary-color: #737577;\n  --ring-dark-secondary-color: #888;\n  --ring-disabled-color: #999;\n  --ring-dark-disabled-color: #444;\n  --ring-dark-active-color: #ccc;\n\n  /* Background */\n  --ring-content-background-color: #fff;\n  --ring-popup-background-color: #fff;\n  --ring-sidebar-background-color: #f7f9fa;\n  --ring-selected-background-color: #d4edff;\n  --ring-hover-background-color: #f2f9ff;\n  --ring-dark-selected-background-color: #002a4d;\n  --ring-message-background-color: #111314;\n  --ring-navigation-background-color: #000;\n  --ring-tag-background-color: #e6ecf2;\n\n  /* Code */\n  --ring-code-background-color: var(--ring-content-background-color);\n  --ring-code-color: #000;\n  --ring-code-comment-color: #808080;\n  --ring-code-meta-color: #808000;\n  --ring-code-keyword-color: #000080;\n  --ring-code-tag-background-color: #efefef;\n  --ring-code-tag-color: var(--ring-code-keyword-color);\n  --ring-code-tag-font-weight: bold;\n  --ring-code-field-color: #660e7a;\n  --ring-code-attribute-color: #00f;\n  --ring-code-number-color: var(--ring-code-attribute-color);\n  --ring-code-string-color: #008000;\n  --ring-code-addition-color: #aadeaa;\n  --ring-code-deletion-color: #c8c8c8;\n\n  /* Metrics */\n  --ring-border-radius: 3px;\n  --ring-border-radius-small: 2px;\n  --ring-font-size-larger: 14px;\n  --ring-font-size: 13px;\n  --ring-font-size-smaller: 12px;\n  --ring-line-height-taller: 21px;\n  --ring-line-height: 20px;\n  --ring-line-height-lower: 18px;\n  --ring-line-height-lowest: 16px;\n  --ring-ease: 0.3s ease-out;\n  --ring-fast-ease: 0.15s ease-out;\n\n  /* TODO: return raw value back if this issue fixed https://github.com/JLHwung/postcss-font-family-system-ui/issues/65 */\n  --ring-font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, Arial, sans-serif;\n  --ring-font-family-monospace: Menlo, "Bitstream Vera Sans Mono", "Ubuntu Mono", Consolas, "Courier New", Courier, monospace;\n\n  /* Common z-index-values */\n\n  /* Invisible element is an absolutely positioned element which should be below */\n  /* all other elements on the page */\n  --ring-invisible-element-z-index: -1;\n\n  /* z-index for position: fixed elements */\n  --ring-fixed-z-index: 1;\n\n  /* Elements that should overlay all other elements on the page */\n  --ring-overlay-z-index: 5;\n\n  /* Alerts should de displayed above overlays */\n  --ring-alert-z-index: 6;\n}\n',""])},14:function(n,e,t){function r(n,e){for(var t=0;t<n.length;t++){var r=n[t],o=g[r.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](r.parts[i]);for(;i<r.parts.length;i++)o.parts.push(f(r.parts[i],e))}else{for(var a=[],i=0;i<r.parts.length;i++)a.push(f(r.parts[i],e));g[r.id]={id:r.id,refs:1,parts:a}}}}function o(n,e){for(var t=[],r={},o=0;o<n.length;o++){var i=n[o],a=e.base?i[0]+e.base:i[0],s=i[1],c=i[2],l=i[3],u={css:s,media:c,sourceMap:l};r[a]?r[a].parts.push(u):t.push(r[a]={id:a,parts:[u]})}return t}function i(n,e){var t=v(n.insertInto);if(!t)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=w[w.length-1];if("top"===n.insertAt)r?r.nextSibling?t.insertBefore(e,r.nextSibling):t.appendChild(e):t.insertBefore(e,t.firstChild),w.push(e);else if("bottom"===n.insertAt)t.appendChild(e);else{if("object"!=typeof n.insertAt||!n.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var o=v(n.insertAt.before,t);t.insertBefore(e,o)}}function a(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n);var e=w.indexOf(n);e>=0&&w.splice(e,1)}function s(n){var e=document.createElement("style");if(void 0===n.attrs.type&&(n.attrs.type="text/css"),void 0===n.attrs.nonce){var t=u();t&&(n.attrs.nonce=t)}return l(e,n.attrs),i(n,e),e}function c(n){var e=document.createElement("link");return void 0===n.attrs.type&&(n.attrs.type="text/css"),n.attrs.rel="stylesheet",l(e,n.attrs),i(n,e),e}function l(n,e){Object.keys(e).forEach(function(t){n.setAttribute(t,e[t])})}function u(){return t.nc}function f(n,e){var t,r,o,i;if(e.transform&&n.css){if(!(i="function"==typeof e.transform?e.transform(n.css):e.transform.default(n.css)))return function(){};n.css=i}if(e.singleton){var l=x++;t=y||(y=s(e)),r=d.bind(null,t,l,!1),o=d.bind(null,t,l,!0)}else n.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(t=c(e),r=h.bind(null,t,e),o=function(){a(t),t.href&&URL.revokeObjectURL(t.href)}):(t=s(e),r=p.bind(null,t),o=function(){a(t)});return r(n),function(e){if(e){if(e.css===n.css&&e.media===n.media&&e.sourceMap===n.sourceMap)return;r(n=e)}else o()}}function d(n,e,t,r){var o=t?"":r.css;if(n.styleSheet)n.styleSheet.cssText=S(e,o);else{var i=document.createTextNode(o),a=n.childNodes;a[e]&&n.removeChild(a[e]),a.length?n.insertBefore(i,a[e]):n.appendChild(i)}}function p(n,e){var t=e.css,r=e.media;if(r&&n.setAttribute("media",r),n.styleSheet)n.styleSheet.cssText=t;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(t))}}function h(n,e,t){var r=t.css,o=t.sourceMap,i=void 0===e.convertToAbsoluteUrls&&o;(e.convertToAbsoluteUrls||i)&&(r=k(r)),o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var a=new Blob([r],{type:"text/css"}),s=n.href;n.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}var g={},m=function(n){var e;return function(){return void 0===e&&(e=n.apply(this,arguments)),e}}(function(){return window&&document&&document.all&&!window.atob}),b=function(n,e){return e?e.querySelector(n):document.querySelector(n)},v=function(n){var e={};return function(n,t){if("function"==typeof n)return n();if(void 0===e[n]){var r=b.call(this,n,t);if(window.HTMLIFrameElement&&r instanceof window.HTMLIFrameElement)try{r=r.contentDocument.head}catch(n){r=null}e[n]=r}return e[n]}}(),y=null,x=0,w=[],k=t(60);n.exports=function(n,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");e=e||{},e.attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=m()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var t=o(n,e);return r(t,e),function(n){for(var i=[],a=0;a<t.length;a++){var s=t[a],c=g[s.id];c.refs--,i.push(c)}n&&r(o(n,e),e);for(var a=0;a<i.length;a++){var c=i[a];if(0===c.refs){for(var l=0;l<c.parts.length;l++)c.parts[l]();delete g[c.id]}}}};var S=function(){var n=[];return function(e,t){return n[e]=t,n.filter(Boolean).join("\n")}}()},19:function(n,e,t){n.exports=t(0)(262)},2:function(n,e,t){n.exports=t(0)(61)},20:function(n,e,t){"use strict";function r(n){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(n)}function o(n){return s(n)||a(n)||i()}function i(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function a(n){if(Symbol.iterator in Object(n)||"[object Arguments]"===Object.prototype.toString.call(n))return Array.from(n)}function s(n){if(Array.isArray(n)){for(var e=0,t=new Array(n.length);e<n.length;e++)t[e]=n[e];return t}}function c(n,e){return f(n)||u(n,e)||l()}function l(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function u(n,e){var t=[],r=!0,o=!1,i=void 0;try{for(var a,s=n[Symbol.iterator]();!(r=(a=s.next()).done)&&(t.push(a.value),!e||t.length!==e);r=!0);}catch(n){o=!0,i=n}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return t}function f(n){if(Array.isArray(n))return n}function d(n){return Object.entries(n).reduce(function(n,e){var t=c(e,2),r=t[0];return t[1]?o(n).concat([r]):n},[])}function p(){for(var n=arguments.length,e=new Array(n),t=0;t<n;t++)e[t]=arguments[t];return e.filter(function(n){return!!n}).reduce(function(n,e){return"object"===r(e)?o(n).concat(o(d(e))):o(n).concat([e])},[]).join(" ")}e.a=p;var h=t(23),g=(t.n(h),t(59)),m=(t.n(g),t(21)),b=(t.n(m),t(3)),v=(t.n(b),t(1)),y=(t.n(v),t(7)),x=(t.n(y),t(8)),w=(t.n(x),t(5)),k=(t.n(w),t(32));t.n(k)},21:function(n,e,t){n.exports=t(0)(428)},23:function(n,e,t){n.exports=t(0)(442)},3:function(n,e,t){n.exports=t(0)(476)},31:function(n,e,t){"use strict";function r(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}function o(n,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(n,r.key,r)}}function i(n,e,t){return e&&o(n.prototype,e),t&&o(n,t),n}function a(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function s(n){return n===document||n instanceof Node&&document.documentElement.contains(n.parentNode)}function c(n){if(n instanceof Range||s(n)){var e=n.getBoundingClientRect();return{top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.width,height:e.height}}return Object.assign({},j)}function l(){return"devicePixelRatio"in window?window.devicePixelRatio:1}function u(){return window.innerHeight}function f(){return document.documentElement&&document.documentElement.scrollTop||document.body.scrollTop}function d(){return document.documentElement&&document.documentElement.scrollLeft||document.body.scrollLeft}function p(n){n.preventDefault&&n.preventDefault()}t.d(e,"d",function(){return O}),e.h=s,e.a=c,e.b=l,e.g=u,e.e=f,e.f=d,t.d(e,"l",function(){return C}),t.d(e,"j",function(){return z}),t.d(e,"k",function(){return R}),t.d(e,"c",function(){return E}),e.i=p;var h=t(3),g=(t.n(h),t(1)),m=(t.n(g),t(23)),b=(t.n(m),t(80)),v=(t.n(b),t(10)),y=(t.n(v),t(7)),x=(t.n(y),t(8)),w=(t.n(x),t(5)),k=(t.n(w),t(32)),S=(t.n(k),t(34)),_=(t.n(S),t(12)),O=(t.n(_),window.getComputedStyle.bind(window)),j={top:0,right:0,bottom:0,left:0,width:0,height:0},C=function(n){return function(e){(arguments.length>1&&void 0!==arguments[1]?arguments[1]:"").split(/\s+/g).filter(function(n){return!!n}).forEach(function(t){return e[n](t)})}},z=C("add"),R=C("remove"),E=function(){function n(){r(this,n),a(this,"_all",new Set)}return i(n,[{key:"add",value:function(n,e,t,r){n.addEventListener(e,t,r);var o=function(){return n.removeEventListener(e,t,r)};return this._all.add(o),o}},{key:"remove",value:function(n){n(),this._all.delete(n)}},{key:"removeAll",value:function(){var n=this;this._all.forEach(function(e){return n.remove(e)})}}]),n}()},32:function(n,e,t){n.exports=t(0)(468)},33:function(n,e,t){n.exports=t(0)(261)},34:function(n,e,t){n.exports=t(0)(427)},4:function(n,e,t){e=n.exports=t(9)(!1),e.push([n.i,'/* https://readymag.com/artemtiunov/RingUILanguage/colours/ */\n\n/*\nUnit shouldn\'t be CSS custom property because it is not intended to change\nAlso it won\'t form in FF47 https://bugzilla.mozilla.org/show_bug.cgi?id=594933\n*/\n\n.clearfix_1e8::after {\n    display: block;\n    clear: both;\n\n    content: \'\';\n  }\n\n.font_3f3 {\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, Arial, sans-serif;\n  font-family: var(--ring-font-family);\n  font-size: 13px;\n  font-size: var(--ring-font-size);\n  line-height: 20px;\n  line-height: var(--ring-line-height);\n}\n\n.font-lower_cf2 {\n\n  line-height: 18px;\n\n  line-height: var(--ring-line-height-lower);\n}\n\n.font-smaller_1da {\n\n  font-size: 12px;\n\n  font-size: var(--ring-font-size-smaller);\n}\n\n.font-smaller-lower_c69 {\n\n  line-height: 16px;\n\n  line-height: var(--ring-line-height-lowest);\n}\n\n.font-larger-lower_fa1 {\n\n  font-size: 14px;\n\n  font-size: var(--ring-font-size-larger);\n}\n\n.font-larger_938 {\n\n  line-height: 21px;\n\n  line-height: var(--ring-line-height-taller);\n}\n\n/* To be used at large sizes */\n/* As close as possible to Helvetica Neue Thin (to replace Gotham) */\n.thin-font_52b {\n  font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;\n  font-size: 13px;\n  font-size: var(--ring-font-size);\n  font-weight: 100; /* Renders Helvetica Neue UltraLight on OS X  */\n}\n\n.monospace-font_b2e {\n  font-family: Menlo, "Bitstream Vera Sans Mono", "Ubuntu Mono", Consolas, "Courier New", Courier, monospace;\n  font-family: var(--ring-font-family-monospace);\n  font-size: 12px;\n  font-size: var(--ring-font-size-smaller);\n}\n\n.ellipsis_894 {\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\n/* Note: footer also has top margin which isn\'t taken into account here */\n\n/* Media breakpoints (minimal values) */\n\n/* Media queries */\n',""]),e.locals={unit:"8px","footer-height":"64px","breakpoint-small":"640px","breakpoint-middle":"960px","breakpoint-large":"1200px","extra-small-screen-media":"(max-width: 639px)","small-screen-media":"(min-width: 640px) and (max-width: 959px)","middle-screen-media":"(min-width: 960px) and (max-width: 1199px)","large-screen-media":"(min-width: 1200px)",clearfix:"clearfix_1e8",font:"font_3f3","font-lower":"font-lower_cf2 font_3f3","font-smaller":"font-smaller_1da font-lower_cf2 font_3f3","font-smaller-lower":"font-smaller-lower_c69 font-smaller_1da font-lower_cf2 font_3f3","font-larger-lower":"font-larger-lower_fa1 font-lower_cf2 font_3f3","font-larger":"font-larger_938 font-larger-lower_fa1 font-lower_cf2 font_3f3","thin-font":"thin-font_52b","monospace-font":"monospace-font_b2e",ellipsis:"ellipsis_894"}},5:function(n,e,t){n.exports=t(0)(406)},531:function(n,e,t){n.exports=t(0)(334)},535:function(n,e,t){"use strict";function r(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}function o(n,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(n,r.key,r)}}function i(n,e,t){return e&&o(n.prototype,e),t&&o(n,t),n}t.d(e,"a",function(){return p});var a=t(12),s=(t.n(a),t(531)),c=(t.n(s),t(33)),l=(t.n(c),t(31)),u=t(538),f=t.n(u),d=function(){function n(e){var t=e.x,o=e.y,i=e.radius,a=e.color;r(this,n),this.radius=i,this.x=t,this.y=o,this.color=a,this.decay=.01,this.life=1}return i(n,[{key:"step",value:function(){this.life-=this.decay}},{key:"isAlive",value:function(){return this.life>=0}},{key:"draw",value:function(n){var e=this.life>=0?this.life:0;n.fillStyle="rgba(".concat(this.color.r,", ").concat(this.color.g,", ").concat(this.color.b,", ").concat(e,")"),n.beginPath(),n.arc(this.x+this.radius,this.y+this.radius,this.radius,0,2*Math.PI),n.fill()}}]),n}(),p=function(){function n(e,t){r(this,n),this.isRunning=!1,this.props=Object.assign({},n.defaultProps,t),this.renderInNodeAndStart(e)}return i(n,null,[{key:"calculateGradient",value:function(n,e,t){var r=function(n,e){return n+Math.round((e-n)*t)};return{r:r(n.r,e.r),g:r(n.g,e.g),b:r(n.b,e.b)}}}]),i(n,[{key:"setCanvasSize",value:function(){var e=n.getPixelRatio(),t=this.props.size*e;this.canvas.width=t,this.canvas.height=t,this.canvas.style.width="".concat(this.props.size,"px"),this.canvas.style.height="".concat(this.props.size,"px"),this.ctx=this.canvas.getContext("2d"),this.ctx.scale(e,e)}},{key:"initializeLoader",value:function(){this.setCanvasSize(),this.height=this.props.size,this.width=this.props.size,this.particles=[],this.baseSpeed=1,this.colorIndex=0,this.maxRadius=10,this.minRadius=6,this.colorChangeTick=40,this.x=0,this.y=0,this.radius=8,this.hSpeed=1.5,this.vSpeed=.5,this.radiusSpeed=.05,this.tick=0,this.prepareInitialState(100),this.isRunning=!0,this.loop()}},{key:"prepareInitialState",value:function(n){for(var e=0;e<n;e++)this.step()}},{key:"handleLimits",value:function(n,e,t,r){var o=Math.random(this.baseSpeed)-this.baseSpeed/2;return n+2*e+this.baseSpeed>=r?-(this.baseSpeed+o):n<=this.baseSpeed?this.baseSpeed+o:t}},{key:"calculateNextCoordinates",value:function(){this.x+=this.hSpeed,this.y+=this.vSpeed,this.hSpeed=this.handleLimits(this.x,this.radius,this.hSpeed,this.width),this.vSpeed=this.handleLimits(this.y,this.radius,this.vSpeed,this.height)}},{key:"calculateNextRadius",value:function(){this.radius+=this.radiusSpeed,(this.radius>this.maxRadius||this.radius<this.minRadius)&&(this.radiusSpeed=-this.radiusSpeed)}},{key:"getNextColor",value:function(){var e=this.props.colors,t=e[this.colorIndex],r=e[this.colorIndex+1]||e[0];return n.calculateGradient(t,r,this.tick/this.colorChangeTick)}},{key:"nextTick",value:function(){++this.tick>this.colorChangeTick&&(this.tick=0,++this.colorIndex>this.props.colors.length-1&&(this.colorIndex=0))}},{key:"step",value:function(){this.nextTick(),this.calculateNextCoordinates(),this.calculateNextRadius(),this.particles.forEach(function(n){return n.step()}),this.particles.push(new d({x:this.x,y:this.y,radius:this.radius,color:this.getNextColor()}))}},{key:"removeDeadParticles",value:function(){this.particles=this.particles.filter(function(n){return n.isAlive()})}},{key:"draw",value:function(){var n=this;this.ctx.clearRect(0,0,this.width,this.height),this.removeDeadParticles(),this.particles.forEach(function(e){return e.draw(n.ctx)})}},{key:"loop",value:function(){var n=this;this.step(),this.draw(),this.isRunning&&window.requestAnimationFrame(function(){return n.loop()})}},{key:"updateMessage",value:function(n){this.textNode.textContent=n||""}},{key:"destroy",value:function(){this.isRunning=!1}},{key:"renderInNodeAndStart",value:function(n){return this.canvas=document.createElement("canvas"),this.canvas.dataset.test="ring-loader",this.canvas.classList.add(f.a.canvas),this.textNode=document.createElement("div"),this.textNode.dataset.test="ring-loader-text",this.textNode.classList.add(f.a.text),this.textNode.textContent=this.props.message?this.props.message:"",n.appendChild(this.canvas),n.appendChild(this.textNode),this.initializeLoader(),n}}],[{key:"getPixelRatio",value:function(){return t.i(l.b)()}}]),n}();!function(n,e,t){e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t}(p,"defaultProps",{size:64,colors:[{r:215,g:60,b:234},{r:145,g:53,b:224},{r:88,g:72,b:224},{r:37,g:183,b:255},{r:89,g:189,b:0},{r:251,g:172,b:2},{r:227,g:37,b:129}]})},536:function(n,e,t){e=n.exports=t(9)(!1),e.i(t(13),""),e.i(t(4),void 0),e.push([n.i,"@keyframes rotation-keyframes_556 {\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n.canvas_f75 {\n  display: block;\n\n  margin: 16px auto;\n\n  animation: rotation-keyframes_556 36s linear infinite;\n  pointer-events: none;\n}\n\n.text_e8e {\n  text-align: center;\n\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, Arial, sans-serif;\n\n  font-family: var(--ring-font-family);\n  font-size: 13px;\n  font-size: var(--ring-font-size);\n  line-height: 20px;\n  line-height: var(--ring-line-height);\n}\n",""]),e.locals={unit:""+t(4).locals.unit,canvas:"canvas_f75","rotation-keyframes":"rotation-keyframes_556",text:"text_e8e"}},538:function(n,e,t){var r=t(536);"string"==typeof r&&(r=[[n.i,r,""]]);var o={hmr:!0};o.transform=void 0,o.insertInto=void 0,t(14)(r,o),r.locals&&(n.exports=r.locals)},545:function(n,e,t){"use strict";function r(n){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(n)}function o(){return o=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},o.apply(this,arguments)}function i(n,e){if(null==n)return{};var t,r,o=a(n,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);for(r=0;r<i.length;r++)t=i[r],e.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(n,t)&&(o[t]=n[t])}return o}function a(n,e){if(null==n)return{};var t,r,o={},i=Object.keys(n);for(r=0;r<i.length;r++)t=i[r],e.indexOf(t)>=0||(o[t]=n[t]);return o}function s(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}function c(n,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(n,r.key,r)}}function l(n,e,t){return e&&c(n.prototype,e),t&&c(n,t),n}function u(n,e){return!e||"object"!==r(e)&&"function"!=typeof e?d(n):e}function f(n){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(n){return n.__proto__||Object.getPrototypeOf(n)})(n)}function d(n){if(void 0===n)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}function p(n,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");n.prototype=Object.create(e&&e.prototype,{constructor:{value:n,writable:!0,configurable:!0}}),e&&h(n,e)}function h(n,e){return(h=Object.setPrototypeOf||function(n,e){return n.__proto__=e,n})(n,e)}function g(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}t.d(e,"a",function(){return R});var m=t(3),b=(t.n(m),t(12)),v=(t.n(b),t(1)),y=(t.n(v),t(7)),x=(t.n(y),t(8)),w=(t.n(x),t(5)),k=(t.n(w),t(10)),S=(t.n(k),t(2)),_=t.n(S),O=t(6),j=t.n(O),C=t(20),z=t(535),R=function(n){function e(){var n,t;s(this,e);for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return t=u(this,(n=f(e)).call.apply(n,[this].concat(o))),g(d(t),"initLoader",function(n){n&&(t.loader=new z.a(n,t.props))}),t}return p(e,n),l(e,[{key:"componentWillUnmount",value:function(){this.loader.destroy()}},{key:"render",value:function(){var n=this.props,e=(n.message,n.size,n.colors,n["data-test"]),r=i(n,["message","size","colors","data-test"]);return _.a.createElement("div",o({"data-test":t.i(C.a)("ring-loader",e)},r,{ref:this.initLoader}))}}]),e}(S.PureComponent);g(R,"propTypes",{className:j.a.string,size:j.a.number,colors:j.a.array,message:j.a.string,"data-test":j.a.string})},59:function(n,e,t){n.exports=t(0)(339)},6:function(n,e,t){n.exports=t(0)(91)},60:function(n,e){n.exports=function(n){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!n||"string"!=typeof n)return n;var t=e.protocol+"//"+e.host,r=t+e.pathname.replace(/\/[^\/]*$/,"/");return n.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(n,e){var o=e.trim().replace(/^"(.*)"$/,function(n,e){return e}).replace(/^'(.*)'$/,function(n,e){return e});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(o))return n;var i;return i=0===o.indexOf("//")?o:0===o.indexOf("/")?t+o:r+o.replace(/^\.\//,""),"url("+JSON.stringify(i)+")"})}},7:function(n,e,t){n.exports=t(0)(477)},8:function(n,e,t){n.exports=t(0)(90)},80:function(n,e,t){n.exports=t(0)(429)},9:function(n,e){function t(n,e){var t=n[1]||"",o=n[3];if(!o)return t;if(e&&"function"==typeof btoa){var i=r(o);return[t].concat(o.sources.map(function(n){return"/*# sourceURL="+o.sourceRoot+n+" */"})).concat([i]).join("\n")}return[t].join("\n")}function r(n){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */"}n.exports=function(n){var e=[];return e.toString=function(){return this.map(function(e){var r=t(e,n);return e[2]?"@media "+e[2]+"{"+r+"}":r}).join("")},e.i=function(n,t){"string"==typeof n&&(n=[[null,n,""]]);for(var r={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(r[i]=!0)}for(o=0;o<n.length;o++){var a=n[o];"number"==typeof a[0]&&r[a[0]]||(t&&!a[2]?a[2]=t:t&&(a[2]="("+a[2]+") and ("+t+")"),e.push(a))}},e}}});