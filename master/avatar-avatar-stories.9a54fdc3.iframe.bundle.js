(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[4014],{"./src/avatar/avatar.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{avatar:()=>avatar,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _avatar__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/avatar/avatar.tsx"),_avatar_example_datauri__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/avatar/avatar-example-datauri.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Avatar",parameters:{notes:"Displays an avatar. In case of a loading error an empty square is displayed."}},avatar=()=>{function Example(){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{children:Object.entries(_avatar__WEBPACK_IMPORTED_MODULE_1__.o).map((([key,size])=>"number"==typeof size?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"avatar-demo",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_avatar__WEBPACK_IMPORTED_MODULE_1__.A,{size,url:_avatar_example_datauri__WEBPACK_IMPORTED_MODULE_2__.G}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_avatar__WEBPACK_IMPORTED_MODULE_1__.A,{size,username:"Jet Brains"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_avatar__WEBPACK_IMPORTED_MODULE_1__.A,{size,username:"👹🙀"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_avatar__WEBPACK_IMPORTED_MODULE_1__.A,{size,username:"Jet Brains",round:!0}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_avatar__WEBPACK_IMPORTED_MODULE_1__.A,{size})]},key):null))})}return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Example,{})};avatar.parameters={storyStyles:"\n<style>\n  .avatar-demo {\n    display: flex;\n    justify-content: space-between;\n    width: 320px;\n    margin-bottom: 16px;\n  }\n</style>"},avatar.parameters={...avatar.parameters,docs:{...avatar.parameters?.docs,source:{originalSource:'() => {\n  function Example() {\n    return <div>\n        {Object.entries(Size).map(([key, size]) => typeof size === \'number\' ? <div className="avatar-demo" key={key}>\n              <Avatar size={size} url={avatarDataUri} />\n              <Avatar size={size} username="Jet Brains" />\n              <Avatar size={size} username="👹🙀" />\n              <Avatar size={size} username="Jet Brains" round />\n              <Avatar size={size} />\n            </div> : null)}\n      </div>;\n  }\n  return <Example />;\n}',...avatar.parameters?.docs?.source}}}},"./src/avatar/avatar-example-datauri.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{G:()=>avatarDataUri});const avatarDataUri=`data:image/svg+xml,${encodeURIComponent('\n<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">\n    <defs>\n        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">\n            <stop stop-color="#D50F6B" offset="0"/>\n            <stop stop-color="#E73AE8" offset="1"/>\n        </linearGradient>\n    </defs>\n    <g>\n        <rect fill="url(#gradient)"\n              x="0" y="0" width="40" height="40"\n              rx="3" ry="3"/>\n        <text x="5" y="19"\n              font-family="Arial, Helvetica, sans-serif"\n              font-size="15px"\n              letter-spacing="1"\n              fill="#FFFFFF">\n            <tspan>JB</tspan>\n            <tspan x="6" y="28">_</tspan>\n        </text>\n    </g>\n</svg>\n')}`},"./src/avatar/avatar.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{o:()=>Size,A:()=>Avatar});var react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),global_url=__webpack_require__("./src/global/url.ts"),dom=__webpack_require__("./src/global/dom.ts"),avatar=__webpack_require__("./src/avatar/avatar.css"),avatar_default=__webpack_require__.n(avatar),get_uid=__webpack_require__("./src/global/get-uid.ts"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const colorPairs=[["#60A800","#D5CA00"],["#21D370","#03E9E1"],["#3BA1FF","#36E97D"],["#00C243","#00FFFF"],["#4BE098","#627FFF"],["#168BFA","#26F7C7"],["#9D4CFF","#39D3C3"],["#0A81F6","#0ACFF6"],["#765AF8","#5A91F8"],["#9E54FF","#0ACFF6"],["#B345F1","#669DFF"],["#765AF8","#C059EE"],["#9039D0","#C239D0"],["#9F2AFF","#FD56FD"],["#AB3AF2","#E40568"],["#9F2AFF","#E9A80B"],["#D50F6B","#E73AE8"],["#ED5502","#E73AE8"],["#ED358C","#DBED18"],["#ED358C","#F9902E"],["#FF7500","#FFCA00"]],Sizes={18:{radius:2,text:{x:9,y:13},fontSize:"11px",textAnchor:"middle"},24:{radius:3,text:{x:2,y:13},fontSize:"11px",underscore:{x:3,y:17}},32:{radius:3,text:{x:3,y:17},fontSize:"13px",letterSpacing:1,underscore:{x:4,y:22}},40:{radius:3,text:{x:5,y:19},fontSize:"15px",letterSpacing:1,underscore:{x:6,y:28}}},sizeKeys=Object.keys(Sizes).map(Number);function extractLetters(name){const names=name.split(/[\s._]+/).filter(Boolean).map((word=>Array.from(word)));return names.length>=2?names[0][0].toUpperCase()+names[1][0].toUpperCase():1===names.length?names[0].length>=2?names[0].slice(0,2).join("").toUpperCase():`${names[0][0].toUpperCase()}X`:"XX"}const BASE=32;function FallbackAvatar({username,size,round}){const hash=Math.abs(function hashCode(s){let h=0;for(let i=0;i<s.length;i++)h=Math.imul(BASE-1,h)+s.charCodeAt(i)|0;return h}(username.toLowerCase())),[fromColor,toColor]=colorPairs[hash%colorPairs.length],possibleSizeKeys=sizeKeys.filter((key=>key>=size)),sizeKey=possibleSizeKeys.length>0?Math.min(...possibleSizeKeys):Math.max(...sizeKeys),sizes=Sizes[sizeKey],radius=round?"50%":sizes.radius,gradientId=(0,react.useMemo)((()=>(0,get_uid.A)("gradient-")),[]);return(0,jsx_runtime.jsxs)("svg",{viewBox:`0 0 ${sizeKey} ${sizeKey}`,xmlns:"http://www.w3.org/2000/svg",children:[(0,jsx_runtime.jsx)("defs",{children:(0,jsx_runtime.jsxs)("linearGradient",{id:gradientId,x1:"0",y1:"0",x2:"0",y2:"1",children:[(0,jsx_runtime.jsx)("stop",{stopColor:fromColor,offset:"0"}),(0,jsx_runtime.jsx)("stop",{stopColor:toColor,offset:"1"})]})}),(0,jsx_runtime.jsxs)("g",{children:[(0,jsx_runtime.jsx)("rect",{fill:`url(#${gradientId})`,x:"0",y:"0",width:sizeKey,height:sizeKey,rx:radius,ry:radius}),(0,jsx_runtime.jsxs)("text",{x:sizes.text.x,y:sizes.text.y,fontFamily:"Arial, Helvetica, sans-serif",fontSize:sizes.fontSize,letterSpacing:sizes.letterSpacing,fill:"#FFFFFF",textAnchor:sizes.textAnchor,cursor:"default",children:[(0,jsx_runtime.jsx)("tspan",{children:extractLetters(username)}),sizes.underscore&&(0,jsx_runtime.jsx)("tspan",{x:sizes.underscore.x,y:sizes.underscore.y,children:"_"})]}),(0,jsx_runtime.jsx)("title",{children:username})]})]})}FallbackAvatar.__docgenInfo={description:"",methods:[],displayName:"FallbackAvatar",props:{username:{required:!0,tsType:{name:"string"},description:""},size:{required:!0,tsType:{name:"Size"},description:""},round:{required:!0,tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]},description:""}}};let Size=function(Size){return Size[Size.Size18=18]="Size18",Size[Size.Size20=20]="Size20",Size[Size.Size24=24]="Size24",Size[Size.Size28=28]="Size28",Size[Size.Size32=32]="Size32",Size[Size.Size40=40]="Size40",Size[Size.Size48=48]="Size48",Size[Size.Size56=56]="Size56",Size}({});class Avatar extends react.PureComponent{static defaultProps={dpr:(0,dom.sJ)(),size:Size.Size20,subavatarSize:Size.Size20/2,style:{}};state={errorUrl:""};handleError=()=>{this.setState({errorUrl:this.props.url})};handleSuccess=()=>{this.setState({errorUrl:""})};render(){const{size,url,dpr,style,round,subavatar,subavatarSize,username,skipParams,...restProps}=this.props,sizeString=`${size}px`,subavatarSizeString=`${subavatarSize}px`,borderRadius=size<=Size.Size18?"var(--ring-border-radius-small)":"var(--ring-border-radius)",styleObj={borderRadius:round?"50%":borderRadius,height:sizeString,width:sizeString,...style},styleObjGroup={borderRadius:"2px",height:subavatarSizeString,width:subavatarSizeString,...style};if(!url||this.state.errorUrl===url)return(0,jsx_runtime.jsx)("span",{...restProps,"data-test":"avatar",className:classnames_default()(avatar_default().avatar,this.props.className,{[avatar_default().empty]:null==username}),style:styleObj,children:null!=username&&(0,jsx_runtime.jsx)(FallbackAvatar,{size,round,username})});let src=url;if(!skipParams&&!(0,global_url.zL)(url)){const[urlStart,query]=url.split("?"),queryParams={...(0,global_url.JO)(query),dpr,size};src=(0,global_url.oZ)(urlStart,queryParams)}let subavatarSrc=null;if(subavatar&&!(0,global_url.zL)(subavatar)){const[urlStart,query]=subavatar.split("?"),queryParams={...(0,global_url.JO)(query),dpr,subavatarSizeString};return subavatarSrc=skipParams?subavatar:(0,global_url.oZ)(urlStart,queryParams),(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("img",{...restProps,onError:this.handleError,onLoad:this.handleSuccess,className:classnames_default()(avatar_default().avatar,this.props.className),style:styleObj,src,alt:"User avatar"}),(0,jsx_runtime.jsx)("img",{...restProps,"data-test":"avatar",onError:this.handleError,onLoad:this.handleSuccess,className:classnames_default()(avatar_default().subavatar),style:styleObjGroup,src:subavatarSrc,alt:"Subavatar"})]})}return(0,jsx_runtime.jsx)("img",{...restProps,"data-test":"avatar",onError:this.handleError,onLoad:this.handleSuccess,className:classnames_default()(avatar_default().avatar,this.props.className),style:styleObj,src,alt:"User avatar"})}}Avatar.__docgenInfo={description:"",methods:[{name:"handleError",docblock:null,modifiers:[],params:[],returns:null},{name:"handleSuccess",docblock:null,modifiers:[],params:[],returns:null}],displayName:"Avatar",props:{dpr:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"getPixelRatio()",computed:!0}},size:{required:!1,tsType:{name:"union",raw:"Size | number",elements:[{name:"Size"},{name:"number"}]},description:"",defaultValue:{value:"Size.Size20",computed:!0}},subavatarSize:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"Size.Size20 / 2",computed:!1}},url:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""},round:{required:!1,tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]},description:""},subavatar:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""},username:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""},skipParams:{required:!1,tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]},description:""},style:{defaultValue:{value:"{}",computed:!1},required:!1}},composes:["ImgHTMLAttributes"]}},"./src/global/url.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Dn:()=>fixUrl,JO:()=>parseQueryString,Km:()=>joinBaseURLAndPath,oZ:()=>encodeURL,qG:()=>getAbsoluteBaseURL,zL:()=>isDataURI});const ABSOLUTE_URL_PATTERN=/^[a-z]+:\/\//i;function getBaseURI(){const baseElement=document.getElementsByTagName("base")[0];return baseElement?baseElement.href:void 0}function getAbsoluteBaseURL(){const baseUrl=getBaseURI(),host=`${window.location.protocol}//${window.location.host}`;let uri;return uri=baseUrl?ABSOLUTE_URL_PATTERN.test(baseUrl)?baseUrl:host+baseUrl:host,uri}function fixUrl(url,baseURIGetter=getBaseURI){if(-1===url.indexOf("http://")&&-1===url.indexOf("https://")&&0!==url.indexOf("/")){const baseUrl=baseURIGetter();if(baseUrl)return baseUrl+url}return url}function joinBaseURLAndPath(baseUrl,path){return baseUrl&&-1===path.indexOf("http://")&&-1===path.indexOf("https://")?baseUrl+path:path}function parseQueryString(queryString){if(null==queryString)return{};const queryParameterPairRE=/([^&;=]+)=?([^&;]*)/g,urlParams={};function decode(s){return decodeURIComponent(s.replace(/\+/g," "))}let matchedQueryPair;for(;null!=(matchedQueryPair=queryParameterPairRE.exec(queryString));)urlParams[decode(matchedQueryPair[1])]=decode(matchedQueryPair[2]);return urlParams}function customEncodeURIComponent(str){return encodeURIComponent(String(str)).replace(/%2C/g,",").replace(/%24/g,"$")}function encodeURL(url,params){const firstSeparator=-1===url.indexOf("?")?"?":"&";let k,res=url,i=0;for(k in params)params.hasOwnProperty(k)&&null!=params[k]&&(res+=(0==i++?firstSeparator:"&")+customEncodeURIComponent(k)+"="+customEncodeURIComponent(params[k]));return res}function isDataURI(uri){return 0===uri.indexOf("data:")}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/avatar/avatar.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,'.avatar_a9b8 {\n  display: inline-block;\n  object-fit: cover;\n  object-position: center;\n\n  /* This is a "graceful degradation" fallback, while the real value is controlled by JS */\n\n  border-radius: var(--ring-border-radius);\n}\n\n.subavatar_a19e {\n  position: absolute;\n  top: 15px;\n  left: 27px;\n\n  border: 1px var(--ring-content-background-color) solid;\n}\n\n.empty_b9d2 {\n  display: inline-block;\n\n  box-sizing: border-box;\n\n  border: 1px solid var(--ring-borders-color);\n}\n',"",{version:3,sources:["webpack://./src/avatar/avatar.css"],names:[],mappings:"AAEA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,uBAAuB;;EAEvB,wFAAwF;;EAExF,wCAAwC;AAC1C;;AAEA;EACE,kBAAkB;EAClB,SAAS;EACT,UAAU;;EAEV,sDAAsD;AACxD;;AAEA;EACE,qBAAqB;;EAErB,sBAAsB;;EAEtB,2CAA2C;AAC7C",sourcesContent:['@import "../global/variables.css";\n\n.avatar {\n  display: inline-block;\n  object-fit: cover;\n  object-position: center;\n\n  /* This is a "graceful degradation" fallback, while the real value is controlled by JS */\n\n  border-radius: var(--ring-border-radius);\n}\n\n.subavatar {\n  position: absolute;\n  top: 15px;\n  left: 27px;\n\n  border: 1px var(--ring-content-background-color) solid;\n}\n\n.empty {\n  display: inline-block;\n\n  box-sizing: border-box;\n\n  border: 1px solid var(--ring-borders-color);\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={avatar:"avatar_a9b8",subavatar:"subavatar_a19e",empty:"empty_b9d2"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/avatar/avatar.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/avatar/avatar.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}}}]);