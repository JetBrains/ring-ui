(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[2262],{"./src/text/text.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:()=>basic,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _text__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/text/text.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Text",parameters:{notes:"A component for rendering text content."}},basic=()=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_text__WEBPACK_IMPORTED_MODULE_1__.A,{size:_text__WEBPACK_IMPORTED_MODULE_1__.A.Size.S,info:!0,children:"Label text example"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("br",{}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_text__WEBPACK_IMPORTED_MODULE_1__.A,{size:_text__WEBPACK_IMPORTED_MODULE_1__.A.Size.S,info:!0,bold:!0,children:"Label text example bold"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_text__WEBPACK_IMPORTED_MODULE_1__.A,{size:_text__WEBPACK_IMPORTED_MODULE_1__.A.Size.M,children:"Regular text example"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("br",{}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_text__WEBPACK_IMPORTED_MODULE_1__.A,{size:_text__WEBPACK_IMPORTED_MODULE_1__.A.Size.M,bold:!0,children:"Regular text example bold"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_text__WEBPACK_IMPORTED_MODULE_1__.A,{size:_text__WEBPACK_IMPORTED_MODULE_1__.A.Size.L,children:"Text block example"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("br",{}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_text__WEBPACK_IMPORTED_MODULE_1__.A,{size:_text__WEBPACK_IMPORTED_MODULE_1__.A.Size.L,bold:!0,children:"Text block example bold"})]})]});basic.storyName="Text",basic.parameters={...basic.parameters,docs:{...basic.parameters?.docs,source:{originalSource:"() => <div>\n    <p>\n      <Text size={Text.Size.S} info>\n        Label text example\n      </Text>\n      <br />\n      <Text size={Text.Size.S} info bold>\n        Label text example bold\n      </Text>\n    </p>\n\n    <p>\n      <Text size={Text.Size.M}>Regular text example</Text>\n      <br />\n      <Text size={Text.Size.M} bold>\n        Regular text example bold\n      </Text>\n    </p>\n\n    <p>\n      <Text size={Text.Size.L}>Text block example</Text>\n      <br />\n      <Text size={Text.Size.L} bold>\n        Text block example bold\n      </Text>\n    </p>\n  </div>",...basic.parameters?.docs?.source}}}},"./src/text/text.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>Text});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_text_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/text/text.css"),_text_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_text_css__WEBPACK_IMPORTED_MODULE_2__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/jsx-runtime.js");const TextSize={S:"s",M:"m",L:"l"};class Text extends react__WEBPACK_IMPORTED_MODULE_0__.Component{static Size=TextSize;render(){const{children,className,info,size,bold,...restProps}=this.props,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_text_css__WEBPACK_IMPORTED_MODULE_2___default().text,className,{[_text_css__WEBPACK_IMPORTED_MODULE_2___default().info]:info,[_text_css__WEBPACK_IMPORTED_MODULE_2___default().bold]:bold,[_text_css__WEBPACK_IMPORTED_MODULE_2___default().sizeS]:size===Text.Size.S,[_text_css__WEBPACK_IMPORTED_MODULE_2___default().sizeM]:size===Text.Size.M,[_text_css__WEBPACK_IMPORTED_MODULE_2___default().sizeL]:size===Text.Size.L});return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span",{className:classes,...restProps,children})}}Text.__docgenInfo={description:"@name Text",methods:[],displayName:"Text",props:{info:{required:!1,tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]},description:""},size:{required:!1,tsType:{name:"TextSize"},description:""},"data-test":{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""},bold:{required:!1,tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]},description:""}},composes:["HTMLAttributes"]}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/text/text.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,".text_c5aa {\n  color: var(--ring-text-color);\n}\n\n.sizeS_b796 {\n  font-size: var(--ring-font-size-smaller);\n  line-height: var(--ring-line-height-lowest);\n}\n\n.sizeM_a594 {\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}\n\n.sizeL_a596 {\n  font-size: var(--ring-font-size-larger);\n  line-height: var(--ring-line-height-taller);\n}\n\n.info_ff22 {\n  color: var(--ring-secondary-color);\n}\n\n.bold_ba51 {\n  font-weight: var(--ring-font-weight-bold);\n}\n","",{version:3,sources:["webpack://./src/text/text.css"],names:[],mappings:"AAEA;EACE,6BAA6B;AAC/B;;AAEA;EACE,wCAAwC;EACxC,2CAA2C;AAC7C;;AAEA;EACE,gCAAgC;EAChC,oCAAoC;AACtC;;AAEA;EACE,uCAAuC;EACvC,2CAA2C;AAC7C;;AAEA;EACE,kCAAkC;AACpC;;AAEA;EACE,yCAAyC;AAC3C",sourcesContent:['@import "../global/variables.css";\n\n.text {\n  color: var(--ring-text-color);\n}\n\n.sizeS {\n  font-size: var(--ring-font-size-smaller);\n  line-height: var(--ring-line-height-lowest);\n}\n\n.sizeM {\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}\n\n.sizeL {\n  font-size: var(--ring-font-size-larger);\n  line-height: var(--ring-line-height-taller);\n}\n\n.info {\n  color: var(--ring-secondary-color);\n}\n\n.bold {\n  font-weight: var(--ring-font-weight-bold);\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={text:"text_c5aa",sizeS:"sizeS_b796",sizeM:"sizeM_a594",sizeL:"sizeL_a596",info:"info_ff22",bold:"bold_ba51"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/text/text.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/text/text.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}}}]);