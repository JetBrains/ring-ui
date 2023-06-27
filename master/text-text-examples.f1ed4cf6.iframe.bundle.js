(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[9375],{"./.storybook/react-decorator.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_dom_client__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-dom/client.js"),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("@storybook/preview-api");const reactDecorator=(StoryFn,context)=>{const node=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useMemo)((()=>document.createElement("div")),[context.kind,context.name]),root=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useMemo)((()=>(0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(node)),[node]);return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_2__.useEffect)((()=>()=>root.unmount()),[root]),root.render(react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.StrictMode,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(StoryFn,null))),node},__WEBPACK_DEFAULT_EXPORT__=()=>reactDecorator},"./src/text/text.examples.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:()=>basic,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./.storybook/react-decorator.tsx"),_group_group__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/group/group.tsx"),_text__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/text/text.tsx");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Text",decorators:[(0,_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__.Z)()],parameters:{storySource:{source:"import React from 'react';\n\nimport reactDecorator from '../../.storybook/react-decorator';\n\nimport Group from '../group/group';\n\nimport Text from './text';\n\nexport default {\n  title: 'Components/Text',\n  decorators: [reactDecorator()],\n\n  parameters: {\n    notes: 'A component for rendering text content.'\n  }\n};\n\nexport const basic = () => (\n  <div>\n    <p style={{fontSize: '30px'}}>\n      <Group>\n        <Text>Text, which size is set by the outer style</Text>\n        <Text info>with an info message</Text>\n      </Group>\n    </p>\n\n    <p style={{fontSize: '30px'}}>\n      <Group>\n        <Text size={Text.Size.S}>Small text</Text>\n        <Text size={Text.Size.S} info>with an info message</Text>\n      </Group>\n    </p>\n\n    <p style={{fontSize: '30px'}}>\n      <Group>\n        <Text size={Text.Size.M}>Medium text</Text>\n        <Text size={Text.Size.M} info>with an info message</Text>\n      </Group>\n    </p>\n\n    <p style={{fontSize: '30px'}}>\n      <Group>\n        <Text size={Text.Size.L}>Large text</Text>\n        <Text size={Text.Size.L} info>with an info message</Text>\n      </Group>\n    </p>\n  </div>\n);\n\nbasic.storyName = 'Text';\n",locationsMap:{basic:{startLoc:{col:21,line:18},endLoc:{col:1,line:48},startBody:{col:21,line:18},endBody:{col:1,line:48}}}},notes:"A component for rendering text content."}},basic=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",{style:{fontSize:"30px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_group_group__WEBPACK_IMPORTED_MODULE_2__.Z,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_text__WEBPACK_IMPORTED_MODULE_3__.Z,null,"Text, which size is set by the outer style"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_text__WEBPACK_IMPORTED_MODULE_3__.Z,{info:!0},"with an info message"))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",{style:{fontSize:"30px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_group_group__WEBPACK_IMPORTED_MODULE_2__.Z,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_text__WEBPACK_IMPORTED_MODULE_3__.Z,{size:_text__WEBPACK_IMPORTED_MODULE_3__.Z.Size.S},"Small text"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_text__WEBPACK_IMPORTED_MODULE_3__.Z,{size:_text__WEBPACK_IMPORTED_MODULE_3__.Z.Size.S,info:!0},"with an info message"))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",{style:{fontSize:"30px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_group_group__WEBPACK_IMPORTED_MODULE_2__.Z,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_text__WEBPACK_IMPORTED_MODULE_3__.Z,{size:_text__WEBPACK_IMPORTED_MODULE_3__.Z.Size.M},"Medium text"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_text__WEBPACK_IMPORTED_MODULE_3__.Z,{size:_text__WEBPACK_IMPORTED_MODULE_3__.Z.Size.M,info:!0},"with an info message"))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",{style:{fontSize:"30px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_group_group__WEBPACK_IMPORTED_MODULE_2__.Z,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_text__WEBPACK_IMPORTED_MODULE_3__.Z,{size:_text__WEBPACK_IMPORTED_MODULE_3__.Z.Size.L},"Large text"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_text__WEBPACK_IMPORTED_MODULE_3__.Z,{size:_text__WEBPACK_IMPORTED_MODULE_3__.Z.Size.L,info:!0},"with an info message"))));basic.storyName="Text",basic.__docgenInfo={description:"",methods:[],displayName:"basic"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/text/text.examples.tsx"]={name:"basic",docgenInfo:basic.__docgenInfo,path:"src/text/text.examples.tsx"})},"./src/group/group.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>Group});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_group_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/group/group.css"),_group_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_group_css__WEBPACK_IMPORTED_MODULE_2__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}class Group extends react__WEBPACK_IMPORTED_MODULE_0__.Component{static propTypes={children:prop_types__WEBPACK_IMPORTED_MODULE_3___default().node,className:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string};render(){const{children,className,...restProps}=this.props,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_group_css__WEBPACK_IMPORTED_MODULE_2___default().group,className);return react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",_extends({},restProps,{className:classes}),children)}}Group.__docgenInfo={description:"@name Group",methods:[],displayName:"Group",props:{children:{type:{name:"node"},required:!1,description:""},className:{type:{name:"string"},required:!1,description:""}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/group/group.tsx"]={name:"Group",docgenInfo:Group.__docgenInfo,path:"src/group/group.tsx"})},"./src/text/text.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>Text});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_text_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/text/text.css"),_text_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_text_css__WEBPACK_IMPORTED_MODULE_2__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const TextSize={S:"s",M:"m",L:"l"};class Text extends react__WEBPACK_IMPORTED_MODULE_0__.Component{static propTypes={children:prop_types__WEBPACK_IMPORTED_MODULE_3___default().node,info:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,size:prop_types__WEBPACK_IMPORTED_MODULE_3___default().oneOf(Object.keys(TextSize).map((it=>TextSize[it]))),className:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string};static Size=TextSize;render(){const{children,className,info,size,...restProps}=this.props,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_text_css__WEBPACK_IMPORTED_MODULE_2___default().text,className,{[_text_css__WEBPACK_IMPORTED_MODULE_2___default().info]:info,[_text_css__WEBPACK_IMPORTED_MODULE_2___default().sizeS]:size===Text.Size.S,[_text_css__WEBPACK_IMPORTED_MODULE_2___default().sizeM]:size===Text.Size.M,[_text_css__WEBPACK_IMPORTED_MODULE_2___default().sizeL]:size===Text.Size.L});return react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",_extends({className:classes},restProps),children)}}Text.__docgenInfo={description:"@name Text",methods:[],displayName:"Text",props:{children:{type:{name:"node"},required:!1,description:""},info:{type:{name:"bool"},required:!1,description:"",tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]}},size:{type:{name:"enum",computed:!0,value:"Object.keys(TextSize).map(it => TextSize[it])"},required:!1,description:"",tsType:{name:"TextSize"}},className:{type:{name:"string"},required:!1,description:""},"data-test":{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""}},composes:["HTMLAttributes"]},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/text/text.tsx"]={name:"Text",docgenInfo:Text.__docgenInfo,path:"src/text/text.tsx"})},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/group/group.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/global/global.css"),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__.default),___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default,"",!0),___CSS_LOADER_EXPORT___.push([module.id,".group_ba3b > *:not(:last-child) {\n    margin-right: 8px;\n  }\n","",{version:3,sources:["webpack://./src/group/group.css"],names:[],mappings:"AAKE;IACE,iBAAkB;EACpB",sourcesContent:['@import "../global/variables.css";\n\n@value unit from "../global/global.css";\n\n.group {\n  & > *:not(:last-child) {\n    margin-right: unit;\n  }\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={unit:`${_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.unit}`,group:"group_ba3b"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/text/text.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,".text_c5aa {\n  color: var(--ring-text-color);\n}\n\n.sizeS_b796 {\n  font-size: var(--ring-font-size-smaller);\n}\n\n.sizeM_a594 {\n  font-size: var(--ring-font-size);\n}\n\n.sizeL_a596 {\n  font-size: var(--ring-font-size-larger);\n}\n\n.info_ff22 {\n  color: var(--ring-secondary-color);\n}\n","",{version:3,sources:["webpack://./src/text/text.css"],names:[],mappings:"AAEA;EACE,6BAA6B;AAC/B;;AAEA;EACE,wCAAwC;AAC1C;;AAEA;EACE,gCAAgC;AAClC;;AAEA;EACE,uCAAuC;AACzC;;AAEA;EACE,kCAAkC;AACpC",sourcesContent:['@import "../global/variables.css";\n\n.text {\n  color: var(--ring-text-color);\n}\n\n.sizeS {\n  font-size: var(--ring-font-size-smaller);\n}\n\n.sizeM {\n  font-size: var(--ring-font-size);\n}\n\n.sizeL {\n  font-size: var(--ring-font-size-larger);\n}\n\n.info {\n  color: var(--ring-secondary-color);\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={text:"text_c5aa",sizeS:"sizeS_b796",sizeM:"sizeM_a594",sizeL:"sizeL_a596",info:"info_ff22"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/group/group.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/group/group.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/text/text.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/text/text.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}}}]);