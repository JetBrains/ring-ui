(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[9787],{"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/auth-dialog/auth-dialog.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/global.css"),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__.default),___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default,"",!0),___CSS_LOADER_EXPORT___.push([module.id,".dialog_eb86.dialog_eb86 {\n  width: auto;\n  max-width: 400px;\n}\n\n.content_b229 {\n\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n\n  margin: calc(var(--ring-unit)*2) 0;\n}\n\n.button_ea1e {\n  width: calc(var(--ring-unit)*25);\n  margin-top: var(--ring-unit);\n}\n\n.firstButton_c698 {\n\n  margin-top: calc(var(--ring-unit)*4);\n}\n\n.title_e485.title_e485 {\n  margin-top: 0;\n  margin-bottom: var(--ring-unit);\n\n  text-align: center;\n\n  font-weight: 100;\n}\n\n.logo_acd8 {\n  width: calc(var(--ring-unit)*12);\n  height: calc(var(--ring-unit)*12);\n  margin-bottom: 12px;\n  object-fit: contain;\n}\n\n@media (height <= 400px) {\n\n.logo_acd8 {\n    width: calc(var(--ring-unit)*4);\n    height: calc(var(--ring-unit)*4);\n}\n  }\n\n.error_cdae {\n  text-align: center;\n\n  color: var(--ring-error-color);\n}\n","",{version:3,sources:["webpack://./src/auth-dialog/auth-dialog.css"],names:[],mappings:"AAEA;EACE,WAAW;EACX,gBAAgB;AAClB;;AAEA;;EAGE,aAAa;EACb,mBAAmB;EACnB,sBAAsB;;EAEtB,kCAAoC;AACtC;;AAEA;EACE,gCAAkC;EAClC,4BAA4B;AAC9B;;AAEA;;EAGE,oCAAsC;AACxC;;AAEA;EACE,aAAa;EACb,+BAA+B;;EAE/B,kBAAkB;;EAElB,gBAAgB;AAClB;;AAEA;EACE,gCAAkC;EAClC,iCAAmC;EACnC,mBAAmB;EACnB,mBAAmB;AAMrB;;AAJE;;AANF;IAOI,+BAAiC;IACjC,gCAAkC;AAEtC;EADE;;AAGF;EACE,kBAAkB;;EAElB,8BAA8B;AAChC",sourcesContent:['@import "../global/variables.css";\n\n.dialog.dialog {\n  width: auto;\n  max-width: 400px;\n}\n\n.content {\n  composes: font from "../global/global.css";\n\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n\n  margin: calc(var(--ring-unit) * 2) 0;\n}\n\n.button {\n  width: calc(var(--ring-unit) * 25);\n  margin-top: var(--ring-unit);\n}\n\n.firstButton {\n  composes: button;\n\n  margin-top: calc(var(--ring-unit) * 4);\n}\n\n.title.title {\n  margin-top: 0;\n  margin-bottom: var(--ring-unit);\n\n  text-align: center;\n\n  font-weight: 100;\n}\n\n.logo {\n  width: calc(var(--ring-unit) * 12);\n  height: calc(var(--ring-unit) * 12);\n  margin-bottom: 12px;\n  object-fit: contain;\n\n  @media (height <= 400px) {\n    width: calc(var(--ring-unit) * 4);\n    height: calc(var(--ring-unit) * 4);\n  }\n}\n\n.error {\n  text-align: center;\n\n  color: var(--ring-error-color);\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={dialog:"dialog_eb86",content:`content_b229 ${_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.font}`,button:"button_ea1e",firstButton:"firstButton_c698 button_ea1e",title:"title_e485",logo:"logo_acd8",error:"error_cdae"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/heading/heading.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/global.css"),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__.default),___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default,"",!0),___CSS_LOADER_EXPORT___.push([module.id,".contentWithHeadings_cdca h1,.contentWithHeadings_cdca:is(h1),.contentWithHeadings_cdca h2,.contentWithHeadings_cdca:is(h2),.contentWithHeadings_cdca h3,.contentWithHeadings_cdca:is(h3),.contentWithHeadings_cdca h4,.contentWithHeadings_cdca:is(h4) {\n    margin-top: var(--ring-line-height);\n\n    font-weight: var(--ring-font-weight-bold);\n  }\n\n:is(.contentWithHeadings_cdca h1,.contentWithHeadings_cdca:is(h1),.contentWithHeadings_cdca h2,.contentWithHeadings_cdca:is(h2),.contentWithHeadings_cdca h3,.contentWithHeadings_cdca:is(h3),.contentWithHeadings_cdca h4,.contentWithHeadings_cdca:is(h4)):first-child {\n      margin-top: 0;\n    }\n\n.contentWithHeadings_cdca :is(h1,h2),.contentWithHeadings_cdca:is(h1,h2) {\n    margin-bottom: 8px;\n\n    color: var(--ring-heading-color);\n  }\n\n.contentWithHeadings_cdca h1,.contentWithHeadings_cdca:is(h1) {\n    font-size: 24px;\n    line-height: 28px;\n  }\n\n.contentWithHeadings_cdca h2,.contentWithHeadings_cdca:is(h2) {\n    font-size: 20px;\n    line-height: 24px;\n  }\n\n.contentWithHeadings_cdca h3,.contentWithHeadings_cdca:is(h3) {\n    margin-bottom: 0;\n\n    font-size: 16px;\n    line-height: 22px;\n  }\n\n.contentWithHeadings_cdca h4,.contentWithHeadings_cdca:is(h4) {\n    margin-bottom: 1px;\n\n    letter-spacing: 1px;\n    text-transform: uppercase;\n\n    font-size: 12px;\n    font-weight: normal;\n    line-height: 18px;\n  }\n\n.heading_cd1b {\n}\n\n.caps_ae59 {\n  letter-spacing: 2px;\n  text-transform: uppercase;\n}\n\n.heading_cd1b.bold_f434 {\n  font-weight: var(--ring-font-weight-bold);\n}\n","",{version:3,sources:["webpack://./src/heading/heading.css"],names:[],mappings:"AAGE;IAQE,mCAAmC;;IAEnC,yCAAyC;EAK3C;;AAHE;MACE,aAAa;IACf;;AAGF;IAEE,kBAAkB;;IAElB,gCAAgC;EAClC;;AAEA;IAEE,eAAe;IACf,iBAAiB;EACnB;;AAEA;IAEE,eAAe;IACf,iBAAiB;EACnB;;AAEA;IAEE,gBAAgB;;IAEhB,eAAe;IACf,iBAAiB;EACnB;;AAEA;IAEE,kBAAkB;;IAElB,mBAAmB;IACnB,yBAAyB;;IAEzB,eAAe;IACf,mBAAmB;IACnB,iBAAiB;EACnB;;AAGF;AAGA;;AAEA;EACE,mBAAmB;EACnB,yBAAyB;AAC3B;;AAEA;EACE,yCAAyC;AAC3C",sourcesContent:['@import "../global/variables.css";\n\n.contentWithHeadings {\n  & h1,\n  &:is(h1),\n  & h2,\n  &:is(h2),\n  & h3,\n  &:is(h3),\n  & h4,\n  &:is(h4) {\n    margin-top: var(--ring-line-height);\n\n    font-weight: var(--ring-font-weight-bold);\n\n    &:first-child {\n      margin-top: 0;\n    }\n  }\n\n  & :is(h1, h2),\n  &:is(h1, h2) {\n    margin-bottom: 8px;\n\n    color: var(--ring-heading-color);\n  }\n\n  & h1,\n  &:is(h1) {\n    font-size: 24px;\n    line-height: 28px;\n  }\n\n  & h2,\n  &:is(h2) {\n    font-size: 20px;\n    line-height: 24px;\n  }\n\n  & h3,\n  &:is(h3) {\n    margin-bottom: 0;\n\n    font-size: 16px;\n    line-height: 22px;\n  }\n\n  & h4,\n  &:is(h4) {\n    margin-bottom: 1px;\n\n    letter-spacing: 1px;\n    text-transform: uppercase;\n\n    font-size: 12px;\n    font-weight: normal;\n    line-height: 18px;\n  }\n}\n\n.heading {\n  composes: font from "../global/global.css";\n  composes: contentWithHeadings;\n}\n\n.caps {\n  letter-spacing: 2px;\n  text-transform: uppercase;\n}\n\n.heading.bold {\n  font-weight: var(--ring-font-weight-bold);\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={contentWithHeadings:"contentWithHeadings_cdca",heading:`heading_cd1b ${_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.font} contentWithHeadings_cdca`,caps:"caps_ae59",bold:"bold_f434"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/auth-dialog/auth-dialog.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/auth-dialog/auth-dialog.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/auth-dialog/auth-dialog.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>AuthDialog});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_island_island__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/island/content.tsx"),_dialog_dialog__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/dialog/dialog.tsx"),_button_button__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/button/button.tsx"),_heading_heading__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/heading/heading.tsx"),_auth_dialog_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/auth-dialog/auth-dialog.css"),_auth_dialog_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_auth_dialog_css__WEBPACK_IMPORTED_MODULE_2__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/jsx-runtime.js");class AuthDialog extends react__WEBPACK_IMPORTED_MODULE_0__.Component{static defaultProps={loginCaption:"Log in",loginToCaption:"Log in to %serviceName%",tryAgainLabel:"Try again",show:!1,cancelOnEsc:!0,confirmLabel:"Log in",cancelLabel:"Remain a guest",onConfirm:()=>{},onCancel:()=>{}};state={retrying:!1};componentDidMount(){window.addEventListener("online",this.onRetryPress)}componentWillUnmount(){window.removeEventListener("online",this.onRetryPress)}onEscPress=()=>{this.props.cancelOnEsc&&this.props.onCancel()};onRetryPress=async()=>{if(this.props.onTryAgain&&!this.state.retrying){this.setState({retrying:!0});try{await this.props.onTryAgain()}catch(e){}finally{this.setState({retrying:!1})}}};render(){const{show,className,errorMessage,serviceImage,serviceName,loginCaption,loginToCaption,confirmLabel,cancelLabel,tryAgainLabel,onConfirm,onCancel,onTryAgain}=this.props,{retrying}=this.state,defaultTitle=serviceName?loginToCaption:loginCaption,title=(this.props.title||defaultTitle).replace("%serviceName%",null!=serviceName?serviceName:"").replace("{{serviceName}}",null!=serviceName?serviceName:"");return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_dialog_dialog__WEBPACK_IMPORTED_MODULE_4__.A,{label:title,"data-test":"ring-auth-dialog",className,contentClassName:classnames__WEBPACK_IMPORTED_MODULE_1___default()(className,_auth_dialog_css__WEBPACK_IMPORTED_MODULE_2___default().dialog),onEscPress:this.onEscPress,show,trapFocus:!0,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_island_island__WEBPACK_IMPORTED_MODULE_5__.A,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div",{className:_auth_dialog_css__WEBPACK_IMPORTED_MODULE_2___default().content,children:[serviceImage&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("img",{alt:`${serviceName} logo`,className:_auth_dialog_css__WEBPACK_IMPORTED_MODULE_2___default().logo,src:serviceImage}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_heading_heading__WEBPACK_IMPORTED_MODULE_6__.H2,{className:_auth_dialog_css__WEBPACK_IMPORTED_MODULE_2___default().title,children:title}),errorMessage&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div",{className:_auth_dialog_css__WEBPACK_IMPORTED_MODULE_2___default().error,children:errorMessage}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_button_button__WEBPACK_IMPORTED_MODULE_7__.Ay,{primary:!0,className:_auth_dialog_css__WEBPACK_IMPORTED_MODULE_2___default().firstButton,"data-test":"auth-dialog-confirm-button",onClick:onConfirm,children:confirmLabel}),onTryAgain&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_button_button__WEBPACK_IMPORTED_MODULE_7__.Ay,{className:_auth_dialog_css__WEBPACK_IMPORTED_MODULE_2___default().button,"data-test":"auth-dialog-retry-button",onClick:()=>this.onRetryPress(),loader:retrying,disabled:retrying,children:tryAgainLabel}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_button_button__WEBPACK_IMPORTED_MODULE_7__.Ay,{className:_auth_dialog_css__WEBPACK_IMPORTED_MODULE_2___default().button,"data-test":"auth-dialog-cancel-button",onClick:onCancel,children:cancelLabel})]})})})}}AuthDialog.__docgenInfo={description:"",methods:[{name:"onEscPress",docblock:null,modifiers:[],params:[],returns:null},{name:"onRetryPress",docblock:null,modifiers:["async"],params:[],returns:null}],displayName:"AuthDialog",props:{className:{required:!1,tsType:{name:"union",raw:"string | undefined",elements:[{name:"string"},{name:"undefined"}]},description:""},title:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""},errorMessage:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""},serviceImage:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""},serviceName:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""},loginCaption:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Log in'",computed:!1}},loginToCaption:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Log in to %serviceName%'",computed:!1}},show:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},cancelOnEsc:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},confirmLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Log in'",computed:!1}},cancelLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Remain a guest'",computed:!1}},tryAgainLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Try again'",computed:!1}},onConfirm:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"",defaultValue:{value:"() => {}",computed:!1}},onCancel:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"",defaultValue:{value:"() => {}",computed:!1}},onTryAgain:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}}},"./src/heading/heading.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/heading/heading.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/heading/heading.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__,E:()=>Levels,H2:()=>H2,H3:()=>H3,H4:()=>H4});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),util_deprecate__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/util-deprecate/browser.js"),util_deprecate__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(util_deprecate__WEBPACK_IMPORTED_MODULE_2__),_heading_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/heading/heading.css"),_heading_css__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(_heading_css__WEBPACK_IMPORTED_MODULE_3__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/react/jsx-runtime.js");let Levels=function(Levels){return Levels[Levels.H1=1]="H1",Levels[Levels.H2=2]="H2",Levels[Levels.H3=3]="H3",Levels[Levels.H4=4]="H4",Levels}({});const fallbackHeading=util_deprecate__WEBPACK_IMPORTED_MODULE_2___default()((()=>"h3"),"Headings of level 5 and higher are replaced with h3"),HeadingMemo=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)((function Heading({children,className,level=Levels.H1,...restProps}){const classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_heading_css__WEBPACK_IMPORTED_MODULE_3___default().heading,className),Tag=level<=Levels.H4?`h${level}`:fallbackHeading();return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Tag,{...restProps,className:classes,children})})),Heading=HeadingMemo;Heading.Levels=Levels;const __WEBPACK_DEFAULT_EXPORT__=Heading,H1=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)((function H1(props){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Heading,{...props,level:Levels.H1})})),H2=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)((function H2(props){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Heading,{...props,level:Levels.H2})})),H3=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)((function H3(props){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Heading,{...props,level:Levels.H3})})),H4=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)((function H4({className,bold,...restProps}){const classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(className,{[_heading_css__WEBPACK_IMPORTED_MODULE_3___default().bold]:bold});return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Heading,{...restProps,className:classes,level:Levels.H4})}));HeadingMemo.__docgenInfo={description:"",methods:[],displayName:"HeadingMemo",props:{level:{required:!1,tsType:{name:"union",raw:"Levels | undefined",elements:[{name:"Levels"},{name:"undefined"}]},description:"",defaultValue:{value:"Levels.H1",computed:!0}}},composes:["HTMLAttributes"]},H1.__docgenInfo={description:"",methods:[],displayName:"H1"},H2.__docgenInfo={description:"",methods:[],displayName:"H2"},H3.__docgenInfo={description:"",methods:[],displayName:"H3"},H4.__docgenInfo={description:"",methods:[],displayName:"H4",props:{bold:{required:!1,tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]},description:""}},composes:["HTMLAttributes"]}}}]);