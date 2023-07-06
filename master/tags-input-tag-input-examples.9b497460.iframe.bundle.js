(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[5880],{"./node_modules/@jetbrains/icons/checkmark.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g><polygon points="6.16 14.41 1.37 9.66 2.63 8.38 5.87 11.59 13.23 0.5 14.73 1.5 6.16 14.41"/></g></svg>'},"./node_modules/@jetbrains/icons/close.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g><polygon points="13.63 3.65 12.35 2.38 8 6.73 3.64 2.38 2.37 3.65 6.72 8.01 2.38 12.35 3.65 13.63 8 9.28 12.35 13.64 13.63 12.36 9.27 8.01 13.63 3.65"/></g></svg>'},"./node_modules/@jetbrains/icons/exception.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g><path d="M13,3.05A7,7,0,1,0,13,13,7,7,0,0,0,13,3.05ZM8.85,12.8H7.15V11.09h1.7Zm0-3.56H7.17L7,3.2H9Z"/></g></svg>'},"./node_modules/@jetbrains/icons/frown.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g><path d="M8,0a8,8,0,1,0,8,8A8,8,0,0,0,8,0ZM3.09,7.58,5.58,5.09A2,2,0,1,1,3.09,7.58Zm6.56,5.27a2.35,2.35,0,0,0-3.3,0l-.7-.7a3.39,3.39,0,0,1,4.7,0ZM11,9a2,2,0,0,1-.54-3.92l2.46,2.46A2,2,0,0,1,11,9Z"/></g></svg>'},"./.storybook/react-decorator.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_dom_client__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-dom/client.js"),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("@storybook/preview-api");const reactDecorator=(StoryFn,context)=>{const node=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useMemo)((()=>document.createElement("div")),[context.kind,context.name]),root=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useMemo)((()=>(0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(node)),[node]);return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useEffect)((()=>()=>root.unmount()),[root]),root.render(react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.StrictMode,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(StoryFn,null))),node},__WEBPACK_DEFAULT_EXPORT__=()=>reactDecorator},"./src/tags-input/tag-input.examples.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{autoOpen:()=>autoOpen,autoOpenInADialog:()=>autoOpenInADialog,basic:()=>basic,default:()=>__WEBPACK_DEFAULT_EXPORT__,disabled:()=>disabled,withIcons:()=>withIcons,withTooLongTagLabels:()=>withTooLongTagLabels});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_jetbrains_icons_checkmark__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@jetbrains/icons/checkmark.js"),_jetbrains_icons_checkmark__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_jetbrains_icons_checkmark__WEBPACK_IMPORTED_MODULE_1__),_jetbrains_icons_exception__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@jetbrains/icons/exception.js"),_jetbrains_icons_exception__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_jetbrains_icons_exception__WEBPACK_IMPORTED_MODULE_2__),_jetbrains_icons_frown__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@jetbrains/icons/frown.js"),_jetbrains_icons_frown__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(_jetbrains_icons_frown__WEBPACK_IMPORTED_MODULE_3__),_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./.storybook/react-decorator.tsx"),_button_button__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./src/button/button.tsx"),_dialog_dialog__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./src/dialog/dialog.tsx"),_island_island__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./src/island/content.tsx"),_global_controls_height__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/global/controls-height.tsx"),_input_input__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/input/input.tsx"),_tags_input__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/tags-input/tags-input.tsx");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Tags Input",decorators:[(0,_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_4__.Z)()],parameters:{storySource:{source:"import React from 'react';\nimport checkmarkIcon from '@jetbrains/icons/checkmark';\nimport exceptionIcon from '@jetbrains/icons/exception';\nimport frownIcon from '@jetbrains/icons/frown';\n\nimport reactDecorator from '../../.storybook/react-decorator';\n\nimport Button from '../button/button';\nimport Dialog from '../dialog/dialog';\nimport {Content} from '../island/island';\nimport {ControlsHeight} from '../global/controls-height';\nimport {Size} from '../input/input';\n\nimport TagsInput from './tags-input';\n\nexport default {\n  title: 'Components/Tags Input',\n  decorators: [reactDecorator()],\n\n  parameters: {\n    notes: 'Displays a tags input field.'\n  }\n};\n\nexport const basic = () => {\n  function dataSource() {\n    return new Promise(resolve => setTimeout(resolve, 200)).then(() =>\n      Promise.resolve(\n        [...Array(20)].map((it, index) => ({key: `test${index}`, label: `test${index}`}))\n      )\n    );\n  }\n\n  return (\n    <form className=\"tagsInputs\">\n      <TagsInput\n        tags={[{key: 'test1', label: 'test1'}, {key: 'test2', label: 'test2'}]}\n        maxPopupHeight={250}\n        dataSource={dataSource}\n        allowAddNewTags\n        filter\n        label=\"M Size\"\n      />\n\n      <TagsInput\n        tags={[{key: 'test1', label: 'test1'}, {key: 'test2', label: 'test2'}]}\n        maxPopupHeight={250}\n        dataSource={dataSource}\n        allowAddNewTags\n        placeholder=\"This is a very very very long placeholder\"\n        filter\n        size={Size.L}\n        label=\"L Size\"\n      />\n\n      <TagsInput\n        tags={[{key: 'test1', label: 'test1'}, {key: 'test2', label: 'test2'}]}\n        maxPopupHeight={250}\n        dataSource={dataSource}\n        allowAddNewTags\n        filter\n        size={Size.FULL}\n        label=\"Full Size\"\n      />\n\n      <TagsInput\n        tags={[{key: 'test1', label: 'test1'}, {key: 'test2', label: 'test2'}]}\n        maxPopupHeight={250}\n        dataSource={dataSource}\n        allowAddNewTags\n        filter\n        size={Size.FULL}\n        height={ControlsHeight.S}\n        label=\"S Height\"\n      />\n    </form>\n  );\n};\n\nbasic.storyName = 'basic';\n\nbasic.parameters = {\n  storyStyles: `\n<style>\n  .tagsInputs {\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n  }\n</style>`\n};\n\nexport const withIcons = () => {\n  const tags = [\n    {key: 'test1', label: 'test1', rgTagIcon: checkmarkIcon},\n    {key: 'test2', label: 'test2'}\n  ];\n\n  function dataSource() {\n    return [\n      {key: 'test3', label: 'test3', rgTagIcon: exceptionIcon, rgTagTitle: 'I am the tag title'},\n      {key: 'test4', label: 'test4', rgTagIcon: frownIcon}\n    ];\n  }\n\n  return <TagsInput tags={tags} dataSource={dataSource}/>;\n};\n\nwithIcons.storyName = 'with icons';\n\nexport const disabled = () => (\n  <TagsInput disabled tags={[{key: 'test2', label: 'test2'}]} dataSource={() => []}/>\n);\n\ndisabled.storyName = 'disabled';\n\nexport const withTooLongTagLabels = () => {\n  const tags = [{key: 'test1', label: 'Label'}, {key: 'test2', label: 'Very long label'}];\n\n  function dataSource() {\n    return [\n      {key: 'test3', label: 'Very very long label'},\n      {key: 'test4', label: 'Very very very long label'}\n    ];\n  }\n\n  return <TagsInput tags={tags} dataSource={dataSource}/>;\n};\n\nwithTooLongTagLabels.storyName = 'with too long tag labels';\n\nexport const autoOpen = () => {\n  const tags = [{key: 'test1', label: 'test1'}, {key: 'test2', label: 'test2'}];\n\n  function dataSource() {\n    return [\n      {key: 'test3', label: 'test3'},\n      {key: 'test4', label: 'test4'}\n    ];\n  }\n\n  return <TagsInput tags={tags} dataSource={dataSource} autoOpen/>;\n};\n\nautoOpen.parameters = {\n  hermione: {\n    captureSelector: ['#storybook-root', '[data-test~=ring-popup]']\n  },\n  a11y: {element: '#storybook-root,[data-test~=ring-popup]'}\n};\n\n\nexport const autoOpenInADialog = () => {\n  const tags = [{key: 'test1', label: 'test1'}, {key: 'test2', label: 'test2'}];\n\n  function dataSource() {\n    return [\n      {key: 'test3', label: 'test3'},\n      {key: 'test4', label: 'test4'}\n    ];\n  }\n\n  return (\n    <>\n      <Button>Button</Button>\n      <Dialog label=\"Tags\" show trapFocus autoFocusFirst={false}>\n        <Content>\n          <TagsInput tags={tags} dataSource={dataSource} autoOpen/>\n        </Content>\n      </Dialog>\n    </>\n  );\n};\n\nautoOpenInADialog.parameters = {\n  hermione: {\n    captureSelector: ['[data-test~=ring-dialog]', '[data-test~=ring-popup]']\n  },\n  a11y: {element: '#storybook-root,[data-test~=ring-dialog],[data-test~=ring-popup]'}\n};\n",locationsMap:{basic:{startLoc:{col:21,line:25},endLoc:{col:1,line:78},startBody:{col:21,line:25},endBody:{col:1,line:78}},"with-icons":{startLoc:{col:25,line:93},endLoc:{col:1,line:107},startBody:{col:25,line:93},endBody:{col:1,line:107}},disabled:{startLoc:{col:24,line:111},endLoc:{col:1,line:113},startBody:{col:24,line:111},endBody:{col:1,line:113}},"with-too-long-tag-labels":{startLoc:{col:36,line:117},endLoc:{col:1,line:128},startBody:{col:36,line:117},endBody:{col:1,line:128}},"auto-open":{startLoc:{col:24,line:132},endLoc:{col:1,line:143},startBody:{col:24,line:132},endBody:{col:1,line:143}},"auto-open-in-a-dialog":{startLoc:{col:33,line:153},endLoc:{col:1,line:173},startBody:{col:33,line:153},endBody:{col:1,line:173}}}},notes:"Displays a tags input field."}},basic=()=>{function dataSource(){return new Promise((resolve=>setTimeout(resolve,200))).then((()=>Promise.resolve([...Array(20)].map(((it,index)=>({key:`test${index}`,label:`test${index}`}))))))}return react__WEBPACK_IMPORTED_MODULE_0__.createElement("form",{className:"tagsInputs"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_tags_input__WEBPACK_IMPORTED_MODULE_5__.Z,{tags:[{key:"test1",label:"test1"},{key:"test2",label:"test2"}],maxPopupHeight:250,dataSource,allowAddNewTags:!0,filter:!0,label:"M Size"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_tags_input__WEBPACK_IMPORTED_MODULE_5__.Z,{tags:[{key:"test1",label:"test1"},{key:"test2",label:"test2"}],maxPopupHeight:250,dataSource,allowAddNewTags:!0,placeholder:"This is a very very very long placeholder",filter:!0,size:_input_input__WEBPACK_IMPORTED_MODULE_6__.$u.L,label:"L Size"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_tags_input__WEBPACK_IMPORTED_MODULE_5__.Z,{tags:[{key:"test1",label:"test1"},{key:"test2",label:"test2"}],maxPopupHeight:250,dataSource,allowAddNewTags:!0,filter:!0,size:_input_input__WEBPACK_IMPORTED_MODULE_6__.$u.FULL,label:"Full Size"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_tags_input__WEBPACK_IMPORTED_MODULE_5__.Z,{tags:[{key:"test1",label:"test1"},{key:"test2",label:"test2"}],maxPopupHeight:250,dataSource,allowAddNewTags:!0,filter:!0,size:_input_input__WEBPACK_IMPORTED_MODULE_6__.$u.FULL,height:_global_controls_height__WEBPACK_IMPORTED_MODULE_7__.oW.S,label:"S Height"}))};basic.storyName="basic",basic.parameters={storyStyles:"\n<style>\n  .tagsInputs {\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n  }\n</style>"};const withIcons=()=>{const tags=[{key:"test1",label:"test1",rgTagIcon:_jetbrains_icons_checkmark__WEBPACK_IMPORTED_MODULE_1___default()},{key:"test2",label:"test2"}];return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_tags_input__WEBPACK_IMPORTED_MODULE_5__.Z,{tags,dataSource:function dataSource(){return[{key:"test3",label:"test3",rgTagIcon:_jetbrains_icons_exception__WEBPACK_IMPORTED_MODULE_2___default(),rgTagTitle:"I am the tag title"},{key:"test4",label:"test4",rgTagIcon:_jetbrains_icons_frown__WEBPACK_IMPORTED_MODULE_3___default()}]}})};withIcons.storyName="with icons";const disabled=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_tags_input__WEBPACK_IMPORTED_MODULE_5__.Z,{disabled:!0,tags:[{key:"test2",label:"test2"}],dataSource:()=>[]});disabled.storyName="disabled";const withTooLongTagLabels=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_tags_input__WEBPACK_IMPORTED_MODULE_5__.Z,{tags:[{key:"test1",label:"Label"},{key:"test2",label:"Very long label"}],dataSource:function dataSource(){return[{key:"test3",label:"Very very long label"},{key:"test4",label:"Very very very long label"}]}});withTooLongTagLabels.storyName="with too long tag labels";const autoOpen=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_tags_input__WEBPACK_IMPORTED_MODULE_5__.Z,{tags:[{key:"test1",label:"test1"},{key:"test2",label:"test2"}],dataSource:function dataSource(){return[{key:"test3",label:"test3"},{key:"test4",label:"test4"}]},autoOpen:!0});autoOpen.parameters={hermione:{captureSelector:["#storybook-root","[data-test~=ring-popup]"]},a11y:{element:"#storybook-root,[data-test~=ring-popup]"}};const autoOpenInADialog=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button_button__WEBPACK_IMPORTED_MODULE_8__.ZP,null,"Button"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_dialog_dialog__WEBPACK_IMPORTED_MODULE_9__.Z,{label:"Tags",show:!0,trapFocus:!0,autoFocusFirst:!1},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_island_island__WEBPACK_IMPORTED_MODULE_10__.Z,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_tags_input__WEBPACK_IMPORTED_MODULE_5__.Z,{tags:[{key:"test1",label:"test1"},{key:"test2",label:"test2"}],dataSource:function dataSource(){return[{key:"test3",label:"test3"},{key:"test4",label:"test4"}]},autoOpen:!0}))));autoOpenInADialog.parameters={hermione:{captureSelector:["[data-test~=ring-dialog]","[data-test~=ring-popup]"]},a11y:{element:"#storybook-root,[data-test~=ring-dialog],[data-test~=ring-popup]"}},basic.__docgenInfo={description:"",methods:[],displayName:"basic"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/tags-input/tag-input.examples.tsx"]={name:"basic",docgenInfo:basic.__docgenInfo,path:"src/tags-input/tag-input.examples.tsx"}),withIcons.__docgenInfo={description:"",methods:[],displayName:"withIcons"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/tags-input/tag-input.examples.tsx"]={name:"withIcons",docgenInfo:withIcons.__docgenInfo,path:"src/tags-input/tag-input.examples.tsx"}),disabled.__docgenInfo={description:"",methods:[],displayName:"disabled"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/tags-input/tag-input.examples.tsx"]={name:"disabled",docgenInfo:disabled.__docgenInfo,path:"src/tags-input/tag-input.examples.tsx"}),withTooLongTagLabels.__docgenInfo={description:"",methods:[],displayName:"withTooLongTagLabels"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/tags-input/tag-input.examples.tsx"]={name:"withTooLongTagLabels",docgenInfo:withTooLongTagLabels.__docgenInfo,path:"src/tags-input/tag-input.examples.tsx"}),autoOpen.__docgenInfo={description:"",methods:[],displayName:"autoOpen"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/tags-input/tag-input.examples.tsx"]={name:"autoOpen",docgenInfo:autoOpen.__docgenInfo,path:"src/tags-input/tag-input.examples.tsx"}),autoOpenInADialog.__docgenInfo={description:"",methods:[],displayName:"autoOpenInADialog"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/tags-input/tag-input.examples.tsx"]={name:"autoOpenInADialog",docgenInfo:autoOpenInADialog.__docgenInfo,path:"src/tags-input/tag-input.examples.tsx"})}}]);