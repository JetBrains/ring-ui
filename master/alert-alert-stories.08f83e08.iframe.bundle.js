(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[5590],{"./node_modules/@jetbrains/icons/checkmark.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14.853 3.149c.248.24.254.636.014.884l-8.541 8.816a.625.625 0 0 1-.863.033L1.177 9.085a.625.625 0 0 1 .83-.936l3.837 3.401 8.125-8.387a.625.625 0 0 1 .884-.014Z" clip-rule="evenodd"/></svg>'},"./node_modules/@jetbrains/icons/chevron-10px.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><g><polygon points="5 7.99 1.5 4.5 2.5 3.5 5 6.01 7.5 3.5 8.49 4.5 5 7.99"/></g></svg>'},"./node_modules/@jetbrains/icons/close.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M13.442 2.558a.625.625 0 0 1 0 .884L8.883 8.006l4.546 4.552a.625.625 0 1 1-.884.884L8 8.89l-4.545 4.55a.625.625 0 0 1-.884-.883l4.546-4.552-4.56-4.564a.625.625 0 1 1 .885-.884L8 7.122l4.558-4.564a.625.625 0 0 1 .884 0Z" clip-rule="evenodd"/></svg>'},"./node_modules/@jetbrains/icons/exception.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM8.85 5a.85.85 0 1 0-1.7 0v3a.85.85 0 0 0 1.7 0V5ZM8 9.95a.85.85 0 0 0 0 1.7h.007a.85.85 0 0 0 0-1.7H8Z" clip-rule="evenodd"/></svg>'},"./node_modules/@jetbrains/icons/warning.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.7 14.243c.29.171.63.257 1.024.257h10.473c.393 0 .732-.086 1.016-.257.29-.172.513-.402.67-.691.159-.29.238-.61.238-.962a1.917 1.917 0 0 0-.271-.983L9.606 2.47a1.818 1.818 0 0 0-.718-.725A1.888 1.888 0 0 0 7.96 1.5c-.325 0-.636.081-.935.244a1.775 1.775 0 0 0-.71.725L1.07 11.607a2.018 2.018 0 0 0-.04 1.944c.157.29.38.52.67.692Zm6.267-4.43c-.393 0-.596-.2-.61-.597l-.094-3.292a.607.607 0 0 1 .182-.488.7.7 0 0 1 .509-.19.71.71 0 0 1 .514.197.59.59 0 0 1 .19.48L8.55 9.217c-.01.397-.204.596-.583.596Zm0 2.248a.829.829 0 0 1-.569-.21.706.706 0 0 1-.23-.535c0-.212.077-.388.23-.528a.814.814 0 0 1 .57-.217c.216 0 .401.07.555.21.158.14.237.318.237.535a.683.683 0 0 1-.237.535.811.811 0 0 1-.556.21Z" clip-rule="evenodd"/></svg>'},"./src/link/link.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__,F:()=>linkHOC});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_4__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_global_data_tests__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/global/data-tests.ts"),_clickableLink__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/link/clickableLink.tsx"),_link_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/link/link.css"),_link_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_link_css__WEBPACK_IMPORTED_MODULE_2__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}function linkHOC(ComposedComponent){const isCustom="string"!=typeof ComposedComponent&&ComposedComponent!==_clickableLink__WEBPACK_IMPORTED_MODULE_3__.A;return class Link extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{static propTypes={className:prop_types__WEBPACK_IMPORTED_MODULE_4___default().string,active:prop_types__WEBPACK_IMPORTED_MODULE_4___default().bool,inherit:prop_types__WEBPACK_IMPORTED_MODULE_4___default().bool,pseudo:prop_types__WEBPACK_IMPORTED_MODULE_4___default().bool,hover:prop_types__WEBPACK_IMPORTED_MODULE_4___default().bool,children:prop_types__WEBPACK_IMPORTED_MODULE_4___default().node,"data-test":prop_types__WEBPACK_IMPORTED_MODULE_4___default().string,href:prop_types__WEBPACK_IMPORTED_MODULE_4___default().string,onPlainLeftClick:prop_types__WEBPACK_IMPORTED_MODULE_4___default().func,onClick:prop_types__WEBPACK_IMPORTED_MODULE_4___default().func};render(){const{active,inherit,pseudo,hover,className,"data-test":dataTest,href,children,onPlainLeftClick,onClick,...restProps}=this.props,useButton=pseudo||!isCustom&&null==href,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_link_css__WEBPACK_IMPORTED_MODULE_2___default().link,className,{[_link_css__WEBPACK_IMPORTED_MODULE_2___default().active]:active,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().inherit]:inherit,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().hover]:hover,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().pseudo]:useButton});let props=restProps;return isCustom&&!props.activeClassName&&(props={...props,activeClassName:_link_css__WEBPACK_IMPORTED_MODULE_2___default().active}),useButton?react__WEBPACK_IMPORTED_MODULE_0__.createElement("button",_extends({type:"button"},props,{className:classes,onClick:onClick||onPlainLeftClick,"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_5__.A)("ring-link",dataTest)}),children):react__WEBPACK_IMPORTED_MODULE_0__.createElement(ComposedComponent,_extends({},props,{href,className:classes,onClick,onPlainLeftClick,"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_5__.A)("ring-link",dataTest)}),children)}}}const __WEBPACK_DEFAULT_EXPORT__=linkHOC(_clickableLink__WEBPACK_IMPORTED_MODULE_3__.A)},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/link/link.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,".link_c73c,\n.withLinks_a3f8 a {\n  cursor: pointer;\n  transition: color var(--ring-fast-ease);\n\n  color: var(--ring-link-color);\n\n  outline: none;\n\n  text-decoration-line: none;\n  text-decoration-thickness: 1px;\n  text-underline-offset: 3px;\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {:is(.link_c73c,.withLinks_a3f8 a):hover {\n    text-decoration-line: underline;\n\n    transition: none;\n\n    color: var(--ring-link-hover-color);\n  }}\n\n@media (resolution >= 2dppx) {\n\n.link_c73c,\n.withLinks_a3f8 a {\n    text-decoration-thickness: 0.5px;\n}\n  }\n\n.hover_e4ca:is(.link_c73c,.withLinks_a3f8 a) {\n    text-decoration-line: underline;\n\n    transition: none;\n\n    color: var(--ring-link-hover-color);\n  }\n\n/* stylelint-disable-next-line selector-max-specificity */\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.pseudo_cb40:is(.link_c73c,.withLinks_a3f8 a):hover {\n    text-decoration: none;\n  }}\n\n:is(.link_c73c,.withLinks_a3f8 a):focus-visible {\n    box-shadow: 0 0 0 2px var(--ring-border-hover-color);\n  }\n\n.link_c73c.active_eef2 {\n  color: inherit;\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.inherit_c3d7:not(:hover) {\n  color: inherit;\n}}\n\n.pseudo_cb40 {\n  margin: 0;\n  padding: 0;\n\n  text-align: left;\n\n  border: 0;\n\n  background: transparent;\n\n  font: inherit;\n}\n\n.pseudo_cb40::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n","",{version:3,sources:["webpack://./src/link/link.css","<no source>"],names:[],mappings:"AAEA;;EAEE,eAAe;EACf,uCAAuC;;EAEvC,6BAA6B;;EAE7B,aAAa;;EAEb,0BAA0B;EAC1B,8BAA8B;EAC9B,0BAA0B;AAuB5B;;ACpCA,wGAAA;IAAA,gCAAA;;IAAA,iBAAA;;IAAA,oCAAA;GAAA,CAAA;;ADeE;;AAbF;;IAcI,gCAAgC;AAoBpC;EAnBE;;AAEA;IAEE,+BAA+B;;IAE/B,gBAAgB;;IAEhB,mCAAmC;EACrC;;AAEA,yDAAyD;;AC5B3D,wGAAA;IAAA,sBAAA;GAAA,CAAA;;ADiCE;IACE,oDAAoD;EACtD;;AAGF;EACE,cAAc;AAChB;;ACxCA,wGAAA;EAAA,eAAA;CAAA,CAAA;;AD8CA;EACE,SAAS;EACT,UAAU;;EAEV,gBAAgB;;EAEhB,SAAS;;EAET,uBAAuB;;EAEvB,aAAa;AAOf;;AALE;IACE,UAAU;;IAEV,SAAS;EACX",sourcesContent:['@import "../global/variables.css";\n\n.link,\n.withLinks a {\n  cursor: pointer;\n  transition: color var(--ring-fast-ease);\n\n  color: var(--ring-link-color);\n\n  outline: none;\n\n  text-decoration-line: none;\n  text-decoration-thickness: 1px;\n  text-underline-offset: 3px;\n\n  @media (resolution >= 2dppx) {\n    text-decoration-thickness: 0.5px;\n  }\n\n  &:hover,\n  &.hover {\n    text-decoration-line: underline;\n\n    transition: none;\n\n    color: var(--ring-link-hover-color);\n  }\n\n  /* stylelint-disable-next-line selector-max-specificity */\n  &.pseudo:hover {\n    text-decoration: none;\n  }\n\n  &:focus-visible {\n    box-shadow: 0 0 0 2px var(--ring-border-hover-color);\n  }\n}\n\n.link.active {\n  color: inherit;\n}\n\n.inherit:not(:hover) {\n  color: inherit;\n}\n\n.pseudo {\n  margin: 0;\n  padding: 0;\n\n  text-align: left;\n\n  border: 0;\n\n  background: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}\n',null],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={link:"link_c73c",withLinks:"withLinks_a3f8",hover:"hover_e4ca",pseudo:"pseudo_cb40",active:"active_eef2",inherit:"inherit_c3d7"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/link/link.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/link/link.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/alert/alert.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{alertContainer:()=>alertContainer,default:()=>__WEBPACK_DEFAULT_EXPORT__,simple:()=>simple});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_link_link__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/link/link.tsx"),_button_button__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/button/button.tsx"),_alert__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/alert/alert.tsx"),_alert__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/alert/container.tsx");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Alert",component:_alert__WEBPACK_IMPORTED_MODULE_1__.Ay},simple=()=>{class AlertDemo extends react__WEBPACK_IMPORTED_MODULE_0__.Component{state={show:!0,isClosing:!1};onClose=()=>{this.setState({show:!1})};onCloseRequest=()=>{this.setState({isClosing:!0})};render(){const{show,isClosing}=this.state;return show?react__WEBPACK_IMPORTED_MODULE_0__.createElement(_alert__WEBPACK_IMPORTED_MODULE_1__.Ay,{type:_alert__WEBPACK_IMPORTED_MODULE_1__.Ay.Type.SUCCESS,onClose:this.onClose,showWithAnimation:!1,onCloseRequest:this.onCloseRequest,isClosing},"Sample alert ",react__WEBPACK_IMPORTED_MODULE_0__.createElement(_link_link__WEBPACK_IMPORTED_MODULE_2__.A,null,"with link")):null}}return react__WEBPACK_IMPORTED_MODULE_0__.createElement(AlertDemo,null)};simple.storyName="simple";const alertContainer=()=>{class AlertContainerDemo extends react__WEBPACK_IMPORTED_MODULE_0__.Component{state={alerts:[{type:_alert__WEBPACK_IMPORTED_MODULE_1__.Ay.Type.ERROR,key:0,message:"Test error",isClosing:!1},{type:_alert__WEBPACK_IMPORTED_MODULE_1__.Ay.Type.WARNING,key:1,message:"Test warning",isClosing:!1},{type:_alert__WEBPACK_IMPORTED_MODULE_1__.Ay.Type.LOADING,key:2,message:"Test loading",isClosing:!1},{type:_alert__WEBPACK_IMPORTED_MODULE_1__.Ay.Type.MESSAGE,key:3,message:"Test message",isClosing:!1},{type:_alert__WEBPACK_IMPORTED_MODULE_1__.Ay.Type.MESSAGE,key:4,message:react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,"Message ",react__WEBPACK_IMPORTED_MODULE_0__.createElement(_link_link__WEBPACK_IMPORTED_MODULE_2__.A,{href:"#"},"with link")),isClosing:!1}]};yetAnotherMessage=()=>{this.setState((prevState=>({...prevState,alerts:[{type:_alert__WEBPACK_IMPORTED_MODULE_1__.Ay.Type.MESSAGE,key:Date.now(),message:`Another message at ${new Date}`},...prevState.alerts]})))};onCloseAlert=closedAlert=>{this.setState((prevState=>({...prevState,alerts:prevState.alerts.filter((alert=>alert!==closedAlert))})))};onCloseAlertClick=alert=>{this.state.alerts.filter((it=>alert.key===it.key))[0].isClosing=!0,this.setState((prevState=>({...prevState,alerts:[...prevState.alerts]})))};render(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button_button__WEBPACK_IMPORTED_MODULE_3__.Ay,{onClick:this.yetAnotherMessage},"Create another message"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_alert__WEBPACK_IMPORTED_MODULE_4__.A,null,this.state.alerts.map((alert=>{const{message,key,...rest}=alert;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_alert__WEBPACK_IMPORTED_MODULE_1__.Ay,_extends({key},rest,{onCloseRequest:()=>this.onCloseAlertClick(alert),onClose:()=>this.onCloseAlert(alert)}),message)}))))}}return react__WEBPACK_IMPORTED_MODULE_0__.createElement(AlertContainerDemo,null)};alertContainer.parameters={hermione:{captureSelector:'*[data-test="alert-container"]'},a11y:{element:'#storybook-root,*[data-test="alert-container"]'}},simple.parameters={...simple.parameters,docs:{...simple.parameters?.docs,source:{originalSource:"() => {\n  class AlertDemo extends React.Component {\n    state = {\n      show: true,\n      isClosing: false\n    };\n    onClose = () => {\n      this.setState({\n        show: false\n      });\n    };\n    onCloseRequest = () => {\n      this.setState({\n        isClosing: true\n      });\n    };\n    render() {\n      const {\n        show,\n        isClosing\n      } = this.state;\n      if (!show) {\n        return null;\n      }\n      return <Alert type={Alert.Type.SUCCESS} onClose={this.onClose} showWithAnimation={false} onCloseRequest={this.onCloseRequest} isClosing={isClosing}>\n          Sample alert <Link>with link</Link>\n        </Alert>;\n    }\n  }\n  return <AlertDemo />;\n}",...simple.parameters?.docs?.source}}},alertContainer.parameters={...alertContainer.parameters,docs:{...alertContainer.parameters?.docs,source:{originalSource:"() => {\n  class AlertContainerDemo extends React.Component<Record<string, never>, AlertContainerState> {\n    state = {\n      alerts: [{\n        type: Alert.Type.ERROR,\n        key: 0,\n        message: 'Test error',\n        isClosing: false\n      }, {\n        type: Alert.Type.WARNING,\n        key: 1,\n        message: 'Test warning',\n        isClosing: false\n      }, {\n        type: Alert.Type.LOADING,\n        key: 2,\n        message: 'Test loading',\n        isClosing: false\n      }, {\n        type: Alert.Type.MESSAGE,\n        key: 3,\n        message: 'Test message',\n        isClosing: false\n      }, {\n        type: Alert.Type.MESSAGE,\n        key: 4,\n        message: <span>\n              Message <Link href=\"#\">with link</Link>\n            </span>,\n        isClosing: false\n      }]\n    };\n    yetAnotherMessage = () => {\n      this.setState(prevState => ({\n        ...prevState,\n        alerts: [{\n          type: Alert.Type.MESSAGE,\n          key: Date.now(),\n          message: `Another message at ${new Date()}`\n        }, ...prevState.alerts]\n      }));\n    };\n    onCloseAlert = (closedAlert: AlertItem) => {\n      this.setState(prevState => ({\n        ...prevState,\n        alerts: prevState.alerts.filter(alert => alert !== closedAlert)\n      }));\n    };\n    onCloseAlertClick = (alert: AlertItem) => {\n      const alertToClose = this.state.alerts.filter(it => alert.key === it.key)[0];\n      alertToClose.isClosing = true;\n      this.setState(prevState => ({\n        ...prevState,\n        alerts: [...prevState.alerts]\n      }));\n    };\n    render() {\n      return <div>\n          <Button onClick={this.yetAnotherMessage}>Create another message</Button>\n\n          <Container>\n            {this.state.alerts.map(alert => {\n            const {\n              message,\n              key,\n              ...rest\n            } = alert;\n            return <Alert key={key} {...rest} onCloseRequest={() => this.onCloseAlertClick(alert)} onClose={() => this.onCloseAlert(alert)}>\n                  {message}\n                </Alert>;\n          })}\n          </Container>\n        </div>;\n    }\n  }\n  return <AlertContainerDemo />;\n}",...alertContainer.parameters?.docs?.source}}}},"./node_modules/util-deprecate/browser.js":(module,__unused_webpack_exports,__webpack_require__)=>{function config(name){try{if(!__webpack_require__.g.localStorage)return!1}catch(_){return!1}var val=__webpack_require__.g.localStorage[name];return null!=val&&"true"===String(val).toLowerCase()}module.exports=function deprecate(fn,msg){if(config("noDeprecation"))return fn;var warned=!1;return function deprecated(){if(!warned){if(config("throwDeprecation"))throw new Error(msg);config("traceDeprecation")?console.trace(msg):console.warn(msg),warned=!0}return fn.apply(this,arguments)}}}}]);