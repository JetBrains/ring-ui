(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[9375],{"./.storybook/react-decorator.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("@storybook/preview-api"),_src_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/global/react-render-adapter.ts");const reactDecorator=(StoryFn,context)=>{const node=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useMemo)((()=>document.createElement("div")),[context.kind,context.name]);return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>()=>(0,_src_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_2__.uy)(node)),[node]),(0,_src_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_2__.sY)(react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.StrictMode,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(StoryFn,null)),node),node};__webpack_exports__.Z=()=>reactDecorator},"./src/text/text.examples.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:function(){return basic}});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./.storybook/react-decorator.tsx"),_group_group__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/group/group.tsx"),_text__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/text/text.tsx");__webpack_exports__.default={title:"Components/Text",decorators:[(0,_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__.Z)()],parameters:{storySource:{source:"import React from 'react';\n\nimport reactDecorator from '../../.storybook/react-decorator';\n\nimport Group from '../group/group';\n\nimport Text from './text';\n\nexport default {\n  title: 'Components/Text',\n  decorators: [reactDecorator()],\n\n  parameters: {\n    notes: 'A component for rendering text content.'\n  }\n};\n\nexport const basic = () => (\n  <Group>\n    <Text>Text</Text>\n    <Text info>with an info message</Text>\n  </Group>\n);\n\nbasic.storyName = 'Text';\n",locationsMap:{basic:{startLoc:{col:21,line:18},endLoc:{col:1,line:23},startBody:{col:21,line:18},endBody:{col:1,line:23}}}},notes:"A component for rendering text content."}};const basic=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_group_group__WEBPACK_IMPORTED_MODULE_2__.Z,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_text__WEBPACK_IMPORTED_MODULE_3__.Z,null,"Text"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_text__WEBPACK_IMPORTED_MODULE_3__.Z,{info:!0},"with an info message"));basic.storyName="Text",basic.__docgenInfo={description:"",methods:[],displayName:"basic"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/text/text.examples.tsx"]={name:"basic",docgenInfo:basic.__docgenInfo,path:"src/text/text.examples.tsx"})},"./src/group/group.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{Z:function(){return Group}});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_group_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/group/group.css"),_group_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_group_css__WEBPACK_IMPORTED_MODULE_2__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}class Group extends react__WEBPACK_IMPORTED_MODULE_0__.Component{static propTypes={children:prop_types__WEBPACK_IMPORTED_MODULE_3___default().node,className:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string};render(){const{children:children,className:className,...restProps}=this.props,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_group_css__WEBPACK_IMPORTED_MODULE_2___default().group,className);return react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",_extends({},restProps,{className:classes}),children)}}Group.__docgenInfo={description:"@name Group",methods:[],displayName:"Group",props:{children:{type:{name:"node"},required:!1,description:""},className:{type:{name:"string"},required:!1,description:""}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/group/group.tsx"]={name:"Group",docgenInfo:Group.__docgenInfo,path:"src/group/group.tsx"})},"./src/text/text.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{Z:function(){return Text}});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_text_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/text/text.css"),_text_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_text_css__WEBPACK_IMPORTED_MODULE_2__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}class Text extends react__WEBPACK_IMPORTED_MODULE_0__.Component{static propTypes={children:prop_types__WEBPACK_IMPORTED_MODULE_3___default().node,info:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,className:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string};render(){const{children:children,className:className,info:info,...restProps}=this.props,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_text_css__WEBPACK_IMPORTED_MODULE_2___default().text,className,{[_text_css__WEBPACK_IMPORTED_MODULE_2___default().info]:info});return react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",_extends({className:classes},restProps),children)}}Text.__docgenInfo={description:"@name Text",methods:[],displayName:"Text",props:{children:{type:{name:"node"},required:!1,description:""},info:{type:{name:"bool"},required:!1,description:"",tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]}},className:{type:{name:"string"},required:!1,description:""},"data-test":{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""}},composes:["HTMLAttributes"]},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/text/text.tsx"]={name:"Text",docgenInfo:Text.__docgenInfo,path:"src/text/text.tsx"})},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/group/group.css":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/global.css"),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__.default),___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default,"",!0),___CSS_LOADER_EXPORT___.push([module.id,".group_ba3b > *:not(:last-child) {\n    margin-right: 8px;\n  }\n","",{version:3,sources:["webpack://./src/group/group.css"],names:[],mappings:"AAKE;IACE,iBAAkB;EACpB",sourcesContent:['@import "../global/variables.css";\n\n@value unit from "../global/global.css";\n\n.group {\n  & > *:not(:last-child) {\n    margin-right: unit;\n  }\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={unit:""+_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.unit,group:"group_ba3b"},__webpack_exports__.default=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/text/text.css":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,".text_c5aa {\n  color: var(--ring-text-color);\n}\n\n.info_ff22 {\n  color: var(--ring-secondary-color);\n}\n","",{version:3,sources:["webpack://./src/text/text.css"],names:[],mappings:"AAEA;EACE,6BAA6B;AAC/B;;AAEA;EACE,kCAAkC;AACpC",sourcesContent:['@import "../global/variables.css";\n\n.text {\n  color: var(--ring-text-color);\n}\n\n.info {\n  color: var(--ring-secondary-color);\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={text:"text_c5aa",info:"info_ff22"},__webpack_exports__.default=___CSS_LOADER_EXPORT___},"./src/group/group.css":function(module,__unused_webpack_exports,__webpack_require__){var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/group/group.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/text/text.css":function(module,__unused_webpack_exports,__webpack_require__){var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/text/text.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}}}]);