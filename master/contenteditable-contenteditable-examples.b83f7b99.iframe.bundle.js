"use strict";(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[9389],{"./.storybook/react-decorator.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("@storybook/preview-api"),_src_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/global/react-render-adapter.ts");const reactDecorator=(StoryFn,context)=>{const node=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useMemo)((()=>document.createElement("div")),[context.kind,context.name]);return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>()=>(0,_src_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_2__.uy)(node)),[node]),(0,_src_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_2__.sY)(react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.StrictMode,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(StoryFn,null)),node),node};__webpack_exports__.Z=()=>reactDecorator},"./src/contenteditable/contenteditable.examples.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:function(){return basic}});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./.storybook/react-decorator.tsx"),_contenteditable__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/contenteditable/contenteditable.tsx");__webpack_exports__.default={title:"Components/ContentEditable",decorators:[(0,_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__.Z)()],parameters:{storySource:{source:"import React from 'react';\n\nimport reactDecorator from '../../.storybook/react-decorator';\n\nimport ContentEditable from './contenteditable';\n\nexport default {\n  title: 'Components/ContentEditable',\n  decorators: [reactDecorator()],\n\n  parameters: {\n    notes: 'Provides a ContentEditable component.'\n  }\n};\n\nexport const basic = () => (\n  <div>\n    <ContentEditable className=\"my-input\" aria-label=\"My input\">\n      <span>\n        text <b>bold text</b> text\n      </span>\n    </ContentEditable>\n    <ContentEditable className=\"my-input\" aria-label=\"My input\" disabled>\n      <span>\n        text <b>bold text</b> text\n      </span>\n    </ContentEditable>\n  </div>\n);\n\nbasic.storyName = 'ContentEditable';\n\nbasic.parameters = {\n  storyStyles: `\n<style>\n    .my-input {\n      padding-left: 4px;\n    }\n\n    .my-input[disabled] {\n      border: 1px solid var(--ring-border-disabled-color);\n      background-color: var(--ring-disabled-color);\n    }\n</style>`\n};\n",locationsMap:{basic:{startLoc:{col:21,line:16},endLoc:{col:1,line:29},startBody:{col:21,line:16},endBody:{col:1,line:29}}}},notes:"Provides a ContentEditable component."}};const basic=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_contenteditable__WEBPACK_IMPORTED_MODULE_2__.Z,{className:"my-input","aria-label":"My input"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,"text ",react__WEBPACK_IMPORTED_MODULE_0__.createElement("b",null,"bold text")," text")),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_contenteditable__WEBPACK_IMPORTED_MODULE_2__.Z,{className:"my-input","aria-label":"My input",disabled:!0},react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,"text ",react__WEBPACK_IMPORTED_MODULE_0__.createElement("b",null,"bold text")," text")));basic.storyName="ContentEditable",basic.parameters={storyStyles:"\n<style>\n    .my-input {\n      padding-left: 4px;\n    }\n\n    .my-input[disabled] {\n      border: 1px solid var(--ring-border-disabled-color);\n      background-color: var(--ring-disabled-color);\n    }\n</style>"},basic.__docgenInfo={description:"",methods:[],displayName:"basic"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/contenteditable/contenteditable.examples.tsx"]={name:"basic",docgenInfo:basic.__docgenInfo,path:"src/contenteditable/contenteditable.examples.tsx"})},"./src/contenteditable/contenteditable.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__),react_dom_server__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-dom/server.browser.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}function noop(){}const commonPropTypes={disabled:prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool,tabIndex:prop_types__WEBPACK_IMPORTED_MODULE_2___default().number,componentDidUpdate:prop_types__WEBPACK_IMPORTED_MODULE_2___default().func,onComponentUpdate:prop_types__WEBPACK_IMPORTED_MODULE_2___default().func,className:prop_types__WEBPACK_IMPORTED_MODULE_2___default().string,inputRef:prop_types__WEBPACK_IMPORTED_MODULE_2___default().oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_2___default().func,prop_types__WEBPACK_IMPORTED_MODULE_2___default().object])};class ContentEditableBase extends react__WEBPACK_IMPORTED_MODULE_0__.Component{static propTypes={...commonPropTypes,__html:prop_types__WEBPACK_IMPORTED_MODULE_2___default().string};static defaultProps={disabled:!1,tabIndex:0,onInput:noop,onComponentUpdate:noop};shouldComponentUpdate(nextProps){return nextProps.disabled!==this.props.disabled||nextProps.__html!==this.props.__html}componentDidUpdate(prevProps){this.props.onComponentUpdate(prevProps)}render(){const{__html:__html,onComponentUpdate:onComponentUpdate,disabled:disabled,tabIndex:tabIndex,inputRef:inputRef,...props}=this.props;return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",_extends({},props,{ref:inputRef,disabled:disabled,role:"textbox",tabIndex:disabled?void 0:tabIndex,contentEditable:!this.props.disabled,dangerouslySetInnerHTML:{__html:__html}}))}}const ContentEditable=_ref=>{let{children:children,...props}=_ref;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ContentEditableBase,_extends({},props,{__html:(0,react_dom_server__WEBPACK_IMPORTED_MODULE_1__.renderToStaticMarkup)(children)}))};ContentEditable.propTypes={...commonPropTypes,children:prop_types__WEBPACK_IMPORTED_MODULE_2___default().node},ContentEditable.__docgenInfo={description:"",methods:[],displayName:"ContentEditable",props:{disabled:{type:{name:"bool"},required:!1,description:""},tabIndex:{type:{name:"number"},required:!1,description:""},componentDidUpdate:{type:{name:"func"},required:!1,description:""},onComponentUpdate:{type:{name:"func"},required:!1,description:""},className:{type:{name:"string"},required:!1,description:""},inputRef:{type:{name:"union",value:[{name:"func"},{name:"object"}]},required:!1,description:""},children:{type:{name:"node"},required:!1,description:""}}},__webpack_exports__.Z=ContentEditable,"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/contenteditable/contenteditable.tsx"]={name:"ContentEditable",docgenInfo:ContentEditable.__docgenInfo,path:"src/contenteditable/contenteditable.tsx"})}}]);