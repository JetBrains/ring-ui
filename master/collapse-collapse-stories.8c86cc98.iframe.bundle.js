(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[174],{"./node_modules/@jetbrains/icons/chevron-10px.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><g><polygon points="5 7.99 1.5 4.5 2.5 3.5 5 6.01 7.5 3.5 8.49 4.5 5 7.99"/></g></svg>'},"./node_modules/@jetbrains/icons/chevron-down.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.942 5.808a.625.625 0 0 0-.884 0L8 8.866 4.942 5.808a.625.625 0 1 0-.884.884l3.5 3.5c.244.244.64.244.884 0l3.5-3.5a.625.625 0 0 0 0-.884Z" clip-rule="evenodd"/></svg>'},"./node_modules/@jetbrains/icons/chevron-up.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.058 10.192c.244.244.64.244.884 0L8 7.134l3.058 3.058a.625.625 0 1 0 .884-.884l-3.5-3.5a.625.625 0 0 0-.884 0l-3.5 3.5a.625.625 0 0 0 0 .884Z" clip-rule="evenodd"/></svg>'},"./src/loader-inline/loader-inline.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),prop_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__),_global_data_tests__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/global/data-tests.ts"),_loader_inline_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/loader-inline/loader-inline.css"),_loader_inline_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_loader_inline_css__WEBPACK_IMPORTED_MODULE_2__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}class LoaderInline extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{static propTypes={className:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string,"data-test":prop_types__WEBPACK_IMPORTED_MODULE_3___default().string,children:prop_types__WEBPACK_IMPORTED_MODULE_3___default().node};render(){const{className,"data-test":dataTest,children,...restProps}=this.props,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_loader_inline_css__WEBPACK_IMPORTED_MODULE_2___default().loader,className),loader=react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",_extends({},restProps,{"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_4__.A)("ring-loader-inline",dataTest),className:classes}));return children?react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,loader,react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{className:_loader_inline_css__WEBPACK_IMPORTED_MODULE_2___default().children},children)):loader}}const __WEBPACK_DEFAULT_EXPORT__=LoaderInline;LoaderInline.__docgenInfo={description:"@name Loader Inline",methods:[],displayName:"LoaderInline",props:{"data-test":{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:"",type:{name:"string"}},className:{description:"",type:{name:"string"},required:!1},children:{description:"",type:{name:"node"},required:!1}},composes:["HTMLAttributes"]}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/collapse/collapse.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".container_dc36 {\n    position: relative;\n    will-change: height, opacity;\n\n    overflow: hidden;\n\n}\n\n.transition_ae01 {\n    transition: height var(--duration) ease-in-out 0s, opacity var(--duration) ease-in-out 0s;\n}\n\n.summary_d9eb {\n    list-style: none;\n\n    cursor: pointer;\n}\n\n.trigger_e5f9 {\n    cursor: pointer;\n\n    border: none;\n    outline: none;\n    background: transparent;\n}\n\n.fade_a75b {\n    position: absolute;\n    z-index: 10;\n    right: 0;\n    bottom: 0;\n    left: 0;\n\n    height: calc(var(--ring-unit)*3);\n\n    pointer-events: none;\n\n    color: var(--ring-content-background-color);\n    background-image: linear-gradient(to bottom, transparent 0%, currentColor 50%);\n}\n","",{version:3,sources:["webpack://./src/collapse/collapse.css"],names:[],mappings:"AAAA;IACI,kBAAkB;IAClB,4BAA4B;;IAE5B,gBAAgB;;AAEpB;;AAEA;IACI,yFAAyF;AAC7F;;AAEA;IACI,gBAAgB;;IAEhB,eAAe;AACnB;;AAEA;IACI,eAAe;;IAEf,YAAY;IACZ,aAAa;IACb,uBAAuB;AAC3B;;AAEA;IACI,kBAAkB;IAClB,WAAW;IACX,QAAQ;IACR,SAAS;IACT,OAAO;;IAEP,gCAAkC;;IAElC,oBAAoB;;IAEpB,2CAA2C;IAC3C,8EAA8E;AAClF",sourcesContent:[".container {\n    position: relative;\n    will-change: height, opacity;\n\n    overflow: hidden;\n\n}\n\n.transition {\n    transition: height var(--duration) ease-in-out 0s, opacity var(--duration) ease-in-out 0s;\n}\n\n.summary {\n    list-style: none;\n\n    cursor: pointer;\n}\n\n.trigger {\n    cursor: pointer;\n\n    border: none;\n    outline: none;\n    background: transparent;\n}\n\n.fade {\n    position: absolute;\n    z-index: 10;\n    right: 0;\n    bottom: 0;\n    left: 0;\n\n    height: calc(var(--ring-unit) * 3);\n\n    pointer-events: none;\n\n    color: var(--ring-content-background-color);\n    background-image: linear-gradient(to bottom, transparent 0%, currentColor 50%);\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={container:"container_dc36",transition:"transition_ae01",summary:"summary_d9eb",trigger:"trigger_e5f9",fade:"fade_a75b"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/collapse/collapse.stories.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".container_a369 {\n  width: 400px;\n  padding: 10px;\n}\n\n.border_f8b1 {\n  border: 1px solid var(--ring-line-color);\n  border-radius: 5px;\n}\n\n.loaderWrapper_c482 {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n\n  min-height: 200px;\n}\n\n.content_a7c6 {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n\n  height: 500px;\n}\n","",{version:3,sources:["webpack://./src/collapse/collapse.stories.css"],names:[],mappings:"AAAA;EACE,YAAY;EACZ,aAAa;AACf;;AAEA;EACE,wCAAwC;EACxC,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,uBAAuB;;EAEvB,iBAAiB;AACnB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,uBAAuB;;EAEvB,aAAa;AACf",sourcesContent:[".container {\n  width: 400px;\n  padding: 10px;\n}\n\n.border {\n  border: 1px solid var(--ring-line-color);\n  border-radius: 5px;\n}\n\n.loaderWrapper {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n\n  min-height: 200px;\n}\n\n.content {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n\n  height: 500px;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={container:"container_a369",border:"border_f8b1",loaderWrapper:"loaderWrapper_c482",content:"content_a7c6"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/loader-inline/loader-inline.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_dark_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables_dark.css"),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__.default),___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_dark_css__WEBPACK_IMPORTED_MODULE_2__.default,"",!0),___CSS_LOADER_EXPORT___.push([module.id,`:root {\n  /* stylelint-disable-next-line color-no-hex */\n  --ring-loader-inline-stops: #ff00eb, #bd3bff, #008eff, #58ba00, #f48700, #ff00eb;\n}\n\n.${_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_dark_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.dark},\n.ring-ui-theme-dark {\n  /* stylelint-disable-next-line color-no-hex */\n  --ring-loader-inline-stops: #ff2eef, #d178ff, #289fff, #88d444, #ffe000, #ff2eef;\n}\n\n@keyframes spin_c5fc {\n  0% {\n    transform: rotate(0);\n  }\n\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes pulse_d8f9 {\n  0% {\n    transform: scale(1);\n  }\n\n  100% {\n    transform: scale(1.41667);\n  }\n}\n\n.loader_f65a,\n.ring-loader-inline {\n  /* needed for better backward-compatibility */\n\n  position: relative;\n\n  display: inline-block;\n\n  overflow: hidden;\n\n  transform: rotate(0);\n  animation: spin_c5fc 1s linear infinite;\n  vertical-align: -3px;\n\n  border-radius: var(--ring-unit);\n}\n\n.loader_f65a,\n  .ring-loader-inline,\n  .loader_f65a::after,\n  .ring-loader-inline::after {\n    transform-origin: 50% 50%;\n  }\n\n.loader_f65a::after, .ring-loader-inline::after {\n    display: block;\n\n    width: calc(var(--ring-unit)*2);\n    height: calc(var(--ring-unit)*2);\n\n    content: "";\n    animation: pulse_d8f9 0.85s cubic-bezier(0.68, 0, 0.74, 0.74) infinite alternate;\n\n    background-image: conic-gradient(var(--ring-loader-inline-stops));\n    -webkit-mask-image: radial-gradient(var(--ring-unit), transparent 71.875%, var(--ring-content-background-color) 71.875%);\n            mask-image: radial-gradient(var(--ring-unit), transparent 71.875%, var(--ring-content-background-color) 71.875%);\n  }\n\n.children_d816 {\n  margin-left: calc(var(--ring-unit)/2);\n}\n`,"",{version:3,sources:["webpack://./src/loader-inline/loader-inline.css"],names:[],mappings:"AAIA;EACE,6CAA6C;EAC7C,gFAAgF;AAClF;;AAEA;;EAEE,6CAA6C;EAC7C,gFAAgF;AAClF;;AAEA;EACE;IACE,oBAAoB;EACtB;;EAEA;IACE,yBAAyB;EAC3B;AACF;;AAEA;EACE;IACE,mBAAmB;EACrB;;EAEA;IACE,yBAA+B;EACjC;AACF;;AAEA;;EAEE,6CAA6C;;EAE7C,kBAAkB;;EAElB,qBAAqB;;EAErB,gBAAgB;;EAEhB,oBAAoB;EACpB,uCAAkC;EAClC,oBAAoB;;EAEpB,+BAA+B;AAmBjC;;AAjBE;;;;IAEE,yBAAyB;EAC3B;;AAEA;IACE,cAAc;;IAEd,+BAAiC;IACjC,gCAAkC;;IAElC,WAAW;IACX,gFAA2E;;IAE3E,iEAAiE;IACjE,wHAAgH;YAAhH,gHAAgH;EAClH;;AAGF;EACE,qCAAuC;AACzC",sourcesContent:['@import "../global/variables.css";\n\n@value dark from "../global/variables_dark.css";\n\n:root {\n  /* stylelint-disable-next-line color-no-hex */\n  --ring-loader-inline-stops: #ff00eb, #bd3bff, #008eff, #58ba00, #f48700, #ff00eb;\n}\n\n.dark,\n:global(.ring-ui-theme-dark) {\n  /* stylelint-disable-next-line color-no-hex */\n  --ring-loader-inline-stops: #ff2eef, #d178ff, #289fff, #88d444, #ffe000, #ff2eef;\n}\n\n@keyframes spin {\n  0% {\n    transform: rotate(0);\n  }\n\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes pulse {\n  0% {\n    transform: scale(1);\n  }\n\n  100% {\n    transform: scale(calc(17 / 12));\n  }\n}\n\n.loader,\n:global(.ring-loader-inline) {\n  /* needed for better backward-compatibility */\n\n  position: relative;\n\n  display: inline-block;\n\n  overflow: hidden;\n\n  transform: rotate(0);\n  animation: spin 1s linear infinite;\n  vertical-align: -3px;\n\n  border-radius: var(--ring-unit);\n\n  &,\n  &::after {\n    transform-origin: 50% 50%;\n  }\n\n  &::after {\n    display: block;\n\n    width: calc(var(--ring-unit) * 2);\n    height: calc(var(--ring-unit) * 2);\n\n    content: "";\n    animation: pulse 0.85s cubic-bezier(0.68, 0, 0.74, 0.74) infinite alternate;\n\n    background-image: conic-gradient(var(--ring-loader-inline-stops));\n    mask-image: radial-gradient(var(--ring-unit), transparent 71.875%, var(--ring-content-background-color) 71.875%);\n  }\n}\n\n.children {\n  margin-left: calc(var(--ring-unit) / 2);\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={dark:`${_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_dark_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.dark}`,loader:"loader_f65a",spin:"spin_c5fc",pulse:"pulse_d8f9",children:"children_d816"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/collapse/collapse.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/collapse/collapse.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/collapse/collapse.stories.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/collapse/collapse.stories.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/loader-inline/loader-inline.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/loader-inline/loader-inline.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/collapse/collapse.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{AnimationDisable:()=>AnimationDisable,Basic:()=>Basic,ShowOnExtend:()=>ShowOnExtend,TriggerUnderContent:()=>TriggerUnderContent,WithDynamicContent:()=>WithDynamicContent,WithIcon:()=>WithIcon,WithMinHeight:()=>WithMinHeight,default:()=>collapse_collapse_stories});var react=__webpack_require__("./node_modules/react/index.js"),chevron_down=__webpack_require__("./node_modules/@jetbrains/icons/chevron-down.js"),chevron_down_default=__webpack_require__.n(chevron_down),chevron_up=__webpack_require__("./node_modules/@jetbrains/icons/chevron-up.js"),chevron_up_default=__webpack_require__.n(chevron_up),button_button=__webpack_require__("./src/button/button.tsx"),loader_inline=__webpack_require__("./src/loader-inline/loader-inline.tsx");const CollapseContext=(0,react.createContext)({collapsed:!0,duration:200,disableAnimation:!1,setCollapsed:()=>{},id:""}),collapse_context=CollapseContext,Collapse=({children,duration=200,disableAnimation=!1,className="",onChange=()=>{}})=>{const[collapsed,toggle]=(0,react.useState)(!0),id=(0,react.useId)(),setCollapsed=(0,react.useCallback)((()=>{toggle(!collapsed),onChange(!collapsed)}),[toggle,onChange,collapsed]);return react.createElement("div",{className},react.createElement(CollapseContext.Provider,{value:{collapsed,setCollapsed,duration,disableAnimation,id}},children))},collapse=Collapse;Collapse.__docgenInfo={description:"@name Collapse",methods:[],displayName:"Collapse",props:{onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(collapsed: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"collapsed"}],return:{name:"void"}}},description:"",defaultValue:{value:"() => {}",computed:!1}},duration:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"200",computed:!1}},disableAnimation:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};var classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),data_tests=__webpack_require__("./src/global/data-tests.ts"),dom=__webpack_require__("./src/global/dom.ts");const toPx=value=>`${value}px`;var collapse_collapse=__webpack_require__("./src/collapse/collapse.css"),collapse_default=__webpack_require__.n(collapse_collapse);const CollapseContent=({children,minHeight=0,"data-test":dataTest})=>{const{collapsed,duration,id,disableAnimation}=(0,react.useContext)(collapse_context),containerRef=(0,react.useRef)(null),contentRef=(0,react.useRef)(null),initialContentHeight=(0,react.useRef)(minHeight),contentHeight=(0,react.useRef)(0),[dimensions,setDimensions]=(0,react.useState)({width:0,height:0}),[height,setHeight]=(0,react.useState)(toPx(minHeight)),[showFade,setShowFade]=(0,react.useState)(!0);(0,react.useEffect)((()=>{setShowFade(!!collapsed)}),[collapsed]),(0,react.useEffect)((()=>{contentRef.current&&(contentHeight.current=(0,dom.l)(contentRef.current).height)}),[minHeight,dimensions.height]),(0,react.useEffect)((()=>{const nextHeight=collapsed?initialContentHeight.current:contentHeight.current;setHeight(toPx(nextHeight))}),[collapsed,dimensions.height]),(0,react.useEffect)((()=>{if(contentRef.current){new ResizeObserver((([entry])=>{if(entry&&entry.borderBoxSize){const{inlineSize,blockSize}=entry.borderBoxSize[0];setDimensions({width:inlineSize,height:blockSize})}})).observe(contentRef.current)}}),[]);const style=(0,react.useMemo)((()=>({"--duration":`${duration+.5*contentHeight.current}ms`,height,opacity:collapsed&&!minHeight?0:1})),[duration,height,collapsed,minHeight]),fadeShouldBeVisible=(0,react.useMemo)((()=>Boolean(minHeight&&showFade)),[minHeight,showFade]);return react.createElement("div",{ref:containerRef,id:`collapse-content-${id}`,"data-test":(0,data_tests.A)("ring-collapse-content-container"),className:classnames_default()(collapse_default().container,{[collapse_default().transition]:!disableAnimation}),style},react.createElement("div",{ref:contentRef,"data-test":(0,data_tests.A)("ring-collapse-content",dataTest)},children),fadeShouldBeVisible&&react.createElement("div",{className:collapse_default().fade}))},collapse_content=CollapseContent;CollapseContent.__docgenInfo={description:"@name CollapseContent",methods:[],displayName:"CollapseContent",props:{minHeight:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"0",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},"data-test":{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""}}};const CollapseControl=({children,"data-test":dataTest})=>{const{setCollapsed,collapsed,id}=(0,react.useContext)(CollapseContext),child=(0,react.useMemo)((()=>"function"==typeof children?children(collapsed):children),[children,collapsed]);return react.createElement("p",{"data-test":(0,data_tests.A)("ring-collapse-control",dataTest)},(0,react.cloneElement)(child,{onClick:setCollapsed,"aria-controls":`collapse-content-${id}`,"aria-expanded":String(!collapsed)}))},collapse_control=CollapseControl;CollapseControl.__docgenInfo={description:"@name CollapseControl",methods:[],displayName:"CollapseControl",props:{children:{required:!0,tsType:{name:"union",raw:"ChildrenFunction | React.ReactElement",elements:[{name:"signature",type:"function",raw:"(collapsed: boolean) => React.ReactElement",signature:{arguments:[{type:{name:"boolean"},name:"collapsed"}],return:{name:"ReactReactElement",raw:"React.ReactElement"}}},{name:"ReactReactElement",raw:"React.ReactElement"}]},description:""},"data-test":{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""}}};var collapse_stories=__webpack_require__("./src/collapse/collapse.stories.css"),collapse_stories_default=__webpack_require__.n(collapse_stories);const collapse_collapse_stories={title:"Components/Collapse",parameters:{notes:'The "Collapse" component hides content and shows more when clicked, saving space and keeping it tidy.',hermione:{actions:[{type:"click",selector:"[data-test~=ring-collapse-control] button"}]}}},collapse_stories_text="This is very long text! This is very long text! This is very long text! This is very\n            long text! This is very long text! This is very long text! This is very long text! This\n            is very long text! This is very long text! This is very long text! This is very long\n            text! This is very long text! This is very long text! This is very long text! This is\n            very long text! This is very long text! This is very long text! This is very long text!\n            This is very long text! This is very long text! This is very long text!",Basic=()=>react.createElement("div",{className:collapse_stories_default().container},react.createElement(collapse,null,react.createElement(collapse_control,null,(collapsed=>react.createElement(button_button.Ay,null,collapsed?"Show more":"Show less"))),react.createElement(collapse_content,null,collapse_stories_text))),ShowOnExtend=()=>{const[showDelayedContent,setShowDelayedContent]=(0,react.useState)(!1);return react.createElement("div",{className:`${collapse_stories_default().container} ${collapse_stories_default().border}`},react.createElement(collapse,{onChange:()=>{setTimeout((()=>{setShowDelayedContent(!0)}),2e3)}},react.createElement(collapse_control,null,(collapsed=>react.createElement(button_button.Ay,null,collapsed?"Show more":"Show less"))),react.createElement(collapse_content,null,react.createElement("div",{className:collapse_stories_default().loaderWrapper},showDelayedContent?react.createElement("div",{className:collapse_stories_default().content},"loaded content"):react.createElement(loader_inline.A,null)))))};ShowOnExtend.storyName="Show content on extending";const TriggerUnderContent=()=>react.createElement("div",{className:collapse_stories_default().container},react.createElement(collapse,null,react.createElement(collapse_content,null,collapse_stories_text),react.createElement(collapse_control,null,(collapsed=>react.createElement(button_button.Ay,null,collapsed?"Show more":"Show less")))));TriggerUnderContent.storyName="Trigger placed under collapsed content";const WithIcon=()=>react.createElement("div",{className:collapse_stories_default().container},react.createElement(collapse,null,react.createElement(collapse_control,null,(collapsed=>collapsed?react.createElement(button_button.Ay,{"aria-label":"Expand",icon:chevron_down_default(),className:collapse_stories_default().check}):react.createElement(button_button.Ay,{"aria-label":"Collapse",icon:chevron_up_default(),className:collapse_stories_default().check}))),react.createElement(collapse_content,null,collapse_stories_text)));WithIcon.storyName="The trigger with icon";const WithMinHeight=()=>react.createElement("div",{className:collapse_stories_default().container},react.createElement(collapse,null,react.createElement(collapse_content,{minHeight:85},collapse_stories_text),react.createElement(collapse_control,null,(collapsed=>react.createElement(button_button.Ay,null,collapsed?"Show more":"Show less")))));WithMinHeight.storyName="With default min height";const AnimationDisable=()=>react.createElement("div",{className:collapse_stories_default().container},react.createElement(collapse,{disableAnimation:!0},react.createElement(collapse_control,null,(collapsed=>react.createElement(button_button.Ay,null,collapsed?"Show more":"Show less"))),react.createElement(collapse_content,null,collapse_stories_text)));AnimationDisable.storyName="With disabled animation";const WithDynamicContent=()=>{const[content,setContent]=(0,react.useState)([collapse_stories_text]);return react.createElement(react.Fragment,null,react.createElement("div",{className:collapse_stories_default().container},react.createElement(button_button.Ay,{onClick:()=>{setContent([...content,collapse_stories_text])}},"Add more text"),react.createElement(button_button.Ay,{onClick:()=>{content.shift(),setContent([...content])}},"Remove text")),react.createElement("div",{className:`${collapse_stories_default().container} ${collapse_stories_default().border}`},react.createElement(collapse,null,react.createElement(collapse_control,null,(collapsed=>react.createElement(button_button.Ay,null,collapsed?"Show more":"Show less"))),react.createElement(collapse_content,null,content.map(((line,index)=>react.createElement("div",{key:index},line)))))))};WithDynamicContent.storyName="With dynamic content",Basic.parameters={...Basic.parameters,docs:{...Basic.parameters?.docs,source:{originalSource:"() => <div className={styles.container}>\n    <Collapse>\n      <CollapseControl>\n        {(collapsed: boolean) => <Button>{collapsed ? 'Show more' : 'Show less'}</Button>}\n      </CollapseControl>\n      <CollapseContent>{text}</CollapseContent>\n    </Collapse>\n  </div>",...Basic.parameters?.docs?.source}}},ShowOnExtend.parameters={...ShowOnExtend.parameters,docs:{...ShowOnExtend.parameters?.docs,source:{originalSource:"() => {\n  const [showDelayedContent, setShowDelayedContent] = useState(false);\n  const onChange = () => {\n    setTimeout(() => {\n      setShowDelayedContent(true);\n    }, 2000);\n  };\n  return <div className={`${styles.container} ${styles.border}`}>\n      <Collapse onChange={onChange}>\n        <CollapseControl>\n          {(collapsed: boolean) => <Button>{collapsed ? 'Show more' : 'Show less'}</Button>}\n        </CollapseControl>\n        <CollapseContent>\n          <div className={styles.loaderWrapper}>\n            {showDelayedContent ? <div className={styles.content}>loaded content</div> : <LoaderInline />}\n          </div>\n        </CollapseContent>\n      </Collapse>\n    </div>;\n}",...ShowOnExtend.parameters?.docs?.source}}},TriggerUnderContent.parameters={...TriggerUnderContent.parameters,docs:{...TriggerUnderContent.parameters?.docs,source:{originalSource:"() => <div className={styles.container}>\n    <Collapse>\n      <CollapseContent>{text}</CollapseContent>\n      <CollapseControl>\n        {(collapsed: boolean) => <Button>{collapsed ? 'Show more' : 'Show less'}</Button>}\n      </CollapseControl>\n    </Collapse>\n  </div>",...TriggerUnderContent.parameters?.docs?.source}}},WithIcon.parameters={...WithIcon.parameters,docs:{...WithIcon.parameters?.docs,source:{originalSource:'() => <div className={styles.container}>\n    <Collapse>\n      <CollapseControl>\n        {(collapsed: boolean) => collapsed ? <Button aria-label="Expand" icon={ChevronDownIcon} className={styles.check} /> : <Button aria-label="Collapse" icon={ChevronUpIcon} className={styles.check} />}\n      </CollapseControl>\n      <CollapseContent>{text}</CollapseContent>\n    </Collapse>\n  </div>',...WithIcon.parameters?.docs?.source}}},WithMinHeight.parameters={...WithMinHeight.parameters,docs:{...WithMinHeight.parameters?.docs,source:{originalSource:"() => <div className={styles.container}>\n    <Collapse>\n      <CollapseContent minHeight={85}>{text}</CollapseContent>\n      <CollapseControl>\n        {(collapsed: boolean) => <Button>{collapsed ? 'Show more' : 'Show less'}</Button>}\n      </CollapseControl>\n    </Collapse>\n  </div>",...WithMinHeight.parameters?.docs?.source}}},AnimationDisable.parameters={...AnimationDisable.parameters,docs:{...AnimationDisable.parameters?.docs,source:{originalSource:"() => <div className={styles.container}>\n    <Collapse disableAnimation>\n      <CollapseControl>\n        {(collapsed: boolean) => <Button>{collapsed ? 'Show more' : 'Show less'}</Button>}\n      </CollapseControl>\n      <CollapseContent>{text}</CollapseContent>\n    </Collapse>\n  </div>",...AnimationDisable.parameters?.docs?.source}}},WithDynamicContent.parameters={...WithDynamicContent.parameters,docs:{...WithDynamicContent.parameters?.docs,source:{originalSource:"() => {\n  const [content, setContent] = useState<Array<string>>([text]);\n  const add = () => {\n    setContent([...content, text]);\n  };\n  const remove = () => {\n    content.shift();\n    setContent([...content]);\n  };\n  return <>\n      <div className={styles.container}>\n        <Button onClick={add}>Add more text</Button>\n        <Button onClick={remove}>Remove text</Button>\n      </div>\n      <div className={`${styles.container} ${styles.border}`}>\n        <Collapse>\n          <CollapseControl>\n            {(collapsed: boolean) => <Button>{collapsed ? 'Show more' : 'Show less'}</Button>}\n          </CollapseControl>\n          <CollapseContent>\n            {content.map((line, index) =>\n          // eslint-disable-next-line react/no-array-index-key\n          <div key={index}>{line}</div>)}\n          </CollapseContent>\n        </Collapse>\n      </div>\n    </>;\n}",...WithDynamicContent.parameters?.docs?.source}}}},"./node_modules/util-deprecate/browser.js":(module,__unused_webpack_exports,__webpack_require__)=>{function config(name){try{if(!__webpack_require__.g.localStorage)return!1}catch(_){return!1}var val=__webpack_require__.g.localStorage[name];return null!=val&&"true"===String(val).toLowerCase()}module.exports=function deprecate(fn,msg){if(config("noDeprecation"))return fn;var warned=!1;return function deprecated(){if(!warned){if(config("throwDeprecation"))throw new Error(msg);config("traceDeprecation")?console.trace(msg):console.warn(msg),warned=!0}return fn.apply(this,arguments)}}}}]);