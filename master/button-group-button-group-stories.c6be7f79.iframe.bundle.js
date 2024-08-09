(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[6384],{"./node_modules/@jetbrains/icons/chevron-down.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.942 5.808a.625.625 0 0 0-.884 0L8 8.866 4.942 5.808a.625.625 0 1 0-.884.884l3.5 3.5c.244.244.64.244.884 0l3.5-3.5a.625.625 0 0 0 0-.884Z" clip-rule="evenodd"/></svg>'},"./src/button-group/button-group.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{buttonGroup:()=>buttonGroup,default:()=>button_group_stories});var button_button=__webpack_require__("./src/button/button.tsx"),button_group=__webpack_require__("./src/button-group/button-group.tsx"),react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),button_group_button_group=__webpack_require__("./src/button-group/button-group.css"),button_group_default=__webpack_require__.n(button_group_button_group),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");class Caption extends react.PureComponent{render(){const{className}=this.props,classes=classnames_default()(button_group_default().caption,className);return(0,jsx_runtime.jsx)("span",{...this.props,className:classes})}}Caption.__docgenInfo={description:"",methods:[],displayName:"Caption"};const button_group_stories={title:"Components/Button Group",parameters:{notes:"Allows to group several buttons.",zeplinLink:"https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc709f3bcaad55fd8530"}},buttonGroup=()=>(0,jsx_runtime.jsxs)("div",{className:"container",children:[(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsxs)(button_group.A,{children:[(0,jsx_runtime.jsx)(button_button.Ay,{children:"1st button"}),(0,jsx_runtime.jsx)(button_button.Ay,{active:!0,children:"2nd button"}),(0,jsx_runtime.jsx)(button_button.Ay,{disabled:!0,children:"3rd button"}),(0,jsx_runtime.jsx)(button_button.Ay,{disabled:!0,active:!0,children:"4th button"}),(0,jsx_runtime.jsx)(button_button.Ay,{children:"5th button"})]})}),(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsxs)(button_group.A,{children:[(0,jsx_runtime.jsx)(button_button.Ay,{disabled:!0,children:"1st disabled"}),(0,jsx_runtime.jsx)(button_button.Ay,{disabled:!0,active:!0,children:"2nd disabled"}),(0,jsx_runtime.jsx)(button_button.Ay,{disabled:!0,children:"3rd disabled"})]})}),(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)(Caption,{children:"Side:"}),(0,jsx_runtime.jsxs)(button_group.A,{children:[(0,jsx_runtime.jsx)(button_button.Ay,{children:"Left"}),(0,jsx_runtime.jsx)(button_button.Ay,{children:"Right"})]})]}),(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsxs)(button_group.A,{children:[(0,jsx_runtime.jsx)("span",{children:(0,jsx_runtime.jsx)(button_button.Ay,{children:"1st button"})}),(0,jsx_runtime.jsx)("span",{children:(0,jsx_runtime.jsx)(button_button.Ay,{children:"2nd button"})}),(0,jsx_runtime.jsx)(button_button.Ay,{children:"3rd button"})]})}),(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsxs)(button_group.A,{split:!0,children:[(0,jsx_runtime.jsx)(button_button.Ay,{children:"Split"}),(0,jsx_runtime.jsx)(button_button.Ay,{short:!0,children:"..."})]})}),(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsxs)(button_group.A,{split:!0,children:[(0,jsx_runtime.jsx)(button_button.Ay,{primary:!0,children:"Primary"}),(0,jsx_runtime.jsx)(button_button.Ay,{primary:!0,short:!0,children:"..."})]})}),(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsxs)(button_group.A,{children:[(0,jsx_runtime.jsxs)(button_button.Ay,{children:["All",(0,jsx_runtime.jsx)("span",{className:"info",children:"3048"})]}),(0,jsx_runtime.jsxs)(button_button.Ay,{children:["Label",(0,jsx_runtime.jsx)("span",{className:"info",children:"rp34"})]}),(0,jsx_runtime.jsx)(button_button.Ay,{children:"Label 3"})]})}),(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsxs)(button_group.A,{label:"Label",help:"Help text",children:[(0,jsx_runtime.jsx)(button_button.Ay,{children:"Label 1"}),(0,jsx_runtime.jsx)(button_button.Ay,{children:"Label 2"}),(0,jsx_runtime.jsx)(button_button.Ay,{children:"Label 3"})]})})]});buttonGroup.parameters={storyStyles:"\n    <style>\n      .container > div {\n        margin: 1em 0;\n      }\n      .info {\n        color: var(--ring-secondary-color);\n        margin-left: calc(var(--ring-unit) / 2);\n      }\n    </style>\n  "},buttonGroup.parameters={...buttonGroup.parameters,docs:{...buttonGroup.parameters?.docs,source:{originalSource:'() => <div className="container">\n    <div>\n      <ButtonGroup>\n        <Button>1st button</Button>\n        <Button active>2nd button</Button>\n        <Button disabled>3rd button</Button>\n        <Button disabled active>4th button</Button>\n        <Button>5th button</Button>\n      </ButtonGroup>\n    </div>\n    <div>\n      <ButtonGroup>\n        <Button disabled>1st disabled</Button>\n        <Button disabled active>2nd disabled</Button>\n        <Button disabled>3rd disabled</Button>\n      </ButtonGroup>\n    </div>\n    <div>\n      <Caption>Side:</Caption>\n      <ButtonGroup>\n        <Button>Left</Button>\n        <Button>Right</Button>\n      </ButtonGroup>\n    </div>\n    <div>\n      <ButtonGroup>\n        <span>\n          <Button>1st button</Button>\n        </span>\n        <span>\n          <Button>2nd button</Button>\n        </span>\n        <Button>3rd button</Button>\n      </ButtonGroup>\n    </div>\n    <div>\n      <ButtonGroup split>\n        <Button>Split</Button>\n        <Button short>...</Button>\n      </ButtonGroup>\n    </div>\n    <div>\n      <ButtonGroup split>\n        <Button primary>Primary</Button>\n        <Button primary short>...</Button>\n      </ButtonGroup>\n    </div>\n    <div>\n      <ButtonGroup>\n        <Button>All<span className="info">3048</span></Button>\n        <Button>Label<span className="info">rp34</span></Button>\n        <Button>Label 3</Button>\n      </ButtonGroup>\n    </div>\n    <div>\n      <ButtonGroup label="Label" help="Help text">\n        <Button>Label 1</Button>\n        <Button>Label 2</Button>\n        <Button>Label 3</Button>\n      </ButtonGroup>\n    </div>\n  </div>',...buttonGroup.parameters?.docs?.source}}}},"./src/control-help/control-help.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>ControlHelp});var classnames__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__),_control_help_css__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/control-help/control-help.css"),_control_help_css__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_control_help_css__WEBPACK_IMPORTED_MODULE_1__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");function ControlHelp({className,...restProps}){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div",{className:classnames__WEBPACK_IMPORTED_MODULE_0___default()(className,_control_help_css__WEBPACK_IMPORTED_MODULE_1___default().help),...restProps})}ControlHelp.__docgenInfo={description:"",methods:[],displayName:"ControlHelp"}},"./src/control-label/control-label.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Ay:()=>__WEBPACK_DEFAULT_EXPORT__,HD:()=>LabelType,mq:()=>ControlLabel});__webpack_require__("./node_modules/react/index.js");var classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_control_label_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/control-label/control-label.css"),_control_label_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_control_label_css__WEBPACK_IMPORTED_MODULE_2__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/jsx-runtime.js");let LabelType=function(LabelType){return LabelType.SECONDARY="secondary",LabelType.FORM="form",LabelType}({});const classNameByType={[LabelType.SECONDARY]:_control_label_css__WEBPACK_IMPORTED_MODULE_2___default().secondaryLabel,[LabelType.FORM]:_control_label_css__WEBPACK_IMPORTED_MODULE_2___default().formLabel},ControlLabel=({children,type=LabelType.SECONDARY,disabled,...rest})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("label",{className:classnames__WEBPACK_IMPORTED_MODULE_1___default()(_control_label_css__WEBPACK_IMPORTED_MODULE_2___default().label,classNameByType[type],{[_control_label_css__WEBPACK_IMPORTED_MODULE_2___default().disabledLabel]:disabled}),...rest,children}),__WEBPACK_DEFAULT_EXPORT__=ControlLabel;ControlLabel.__docgenInfo={description:"",methods:[],displayName:"ControlLabel",props:{disabled:{required:!1,tsType:{name:"boolean"},description:""},type:{required:!1,tsType:{name:"LabelType"},description:"",defaultValue:{value:"LabelType.SECONDARY",computed:!0}}},composes:["LabelHTMLAttributes"]}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/control-help/control-help.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,".help_cb69 {\n  color: var(--ring-secondary-color);\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: var(--ring-line-height-lowest);\n}\n","",{version:3,sources:["webpack://./src/control-help/control-help.css"],names:[],mappings:"AAEA;EACE,kCAAkC;;EAElC,wCAAwC;EACxC,2CAA2C;AAC7C",sourcesContent:['@import "../global/variables.css";\n\n.help {\n  color: var(--ring-secondary-color);\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: var(--ring-line-height-lowest);\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={help:"help_cb69"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/control-label/control-label.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".label_c07a {\n  display: block;\n\n  margin-bottom: calc(var(--ring-unit)*0.5);\n}\n\n.formLabel_d08a {\n  color: var(--ring-text-color);\n\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}\n\n.secondaryLabel_d40c {\n  color: var(--ring-secondary-color);\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: var(--ring-line-height-lowest);\n}\n\n.disabledLabel_fd92 {\n  color: var(--ring-disabled-color);\n}\n","",{version:3,sources:["webpack://./src/control-label/control-label.css"],names:[],mappings:"AAAA;EACE,cAAc;;EAEd,yCAA2C;AAC7C;;AAEA;EACE,6BAA6B;;EAE7B,gCAAgC;EAChC,oCAAoC;AACtC;;AAEA;EACE,kCAAkC;;EAElC,wCAAwC;EACxC,2CAA2C;AAC7C;;AAEA;EACE,iCAAiC;AACnC",sourcesContent:[".label {\n  display: block;\n\n  margin-bottom: calc(var(--ring-unit) * 0.5);\n}\n\n.formLabel {\n  color: var(--ring-text-color);\n\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}\n\n.secondaryLabel {\n  color: var(--ring-secondary-color);\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: var(--ring-line-height-lowest);\n}\n\n.disabledLabel {\n  color: var(--ring-disabled-color);\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={label:"label_c07a",formLabel:"formLabel_d08a",secondaryLabel:"secondaryLabel_d40c",disabledLabel:"disabledLabel_fd92"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/control-help/control-help.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/control-help/control-help.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/control-label/control-label.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/control-label/control-label.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./node_modules/util-deprecate/browser.js":(module,__unused_webpack_exports,__webpack_require__)=>{function config(name){try{if(!__webpack_require__.g.localStorage)return!1}catch(_){return!1}var val=__webpack_require__.g.localStorage[name];return null!=val&&"true"===String(val).toLowerCase()}module.exports=function deprecate(fn,msg){if(config("noDeprecation"))return fn;var warned=!1;return function deprecated(){if(!warned){if(config("throwDeprecation"))throw new Error(msg);config("traceDeprecation")?console.trace(msg):console.warn(msg),warned=!0}return fn.apply(this,arguments)}}}}]);