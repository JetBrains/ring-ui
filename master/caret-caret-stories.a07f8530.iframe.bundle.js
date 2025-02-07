(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[410],{"./node_modules/@jetbrains/icons/chevron-12px-down.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 12 12"><path fill-rule="evenodd" d="M9.067 4.246a.625.625 0 0 0-.884 0L6 6.429 3.817 4.246a.625.625 0 1 0-.884.883l2.625 2.625c.244.245.64.245.884 0L9.067 5.13a.625.625 0 0 0 0-.883Z" clip-rule="evenodd"/></svg>'},"./node_modules/@jetbrains/icons/chevron-down.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.942 5.808a.625.625 0 0 0-.884 0L8 8.866 4.942 5.808a.625.625 0 1 0-.884.884l3.5 3.5c.244.244.64.244.884 0l3.5-3.5a.625.625 0 0 0 0-.884Z" clip-rule="evenodd"/></svg>'},"./node_modules/@jetbrains/icons/close-12px.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 12 12"><path fill-rule="evenodd" d="M9.918 2.065a.6.6 0 0 1 .002.849L6.849 5.998 9.924 9.07l-.424.425-.424.424-3.074-3.072-3.07 3.083a.6.6 0 1 1-.85-.847L5.153 6 2.08 2.928a.6.6 0 1 1 .849-.849L6 5.15l3.07-3.082a.6.6 0 0 1 .848-.002ZM9.5 9.495l-.424.425a.6.6 0 1 0 .848-.849l-.424.425Z" clip-rule="evenodd"/></svg>'},"./src/caret/caret.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Basic:()=>Basic,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_link_link__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/link/link.tsx"),_input_input__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/input/input.tsx"),_caret__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/caret/caret.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Utilities/Caret",parameters:{notes:"Allows manipulation of the caret position in a text box or a contenteditable element. Ported from [jquery-caret](https://github.com/accursoft/caret/).",screenshots:{skip:!0}}},Basic=()=>{const input=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),caret=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();return(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{null!=input.current&&(caret.current=new _caret__WEBPACK_IMPORTED_MODULE_2__.A(input.current))}),[]),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_input_input__WEBPACK_IMPORTED_MODULE_3__.Ay,{multiline:!0,inputRef:input,label:"Textarea",defaultValue:"Lorem ipsum\ndolor sit amet"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_link_link__WEBPACK_IMPORTED_MODULE_4__.A,{pseudo:!0,onClick:event=>{caret.current?.focus(),caret.current?.setPosition(4),event.preventDefault()},children:"Set caret position"})})]})};Basic.storyName="Caret",Basic.parameters={...Basic.parameters,docs:{...Basic.parameters?.docs,source:{originalSource:'() => {\n  const input = useRef<HTMLTextAreaElement>(null);\n  const caret = useRef<Caret>();\n  useEffect(() => {\n    if (input.current != null) {\n      caret.current = new Caret(input.current);\n    }\n  }, []);\n  return <>\n      <Input multiline inputRef={input} label="Textarea" defaultValue={`Lorem ipsum\ndolor sit amet`} />\n      <div>\n        <Link pseudo onClick={event => {\n        caret.current?.focus();\n        caret.current?.setPosition(4);\n        event.preventDefault();\n      }}>\n          Set caret position\n        </Link>\n      </div>\n    </>;\n}',...Basic.parameters?.docs?.source}}}},"./src/caret/caret.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>Caret});var _global_dom__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/global/dom.ts");class Caret{static returnRE=/\r/g;static normalizeNewlines(value){return"string"==typeof value?value.replace(this.returnRE,""):value}target;constructor(target){this.target=target}isContentEditable(){return"true"===this.target.contentEditable||"true"===this.target.getAttribute("contenteditable")}focus(){document.activeElement&&document.activeElement===this.target||this.target.focus()}getAbsolutePosition(node){let _curNode=node,curPos=0;for(;null!=_curNode&&_curNode!==this.target;){for(;_curNode.previousSibling;){var _curNode$previousSibl;curPos+=null!==(_curNode$previousSibl=_curNode.previousSibling.textContent?.length)&&void 0!==_curNode$previousSibl?_curNode$previousSibl:0,_curNode=_curNode.previousSibling}_curNode=_curNode.parentNode}return curPos}getPosition(params={}){if(this.isContentEditable()){params.avoidFocus||this.focus();const selection=window.getSelection();if(!selection?.rangeCount)return 0;const range1=selection.getRangeAt(0),range2=range1.cloneRange();range2.selectNodeContents(this.target),range2.setEnd(range1.endContainer,range1.endOffset);const _curNode=range1.startContainer;if(this.target===_curNode)return 0===range1.startOffset||null==_curNode.textContent?0:_curNode.textContent.length;if(!this.target.contains(_curNode))return-1;if(!_curNode)return"selectionStart"in this.target&&this.target.selectionStart||-1;const curPos=this.getAbsolutePosition(_curNode);if(range1.startContainer===range1.endContainer)return range1.startOffset===range1.endOffset?curPos+range1.startOffset:{startOffset:curPos+range1.startOffset,endOffset:curPos+range1.endOffset,position:range2.toString().length};return{startOffset:curPos+range1.startOffset,endOffset:this.getAbsolutePosition(range1.endContainer)+range1.endOffset,position:range2.toString().length}}return"selectionStart"in this.target&&this.target.selectionStart||-1}getRelativePosition(curNode,position){let curPos=0,_curNode=curNode;if(!_curNode)return{_curNode:this.target,_correctedPosition:position};if(0===position){for(;3!==_curNode.nodeType;)_curNode=_curNode.childNodes[0];return{_curNode,_correctedPosition:position}}let i=-1;if(_curNode&&void 0!==_curNode.nodeType)for(;curPos<position&&3!==_curNode.nodeType&&(i++,null!=_curNode.childNodes[i]);){var _curNode$childNodes$i,_curNode$textContent$;curPos+=null!==(_curNode$childNodes$i=_curNode.childNodes[i].textContent?.length)&&void 0!==_curNode$childNodes$i?_curNode$childNodes$i:0,curPos>=position&&(_curNode=_curNode.childNodes[i],curPos-=null!==(_curNode$textContent$=_curNode.textContent?.length)&&void 0!==_curNode$textContent$?_curNode$textContent$:0,i=-1)}return{_curNode,_correctedPosition:position-curPos}}setPosition(position){const isContentEditable=this.isContentEditable();let correctedPosition,curNode=this.target&&this.target.childNodes[0];if(void 0!==position)if("object"==typeof position){const range=new Range,start=this.getRelativePosition(curNode,position.startOffset);range.setStart(start._curNode,start._correctedPosition);const end=this.getRelativePosition(curNode,position.endOffset);range.setEnd(end._curNode,end._correctedPosition),correctedPosition=range}else if(-1===position){var _value$length;const value=isContentEditable?this.target.textContent:Caret.normalizeNewlines("value"in this.target?this.target.value:void 0);correctedPosition=null!==(_value$length=value?.length)&&void 0!==_value$length?_value$length:0}else{const{_curNode,_correctedPosition}=this.getRelativePosition(curNode,position);curNode=_curNode,correctedPosition=_correctedPosition}if(isContentEditable){this.focus();try{correctedPosition instanceof Range?(window.getSelection()?.removeAllRanges(),window.getSelection()?.addRange(correctedPosition)):window.getSelection()?.collapse(curNode||this.target,correctedPosition)}catch(e){}}else"setSelectionRange"in this.target&&"number"==typeof correctedPosition&&this.target.setSelectionRange(correctedPosition,correctedPosition);return correctedPosition}getOffset(){let range,offset=0;try{range=window.getSelection()?.getRangeAt(0).cloneRange(),range?.setStart(range.startContainer,range.startOffset-1)}catch(e){return offset}return range&&0!==range.endOffset&&""!==range.toString()&&(offset=(0,_global_dom__WEBPACK_IMPORTED_MODULE_0__.l)(range).right-(0,_global_dom__WEBPACK_IMPORTED_MODULE_0__.l)(this.target).left-(range.startContainer instanceof HTMLElement&&range.startContainer.offsetLeft||0)),offset}}},"./src/control-help/control-help.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>ControlHelp});var classnames__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__),_control_help_css__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/control-help/control-help.css"),_control_help_css__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_control_help_css__WEBPACK_IMPORTED_MODULE_1__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");function ControlHelp({className,...restProps}){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div",{className:classnames__WEBPACK_IMPORTED_MODULE_0___default()(className,_control_help_css__WEBPACK_IMPORTED_MODULE_1___default().help),...restProps})}ControlHelp.__docgenInfo={description:"",methods:[],displayName:"ControlHelp"}},"./src/global/composeRefs.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{C:()=>createComposedRef});var memoize_one__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/memoize-one/dist/memoize-one.esm.js");function composeRefs(...refs){return value=>refs.forEach((ref=>{"function"==typeof ref?ref(value):null!=ref&&(ref.current=value)}))}function createComposedRef(){return(0,memoize_one__WEBPACK_IMPORTED_MODULE_0__.A)(composeRefs)}},"./src/link/link.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__,F:()=>linkHOC});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_global_data_tests__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/global/data-tests.ts"),_clickableLink__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/link/clickableLink.tsx"),_link_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/link/link.css"),_link_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_link_css__WEBPACK_IMPORTED_MODULE_2__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/jsx-runtime.js");function linkHOC(ComposedComponent){const isCustom="string"!=typeof ComposedComponent&&ComposedComponent!==_clickableLink__WEBPACK_IMPORTED_MODULE_4__.A;return class Link extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{render(){const{active,inherit,pseudo,hover,className,"data-test":dataTest,href,children,onPlainLeftClick,onClick,...restProps}=this.props,useButton=pseudo||!isCustom&&null==href,classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_link_css__WEBPACK_IMPORTED_MODULE_2___default().link,className,{[_link_css__WEBPACK_IMPORTED_MODULE_2___default().active]:active,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().inherit]:inherit,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().hover]:hover,[_link_css__WEBPACK_IMPORTED_MODULE_2___default().pseudo]:useButton});let props=restProps;return isCustom&&!props.activeClassName&&(props={...props,activeClassName:_link_css__WEBPACK_IMPORTED_MODULE_2___default().active}),useButton?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button",{type:"button",...props,className:classes,onClick:onClick||onPlainLeftClick,"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_5__.A)("ring-link",dataTest),children}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(ComposedComponent,{...props,href,className:classes,onClick,onPlainLeftClick,"data-test":(0,_global_data_tests__WEBPACK_IMPORTED_MODULE_5__.A)("ring-link",dataTest),children})}}}const __WEBPACK_DEFAULT_EXPORT__=linkHOC(_clickableLink__WEBPACK_IMPORTED_MODULE_4__.A)},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/control-help/control-help.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,".help_cb69 {\n  color: var(--ring-secondary-color);\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: var(--ring-line-height-lowest);\n}\n","",{version:3,sources:["webpack://./src/control-help/control-help.css"],names:[],mappings:"AAEA;EACE,kCAAkC;;EAElC,wCAAwC;EACxC,2CAA2C;AAC7C",sourcesContent:['@import "../global/variables.css";\n\n.help {\n  color: var(--ring-secondary-color);\n\n  font-size: var(--ring-font-size-smaller);\n  line-height: var(--ring-line-height-lowest);\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={help:"help_cb69"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/link/link.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,"@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {:is(.link_c73c,.withLinks_a3f8 a):hover {\n    text-decoration-line: underline;\n\n    transition: none;\n\n    color: var(--ring-link-hover-color);\n  }}\n\n.link_c73c,\n.withLinks_a3f8 a {\n  cursor: pointer;\n  transition: color var(--ring-fast-ease);\n\n  color: var(--ring-link-color);\n  border-radius: var(--ring-border-radius);\n\n  outline: none;\n\n  text-decoration-line: none;\n  text-decoration-thickness: 1px;\n  text-underline-offset: 3px;\n}\n\n@media (resolution >= 2dppx) {\n\n.link_c73c,\n.withLinks_a3f8 a {\n    text-decoration-thickness: 0.5px;\n}\n  }\n\n.hover_e4ca:is(.link_c73c,.withLinks_a3f8 a) {\n    text-decoration-line: underline;\n\n    transition: none;\n\n    color: var(--ring-link-hover-color);\n  }\n\n/* stylelint-disable-next-line selector-max-specificity */\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.pseudo_cb40:is(.link_c73c,.withLinks_a3f8 a):hover {\n    text-decoration: none;\n  }}\n\n:is(.link_c73c,.withLinks_a3f8 a):focus-visible {\n    box-shadow: 0 0 0 2px var(--ring-border-hover-color);\n  }\n\n.link_c73c.active_eef2 {\n  color: inherit;\n}\n\n@media (hover: hover), (-moz-touch-enabled: 0), (-ms-high-contrast: none), (-ms-high-contrast: active) {.inherit_c3d7:not(:hover) {\n  color: inherit;\n}}\n\n.pseudo_cb40 {\n  margin: 0;\n  padding: 0;\n\n  text-align: left;\n\n  border: 0;\n\n  background: transparent;\n\n  font: inherit;\n}\n\n.pseudo_cb40::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n","",{version:3,sources:["<no source>","webpack://./src/link/link.css"],names:[],mappings:"AAAA,wGAAA;IAAA,gCAAA;;IAAA,iBAAA;;IAAA,oCAAA;GAAA,CAAA;;ACEA;;EAEE,eAAe;EACf,uCAAuC;;EAEvC,6BAA6B;EAC7B,wCAAwC;;EAExC,aAAa;;EAEb,0BAA0B;EAC1B,8BAA8B;EAC9B,0BAA0B;AAuB5B;;AArBE;;AAdF;;IAeI,gCAAgC;AAoBpC;EAnBE;;AAEA;IAEE,+BAA+B;;IAE/B,gBAAgB;;IAEhB,mCAAmC;EACrC;;AAEA,yDAAyD;;AD7B3D,wGAAA;IAAA,sBAAA;GAAA,CAAA;;ACkCE;IACE,oDAAoD;EACtD;;AAGF;EACE,cAAc;AAChB;;ADzCA,wGAAA;EAAA,eAAA;CAAA,CAAA;;AC+CA;EACE,SAAS;EACT,UAAU;;EAEV,gBAAgB;;EAEhB,SAAS;;EAET,uBAAuB;;EAEvB,aAAa;AAOf;;AALE;IACE,UAAU;;IAEV,SAAS;EACX",sourcesContent:[null,'@import "../global/variables.css";\n\n.link,\n.withLinks a {\n  cursor: pointer;\n  transition: color var(--ring-fast-ease);\n\n  color: var(--ring-link-color);\n  border-radius: var(--ring-border-radius);\n\n  outline: none;\n\n  text-decoration-line: none;\n  text-decoration-thickness: 1px;\n  text-underline-offset: 3px;\n\n  @media (resolution >= 2dppx) {\n    text-decoration-thickness: 0.5px;\n  }\n\n  &:hover,\n  &.hover {\n    text-decoration-line: underline;\n\n    transition: none;\n\n    color: var(--ring-link-hover-color);\n  }\n\n  /* stylelint-disable-next-line selector-max-specificity */\n  &.pseudo:hover {\n    text-decoration: none;\n  }\n\n  &:focus-visible {\n    box-shadow: 0 0 0 2px var(--ring-border-hover-color);\n  }\n}\n\n.link.active {\n  color: inherit;\n}\n\n.inherit:not(:hover) {\n  color: inherit;\n}\n\n.pseudo {\n  margin: 0;\n  padding: 0;\n\n  text-align: left;\n\n  border: 0;\n\n  background: transparent;\n\n  font: inherit;\n\n  &::-moz-focus-inner {\n    padding: 0;\n\n    border: 0;\n  }\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={link:"link_c73c",withLinks:"withLinks_a3f8",hover:"hover_e4ca",pseudo:"pseudo_cb40",active:"active_eef2",inherit:"inherit_c3d7"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/memoize-one/dist/memoize-one.esm.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>memoizeOne});var safeIsNaN=Number.isNaN||function ponyfill(value){return"number"==typeof value&&value!=value};function areInputsEqual(newInputs,lastInputs){if(newInputs.length!==lastInputs.length)return!1;for(var i=0;i<newInputs.length;i++)if(first=newInputs[i],second=lastInputs[i],!(first===second||safeIsNaN(first)&&safeIsNaN(second)))return!1;var first,second;return!0}function memoizeOne(resultFn,isEqual){void 0===isEqual&&(isEqual=areInputsEqual);var cache=null;function memoized(){for(var newArgs=[],_i=0;_i<arguments.length;_i++)newArgs[_i]=arguments[_i];if(cache&&cache.lastThis===this&&isEqual(newArgs,cache.lastArgs))return cache.lastResult;var lastResult=resultFn.apply(this,newArgs);return cache={lastResult,lastArgs:newArgs,lastThis:this},lastResult}return memoized.clear=function clear(){cache=null},memoized}},"./src/control-help/control-help.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/control-help/control-help.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/link/link.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/link/link.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./node_modules/util-deprecate/browser.js":(module,__unused_webpack_exports,__webpack_require__)=>{function config(name){try{if(!__webpack_require__.g.localStorage)return!1}catch(_){return!1}var val=__webpack_require__.g.localStorage[name];return null!=val&&"true"===String(val).toLowerCase()}module.exports=function deprecate(fn,msg){if(config("noDeprecation"))return fn;var warned=!1;return function deprecated(){if(!warned){if(config("throwDeprecation"))throw new Error(msg);config("traceDeprecation")?console.trace(msg):console.warn(msg),warned=!0}return fn.apply(this,arguments)}}}}]);