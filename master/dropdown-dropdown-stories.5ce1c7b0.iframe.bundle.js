(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[4258],{"./node_modules/@jetbrains/icons/chevron-10px.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><g><polygon points="5 7.99 1.5 4.5 2.5 3.5 5 6.01 7.5 3.5 8.49 4.5 5 7.99"/></g></svg>'},"./node_modules/@jetbrains/icons/chevron-down.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.942 5.808a.625.625 0 0 0-.884 0L8 8.866 4.942 5.808a.625.625 0 1 0-.884.884l3.5 3.5c.244.244.64.244.884 0l3.5-3.5a.625.625 0 0 0 0-.884Z" clip-rule="evenodd"/></svg>'},"./node_modules/@jetbrains/icons/close-12px.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 12 12"><path fill-rule="evenodd" d="M9.918 2.065a.6.6 0 0 1 .002.849L6.849 5.998 9.924 9.07l-.424.425-.424.424-3.074-3.072-3.07 3.083a.6.6 0 1 1-.85-.847L5.153 6 2.08 2.928a.6.6 0 1 1 .849-.849L6 5.15l3.07-3.082a.6.6 0 0 1 .848-.002ZM9.5 9.495l-.424.425a.6.6 0 1 0 .848-.849l-.424.425Z" clip-rule="evenodd"/></svg>'},"./src/dropdown/anchor.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_6___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_6__),_jetbrains_icons_chevron_10px__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@jetbrains/icons/chevron-10px.js"),_jetbrains_icons_chevron_10px__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_jetbrains_icons_chevron_10px__WEBPACK_IMPORTED_MODULE_1__),classnames__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__),_icon_icon__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/icon/icon.tsx"),_button_button__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/button/button.tsx"),_dropdown_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/dropdown/dropdown.css"),_dropdown_css__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(_dropdown_css__WEBPACK_IMPORTED_MODULE_3__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const Anchor=({children,className,...restProps})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button_button__WEBPACK_IMPORTED_MODULE_4__.Ay,_extends({"data-test-ring-dropdown-anchor":!0,text:!0,className:classnames__WEBPACK_IMPORTED_MODULE_2___default()(_dropdown_css__WEBPACK_IMPORTED_MODULE_3___default().anchor,className)},restProps),children,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_icon_icon__WEBPACK_IMPORTED_MODULE_5__.Ay,{glyph:_jetbrains_icons_chevron_10px__WEBPACK_IMPORTED_MODULE_1___default(),className:_dropdown_css__WEBPACK_IMPORTED_MODULE_3___default().chevron}));Anchor.propTypes={children:prop_types__WEBPACK_IMPORTED_MODULE_6___default().node,className:prop_types__WEBPACK_IMPORTED_MODULE_6___default().string};const __WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(Anchor);Anchor.__docgenInfo={description:"",methods:[],displayName:"Anchor",props:{children:{description:"",type:{name:"node"},required:!1},className:{description:"",type:{name:"string"},required:!1}}}},"./src/dropdown/dropdown.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>Dropdown});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_global_data_tests__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/global/data-tests.ts"),_global_typescript_utils__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/global/typescript-utils.ts"),_anchor__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/dropdown/anchor.tsx"),_dropdown_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/dropdown/dropdown.css"),_dropdown_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_dropdown_css__WEBPACK_IMPORTED_MODULE_2__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}class Dropdown extends react__WEBPACK_IMPORTED_MODULE_0__.Component{static propTypes={anchor:prop_types__WEBPACK_IMPORTED_MODULE_3___default().oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_3___default().node,prop_types__WEBPACK_IMPORTED_MODULE_3___default().func]).isRequired,children:prop_types__WEBPACK_IMPORTED_MODULE_3___default().oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_3___default().element,prop_types__WEBPACK_IMPORTED_MODULE_3___default().func]).isRequired,initShown:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,className:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string,activeClassName:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string,clickMode:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,hoverMode:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,hoverShowTimeOut:prop_types__WEBPACK_IMPORTED_MODULE_3___default().number,hoverHideTimeOut:prop_types__WEBPACK_IMPORTED_MODULE_3___default().number,disabled:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,onShow:prop_types__WEBPACK_IMPORTED_MODULE_3___default().func,onHide:prop_types__WEBPACK_IMPORTED_MODULE_3___default().func,onMouseEnter:prop_types__WEBPACK_IMPORTED_MODULE_3___default().func,onMouseLeave:prop_types__WEBPACK_IMPORTED_MODULE_3___default().func,"data-test":prop_types__WEBPACK_IMPORTED_MODULE_3___default().string};static defaultProps={initShown:!1,clickMode:!0,hoverMode:!1,hoverShowTimeOut:300,hoverHideTimeOut:600,disabled:!1,onShow:()=>{},onHide:()=>{},onMouseEnter:()=>{},onMouseLeave:()=>{}};state={show:this.props.initShown,pinned:!1};onClick=()=>{if(this.props.disabled)return;const{show,pinned}=this.state;let nextPinned=pinned;if(this.props.hoverMode)if(pinned)nextPinned=!1;else if(nextPinned=!0,show)return void this.setState({pinned:!0});this._toggle(!show,nextPinned)};onChildCloseAttempt=()=>{let nextPinned=this.state.pinned;this.props.hoverMode&&(nextPinned=!1),this._toggle(!1,nextPinned)};hoverTimer;onMouseEnter=event=>{this.props.disabled||(this._clearTimer(),this.props.onMouseEnter?.(event),this.hoverTimer=window.setTimeout((()=>{this.state.show||this._toggle(!0)}),this.props.hoverShowTimeOut))};onMouseLeave=event=>{this.props.disabled||(this.props.onMouseLeave?.(event),this.state.pinned||(this._clearTimer(),this.hoverTimer=window.setTimeout((()=>{this.state.show&&this._toggle(!1)}),this.props.hoverHideTimeOut)))};handlePopupInteraction=()=>{this.setState((({pinned})=>pinned?null:{pinned:!0}))};toggle(show=!this.state.show){this._toggle(show)}_toggle(show,pinned=this.state.pinned){this.setState({show,pinned},(()=>show?this.props.onShow():this.props.onHide()))}_clearTimer(){this.hoverTimer&&(clearTimeout(this.hoverTimer),this.hoverTimer=null)}render(){const{show,pinned}=this.state,{initShown,onShow,onHide,hoverShowTimeOut,hoverHideTimeOut,children,anchor,className,activeClassName,hoverMode,clickMode,"data-test":dataTest,disabled,...restProps}=this.props,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_dropdown_css__WEBPACK_IMPORTED_MODULE_2___default().dropdown,className,{[null!=activeClassName?activeClassName:""]:null!=activeClassName&&show});let anchorElement;const active=hoverMode?pinned:show;switch(typeof anchor){case"string":anchorElement=react__WEBPACK_IMPORTED_MODULE_0__.createElement(_anchor__WEBPACK_IMPORTED_MODULE_4__.A,{active},anchor);break;case"function":anchorElement=anchor({active:show,pinned});break;default:anchorElement=(0,_global_typescript_utils__WEBPACK_IMPORTED_MODULE_5__.c)(anchor)||"string"==typeof anchor.type?anchor:(0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(anchor,{active})}const childProps={hidden:!show,onCloseAttempt:this.onChildCloseAttempt,onMouseDown:hoverMode?this.handlePopupInteraction:void 0,onContextMenu:hoverMode?this.handlePopupInteraction:void 0,dontCloseOnAnchorClick:!0};return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",_extends({"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_6__.A)("ring-dropdown",dataTest)},restProps,{onClick:clickMode?this.onClick:void 0,role:"presentation",onMouseEnter:hoverMode?this.onMouseEnter:void 0,onMouseLeave:hoverMode?this.onMouseLeave:void 0,className:classes}),anchorElement,"function"==typeof children?children(childProps):(0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(children,childProps))}}Dropdown.__docgenInfo={description:"@name Dropdown",methods:[{name:"onClick",docblock:null,modifiers:[],params:[],returns:null},{name:"onChildCloseAttempt",docblock:null,modifiers:[],params:[],returns:null},{name:"onMouseEnter",docblock:null,modifiers:[],params:[{name:"event",optional:!1,type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}],alias:"React.MouseEvent"}}],returns:null},{name:"onMouseLeave",docblock:null,modifiers:[],params:[{name:"event",optional:!1,type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}],alias:"React.MouseEvent"}}],returns:null},{name:"handlePopupInteraction",docblock:null,modifiers:[],params:[],returns:null},{name:"toggle",docblock:null,modifiers:[],params:[{name:"show",optional:!0,type:null}],returns:null},{name:"_toggle",docblock:null,modifiers:[],params:[{name:"show",optional:!1,type:{name:"boolean"}},{name:"pinned",optional:!0,type:null}],returns:null},{name:"_clearTimer",docblock:null,modifiers:[],params:[],returns:null}],displayName:"Dropdown",props:{anchor:{required:!0,tsType:{name:"union",raw:"ReactElement | readonly ReactElement[] | string | ((props: AnchorProps) => ReactNode)",elements:[{name:"ReactElement"},{name:"unknown"},{name:"string"},{name:"unknown"}]},description:"Can be string, React element, or a function accepting an object with {active, pinned} properties and returning a React element\nReact element should render some interactive HTML element like `button` or `a`",type:{name:"union",value:[{name:"node"},{name:"func"}]}},children:{required:!0,tsType:{name:"union",raw:"ReactElement<PopupAttrs> | ((props: Omit<PopupAttrs, 'children'>) => ReactNode)",elements:[{name:"ReactElement",elements:[{name:"JSX.LibraryManagedAttributes",elements:[{name:"Popup"},{name:"PopupProps"}],raw:"JSX.LibraryManagedAttributes<typeof Popup, PopupProps>"}],raw:"ReactElement<PopupAttrs>"},{name:"unknown"}]},description:"",type:{name:"union",value:[{name:"element"},{name:"func"}]}},initShown:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1},type:{name:"bool"}},disabled:{required:!1,tsType:{name:"union",raw:"boolean | null | undefined",elements:[{name:"boolean"},{name:"null"},{name:"undefined"}]},description:"",defaultValue:{value:"false",computed:!1},type:{name:"bool"}},clickMode:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1},type:{name:"bool"}},hoverMode:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1},type:{name:"bool"}},hoverShowTimeOut:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"300",computed:!1},type:{name:"number"}},hoverHideTimeOut:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"600",computed:!1},type:{name:"number"}},onShow:{required:!1,tsType:{name:"unknown"},description:"",defaultValue:{value:"() => {}",computed:!1},type:{name:"func"}},onHide:{required:!1,tsType:{name:"unknown"},description:"",defaultValue:{value:"() => {}",computed:!1},type:{name:"func"}},activeClassName:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:"",type:{name:"string"}},"data-test":{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:"",type:{name:"string"}},onMouseEnter:{defaultValue:{value:"() => {}",computed:!1},description:"",type:{name:"func"},required:!1},onMouseLeave:{defaultValue:{value:"() => {}",computed:!1},description:"",type:{name:"func"},required:!1},className:{description:"",type:{name:"string"},required:!1}},composes:["Omit"]}},"./src/global/typescript-utils.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{c:()=>isArray,z:()=>isTruthy});const isArray=arg=>Array.isArray(arg),isTruthy=arg=>Boolean(arg)},"./src/popup-menu/popup-menu.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>PopupMenu,D:()=>ListProps});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__),_popup_popup__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/popup/popup.tsx"),_list_list__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/list/list.tsx");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const{children,...popupPropTypes}=_popup_popup__WEBPACK_IMPORTED_MODULE_1__.Ay.propTypes||{};class PopupMenu extends _popup_popup__WEBPACK_IMPORTED_MODULE_1__.Ay{static isItemType=_list_list__WEBPACK_IMPORTED_MODULE_2__.A.isItemType;static ListProps=_list_list__WEBPACK_IMPORTED_MODULE_2__.A.ListProps;static defaultProps={..._list_list__WEBPACK_IMPORTED_MODULE_2__.A.defaultProps,..._popup_popup__WEBPACK_IMPORTED_MODULE_1__.Ay.defaultProps,renderOptimization:!1,closeOnSelect:!1};onSelect=(item,event)=>{this.props.closeOnSelect&&this._onCloseAttempt(event),this.props.onSelect(item,event)};list;listRef=el=>{this.list=el};getInternalContent(){const{className,...props}=this.props;return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_list_list__WEBPACK_IMPORTED_MODULE_2__.A,_extends({ref:this.listRef},props,{maxHeight:this.popup&&parseFloat(this.popup.style.maxHeight),shortcuts:this.shouldUseShortcuts(),onSelect:this.onSelect})))}}PopupMenu.propTypes={...popupPropTypes,..._list_list__WEBPACK_IMPORTED_MODULE_2__.A.propTypes,closeOnSelect:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool};const{ListProps}=_list_list__WEBPACK_IMPORTED_MODULE_2__.A},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/dropdown/dropdown.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,".dropdown_c237 {\n  display: inline-block;\n}\n\n.anchor_dff2.anchor_dff2 {\n  margin: 0 -3px;\n  padding: 0 3px;\n\n  font: inherit;\n}\n\n.chevron_a400 {\n  margin-left: 2px;\n\n  line-height: normal;\n}\n","",{version:3,sources:["webpack://./src/dropdown/dropdown.css"],names:[],mappings:"AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,cAAc;EACd,cAAc;;EAEd,aAAa;AACf;;AAEA;EACE,gBAAgB;;EAEhB,mBAAmB;AACrB",sourcesContent:['@import "../global/variables.css";\n\n.dropdown {\n  display: inline-block;\n}\n\n.anchor.anchor {\n  margin: 0 -3px;\n  padding: 0 3px;\n\n  font: inherit;\n}\n\n.chevron {\n  margin-left: 2px;\n\n  line-height: normal;\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={dropdown:"dropdown_c237",anchor:"anchor_dff2",chevron:"chevron_a400"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/dropdown/dropdown.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/dropdown/dropdown.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/dropdown/dropdown.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{autofocusOnOpen:()=>autofocusOnOpen,basic:()=>basic,default:()=>__WEBPACK_DEFAULT_EXPORT__,renderProps:()=>renderProps,withActiveClassName:()=>withActiveClassName,withCustomAnchorAndPopup:()=>withCustomAnchorAndPopup,withCustomAnchorAndPopupAndContentAccessibilityHandling:()=>withCustomAnchorAndPopupAndContentAccessibilityHandling,withHoverMode:()=>withHoverMode,withHoverModeAndDisabledClickMode:()=>withHoverModeAndDisabledClickMode});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_jetbrains_icons_chevron_down__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@jetbrains/icons/chevron-down.js"),_jetbrains_icons_chevron_down__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_jetbrains_icons_chevron_down__WEBPACK_IMPORTED_MODULE_1__),_list_list__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/list/list.tsx"),_popup_popup__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/popup/popup.tsx"),_popup_menu_popup_menu__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/popup-menu/popup-menu.tsx"),_button_button__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/button/button.tsx"),_link_link__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./src/link/link.tsx"),_input_input__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./src/input/input.tsx"),_global_get_uid__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/global/get-uid.ts"),_dropdown__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/dropdown/dropdown.tsx");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Dropdown",parameters:{notes:"A stateful popup with a clickable anchor.",hermione:{actions:[{type:"click",selector:"[data-test~=ring-dropdown]"},{type:"capture",name:"dropdown",selector:["[data-test~=ring-dropdown]","[data-test~=ring-popup]"]}]}}},basic=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_dropdown__WEBPACK_IMPORTED_MODULE_2__.A,{anchor:"Click me"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_popup_popup__WEBPACK_IMPORTED_MODULE_3__.Ay,null,"Popup content"));basic.storyName="basic";const withCustomAnchorAndPopup=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_dropdown__WEBPACK_IMPORTED_MODULE_2__.A,{anchor:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button_button__WEBPACK_IMPORTED_MODULE_4__.Ay,{delayed:!0},"Edit")},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_popup_menu_popup_menu__WEBPACK_IMPORTED_MODULE_5__.A,{closeOnSelect:!0,data:["Cut","Copy","Paste"].map((label=>({label})))})),withCustomAnchorAndPopupAndContentAccessibilityHandling=()=>{const listId=(0,_global_get_uid__WEBPACK_IMPORTED_MODULE_6__.A)("popup-menu-list-id");return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_list_list__WEBPACK_IMPORTED_MODULE_7__.h.Provider,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_dropdown__WEBPACK_IMPORTED_MODULE_2__.A,{anchor:({active})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_list_list__WEBPACK_IMPORTED_MODULE_7__.h.ValueContext.Consumer,null,(activeItemId=>{const anchorAriaProps=active&&activeItemId?{"aria-owns":listId,"aria-activedescendant":activeItemId}:{};return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button_button__WEBPACK_IMPORTED_MODULE_4__.Ay,_extends({},anchorAriaProps,{delayed:!0}),"Edit")}))},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_popup_menu_popup_menu__WEBPACK_IMPORTED_MODULE_5__.A,{id:listId,ariaLabel:"My options menu",closeOnSelect:!0,activateFirstItem:!0,data:["Cut","Copy","Paste"].map((label=>({label,key:label.toLowerCase()})))})))};withCustomAnchorAndPopup.storyName="with custom anchor and popup";const withActiveClassName=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_dropdown__WEBPACK_IMPORTED_MODULE_2__.A,{className:"chevron",activeClassName:"rotated",anchor:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button_button__WEBPACK_IMPORTED_MODULE_4__.Ay,{title:"Details",icon:_jetbrains_icons_chevron_down__WEBPACK_IMPORTED_MODULE_1___default()})},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_popup_popup__WEBPACK_IMPORTED_MODULE_3__.Ay,null,"Popup content"));withActiveClassName.storyName="with activeClassName",withActiveClassName.parameters={storyStyles:"\n<style>\n  .chevron svg {\n    transition: transform 0.3s ease-out;\n    transform-origin: 50% 40%;\n    transform: rotate(0deg);\n  }\n\n  .rotated svg {\n    transform: rotate(180deg);\n  }\n</style>"};const withHoverMode=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_dropdown__WEBPACK_IMPORTED_MODULE_2__.A,{anchor:"Hover over me",hoverMode:!0},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_popup_popup__WEBPACK_IMPORTED_MODULE_3__.Ay,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,"Outer popup")));withHoverMode.storyName="with hover mode";const withHoverModeAndDisabledClickMode=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_dropdown__WEBPACK_IMPORTED_MODULE_2__.A,{anchor:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_link_link__WEBPACK_IMPORTED_MODULE_8__.A,{href:""},"Hover over me"),clickMode:!1,hoverMode:!0},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_popup_popup__WEBPACK_IMPORTED_MODULE_3__.Ay,null,"Popup content"));withHoverModeAndDisabledClickMode.storyName="with hover mode and disabled click mode",withHoverModeAndDisabledClickMode.parameters={hermione:{skip:!0}};const autofocusOnOpen=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{height:"90vh"}}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_dropdown__WEBPACK_IMPORTED_MODULE_2__.A,{anchor:"Scroll and then click me"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_popup_popup__WEBPACK_IMPORTED_MODULE_3__.Ay,{trapFocus:!0,autoFocusFirst:!0},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_input_input__WEBPACK_IMPORTED_MODULE_9__.Ay,{className:"ring-js-shortcuts"}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{height:"50vh"}}));autofocusOnOpen.storyName="autofocus on open",autofocusOnOpen.parameters={hermione:{skip:!0}};const renderProps=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_dropdown__WEBPACK_IMPORTED_MODULE_2__.A,{anchor:"Click me"},(props=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_popup_popup__WEBPACK_IMPORTED_MODULE_3__.Ay,props,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button_button__WEBPACK_IMPORTED_MODULE_4__.Ay,{onClick:props.onCloseAttempt,text:!0},"Close"))));renderProps.parameters={hermione:{skip:!0}},basic.parameters={...basic.parameters,docs:{...basic.parameters?.docs,source:{originalSource:'() => <Dropdown anchor="Click me">\n    <Popup>Popup content</Popup>\n  </Dropdown>',...basic.parameters?.docs?.source}}},withCustomAnchorAndPopup.parameters={...withCustomAnchorAndPopup.parameters,docs:{...withCustomAnchorAndPopup.parameters?.docs,source:{originalSource:"() => <Dropdown anchor={<Button delayed>Edit</Button>}>\n    <PopupMenu closeOnSelect data={['Cut', 'Copy', 'Paste'].map(label => ({\n    label\n  }))} />\n  </Dropdown>",...withCustomAnchorAndPopup.parameters?.docs?.source}}},withCustomAnchorAndPopupAndContentAccessibilityHandling.parameters={...withCustomAnchorAndPopupAndContentAccessibilityHandling.parameters,docs:{...withCustomAnchorAndPopupAndContentAccessibilityHandling.parameters?.docs,source:{originalSource:"() => {\n  const listId = getUID('popup-menu-list-id');\n  return <ActiveItemContext.Provider>\n      <Dropdown anchor={({\n      active\n    }) => <ActiveItemContext.ValueContext.Consumer>\n          {activeItemId => {\n        const anchorAriaProps = active && activeItemId ? {\n          'aria-owns': listId,\n          'aria-activedescendant': activeItemId\n        } : {};\n        return <Button {...anchorAriaProps} delayed>Edit</Button>;\n      }}\n        </ActiveItemContext.ValueContext.Consumer>}>\n        <PopupMenu id={listId} ariaLabel=\"My options menu\" closeOnSelect activateFirstItem data={['Cut', 'Copy', 'Paste'].map(label => ({\n        label,\n        key: label.toLowerCase()\n      }))} />\n      </Dropdown>\n    </ActiveItemContext.Provider>;\n}",...withCustomAnchorAndPopupAndContentAccessibilityHandling.parameters?.docs?.source}}},withActiveClassName.parameters={...withActiveClassName.parameters,docs:{...withActiveClassName.parameters?.docs,source:{originalSource:'() => <Dropdown className="chevron" activeClassName="rotated" anchor={<Button title="Details" icon={chevronDownIcon} />}>\n    <Popup>Popup content</Popup>\n  </Dropdown>',...withActiveClassName.parameters?.docs?.source}}},withHoverMode.parameters={...withHoverMode.parameters,docs:{...withHoverMode.parameters?.docs,source:{originalSource:'() => <Dropdown anchor="Hover over me" hoverMode>\n    <Popup>\n      <div>Outer popup</div>\n    </Popup>\n  </Dropdown>',...withHoverMode.parameters?.docs?.source}}},withHoverModeAndDisabledClickMode.parameters={...withHoverModeAndDisabledClickMode.parameters,docs:{...withHoverModeAndDisabledClickMode.parameters?.docs,source:{originalSource:'() => <Dropdown anchor={<Link href="">Hover over me</Link>} clickMode={false} hoverMode>\n    <Popup>Popup content</Popup>\n  </Dropdown>',...withHoverModeAndDisabledClickMode.parameters?.docs?.source}}},autofocusOnOpen.parameters={...autofocusOnOpen.parameters,docs:{...autofocusOnOpen.parameters?.docs,source:{originalSource:"() => <div>\n    <div style={{\n    height: '90vh'\n  }} />\n    <Dropdown anchor=\"Scroll and then click me\">\n      <Popup trapFocus autoFocusFirst>\n        <Input className=\"ring-js-shortcuts\" />\n      </Popup>\n    </Dropdown>\n    <div style={{\n    height: '50vh'\n  }} />\n  </div>",...autofocusOnOpen.parameters?.docs?.source}}},renderProps.parameters={...renderProps.parameters,docs:{...renderProps.parameters?.docs,source:{originalSource:'() => <Dropdown anchor="Click me">\n    {props => <Popup {...props}><Button onClick={props.onCloseAttempt} text>Close</Button></Popup>}\n  </Dropdown>',...renderProps.parameters?.docs?.source}}}},"./node_modules/util-deprecate/browser.js":(module,__unused_webpack_exports,__webpack_require__)=>{function config(name){try{if(!__webpack_require__.g.localStorage)return!1}catch(_){return!1}var val=__webpack_require__.g.localStorage[name];return null!=val&&"true"===String(val).toLowerCase()}module.exports=function deprecate(fn,msg){if(config("noDeprecation"))return fn;var warned=!1;return function deprecated(){if(!warned){if(config("throwDeprecation"))throw new Error(msg);config("traceDeprecation")?console.trace(msg):console.warn(msg),warned=!0}return fn.apply(this,arguments)}}}}]);