(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[9540],{"./src/link/link.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{allVariants:()=>allVariants,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_jetbrains_logos_hub_hub_svg__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@jetbrains/logos/hub/hub.svg"),_jetbrains_logos_hub_hub_svg__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_jetbrains_logos_hub_hub_svg__WEBPACK_IMPORTED_MODULE_2__),_icon_icon__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/icon/icon.tsx"),_link__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/link/link.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Link",parameters:{notes:"Displays a link."}},allVariants=()=>{class CustomComponent extends react__WEBPACK_IMPORTED_MODULE_0__.Component{render(){const{active,activeClassName,onPlainLeftClick,className,href,children,...props}=this.props,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(className,{[null!=activeClassName?activeClassName:""]:active});return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a",{href,...props,className:classes,children})}}const CustomLink=(0,_link__WEBPACK_IMPORTED_MODULE_4__.F)(CustomComponent);class LinkDemo extends react__WEBPACK_IMPORTED_MODULE_0__.Component{render(){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-start"},"data-test":"lik-example",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_link__WEBPACK_IMPORTED_MODULE_4__.A,{href:"/",children:"Ordinary link"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_link__WEBPACK_IMPORTED_MODULE_4__.A,{href:"/",active:!0,children:"Active link (inherits color)"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_link__WEBPACK_IMPORTED_MODULE_4__.A,{href:"/",pseudo:!0,children:"Pseudo link (no underline on hover)"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_link__WEBPACK_IMPORTED_MODULE_4__.A,{href:"/",hover:!0,children:"Hovered link"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_link__WEBPACK_IMPORTED_MODULE_4__.A,{href:"/",children:"Link with a very long text, wrapping over lines"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_link__WEBPACK_IMPORTED_MODULE_4__.A,{href:"/",children:"Link with a very long text, wrapping over lines"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_link__WEBPACK_IMPORTED_MODULE_4__.A,{href:"/",className:"hub-link",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_icon_icon__WEBPACK_IMPORTED_MODULE_5__.Ay,{glyph:_jetbrains_logos_hub_hub_svg__WEBPACK_IMPORTED_MODULE_2___default(),className:"hub-icon"},"icon"),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span",{children:"Link with non-text content"})},"text")]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(CustomLink,{href:"/",children:"Custom link component"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(CustomLink,{href:"/",active:!0,children:"Active custom link component"})]})}}return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(LinkDemo,{})};allVariants.storyName="Link",allVariants.parameters={screenshots:{captureSelector:"*[data-test~=lik-example]"}},allVariants.parameters={...allVariants.parameters,docs:{...allVariants.parameters?.docs,source:{originalSource:'() => {\n  class CustomComponent extends Component<CustomComponentProps> {\n    render() {\n      const {\n        active,\n        activeClassName,\n        onPlainLeftClick,\n        className,\n        href,\n        children,\n        ...props\n      } = this.props;\n      const classes = classNames(className, {\n        [activeClassName ?? \'\']: active\n      });\n      return <a href={href} {...props} className={classes}>\n          {children}\n        </a>;\n    }\n  }\n  const CustomLink = linkHOC(CustomComponent);\n  class LinkDemo extends Component<unknown> {\n    render() {\n      return <div style={{\n        display: \'flex\',\n        flexDirection: \'column\',\n        alignItems: \'flex-start\'\n      }} data-test="lik-example">\n          <Link href="/">Ordinary link</Link>\n\n          <Link href="/" active>\n            Active link (inherits color)\n          </Link>\n\n          <Link href="/" pseudo>\n            Pseudo link (no underline on hover)\n          </Link>\n\n          <Link href="/" hover>\n            Hovered link\n          </Link>\n\n          <Link href="/">Link with a very long text, wrapping over lines</Link>\n\n          <Link href="/">Link with a very long text, wrapping over lines</Link>\n\n          <Link href="/" className="hub-link">\n            <Icon key="icon" glyph={hubLogo} className="hub-icon" />\n            <div key="text">\n              <span>Link with non-text content</span>\n            </div>\n          </Link>\n\n          <CustomLink href="/">Custom link component</CustomLink>\n\n          <CustomLink href="/" active>\n            Active custom link component\n          </CustomLink>\n        </div>;\n    }\n  }\n  return <LinkDemo />;\n}',...allVariants.parameters?.docs?.source}}}},"./src/global/memoize.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";function memoize(fn){const primitiveCache=new Map,objectCache=new WeakMap;return function memoized(arg){const key=null!=arg?arg:"__singleValue__",cache=key instanceof Object?objectCache:primitiveCache,cached=cache.get(key);if(null!=cached)return cached;const value=fn(arg);return cache.set(key,value),value}}__webpack_require__.d(__webpack_exports__,{A:()=>memoize})},"./src/icon/icon.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Ay:()=>Icon});var react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),browser=__webpack_require__("./node_modules/util-deprecate/browser.js"),browser_default=__webpack_require__.n(browser),icon_constants=__webpack_require__("./src/icon/icon__constants.ts"),icon=__webpack_require__("./src/icon/icon.css"),icon_default=__webpack_require__.n(icon),memoize=__webpack_require__("./src/global/memoize.ts"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function extractSVGProps(svgNode){const map=svgNode.attributes;return map.length>0?function serializeAttrs(map){const res={};for(let i=0;i<map.length;i++){const key=map[i].name;let prop=key;"class"===key?prop="className":key.startsWith("data-")||(prop=key.replace(/[-|:]([a-z])/g,(g=>g[1].toUpperCase()))),res[prop]=map[i].value}return res}(map):null}const getSVGFromSource=(0,memoize.A)((src=>{const svgContainer=document.createElement("div");svgContainer.innerHTML=src;const svg=svgContainer.firstElementChild;return svg.remove?svg.remove():svgContainer.removeChild(svg),{props:extractSVGProps(svg),html:svg.innerHTML}}));function isCompatibilityMode(iconSrc){const hasWidth=/width="[\d\.]+"/gi.test(iconSrc),hasHeight=/height="[\d\.]+"/gi.test(iconSrc);return!hasWidth||!hasHeight}function IconSVG({src,className,...rest}){const glyphClasses=classnames_default()(icon_default().glyph,{[icon_default().compatibilityMode]:isCompatibilityMode(src)},className),{props,html}=getSVGFromSource(src);return(0,jsx_runtime.jsx)("svg",{...props,...rest,className:glyphClasses,dangerouslySetInnerHTML:{__html:html}})}const icon_svg=(0,react.memo)(IconSVG);IconSVG.__docgenInfo={description:"",methods:[],displayName:"IconSVG",props:{src:{required:!0,tsType:{name:"string"},description:""}},composes:["SVGAttributes"]};const warnSize=browser_default()((()=>{}),"`size`, `width` and `height` props are not recommended to use in Ring UI `Icon` component. The intrinsic sizes of SVG icon (`width` and `height` SVG attributes) are used instead.\n\nWe strongly recommend to use icons handcrafted for particular sizes. If your icon doesn't exist in the desired size, please ask your designer to draw one. \"Responsive\" checkmark should be unchecked when exporting icon.'");class Icon extends react.PureComponent{static defaultProps={className:"",color:icon_constants.Q.DEFAULT,glyph:""};static Color=icon_constants.Q;static Size=icon_constants.o;warnSize(){this.props.suppressSizeWarning||warnSize()}getStyle(){const{size,width,height}=this.props;return width||height?(this.warnSize(),{width,height}):size?(this.warnSize(),{width:size,height:size}):void 0}render(){const{className,size,color,loading,glyph:Glyph,width,height,suppressSizeWarning,...restProps}=this.props;if(!Glyph)return null;const classes=classnames_default()(icon_default().icon,{[icon_default()[color]]:!!color,[icon_default().loading]:loading},className);return(0,jsx_runtime.jsx)("span",{"data-test":"ring-icon",...restProps,className:classes,children:"string"==typeof Glyph?(0,jsx_runtime.jsx)(icon_svg,{src:Glyph,style:this.getStyle()}):(0,jsx_runtime.jsx)(Glyph,{className:icon_default().glyph,style:this.getStyle()})})}}Icon.__docgenInfo={description:"",methods:[{name:"warnSize",docblock:null,modifiers:[],params:[],returns:null},{name:"getStyle",docblock:null,modifiers:[],params:[],returns:null}],displayName:"Icon",props:{color:{required:!1,tsType:{name:"Color"},description:"",defaultValue:{value:"Color.DEFAULT",computed:!0}},glyph:{required:!1,tsType:{name:"union",raw:"string | IconType | null",elements:[{name:"string"},{name:"ComponentType",elements:[{name:"SVGAttributes",elements:[{name:"SVGSVGElement"}],raw:"SVGAttributes<SVGSVGElement>"}],raw:"ComponentType<SVGAttributes<SVGSVGElement>>"},{name:"null"}]},description:"",defaultValue:{value:"''",computed:!1}},height:{required:!1,tsType:{name:"union",raw:"number | undefined",elements:[{name:"number"},{name:"undefined"}]},description:""},size:{required:!1,tsType:{name:"union",raw:"Size | number | null | undefined",elements:[{name:"Size"},{name:"number"},{name:"null"},{name:"undefined"}]},description:""},width:{required:!1,tsType:{name:"union",raw:"number | undefined",elements:[{name:"number"},{name:"undefined"}]},description:""},loading:{required:!1,tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]},description:""},suppressSizeWarning:{required:!1,tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]},description:""},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]}},"./src/icon/icon__constants.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Q:()=>Color,o:()=>Size});let Color=function(Color){return Color.BLUE="blue",Color.DEFAULT="",Color.GRAY="gray",Color.GREEN="green",Color.MAGENTA="magenta",Color.RED="red",Color.WHITE="white",Color}({}),Size=function(Size){return Size[Size.Size12=12]="Size12",Size[Size.Size14=14]="Size14",Size[Size.Size16=16]="Size16",Size[Size.Size18=18]="Size18",Size[Size.Size20=20]="Size20",Size[Size.Size24=24]="Size24",Size[Size.Size32=32]="Size32",Size[Size.Size40=40]="Size40",Size[Size.Size48=48]="Size48",Size[Size.Size64=64]="Size64",Size[Size.Size96=96]="Size96",Size[Size.Size128=128]="Size128",Size}({})},"./src/link/clickableLink.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>ClickableLink});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");class ClickableLink extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{onClick=e=>{const{onClick,onConditionalClick,onPlainLeftClick}=this.props,isPlainLeft=(e=>!(0!==e.button||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey))(e);onClick&&onClick(e),onConditionalClick&&onConditionalClick(isPlainLeft,e),onPlainLeftClick&&isPlainLeft&&(e.preventDefault(),onPlainLeftClick(e))};render(){const{onConditionalClick,onPlainLeftClick,activeClassName,href,children,...restProps}=this.props;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a",{href,...restProps,onClick:this.onClick,children})}}ClickableLink.__docgenInfo={description:"",methods:[{name:"onClick",docblock:null,modifiers:[],params:[{name:"e",optional:!1,type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLAnchorElement>",elements:[{name:"HTMLAnchorElement"}],alias:"React.MouseEvent"}}],returns:null}],displayName:"ClickableLink",props:{onConditionalClick:{required:!1,tsType:{name:"union",raw:"((isPlainLeft: boolean, e: React.MouseEvent<HTMLAnchorElement>) => void) | null | undefined",elements:[{name:"unknown"},{name:"null"},{name:"undefined"}]},description:""},onPlainLeftClick:{required:!1,tsType:{name:"union",raw:"((e: React.MouseEvent<HTMLAnchorElement>) => void) | null | undefined",elements:[{name:"unknown"},{name:"null"},{name:"undefined"}]},description:""},activeClassName:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:""},disabled:{required:!1,tsType:{name:"union",raw:"boolean | undefined",elements:[{name:"boolean"},{name:"undefined"}]},description:""}},composes:["AnchorHTMLAttributes"]}},"./src/link/link.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__,F:()=>linkHOC});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_global_data_tests__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/global/data-tests.ts"),_clickableLink__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/link/clickableLink.tsx"),_link_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/link/link.css"),_link_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_link_css__WEBPACK_IMPORTED_MODULE_2__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/jsx-runtime.js");function linkHOC(ComposedComponent){const isCustom="string"!=typeof ComposedComponent&&ComposedComponent!==_clickableLink__WEBPACK_IMPORTED_MODULE_4__.A;return class Link extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{render(){const{active,inherit,pseudo,hover,className,"data-test":dataTest,href,children,onPlainLeftClick,onClick,...restProps}=this.props,useButton=pseudo||!isCustom&&null==href,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_link_css__WEBPACK_IMPORTED_MODULE_2___default().link,className,{[_link_css__WEBPACK_IMPORTED_MODULE_2___default().active]:active,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().inherit]:inherit,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().hover]:hover,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().pseudo]:useButton});let props=restProps;return isCustom&&!props.activeClassName&&(props={...props,activeClassName:_link_css__WEBPACK_IMPORTED_MODULE_2___default().active}),useButton?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button",{type:"button",...props,className:classes,onClick:onClick||onPlainLeftClick,"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_5__.A)("ring-link",dataTest),children}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(ComposedComponent,{...props,href,className:classes,onClick,onPlainLeftClick,"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_5__.A)("ring-link",dataTest),children})}}}const __WEBPACK_DEFAULT_EXPORT__=linkHOC(_clickableLink__WEBPACK_IMPORTED_MODULE_4__.A)},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/icon/icon.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,'.icon_d5a3 {\n  display: inline-block;\n\n  fill: currentColor;\n}\n\n.glyph_ffd8 {\n  display: inline-flex;\n\n  pointer-events: none;\n}\n\n.glyph_ffd8[width="10"] {\n    vertical-align: -1px;\n  }\n\n.glyph_ffd8[width="12"] {\n    vertical-align: -1px;\n  }\n\n.glyph_ffd8[width="16"] {\n    vertical-align: -3px;\n  }\n\n.glyph_ffd8[width="20"] {\n    vertical-align: -2px;\n  }\n\n.glyph_ffd8.compatibilityMode_a8ae {\n    width: calc(var(--ring-unit)*2);\n    height: calc(var(--ring-unit)*2);\n    margin-right: 0;\n    margin-left: 0;\n  }\n\n/* HACK: This media query hack makes styles applied for WebKit browsers only */\n/* stylelint-disable-next-line media-feature-name-no-vendor-prefix */\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  .glyph_ffd8 {\n    width: auto; /* Safari size bug workaround, see https://youtrack.jetbrains.com/issue/RG-1983 */\n  }\n}\n\n.gray_cf30 {\n  color: var(--ring-icon-secondary-color);\n}\n\n.hover_ab0b {\n  color: var(--ring-icon-hover-color);\n}\n\n.green_ea54 {\n  color: var(--ring-icon-success-color);\n}\n\n.magenta_bbdf {\n  color: var(--ring-link-hover-color);\n}\n\n.red_e064 {\n  color: var(--ring-icon-error-color);\n}\n\n.blue_d783 {\n  color: var(--ring-main-color);\n}\n\n.white_d5e6 {\n  color: var(--ring-white-text-color);\n}\n\n.loading_f519 {\n  animation-name: icon-loading_cf30;\n  animation-duration: 1200ms;\n  animation-iteration-count: infinite;\n}\n\n@keyframes icon-loading_cf30 {\n  0% {\n    transform: scale(1);\n  }\n\n  50% {\n    transform: scale(0.9);\n\n    opacity: 0.5;\n  }\n\n  100% {\n    transform: scale(1);\n  }\n}\n',"",{version:3,sources:["webpack://./src/icon/icon.css"],names:[],mappings:"AAEA;EACE,qBAAqB;;EAErB,kBAAkB;AACpB;;AAEA;EACE,oBAAoB;;EAEpB,oBAAoB;AAwBtB;;AAtBE;IACE,oBAAoB;EACtB;;AAEA;IACE,oBAAoB;EACtB;;AAEA;IACE,oBAAoB;EACtB;;AAEA;IACE,oBAAoB;EACtB;;AAEA;IACE,+BAAiC;IACjC,gCAAkC;IAClC,eAAe;IACf,cAAc;EAChB;;AAGF,8EAA8E;AAC9E,oEAAoE;AACpE;EACE;IACE,WAAW,EAAE,iFAAiF;EAChG;AACF;;AAEA;EACE,uCAAuC;AACzC;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,qCAAqC;AACvC;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,6BAA6B;AAC/B;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,iCAA4B;EAC5B,0BAA0B;EAC1B,mCAAmC;AACrC;;AAEA;EACE;IACE,mBAAmB;EACrB;;EAEA;IACE,qBAAqB;;IAErB,YAAY;EACd;;EAEA;IACE,mBAAmB;EACrB;AACF",sourcesContent:['@import "../global/variables.css";\n\n.icon {\n  display: inline-block;\n\n  fill: currentColor;\n}\n\n.glyph {\n  display: inline-flex;\n\n  pointer-events: none;\n\n  &[width="10"] {\n    vertical-align: -1px;\n  }\n\n  &[width="12"] {\n    vertical-align: -1px;\n  }\n\n  &[width="16"] {\n    vertical-align: -3px;\n  }\n\n  &[width="20"] {\n    vertical-align: -2px;\n  }\n\n  &.compatibilityMode {\n    width: calc(var(--ring-unit) * 2);\n    height: calc(var(--ring-unit) * 2);\n    margin-right: 0;\n    margin-left: 0;\n  }\n}\n\n/* HACK: This media query hack makes styles applied for WebKit browsers only */\n/* stylelint-disable-next-line media-feature-name-no-vendor-prefix */\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  .glyph {\n    width: auto; /* Safari size bug workaround, see https://youtrack.jetbrains.com/issue/RG-1983 */\n  }\n}\n\n.gray {\n  color: var(--ring-icon-secondary-color);\n}\n\n.hover {\n  color: var(--ring-icon-hover-color);\n}\n\n.green {\n  color: var(--ring-icon-success-color);\n}\n\n.magenta {\n  color: var(--ring-link-hover-color);\n}\n\n.red {\n  color: var(--ring-icon-error-color);\n}\n\n.blue {\n  color: var(--ring-main-color);\n}\n\n.white {\n  color: var(--ring-white-text-color);\n}\n\n.loading {\n  animation-name: icon-loading;\n  animation-duration: 1200ms;\n  animation-iteration-count: infinite;\n}\n\n@keyframes icon-loading {\n  0% {\n    transform: scale(1);\n  }\n\n  50% {\n    transform: scale(0.9);\n\n    opacity: 0.5;\n  }\n\n  100% {\n    transform: scale(1);\n  }\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={icon:"icon_d5a3",glyph:"glyph_ffd8",compatibilityMode:"compatibilityMode_a8ae",gray:"gray_cf30",hover:"hover_ab0b",green:"green_ea54",magenta:"magenta_bbdf",red:"red_e064",blue:"blue_d783",white:"white_d5e6",loading:"loading_f519","icon-loading":"icon-loading_cf30"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/link/link.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,"@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {:is(.link_c73c,.withLinks_a3f8 a):hover {\n    text-decoration-line: underline;\n\n    transition: none;\n\n    color: var(--ring-link-hover-color);\n  }}\n\n.link_c73c,\n.withLinks_a3f8 a {\n  cursor: pointer;\n  transition: color var(--ring-fast-ease);\n\n  color: var(--ring-link-color);\n\n  outline: none;\n\n  text-decoration-line: none;\n  text-decoration-thickness: 1px;\n  text-underline-offset: 3px;\n}\n\n@media (resolution >= 2dppx) {\n\n.link_c73c,\n.withLinks_a3f8 a {\n    text-decoration-thickness: 0.5px;\n}\n  }\n\n.hover_e4ca:is(.link_c73c,.withLinks_a3f8 a) {\n    text-decoration-line: underline;\n\n    transition: none;\n\n    color: var(--ring-link-hover-color);\n  }\n\n/* stylelint-disable-next-line selector-max-specificity */\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.pseudo_cb40:is(.link_c73c,.withLinks_a3f8 a):hover {\n    text-decoration: none;\n  }}\n\n:is(.link_c73c,.withLinks_a3f8 a):focus-visible {\n    box-shadow: 0 0 0 2px var(--ring-border-hover-color);\n  }\n\n.link_c73c.active_eef2 {\n  color: inherit;\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.inherit_c3d7:not(:hover) {\n  color: inherit;\n}}\n\n.pseudo_cb40 {\n  margin: 0;\n  padding: 0;\n\n  text-align: left;\n\n  border: 0;\n\n  background: transparent;\n\n  font: inherit;\n}\n\n.pseudo_cb40::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n","",{version:3,sources:["<no source>","webpack://./src/link/link.css"],names:[],mappings:"AAAA,wGAAA;IAAA,gCAAA;;IAAA,iBAAA;;IAAA,oCAAA;GAAA,CAAA;;ACEA;;EAEE,eAAe;EACf,uCAAuC;;EAEvC,6BAA6B;;EAE7B,aAAa;;EAEb,0BAA0B;EAC1B,8BAA8B;EAC9B,0BAA0B;AAuB5B;;AArBE;;AAbF;;IAcI,gCAAgC;AAoBpC;EAnBE;;AAEA;IAEE,+BAA+B;;IAE/B,gBAAgB;;IAEhB,mCAAmC;EACrC;;AAEA,yDAAyD;;AD5B3D,wGAAA;IAAA,sBAAA;GAAA,CAAA;;ACiCE;IACE,oDAAoD;EACtD;;AAGF;EACE,cAAc;AAChB;;ADxCA,wGAAA;EAAA,eAAA;CAAA,CAAA;;AC8CA;EACE,SAAS;EACT,UAAU;;EAEV,gBAAgB;;EAEhB,SAAS;;EAET,uBAAuB;;EAEvB,aAAa;AAOf;;AALE;IACE,UAAU;;IAEV,SAAS;EACX",sourcesContent:[null,'@import "../global/variables.css";\n\n.link,\n.withLinks a {\n  cursor: pointer;\n  transition: color var(--ring-fast-ease);\n\n  color: var(--ring-link-color);\n\n  outline: none;\n\n  text-decoration-line: none;\n  text-decoration-thickness: 1px;\n  text-underline-offset: 3px;\n\n  @media (resolution >= 2dppx) {\n    text-decoration-thickness: 0.5px;\n  }\n\n  &:hover,\n  &.hover {\n    text-decoration-line: underline;\n\n    transition: none;\n\n    color: var(--ring-link-hover-color);\n  }\n\n  /* stylelint-disable-next-line selector-max-specificity */\n  &.pseudo:hover {\n    text-decoration: none;\n  }\n\n  &:focus-visible {\n    box-shadow: 0 0 0 2px var(--ring-border-hover-color);\n  }\n}\n\n.link.active {\n  color: inherit;\n}\n\n.inherit:not(:hover) {\n  color: inherit;\n}\n\n.pseudo {\n  margin: 0;\n  padding: 0;\n\n  text-align: left;\n\n  border: 0;\n\n  background: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={link:"link_c73c",withLinks:"withLinks_a3f8",hover:"hover_e4ca",pseudo:"pseudo_cb40",active:"active_eef2",inherit:"inherit_c3d7"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/icon/icon.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/icon/icon.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/link/link.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/link/link.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./node_modules/@jetbrains/logos/hub/hub.svg":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 64 64"><defs><linearGradient id="hub_svg__a" x1="59.676" x2="1.079" y1="4.067" y2="62.663" gradientUnits="userSpaceOnUse"><stop offset=".25" stop-color="#7256FF"></stop><stop offset=".73" stop-color="#00C4F4"></stop></linearGradient><linearGradient id="hub_svg__b" x1="64.391" x2="39.607" y1="56.329" y2="2.874" gradientUnits="userSpaceOnUse"><stop offset=".3" stop-color="#F0EB18"></stop><stop offset=".58" stop-color="#7256FF"></stop></linearGradient></defs><path fill="url(#hub_svg__a)" d="M4.125 64h34.127a4.125 4.125 0 0 0 3.8-2.52L57.85 24.057c.219-.518.33-1.076.324-1.638l-.15-18.329A4.124 4.124 0 0 0 53.9 0H36.234c-.805 0-1.593.236-2.266.678L1.86 21.787A4.125 4.125 0 0 0 0 25.234v34.641A4.125 4.125 0 0 0 4.125 64Z"></path><path fill="url(#hub_svg__b)" d="M49.013 58h10.862A4.125 4.125 0 0 0 64 53.875V41.309c0-.2-.014-.4-.044-.598L58.508 3.527A4.125 4.125 0 0 0 54.427 0H39.029a4.125 4.125 0 0 0-4.125 4.126l.005 18.505c0 .425.066.848.195 1.253l9.979 31.246a4.126 4.126 0 0 0 3.93 2.87Z"></path><path fill="#F0EB18" d="M47.55 58h12.258a4.125 4.125 0 0 0 4.124-4.19L64 43c-.018-1.181-.786-2.531-1.683-3.3L24.158 6.993A4.126 4.126 0 0 0 21.474 6H10.125A4.125 4.125 0 0 0 6 10.125v11.003c0 1.19.514 2.321 1.409 3.104L44.834 56.98A4.124 4.124 0 0 0 47.55 58Z"></path><path fill="#000" d="M52 12H12v40h40V12Z"></path><path fill="#fff" d="M33 44H17v3h16v-3ZM16.998 16.992h2.926v6.035h6.442v-6.035h2.926v15.006h-2.926v-6.335h-6.442v6.335h-2.926V16.992ZM41.678 17.497c.733.336 1.303.803 1.71 1.404.407.6.61 1.28.61 2.036 0 .672-.153 1.265-.46 1.78a3.11 3.11 0 0 1-1.297 1.195c-.557.282-1.193.423-1.908.423v-.343c.786 0 1.486.162 2.1.487.615.325 1.094.78 1.437 1.367.343.586.515 1.25.515 1.994 0 .807-.215 1.525-.644 2.154-.428.629-1.028 1.12-1.8 1.474-.772.354-1.65.53-2.637.53h-6.646V16.992h6.517c.936 0 1.77.168 2.503.504Zm-1.704 5.53c.34-.164.602-.4.788-.707.186-.308.279-.66.279-1.062 0-.4-.093-.748-.279-1.045a1.865 1.865 0 0 0-.788-.69 2.66 2.66 0 0 0-1.174-.247h-3.29v3.998h3.29c.443 0 .835-.082 1.174-.247Zm-4.464 6.689h3.419c.485 0 .914-.086 1.286-.258.371-.17.66-.412.863-.723.204-.31.306-.677.306-1.1a2.014 2.014 0 0 0-1.169-1.876c-.372-.178-.8-.267-1.286-.267h-3.42v4.224Z"></path></svg>'},"./node_modules/util-deprecate/browser.js":(module,__unused_webpack_exports,__webpack_require__)=>{function config(name){try{if(!__webpack_require__.g.localStorage)return!1}catch(_){return!1}var val=__webpack_require__.g.localStorage[name];return null!=val&&"true"===String(val).toLowerCase()}module.exports=function deprecate(fn,msg){if(config("noDeprecation"))return fn;var warned=!1;return function deprecated(){if(!warned){if(config("throwDeprecation"))throw new Error(msg);config("traceDeprecation")?console.trace(msg):console.warn(msg),warned=!0}return fn.apply(this,arguments)}}}}]);