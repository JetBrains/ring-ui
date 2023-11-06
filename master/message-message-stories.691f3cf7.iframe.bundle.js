(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[3249],{"./node_modules/@jetbrains/icons/chevron-10px.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><g><polygon points="5 7.99 1.5 4.5 2.5 3.5 5 6.01 7.5 3.5 8.49 4.5 5 7.99"/></g></svg>'},"./node_modules/@jetbrains/icons/gift.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g><path d="M3,15H7.3V9H3ZM9.79,5a2.5,2.5,0,0,0,0-5A2.48,2.48,0,0,0,8,.76,2.48,2.48,0,0,0,6.21,0a2.5,2.5,0,0,0,0,5H2V8H7.3V5H8.7V8H14V5ZM7.29,2.5V3.6H6.21A1.1,1.1,0,1,1,7.3,2.46S7.29,2.49,7.29,2.5Zm1.41,0A1.1,1.1,0,1,1,9.79,3.6H8.71V2.5S8.7,2.47,8.7,2.46ZM8.7,15H13V9H8.7Z"/></g></svg>'},"./node_modules/@jetbrains/icons/search.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g><path d="M14.64,13.36,10.13,8.85A4.94,4.94,0,0,0,11,6a5,5,0,1,0-2.17,4.12l4.51,4.51ZM2.42,6A3.6,3.6,0,1,1,6,9.61,3.6,3.6,0,0,1,2.42,6Z"/></g></svg>'},"./.storybook/react-decorator.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_dom_client__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-dom/client.js"),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("@storybook/preview-api");const reactDecorator=(StoryFn,context)=>{const node=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useMemo)((()=>document.createElement("div")),[context.kind,context.name]),root=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useMemo)((()=>(0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(node)),[node]);return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useEffect)((()=>()=>root.unmount()),[root]),root.render(react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.StrictMode,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(StoryFn,null))),node},__WEBPACK_DEFAULT_EXPORT__=()=>reactDecorator},"./src/message/message.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:()=>basic,default:()=>message_stories,light:()=>light,wishNarrowAnchor:()=>wishNarrowAnchor,withOnDissmiss:()=>withOnDissmiss});var react=__webpack_require__("./node_modules/react/index.js"),search=__webpack_require__("./node_modules/@jetbrains/icons/search.js"),search_default=__webpack_require__.n(search),react_decorator=__webpack_require__("./.storybook/react-decorator.tsx"),popup=__webpack_require__("./src/popup/popup.tsx"),icon_icon=__webpack_require__("./src/icon/icon.tsx"),global_theme=__webpack_require__("./src/global/theme.tsx"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),gift=__webpack_require__("./node_modules/@jetbrains/icons/gift.js"),gift_default=__webpack_require__.n(gift),popup_consts=__webpack_require__("./src/popup/popup.consts.ts"),button_button=__webpack_require__("./src/button/button.tsx"),i18n_context=__webpack_require__("./src/i18n/i18n-context.tsx"),variables_dark=__webpack_require__("./src/global/variables_dark.css"),variables_dark_default=__webpack_require__.n(variables_dark),message=__webpack_require__("./src/message/message.css"),message_default=__webpack_require__.n(message);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}class Message extends react.Component{static defaultProps={icon:gift_default(),directions:[popup_consts.Directions.TOP_RIGHT,popup_consts.Directions.TOP_LEFT,popup_consts.Directions.TOP_CENTER,popup_consts.Directions.BOTTOM_RIGHT,popup_consts.Directions.BOTTOM_LEFT,popup_consts.Directions.BOTTOM_CENTER,popup_consts.Directions.RIGHT_TOP,popup_consts.Directions.RIGHT_BOTTOM,popup_consts.Directions.RIGHT_CENTER,popup_consts.Directions.LEFT_TOP,popup_consts.Directions.LEFT_BOTTOM,popup_consts.Directions.LEFT_CENTER],theme:global_theme.ZP.DARK};state={};static Directions=popup_consts.Directions;static PopupProps=popup.default.PopupProps;_onDirectionChange=direction=>this.setState({direction});popup;node;popupRef=el=>{this.popup=el,this.node=this.popup?.node};getTailOffset(){const{popupProps}=this.props;if(null!=this.props.tailOffset)return this.props.tailOffset;const anchor=popupProps?.anchorElement||this.popup?.parent;if(!anchor)return 32;const offset=Math.floor(anchor.offsetWidth/2),isOpenedToRight=null!=this.state.direction&&[popup_consts.Directions.TOP_RIGHT,popup_consts.Directions.BOTTOM_RIGHT].includes(this.state.direction);return popupProps?.left&&isOpenedToRight?offset-popupProps?.left:offset}render(){const{children,className,tailClassName,title,icon,popupProps,buttonProps,onClose,onDismiss,translations,theme}=this.props,classes=classnames_default()(message_default().message,className,{[variables_dark_default().dark]:theme===global_theme.ZP.DARK}),tailClasses=classnames_default()(message_default().tail,tailClassName),popupDirections=this.props.direction?[this.props.direction]:this.props.directions,{direction}=this.state;return react.createElement(i18n_context.d.Consumer,null,(_ref=>{let{translate}=_ref;return react.createElement(global_theme.bG,{theme},(themeClasses=>{var _translations$gotIt,_translations$dismiss,offset;return react.createElement(popup.default,_extends({ref:this.popupRef,hidden:!1,directions:popupDirections,className:classnames_default()(classes,themeClasses),offset:16,onDirectionChange:this._onDirectionChange},popupProps),react.createElement(global_theme.f6,{theme,passToPopups:!0},direction&&react.createElement("div",{className:tailClasses,style:(offset=this.getTailOffset(),{[popup_consts.Directions.BOTTOM_RIGHT]:{top:0,left:offset+8,transform:"rotate(135deg)"},[popup_consts.Directions.BOTTOM_LEFT]:{top:0,right:offset-8-11,transform:"rotate(135deg)"},[popup_consts.Directions.BOTTOM_CENTER]:{top:0,left:offset+8,transform:"rotate(135deg)"},[popup_consts.Directions.TOP_RIGHT]:{bottom:-11,left:offset-8,transform:"rotate(-45deg)"},[popup_consts.Directions.TOP_LEFT]:{bottom:-11,right:offset+8-11,transform:"rotate(-45deg)"},[popup_consts.Directions.TOP_CENTER]:{bottom:-11,left:offset-8,transform:"rotate(-45deg)"},[popup_consts.Directions.RIGHT_TOP]:{bottom:offset+8-11,left:0,transform:"rotate(45deg)"},[popup_consts.Directions.RIGHT_BOTTOM]:{top:offset-8,left:0,transform:"rotate(45deg)"},[popup_consts.Directions.RIGHT_CENTER]:{top:offset-8,left:0,transform:"rotate(45deg)"},[popup_consts.Directions.LEFT_TOP]:{bottom:offset-8-11,right:-11,transform:"rotate(-135deg)"},[popup_consts.Directions.LEFT_BOTTOM]:{top:offset+8,right:-11,transform:"rotate(-135deg)"},[popup_consts.Directions.LEFT_CENTER]:{top:offset+8,right:-11,transform:"rotate(-135deg)"}})[direction]}),icon&&react.createElement(icon_icon.ZP,{className:message_default().icon,glyph:icon}),title&&react.createElement("h1",{"data-test":"rgMessageTitle",className:message_default().title},title),children&&react.createElement("div",{className:message_default().description},children),(onClose||buttonProps)&&react.createElement(button_button.ZP,_extends({className:message_default().button,onClick:onClose,primary:!0},buttonProps),null!==(_translations$gotIt=translations?.gotIt)&&void 0!==_translations$gotIt?_translations$gotIt:translate("gotIt")),onDismiss&&react.createElement(button_button.ZP,{onClick:onDismiss,text:!0},null!==(_translations$dismiss=translations?.dismiss)&&void 0!==_translations$dismiss?_translations$dismiss:translate("dismiss"))))}))}))}}Message.propTypes={children:prop_types_default().node,className:prop_types_default().string,tailClassName:prop_types_default().string,title:prop_types_default().string,icon:prop_types_default().oneOfType([prop_types_default().string,prop_types_default().elementType]),directions:prop_types_default().arrayOf(prop_types_default().string),direction:prop_types_default().string,popupProps:prop_types_default().object,buttonProps:prop_types_default().object,tailOffset:prop_types_default().number,onClose:prop_types_default().func,onDismiss:prop_types_default().func,translations:prop_types_default().object},Message.__docgenInfo={description:"Displays a popup containing a message.",methods:[{name:"popupRef",docblock:null,modifiers:[],params:[{name:"el",type:{name:"union",raw:"Popup | null",elements:[{name:"Popup"},{name:"null"}]}}],returns:null},{name:"getTailOffset",docblock:null,modifiers:[],params:[],returns:null}],displayName:"Message",props:{icon:{defaultValue:{value:"gift",computed:!0},required:!1,tsType:{name:"union",raw:"string | IconType | null",elements:[{name:"string"},{name:"IconType"},{name:"null"}]},description:""},directions:{defaultValue:{value:"[\n  Directions.TOP_RIGHT, Directions.TOP_LEFT, Directions.TOP_CENTER,\n  Directions.BOTTOM_RIGHT, Directions.BOTTOM_LEFT, Directions.BOTTOM_CENTER,\n  Directions.RIGHT_TOP, Directions.RIGHT_BOTTOM, Directions.RIGHT_CENTER,\n  Directions.LEFT_TOP, Directions.LEFT_BOTTOM, Directions.LEFT_CENTER\n]",computed:!1},required:!1,tsType:{name:"unknown"},description:""},theme:{defaultValue:{value:"Theme.DARK",computed:!0},required:!1,tsType:{name:"Theme"},description:""},translations:{required:!1,tsType:{name:"union",raw:"MessageTranslations | null | undefined",elements:[{name:"MessageTranslations"},{name:"null"},{name:"undefined"}]},description:""},title:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""},tailClassName:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""},direction:{required:!1,tsType:{name:"union",raw:"Directions | null | undefined",elements:[{name:"Directions"},{name:"null"},{name:"undefined"}]},description:""},popupProps:{required:!1,tsType:{name:"union",raw:"Partial<PopupAttrs> | null | undefined",elements:[{name:"Partial",elements:[{name:"PopupAttrs"}],raw:"Partial<PopupAttrs>"},{name:"null"},{name:"undefined"}]},description:""},buttonProps:{required:!1,tsType:{name:"union",raw:"ButtonAttrs | null | undefined",elements:[{name:"ButtonAttrs"},{name:"null"},{name:"undefined"}]},description:""},tailOffset:{required:!1,tsType:{name:"union",raw:"number | null | undefined",elements:[{name:"number"},{name:"null"},{name:"undefined"}]},description:""},onClose:{required:!1,tsType:{name:"union",raw:"(() => void) | undefined",elements:[{name:"unknown"},{name:"undefined"}]},description:""},onDismiss:{required:!1,tsType:{name:"union",raw:"(() => void) | null | undefined",elements:[{name:"unknown"},{name:"null"},{name:"undefined"}]},description:""}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/message/message.tsx"]={name:"Message",docgenInfo:Message.__docgenInfo,path:"src/message/message.tsx"});const{Directions}=popup.default.PopupProps,message_stories={title:"Components/Message",decorators:[(0,react_decorator.Z)()],parameters:{storySource:{source:"import React from 'react';\nimport searchIcon from '@jetbrains/icons/search';\n\nimport {Story} from '@storybook/react';\n\nimport reactDecorator from '../../.storybook/react-decorator';\n\nimport Popup from '../popup/popup';\nimport Icon from '../icon/icon';\n\nimport Theme from '../global/theme';\n\nimport Message, {MessageAttrs} from './message';\n\nconst {Directions} = Popup.PopupProps;\n\nexport default {\n  title: 'Components/Message',\n  decorators: [reactDecorator()],\n\n  parameters: {\n    component: Message,\n    framework: 'react'\n  },\n  args: {\n    title: 'This is title',\n    direction: Directions.TOP_RIGHT,\n    children: 'This is long long long long long long long long long long long long long long long long long long description'\n  }\n};\n\nexport const basic: Story<MessageAttrs> = args => (\n  <div style={{padding: 200}} id=\"message-example\">\n    <span>\n      Anchor\n      <Message {...args}/>\n    </span>\n  </div>\n);\n\nbasic.storyName = 'basic';\nbasic.args = {\n  tailOffset: 32,\n  onClose: () => {}\n};\n\nexport const light: Story<MessageAttrs> = args => (\n  <div style={{padding: 200}} id=\"message-example\">\n    <span>\n      Anchor\n      <Message {...args}/>\n    </span>\n  </div>\n);\nlight.args = {\n  theme: Theme.LIGHT,\n  onClose: () => {},\n  onDismiss: () => {}\n};\n\nexport const withOnDissmiss: Story<MessageAttrs> = args => (\n  <div style={{padding: 200}} id=\"message-example\">\n    <span>\n      Anchor\n      <Message {...args}/>\n    </span>\n  </div>\n);\n\nwithOnDissmiss.storyName = 'with onDissmiss';\nwithOnDissmiss.args = {\n  tailOffset: 32,\n  onClose: () => {},\n  onDismiss: () => {}\n};\n\nexport const wishNarrowAnchor: Story<MessageAttrs> = args => (\n  <div style={{padding: 200}}>\n    <span>\n      <Icon glyph={searchIcon}/>\n      <Message {...args}/>\n    </span>\n  </div>\n);\n\nwishNarrowAnchor.storyName = 'with narrow anchor';\nwishNarrowAnchor.args = {\n  popupProps: {left: -8}\n};\n",locationsMap:{basic:{startLoc:{col:42,line:32},endLoc:{col:1,line:39},startBody:{col:42,line:32},endBody:{col:1,line:39}},light:{startLoc:{col:42,line:47},endLoc:{col:1,line:54},startBody:{col:42,line:47},endBody:{col:1,line:54}},"with-on-dissmiss":{startLoc:{col:51,line:61},endLoc:{col:1,line:68},startBody:{col:51,line:61},endBody:{col:1,line:68}},"wish-narrow-anchor":{startLoc:{col:53,line:77},endLoc:{col:1,line:84},startBody:{col:53,line:77},endBody:{col:1,line:84}}}},component:Message,framework:"react"},args:{title:"This is title",direction:Directions.TOP_RIGHT,children:"This is long long long long long long long long long long long long long long long long long long description"}},basic=args=>react.createElement("div",{style:{padding:200},id:"message-example"},react.createElement("span",null,"Anchor",react.createElement(Message,args)));basic.storyName="basic",basic.args={tailOffset:32,onClose:()=>{}};const light=args=>react.createElement("div",{style:{padding:200},id:"message-example"},react.createElement("span",null,"Anchor",react.createElement(Message,args)));light.args={theme:global_theme.ZP.LIGHT,onClose:()=>{},onDismiss:()=>{}};const withOnDissmiss=args=>react.createElement("div",{style:{padding:200},id:"message-example"},react.createElement("span",null,"Anchor",react.createElement(Message,args)));withOnDissmiss.storyName="with onDissmiss",withOnDissmiss.args={tailOffset:32,onClose:()=>{},onDismiss:()=>{}};const wishNarrowAnchor=args=>react.createElement("div",{style:{padding:200}},react.createElement("span",null,react.createElement(icon_icon.ZP,{glyph:search_default()}),react.createElement(Message,args)));wishNarrowAnchor.storyName="with narrow anchor",wishNarrowAnchor.args={popupProps:{left:-8}},basic.__docgenInfo={description:"",methods:[],displayName:"basic"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/message/message.stories.tsx"]={name:"basic",docgenInfo:basic.__docgenInfo,path:"src/message/message.stories.tsx"}),light.__docgenInfo={description:"",methods:[],displayName:"light"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/message/message.stories.tsx"]={name:"light",docgenInfo:light.__docgenInfo,path:"src/message/message.stories.tsx"}),withOnDissmiss.__docgenInfo={description:"",methods:[],displayName:"withOnDissmiss"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/message/message.stories.tsx"]={name:"withOnDissmiss",docgenInfo:withOnDissmiss.__docgenInfo,path:"src/message/message.stories.tsx"}),wishNarrowAnchor.__docgenInfo={description:"",methods:[],displayName:"wishNarrowAnchor"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/message/message.stories.tsx"]={name:"wishNarrowAnchor",docgenInfo:wishNarrowAnchor.__docgenInfo,path:"src/message/message.stories.tsx"})},"./src/i18n/i18n-context.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{O:()=>I18nContextHolder,d:()=>I18nContext});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_i18n__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/i18n/i18n.ts");const I18nContext=react__WEBPACK_IMPORTED_MODULE_0__.createContext({messages:(0,_i18n__WEBPACK_IMPORTED_MODULE_1__.FC)(),translate:_i18n__WEBPACK_IMPORTED_MODULE_1__.Iu}),I18nContextHolder=_ref=>{let{children,messages}=_ref;return(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{(0,_i18n__WEBPACK_IMPORTED_MODULE_1__.Yh)(messages)}),[messages]),react__WEBPACK_IMPORTED_MODULE_0__.createElement(I18nContext.Provider,{value:{messages,translate:_i18n__WEBPACK_IMPORTED_MODULE_1__.Iu}},children)};I18nContextHolder.__docgenInfo={description:"",methods:[],displayName:"I18nContextHolder"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/i18n/i18n-context.tsx"]={name:"I18nContextHolder",docgenInfo:I18nContextHolder.__docgenInfo,path:"src/i18n/i18n-context.tsx"})},"./src/i18n/i18n.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{FC:()=>getTranslations,l2:()=>getTranslationsWithFallback,Yh:()=>setTranslations,Iu:()=>translate});const messages_namespaceObject=JSON.parse('{"login":"Log in","logout":"Log out","loginTo":"Log in to {{serviceName}}","ok":"OK","cancel":"Cancel","tryAgainLabel":"Try again","postpone":"Postpone","youHaveLoggedInAs":"You have logged in as another user: {{userName}}","applyChange":"Apply change","backendIsNotAvailable":"Connection lost","checkAgain":"try again","nothingHappensLink":"Click here if nothing happens","errorMessage":"There may be a problem with your network connection. Make sure that you are online and","applyChangedUser":"Apply changed user","profile":"Profile","switchUser":"Switch user","addFirstDate":"Add first date","addSecondDate":"Add second date","addTime":"Add time","selectName":"Select {{name}}","setDate":"Set a date","setDateTime":"Set date and time","setPeriod":"Set a period","clear":"Clear input","gotIt":"Got it","dismiss":"Dismiss","perPage":"per page","firstPage":"First page","lastPage":"Last page","nextPage":"Next page","previousPage":"Previous","searchTitle":"Search","clearTitle":"Clear search input","userAgreement":"User Agreement","accept":"Accept","decline":"Decline","close":"Close","scrollToAccept":"View the entire agreement to continue","remindLater":"Remind me later","filterItems":"Filter items","selectOption":"Select an option","progress":"Progress","loading":"Loading...","noOptionsFound":"No options found","banned":"banned","online":"online","offline":"offline","copyToClipboard":"Copy email to clipboard","copiedToClipboard":"Email was copied to clipboard","copingToClipboardError":"Failed to copy to clipboard","unverified":"Unverified"}');let messages=messages_namespaceObject;const warned=new Set;function setTranslations(newMessages){messages=newMessages}function getTranslations(){return messages}function getTranslationsWithFallback(){return{...messages_namespaceObject,...messages}}function translate(key){var _messages$key;return key in messages||function warnMissedKeyOnce(key){warned.has(key)||(warned.add(key),console.warn(`Missing localisation for key "${key}"`))}(key),null!==(_messages$key=messages[key])&&void 0!==_messages$key?_messages$key:messages_namespaceObject[key]}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/message/message.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/global/global.css"),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__.default),___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default,"",!0),___CSS_LOADER_EXPORT___.push([module.id,".container_ccd4 {\n  display: inline;\n}\n\n.message_d038 {\n  overflow: visible;\n\n  max-width: 320px;\n\n  padding: 12px 12px 16px 40px;\n\n  text-align: left;\n\n  color: var(--ring-active-text-color);\n\n  background-color: var(--ring-popup-background-color);\n}\n\n.icon_b1bb {\n  position: absolute;\n  top: 10px;\n  left: 12px;\n}\n\n.title_dfb2 {\n\n  margin: 0;\n\n  font-weight: normal;\n}\n\n.description_d2ac {\n  margin: 4px 0 0;\n\n  color: var(--ring-text-color);\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: var(--ring-line-height-lowest);\n}\n\n.button_df64 {\n  margin-top: 12px;\n}\n\n.tail_df54 {\n  position: absolute;\n\n  box-sizing: border-box;\n  width: 11px;\n  height: 11px;\n\n  transform-origin: 0 0;\n\n  border: 1px solid;\n  border-color: transparent transparent var(--ring-popup-border-color) var(--ring-popup-border-color);\n\n  background-color: var(--ring-popup-background-color);\n}\n","",{version:3,sources:["webpack://./src/message/message.css"],names:[],mappings:"AAKA;EACE,eAAe;AACjB;;AAEA;EACE,iBAAiB;;EAEjB,gBAA0B;;EAE1B,4BAAsD;;EAEtD,gBAAgB;;EAEhB,oCAAoC;;EAEpC,oDAAoD;AACtD;;AAEA;EACE,kBAAkB;EAClB,SAAS;EACT,UAAa;AACf;;AAEA;;EAGE,SAAS;;EAET,mBAAmB;AACrB;;AAEA;EACE,eAA0B;;EAE1B,6BAA6B;;EAE7B,wCAAwC;EACxC,2CAA2C;AAC7C;;AAEA;EACE,gBAAmB;AACrB;;AAEA;EACE,kBAAkB;;EAElB,sBAAsB;EACtB,WAAW;EACX,YAAY;;EAEZ,qBAAqB;;EAErB,iBAAiB;EACjB,mGAAmG;;EAEnG,oDAAoD;AACtD",sourcesContent:['@import "../global/variables.css";\n\n@value unit from "../global/global.css";\n@value padding: calc(unit * 1.5);\n\n.container {\n  display: inline;\n}\n\n.message {\n  overflow: visible;\n\n  max-width: calc(unit * 40);\n\n  padding: padding padding calc(unit * 2) calc(unit * 5);\n\n  text-align: left;\n\n  color: var(--ring-active-text-color);\n\n  background-color: var(--ring-popup-background-color);\n}\n\n.icon {\n  position: absolute;\n  top: 10px;\n  left: padding;\n}\n\n.title {\n  composes: font-lower from "../global/global.css";\n\n  margin: 0;\n\n  font-weight: normal;\n}\n\n.description {\n  margin: calc(unit / 2) 0 0;\n\n  color: var(--ring-text-color);\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: var(--ring-line-height-lowest);\n}\n\n.button {\n  margin-top: padding;\n}\n\n.tail {\n  position: absolute;\n\n  box-sizing: border-box;\n  width: 11px;\n  height: 11px;\n\n  transform-origin: 0 0;\n\n  border: 1px solid;\n  border-color: transparent transparent var(--ring-popup-border-color) var(--ring-popup-border-color);\n\n  background-color: var(--ring-popup-background-color);\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={unit:`${_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.unit}`,padding:"12px",container:"container_ccd4",message:"message_d038",icon:"icon_b1bb",title:`title_dfb2 ${_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default.locals["font-lower"]}`,description:"description_d2ac",button:"button_df64",tail:"tail_df54"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/message/message.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/message/message.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./node_modules/util-deprecate/browser.js":(module,__unused_webpack_exports,__webpack_require__)=>{function config(name){try{if(!__webpack_require__.g.localStorage)return!1}catch(_){return!1}var val=__webpack_require__.g.localStorage[name];return null!=val&&"true"===String(val).toLowerCase()}module.exports=function deprecate(fn,msg){if(config("noDeprecation"))return fn;var warned=!1;return function deprecated(){if(!warned){if(config("throwDeprecation"))throw new Error(msg);config("traceDeprecation")?console.trace(msg):console.warn(msg),warned=!0}return fn.apply(this,arguments)}}}}]);