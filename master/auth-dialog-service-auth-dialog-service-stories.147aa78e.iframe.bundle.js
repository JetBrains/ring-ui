(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[1722],{"./.storybook/react-decorator.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_dom_client__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-dom/client.js"),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("@storybook/preview-api");const reactDecorator=(StoryFn,context)=>{const node=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useMemo)((()=>document.createElement("div")),[context.kind,context.name]),root=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useMemo)((()=>(0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(node)),[node]);return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useEffect)((()=>()=>root.unmount()),[root]),root.render(react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.StrictMode,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(StoryFn,null))),node},__WEBPACK_DEFAULT_EXPORT__=()=>reactDecorator},"./src/auth-dialog-service/auth-dialog-service.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{authDialogService:()=>authDialogService,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./.storybook/react-decorator.tsx"),_storybook_hub_config__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./.storybook/hub-config.ts"),_auth_auth__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/auth/auth.ts"),_button_button__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/button/button.tsx"),_auth_dialog_service__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/auth-dialog-service/auth-dialog-service.tsx");const __WEBPACK_DEFAULT_EXPORT__={title:"Services/Auth Dialog Service",decorators:[(0,_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__.Z)()],parameters:{storySource:{source:"import React from 'react';\n\nimport reactDecorator from '../../.storybook/react-decorator';\n\nimport hubConfig from '../../.storybook/hub-config';\n\nimport Auth from '../auth/auth';\nimport Button from '../button/button';\n\nimport showAuthDialog from './auth-dialog-service';\n\nexport default {\n  title: 'Services/Auth Dialog Service',\n  decorators: [reactDecorator()],\n\n  parameters: {\n    notes:\n      'A wrapper for the AuthDialog component. Allows showing the auth dialog without mounting the AuthDialog component first. Can be used outside React.',\n    hermione: {skip: true}\n  }\n};\n\ninterface AuthDialogServiceArgs {\n  onConfirm: () => void\n  onCancel: () => void\n}\n\ninterface AuthDialogDemoState {\n  serviceDetails: unknown\n}\nexport const authDialogService = ({onConfirm, onCancel}: AuthDialogServiceArgs) => {\n  const auth = new Auth(hubConfig);\n\n  class AuthDialogDemo extends React.Component<{}, AuthDialogDemoState> {\n    componentDidMount() {\n      auth.init();\n      this.showAuthDialog();\n    }\n\n    componentWillUnmount() {\n      if (this.hideAuthDialog) {\n        this.hideAuthDialog();\n      }\n    }\n\n    hideAuthDialog?: () => void;\n    showAuthDialog = () => {\n      this.hideAuthDialog = showAuthDialog({\n        errorMessage: 'Error message',\n        onConfirm,\n        onCancel\n      });\n    };\n\n    render() {\n      return (\n        <div>\n          <Button onClick={this.showAuthDialog}>Show auth dialog</Button>\n        </div>\n      );\n    }\n  }\n\n  return <AuthDialogDemo/>;\n};\n\nauthDialogService.argTypes = {onConfirm: {}, onCancel: {}};\n",locationsMap:{"auth-dialog-service":{startLoc:{col:33,line:31},endLoc:{col:1,line:65},startBody:{col:33,line:31},endBody:{col:1,line:65}}}},notes:"A wrapper for the AuthDialog component. Allows showing the auth dialog without mounting the AuthDialog component first. Can be used outside React.",hermione:{skip:!0}}},authDialogService=_ref=>{let{onConfirm,onCancel}=_ref;const auth=new _auth_auth__WEBPACK_IMPORTED_MODULE_2__.ZP(_storybook_hub_config__WEBPACK_IMPORTED_MODULE_3__.Z);class AuthDialogDemo extends react__WEBPACK_IMPORTED_MODULE_0__.Component{componentDidMount(){auth.init(),this.showAuthDialog()}componentWillUnmount(){this.hideAuthDialog&&this.hideAuthDialog()}hideAuthDialog;showAuthDialog=()=>{this.hideAuthDialog=(0,_auth_dialog_service__WEBPACK_IMPORTED_MODULE_4__.Z)({errorMessage:"Error message",onConfirm,onCancel})};render(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button_button__WEBPACK_IMPORTED_MODULE_5__.ZP,{onClick:this.showAuthDialog},"Show auth dialog"))}}return react__WEBPACK_IMPORTED_MODULE_0__.createElement(AuthDialogDemo,null)};authDialogService.argTypes={onConfirm:{},onCancel:{}},authDialogService.__docgenInfo={description:"",methods:[],displayName:"authDialogService",props:{onConfirm:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onCancel:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/auth-dialog-service/auth-dialog-service.stories.tsx"]={name:"authDialogService",docgenInfo:authDialogService.__docgenInfo,path:"src/auth-dialog-service/auth-dialog-service.stories.tsx"})},"./src/auth-dialog-service/auth-dialog-service.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>showAuthDialog});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_global_controls_height__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/global/controls-height.tsx"),_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/global/react-render-adapter.ts"),_auth_dialog_auth_dialog__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/auth-dialog/auth-dialog.tsx");const containerElement=document.createElement("div");function renderAuthDialog(props){(0,_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_1__.sY)(react__WEBPACK_IMPORTED_MODULE_0__.createElement(_global_controls_height__WEBPACK_IMPORTED_MODULE_2__.pS.Provider,{value:(0,_global_controls_height__WEBPACK_IMPORTED_MODULE_2__.qu)()},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_auth_dialog_auth_dialog__WEBPACK_IMPORTED_MODULE_3__.Z,props)),containerElement)}function showAuthDialog(){return renderAuthDialog({...arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},show:!0}),()=>{renderAuthDialog({show:!1})}}},"./src/global/url.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{$h:()=>fixUrl,EQ:()=>encodeURL,YV:()=>getAbsoluteBaseURL,ZK:()=>joinBaseURLAndPath,dD:()=>parseQueryString,gJ:()=>isDataURI});const ABSOLUTE_URL_PATTERN=/^[a-z]+:\/\//i;function getBaseURI(){const baseElement=document.getElementsByTagName("base")[0];return baseElement?baseElement.href:void 0}function getAbsoluteBaseURL(){const baseUrl=getBaseURI(),host=`${window.location.protocol}//${window.location.host}`;let uri;return uri=baseUrl?ABSOLUTE_URL_PATTERN.test(baseUrl)?baseUrl:host+baseUrl:host,uri}function fixUrl(url){let baseURIGetter=arguments.length>1&&void 0!==arguments[1]?arguments[1]:getBaseURI;if(-1===url.indexOf("http://")&&-1===url.indexOf("https://")&&0!==url.indexOf("/")){const baseUrl=baseURIGetter();if(baseUrl)return baseUrl+url}return url}function joinBaseURLAndPath(baseUrl,path){return baseUrl&&-1===path.indexOf("http://")&&-1===path.indexOf("https://")?baseUrl+path:path}function parseQueryString(queryString){if(null==queryString)return{};const queryParameterPairRE=/([^&;=]+)=?([^&;]*)/g,urlParams={};function decode(s){return decodeURIComponent(s.replace(/\+/g," "))}let matchedQueryPair;for(;null!=(matchedQueryPair=queryParameterPairRE.exec(queryString));)urlParams[decode(matchedQueryPair[1])]=decode(matchedQueryPair[2]);return urlParams}function customEncodeURIComponent(str){return encodeURIComponent(String(str)).replace(/%2C/g,",")}function encodeURL(url,params){const firstSeparator=-1===url.indexOf("?")?"?":"&";let k,res=url,i=0;for(k in params)params.hasOwnProperty(k)&&null!=params[k]&&(res+=(0==i++?firstSeparator:"&")+customEncodeURIComponent(k)+"="+customEncodeURIComponent(params[k]));return res}function isDataURI(uri){return 0===uri.indexOf("data:")}},"./src/i18n/i18n.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{FC:()=>getTranslations,l2:()=>getTranslationsWithFallback,Yh:()=>setTranslations,Iu:()=>translate});const messages_namespaceObject=JSON.parse('{"login":"Log in","logout":"Log out","loginTo":"Log in to {{serviceName}}","ok":"OK","cancel":"Cancel","tryAgainLabel":"Try again","postpone":"Postpone","youHaveLoggedInAs":"You have logged in as another user: {{userName}}","applyChange":"Apply change","backendIsNotAvailable":"Connection lost","checkAgain":"try again","nothingHappensLink":"Click here if nothing happens","errorMessage":"There may be a problem with your network connection. Make sure that you are online and","applyChangedUser":"Apply changed user","profile":"Profile","switchUser":"Switch user","addFirstDate":"Add first date","addSecondDate":"Add second date","addTime":"Add time","selectName":"Select {{name}}","setDate":"Set a date","setDateTime":"Set date and time","setPeriod":"Set a period","clear":"Clear input","gotIt":"Got it","dismiss":"Dismiss","perPage":"per page","firstPage":"First page","lastPage":"Last page","nextPage":"Next page","previousPage":"Previous","searchTitle":"Search","clearTitle":"Clear search input","userAgreement":"User Agreement","accept":"Accept","decline":"Decline","close":"Close","scrollToAccept":"View the entire agreement to continue","remindLater":"Remind me later","filterItems":"Filter items","selectOption":"Select an option","progress":"Progress","loading":"Loading...","noOptionsFound":"No options found","banned":"banned","online":"online","offline":"offline","copyToClipboard":"Copy email to clipboard","copiedToClipboard":"Email was copied to clipboard","copingToClipboardError":"Failed to copy to clipboard","unverified":"Unverified"}');let messages=messages_namespaceObject;const warned=new Set;function setTranslations(newMessages){messages=newMessages}function getTranslations(){return messages}function getTranslationsWithFallback(){return{...messages_namespaceObject,...messages}}function translate(key){var _messages$key;return key in messages||function warnMissedKeyOnce(key){warned.has(key)||(warned.add(key),console.warn(`Missing localisation for key "${key}"`))}(key),null!==(_messages$key=messages[key])&&void 0!==_messages$key?_messages$key:messages_namespaceObject[key]}},"./src/link/link.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{YL:()=>setCompatibilityMode,ZP:()=>__WEBPACK_DEFAULT_EXPORT__,g8:()=>linkHOC});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_4__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_global_memoize__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/global/memoize.ts"),_global_data_tests__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/global/data-tests.ts"),_clickableLink__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/link/clickableLink.tsx"),_link_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/link/link.css"),_link_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_link_css__WEBPACK_IMPORTED_MODULE_2__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}let isCompatibilityMode=!1;function setCompatibilityMode(isEnabled){isCompatibilityMode=isEnabled}const makeWrapText=(0,_global_memoize__WEBPACK_IMPORTED_MODULE_3__.Z)((innerClassName=>{function WrapText(_ref){let{className,children}=_ref;const classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_link_css__WEBPACK_IMPORTED_MODULE_2___default().inner,className,innerClassName);return react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{className:classes},children)}return WrapText.propTypes={className:prop_types__WEBPACK_IMPORTED_MODULE_4___default().string,children:prop_types__WEBPACK_IMPORTED_MODULE_4___default().node},(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(WrapText)}));function linkHOC(ComposedComponent){const isCustom="string"!=typeof ComposedComponent&&ComposedComponent!==_clickableLink__WEBPACK_IMPORTED_MODULE_5__.Z;return class Link extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{static propTypes={className:prop_types__WEBPACK_IMPORTED_MODULE_4___default().string,innerClassName:prop_types__WEBPACK_IMPORTED_MODULE_4___default().string,active:prop_types__WEBPACK_IMPORTED_MODULE_4___default().bool,inherit:prop_types__WEBPACK_IMPORTED_MODULE_4___default().bool,pseudo:prop_types__WEBPACK_IMPORTED_MODULE_4___default().bool,hover:prop_types__WEBPACK_IMPORTED_MODULE_4___default().bool,children:prop_types__WEBPACK_IMPORTED_MODULE_4___default().oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_4___default().node,prop_types__WEBPACK_IMPORTED_MODULE_4___default().func]),"data-test":prop_types__WEBPACK_IMPORTED_MODULE_4___default().string,href:prop_types__WEBPACK_IMPORTED_MODULE_4___default().string,onPlainLeftClick:prop_types__WEBPACK_IMPORTED_MODULE_4___default().func,onClick:prop_types__WEBPACK_IMPORTED_MODULE_4___default().func};getChildren(){const{children,innerClassName}=this.props,WrapText=makeWrapText(innerClassName);return"function"==typeof children?children(WrapText):react__WEBPACK_IMPORTED_MODULE_0__.createElement(WrapText,null,children)}render(){const{active,inherit,pseudo,hover,className,"data-test":dataTest,href,innerClassName,children,onPlainLeftClick,onClick,...restProps}=this.props,useButton=pseudo||!isCustom&&null==href,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_link_css__WEBPACK_IMPORTED_MODULE_2___default().link,className,{[_link_css__WEBPACK_IMPORTED_MODULE_2___default().active]:active,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().inherit]:inherit,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().hover]:hover,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().compatibilityUnderlineMode]:isCompatibilityMode,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().pseudo]:useButton,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().text]:"function"!=typeof children});let props=restProps;return isCustom&&!props.activeClassName&&(props={...props,activeClassName:_link_css__WEBPACK_IMPORTED_MODULE_2___default().active}),useButton?react__WEBPACK_IMPORTED_MODULE_0__.createElement("button",_extends({type:"button"},props,{className:classes,onClick:onClick||onPlainLeftClick,"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_6__.Z)("ring-link",dataTest)}),this.getChildren()):react__WEBPACK_IMPORTED_MODULE_0__.createElement(ComposedComponent,_extends({},props,{href,className:classes,onClick,onPlainLeftClick,"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_6__.Z)("ring-link",dataTest)}),this.getChildren())}}}const __WEBPACK_DEFAULT_EXPORT__=linkHOC(_clickableLink__WEBPACK_IMPORTED_MODULE_5__.Z)},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/link/link.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,".link_c73c {\n  cursor: pointer;\n  transition: color var(--ring-fast-ease);\n\n  color: var(--ring-link-color);\n\n  outline: none;\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_c73c:hover {\n    transition: none;\n\n    color: var(--ring-link-hover-color);\n  }}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_c73c:hover {\n    text-decoration: none;\n  }}\n\n.link_c73c {\n    text-decoration: none;\n  }\n\n.link_c73c.hover_e4ca {\n    transition: none;\n\n    color: var(--ring-link-hover-color);\n  }\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_c73c:hover .inner_d16b {\n    border-width: 0;\n    border-bottom: 2px solid;\n    border-image-source: linear-gradient(currentcolor 50%, transparent 50%);\n    border-image-slice: 0 0 100% 0;\n  }}\n\n.link_c73c.active_eef2 {\n    color: inherit;\n  }\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_c73c.compatibilityUnderlineMode_a632:hover {\n    text-decoration: underline;\n\n    /* stylelint-disable-next-line selector-max-specificity */\n  }\n    .link_c73c.compatibilityUnderlineMode_a632:hover .inner_d16b {\n      border: none;\n    }}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_c73c.pseudo_cb40:hover {\n    text-decoration: none;\n\n    /* stylelint-disable-next-line selector-max-specificity */\n  }\n    .link_c73c.pseudo_cb40:hover .inner_d16b {\n      border: none;\n    }}\n\n.link_c73c:focus-visible {\n    box-shadow: 0 0 0 2px var(--ring-border-hover-color);\n  }\n\n@media (min-resolution: 2dppx) {@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.link_c73c:hover .inner_d16b {\n    border-bottom-width: 1px;\n  }}\n}\n\n.text_e0fe {\n  border-radius: var(--ring-border-radius);\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.inherit_c3d7:not(:hover) {\n  color: inherit;\n}}\n\n.pseudo_cb40 {\n  margin: 0;\n  padding: 0;\n\n  text-align: left;\n\n  border: 0;\n\n  background: transparent;\n\n  font: inherit;\n}\n\n.pseudo_cb40::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n","",{version:3,sources:["webpack://./src/link/link.css","<no source>"],names:[],mappings:"AAEA;EACE,eAAe;EACf,uCAAuC;;EAEvC,6BAA6B;;EA2C7B,aAAa;AAKf;;ACtDA,wGAAA;IAAA,iBAAA;;IAAA,oCAAA;GAAA,CAAA;;AAAA,wGAAA;IAAA,sBAAA;GAAA,CAAA;;ADQE;IAEE,qBAAqB;EACvB;;AAEA;IAEE,gBAAgB;;IAEhB,mCAAmC;EACrC;;AClBF,wGAAA;IAAA,gBAAA;IAAA,yBAAA;IAAA,wEAAA;IAAA,+BAAA;GAAA,CAAA;;AD2BE;IACE,cAAc;EAChB;;AC7BF,wGAAA;IAAA,2BAAA;;IAAA,0DAAA;GAAA;IAAA;MAAA,aAAA;KAAA,CAAA;;AAAA,wGAAA;IAAA,sBAAA;;IAAA,0DAAA;GAAA;IAAA;MAAA,aAAA;KAAA,CAAA;;ADmDE;IACE,oDAAoD;EACtD;;AAGF,gCCxDA,wGAAA;IAAA,yBAAA;GAAA,CAAA;AD4DA;;AAEA;EACE,wCAAwC;AAC1C;;AChEA,wGAAA;EAAA,eAAA;CAAA,CAAA;;ADsEA;EACE,SAAS;EACT,UAAU;;EAEV,gBAAgB;;EAEhB,SAAS;;EAET,uBAAuB;;EAEvB,aAAa;AAOf;;AALE;IACE,UAAU;;IAEV,SAAS;EACX",sourcesContent:['@import "../global/variables.css";\n\n.link {\n  cursor: pointer;\n  transition: color var(--ring-fast-ease);\n\n  color: var(--ring-link-color);\n\n  &,\n  &:hover {\n    text-decoration: none;\n  }\n\n  &:hover,\n  &.hover {\n    transition: none;\n\n    color: var(--ring-link-hover-color);\n  }\n\n  &:hover .inner {\n    border-width: 0;\n    border-bottom: 2px solid;\n    border-image-source: linear-gradient(currentcolor 50%, transparent 50%);\n    border-image-slice: 0 0 100% 0;\n  }\n\n  &.active {\n    color: inherit;\n  }\n\n  &.compatibilityUnderlineMode:hover {\n    text-decoration: underline;\n\n    /* stylelint-disable-next-line selector-max-specificity */\n    & .inner {\n      border: none;\n    }\n  }\n\n  &.pseudo:hover {\n    text-decoration: none;\n\n    /* stylelint-disable-next-line selector-max-specificity */\n    & .inner {\n      border: none;\n    }\n  }\n\n  outline: none;\n\n  &:focus-visible {\n    box-shadow: 0 0 0 2px var(--ring-border-hover-color);\n  }\n}\n\n@media (min-resolution: 2dppx) {\n  .link:hover .inner {\n    border-bottom-width: 1px;\n  }\n}\n\n.text {\n  border-radius: var(--ring-border-radius);\n}\n\n.inherit:not(:hover) {\n  color: inherit;\n}\n\n.pseudo {\n  margin: 0;\n  padding: 0;\n\n  text-align: left;\n\n  border: 0;\n\n  background: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}\n',null],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={link:"link_c73c",hover:"hover_e4ca",inner:"inner_d16b",active:"active_eef2",compatibilityUnderlineMode:"compatibilityUnderlineMode_a632",pseudo:"pseudo_cb40",text:"text_e0fe",inherit:"inherit_c3d7"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/link/link.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/link/link.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"?4f7e":()=>{}}]);