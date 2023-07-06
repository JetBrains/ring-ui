"use strict";(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[197],{"./.storybook/react-decorator.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_dom_client__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-dom/client.js"),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("@storybook/preview-api");const reactDecorator=(StoryFn,context)=>{const node=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useMemo)((()=>document.createElement("div")),[context.kind,context.name]),root=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useMemo)((()=>(0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(node)),[node]);return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useEffect)((()=>()=>root.unmount()),[root]),root.render(react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.StrictMode,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(StoryFn,null))),node},__WEBPACK_DEFAULT_EXPORT__=()=>reactDecorator},"./src/i18n/i18n.examples.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:()=>basic,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./.storybook/react-decorator.tsx"),_i18n__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/i18n/i18n.ts"),_i18n_context__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/i18n/i18n-context.tsx");const I18nTestComponent=props=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_i18n_context__WEBPACK_IMPORTED_MODULE_1__.O,{messages:props},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_i18n_context__WEBPACK_IMPORTED_MODULE_1__.d.Consumer,null,(_ref=>{let{messages,translate}=_ref;return Object.keys(messages).map((key=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{key},key,": ",translate(key))))}))),__WEBPACK_DEFAULT_EXPORT__={title:"Services/I18n",decorators:[(0,_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_2__.Z)()],parameters:{storySource:{source:"import React from 'react';\n\nimport {Story} from '@storybook/react';\n\n\nimport reactDecorator from '../../.storybook/react-decorator';\n\nimport {getTranslations, type Messages} from './i18n';\nimport {I18nContext, I18nContextHolder} from './i18n-context';\n\nconst I18nTestComponent: React.FC<Messages> = props => (\n  <I18nContextHolder messages={props}>\n    <I18nContext.Consumer>\n      {({messages, translate}) => (\n        Object.keys(messages).map(key => (\n          <div key={key}>{key}: {translate(key as keyof Messages)}</div>\n        ))\n      )}\n    </I18nContext.Consumer>\n  </I18nContextHolder>\n);\n\nexport default {\n  title: 'Services/I18n',\n  decorators: [reactDecorator()],\n\n  parameters: {\n    component: I18nTestComponent,\n    framework: 'react'\n  },\n  args: {\n    ...getTranslations()\n  }\n};\n\nexport const basic: Story<Messages> = args => <I18nTestComponent {...args}/>;\n\nbasic.storyName = 'basic';\nbasic.parameters = {hermione: {skip: true}};\n",locationsMap:{basic:{startLoc:{col:38,line:36},endLoc:{col:76,line:36},startBody:{col:38,line:36},endBody:{col:76,line:36}}}},component:I18nTestComponent,framework:"react"},args:{...(0,_i18n__WEBPACK_IMPORTED_MODULE_3__.FC)()}},basic=args=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(I18nTestComponent,args);basic.storyName="basic",basic.parameters={hermione:{skip:!0}},basic.__docgenInfo={description:"",methods:[],displayName:"basic"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/i18n/i18n.examples.tsx"]={name:"basic",docgenInfo:basic.__docgenInfo,path:"src/i18n/i18n.examples.tsx"})},"./src/i18n/i18n-context.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{O:()=>I18nContextHolder,d:()=>I18nContext});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_i18n__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/i18n/i18n.ts");const I18nContext=react__WEBPACK_IMPORTED_MODULE_0__.createContext({messages:(0,_i18n__WEBPACK_IMPORTED_MODULE_1__.FC)(),translate:_i18n__WEBPACK_IMPORTED_MODULE_1__.Iu}),I18nContextHolder=_ref=>{let{children,messages}=_ref;return(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{(0,_i18n__WEBPACK_IMPORTED_MODULE_1__.Yh)(messages)}),[messages]),react__WEBPACK_IMPORTED_MODULE_0__.createElement(I18nContext.Provider,{value:{messages,translate:_i18n__WEBPACK_IMPORTED_MODULE_1__.Iu}},children)};I18nContextHolder.__docgenInfo={description:"",methods:[],displayName:"I18nContextHolder"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/i18n/i18n-context.tsx"]={name:"I18nContextHolder",docgenInfo:I18nContextHolder.__docgenInfo,path:"src/i18n/i18n-context.tsx"})},"./src/i18n/i18n.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{FC:()=>getTranslations,l2:()=>getTranslationsWithFallback,Yh:()=>setTranslations,Iu:()=>translate});const messages_namespaceObject=JSON.parse('{"login":"Log in","logout":"Log out","loginTo":"Log in to {{serviceName}}","ok":"OK","cancel":"Cancel","tryAgainLabel":"Try again","postpone":"Postpone","youHaveLoggedInAs":"You have logged in as another user: {{userName}}","applyChange":"Apply change","backendIsNotAvailable":"Connection lost","checkAgain":"try again","nothingHappensLink":"Click here if nothing happens","errorMessage":"There may be a problem with your network connection. Make sure that you are online and","applyChangedUser":"Apply changed user","profile":"Profile","switchUser":"Switch user","addFirstDate":"Add first date","addSecondDate":"Add second date","addTime":"Add time","selectName":"Select {{name}}","setDate":"Set a date","setDateTime":"Set date and time","setPeriod":"Set a period","clear":"Clear input","gotIt":"Got it","dismiss":"Dismiss","perPage":"per page","firstPage":"First page","lastPage":"Last page","nextPage":"Next page","previousPage":"Previous","searchTitle":"Search","clearTitle":"Clear search input","userAgreement":"User Agreement","accept":"Accept","decline":"Decline","close":"Close","scrollToAccept":"View the entire agreement to continue","remindLater":"Remind me later","filterItems":"Filter items","selectOption":"Select an option","progress":"Progress","loading":"Loading...","noOptionsFound":"No options found","banned":"banned","online":"online","offline":"offline","copyToClipboard":"Copy email to clipboard","copiedToClipboard":"Email was copied to clipboard","copingToClipboardError":"Failed to copy to clipboard","unverified":"Unverified"}');let messages=messages_namespaceObject;const warned=new Set;function setTranslations(newMessages){messages=newMessages}function getTranslations(){return messages}function getTranslationsWithFallback(){return{...messages_namespaceObject,...messages}}function translate(key){var _messages$key;return key in messages||function warnMissedKeyOnce(key){warned.has(key)||(warned.add(key),console.warn(`Missing localisation for key "${key}"`))}(key),null!==(_messages$key=messages[key])&&void 0!==_messages$key?_messages$key:messages_namespaceObject[key]}}}]);