(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[9638],{"./src/island-legacy/island-legacy.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:()=>basic,default:()=>__WEBPACK_DEFAULT_EXPORT__,withAHeaderAndButtons:()=>withAHeaderAndButtons});__webpack_require__("./src/island-legacy/island-legacy.css");const __WEBPACK_DEFAULT_EXPORT__={title:"Style-only/Island",parameters:{storySource:{source:'import \'./island-legacy.css\';\n\nexport default {\n  title: \'Style-only/Island\',\n\n  parameters: {\n    notes: \'Displays an island.\'\n  }\n};\n\nexport const basic = () => `\n    <div class="ring-island">\n      <div class="ring-island__header">\n        <span class="ring-island__title">Title</span>\n      </div>\n      <div class="ring-island__content">Content</div>\n    </div>\n    `;\n\nbasic.storyName = \'basic\';\n\nexport const withAHeaderAndButtons = () => `\n    <div class="ring-island">\n      <div class="ring-island__header">\n        <span class="ring-island__title">Title</span>\n        <span class="ring-island__header-button">Button1</span>\n        <span class="ring-island__header-button">Button2</span>\n      </div>\n      <div class="ring-island__content">Content</div>\n    </div>\n  `;\n\nwithAHeaderAndButtons.storyName = \'with a header and buttons\';\n',locationsMap:{basic:{startLoc:{col:21,line:11},endLoc:{col:5,line:18},startBody:{col:21,line:11},endBody:{col:5,line:18}},"with-a-header-and-buttons":{startLoc:{col:37,line:22},endLoc:{col:3,line:31},startBody:{col:37,line:22},endBody:{col:3,line:31}}}},notes:"Displays an island."}},basic=()=>'\n    <div class="ring-island">\n      <div class="ring-island__header">\n        <span class="ring-island__title">Title</span>\n      </div>\n      <div class="ring-island__content">Content</div>\n    </div>\n    ';basic.storyName="basic";const withAHeaderAndButtons=()=>'\n    <div class="ring-island">\n      <div class="ring-island__header">\n        <span class="ring-island__title">Title</span>\n        <span class="ring-island__header-button">Button1</span>\n        <span class="ring-island__header-button">Button2</span>\n      </div>\n      <div class="ring-island__content">Content</div>\n    </div>\n  ';withAHeaderAndButtons.storyName="with a header and buttons"},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/island-legacy/island-legacy.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/global/global.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default,"",!0),___CSS_LOADER_EXPORT___.push([module.id,"@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.ring-island__header-button:hover {\n  background:\n    var(--ring-hover-background-color)\n    linear-gradient(to top, var(--ring-hover-background-color), var(--ring-content-background-color));\n}}\n\n/**\n * @name Island Legacy\n */\n\n.ring-island {\n  min-width: 198px;\n\n  color: var(--ring-text-color);\n\n  border: 1px solid;\n  border-color: var(--ring-line-color);\n  border-radius: var(--ring-border-radius);\n\n  background-color: var(--ring-content-background-color);\n  box-shadow: 0 1px 4px var(--ring-popup-shadow-color);\n\n  font-family: var(--ring-font-family);\n\n  font-size: var(--ring-font-size);\n}\n\n.ring-island_stack-right {\n  border-right: none;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n\n  box-shadow: none;\n}\n\n.ring-island_stack-left {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n\n  box-shadow: none;\n}\n\n.ring-island__header {\n  min-height: 22px;\n\n  border-bottom: 1px solid var(--ring-line-color);\n  border-top-left-radius: var(--ring-border-radius);\n  border-top-right-radius: var(--ring-border-radius);\n\n  background-color: var(--ring-content-background-color);\n\n  line-height: 22px;\n}\n\n.ring-island__header-btn,\n.ring-island__header-button {\n  float: right;\n\n  padding: 0 15px;\n\n  /* -1 to account for border */\n\n  cursor: pointer;\n\n  -webkit-user-select: none;\n\n          user-select: none;\n\n  color: var(--ring-secondary-color);\n\n  border-left: 1px solid var(--ring-disabled-color);\n  text-shadow: var(--ring-white-text-color) 0 0 1px;\n\n  font-size: var(--ring-font-size-smaller);\n}\n\n.ring-island__header-btn {\n  background:\n    var(--ring-hover-background-color)\n    linear-gradient(to top, var(--ring-hover-background-color), var(--ring-content-background-color));\n}\n\n.ring-island__header-btn,\n.ring-island__header-button:active {\n  background: var(--ring-content-background-color) none;\n  box-shadow: 0 0 4px 0 var(--ring-content-background-color) inset;\n}\n\n.ring-island__header-btn,\n.ring-island__header-button:last-child {\n  border-top-right-radius: 3px;\n}\n\n.ring-island__title {\n  display: block;\n  float: left;\n\n  padding: 0 32px;\n\n  font-weight: bold;\n}\n\n.ring-island__content {\n  margin: 16px 32px;\n}\n","",{version:3,sources:["<no source>","webpack://./src/island-legacy/island-legacy.css"],names:[],mappings:"AAAA,wGAAA;EAAA;;sGAAA;CAAA,CAAA;;ACEA;;EAEE;;AAEF;EACE,gBAAgC;;EAEhC,6BAA6B;;EAE7B,iBAAiB;EACjB,oCAAoC;EACpC,wCAAwC;;EAExC,sDAAsD;EACtD,oDAAoD;;EAEpD,oCAAoC;;EAEpC,gCAAgC;AAClC;;AAEA;EACE,kBAAkB;EAClB,0BAA0B;EAC1B,6BAA6B;;EAE7B,gBAAgB;AAClB;;AAEA;EACE,yBAAyB;EACzB,4BAA4B;;EAE5B,gBAAgB;AAClB;;AAEA;EACE,gBAAgC;;EAEhC,+CAA+C;EAC/C,iDAAiD;EACjD,kDAAkD;;EAElD,sDAAsD;;EAEtD,iBAAiC;AACnC;;AAEA;;EAEE,YAAY;;EAEZ,eAA+B;;EAE/B,6BAA6B;;EAE7B,eAAe;;EAEf,yBAAiB;;UAAjB,iBAAiB;;EAEjB,kCAAkC;;EAElC,iDAAiD;EACjD,iDAAiD;;EAEjD,wCAAwC;AAC1C;;AAEA;EAEE;;qGAEmG;AACrG;;AAEA;;EAEE,qDAAqD;EACrD,gEAAgE;AAClE;;AAEA;;EAEE,4BAA4B;AAC9B;;AAEA;EACE,cAAc;EACd,WAAW;;EAEX,eAAyB;;EAEzB,iBAAiB;AACnB;;AAEA;EACE,iBAAqC;AACvC",sourcesContent:[null,'@value unit from "../global/global.css";\n\n/**\n * @name Island Legacy\n */\n\n:global(.ring-island) {\n  min-width: calc(unit * 25 - 2px);\n\n  color: var(--ring-text-color);\n\n  border: 1px solid;\n  border-color: var(--ring-line-color);\n  border-radius: var(--ring-border-radius);\n\n  background-color: var(--ring-content-background-color);\n  box-shadow: 0 1px 4px var(--ring-popup-shadow-color);\n\n  font-family: var(--ring-font-family);\n\n  font-size: var(--ring-font-size);\n}\n\n:global(.ring-island_stack-right) {\n  border-right: none;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n\n  box-shadow: none;\n}\n\n:global(.ring-island_stack-left) {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n\n  box-shadow: none;\n}\n\n:global(.ring-island__header) {\n  min-height: calc(unit * 3 - 2px);\n\n  border-bottom: 1px solid var(--ring-line-color);\n  border-top-left-radius: var(--ring-border-radius);\n  border-top-right-radius: var(--ring-border-radius);\n\n  background-color: var(--ring-content-background-color);\n\n  line-height: calc(unit * 3 - 2px);\n}\n\n:global(.ring-island__header-btn),\n:global(.ring-island__header-button) {\n  float: right;\n\n  padding: 0 calc(unit * 2 - 1px);\n\n  /* -1 to account for border */\n\n  cursor: pointer;\n\n  user-select: none;\n\n  color: var(--ring-secondary-color);\n\n  border-left: 1px solid var(--ring-disabled-color);\n  text-shadow: var(--ring-white-text-color) 0 0 1px;\n\n  font-size: var(--ring-font-size-smaller);\n}\n\n:global(.ring-island__header-btn),\n:global(.ring-island__header-button:hover) {\n  background:\n    var(--ring-hover-background-color)\n    linear-gradient(to top, var(--ring-hover-background-color), var(--ring-content-background-color));\n}\n\n:global(.ring-island__header-btn),\n:global(.ring-island__header-button:active) {\n  background: var(--ring-content-background-color) none;\n  box-shadow: 0 0 4px 0 var(--ring-content-background-color) inset;\n}\n\n:global(.ring-island__header-btn),\n:global(.ring-island__header-button:last-child) {\n  border-top-right-radius: 3px;\n}\n\n:global(.ring-island__title) {\n  display: block;\n  float: left;\n\n  padding: 0 calc(unit * 4);\n\n  font-weight: bold;\n}\n\n:global(.ring-island__content) {\n  margin: calc(unit * 2) calc(unit * 4);\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={unit:`${_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.unit}`};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/island-legacy/island-legacy.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/island-legacy/island-legacy.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}}}]);