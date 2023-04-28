(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[7172],{"./.storybook/react-decorator.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("@storybook/preview-api"),_src_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/global/react-render-adapter.ts");const reactDecorator=(StoryFn,context)=>{const node=(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useMemo)((()=>document.createElement("div")),[context.kind,context.name]);return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>()=>(0,_src_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_2__.uy)(node)),[node]),(0,_src_global_react_render_adapter__WEBPACK_IMPORTED_MODULE_2__.sY)(react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.StrictMode,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(StoryFn,null)),node),node};__webpack_exports__.Z=()=>reactDecorator},"./src/heading/heading.examples.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:function(){return basic}});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./.storybook/react-decorator.tsx"),_heading__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/heading/heading.tsx");const lorem=react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.");__webpack_exports__.default={title:"Components/Heading",decorators:[(0,_storybook_react_decorator__WEBPACK_IMPORTED_MODULE_1__.Z)()],parameters:{storySource:{source:"import React from 'react';\n\nimport reactDecorator from '../../.storybook/react-decorator';\n\nimport Heading, {H1, H2, H3, H4} from './heading';\n\nconst lorem = (\n  <div>\n    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut\n    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in\n    voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n  </div>\n);\n\nexport default {\n  title: 'Components/Heading',\n  decorators: [reactDecorator()],\n\n  parameters: {\n    notes: 'A component for rendering h1-h5 tags.'\n  }\n};\n\nexport const basic = () => (\n  <div>\n    <Heading level={Heading.Levels.H1}>Heading 1</Heading>\n    {lorem}\n    <H1 caps>Heading 1 caps</H1>\n    {lorem}\n    <H2>Heading 2</H2>\n    {lorem}\n    <H3>Heading 3</H3>\n    {lorem}\n    <H4>Heading 4</H4>\n    {lorem}\n  </div>\n);\n\nbasic.storyName = 'Heading';\n",locationsMap:{basic:{startLoc:{col:21,line:25},endLoc:{col:1,line:38},startBody:{col:21,line:25},endBody:{col:1,line:38}}}},notes:"A component for rendering h1-h5 tags."}};const basic=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_heading__WEBPACK_IMPORTED_MODULE_2__.Z,{level:_heading__WEBPACK_IMPORTED_MODULE_2__.Z.Levels.H1},"Heading 1"),lorem,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_heading__WEBPACK_IMPORTED_MODULE_2__.H1,{caps:!0},"Heading 1 caps"),lorem,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_heading__WEBPACK_IMPORTED_MODULE_2__.H2,null,"Heading 2"),lorem,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_heading__WEBPACK_IMPORTED_MODULE_2__.H3,null,"Heading 3"),lorem,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_heading__WEBPACK_IMPORTED_MODULE_2__.H4,null,"Heading 4"),lorem);basic.storyName="Heading",basic.__docgenInfo={description:"",methods:[],displayName:"basic"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/heading/heading.examples.tsx"]={name:"basic",docgenInfo:basic.__docgenInfo,path:"src/heading/heading.examples.tsx"})},"./src/heading/heading.tsx":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{H1:function(){return H1},H2:function(){return H2},H3:function(){return H3},H4:function(){return H4},O:function(){return Levels}});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_4__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),util_deprecate__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/util-deprecate/browser.js"),util_deprecate__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(util_deprecate__WEBPACK_IMPORTED_MODULE_2__),_heading_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/heading/heading.css"),_heading_css__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(_heading_css__WEBPACK_IMPORTED_MODULE_3__);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}let Levels=function(Levels){return Levels[Levels.H1=1]="H1",Levels[Levels.H2=2]="H2",Levels[Levels.H3=3]="H3",Levels[Levels.H4=4]="H4",Levels}({});const fallbackHeading=util_deprecate__WEBPACK_IMPORTED_MODULE_2___default()((()=>"h3"),"Headings of level 5 and higher are replaced with h3"),Heading=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)((function Heading(_ref){let{children:children,className:className,level:level=Levels.H1,...restProps}=_ref;const classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(_heading_css__WEBPACK_IMPORTED_MODULE_3___default().heading,className),Tag=level<=Levels.H4?`h${level}`:fallbackHeading();return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Tag,_extends({},restProps,{className:classes}),children)}));function makeHeading(level,useCaps){const H=(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)((_ref2=>{let{className:className,caps:caps,...restProps}=_ref2;const classes=classnames__WEBPACK_IMPORTED_MODULE_1___default()(className,{[_heading_css__WEBPACK_IMPORTED_MODULE_3___default().caps]:useCaps&&caps});return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Heading,_extends({},restProps,{level:level,className:classes}))}));return H.displayName=`H${level}`,H.propTypes={children:prop_types__WEBPACK_IMPORTED_MODULE_4___default().node,className:prop_types__WEBPACK_IMPORTED_MODULE_4___default().string,caps:prop_types__WEBPACK_IMPORTED_MODULE_4___default().bool},H}Heading.propTypes={children:prop_types__WEBPACK_IMPORTED_MODULE_4___default().node,className:prop_types__WEBPACK_IMPORTED_MODULE_4___default().string,level:prop_types__WEBPACK_IMPORTED_MODULE_4___default().oneOf([Levels.H1,Levels.H2,Levels.H3,Levels.H4])},Heading.Levels=Levels,__webpack_exports__.Z=Heading;const H1=makeHeading(Levels.H1,!0),H2=makeHeading(Levels.H2),H3=makeHeading(Levels.H3),H4=makeHeading(Levels.H4)},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/heading/heading.css":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/global.css"),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__.default),___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default,"",!0),___CSS_LOADER_EXPORT___.push([module.id,".heading_cd1b {\n\n  margin-top: var(--ring-line-height);\n}\n\n.heading_cd1b:first-child {\n    margin-top: 0;\n  }\n\nh1.heading_cd1b, h2.heading_cd1b {\n    margin-bottom: 8px;\n\n    color: var(--ring-heading-color);\n}\n\nh1.heading_cd1b {\n    font-size: 24px;\n    line-height: 28px;\n}\n\nh2.heading_cd1b {\n    font-size: 20px;\n    line-height: 24px;\n}\n\nh3.heading_cd1b {\n    margin-bottom: 0;\n\n    font-size: 16px;\n    line-height: 22px;\n}\n\nh4.heading_cd1b {\n    margin-bottom: 1px;\n\n    letter-spacing: 1px;\n    text-transform: uppercase;\n\n    font-size: 12px;\n    font-weight: normal;\n    line-height: 18px;\n}\n\n.caps_ae59 {\n  letter-spacing: 2px;\n  text-transform: uppercase;\n}\n","",{version:3,sources:["webpack://./src/heading/heading.css"],names:[],mappings:"AAEA;;EAGE,mCAAmC;AAuCrC;;AArCE;IACE,aAAa;EACf;;AAPF;IAUI,kBAAkB;;IAElB,gCAAgC;AA8BpC;;AA1CA;IAgBI,eAAe;IACf,iBAAiB;AAyBrB;;AA1CA;IAqBI,eAAe;IACf,iBAAiB;AAoBrB;;AA1CA;IA0BI,gBAAgB;;IAEhB,eAAe;IACf,iBAAiB;AAarB;;AA1CA;IAiCI,kBAAkB;;IAElB,mBAAmB;IACnB,yBAAyB;;IAEzB,eAAe;IACf,mBAAmB;IACnB,iBAAiB;AAErB;;AAEA;EACE,mBAAmB;EACnB,yBAAyB;AAC3B",sourcesContent:['@import "../global/variables.css";\n\n.heading {\n  composes: font from "../global/global.css";\n\n  margin-top: var(--ring-line-height);\n\n  &:first-child {\n    margin-top: 0;\n  }\n\n  @nest h1&, h2& {\n    margin-bottom: 8px;\n\n    color: var(--ring-heading-color);\n  }\n\n  @nest h1& {\n    font-size: 24px;\n    line-height: 28px;\n  }\n\n  @nest h2& {\n    font-size: 20px;\n    line-height: 24px;\n  }\n\n  @nest h3& {\n    margin-bottom: 0;\n\n    font-size: 16px;\n    line-height: 22px;\n  }\n\n  @nest h4& {\n    margin-bottom: 1px;\n\n    letter-spacing: 1px;\n    text-transform: uppercase;\n\n    font-size: 12px;\n    font-weight: normal;\n    line-height: 18px;\n  }\n}\n\n.caps {\n  letter-spacing: 2px;\n  text-transform: uppercase;\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={heading:"heading_cd1b "+_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.font,caps:"caps_ae59"},__webpack_exports__.default=___CSS_LOADER_EXPORT___},"./src/heading/heading.css":function(module,__unused_webpack_exports,__webpack_require__){var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./src/heading/heading.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./node_modules/util-deprecate/browser.js":function(module,__unused_webpack_exports,__webpack_require__){function config(name){try{if(!__webpack_require__.g.localStorage)return!1}catch(_){return!1}var val=__webpack_require__.g.localStorage[name];return null!=val&&"true"===String(val).toLowerCase()}module.exports=function deprecate(fn,msg){if(config("noDeprecation"))return fn;var warned=!1;return function deprecated(){if(!warned){if(config("throwDeprecation"))throw new Error(msg);config("traceDeprecation")?console.trace(msg):console.warn(msg),warned=!0}return fn.apply(this,arguments)}}}}]);