(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[5666],{"./node_modules/@jetbrains/icons/checkmark-12px.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 12 12"><path fill-rule="evenodd" d="M10.899 2.05a.6.6 0 0 1 .05.847L4.808 9.8a.6.6 0 0 1-.876.023L1.073 6.92a.6.6 0 0 1 .854-.843l2.41 2.447L10.053 2.1a.6.6 0 0 1 .847-.05Z" clip-rule="evenodd"/></svg>'},"./node_modules/@jetbrains/icons/remove-12px.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 12 12"><path fill-rule="evenodd" d="M.9 5.6a.6.6 0 0 1 .6-.6h9a.6.6 0 1 1 0 1.2h-9a.6.6 0 0 1-.6-.6Z" clip-rule="evenodd"/></svg>'},"./src/control-label/control-label.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Ay:()=>__WEBPACK_DEFAULT_EXPORT__,HD:()=>LabelType,mq:()=>ControlLabel});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_control_label_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/control-label/control-label.css"),_control_label_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_control_label_css__WEBPACK_IMPORTED_MODULE_2__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}let LabelType=function(LabelType){return LabelType.SECONDARY="secondary",LabelType.FORM="form",LabelType}({});const classNameByType={[LabelType.SECONDARY]:_control_label_css__WEBPACK_IMPORTED_MODULE_2___default().secondaryLabel,[LabelType.FORM]:_control_label_css__WEBPACK_IMPORTED_MODULE_2___default().formLabel},ControlLabel=({children,type=LabelType.SECONDARY,disabled,...rest})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("label",_extends({className:classnames__WEBPACK_IMPORTED_MODULE_1___default()(_control_label_css__WEBPACK_IMPORTED_MODULE_2___default().label,classNameByType[type],{[_control_label_css__WEBPACK_IMPORTED_MODULE_2___default().disabledLabel]:disabled})},rest),children);ControlLabel.propTypes={label:prop_types__WEBPACK_IMPORTED_MODULE_3___default().node,labelStyle:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string,disabled:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool};const __WEBPACK_DEFAULT_EXPORT__=ControlLabel;ControlLabel.__docgenInfo={description:"",methods:[],displayName:"ControlLabel",props:{disabled:{required:!1,tsType:{name:"boolean"},description:"",type:{name:"bool"}},type:{required:!1,tsType:{name:"LabelType"},description:"",defaultValue:{value:"LabelType.SECONDARY",computed:!0}},label:{description:"",type:{name:"node"},required:!1},labelStyle:{description:"",type:{name:"string"},required:!1}},composes:["LabelHTMLAttributes"]}},"./src/global/memoize.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";function memoize(fn){const primitiveCache=new Map,objectCache=new WeakMap;return function memoized(arg){const key=null!=arg?arg:"__singleValue__",cache=key instanceof Object?objectCache:primitiveCache,cached=cache.get(key);if(null!=cached)return cached;const value=fn(arg);return cache.set(key,value),value}}__webpack_require__.d(__webpack_exports__,{A:()=>memoize})},"./src/icon/icon.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Ay:()=>Icon});var react=__webpack_require__("./node_modules/react/index.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),browser=__webpack_require__("./node_modules/util-deprecate/browser.js"),browser_default=__webpack_require__.n(browser),icon_constants=__webpack_require__("./src/icon/icon__constants.ts"),icon=__webpack_require__("./src/icon/icon.css"),icon_default=__webpack_require__.n(icon);function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}function extractSVGProps(svgNode){const map=svgNode.attributes;return map.length>0?function serializeAttrs(map){const res={};for(let i=0;i<map.length;i++){const key=map[i].name;let prop=key;"class"===key?prop="className":key.startsWith("data-")||(prop=key.replace(/[-|:]([a-z])/g,(g=>g[1].toUpperCase()))),res[prop]=map[i].value}return res}(map):null}const getSVGFromSource=(0,__webpack_require__("./src/global/memoize.ts").A)((src=>{const svgContainer=document.createElement("div");svgContainer.innerHTML=src;const svg=svgContainer.firstElementChild;return svg.remove?svg.remove():svgContainer.removeChild(svg),{props:extractSVGProps(svg),html:svg.innerHTML}}));function isCompatibilityMode(iconSrc){const hasWidth=/width="[\d\.]+"/gi.test(iconSrc),hasHeight=/height="[\d\.]+"/gi.test(iconSrc);return!hasWidth||!hasHeight}function IconSVG({src,className,...rest}){const glyphClasses=classnames_default()(icon_default().glyph,{[icon_default().compatibilityMode]:isCompatibilityMode(src)},className),{props,html}=getSVGFromSource(src);return react.createElement("svg",_extends({},props,rest,{className:glyphClasses,dangerouslySetInnerHTML:{__html:html}}))}IconSVG.propTypes={className:prop_types_default().string,src:prop_types_default().string.isRequired,style:prop_types_default().object};const icon_svg=(0,react.memo)(IconSVG);function icon_extends(){return icon_extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},icon_extends.apply(null,arguments)}IconSVG.__docgenInfo={description:"",methods:[],displayName:"IconSVG",props:{src:{required:!0,tsType:{name:"string"},description:"",type:{name:"string"}},className:{description:"",type:{name:"string"},required:!1},style:{description:"",type:{name:"object"},required:!1}},composes:["SVGAttributes"]};const warnSize=browser_default()((()=>{}),"`size`, `width` and `height` props are not recommended to use in Ring UI `Icon` component. The intrinsic sizes of SVG icon (`width` and `height` SVG attributes) are used instead.\n\nWe strongly recommend to use icons handcrafted for particular sizes. If your icon doesn't exist in the desired size, please ask your designer to draw one. \"Responsive\" checkmark should be unchecked when exporting icon.'");class Icon extends react.PureComponent{static propTypes={className:prop_types_default().string,color:prop_types_default().string,glyph:prop_types_default().oneOfType([prop_types_default().string,prop_types_default().elementType]).isRequired,height:prop_types_default().number,size:prop_types_default().number,width:prop_types_default().number,loading:prop_types_default().bool,suppressSizeWarning:prop_types_default().bool};static defaultProps={className:"",color:icon_constants.Q.DEFAULT,glyph:""};static Color=icon_constants.Q;static Size=icon_constants.o;warnSize(){this.props.suppressSizeWarning||warnSize()}getStyle(){const{size,width,height}=this.props;return width||height?(this.warnSize(),{width,height}):size?(this.warnSize(),{width:size,height:size}):void 0}render(){const{className,size,color,loading,glyph:Glyph,width,height,suppressSizeWarning,...restProps}=this.props;if(!Glyph)return null;const classes=classnames_default()(icon_default().icon,{[icon_default()[color]]:!!color,[icon_default().loading]:loading},className);return react.createElement("span",icon_extends({},restProps,{className:classes}),"string"==typeof Glyph?react.createElement(icon_svg,{src:Glyph,style:this.getStyle()}):react.createElement(Glyph,{className:icon_default().glyph,style:this.getStyle()}))}}Icon.__docgenInfo={description:"",methods:[{name:"warnSize",docblock:null,modifiers:[],params:[],returns:null},{name:"getStyle",docblock:null,modifiers:[],params:[],returns:null}],displayName:"Icon",props:{color:{required:!1,tsType:{name:"Color"},description:"",defaultValue:{value:"Color.DEFAULT",computed:!0},type:{name:"string"}},glyph:{required:!1,tsType:{name:"union",raw:"string | IconType | null",elements:[{name:"string"},{name:"ComponentType",elements:[{name:"SVGAttributes",elements:[{name:"SVGSVGElement"}],raw:"SVGAttributes<SVGSVGElement>"}],raw:"ComponentType<SVGAttributes<SVGSVGElement>>"},{name:"null"}]},description:"",defaultValue:{value:"''",computed:!1},type:{name:"union",value:[{name:"string"},{name:"elementType"}]}},height:{required:!1,tsType:{name:"union",raw:"number | undefined",elements:[{name:"number"},{name:"undefined"}]},description:"",type:{name:"number"}},size:{required:!1,tsType:{name:"union",raw:"Size | number | null | undefined",elements:[{name:"Size"},{name:"number"},{name:"null"},{name:"undefined"}]},description:"",type:{name:"number"}},width:{required:!1,tsType:{name:"union",raw:"number | undefined",elements:[{name:"number"},{name:"undefined"}]},description:"",type:{name:"number"}},loading:{required:!1,tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]},description:"",type:{name:"bool"}},suppressSizeWarning:{required:!1,tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]},description:"",type:{name:"bool"}},className:{defaultValue:{value:"''",computed:!1},description:"",type:{name:"string"},required:!1}},composes:["HTMLAttributes"]}},"./src/icon/icon__constants.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Q:()=>Color,o:()=>Size});let Color=function(Color){return Color.BLUE="blue",Color.DEFAULT="",Color.GRAY="gray",Color.GREEN="green",Color.MAGENTA="magenta",Color.RED="red",Color.WHITE="white",Color}({}),Size=function(Size){return Size[Size.Size12=12]="Size12",Size[Size.Size14=14]="Size14",Size[Size.Size16=16]="Size16",Size[Size.Size18=18]="Size18",Size[Size.Size20=20]="Size20",Size[Size.Size24=24]="Size24",Size[Size.Size32=32]="Size32",Size[Size.Size40=40]="Size40",Size[Size.Size48=48]="Size48",Size[Size.Size64=64]="Size64",Size[Size.Size96=96]="Size96",Size[Size.Size128=128]="Size128",Size}({})},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/control-label/control-label.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".label_c07a {\n  display: block;\n\n  margin-bottom: calc(var(--ring-unit)*0.5);\n}\n\n.formLabel_d08a {\n  color: var(--ring-text-color);\n\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}\n\n.secondaryLabel_d40c {\n  color: var(--ring-secondary-color);\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: var(--ring-line-height-lowest);\n}\n\n.disabledLabel_fd92 {\n  color: var(--ring-disabled-color);\n}\n","",{version:3,sources:["webpack://./src/control-label/control-label.css"],names:[],mappings:"AAAA;EACE,cAAc;;EAEd,yCAA2C;AAC7C;;AAEA;EACE,6BAA6B;;EAE7B,gCAAgC;EAChC,oCAAoC;AACtC;;AAEA;EACE,kCAAkC;;EAElC,wCAAwC;EACxC,2CAA2C;AAC7C;;AAEA;EACE,iCAAiC;AACnC",sourcesContent:[".label {\n  display: block;\n\n  margin-bottom: calc(var(--ring-unit) * 0.5);\n}\n\n.formLabel {\n  color: var(--ring-text-color);\n\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}\n\n.secondaryLabel {\n  color: var(--ring-secondary-color);\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: var(--ring-line-height-lowest);\n}\n\n.disabledLabel {\n  color: var(--ring-disabled-color);\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={label:"label_c07a",formLabel:"formLabel_d08a",secondaryLabel:"secondaryLabel_d40c",disabledLabel:"disabledLabel_fd92"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/icon/icon.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,'.icon_d5a3 {\n  display: inline-block;\n\n  fill: currentColor;\n}\n\n.glyph_ffd8 {\n  display: inline-flex;\n\n  margin-right: -1px;\n  margin-left: -1px;\n\n  pointer-events: none;\n}\n\n.glyph_ffd8[width="10"] {\n    vertical-align: -1px;\n  }\n\n.glyph_ffd8[width="12"] {\n    vertical-align: -1px;\n  }\n\n/* TODO remove in 7.0 */\n\n.glyph_ffd8[width="14"] {\n    margin-right: -2px;\n    margin-left: 0;\n\n    vertical-align: -3px;\n  }\n\n.glyph_ffd8[width="16"] {\n    vertical-align: -3px;\n  }\n\n.glyph_ffd8[width="20"] {\n    vertical-align: -2px;\n  }\n\n.glyph_ffd8.compatibilityMode_a8ae {\n    width: calc(var(--ring-unit)*2);\n    height: calc(var(--ring-unit)*2);\n    margin-right: 0;\n    margin-left: 0;\n  }\n\n/* HACK: This media query hack makes styles applied for WebKit browsers only */\n/* stylelint-disable-next-line media-feature-name-no-vendor-prefix */\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  .glyph_ffd8 {\n    width: auto; /* Safari size bug workaround, see https://youtrack.jetbrains.com/issue/RG-1983 */\n  }\n}\n\n.gray_cf30 {\n  color: var(--ring-icon-secondary-color);\n}\n\n.hover_ab0b {\n  color: var(--ring-icon-hover-color);\n}\n\n.green_ea54 {\n  color: var(--ring-icon-success-color);\n}\n\n.magenta_bbdf {\n  color: var(--ring-link-hover-color);\n}\n\n.red_e064 {\n  color: var(--ring-icon-error-color);\n}\n\n.blue_d783 {\n  color: var(--ring-main-color);\n}\n\n.white_d5e6 {\n  color: var(--ring-white-text-color);\n}\n\n.loading_f519 {\n  animation-name: icon-loading_cf30;\n  animation-duration: 1200ms;\n  animation-iteration-count: infinite;\n}\n\n@keyframes icon-loading_cf30 {\n  0% {\n    transform: scale(1);\n  }\n\n  50% {\n    transform: scale(0.9);\n\n    opacity: 0.5;\n  }\n\n  100% {\n    transform: scale(1);\n  }\n}\n',"",{version:3,sources:["webpack://./src/icon/icon.css"],names:[],mappings:"AAEA;EACE,qBAAqB;;EAErB,kBAAkB;AACpB;;AAEA;EACE,oBAAoB;;EAEpB,kBAAkB;EAClB,iBAAiB;;EAEjB,oBAAoB;AAgCtB;;AA9BE;IACE,oBAAoB;EACtB;;AAEA;IACE,oBAAoB;EACtB;;AAEA,uBAAuB;;AACvB;IACE,kBAAkB;IAClB,cAAc;;IAEd,oBAAoB;EACtB;;AAEA;IACE,oBAAoB;EACtB;;AAEA;IACE,oBAAoB;EACtB;;AAEA;IACE,+BAAiC;IACjC,gCAAkC;IAClC,eAAe;IACf,cAAc;EAChB;;AAGF,8EAA8E;AAC9E,oEAAoE;AACpE;EACE;IACE,WAAW,EAAE,iFAAiF;EAChG;AACF;;AAEA;EACE,uCAAuC;AACzC;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,qCAAqC;AACvC;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,6BAA6B;AAC/B;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,iCAA4B;EAC5B,0BAA0B;EAC1B,mCAAmC;AACrC;;AAEA;EACE;IACE,mBAAmB;EACrB;;EAEA;IACE,qBAAqB;;IAErB,YAAY;EACd;;EAEA;IACE,mBAAmB;EACrB;AACF",sourcesContent:['@import "../global/variables.css";\n\n.icon {\n  display: inline-block;\n\n  fill: currentColor;\n}\n\n.glyph {\n  display: inline-flex;\n\n  margin-right: -1px;\n  margin-left: -1px;\n\n  pointer-events: none;\n\n  &[width="10"] {\n    vertical-align: -1px;\n  }\n\n  &[width="12"] {\n    vertical-align: -1px;\n  }\n\n  /* TODO remove in 7.0 */\n  &[width="14"] {\n    margin-right: -2px;\n    margin-left: 0;\n\n    vertical-align: -3px;\n  }\n\n  &[width="16"] {\n    vertical-align: -3px;\n  }\n\n  &[width="20"] {\n    vertical-align: -2px;\n  }\n\n  &.compatibilityMode {\n    width: calc(var(--ring-unit) * 2);\n    height: calc(var(--ring-unit) * 2);\n    margin-right: 0;\n    margin-left: 0;\n  }\n}\n\n/* HACK: This media query hack makes styles applied for WebKit browsers only */\n/* stylelint-disable-next-line media-feature-name-no-vendor-prefix */\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  .glyph {\n    width: auto; /* Safari size bug workaround, see https://youtrack.jetbrains.com/issue/RG-1983 */\n  }\n}\n\n.gray {\n  color: var(--ring-icon-secondary-color);\n}\n\n.hover {\n  color: var(--ring-icon-hover-color);\n}\n\n.green {\n  color: var(--ring-icon-success-color);\n}\n\n.magenta {\n  color: var(--ring-link-hover-color);\n}\n\n.red {\n  color: var(--ring-icon-error-color);\n}\n\n.blue {\n  color: var(--ring-main-color);\n}\n\n.white {\n  color: var(--ring-white-text-color);\n}\n\n.loading {\n  animation-name: icon-loading;\n  animation-duration: 1200ms;\n  animation-iteration-count: infinite;\n}\n\n@keyframes icon-loading {\n  0% {\n    transform: scale(1);\n  }\n\n  50% {\n    transform: scale(0.9);\n\n    opacity: 0.5;\n  }\n\n  100% {\n    transform: scale(1);\n  }\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={icon:"icon_d5a3",glyph:"glyph_ffd8",compatibilityMode:"compatibilityMode_a8ae",gray:"gray_cf30",hover:"hover_ab0b",green:"green_ea54",magenta:"magenta_bbdf",red:"red_e064",blue:"blue_d783",white:"white_d5e6",loading:"loading_f519","icon-loading":"icon-loading_cf30"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/control-label/control-label.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/control-label/control-label.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/icon/icon.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/icon/icon.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/checkbox/checkbox.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:()=>basic,controls:()=>controls,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_control_label_control_label__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/control-label/control-label.tsx"),_checkbox__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/checkbox/checkbox.tsx");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Checkbox",component:_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,parameters:{zeplinLink:"https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc70c6d749a970988caa"}},controls=args=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,args);controls.args={label:"label"},controls.parameters={screenshots:{skip:!0}};const basic=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("h1",null,"Base Examples"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{id:"checkbox-base"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{label:"One"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{label:"Two",defaultChecked:!0,help:"Help text"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{label:"Indeterminate",indeterminate:!0}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{label:"Indeterminate checked",indeterminate:!0,defaultChecked:!0})),react__WEBPACK_IMPORTED_MODULE_0__.createElement("h1",null,"Grouped checkbpoxes"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_control_label_control_label__WEBPACK_IMPORTED_MODULE_2__.Ay,null,"Group Description"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{label:"Label 1"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{label:"Label 2"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_control_label_control_label__WEBPACK_IMPORTED_MODULE_2__.Ay,{type:_control_label_control_label__WEBPACK_IMPORTED_MODULE_2__.HD.FORM},"Group Description"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{label:"Label 1"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{label:"Label 2"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("h1",null,"Disabled checkboxes"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{id:"checkbox-disabled"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{label:"One",disabled:!0}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{label:"Two",disabled:!0,defaultChecked:!0}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{label:"Indeterminate",disabled:!0,indeterminate:!0}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("br",null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{label:"Indeterminate checked",disabled:!0,indeterminate:!0,defaultChecked:!0})),react__WEBPACK_IMPORTED_MODULE_0__.createElement("h1",null,"Examples with outer styles"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{id:"checkbox-additional"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{lineHeight:"60px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{defaultChecked:!0},"This checkbox is inside a div with large line-height."),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,"This text should be aligned on same line with checkbox label")),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{lineHeight:"6px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{defaultChecked:!0},"This checkbox is inside a div with small line-height."),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,"This text should be aligned on same line with checkbox label")),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{lineHeight:"48px",fontSize:"40px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{defaultChecked:!0},"This checkbox is inside a div with large font-size."),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,"This text should be aligned on same line with checkbox label")),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{lineHeight:"6px",fontSize:"4px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_checkbox__WEBPACK_IMPORTED_MODULE_1__.A,{defaultChecked:!0},"This checkbox is inside a div with small font-size."),react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,"This text should be aligned on same line with checkbox label"))));basic.storyName="basic",controls.parameters={...controls.parameters,docs:{...controls.parameters?.docs,source:{originalSource:"(args: CheckboxProps) => <Checkbox {...args} />",...controls.parameters?.docs?.source}}},basic.parameters={...basic.parameters,docs:{...basic.parameters?.docs,source:{originalSource:'() => <Fragment>\n    <h1>Base Examples</h1>\n    <div id="checkbox-base">\n      <Checkbox label="One" />\n      <br />\n      <Checkbox label="Two" defaultChecked help="Help text" />\n      <br />\n      <Checkbox label="Indeterminate" indeterminate />\n      <br />\n      <Checkbox label="Indeterminate checked" indeterminate defaultChecked />\n    </div>\n\n    <h1>Grouped checkbpoxes</h1>\n    <ControlLabel>Group Description</ControlLabel>\n    <Checkbox label="Label 1" />\n    <br />\n    <Checkbox label="Label 2" />\n    <br />\n    <br />\n    <ControlLabel type={LabelType.FORM}>Group Description</ControlLabel>\n    <Checkbox label="Label 1" />\n    <br />\n    <Checkbox label="Label 2" />\n\n    <h1>Disabled checkboxes</h1>\n    <div id="checkbox-disabled">\n      <Checkbox label="One" disabled />\n      <br />\n      <Checkbox label="Two" disabled defaultChecked />\n      <br />\n      <Checkbox label="Indeterminate" disabled indeterminate />\n      <br />\n      <Checkbox label="Indeterminate checked" disabled indeterminate defaultChecked />\n    </div>\n\n    <h1>Examples with outer styles</h1>\n    <div id="checkbox-additional">\n      <div style={{\n      lineHeight: \'60px\'\n    }}>\n        <Checkbox defaultChecked>This checkbox is inside a div with large line-height.</Checkbox>\n        <span>This text should be aligned on same line with checkbox label</span>\n      </div>\n      <div style={{\n      lineHeight: \'6px\'\n    }}>\n        <Checkbox defaultChecked>This checkbox is inside a div with small line-height.</Checkbox>\n        <span>This text should be aligned on same line with checkbox label</span>\n      </div>\n      <div style={{\n      lineHeight: \'48px\',\n      fontSize: \'40px\'\n    }}>\n        <Checkbox defaultChecked>This checkbox is inside a div with large font-size.</Checkbox>\n        <span>This text should be aligned on same line with checkbox label</span>\n      </div>\n      <div style={{\n      lineHeight: \'6px\',\n      fontSize: \'4px\'\n    }}>\n        <Checkbox defaultChecked>This checkbox is inside a div with small font-size.</Checkbox>\n        <span>This text should be aligned on same line with checkbox label</span>\n      </div>\n    </div>\n  </Fragment>',...basic.parameters?.docs?.source}}}},"./node_modules/util-deprecate/browser.js":(module,__unused_webpack_exports,__webpack_require__)=>{function config(name){try{if(!__webpack_require__.g.localStorage)return!1}catch(_){return!1}var val=__webpack_require__.g.localStorage[name];return null!=val&&"true"===String(val).toLowerCase()}module.exports=function deprecate(fn,msg){if(config("noDeprecation"))return fn;var warned=!1;return function deprecated(){if(!warned){if(config("throwDeprecation"))throw new Error(msg);config("traceDeprecation")?console.trace(msg):console.warn(msg),warned=!0}return fn.apply(this,arguments)}}}}]);