(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[9413],{"./.storybook/angular-decorator.js":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{i:function(){return APP_NAME}});var angular__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/angular/index.js"),angular__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("@storybook/preview-api");const APP_NAME="ring-ui.story.app",angularDecorator=story=>{const node=document.createElement("div");node.innerHTML=story();const app=angular__WEBPACK_IMPORTED_MODULE_0___default().bootstrap(node,[APP_NAME],{strictDi:!0});return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>()=>{app.get("$rootScope").$destroy(),node.innerHTML=""})),node};__webpack_exports__.Z=()=>angularDecorator},"./src/toggle-ng/toggle-ng.stories.js":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:function(){return basic},default:function(){return toggle_ng_stories}});var angular=__webpack_require__("./node_modules/angular/index.js"),angular_default=__webpack_require__.n(angular),angular_decorator=__webpack_require__("./.storybook/angular-decorator.js"),angular_component_factory=__webpack_require__("./src/global/angular-component-factory.js"),toggle=__webpack_require__("./src/toggle/toggle.tsx"),toggle_ng=(0,angular_component_factory.Z)(toggle.Z,"Toggle").name,toggle_ng_stories={title:"Legacy Angular/Toggle Ng",decorators:[(0,angular_decorator.Z)()],parameters:{storySource:{source:"import angular from 'angular';\n\nimport angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';\n\nimport ToggleNG from './toggle-ng';\n\nexport default {\n  title: 'Legacy Angular/Toggle Ng',\n  decorators: [angularDecorator()],\n\n  parameters: {\n    notes: 'Provides an Angular wrapper for Toggle.'\n  }\n};\n\nexport const basic = () => {\n  angular.module(APP_NAME, [ToggleNG]);\n\n  return '<rg-toggle>Toggle</rg-toggle>';\n};\n\nbasic.storyName = 'Toggle Ng';\n",locationsMap:{basic:{startLoc:{col:21,line:16},endLoc:{col:1,line:20},startBody:{col:21,line:16},endBody:{col:1,line:20}}}},notes:"Provides an Angular wrapper for Toggle."}};const basic=()=>(angular_default().module(angular_decorator.i,[toggle_ng]),"<rg-toggle>Toggle</rg-toggle>");basic.storyName="Toggle Ng"},"./src/global/angular-component-factory.js":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{f:function(){return createAngularComponent},Z:function(){return angular_component_factory}});var angular=__webpack_require__("./node_modules/angular/index.js"),angular_default=__webpack_require__.n(angular),react=__webpack_require__("./node_modules/react/index.js"),react_render_adapter=__webpack_require__("./src/global/react-render-adapter.ts"),ring_angular_component=__webpack_require__("./src/global/ring-angular-component.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types);class Renderer extends react.Component{static propTypes={className:prop_types_default().string,nodes:prop_types_default().oneOfType([prop_types_default().array,prop_types_default().object])};componentDidMount(){const{node:node}=this,{nodes:nodes}=this.props;node&&nodes&&nodes.length&&Array.from(this.props.nodes).forEach((nodeToRender=>node.appendChild(nodeToRender)))}node;nodeRef=node=>{this.node=node};render(){const{className:className}=this.props;return react.createElement("div",{className:className,ref:this.nodeRef})}}function createAngularComponent(Component){const propKeys=Object.keys(Component.propTypes),bindings={};propKeys.forEach((key=>{bindings[key]="<"}));class AngularComponent extends ring_angular_component.Z{static bindings=bindings;static transclude=!0;$postLink(){const{$transclude:$transclude}=this.$inject;$transclude((clone=>{this.container=document.createElement("div");for(let i=0;i<clone.length;i++)this.container.appendChild(clone[i]);this.render()}))}$onChanges(){this.container&&this.render()}$onDestroy(){(0,react_render_adapter.uy)(this.$inject.$element[0])}render(){var _this=this;const{$scope:$scope,$element:{0:container}}=this.$inject,props={};propKeys.forEach((key=>{void 0!==this[key]&&("function"==typeof this[key]?props[key]=function(){const ret=_this[key](...arguments);return $scope.$applyAsync(),ret}:props[key]=this[key])}));const hasInnerContent=this.container.hasChildNodes();(0,react_render_adapter.sY)(react.createElement(Component,props,hasInnerContent?react.createElement(Renderer,{nodes:this.container.childNodes}):null),container)}}return AngularComponent.$inject=["$scope","$element","$transclude"],AngularComponent}Renderer.__docgenInfo={description:"",methods:[{name:"nodeRef",docblock:null,modifiers:[],params:[{name:"node",type:{name:"union",raw:"HTMLElement | null",elements:[{name:"HTMLElement"},{name:"null"}]}}],returns:null}],displayName:"Renderer",props:{className:{type:{name:"string"},required:!1,description:"",tsType:{name:"union",raw:"string | undefined",elements:[{name:"string"},{name:"undefined"}]}},nodes:{type:{name:"union",value:[{name:"array"},{name:"object"}]},required:!0,description:"",tsType:{name:"union",raw:"readonly Node[] | NodeList",elements:[{name:"unknown"},{name:"NodeList"}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/global/react-dom-renderer.tsx"]={name:"Renderer",docgenInfo:Renderer.__docgenInfo,path:"src/global/react-dom-renderer.tsx"});var angular_component_factory=function angularComponentFactory(Component,name){const angularModuleName=`Ring.${name[0].toLowerCase()+name.slice(1)}`;return angular_default().module(angularModuleName,[]).component(function getAngularComponentName(name){return`rg${name}`}(name),createAngularComponent(Component))}},"./src/global/ring-angular-component.js":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{Z:function(){return RingAngularComponent}});class RingAngularComponent{static get controller(){return this}$inject={};constructor(){for(var _this$constructor$$in,_len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++)args[_key]=arguments[_key];(null!==(_this$constructor$$in=this.constructor.$inject)&&void 0!==_this$constructor$$in?_this$constructor$$in:[]).forEach(((injectName,i)=>{this.$inject[injectName]=args[i]}))}}},"./src/toggle/toggle.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{$:function(){return Size}});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_global_data_tests__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/global/data-tests.ts"),_toggle_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/toggle/toggle.css"),_toggle_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_toggle_css__WEBPACK_IMPORTED_MODULE_2__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const Size={Size14:_toggle_css__WEBPACK_IMPORTED_MODULE_2___default().size14,Size16:_toggle_css__WEBPACK_IMPORTED_MODULE_2___default().size16,Size20:_toggle_css__WEBPACK_IMPORTED_MODULE_2___default().size20};class Toggle extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{static propTypes={children:prop_types__WEBPACK_IMPORTED_MODULE_3___default().node,name:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string,className:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string,title:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string,leftLabel:prop_types__WEBPACK_IMPORTED_MODULE_3___default().node,defaultChecked:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,checked:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,disabled:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,pale:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,onChange:prop_types__WEBPACK_IMPORTED_MODULE_3___default().func,onTransitionEnd:prop_types__WEBPACK_IMPORTED_MODULE_3___default().func,size:prop_types__WEBPACK_IMPORTED_MODULE_3___default().oneOf(Object.values(Size)),"data-test":prop_types__WEBPACK_IMPORTED_MODULE_3___default().string};static defaultProps={size:Size.Size14};render(){const{className:className,children:children,disabled:disabled,pale:pale,title:title,leftLabel:leftLabel,size:size=Size.Size16,"data-test":dataTest,onTransitionEnd:onTransitionEnd,...restProps}=this.props,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(className,size,_toggle_css__WEBPACK_IMPORTED_MODULE_2___default().toggle,disabled&&_toggle_css__WEBPACK_IMPORTED_MODULE_2___default().disabled);return react__WEBPACK_IMPORTED_MODULE_0__.createElement("label",{className:classes,title:title,"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_4__.Z)("ring-toggle",dataTest)},leftLabel&&react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{className:_toggle_css__WEBPACK_IMPORTED_MODULE_2___default().leftLabel},leftLabel),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{className:_toggle_css__WEBPACK_IMPORTED_MODULE_2___default().switchWrapper},react__WEBPACK_IMPORTED_MODULE_0__.createElement("input",_extends({"data-test":"ring-toggle-input"},restProps,{type:"checkbox",disabled:disabled,className:_toggle_css__WEBPACK_IMPORTED_MODULE_2___default().input})),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{className:classnames__WEBPACK_IMPORTED_MODULE_1___default()(_toggle_css__WEBPACK_IMPORTED_MODULE_2___default().switch,pale&&_toggle_css__WEBPACK_IMPORTED_MODULE_2___default().paleSwitch),onTransitionEnd:onTransitionEnd})),children&&react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{className:_toggle_css__WEBPACK_IMPORTED_MODULE_2___default().label},children))}}Toggle.__docgenInfo={description:"",methods:[],displayName:"Toggle",props:{size:{defaultValue:{value:"styles.size14",computed:!0},type:{name:"enum",value:[{value:'"null"',computed:!1},{value:'"null"',computed:!1},{value:'"null"',computed:!1}]},required:!1,description:"",tsType:{name:"string"}},children:{type:{name:"node"},required:!1,description:""},name:{type:{name:"string"},required:!1,description:""},className:{type:{name:"string"},required:!1,description:""},title:{type:{name:"string"},required:!1,description:""},leftLabel:{type:{name:"node"},required:!1,description:"",tsType:{name:"ReactNode"}},defaultChecked:{type:{name:"bool"},required:!1,description:""},checked:{type:{name:"bool"},required:!1,description:""},disabled:{type:{name:"bool"},required:!1,description:""},pale:{type:{name:"bool"},required:!1,description:"",tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]}},onChange:{type:{name:"func"},required:!1,description:""},onTransitionEnd:{type:{name:"func"},required:!1,description:""},"data-test":{type:{name:"string"},required:!1,description:"",tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]}}},composes:["Omit"]},__webpack_exports__.Z=Toggle,"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/toggle/toggle.tsx"]={name:"Toggle",docgenInfo:Toggle.__docgenInfo,path:"src/toggle/toggle.tsx"})},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/toggle/toggle.css":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/global/global.css"),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__.default),___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default,"",!0),___CSS_LOADER_EXPORT___.push([module.id,'.toggle_a8a5 {\n  cursor: pointer;\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.toggle_a8a5:hover .switch_f3b6 {\n    transition: none;\n\n    background-color: var(--ring-border-hover-color);\n  }}\n\n.toggle_a8a5.disabled_b68a {\n    pointer-events: none;\n  }\n\n.label_a612 {\n  margin-left: 8px;\n}\n\n.leftLabel_e622 {\n  margin-right: 8px;\n}\n\n.switchWrapper_adf2 {\n  position: relative;\n\n  display: inline-block;\n}\n\n.input_e5d0 {\n  position: absolute;\n  top: 0;\n  left: 0;\n\n  width: 100%;\n  height: 100%;\n\n  margin: 0;\n\n  opacity: 0;\n}\n\n.switch_f3b6 {\n  position: relative;\n\n  display: block;\n\n  width: 100%;\n  height: 100%;\n\n  transition: background-color cubic-bezier(0.23, 1, 0.32, 1) 300ms;\n\n  background-color: var(--ring-icon-color);\n}\n\n.input_e5d0:focus + .switch_f3b6 {\n    box-shadow: inset 0 0 0 1px var(--ring-border-hover-color), 0 0 0 1px var(--ring-border-hover-color);\n  }\n\n.switch_f3b6::before {\n    position: absolute;\n    top: 2px;\n    left: 0;\n\n    width: 12px;\n    height: 12px;\n\n    content: "";\n\n    transition: transform cubic-bezier(0.23, 1, 0.32, 1) 300ms;\n\n    transform: translateX(2px);\n\n    border-radius: 6px;\n    background-color: var(--ring-content-background-color);\n  }\n\n.input_e5d0:checked + .switch_f3b6 {\n  background-color: var(--ring-main-color);\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {:checked:hover + .switch_f3b6 {\n  background-color: var(--ring-main-hover-color);\n}}\n\n.size16_f69a .switchWrapper_adf2 {\n    width: 24px;\n    height: 16px;\n\n    vertical-align: -3px;\n  }\n\n.size16_f69a .switch_f3b6 {\n    border-radius: 8px;\n  }\n\n.size16_f69a .switch_f3b6::before {\n      width: 12px;\n      height: 12px;\n\n      border-radius: 6px;\n    }\n\n/* stylelint-disable-next-line selector-max-specificity */\n\n.size16_f69a .input_e5d0:checked + ::before {\n    transform: translateX(10px);\n  }\n\n.size14_f6be .switchWrapper_adf2 {\n    width: 24px;\n    height: 14px;\n\n    vertical-align: -2px;\n  }\n\n.size14_f6be .switch_f3b6 {\n    border-radius: 7px;\n  }\n\n.size14_f6be .switch_f3b6::before {\n      width: 10px;\n      height: 10px;\n\n      border-radius: 5px;\n    }\n\n/* stylelint-disable-next-line selector-max-specificity */\n\n.size14_f6be .input_e5d0:checked + ::before {\n    transform: translateX(12px);\n  }\n\n.size20_d4b6 .switchWrapper_adf2 {\n    width: 32px;\n    height: 20px;\n\n    vertical-align: -5px;\n  }\n\n.size20_d4b6 .switch_f3b6 {\n    border-radius: 10px;\n  }\n\n.size20_d4b6 .switch_f3b6::before {\n      width: 16px;\n      height: 16px;\n\n      border-radius: 8px;\n    }\n\n/* stylelint-disable-next-line selector-max-specificity */\n\n.size20_d4b6 .input_e5d0:checked + ::before {\n    transform: translateX(14px);\n  }\n\n.input_e5d0[disabled] + ::after {\n  position: absolute;\n  top: 0;\n  left: 0;\n\n  width: 100%;\n  height: 100%;\n\n  content: "";\n\n  border-radius: 8px;\n  background-image:\n    linear-gradient(\n      45deg,\n      transparent,\n      transparent 37.5%,\n      rgba(255, 255, 255, 0.9) 37.5%,\n      rgba(255, 255, 255, 0.9) 50%,\n      transparent 50%,\n      transparent 87.5%,\n      rgba(255, 255, 255, 0.9) 87.5%,\n      rgba(255, 255, 255, 0.9)\n    );\n  background-repeat: repeat;\n  background-size: 4px 4px;\n}\n\n.paleSwitch_dd8e.paleSwitch_dd8e {\n  background-color: var(--ring-pale-control-color);\n}\n\n.input_e5d0:checked + .paleSwitch_dd8e {\n  background-color: var(--ring-border-hover-color);\n}\n',"",{version:3,sources:["webpack://./src/toggle/toggle.css","<no source>"],names:[],mappings:"AAQA;EACE,eAAe;AAWjB;;ACpBA,wGAAA;IAAA,iBAAA;;IAAA,iDAAA;GAAA,CAAA;;ADiBE;IACE,oBAAoB;EACtB;;AAGF;EACE,gBAAiB;AACnB;;AAEA;EACE,iBAAkB;AACpB;;AAEA;EACE,kBAAkB;;EAElB,qBAAqB;AACvB;;AAEA;EACE,kBAAkB;EAClB,MAAM;EACN,OAAO;;EAEP,WAAW;EACX,YAAY;;EAEZ,SAAS;;EAET,UAAU;AACZ;;AAEA;EACE,kBAAkB;;EAElB,cAAc;;EAEd,WAAW;EACX,YAAY;;EAEZ,iEAAqD;;EAErD,wCAAwC;AAuB1C;;AArBE;IACE,oGAAoG;EACtG;;AAEA;IACE,kBAAkB;IAClB,QAAY;IACZ,OAAO;;IAEP,WAAuB;IACvB,YAAwB;;IAExB,WAAW;;IAEX,0DAA8C;;IAE9C,0BAA8B;;IAE9B,kBAAgC;IAChC,sDAAsD;EACxD;;AAGF;EACE,wCAAwC;AAC1C;;ACtFA,wGAAA;EAAA,+CAAA;CAAA,CAAA;;AD6FE;IACE,WAAqB;IACrB,YAAsB;;IAEtB,oBAAoB;EACtB;;AAEA;IACE,kBAAmB;EAQrB;;AANE;MACE,WAAuB;MACvB,YAAwB;;MAExB,kBAAgC;IAClC;;AAGF,yDAAyD;;AACzD;IACE,2BAAiD;EACnD;;AAIA;IACE,WAAqB;IACrB,YAAY;;IAEZ,oBAAoB;EACtB;;AAEA;IACE,kBAAkB;EAQpB;;AANE;MACE,WAAW;MACX,YAAY;;MAEZ,kBAAkB;IACpB;;AAGF,yDAAyD;;AACzD;IACE,2BAA2B;EAC7B;;AAIA;IACE,WAAqB;IACrB,YAAwB;;IAExB,oBAAoB;EACtB;;AAEA;IACE,mBAAgC;EAQlC;;AANE;MACE,WAAqB;MACrB,YAAsB;;MAEtB,kBAAyB;IAC3B;;AAGF,yDAAyD;;AACzD;IACE,2BAA+C;EACjD;;AAGF;EACE,kBAAkB;EAClB,MAAM;EACN,OAAO;;EAEP,WAAW;EACX,YAAY;;EAEZ,WAAW;;EAEX,kBAAmB;EACnB;;;;;;;;;;;KAWG;EACH,yBAAyB;EACzB,wBAAwB;AAC1B;;AAEA;EACE,gDAAgD;AAClD;;AAEA;EACE,gDAAgD;AAClD",sourcesContent:['@import "../global/variables.css";\n\n@value unit from "../global/global.css";\n@value padding: 2px;\n@value disabled-line-color: rgba(255, 255, 255, 0.9);\n@value duration: 300ms;\n@value timing-function: cubic-bezier(0.23, 1, 0.32, 1);\n\n.toggle {\n  cursor: pointer;\n\n  &:hover .switch {\n    transition: none;\n\n    background-color: var(--ring-border-hover-color);\n  }\n\n  &.disabled {\n    pointer-events: none;\n  }\n}\n\n.label {\n  margin-left: unit;\n}\n\n.leftLabel {\n  margin-right: unit;\n}\n\n.switchWrapper {\n  position: relative;\n\n  display: inline-block;\n}\n\n.input {\n  position: absolute;\n  top: 0;\n  left: 0;\n\n  width: 100%;\n  height: 100%;\n\n  margin: 0;\n\n  opacity: 0;\n}\n\n.switch {\n  position: relative;\n\n  display: block;\n\n  width: 100%;\n  height: 100%;\n\n  transition: background-color timing-function duration;\n\n  background-color: var(--ring-icon-color);\n\n  .input:focus + & {\n    box-shadow: inset 0 0 0 1px var(--ring-border-hover-color), 0 0 0 1px var(--ring-border-hover-color);\n  }\n\n  &::before {\n    position: absolute;\n    top: padding;\n    left: 0;\n\n    width: calc(unit * 1.5);\n    height: calc(unit * 1.5);\n\n    content: "";\n\n    transition: transform timing-function duration;\n\n    transform: translateX(padding);\n\n    border-radius: calc(unit * 0.75);\n    background-color: var(--ring-content-background-color);\n  }\n}\n\n.input:checked + .switch {\n  background-color: var(--ring-main-color);\n}\n\n:checked:hover + .switch {\n  background-color: var(--ring-main-hover-color);\n}\n\n.size16 {\n  & .switchWrapper {\n    width: calc(unit * 3);\n    height: calc(unit * 2);\n\n    vertical-align: -3px;\n  }\n\n  & .switch {\n    border-radius: unit;\n\n    &::before {\n      width: calc(unit * 1.5);\n      height: calc(unit * 1.5);\n\n      border-radius: calc(unit * 0.75);\n    }\n  }\n\n  /* stylelint-disable-next-line selector-max-specificity */\n  & .input:checked + ::before {\n    transform: translateX(calc(unit * 1.5 - padding));\n  }\n}\n\n.size14 {\n  & .switchWrapper {\n    width: calc(unit * 3);\n    height: 14px;\n\n    vertical-align: -2px;\n  }\n\n  & .switch {\n    border-radius: 7px;\n\n    &::before {\n      width: 10px;\n      height: 10px;\n\n      border-radius: 5px;\n    }\n  }\n\n  /* stylelint-disable-next-line selector-max-specificity */\n  & .input:checked + ::before {\n    transform: translateX(12px);\n  }\n}\n\n.size20 {\n  & .switchWrapper {\n    width: calc(unit * 4);\n    height: calc(unit * 2.5);\n\n    vertical-align: -5px;\n  }\n\n  & .switch {\n    border-radius: calc(unit * 1.25);\n\n    &::before {\n      width: calc(unit * 2);\n      height: calc(unit * 2);\n\n      border-radius: calc(unit);\n    }\n  }\n\n  /* stylelint-disable-next-line selector-max-specificity */\n  & .input:checked + ::before {\n    transform: translateX(calc(unit * 2 - padding));\n  }\n}\n\n.input[disabled] + ::after {\n  position: absolute;\n  top: 0;\n  left: 0;\n\n  width: 100%;\n  height: 100%;\n\n  content: "";\n\n  border-radius: unit;\n  background-image:\n    linear-gradient(\n      45deg,\n      transparent,\n      transparent 37.5%,\n      disabled-line-color 37.5%,\n      disabled-line-color 50%,\n      transparent 50%,\n      transparent 87.5%,\n      disabled-line-color 87.5%,\n      disabled-line-color\n    );\n  background-repeat: repeat;\n  background-size: 4px 4px;\n}\n\n.paleSwitch.paleSwitch {\n  background-color: var(--ring-pale-control-color);\n}\n\n.input:checked + .paleSwitch {\n  background-color: var(--ring-border-hover-color);\n}\n',null],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={unit:""+_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.unit,padding:"2px","disabled-line-color":"rgba(255, 255, 255, 0.9)",duration:"300ms","timing-function":"cubic-bezier(0.23, 1, 0.32, 1)",toggle:"toggle_a8a5",switch:"switch_f3b6",disabled:"disabled_b68a",label:"label_a612",leftLabel:"leftLabel_e622",switchWrapper:"switchWrapper_adf2",input:"input_e5d0",size16:"size16_f69a",size14:"size14_f6be",size20:"size20_d4b6",paleSwitch:"paleSwitch_dd8e"},__webpack_exports__.default=___CSS_LOADER_EXPORT___},"./src/toggle/toggle.css":function(module,__unused_webpack_exports,__webpack_require__){var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/toggle/toggle.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}}}]);