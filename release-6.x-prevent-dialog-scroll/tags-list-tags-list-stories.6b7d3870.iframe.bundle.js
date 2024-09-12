(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[7198],{"./node_modules/@jetbrains/icons/checkmark.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14.853 3.149c.248.24.254.636.014.884l-8.541 8.816a.625.625 0 0 1-.863.033L1.177 9.085a.625.625 0 0 1 .83-.936l3.837 3.401 8.125-8.387a.625.625 0 0 1 .884-.014Z" clip-rule="evenodd"/></svg>'},"./node_modules/@jetbrains/icons/chevron-down.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.942 5.808a.625.625 0 0 0-.884 0L8 8.866 4.942 5.808a.625.625 0 1 0-.884.884l3.5 3.5c.244.244.64.244.884 0l3.5-3.5a.625.625 0 0 0 0-.884Z" clip-rule="evenodd"/></svg>'},"./src/tags-list/tags-list.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:()=>basic,default:()=>__WEBPACK_DEFAULT_EXPORT__,disabled:()=>disabled,withIcons:()=>withIcons});var _jetbrains_icons_checkmark__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@jetbrains/icons/checkmark.js"),_jetbrains_icons_checkmark__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_jetbrains_icons_checkmark__WEBPACK_IMPORTED_MODULE_0__),_tags_list__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/tags-list/tags-list.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Tags List",parameters:{notes:"Displays a list of tags."}},basic=()=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_tags_list__WEBPACK_IMPORTED_MODULE_2__.A,{className:"test-additional-class",tags:[{key:"test1",label:"test1"},{key:"test2",label:"test2"}]});basic.storyName="basic";const withIcons=()=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_tags_list__WEBPACK_IMPORTED_MODULE_2__.A,{tags:[{key:"test1",label:"test1",rgTagIcon:_jetbrains_icons_checkmark__WEBPACK_IMPORTED_MODULE_0___default()},{key:"test2",label:"test2"}]});withIcons.storyName="with icons";const disabled=()=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_tags_list__WEBPACK_IMPORTED_MODULE_2__.A,{disabled:!0,tags:[{key:"test1",label:"test1"},{key:"test2",label:"test2"}]});disabled.storyName="disabled",basic.parameters={...basic.parameters,docs:{...basic.parameters?.docs,source:{originalSource:"() => <TagsList className=\"test-additional-class\" tags={[{\n  key: 'test1',\n  label: 'test1'\n}, {\n  key: 'test2',\n  label: 'test2'\n}]} />",...basic.parameters?.docs?.source}}},withIcons.parameters={...withIcons.parameters,docs:{...withIcons.parameters?.docs,source:{originalSource:"() => <TagsList tags={[{\n  key: 'test1',\n  label: 'test1',\n  rgTagIcon: checkmarkIcon\n}, {\n  key: 'test2',\n  label: 'test2'\n}]} />",...withIcons.parameters?.docs?.source}}},disabled.parameters={...disabled.parameters,docs:{...disabled.parameters?.docs,source:{originalSource:"() => <TagsList disabled tags={[{\n  key: 'test1',\n  label: 'test1'\n}, {\n  key: 'test2',\n  label: 'test2'\n}]} />",...disabled.parameters?.docs?.source}}}},"./src/tags-list/tags-list.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>TagsList});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_tag_tag__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/tag/tag.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");function noop(){}class TagsList extends react__WEBPACK_IMPORTED_MODULE_0__.Component{static propTypes={children:prop_types__WEBPACK_IMPORTED_MODULE_3___default().node,tags:prop_types__WEBPACK_IMPORTED_MODULE_3___default().array,customTagComponent:prop_types__WEBPACK_IMPORTED_MODULE_3___default().elementType,activeIndex:prop_types__WEBPACK_IMPORTED_MODULE_3___default().number,canNotBeEmpty:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,disabled:prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool,handleClick:prop_types__WEBPACK_IMPORTED_MODULE_3___default().func,handleRemove:prop_types__WEBPACK_IMPORTED_MODULE_3___default().func,className:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string,tagClassName:prop_types__WEBPACK_IMPORTED_MODULE_3___default().string};static defaultProps={customTagComponent:null,canNotBeEmpty:!1,disabled:!1,handleClick:noop,handleRemove:noop};renderTag(tag,focusTag){const TagComponent=this.props.customTagComponent||_tag_tag__WEBPACK_IMPORTED_MODULE_4__.A,readOnly=this.props.disabled||tag.readOnly||this.props.canNotBeEmpty&&1===this.props.tags.length,{tagClassName}=this.props;return(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(TagComponent,{...tag,key:tag.key,readOnly,disabled:this.props.disabled||tag.disabled,focused:focusTag,onClick:this.props.handleClick(tag),onRemove:this.props.handleRemove(tag),className:tagClassName},tag.label)}render(){const{children,className,customTagComponent,canNotBeEmpty,handleClick,tagClassName,handleRemove,tags,activeIndex,...props}=this.props,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()("ring-js-shortcuts",className),tagsList=(this.props.tags||[]).map(((tag,index)=>this.renderTag(tag,this.props.activeIndex===index)));return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div",{"data-test":"ring-tags-list",className:classes,...props,children:[tagsList,children]})}}TagsList.__docgenInfo={description:"@name Tags List",methods:[{name:"renderTag",docblock:null,modifiers:[],params:[{name:"tag",optional:!1,type:{name:"T",alias:"T"}},{name:"focusTag",optional:!1,type:{name:"boolean"}}],returns:null}],displayName:"TagsList",props:{tags:{required:!1,tsType:{name:"unknown"},description:"",type:{name:"array"}},customTagComponent:{required:!1,tsType:{name:"ComponentType",elements:[{name:"JSX.LibraryManagedAttributes",elements:[{name:"Tag"},{name:"TagProps"}],raw:"JSX.LibraryManagedAttributes<typeof Tag, TagProps>"}],raw:"ComponentType<TagAttrs>"},description:"",defaultValue:{value:"null",computed:!1},type:{name:"elementType"}},canNotBeEmpty:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1},type:{name:"bool"}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1},type:{name:"bool"}},handleClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(tag: T) => (e: React.MouseEvent<HTMLElement>) => void",signature:{arguments:[{type:{name:"T"},name:"tag"}],return:{name:"signature",type:"function",raw:"(e: React.MouseEvent<HTMLElement>) => void",signature:{arguments:[{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}}}},description:"",defaultValue:{value:"function noop() {}",computed:!1},type:{name:"func"}},handleRemove:{required:!1,tsType:{name:"signature",type:"function",raw:"(tag: T) => (e: React.MouseEvent<HTMLElement>) => void",signature:{arguments:[{type:{name:"T"},name:"tag"}],return:{name:"signature",type:"function",raw:"(e: React.MouseEvent<HTMLElement>) => void",signature:{arguments:[{type:{name:"ReactMouseEvent",raw:"React.MouseEvent<HTMLElement>",elements:[{name:"HTMLElement"}]},name:"e"}],return:{name:"void"}}}}},description:"",defaultValue:{value:"function noop() {}",computed:!1},type:{name:"func"}},activeIndex:{required:!1,tsType:{name:"union",raw:"number | null | undefined",elements:[{name:"number"},{name:"null"},{name:"undefined"}]},description:"",type:{name:"number"}},tagClassName:{required:!1,tsType:{name:"union",raw:"string | null | undefined",elements:[{name:"string"},{name:"null"},{name:"undefined"}]},description:"",type:{name:"string"}},children:{description:"",type:{name:"node"},required:!1},className:{description:"",type:{name:"string"},required:!1}},composes:["HTMLAttributes"]}},"./node_modules/util-deprecate/browser.js":(module,__unused_webpack_exports,__webpack_require__)=>{function config(name){try{if(!__webpack_require__.g.localStorage)return!1}catch(_){return!1}var val=__webpack_require__.g.localStorage[name];return null!=val&&"true"===String(val).toLowerCase()}module.exports=function deprecate(fn,msg){if(config("noDeprecation"))return fn;var warned=!1;return function deprecated(){if(!warned){if(config("throwDeprecation"))throw new Error(msg);config("traceDeprecation")?console.trace(msg):console.warn(msg),warned=!0}return fn.apply(this,arguments)}}}}]);