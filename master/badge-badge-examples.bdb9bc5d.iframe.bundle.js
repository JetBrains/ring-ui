(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[1393],{"./.storybook/react-decorator.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("@storybook/preview-api"),_src_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/global/react-render-adapter.ts");const reactDecorator=(StoryFn,context)=>{const node=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useMemo)((()=>document.createElement("div")),[context.kind,context.name]);return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>()=>(0,_src_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_2__.uy)(node)),[node]),(0,_src_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_2__.sY)(react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.StrictMode,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(StoryFn,null)),node),node};__webpack_exports__.Z=()=>reactDecorator},"./src/badge/badge.examples.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{badge:function(){return badge}});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./.storybook/react-decorator.tsx"),_group_group__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/group/group.tsx"),_badge__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/badge/badge.tsx");__webpack_exports__.default={title:"Components/Badge",decorators:[(0,_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__.Z)()],parameters:{storySource:{source:"import React from 'react';\n\nimport reactDecorator from '../../.storybook/react-decorator';\n\nimport Group from '../group/group';\n\nimport Badge from './badge';\n\nexport default {\n  title: 'Components/Badge',\n  decorators: [reactDecorator()],\n\n  parameters: {\n    notes: 'Displays a badge.'\n  }\n};\n\nexport const badge = () => (\n  <Group>\n    <Badge>simple</Badge>\n    <Badge gray>gray</Badge>\n    <Badge valid>valid</Badge>\n    <Badge invalid>invalid</Badge>\n    <Badge disabled>disabled</Badge>\n  </Group>\n);\n",locationsMap:{badge:{startLoc:{col:21,line:18},endLoc:{col:1,line:26},startBody:{col:21,line:18},endBody:{col:1,line:26}}}},notes:"Displays a badge."}};const badge=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_group_group__WEBPACK_IMPORTED_MODULE_2__.Z,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_badge__WEBPACK_IMPORTED_MODULE_3__.Z,null,"simple"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_badge__WEBPACK_IMPORTED_MODULE_3__.Z,{gray:!0},"gray"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_badge__WEBPACK_IMPORTED_MODULE_3__.Z,{valid:!0},"valid"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_badge__WEBPACK_IMPORTED_MODULE_3__.Z,{invalid:!0},"invalid"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_badge__WEBPACK_IMPORTED_MODULE_3__.Z,{disabled:!0},"disabled"));badge.__docgenInfo={description:"",methods:[],displayName:"badge"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/badge/badge.examples.tsx"]={name:"badge",docgenInfo:badge.__docgenInfo,path:"src/badge/badge.examples.tsx"})},"./src/badge/badge.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{Z:function(){return Badge}});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_global_data_tests__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/global/data-tests.ts"),_badge_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/badge/badge.css"),_badge_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_badge_css__WEBPACK_IMPORTED_MODULE_2__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}class Badge extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{static propTypes={gray:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,valid:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,invalid:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,disabled:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,className:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string,children:prop_types__WEBPACK_IMPORTED_MODULE_3___default().node,"data-test":prop_types__WEBPACK_IMPORTED_MODULE_3___default().string};render(){const{gray:gray,valid:valid,invalid:invalid,disabled:disabled,className:className,children:children,"data-test":dataTest,...props}=this.props,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_badge_css__WEBPACK_IMPORTED_MODULE_2___default().badge,className,{[_badge_css__WEBPACK_IMPORTED_MODULE_2___default().gray]:gray,[_badge_css__WEBPACK_IMPORTED_MODULE_2___default().valid]:valid,[_badge_css__WEBPACK_IMPORTED_MODULE_2___default().invalid]:invalid,[_badge_css__WEBPACK_IMPORTED_MODULE_2___default().disabled]:disabled});return react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",_extends({},props,{"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_4__.Z)("ring-badge",dataTest),className:classes}),children)}}Badge.__docgenInfo={description:"@name Badge",methods:[],displayName:"Badge",props:{gray:{type:{name:"bool"},required:!1,description:"",tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]}},valid:{type:{name:"bool"},required:!1,description:"",tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]}},invalid:{type:{name:"bool"},required:!1,description:"",tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]}},disabled:{type:{name:"bool"},required:!1,description:"",tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]}},className:{type:{name:"string"},required:!1,description:""},children:{type:{name:"node"},required:!1,description:""},"data-test":{type:{name:"string"},required:!1,description:"",tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]}}},composes:["HTMLAttributes"]},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/badge/badge.tsx"]={name:"Badge",docgenInfo:Badge.__docgenInfo,path:"src/badge/badge.tsx"})},"./src/group/group.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{Z:function(){return Group}});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_group_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/group/group.css"),_group_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_group_css__WEBPACK_IMPORTED_MODULE_2__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}class Group extends react__WEBPACK_IMPORTED_MODULE_0__.Component{static propTypes={children:prop_types__WEBPACK_IMPORTED_MODULE_3___default().node,className:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string};render(){const{children:children,className:className,...restProps}=this.props,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_group_css__WEBPACK_IMPORTED_MODULE_2___default().group,className);return react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",_extends({},restProps,{className:classes}),children)}}Group.__docgenInfo={description:"@name Group",methods:[],displayName:"Group",props:{children:{type:{name:"node"},required:!1,description:""},className:{type:{name:"string"},required:!1,description:""}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/group/group.tsx"]={name:"Group",docgenInfo:Group.__docgenInfo,path:"src/group/group.tsx"})},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/badge/badge.css":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/global.css"),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__.default),___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default,"",!0),___CSS_LOADER_EXPORT___.push([module.id,".badge_f068 {\n  display: inline-block;\n\n  box-sizing: border-box;\n  height: 20px;\n  padding: 0 8px;\n\n  cursor: default;\n\n  vertical-align: baseline;\n\n  color: var(--ring-secondary-color);\n  border: 1px var(--ring-line-color) solid;\n  border-radius: var(--ring-border-radius);\n  background-color: var(--ring-content-background-color);\n\n  font-size: var(--ring-font-size-smaller);\n  font-weight: normal;\n  font-style: normal;\n  line-height: 17px;\n}\n\n.badge_f068.gray_b28f {\n    color: var(--ring-text-color);\n    background-color: var(--ring-tag-background-color);\n  }\n\n.badge_f068.valid_d412 {\n    color: var(--ring-success-color);\n  }\n\n.badge_f068.invalid_bfa3 {\n    color: var(--ring-error-color);\n  }\n\n.badge_f068.disabled_a43e {\n    /* Deprecated: duplicates invalid */\n\n    color: var(--ring-error-color);\n  }\n","",{version:3,sources:["webpack://./src/badge/badge.css"],names:[],mappings:"AAIA;EACE,qBAAqB;;EAErB,sBAAsB;EACtB,YAAY;EACZ,cAAe;;EAEf,eAAe;;EAEf,wBAAwB;;EAExB,kCAAkC;EAClC,wCAAwC;EACxC,wCAAwC;EACxC,sDAAsD;;EAEtD,wCAAwC;EACxC,mBAAmB;EACnB,kBAAkB;EAClB,iBAAiB;AAoBnB;;AAlBE;IACE,6BAA6B;IAC7B,kDAAkD;EACpD;;AAEA;IACE,gCAAgC;EAClC;;AAEA;IACE,8BAA8B;EAChC;;AAEA;IACE,mCAAmC;;IAEnC,8BAA8B;EAChC",sourcesContent:['@import "../global/variables.css";\n\n@value unit from "../global/global.css";\n\n.badge {\n  display: inline-block;\n\n  box-sizing: border-box;\n  height: 20px;\n  padding: 0 unit;\n\n  cursor: default;\n\n  vertical-align: baseline;\n\n  color: var(--ring-secondary-color);\n  border: 1px var(--ring-line-color) solid;\n  border-radius: var(--ring-border-radius);\n  background-color: var(--ring-content-background-color);\n\n  font-size: var(--ring-font-size-smaller);\n  font-weight: normal;\n  font-style: normal;\n  line-height: 17px;\n\n  &.gray {\n    color: var(--ring-text-color);\n    background-color: var(--ring-tag-background-color);\n  }\n\n  &.valid {\n    color: var(--ring-success-color);\n  }\n\n  &.invalid {\n    color: var(--ring-error-color);\n  }\n\n  &.disabled {\n    /* Deprecated: duplicates invalid */\n\n    color: var(--ring-error-color);\n  }\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={unit:""+_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.unit,badge:"badge_f068",gray:"gray_b28f",valid:"valid_d412",invalid:"invalid_bfa3",disabled:"disabled_a43e"},__webpack_exports__.default=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/group/group.css":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/global.css"),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__.default),___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default,"",!0),___CSS_LOADER_EXPORT___.push([module.id,".group_ba3b > *:not(:last-child) {\n    margin-right: 8px;\n  }\n","",{version:3,sources:["webpack://./src/group/group.css"],names:[],mappings:"AAKE;IACE,iBAAkB;EACpB",sourcesContent:['@import "../global/variables.css";\n\n@value unit from "../global/global.css";\n\n.group {\n  & > *:not(:last-child) {\n    margin-right: unit;\n  }\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={unit:""+_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.unit,group:"group_ba3b"},__webpack_exports__.default=___CSS_LOADER_EXPORT___},"./src/badge/badge.css":function(module,__unused_webpack_exports,__webpack_require__){var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/badge/badge.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/group/group.css":function(module,__unused_webpack_exports,__webpack_require__){var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/group/group.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}}}]);