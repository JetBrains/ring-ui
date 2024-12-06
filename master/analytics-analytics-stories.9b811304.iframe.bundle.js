(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[3366],{"./src/analytics/analytics.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Analytics:()=>analytics_stories_Analytics,default:()=>analytics_stories});var link_link=__webpack_require__("./src/link/link.tsx");const analytics=new class Analytics{_plugins;constructor(){this._plugins=[]}config(plugins){this._plugins=plugins}trackEvent(category,action,additionalData){this._plugins.forEach((plugin=>{plugin.trackEvent(category,action,additionalData)}))}};class AnalyticsCustomPlugin{_data;_flush;_isDevelopment;_flushInterval;_flushMaxPackSize;_hasSendSchedule;constructor(send,isDevelopment,flushInterval){this._data=[],this.config({send,isDevelopment,flushInterval})}config(config){this._flush=()=>{this._data.length>0&&(config.send(this._data),this._data=[])},this._isDevelopment=config.isDevelopment,this._flushInterval=config.flushInterval||1e4,this._flushMaxPackSize=config.flushMaxPackSize||100}trackEvent(category,action,additionalData){this._processEvent(category,action,additionalData)}trackPageView(path,data){this._processEvent("page","view",data)}_initSendSchedule(){window.addEventListener("beforeunload",(()=>this._flush?.())),null!=this._flush&&setInterval(this._flush,this._flushInterval),this._hasSendSchedule=!0}_processEvent(category,action,data){!this._hasSendSchedule&&this._flush&&this._initSendSchedule(),this._isDevelopment&&console.log("TRACKING DATA = ",category,action,data);const baseSendingData={category,action,timestamp:Date.now()};this._addDataToFlushingPack(data?{...baseSendingData,data}:baseSendingData)}_addDataToFlushingPack(sendingData){this._data.push(sendingData),null!=this._flushMaxPackSize&&this._data.length>=this._flushMaxPackSize&&this._flush?.()}}var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const analytics_stories={title:"Components/Analytics",parameters:{notes:"Provides a façade to Google Analytics and other web analytics services through a system of plugins.",screenshots:{skip:!0}}},analytics_stories_Analytics=()=>{const customPlugin=new AnalyticsCustomPlugin((events=>console.log("Custom plugin receives:",events[0].category,events[0].action)),!1,100);return analytics.config([customPlugin]),(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("p",{children:"Click the link below and check the console output:"}),(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsx)(link_link.A,{pseudo:!0,onClick:event=>{analytics.trackEvent("test-category","test-action"),event.preventDefault()},children:"Track click event"})})]})};analytics_stories_Analytics.parameters={...analytics_stories_Analytics.parameters,docs:{...analytics_stories_Analytics.parameters?.docs,source:{originalSource:"() => {\n  const FLUSH_INTERVAL = 100;\n  const customPlugin = new AnalyticsCustomPlugin(\n  // eslint-disable-next-line no-console\n  events => console.log('Custom plugin receives:', events[0].category, events[0].action), false, FLUSH_INTERVAL);\n  analytics.config([customPlugin]);\n  return <div>\n      <p>Click the link below and check the console output:</p>\n      <div>\n        <Link pseudo onClick={event => {\n        analytics.trackEvent('test-category', 'test-action');\n        event.preventDefault();\n      }}>\n          Track click event\n        </Link>\n      </div>\n    </div>;\n}",...analytics_stories_Analytics.parameters?.docs?.source}}}},"./src/link/clickableLink.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>ClickableLink});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");class ClickableLink extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{onClick=e=>{const{onClick,onConditionalClick,onPlainLeftClick}=this.props,isPlainLeft=(e=>!(0!==e.button||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey))(e);onClick&&onClick(e),onConditionalClick&&onConditionalClick(isPlainLeft,e),onPlainLeftClick&&isPlainLeft&&(e.preventDefault(),onPlainLeftClick(e))};render(){const{onConditionalClick,onPlainLeftClick,activeClassName,href,children,...restProps}=this.props;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a",{href,...restProps,onClick:this.onClick,children})}}ClickableLink.__docgenInfo={description:"",methods:[{name:"onClick",docblock:null,modifiers:[],params:[{name:"e",optional:!1,type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLAnchorElement>",elements:[{name:"HTMLAnchorElement"}],alias:"React.MouseEvent"}}],returns:null}],displayName:"ClickableLink",props:{onConditionalClick:{required:!1,tsType:{name:"union",raw:"((isPlainLeft: boolean, e: React.MouseEvent<HTMLAnchorElement>) => void) | null | undefined",elements:[{name:"unknown"},{name:"null"},{name:"undefined"}]},description:""},onPlainLeftClick:{required:!1,tsType:{name:"union",raw:"((e: React.MouseEvent<HTMLAnchorElement>) => void) | null | undefined",elements:[{name:"unknown"},{name:"null"},{name:"undefined"}]},description:""},activeClassName:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""},disabled:{required:!1,tsType:{name:"union",raw:"boolean | undefined",elements:[{name:"boolean"},{name:"undefined"}]},description:""}},composes:["AnchorHTMLAttributes"]}},"./src/link/link.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__,F:()=>linkHOC});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_global_data_tests__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/global/data-tests.ts"),_clickableLink__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/link/clickableLink.tsx"),_link_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/link/link.css"),_link_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_link_css__WEBPACK_IMPORTED_MODULE_2__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/jsx-runtime.js");function linkHOC(ComposedComponent){const isCustom="string"!=typeof ComposedComponent&&ComposedComponent!==_clickableLink__WEBPACK_IMPORTED_MODULE_4__.A;return class Link extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{render(){const{active,inherit,pseudo,hover,className,"data-test":dataTest,href,children,onPlainLeftClick,onClick,...restProps}=this.props,useButton=pseudo||!isCustom&&null==href,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_link_css__WEBPACK_IMPORTED_MODULE_2___default().link,className,{[_link_css__WEBPACK_IMPORTED_MODULE_2___default().active]:active,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().inherit]:inherit,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().hover]:hover,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().pseudo]:useButton});let props=restProps;return isCustom&&!props.activeClassName&&(props={...props,activeClassName:_link_css__WEBPACK_IMPORTED_MODULE_2___default().active}),useButton?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button",{type:"button",...props,className:classes,onClick:onClick||onPlainLeftClick,"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_5__.A)("ring-link",dataTest),children}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(ComposedComponent,{...props,href,className:classes,onClick,onPlainLeftClick,"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_5__.A)("ring-link",dataTest),children})}}}const __WEBPACK_DEFAULT_EXPORT__=linkHOC(_clickableLink__WEBPACK_IMPORTED_MODULE_4__.A)},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/link/link.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,"@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {:is(.link_c73c,.withLinks_a3f8 a):hover {\n    text-decoration-line: underline;\n\n    transition: none;\n\n    color: var(--ring-link-hover-color);\n  }}\n\n.link_c73c,\n.withLinks_a3f8 a {\n  cursor: pointer;\n  transition: color var(--ring-fast-ease);\n\n  color: var(--ring-link-color);\n\n  outline: none;\n\n  text-decoration-line: none;\n  text-decoration-thickness: 1px;\n  text-underline-offset: 3px;\n}\n\n@media (resolution >= 2dppx) {\n\n.link_c73c,\n.withLinks_a3f8 a {\n    text-decoration-thickness: 0.5px;\n}\n  }\n\n.hover_e4ca:is(.link_c73c,.withLinks_a3f8 a) {\n    text-decoration-line: underline;\n\n    transition: none;\n\n    color: var(--ring-link-hover-color);\n  }\n\n/* stylelint-disable-next-line selector-max-specificity */\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.pseudo_cb40:is(.link_c73c,.withLinks_a3f8 a):hover {\n    text-decoration: none;\n  }}\n\n:is(.link_c73c,.withLinks_a3f8 a):focus-visible {\n    box-shadow: 0 0 0 2px var(--ring-border-hover-color);\n  }\n\n.link_c73c.active_eef2 {\n  color: inherit;\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.inherit_c3d7:not(:hover) {\n  color: inherit;\n}}\n\n.pseudo_cb40 {\n  margin: 0;\n  padding: 0;\n\n  text-align: left;\n\n  border: 0;\n\n  background: transparent;\n\n  font: inherit;\n}\n\n.pseudo_cb40::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n","",{version:3,sources:["<no source>","webpack://./src/link/link.css"],names:[],mappings:"AAAA,wGAAA;IAAA,gCAAA;;IAAA,iBAAA;;IAAA,oCAAA;GAAA,CAAA;;ACEA;;EAEE,eAAe;EACf,uCAAuC;;EAEvC,6BAA6B;;EAE7B,aAAa;;EAEb,0BAA0B;EAC1B,8BAA8B;EAC9B,0BAA0B;AAuB5B;;AArBE;;AAbF;;IAcI,gCAAgC;AAoBpC;EAnBE;;AAEA;IAEE,+BAA+B;;IAE/B,gBAAgB;;IAEhB,mCAAmC;EACrC;;AAEA,yDAAyD;;AD5B3D,wGAAA;IAAA,sBAAA;GAAA,CAAA;;ACiCE;IACE,oDAAoD;EACtD;;AAGF;EACE,cAAc;AAChB;;ADxCA,wGAAA;EAAA,eAAA;CAAA,CAAA;;AC8CA;EACE,SAAS;EACT,UAAU;;EAEV,gBAAgB;;EAEhB,SAAS;;EAET,uBAAuB;;EAEvB,aAAa;AAOf;;AALE;IACE,UAAU;;IAEV,SAAS;EACX",sourcesContent:[null,'@import "../global/variables.css";\n\n.link,\n.withLinks a {\n  cursor: pointer;\n  transition: color var(--ring-fast-ease);\n\n  color: var(--ring-link-color);\n\n  outline: none;\n\n  text-decoration-line: none;\n  text-decoration-thickness: 1px;\n  text-underline-offset: 3px;\n\n  @media (resolution >= 2dppx) {\n    text-decoration-thickness: 0.5px;\n  }\n\n  &:hover,\n  &.hover {\n    text-decoration-line: underline;\n\n    transition: none;\n\n    color: var(--ring-link-hover-color);\n  }\n\n  /* stylelint-disable-next-line selector-max-specificity */\n  &.pseudo:hover {\n    text-decoration: none;\n  }\n\n  &:focus-visible {\n    box-shadow: 0 0 0 2px var(--ring-border-hover-color);\n  }\n}\n\n.link.active {\n  color: inherit;\n}\n\n.inherit:not(:hover) {\n  color: inherit;\n}\n\n.pseudo {\n  margin: 0;\n  padding: 0;\n\n  text-align: left;\n\n  border: 0;\n\n  background: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={link:"link_c73c",withLinks:"withLinks_a3f8",hover:"hover_e4ca",pseudo:"pseudo_cb40",active:"active_eef2",inherit:"inherit_c3d7"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/link/link.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/link/link.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}}}]);