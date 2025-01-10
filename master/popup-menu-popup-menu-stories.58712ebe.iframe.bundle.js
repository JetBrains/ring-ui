(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[192],{"./src/popup-menu/popup-menu.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:()=>basic,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _popup_menu__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/popup-menu/popup-menu.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/PopupMenu",parameters:{notes:"Displays a popup menu.",screenshots:{captureSelector:"*[data-test~=ring-popup]"},a11y:{element:"#storybook-root,*[data-test~=ring-popup]"}}},basic=()=>{const data=[{label:"Item"},{label:"Link to jetbrains.com",href:"http://www.jetbrains.com"},{rgItemType:_popup_menu__WEBPACK_IMPORTED_MODULE_1__.D.Type.SEPARATOR},{rgItemType:_popup_menu__WEBPACK_IMPORTED_MODULE_1__.D.Type.LINK,label:"Link Item"},{rgItemType:_popup_menu__WEBPACK_IMPORTED_MODULE_1__.D.Type.LINK,label:"Link Item With Additional Class",className:"test"},{rgItemType:_popup_menu__WEBPACK_IMPORTED_MODULE_1__.D.Type.SEPARATOR,description:"Separator With Description"},{rgItemType:_popup_menu__WEBPACK_IMPORTED_MODULE_1__.D.Type.TITLE,label:"Title"},{rgItemType:_popup_menu__WEBPACK_IMPORTED_MODULE_1__.D.Type.ITEM,label:"1 Element in group"},{rgItemType:_popup_menu__WEBPACK_IMPORTED_MODULE_1__.D.Type.ITEM,label:"2 Element in group"}];return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_popup_menu__WEBPACK_IMPORTED_MODULE_1__.A,{data})};basic.storyName="PopupMenu",basic.parameters={...basic.parameters,docs:{...basic.parameters?.docs,source:{originalSource:"() => {\n  const data = [{\n    label: 'Item'\n  }, {\n    label: 'Link to jetbrains.com',\n    href: 'http://www.jetbrains.com'\n  }, {\n    rgItemType: ListProps.Type.SEPARATOR\n  }, {\n    rgItemType: ListProps.Type.LINK,\n    label: 'Link Item'\n  }, {\n    rgItemType: ListProps.Type.LINK,\n    label: 'Link Item With Additional Class',\n    className: 'test'\n  }, {\n    rgItemType: ListProps.Type.SEPARATOR,\n    description: 'Separator With Description'\n  }, {\n    rgItemType: ListProps.Type.TITLE,\n    label: 'Title'\n  }, {\n    rgItemType: ListProps.Type.ITEM,\n    label: '1 Element in group'\n  }, {\n    rgItemType: ListProps.Type.ITEM,\n    label: '2 Element in group'\n  }];\n  return <PopupMenu data={data} />;\n}",...basic.parameters?.docs?.source}}}},"./src/global/memoize.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";function memoize(fn){const primitiveCache=new Map,objectCache=new WeakMap;return function memoized(arg){const key=null!=arg?arg:"__singleValue__",cache=key instanceof Object?objectCache:primitiveCache,cached=cache.get(key);if(null!=cached)return cached;const value=fn(arg);return cache.set(key,value),value}}__webpack_require__.d(__webpack_exports__,{A:()=>memoize})},"./src/icon/icon.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Ay:()=>Icon});var react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),browser=__webpack_require__("./node_modules/util-deprecate/browser.js"),browser_default=__webpack_require__.n(browser),icon_constants=__webpack_require__("./src/icon/icon__constants.ts"),icon=__webpack_require__("./src/icon/icon.css"),icon_default=__webpack_require__.n(icon),memoize=__webpack_require__("./src/global/memoize.ts"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function extractSVGProps(svgNode){const map=svgNode.attributes;return map.length>0?function serializeAttrs(map){const res={};for(let i=0;i<map.length;i++){const key=map[i].name;let prop=key;"class"===key?prop="className":key.startsWith("data-")||(prop=key.replace(/[-|:]([a-z])/g,(g=>g[1].toUpperCase()))),res[prop]=map[i].value}return res}(map):null}const getSVGFromSource=(0,memoize.A)((src=>{const svgContainer=document.createElement("div");svgContainer.innerHTML=src;const svg=svgContainer.firstElementChild;return svg.remove?svg.remove():svgContainer.removeChild(svg),{props:extractSVGProps(svg),html:svg.innerHTML}}));function isCompatibilityMode(iconSrc){const hasWidth=/width="[\d\.]+"/gi.test(iconSrc),hasHeight=/height="[\d\.]+"/gi.test(iconSrc);return!hasWidth||!hasHeight}function IconSVG({src,className,...rest}){const glyphClasses=classnames_default()(icon_default().glyph,{[icon_default().compatibilityMode]:isCompatibilityMode(src)},className),{props,html}=getSVGFromSource(src);return(0,jsx_runtime.jsx)("svg",{...props,...rest,className:glyphClasses,dangerouslySetInnerHTML:{__html:html}})}const icon_svg=(0,react.memo)(IconSVG);IconSVG.__docgenInfo={description:"",methods:[],displayName:"IconSVG",props:{src:{required:!0,tsType:{name:"string"},description:""}},composes:["SVGAttributes"]};const warnSize=browser_default()((()=>{}),"`size`, `width` and `height` props are not recommended to use in Ring UI `Icon` component. The intrinsic sizes of SVG icon (`width` and `height` SVG attributes) are used instead.\n\nWe strongly recommend to use icons handcrafted for particular sizes. If your icon doesn't exist in the desired size, please ask your designer to draw one. \"Responsive\" checkmark should be unchecked when exporting icon.'");class Icon extends react.PureComponent{static defaultProps={className:"",color:icon_constants.Q.DEFAULT,glyph:""};static Color=icon_constants.Q;static Size=icon_constants.o;warnSize(){this.props.suppressSizeWarning||warnSize()}getStyle(){const{size,width,height}=this.props;return width||height?(this.warnSize(),{width,height}):size?(this.warnSize(),{width:size,height:size}):void 0}render(){const{className,size,color,loading,glyph:Glyph,width,height,suppressSizeWarning,...restProps}=this.props;if(!Glyph)return null;const classes=classnames_default()(icon_default().icon,{[icon_default()[color]]:!!color,[icon_default().loading]:loading},className);return(0,jsx_runtime.jsx)("span",{"data-test":"ring-icon",...restProps,className:classes,children:"string"==typeof Glyph?(0,jsx_runtime.jsx)(icon_svg,{src:Glyph,style:this.getStyle()}):(0,jsx_runtime.jsx)(Glyph,{className:icon_default().glyph,style:this.getStyle()})})}}Icon.__docgenInfo={description:"",methods:[{name:"warnSize",docblock:null,modifiers:[],params:[],returns:null},{name:"getStyle",docblock:null,modifiers:[],params:[],returns:null}],displayName:"Icon",props:{color:{required:!1,tsType:{name:"Color"},description:"",defaultValue:{value:"Color.DEFAULT",computed:!0}},glyph:{required:!1,tsType:{name:"union",raw:"string | IconType | null",elements:[{name:"string"},{name:"ComponentType",elements:[{name:"SVGAttributes",elements:[{name:"SVGSVGElement"}],raw:"SVGAttributes<SVGSVGElement>"}],raw:"ComponentType<SVGAttributes<SVGSVGElement>>"},{name:"null"}]},description:"",defaultValue:{value:"''",computed:!1}},height:{required:!1,tsType:{name:"union",raw:"number | undefined",elements:[{name:"number"},{name:"undefined"}]},description:""},size:{required:!1,tsType:{name:"union",raw:"Size | number | null | undefined",elements:[{name:"Size"},{name:"number"},{name:"null"},{name:"undefined"}]},description:""},width:{required:!1,tsType:{name:"union",raw:"number | undefined",elements:[{name:"number"},{name:"undefined"}]},description:""},loading:{required:!1,tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]},description:""},suppressSizeWarning:{required:!1,tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]},description:""},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]}},"./src/icon/icon__constants.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Q:()=>Color,o:()=>Size});let Color=function(Color){return Color.BLUE="blue",Color.DEFAULT="",Color.GRAY="gray",Color.GREEN="green",Color.MAGENTA="magenta",Color.RED="red",Color.WHITE="white",Color}({}),Size=function(Size){return Size[Size.Size12=12]="Size12",Size[Size.Size14=14]="Size14",Size[Size.Size16=16]="Size16",Size[Size.Size18=18]="Size18",Size[Size.Size20=20]="Size20",Size[Size.Size24=24]="Size24",Size[Size.Size32=32]="Size32",Size[Size.Size40=40]="Size40",Size[Size.Size48=48]="Size48",Size[Size.Size64=64]="Size64",Size[Size.Size96=96]="Size96",Size[Size.Size128=128]="Size128",Size}({})},"./src/link/clickableLink.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>ClickableLink});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");class ClickableLink extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{onClick=e=>{const{onClick,onConditionalClick,onPlainLeftClick}=this.props,isPlainLeft=(e=>!(0!==e.button||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey))(e);onClick&&onClick(e),onConditionalClick&&onConditionalClick(isPlainLeft,e),onPlainLeftClick&&isPlainLeft&&(e.preventDefault(),onPlainLeftClick(e))};render(){const{onConditionalClick,onPlainLeftClick,activeClassName,href,children,...restProps}=this.props;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a",{href,...restProps,onClick:this.onClick,children})}}ClickableLink.__docgenInfo={description:"",methods:[{name:"onClick",docblock:null,modifiers:[],params:[{name:"e",optional:!1,type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLAnchorElement>",elements:[{name:"HTMLAnchorElement"}],alias:"React.MouseEvent"}}],returns:null}],displayName:"ClickableLink",props:{onConditionalClick:{required:!1,tsType:{name:"union",raw:"((isPlainLeft: boolean, e: React.MouseEvent<HTMLAnchorElement>) => void) | null | undefined",elements:[{name:"unknown"},{name:"null"},{name:"undefined"}]},description:""},onPlainLeftClick:{required:!1,tsType:{name:"union",raw:"((e: React.MouseEvent<HTMLAnchorElement>) => void) | null | undefined",elements:[{name:"unknown"},{name:"null"},{name:"undefined"}]},description:""},activeClassName:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""},disabled:{required:!1,tsType:{name:"union",raw:"boolean | undefined",elements:[{name:"boolean"},{name:"undefined"}]},description:""}},composes:["AnchorHTMLAttributes"]}},"./src/popup-menu/popup-menu.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>PopupMenu,D:()=>ListProps});var _popup_popup__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/popup/popup.tsx"),_list_list__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/list/list.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");class PopupMenu extends _popup_popup__WEBPACK_IMPORTED_MODULE_1__.Ay{static isItemType=_list_list__WEBPACK_IMPORTED_MODULE_2__.A.isItemType;static ListProps=_list_list__WEBPACK_IMPORTED_MODULE_2__.A.ListProps;static defaultProps={..._list_list__WEBPACK_IMPORTED_MODULE_2__.A.defaultProps,..._popup_popup__WEBPACK_IMPORTED_MODULE_1__.Ay.defaultProps,renderOptimization:!1,closeOnSelect:!1,largeBorderRadius:!0};onSelect=(item,event)=>{this.props.closeOnSelect&&this._onCloseAttempt(event),this.props.onSelect(item,event)};list;listRef=el=>{this.list=el};getInternalContent(){const{className,...props}=this.props;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_list_list__WEBPACK_IMPORTED_MODULE_2__.A,{ref:this.listRef,...props,maxHeight:this.popup&&parseFloat(this.popup.style.maxHeight),shortcuts:this.shouldUseShortcuts(),onSelect:this.onSelect})})}}const{ListProps}=_list_list__WEBPACK_IMPORTED_MODULE_2__.A},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/icon/icon.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,'.icon_d5a3 {\n  display: inline-block;\n\n  fill: currentColor;\n}\n\n.glyph_ffd8 {\n  display: inline-flex;\n\n  pointer-events: none;\n\n  /* TODO remove in 8.0 */\n}\n\n.glyph_ffd8[width="10"] {\n    vertical-align: -1px;\n  }\n\n.glyph_ffd8[width="12"] {\n    vertical-align: -1px;\n  }\n\n.glyph_ffd8[width="16"] {\n    vertical-align: -3px;\n  }\n\n.glyph_ffd8[width="20"] {\n    vertical-align: -2px;\n  }\n\n.glyph_ffd8.compatibilityMode_a8ae {\n    width: calc(var(--ring-unit)*2);\n    height: calc(var(--ring-unit)*2);\n    margin-right: 0;\n    margin-left: 0;\n  }\n\n/* HACK: This media query hack makes styles applied for WebKit browsers only */\n/* stylelint-disable-next-line media-feature-name-no-vendor-prefix */\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  .glyph_ffd8 {\n    width: auto; /* Safari size bug workaround, see https://youtrack.jetbrains.com/issue/RG-1983 */\n  }\n}\n\n.gray_cf30 {\n  color: var(--ring-secondary-color);\n}\n\n.hover_ab0b {\n  color: var(--ring-link-hover-color);\n}\n\n.green_ea54 {\n  color: var(--ring-success-color);\n}\n\n.magenta_bbdf {\n  color: var(--ring-link-hover-color);\n}\n\n.red_e064 {\n  color: var(--ring-error-color);\n}\n\n.blue_d783 {\n  color: var(--ring-main-color);\n}\n\n.white_d5e6 {\n  color: var(--ring-white-text-color);\n}\n\n.loading_f519 {\n  animation-name: icon-loading_cf30;\n  animation-duration: 1200ms;\n  animation-iteration-count: infinite;\n}\n\n@keyframes icon-loading_cf30 {\n  0% {\n    transform: scale(1);\n  }\n\n  50% {\n    transform: scale(0.9);\n\n    opacity: 0.5;\n  }\n\n  100% {\n    transform: scale(1);\n  }\n}\n',"",{version:3,sources:["webpack://./src/icon/icon.css"],names:[],mappings:"AAEA;EACE,qBAAqB;;EAErB,kBAAkB;AACpB;;AAEA;EACE,oBAAoB;;EAEpB,oBAAoB;;EAEpB,uBAAuB;AAuBzB;;AAtBE;IACE,oBAAoB;EACtB;;AAEA;IACE,oBAAoB;EACtB;;AAEA;IACE,oBAAoB;EACtB;;AAEA;IACE,oBAAoB;EACtB;;AAEA;IACE,+BAAiC;IACjC,gCAAkC;IAClC,eAAe;IACf,cAAc;EAChB;;AAGF,8EAA8E;AAC9E,oEAAoE;AACpE;EACE;IACE,WAAW,EAAE,iFAAiF;EAChG;AACF;;AAEA;EACE,kCAAkC;AACpC;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,gCAAgC;AAClC;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,8BAA8B;AAChC;;AAEA;EACE,6BAA6B;AAC/B;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,iCAA4B;EAC5B,0BAA0B;EAC1B,mCAAmC;AACrC;;AAEA;EACE;IACE,mBAAmB;EACrB;;EAEA;IACE,qBAAqB;;IAErB,YAAY;EACd;;EAEA;IACE,mBAAmB;EACrB;AACF",sourcesContent:['@import "../global/variables.css";\n\n.icon {\n  display: inline-block;\n\n  fill: currentColor;\n}\n\n.glyph {\n  display: inline-flex;\n\n  pointer-events: none;\n\n  /* TODO remove in 8.0 */\n  &[width="10"] {\n    vertical-align: -1px;\n  }\n\n  &[width="12"] {\n    vertical-align: -1px;\n  }\n\n  &[width="16"] {\n    vertical-align: -3px;\n  }\n\n  &[width="20"] {\n    vertical-align: -2px;\n  }\n\n  &.compatibilityMode {\n    width: calc(var(--ring-unit) * 2);\n    height: calc(var(--ring-unit) * 2);\n    margin-right: 0;\n    margin-left: 0;\n  }\n}\n\n/* HACK: This media query hack makes styles applied for WebKit browsers only */\n/* stylelint-disable-next-line media-feature-name-no-vendor-prefix */\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  .glyph {\n    width: auto; /* Safari size bug workaround, see https://youtrack.jetbrains.com/issue/RG-1983 */\n  }\n}\n\n.gray {\n  color: var(--ring-secondary-color);\n}\n\n.hover {\n  color: var(--ring-link-hover-color);\n}\n\n.green {\n  color: var(--ring-success-color);\n}\n\n.magenta {\n  color: var(--ring-link-hover-color);\n}\n\n.red {\n  color: var(--ring-error-color);\n}\n\n.blue {\n  color: var(--ring-main-color);\n}\n\n.white {\n  color: var(--ring-white-text-color);\n}\n\n.loading {\n  animation-name: icon-loading;\n  animation-duration: 1200ms;\n  animation-iteration-count: infinite;\n}\n\n@keyframes icon-loading {\n  0% {\n    transform: scale(1);\n  }\n\n  50% {\n    transform: scale(0.9);\n\n    opacity: 0.5;\n  }\n\n  100% {\n    transform: scale(1);\n  }\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={icon:"icon_d5a3",glyph:"glyph_ffd8",compatibilityMode:"compatibilityMode_a8ae",gray:"gray_cf30",hover:"hover_ab0b",green:"green_ea54",magenta:"magenta_bbdf",red:"red_e064",blue:"blue_d783",white:"white_d5e6",loading:"loading_f519","icon-loading":"icon-loading_cf30"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/icon/icon.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/icon/icon.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}}}]);