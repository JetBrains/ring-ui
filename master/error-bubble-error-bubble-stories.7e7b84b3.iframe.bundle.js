(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[182],{"./node_modules/@jetbrains/icons/chevron-10px.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><g><polygon points="5 7.99 1.5 4.5 2.5 3.5 5 6.01 7.5 3.5 8.49 4.5 5 7.99"/></g></svg>'},"./node_modules/@jetbrains/icons/close.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M13.442 2.558a.625.625 0 0 1 0 .884L8.883 8.006l4.546 4.552a.625.625 0 1 1-.884.884L8 8.89l-4.545 4.55a.625.625 0 0 1-.884-.883l4.546-4.552-4.56-4.564a.625.625 0 1 1 .885-.884L8 7.122l4.558-4.564a.625.625 0 0 1 .884 0Z" clip-rule="evenodd"/></svg>'},"./src/error-bubble/error-bubble.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:()=>basic,default:()=>error_bubble_stories,inDialogForm:()=>inDialogForm});var react=__webpack_require__("./node_modules/react/index.js"),select_select=__webpack_require__("./src/select/select.tsx"),dialog=__webpack_require__("./src/dialog/dialog.tsx"),header=__webpack_require__("./src/island/header.tsx"),content=__webpack_require__("./src/island/content.tsx"),classnames=(__webpack_require__("./src/form/form.css"),__webpack_require__("./src/input-size/input-size.css"),__webpack_require__("./node_modules/classnames/index.js")),classnames_default=__webpack_require__.n(classnames),popup=__webpack_require__("./src/popup/popup.tsx"),popup_consts=__webpack_require__("./src/popup/popup.consts.ts"),error_bubble=__webpack_require__("./src/error-bubble/error-bubble.css"),error_bubble_default=__webpack_require__.n(error_bubble),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");class ErrorBubble extends react.PureComponent{render(){const{children,className,...restProps}=this.props,errorBubbleClasses=classnames_default()(error_bubble_default().errorBubble,className);return(0,jsx_runtime.jsxs)("div",{className:error_bubble_default().errorBubbleWrapper,children:[react.Children.map(children,(child=>(0,react.cloneElement)(child,{...child.props,...restProps}))),restProps.error&&(0,jsx_runtime.jsx)(popup.Ay,{trapFocus:!1,className:error_bubble_default().errorBubblePopup,hidden:!1,attached:!1,directions:[popup_consts.HO.RIGHT_CENTER,popup_consts.HO.RIGHT_BOTTOM,popup_consts.HO.RIGHT_TOP],children:(0,jsx_runtime.jsx)("div",{className:errorBubbleClasses,"data-test":"ring-error-bubble",children:restProps.error})})]})}}ErrorBubble.__docgenInfo={description:"@name Error Bubble",methods:[],displayName:"ErrorBubble",props:{className:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""},children:{required:!0,tsType:{name:"union",raw:"ReactElement<P> | ReactElement<P>[]",elements:[{name:"ReactElement",elements:[{name:"P"}],raw:"ReactElement<P>"},{name:"Array",elements:[{name:"ReactElement",elements:[{name:"P"}],raw:"ReactElement<P>"}],raw:"ReactElement<P>[]"}]},description:""},error:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""}}};const error_bubble_stories={title:"Components/ErrorBubble",parameters:{notes:"Displays an error bubble near the wrapped input component when a non-empty string is passed to the `error` prop. * Passes any prop except `className` down to the input."}},basic=()=>{class ErrorBubbleDemo extends react.Component{state={value:null};render(){const{value}=this.state;return(0,jsx_runtime.jsx)("div",{style:{height:32},children:(0,jsx_runtime.jsx)(ErrorBubble,{error:value?null:"Value is required",onSelect:selected=>this.setState({value:selected}),inputPlaceholder:"enter something",children:(0,jsx_runtime.jsx)(select_select.Ay,{type:select_select.Ay.Type.BUTTON,size:select_select.Ay.Size.M,data:[{key:0,label:"One"},{key:1,label:"Two"}]})})})}}return(0,jsx_runtime.jsx)(ErrorBubbleDemo,{})};basic.storyName="basic";const inDialogForm=()=>{class ErrorBubbleDemo extends react.Component{state={value:null};render(){const{value}=this.state;return(0,jsx_runtime.jsxs)(dialog.A,{label:"Dialog",show:!0,children:[(0,jsx_runtime.jsx)(header.A,{children:"Dialog example"}),(0,jsx_runtime.jsx)(content.A,{children:(0,jsx_runtime.jsx)("form",{className:"ring-form",children:(0,jsx_runtime.jsxs)("div",{className:"ring-form__group",children:[(0,jsx_runtime.jsx)("label",{htmlFor:"select",className:"ring-form__label",children:"Field name"}),(0,jsx_runtime.jsx)("div",{className:"ring-form__control ring-form__control_small",children:(0,jsx_runtime.jsx)(ErrorBubble,{error:value?null:"Value is required",onSelect:selected=>this.setState({value:selected}),inputPlaceholder:"enter something",children:(0,jsx_runtime.jsx)(select_select.Ay,{id:"select",type:select_select.Ay.Type.BUTTON,size:select_select.Ay.Size.M,data:[{key:0,label:"One"},{key:1,label:"Two"}]})})})]})})})]})}}return(0,jsx_runtime.jsx)(ErrorBubbleDemo,{})};inDialogForm.storyName="in dialog form",inDialogForm.parameters={screenshots:{captureSelector:["*[data-test~=ring-dialog]","*[data-test~=ring-error-bubble]"]},a11y:{element:"#storybook-root,*[data-test~=ring-dialog],*[data-test~=ring-error-bubble]"}},basic.parameters={...basic.parameters,docs:{...basic.parameters?.docs,source:{originalSource:"() => {\n  class ErrorBubbleDemo extends Component {\n    state = {\n      value: null\n    };\n    render() {\n      const {\n        value\n      } = this.state;\n      return <div style={{\n        height: 32\n      }}>\n          <ErrorBubble<SingleSelectAttrs> error={value ? null : 'Value is required'} onSelect={selected => this.setState({\n          value: selected\n        })} inputPlaceholder=\"enter something\">\n            <Select type={Select.Type.BUTTON} size={Select.Size.M} data={[{\n            key: 0,\n            label: 'One'\n          }, {\n            key: 1,\n            label: 'Two'\n          }]} />\n          </ErrorBubble>\n        </div>;\n    }\n  }\n  return <ErrorBubbleDemo />;\n}",...basic.parameters?.docs?.source}}},inDialogForm.parameters={...inDialogForm.parameters,docs:{...inDialogForm.parameters?.docs,source:{originalSource:'() => {\n  class ErrorBubbleDemo extends Component {\n    state = {\n      value: null\n    };\n    render() {\n      const {\n        value\n      } = this.state;\n      return <Dialog label="Dialog" show>\n          <Header>Dialog example</Header>\n          <Content>\n            <form className="ring-form">\n              <div className="ring-form__group">\n                <label htmlFor="select" className="ring-form__label">Field name</label>\n                <div className="ring-form__control ring-form__control_small">\n                  <ErrorBubble<SingleSelectAttrs> error={value ? null : \'Value is required\'} onSelect={selected => this.setState({\n                  value: selected\n                })} inputPlaceholder="enter something">\n                    <Select id="select" type={Select.Type.BUTTON} size={Select.Size.M} data={[{\n                    key: 0,\n                    label: \'One\'\n                  }, {\n                    key: 1,\n                    label: \'Two\'\n                  }]} />\n                  </ErrorBubble>\n                </div>\n              </div>\n            </form>\n          </Content>\n        </Dialog>;\n    }\n  }\n  return <ErrorBubbleDemo />;\n}',...inDialogForm.parameters?.docs?.source}}}},"./src/island/header.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_global_linear_function__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/global/linear-function.ts"),_island_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/island/island.css"),_island_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_island_css__WEBPACK_IMPORTED_MODULE_2__),_adaptive_island_hoc__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/island/adaptive-island-hoc.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Start={FONT_SIZE:24,LINE_HEIGHT:28,PADDING_TOP:24,PADDING_BOTTOM:0,X:0,Y:0,SPACING:0},End={FONT_SIZE:13,LINE_HEIGHT:20,PADDING_TOP:16,PADDING_BOTTOM:8,X:.4,Y:.1,SPACING:1.09};class Header extends react__WEBPACK_IMPORTED_MODULE_0__.Component{static defaultProps={wrapWithTitle:!0};style(name){var _this$props$phase;return(0,_global_linear_function__WEBPACK_IMPORTED_MODULE_4__.h)(Start[name],End[name],null!==(_this$props$phase=this.props.phase)&&void 0!==_this$props$phase?_this$props$phase:0)}render(){const{children,className,wrapWithTitle,border,phase,...restProps}=this.props,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_island_css__WEBPACK_IMPORTED_MODULE_2___default().header,className,{[_island_css__WEBPACK_IMPORTED_MODULE_2___default().withBottomBorder]:border||null!=phase&&phase>=.5}),headerStyle=null!=phase?{lineHeight:`${this.style("LINE_HEIGHT")}px`,paddingTop:this.style("PADDING_TOP"),paddingBottom:this.style("PADDING_BOTTOM")}:void 0,scaleFont=null!=phase&&this.style("FONT_SIZE")/Start.FONT_SIZE,titleStyle=null!=phase&&phase<1?{fontSize:Start.FONT_SIZE,transform:`translate(${this.style("X")}px, ${this.style("Y")}px) scale(${scaleFont})`,letterSpacing:this.style("SPACING")}:void 0;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div",{...restProps,"data-test":"ring-island-header",className:classes,style:headerStyle,children:[wrapWithTitle&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h2",{className:_island_css__WEBPACK_IMPORTED_MODULE_2___default().title,style:titleStyle,children}),!wrapWithTitle&&children]})}}const HeaderWrapper=props=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_adaptive_island_hoc__WEBPACK_IMPORTED_MODULE_5__.L6.Consumer,{children:phase=>{const addProps=null!=phase?{phase}:{};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Header,{...props,...addProps})}}),__WEBPACK_DEFAULT_EXPORT__=HeaderWrapper;HeaderWrapper.__docgenInfo={description:"",methods:[],displayName:"HeaderWrapper",props:{wrapWithTitle:{required:!1,tsType:{name:"union",raw:"boolean | undefined",elements:[{name:"boolean"},{name:"undefined"}]},description:""},border:{required:!1,tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]},description:""},phase:{required:!1,tsType:{name:"union",raw:"number | undefined",elements:[{name:"number"},{name:"undefined"}]},description:""}},composes:["HTMLAttributes"]}},"./src/loader-inline/loader-inline.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_global_data_tests__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/global/data-tests.ts"),_loader_inline_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/loader-inline/loader-inline.css"),_loader_inline_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_loader_inline_css__WEBPACK_IMPORTED_MODULE_2__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/jsx-runtime.js");class LoaderInline extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{render(){const{className,"data-test":dataTest,children,...restProps}=this.props,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_loader_inline_css__WEBPACK_IMPORTED_MODULE_2___default().loader,className),loader=(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div",{...restProps,"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_4__.A)("ring-loader-inline",dataTest),className:classes});return children?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment,{children:[loader,(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span",{className:_loader_inline_css__WEBPACK_IMPORTED_MODULE_2___default().children,children})]}):loader}}const __WEBPACK_DEFAULT_EXPORT__=LoaderInline;LoaderInline.__docgenInfo={description:"@name Loader Inline",methods:[],displayName:"LoaderInline",props:{"data-test":{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""}},composes:["HTMLAttributes"]}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/error-bubble/error-bubble.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,'.errorBubblePopup_a70e {\n  overflow: visible;\n\n  margin-left: 2px;\n\n  border: none;\n\n  box-shadow: none;\n}\n\n.errorBubbleWrapper_c842 {\n  display: inline-block;\n}\n\n.errorBubble_ad42 {\n  box-sizing: border-box;\n  min-height: calc(var(--ring-unit)*4);\n  padding: calc(var(--ring-unit) - 1px) calc(var(--ring-unit)*1.5 - 1px);\n\n  white-space: nowrap;\n\n  color: var(--ring-error-color);\n\n  border: 1px solid var(--ring-popup-border-color);\n  border-radius: var(--ring-border-radius);\n\n  background: var(--ring-popup-background-color);\n  box-shadow: var(--ring-popup-shadow);\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: var(--ring-line-height-lowest);\n}\n\n.errorBubble_ad42::before {\n  position: absolute;\n  top: calc(var(--ring-unit)*1.5);\n  left: -4px;\n\n  display: block;\n\n  width: var(--ring-unit);\n  height: var(--ring-unit);\n\n  content: "";\n  transform: rotate(45deg);\n\n  border: 1px solid var(--ring-popup-border-color);\n  border-top: none;\n  border-right: none;\n  background: var(--ring-popup-background-color);\n}\n',"",{version:3,sources:["webpack://./src/error-bubble/error-bubble.css"],names:[],mappings:"AAEA;EACE,iBAAiB;;EAEjB,gBAAgB;;EAEhB,YAAY;;EAEZ,gBAAgB;AAClB;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,sBAAsB;EACtB,oCAAsC;EACtC,sEAAwE;;EAExE,mBAAmB;;EAEnB,8BAA8B;;EAE9B,gDAAgD;EAChD,wCAAwC;;EAExC,8CAA8C;EAC9C,oCAAoC;;EAEpC,wCAAwC;EACxC,2CAA2C;AAC7C;;AAEA;EACE,kBAAkB;EAClB,+BAAiC;EACjC,UAAU;;EAEV,cAAc;;EAEd,uBAAuB;EACvB,wBAAwB;;EAExB,WAAW;EACX,wBAAwB;;EAExB,gDAAgD;EAChD,gBAAgB;EAChB,kBAAkB;EAClB,8CAA8C;AAChD",sourcesContent:['@import "../global/variables.css";\n\n.errorBubblePopup {\n  overflow: visible;\n\n  margin-left: 2px;\n\n  border: none;\n\n  box-shadow: none;\n}\n\n.errorBubbleWrapper {\n  display: inline-block;\n}\n\n.errorBubble {\n  box-sizing: border-box;\n  min-height: calc(var(--ring-unit) * 4);\n  padding: calc(var(--ring-unit) - 1px) calc(var(--ring-unit) * 1.5 - 1px);\n\n  white-space: nowrap;\n\n  color: var(--ring-error-color);\n\n  border: 1px solid var(--ring-popup-border-color);\n  border-radius: var(--ring-border-radius);\n\n  background: var(--ring-popup-background-color);\n  box-shadow: var(--ring-popup-shadow);\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: var(--ring-line-height-lowest);\n}\n\n.errorBubble::before {\n  position: absolute;\n  top: calc(var(--ring-unit) * 1.5);\n  left: -4px;\n\n  display: block;\n\n  width: var(--ring-unit);\n  height: var(--ring-unit);\n\n  content: "";\n  transform: rotate(45deg);\n\n  border: 1px solid var(--ring-popup-border-color);\n  border-top: none;\n  border-right: none;\n  background: var(--ring-popup-background-color);\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={errorBubblePopup:"errorBubblePopup_a70e",errorBubbleWrapper:"errorBubbleWrapper_c842",errorBubble:"errorBubble_ad42"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/loader-inline/loader-inline.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_dark_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables_dark.css"),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__.default),___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_dark_css__WEBPACK_IMPORTED_MODULE_2__.default,"",!0),___CSS_LOADER_EXPORT___.push([module.id,`:root {\n  /* stylelint-disable-next-line color-no-hex */\n  --ring-loader-inline-stops: #ff00eb, #bd3bff, #008eff, #58ba00, #f48700, #ff00eb;\n}\n\n.${_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_dark_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.dark},\n.ring-ui-theme-dark {\n  /* stylelint-disable-next-line color-no-hex */\n  --ring-loader-inline-stops: #ff2eef, #d178ff, #289fff, #88d444, #ffe000, #ff2eef;\n}\n\n@keyframes spin_c5fc {\n  0% {\n    transform: rotate(0);\n  }\n\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes pulse_d8f9 {\n  0% {\n    transform: scale(1);\n  }\n\n  100% {\n    transform: scale(1.41667);\n  }\n}\n\n.loader_f65a,\n.ring-loader-inline {\n  /* needed for better backward-compatibility */\n\n  position: relative;\n\n  display: inline-block;\n\n  overflow: hidden;\n\n  transform: rotate(0);\n  animation: spin_c5fc 1s linear infinite;\n  vertical-align: -3px;\n\n  border-radius: var(--ring-unit);\n}\n\n:is(.loader_f65a,.ring-loader-inline),:is(.loader_f65a,.ring-loader-inline)::after {\n    transform-origin: 50% 50%;\n  }\n\n:is(.loader_f65a,.ring-loader-inline)::after {\n    display: block;\n\n    width: calc(var(--ring-unit)*2);\n    height: calc(var(--ring-unit)*2);\n\n    content: "";\n    animation: pulse_d8f9 0.85s cubic-bezier(0.68, 0, 0.74, 0.74) infinite alternate;\n\n    background-image: conic-gradient(var(--ring-loader-inline-stops));\n    -webkit-mask-image: radial-gradient(var(--ring-unit), transparent 71.875%, var(--ring-content-background-color) 71.875%);\n            mask-image: radial-gradient(var(--ring-unit), transparent 71.875%, var(--ring-content-background-color) 71.875%);\n  }\n\n.children_d816 {\n  margin-left: calc(var(--ring-unit)/2);\n}\n`,"",{version:3,sources:["webpack://./src/loader-inline/loader-inline.css"],names:[],mappings:"AAIA;EACE,6CAA6C;EAC7C,gFAAgF;AAClF;;AAEA;;EAEE,6CAA6C;EAC7C,gFAAgF;AAClF;;AAEA;EACE;IACE,oBAAoB;EACtB;;EAEA;IACE,yBAAyB;EAC3B;AACF;;AAEA;EACE;IACE,mBAAmB;EACrB;;EAEA;IACE,yBAA+B;EACjC;AACF;;AAEA;;EAEE,6CAA6C;;EAE7C,kBAAkB;;EAElB,qBAAqB;;EAErB,gBAAgB;;EAEhB,oBAAoB;EACpB,uCAAkC;EAClC,oBAAoB;;EAEpB,+BAA+B;AAmBjC;;AAjBE;IAEE,yBAAyB;EAC3B;;AAEA;IACE,cAAc;;IAEd,+BAAiC;IACjC,gCAAkC;;IAElC,WAAW;IACX,gFAA2E;;IAE3E,iEAAiE;IACjE,wHAAgH;YAAhH,gHAAgH;EAClH;;AAGF;EACE,qCAAuC;AACzC",sourcesContent:['@import "../global/variables.css";\n\n@value dark from "../global/variables_dark.css";\n\n:root {\n  /* stylelint-disable-next-line color-no-hex */\n  --ring-loader-inline-stops: #ff00eb, #bd3bff, #008eff, #58ba00, #f48700, #ff00eb;\n}\n\n.dark,\n:global(.ring-ui-theme-dark) {\n  /* stylelint-disable-next-line color-no-hex */\n  --ring-loader-inline-stops: #ff2eef, #d178ff, #289fff, #88d444, #ffe000, #ff2eef;\n}\n\n@keyframes spin {\n  0% {\n    transform: rotate(0);\n  }\n\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes pulse {\n  0% {\n    transform: scale(1);\n  }\n\n  100% {\n    transform: scale(calc(17 / 12));\n  }\n}\n\n.loader,\n:global(.ring-loader-inline) {\n  /* needed for better backward-compatibility */\n\n  position: relative;\n\n  display: inline-block;\n\n  overflow: hidden;\n\n  transform: rotate(0);\n  animation: spin 1s linear infinite;\n  vertical-align: -3px;\n\n  border-radius: var(--ring-unit);\n\n  &,\n  &::after {\n    transform-origin: 50% 50%;\n  }\n\n  &::after {\n    display: block;\n\n    width: calc(var(--ring-unit) * 2);\n    height: calc(var(--ring-unit) * 2);\n\n    content: "";\n    animation: pulse 0.85s cubic-bezier(0.68, 0, 0.74, 0.74) infinite alternate;\n\n    background-image: conic-gradient(var(--ring-loader-inline-stops));\n    mask-image: radial-gradient(var(--ring-unit), transparent 71.875%, var(--ring-content-background-color) 71.875%);\n  }\n}\n\n.children {\n  margin-left: calc(var(--ring-unit) / 2);\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={dark:`${_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_dark_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.dark}`,loader:"loader_f65a",spin:"spin_c5fc",pulse:"pulse_d8f9",children:"children_d816"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/error-bubble/error-bubble.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/error-bubble/error-bubble.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/loader-inline/loader-inline.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/loader-inline/loader-inline.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"?4f7e":()=>{}}]);