(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[5886],{"./src/progress-bar/progress-bar.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:()=>basic,default:()=>progress_bar_stories});var react=__webpack_require__("./node_modules/react/index.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),progress_bar=__webpack_require__("./src/progress-bar/progress-bar.css"),progress_bar_default=__webpack_require__.n(progress_bar),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");class ProgressBar extends react.PureComponent{static toPercent(value,max){const percents=100*value/max;return percents>100?100:percents}static propTypes={label:prop_types_default().string,global:prop_types_default().bool,className:prop_types_default().string,style:prop_types_default().object,max:prop_types_default().number,value:prop_types_default().number,staticColor:prop_types_default().bool};static defaultProps={max:1,value:0,label:"Progress"};progressbarWrapper;progressbarWrapperRef=el=>{this.progressbarWrapper=el};progressbar;progressbarRef=el=>{this.progressbar=el};render(){const{className,global,max,value,label,staticColor,...otherProps}=this.props,width=value?`${ProgressBar.toPercent(value,max)}%`:void 0,classes=classnames_default()(progress_bar_default().progressBar,className,{[progress_bar_default().globalMode]:global,[progress_bar_default().staticLineColor]:staticColor});return(0,jsx_runtime.jsx)("div",{...otherProps,className:classes,ref:this.progressbarWrapperRef,children:(0,jsx_runtime.jsx)("div",{className:progress_bar_default().line,ref:this.progressbarRef,role:"progressbar","aria-label":label,"aria-valuenow":value,"aria-valuemin":0,"aria-valuemax":max,style:{width}})})}}ProgressBar.__docgenInfo={description:"@name Progress Bar",methods:[{name:"toPercent",docblock:"@param {number} value The progress task value\n@param {number} max The maximum value\n@return {number} The progress task value in percents\n@private",modifiers:["static"],params:[{name:"value",description:"The progress task value",type:{name:"number"},optional:!1},{name:"max",description:"The maximum value",type:{name:"number"},optional:!1}],returns:{description:"The progress task value in percents",type:{name:"number"}},description:null},{name:"progressbarWrapperRef",docblock:null,modifiers:[],params:[{name:"el",optional:!1,type:{name:"union",raw:"HTMLElement | null",elements:[{name:"HTMLElement"},{name:"null"}]}}],returns:null},{name:"progressbarRef",docblock:null,modifiers:[],params:[{name:"el",optional:!1,type:{name:"union",raw:"HTMLElement | null",elements:[{name:"HTMLElement"},{name:"null"}]}}],returns:null}],displayName:"ProgressBar",props:{max:{required:!1,tsType:{name:"number"},description:"A floating point number that specifies minimum completion rate for a task to be considered\ncomplete. Default value is 1.0.\n@type {number}",defaultValue:{value:"1.0",computed:!1},type:{name:"number"}},value:{required:!1,tsType:{name:"number"},description:"A floating point number that specifies current task completion rate.\n@type {number}",defaultValue:{value:"0",computed:!1},type:{name:"number"}},label:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Progress'",computed:!1},type:{name:"string"}},global:{required:!1,tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]},description:"Sets the ring-progress-bar_global class to position the progress bar on top of the screen.\nShould be placed directly inside body, will be positioned right below .ring-header\nif placed adjacent to it.\n@type {boolean}",type:{name:"bool"}},staticColor:{required:!1,tsType:{name:"boolean"},description:"Disables Disabled progress bar color animation and sets it to static color.\n@type {boolean}",type:{name:"bool"}},className:{description:"Custom class\n@type {string}",type:{name:"string"},required:!1},style:{description:"",type:{name:"object"},required:!1}},composes:["HTMLAttributes"]};const disableAnimations=window.location.search.includes("block-animations"),progress_bar_stories={title:"Components/Progress Bar"},basic=()=>{class ProgressBarDemo extends react.Component{state={value:disableAnimations?.5:0};componentDidMount(){disableAnimations||setInterval((()=>this.setState((({value})=>({value:value>=1?0:value+.1})))),500)}render(){const{value}=this.state;return(0,jsx_runtime.jsxs)("div",{children:[(0,jsx_runtime.jsx)("div",{style:{height:"25px",paddingTop:"25px"},children:(0,jsx_runtime.jsx)(ProgressBar,{label:"Progress",value,style:{width:288}})}),(0,jsx_runtime.jsx)("div",{style:{height:"25px",paddingTop:"25px",background:"#F0F0F0"},children:(0,jsx_runtime.jsx)(ProgressBar,{label:"Progress",value,style:{width:288}})}),(0,jsx_runtime.jsx)("div",{style:{height:"25px",paddingTop:"25px"},children:(0,jsx_runtime.jsx)(ProgressBar,{label:"Progress",value:.5,staticColor:!0,style:{width:288}})})]})}}return(0,jsx_runtime.jsx)(ProgressBarDemo,{})};basic.storyName="Progress Bar",basic.parameters={...basic.parameters,docs:{...basic.parameters?.docs,source:{originalSource:"() => {\n  interface ProgressBarDemoState {\n    value: number;\n  }\n  class ProgressBarDemo extends Component<{}, ProgressBarDemoState> {\n    state = {\n      value: disableAnimations ? 0.5 : 0\n    };\n    componentDidMount() {\n      if (disableAnimations) {\n        return;\n      }\n      setInterval(() => this.setState(({\n        value\n      }) => ({\n        value: value >= 1 ? 0 : value + 0.1\n      })), 500);\n    }\n    render() {\n      const {\n        value\n      } = this.state;\n      return <div>\n          <div style={{\n          height: '25px',\n          paddingTop: '25px'\n        }}>\n            <ProgressBar label=\"Progress\" value={value} style={{\n            width: 288\n          }} />\n          </div>\n\n          <div style={{\n          height: '25px',\n          paddingTop: '25px',\n          background: '#F0F0F0'\n        }}>\n            <ProgressBar label=\"Progress\" value={value} style={{\n            width: 288\n          }} />\n          </div>\n\n          <div style={{\n          height: '25px',\n          paddingTop: '25px'\n        }}>\n            <ProgressBar label=\"Progress\" value={0.5} staticColor style={{\n            width: 288\n          }} />\n          </div>\n\n        </div>;\n    }\n  }\n  return <ProgressBarDemo />;\n}",...basic.parameters?.docs?.source}}}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/progress-bar/progress-bar.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_dark_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables_dark.css"),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__.default),___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_dark_css__WEBPACK_IMPORTED_MODULE_2__.default,"",!0),___CSS_LOADER_EXPORT___.push([module.id,`:root {\n  --ring-progress-bar-background-color: rgba(0, 0, 0, 0.2);\n  --ring-progress-bar-line-background-color: rgba(255, 255, 255, 0.6);\n}\n\n.${_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_dark_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.dark},\n.ring-ui-theme-dark {\n  --ring-progress-bar-background-color: rgba(255, 255, 255, 0.3);\n  --ring-progress-bar-line-background-color: rgba(255, 255, 255, 0.4);\n}\n\n.progressBar_b130 {\n  position: relative;\n  z-index: 1; /* Required to see border-radius on animated background */\n\n  overflow: hidden;\n\n  height: calc(var(--ring-unit)/2);\n  margin-bottom: calc(var(--ring-unit)/2);\n\n  border-radius: 2px;\n  background-color: var(--ring-progress-bar-background-color);\n}\n\n.globalMode_b965 {\n  position: absolute;\n  top: 0;\n\n  width: 100%;\n\n  background: transparent;\n}\n\n.line_a000 {\n  float: left;\n\n  width: 0;\n  height: 100%;\n\n  transition: width 0.6s ease;\n  text-align: center;\n\n  color: var(--ring-content-background-color);\n  border-radius: 2px;\n  background-color: var(--ring-main-color);\n\n  line-height: calc(var(--ring-unit)/2);\n}\n\n.line_a000::after {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n\n    content: "";\n    animation: progress-bar_d193 2500ms linear infinite;\n\n    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), var(--ring-progress-bar-line-background-color), rgba(0, 0, 0, 0));\n    background-repeat: no-repeat;\n  }\n\n.staticLineColor_b390 .line_a000::after  {\n      animation: none;\n\n      background-image: var(--ring-progress-bar-line-background-color);\n    }\n\n@keyframes progress-bar_d193 {\n  from {\n    transform: translateX(-100%);\n  }\n\n  to {\n    transform: translateX(100%);\n  }\n}\n`,"",{version:3,sources:["webpack://./src/progress-bar/progress-bar.css"],names:[],mappings:"AAIA;EACE,wDAAwD;EACxD,mEAAmE;AACrE;;AAEA;;EAEE,8DAA8D;EAC9D,mEAAmE;AACrE;;AAEA;EACE,kBAAkB;EAClB,UAAU,EAAE,yDAAyD;;EAErE,gBAAgB;;EAEhB,gCAAkC;EAClC,uCAAyC;;EAEzC,kBAAkB;EAClB,2DAA2D;AAC7D;;AAEA;EACE,kBAAkB;EAClB,MAAM;;EAEN,WAAW;;EAEX,uBAAuB;AACzB;;AAEA;EACE,WAAW;;EAEX,QAAQ;EACR,YAAY;;EAEZ,2BAA2B;EAC3B,kBAAkB;;EAElB,2CAA2C;EAC3C,kBAAkB;EAClB,wCAAwC;;EAExC,qCAAuC;AAqBzC;;AAnBE;IACE,kBAAkB;IAClB,MAAM;IACN,QAAQ;IACR,SAAS;IACT,OAAO;;IAEP,WAAW;IACX,mDAA8C;;IAE9C,+HAA+H;IAC/H,4BAA4B;EAO9B;;AALE;MACE,eAAe;;MAEf,gEAAgE;IAClE;;AAIJ;EACE;IACE,4BAA4B;EAC9B;;EAEA;IACE,2BAA2B;EAC7B;AACF",sourcesContent:['@import "../global/variables.css";\n\n@value dark from "../global/variables_dark.css";\n\n:root {\n  --ring-progress-bar-background-color: rgba(0, 0, 0, 0.2);\n  --ring-progress-bar-line-background-color: rgba(255, 255, 255, 0.6);\n}\n\n.dark,\n:global(.ring-ui-theme-dark) {\n  --ring-progress-bar-background-color: rgba(255, 255, 255, 0.3);\n  --ring-progress-bar-line-background-color: rgba(255, 255, 255, 0.4);\n}\n\n.progressBar {\n  position: relative;\n  z-index: 1; /* Required to see border-radius on animated background */\n\n  overflow: hidden;\n\n  height: calc(var(--ring-unit) / 2);\n  margin-bottom: calc(var(--ring-unit) / 2);\n\n  border-radius: 2px;\n  background-color: var(--ring-progress-bar-background-color);\n}\n\n.globalMode {\n  position: absolute;\n  top: 0;\n\n  width: 100%;\n\n  background: transparent;\n}\n\n.line {\n  float: left;\n\n  width: 0;\n  height: 100%;\n\n  transition: width 0.6s ease;\n  text-align: center;\n\n  color: var(--ring-content-background-color);\n  border-radius: 2px;\n  background-color: var(--ring-main-color);\n\n  line-height: calc(var(--ring-unit) / 2);\n\n  &::after {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n\n    content: "";\n    animation: progress-bar 2500ms linear infinite;\n\n    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), var(--ring-progress-bar-line-background-color), rgba(0, 0, 0, 0));\n    background-repeat: no-repeat;\n\n    .staticLineColor &  {\n      animation: none;\n\n      background-image: var(--ring-progress-bar-line-background-color);\n    }\n  }\n}\n\n@keyframes progress-bar {\n  from {\n    transform: translateX(-100%);\n  }\n\n  to {\n    transform: translateX(100%);\n  }\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={dark:`${_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_dark_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.dark}`,progressBar:"progressBar_b130",globalMode:"globalMode_b965",line:"line_a000","progress-bar":"progress-bar_d193",staticLineColor:"staticLineColor_b390"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/progress-bar/progress-bar.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/progress-bar/progress-bar.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}}}]);