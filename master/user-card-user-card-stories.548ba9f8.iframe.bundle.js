"use strict";(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[4909],{"./.storybook/react-decorator.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_dom_client__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-dom/client.js"),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("@storybook/preview-api");const reactDecorator=(StoryFn,context)=>{const node=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useMemo)((()=>document.createElement("div")),[context.kind,context.name]),root=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useMemo)((()=>(0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(node)),[node]);return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useEffect)((()=>()=>root.unmount()),[root]),root.render(react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.StrictMode,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(StoryFn,null))),node},__WEBPACK_DEFAULT_EXPORT__=()=>reactDecorator},"./src/user-card/user-card.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__,hubUserCard:()=>hubUserCard,inline:()=>inline,smartTooltip:()=>smartTooltip});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./.storybook/react-decorator.tsx"),_storybook_hub_config__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./.storybook/hub-config.ts"),_auth_auth__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./src/auth/auth.ts"),_hub_source_hub_source_user__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./src/hub-source/hub-source__user.ts"),_avatar_avatar_example_datauri__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/avatar/avatar-example-datauri.tsx"),_badge_badge__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/badge/badge.tsx"),_user_card__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/user-card/card.tsx"),_user_card__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/user-card/tooltip.tsx"),_user_card__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/user-card/smart-user-card-tooltip.tsx");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/User Card",decorators:[(0,_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__.Z)()],parameters:{storySource:{source:"import React from 'react';\n\nimport reactDecorator from '../../.storybook/react-decorator';\nimport hubConfig from '../../.storybook/hub-config';\n\nimport Auth from '../auth/auth';\nimport {createHubUserCardSource} from '../hub-source/hub-source__user';\n\nimport {avatarDataUri} from '../avatar/avatar-example-datauri';\n\nimport Badge from '../badge/badge';\n\nimport {UserCard, UserCardTooltip, SmartUserCardTooltip} from './user-card';\n\nexport default {\n  title: 'Components/User Card',\n  decorators: [reactDecorator()],\n\n  parameters: {\n    notes: 'A component that displays user details.'\n  }\n};\n\nexport const inline = () => {\n  const user = {\n    login: 'testuser',\n    name: 'Test User',\n    email: 'testuser@mail.com',\n    avatarUrl: avatarDataUri,\n    href: `${hubConfig.serverUri}/users/0`\n  };\n\n  return (\n    <div>\n      <div>Inline user card:</div>\n      <UserCard user={user} data-test=\"user-card-inline\"/>\n\n      <UserCardTooltip user={user} info={<Badge gray>{'Reporter'}</Badge>}>\n        <span>Hover this text see card in tooltip mode</span>\n      </UserCardTooltip>\n    </div>\n  );\n};\n\ninline.storyName = 'inline';\n\nexport const smartTooltip = () => {\n  const user = {\n    login: 'testuser',\n    name: 'Test User',\n    email: 'testuser@mail.com',\n    avatarUrl: avatarDataUri,\n    href: `${hubConfig.serverUri}/users/0`,\n    banned: true,\n    online: false,\n    banReason: 'Bad guy: is accused of stealing potatoes!'\n  };\n\n  function loadUser() {\n    return new Promise(resolve => setTimeout(resolve, 10000)).then(() => user);\n  }\n\n  return (\n    <SmartUserCardTooltip userDataSource={loadUser}>\n      <span>Hover this text load user information</span>\n    </SmartUserCardTooltip>\n  );\n};\n\nsmartTooltip.storyName = 'smart tooltip';\nsmartTooltip.parameters = {hermione: {skip: true}};\n\nexport const hubUserCard = () => {\n  const auth = new Auth(hubConfig);\n\n  const waitForAuthAndGetUser = async () => {\n    await auth.init();\n    if (auth.user == null) {\n      return null;\n    }\n    const userSource = createHubUserCardSource(auth, auth.user.id);\n    return userSource();\n  };\n\n  return (\n    <SmartUserCardTooltip userDataSource={waitForAuthAndGetUser}>\n      <span>Hover this text load user information</span>\n    </SmartUserCardTooltip>\n  );\n};\n\nhubUserCard.storyName = 'hub user card';\nhubUserCard.parameters = {hermione: {skip: true}};\n",locationsMap:{inline:{startLoc:{col:22,line:24},endLoc:{col:1,line:43},startBody:{col:22,line:24},endBody:{col:1,line:43}},"smart-tooltip":{startLoc:{col:28,line:47},endLoc:{col:1,line:68},startBody:{col:28,line:47},endBody:{col:1,line:68}},"hub-user-card":{startLoc:{col:27,line:73},endLoc:{col:1,line:90},startBody:{col:27,line:73},endBody:{col:1,line:90}}}},notes:"A component that displays user details."}},inline=()=>{const user={login:"testuser",name:"Test User",email:"testuser@mail.com",avatarUrl:_avatar_avatar_example_datauri__WEBPACK_IMPORTED_MODULE_2__.x,href:`${_storybook_hub_config__WEBPACK_IMPORTED_MODULE_3__.Z.serverUri}/users/0`};return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,"Inline user card:"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_user_card__WEBPACK_IMPORTED_MODULE_4__.Z,{user,"data-test":"user-card-inline"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_user_card__WEBPACK_IMPORTED_MODULE_5__.Z,{user,info:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_badge_badge__WEBPACK_IMPORTED_MODULE_6__.Z,{gray:!0},"Reporter")},react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,"Hover this text see card in tooltip mode")))};inline.storyName="inline";const smartTooltip=()=>{const user={login:"testuser",name:"Test User",email:"testuser@mail.com",avatarUrl:_avatar_avatar_example_datauri__WEBPACK_IMPORTED_MODULE_2__.x,href:`${_storybook_hub_config__WEBPACK_IMPORTED_MODULE_3__.Z.serverUri}/users/0`,banned:!0,online:!1,banReason:"Bad guy: is accused of stealing potatoes!"};return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_user_card__WEBPACK_IMPORTED_MODULE_7__.Z,{userDataSource:function loadUser(){return new Promise((resolve=>setTimeout(resolve,1e4))).then((()=>user))}},react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,"Hover this text load user information"))};smartTooltip.storyName="smart tooltip",smartTooltip.parameters={hermione:{skip:!0}};const hubUserCard=()=>{const auth=new _auth_auth__WEBPACK_IMPORTED_MODULE_8__.ZP(_storybook_hub_config__WEBPACK_IMPORTED_MODULE_3__.Z);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_user_card__WEBPACK_IMPORTED_MODULE_7__.Z,{userDataSource:async()=>{if(await auth.init(),null==auth.user)return null;return(0,_hub_source_hub_source_user__WEBPACK_IMPORTED_MODULE_9__.B)(auth,auth.user.id)()}},react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,"Hover this text load user information"))};hubUserCard.storyName="hub user card",hubUserCard.parameters={hermione:{skip:!0}},inline.__docgenInfo={description:"",methods:[],displayName:"inline"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/user-card/user-card.stories.tsx"]={name:"inline",docgenInfo:inline.__docgenInfo,path:"src/user-card/user-card.stories.tsx"}),smartTooltip.__docgenInfo={description:"",methods:[],displayName:"smartTooltip"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/user-card/user-card.stories.tsx"]={name:"smartTooltip",docgenInfo:smartTooltip.__docgenInfo,path:"src/user-card/user-card.stories.tsx"}),hubUserCard.__docgenInfo={description:"",methods:[],displayName:"hubUserCard"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/user-card/user-card.stories.tsx"]={name:"hubUserCard",docgenInfo:hubUserCard.__docgenInfo,path:"src/user-card/user-card.stories.tsx"})},"./src/badge/badge.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>Badge});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_global_data_tests__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/global/data-tests.ts"),_badge_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/badge/badge.css"),_badge_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_badge_css__WEBPACK_IMPORTED_MODULE_2__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}class Badge extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{static propTypes={gray:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,valid:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,invalid:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,disabled:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,className:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string,children:prop_types__WEBPACK_IMPORTED_MODULE_3___default().node,"data-test":prop_types__WEBPACK_IMPORTED_MODULE_3___default().string};render(){const{gray,valid,invalid,disabled,className,children,"data-test":dataTest,...props}=this.props,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_badge_css__WEBPACK_IMPORTED_MODULE_2___default().badge,className,{[_badge_css__WEBPACK_IMPORTED_MODULE_2___default().gray]:gray,[_badge_css__WEBPACK_IMPORTED_MODULE_2___default().valid]:valid,[_badge_css__WEBPACK_IMPORTED_MODULE_2___default().invalid]:invalid,[_badge_css__WEBPACK_IMPORTED_MODULE_2___default().disabled]:disabled});return react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",_extends({},props,{"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_4__.Z)("ring-badge",dataTest),className:classes}),children)}}Badge.__docgenInfo={description:"@name Badge",methods:[],displayName:"Badge",props:{gray:{type:{name:"bool"},required:!1,description:"",tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]}},valid:{type:{name:"bool"},required:!1,description:"",tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]}},invalid:{type:{name:"bool"},required:!1,description:"",tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]}},disabled:{type:{name:"bool"},required:!1,description:"",tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]}},className:{type:{name:"string"},required:!1,description:""},children:{type:{name:"node"},required:!1,description:""},"data-test":{type:{name:"string"},required:!1,description:"",tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]}}},composes:["HTMLAttributes"]},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/badge/badge.tsx"]={name:"Badge",docgenInfo:Badge.__docgenInfo,path:"src/badge/badge.tsx"})}}]);