"use strict";(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[7881],{"./.storybook/react-decorator.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("@storybook/preview-api"),_src_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/global/react-render-adapter.ts");const reactDecorator=(StoryFn,context)=>{const node=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useMemo)((()=>document.createElement("div")),[context.kind,context.name]);return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>()=>(0,_src_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_2__.uy)(node)),[node]),(0,_src_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_2__.sY)(react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.StrictMode,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(StoryFn,null)),node),node};__webpack_exports__.Z=()=>reactDecorator},"./src/footer/footer.examples.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:function(){return basic}});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./.storybook/react-decorator.tsx"),_footer__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/footer/footer.tsx");__webpack_exports__.default={title:"Components/Footer",decorators:[(0,_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__.Z)()],parameters:{storySource:{source:"import React from 'react';\n\nimport reactDecorator from '../../.storybook/react-decorator';\n\nimport Footer from './footer';\n\nexport default {\n  title: 'Components/Footer',\n  decorators: [reactDecorator()],\n\n  parameters: {\n    notes: `\nDisplays a configurable page footer.\n\nA footer consists of three sections, each optional:\n\n- left\n- center\n- right\n    `,\n    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/5b2a6042114b24a11a8ac153'\n  }\n};\n\nexport const basic = () => (\n  <Footer\n    className=\"stuff\"\n    left={[\n      [\n        {\n          url: 'http://www.jetbrains.com/teamcity/?fromserver',\n          label: 'TeamCity'\n        },\n        ' by JetBrains'\n      ],\n      'Enterprise 8.0.2 EAP (build 27448)'\n    ]}\n    center={[\n      [{copyright: 2000, label: ' JetBrains'}],\n      {\n        url: 'https://teamcity.jetbrains.com/showAgreement.html',\n        label: 'License agreement',\n        title: 'read me!',\n        target: '_blank'\n      }\n    ]}\n    right={[\n      {\n        url:\n          'http://www.jetbrains.com/teamcity/feedback?source=footer&version=8.0.3%20(build%2027531)&build=27531&mode=ent',\n        label: 'Feedback'\n      }\n    ]}\n  />\n);\n\nbasic.storyName = 'Footer';\n",locationsMap:{basic:{startLoc:{col:21,line:25},endLoc:{col:1,line:55},startBody:{col:21,line:25},endBody:{col:1,line:55}}}},notes:"\nDisplays a configurable page footer.\n\nA footer consists of three sections, each optional:\n\n- left\n- center\n- right\n    ",zeplinLink:"https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/5b2a6042114b24a11a8ac153"}};const basic=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_footer__WEBPACK_IMPORTED_MODULE_2__.Z,{className:"stuff",left:[[{url:"http://www.jetbrains.com/teamcity/?fromserver",label:"TeamCity"}," by JetBrains"],"Enterprise 8.0.2 EAP (build 27448)"],center:[[{copyright:2e3,label:" JetBrains"}],{url:"https://teamcity.jetbrains.com/showAgreement.html",label:"License agreement",title:"read me!",target:"_blank"}],right:[{url:"http://www.jetbrains.com/teamcity/feedback?source=footer&version=8.0.3%20(build%2027531)&build=27531&mode=ent",label:"Feedback"}]});basic.storyName="Footer",basic.__docgenInfo={description:"",methods:[],displayName:"basic"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/footer/footer.examples.tsx"]={name:"basic",docgenInfo:basic.__docgenInfo,path:"src/footer/footer.examples.tsx"})}}]);