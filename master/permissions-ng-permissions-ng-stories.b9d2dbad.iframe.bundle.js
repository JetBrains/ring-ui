(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[6079],{"./src/permissions-ng/permissions-ng.stories.js":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{rgPermissionIf:function(){return rgPermissionIf}});var angular__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/angular/index.js"),angular__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__),_storybook_angular_decorator__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./.storybook/angular-decorator.js"),_storybook_hub_config__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./.storybook/hub-config.ts"),_auth_ng_auth_ng__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/auth-ng/auth-ng.js"),_permissions_ng__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/permissions-ng/permissions-ng.js");__webpack_exports__.default={title:"Legacy Angular/Permissions Ng",decorators:[(0,_storybook_angular_decorator__WEBPACK_IMPORTED_MODULE_1__.Z)()],parameters:{storySource:{source:"import angular from 'angular';\n\nimport angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';\n\nimport hubConfig from '../../.storybook/hub-config';\n\nimport AuthNG from '../auth-ng/auth-ng';\n\nimport PermissionsNG from './permissions-ng';\n\nexport default {\n  title: 'Legacy Angular/Permissions Ng',\n  decorators: [angularDecorator()],\n\n  parameters: {\n    hermione: {skip: true}\n  }\n};\n\nexport const rgPermissionIf = () => {\n  angular.\n    module(APP_NAME, [PermissionsNG, AuthNG]).\n    config([\n      'authProvider',\n      function provider(authProvider) {\n        authProvider.config(hubConfig);\n      }\n    ]).\n    config(userPermissionsProvider => {\n      userPermissionsProvider.config({\n        serviceId: '0-0-0-0-0',\n        prefix: 'jetbrains.jetpass.'\n      });\n    });\n\n  return `\n      <div rg-permission-if=\"project-read\" in-project=\"0-0-0-0-0\">\n        Is transcluded if user has permission 'read-project' in project 0-0-0-0-0.\n      </div>\n      <div rg-permission-if=\"project-read\">\n        Is transcluded if user has permission 'read-project' at least in one project.\n      </div>\n      <div rg-permission-if=\"project-read\" in-global>\n        Is transcluded if user has permission 'read-project' at project \"global\".\n      </div>\n    `;\n};\n\nrgPermissionIf.storyName = 'Permissions Ng';\n",locationsMap:{"rg-permission-if":{startLoc:{col:30,line:20},endLoc:{col:1,line:47},startBody:{col:30,line:20},endBody:{col:1,line:47}}}},hermione:{skip:!0}}};const rgPermissionIf=()=>(angular__WEBPACK_IMPORTED_MODULE_0___default().module(_storybook_angular_decorator__WEBPACK_IMPORTED_MODULE_1__.i,[_permissions_ng__WEBPACK_IMPORTED_MODULE_2__.Z,_auth_ng_auth_ng__WEBPACK_IMPORTED_MODULE_3__.Z]).config(["authProvider",function provider(authProvider){authProvider.config(_storybook_hub_config__WEBPACK_IMPORTED_MODULE_4__.Z)}]).config(["userPermissionsProvider",userPermissionsProvider=>{userPermissionsProvider.config({serviceId:"0-0-0-0-0",prefix:"jetbrains.jetpass."})}]),'\n      <div rg-permission-if="project-read" in-project="0-0-0-0-0">\n        Is transcluded if user has permission \'read-project\' in project 0-0-0-0-0.\n      </div>\n      <div rg-permission-if="project-read">\n        Is transcluded if user has permission \'read-project\' at least in one project.\n      </div>\n      <div rg-permission-if="project-read" in-global>\n        Is transcluded if user has permission \'read-project\' at project "global".\n      </div>\n    ');rgPermissionIf.storyName="Permissions Ng"},"./src/auth-ng/auth-ng.js":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var angular__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/angular/index.js"),angular__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__),_auth_auth__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/auth/auth.ts");const angularModule=angular__WEBPACK_IMPORTED_MODULE_0___default().module("Ring.auth",[]);angularModule.provider("auth",["$httpProvider",function provider($httpProvider){let auth;const defaultConfig={cleanHash:!1};this.init=authInstance=>{auth=authInstance},this.config=config=>{const configCopy=angular__WEBPACK_IMPORTED_MODULE_0___default().extend({},defaultConfig,config);auth=new _auth_auth__WEBPACK_IMPORTED_MODULE_1__.ZP(configCopy)},$httpProvider.interceptors.push(["$q","$injector","auth",($q,$injector,authInstance)=>{function urlEndsWith(config,suffix){return config&&config.url&&config.url.indexOf(suffix)===config.url.length-suffix.length}return{request(config){return!authInstance||urlEndsWith(config,".html")||config&&config.noAuthorization?config:authInstance.promise.then((()=>authInstance.auth.requestToken())).then((accessToken=>(accessToken&&(config.headers.Authorization=`Bearer ${accessToken}`),config)))},responseError(rejection){if(authInstance&&!urlEndsWith(rejection.config,".html")&&null!=rejection.data&&_auth_auth__WEBPACK_IMPORTED_MODULE_1__.ZP.shouldRefreshToken(rejection.data.error)){const $http=$injector.get("$http"),{data:data,method:method,params:params,url:url}=rejection.config;return authInstance.auth.forceTokenUpdate().then((()=>$http({data:data,method:method,params:params,url:url})))}return $q.reject(rejection)}}}]),this.$get=["$injector","$log","$sniffer",function get($injector,$log,$sniffer){if(!auth)return $log.warn("Auth wasn't initialized"),null;!1===auth.config.reloadOnUserChange&&auth.addListener("userChange",(()=>{$injector.get("$route").reload()}));const authInitPromise=auth.init();return authInitPromise.then((function restoreLocation(restoreLocationURL){if(restoreLocationURL){const bases=document.getElementsByTagName("base");let baseURI=auth.config.redirectUri;if(bases.length>0&&(baseURI=bases[0].href),0===restoreLocationURL.indexOf(baseURI)){const $location=$injector.get("$location");let relativeURI=restoreLocationURL.substr(baseURI.length);$location.$$html5&&!$sniffer.history&&(relativeURI=relativeURI.replace(/^#\//,"")),$location.url(relativeURI).replace()}}}),(e=>{e.authRedirect||$log.error(e)})),{auth:auth,requestUser:auth.requestUser.bind(auth),clientId:auth.config.clientId,logout:auth.logout.bind(auth),promise:authInitPromise}}]}]),__webpack_exports__.Z=angularModule.name},"./src/global/url.ts":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{$h:function(){return fixUrl},EQ:function(){return encodeURL},YV:function(){return getAbsoluteBaseURL},ZK:function(){return joinBaseURLAndPath},dD:function(){return parseQueryString},gJ:function(){return isDataURI}});const ABSOLUTE_URL_PATTERN=/^[a-z]+:\/\//i;function getBaseURI(){const baseElement=document.getElementsByTagName("base")[0];return baseElement?baseElement.href:void 0}function getAbsoluteBaseURL(){const baseUrl=getBaseURI(),host=`${window.location.protocol}//${window.location.host}`;let uri;return uri=baseUrl?ABSOLUTE_URL_PATTERN.test(baseUrl)?baseUrl:host+baseUrl:host,uri}function fixUrl(url){let baseURIGetter=arguments.length>1&&void 0!==arguments[1]?arguments[1]:getBaseURI;if(-1===url.indexOf("http://")&&-1===url.indexOf("https://")&&0!==url.indexOf("/")){const baseUrl=baseURIGetter();if(baseUrl)return baseUrl+url}return url}function joinBaseURLAndPath(baseUrl,path){return baseUrl&&-1===path.indexOf("http://")&&-1===path.indexOf("https://")?baseUrl+path:path}function parseQueryString(queryString){if(null==queryString)return{};const queryParameterPairRE=/([^&;=]+)=?([^&;]*)/g,urlParams={};function decode(s){return decodeURIComponent(s.replace(/\+/g," "))}let matchedQueryPair;for(;null!=(matchedQueryPair=queryParameterPairRE.exec(queryString));)urlParams[decode(matchedQueryPair[1])]=decode(matchedQueryPair[2]);return urlParams}function customEncodeURIComponent(str){return encodeURIComponent(String(str)).replace(/%2C/g,",")}function encodeURL(url,params){const firstSeparator=-1===url.indexOf("?")?"?":"&";let k,res=url,i=0;for(k in params)params.hasOwnProperty(k)&&null!=params[k]&&(res+=(0==i++?firstSeparator:"&")+customEncodeURIComponent(k)+"="+customEncodeURIComponent(params[k]));return res}function isDataURI(uri){return 0===uri.indexOf("data:")}},"./src/i18n/i18n.ts":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{FC:function(){return getTranslations},l2:function(){return getTranslationsWithFallback},Yh:function(){return setTranslations},Iu:function(){return translate}});var messages_namespaceObject=JSON.parse('{"login":"Log in","logout":"Log out","loginTo":"Log in to {{serviceName}}","ok":"OK","cancel":"Cancel","tryAgainLabel":"Try again","postpone":"Postpone","youHaveLoggedInAs":"You have logged in as another user: {{userName}}","applyChange":"Apply change","backendIsNotAvailable":"Connection lost","checkAgain":"try again","nothingHappensLink":"Click here if nothing happens","errorMessage":"There may be a problem with your network connection. Make sure that you are online and","applyChangedUser":"Apply changed user","profile":"Profile","switchUser":"Switch user","addFirstDate":"Add first date","addSecondDate":"Add second date","addTime":"Add time","selectName":"Select {{name}}","setDate":"Set a date","setDateTime":"Set date and time","setPeriod":"Set a period","clear":"Clear input","gotIt":"Got it","dismiss":"Dismiss","perPage":"per page","firstPage":"First page","lastPage":"Last page","nextPage":"Next page","previousPage":"Previous","searchTitle":"Search","clearTitle":"Clear search input","userAgreement":"User Agreement","accept":"Accept","decline":"Decline","close":"Close","scrollToAccept":"View the entire agreement to continue","remindLater":"Remind me later","filterItems":"Filter items","selectOption":"Select an option","progress":"Progress","loading":"Loading...","noOptionsFound":"No options found","banned":"banned","online":"online","offline":"offline","copyToClipboard":"Copy email to clipboard","copiedToClipboard":"Email was copied to clipboard","copingToClipboardError":"Failed to copy to clipboard","unverified":"Unverified"}');let messages=messages_namespaceObject;const warned=new Set;function setTranslations(newMessages){messages=newMessages}function getTranslations(){return messages}function getTranslationsWithFallback(){return{...messages_namespaceObject,...messages}}function translate(key){var _messages$key;return key in messages||function warnMissedKeyOnce(key){warned.has(key)||(warned.add(key),console.warn(`Missing localisation for key "${key}"`))}(key),null!==(_messages$key=messages[key])&&void 0!==_messages$key?_messages$key:messages_namespaceObject[key]}},"./src/link/link.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{YL:function(){return setCompatibilityMode},g8:function(){return linkHOC}});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_4__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_global_memoize__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/global/memoize.ts"),_global_data_tests__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/global/data-tests.ts"),_clickableLink__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/link/clickableLink.tsx"),_link_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/link/link.css"),_link_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_link_css__WEBPACK_IMPORTED_MODULE_2__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}let isCompatibilityMode=!1;function setCompatibilityMode(isEnabled){isCompatibilityMode=isEnabled}const makeWrapText=(0,_global_memoize__WEBPACK_IMPORTED_MODULE_3__.Z)((innerClassName=>{function WrapText(_ref){let{className:className,children:children}=_ref;const classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_link_css__WEBPACK_IMPORTED_MODULE_2___default().inner,className,innerClassName);return react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{className:classes},children)}return WrapText.propTypes={className:prop_types__WEBPACK_IMPORTED_MODULE_4___default().string,children:prop_types__WEBPACK_IMPORTED_MODULE_4___default().node},(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(WrapText)}));function linkHOC(ComposedComponent){const isCustom="string"!=typeof ComposedComponent&&ComposedComponent!==_clickableLink__WEBPACK_IMPORTED_MODULE_5__.Z;return class Link extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{static propTypes={className:prop_types__WEBPACK_IMPORTED_MODULE_4___default().string,innerClassName:prop_types__WEBPACK_IMPORTED_MODULE_4___default().string,active:prop_types__WEBPACK_IMPORTED_MODULE_4___default().bool,inherit:prop_types__WEBPACK_IMPORTED_MODULE_4___default().bool,pseudo:prop_types__WEBPACK_IMPORTED_MODULE_4___default().bool,hover:prop_types__WEBPACK_IMPORTED_MODULE_4___default().bool,children:prop_types__WEBPACK_IMPORTED_MODULE_4___default().oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_4___default().node,prop_types__WEBPACK_IMPORTED_MODULE_4___default().func]),"data-test":prop_types__WEBPACK_IMPORTED_MODULE_4___default().string,href:prop_types__WEBPACK_IMPORTED_MODULE_4___default().string,onPlainLeftClick:prop_types__WEBPACK_IMPORTED_MODULE_4___default().func,onClick:prop_types__WEBPACK_IMPORTED_MODULE_4___default().func};getChildren(){const{children:children,innerClassName:innerClassName}=this.props,WrapText=makeWrapText(innerClassName);return"function"==typeof children?children(WrapText):react__WEBPACK_IMPORTED_MODULE_0__.createElement(WrapText,null,children)}render(){const{active:active,inherit:inherit,pseudo:pseudo,hover:hover,className:className,"data-test":dataTest,href:href,innerClassName:innerClassName,children:children,onPlainLeftClick:onPlainLeftClick,onClick:onClick,...restProps}=this.props,useButton=pseudo||!isCustom&&null==href,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_link_css__WEBPACK_IMPORTED_MODULE_2___default().link,className,{[_link_css__WEBPACK_IMPORTED_MODULE_2___default().active]:active,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().inherit]:inherit,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().hover]:hover,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().compatibilityUnderlineMode]:isCompatibilityMode,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().pseudo]:useButton,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().text]:"function"!=typeof children});let props=restProps;return isCustom&&!props.activeClassName&&(props={...props,activeClassName:_link_css__WEBPACK_IMPORTED_MODULE_2___default().active}),useButton?react__WEBPACK_IMPORTED_MODULE_0__.createElement("button",_extends({type:"button"},props,{className:classes,onClick:onClick||onPlainLeftClick,"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_6__.Z)("ring-link",dataTest)}),this.getChildren()):react__WEBPACK_IMPORTED_MODULE_0__.createElement(ComposedComponent,_extends({},props,{href:href,className:classes,onClick:onClick,onPlainLeftClick:onPlainLeftClick,"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_6__.Z)("ring-link",dataTest)}),this.getChildren())}}}__webpack_exports__.ZP=linkHOC(_clickableLink__WEBPACK_IMPORTED_MODULE_5__.Z)},"?4f7e":function(){}}]);