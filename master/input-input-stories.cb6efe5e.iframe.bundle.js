(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[1612],{"./node_modules/@jetbrains/icons/chevron-10px.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><g><polygon points="5 7.99 1.5 4.5 2.5 3.5 5 6.01 7.5 3.5 8.49 4.5 5 7.99"/></g></svg>'},"./node_modules/@jetbrains/icons/close-12px.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 12 12"><path fill-rule="evenodd" d="M9.918 2.065a.6.6 0 0 1 .002.849L6.849 5.998 9.924 9.07l-.424.425-.424.424-3.074-3.072-3.07 3.083a.6.6 0 1 1-.85-.847L5.153 6 2.08 2.928a.6.6 0 1 1 .849-.849L6 5.15l3.07-3.082a.6.6 0 0 1 .848-.002ZM9.5 9.495l-.424.425a.6.6 0 1 0 .848-.849l-.424.425Z" clip-rule="evenodd"/></svg>'},"./node_modules/@jetbrains/icons/search-12px.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 12 12"><path fill-rule="evenodd" d="M8 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-.547 3.16a4 4 0 1 1 .707-.707l2.694 2.693a.5.5 0 1 1-.708.707L7.453 8.16Z" clip-rule="evenodd"/></svg>'},"./node_modules/@jetbrains/icons/search.js":module=>{module.exports='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.504 6.877a4.627 4.627 0 1 1-9.254 0 4.627 4.627 0 0 1 9.254 0Zm-.937 4.575a5.877 5.877 0 1 1 .884-.884l3.361 3.36a.625.625 0 1 1-.884.884l-3.361-3.36Z" clip-rule="evenodd"/></svg>'},"./src/input/input.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:()=>basic,default:()=>__WEBPACK_DEFAULT_EXPORT__,heightS:()=>heightS,selectAll:()=>selectAll});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_jetbrains_icons_search__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@jetbrains/icons/search.js"),_jetbrains_icons_search__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_jetbrains_icons_search__WEBPACK_IMPORTED_MODULE_1__),_jetbrains_icons_search_12px__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@jetbrains/icons/search-12px.js"),_jetbrains_icons_search_12px__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_jetbrains_icons_search_12px__WEBPACK_IMPORTED_MODULE_2__),_button_button__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/button/button.tsx"),_global_controls_height__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/global/controls-height.tsx"),_control_label_control_label__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/control-label/control-label.tsx"),_input__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/input/input.tsx");function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Input",parameters:{storySource:{source:'import React, {PureComponent, useContext, useRef} from \'react\';\nimport searchIcon from \'@jetbrains/icons/search\';\nimport searchSIcon from \'@jetbrains/icons/search-12px\';\n\n\nimport Button from \'../button/button\';\n\nimport {ControlsHeight, ControlsHeightContext} from \'../global/controls-height\';\n\nimport {LabelType} from \'../control-label/control-label\';\n\nimport Input, {ContainerProps, InputSpecificProps, Size} from \'./input\';\n\nexport default {\n  title: \'Components/Input\',\n\n  parameters: {\n    notes: \'Text input fields of varying size.\',\n    zeplinLink: \'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc70ab2b23a8ca449004\'\n  }\n};\n\nclass ClearableInput extends PureComponent<ContainerProps<InputSpecificProps>> {\n  state = {\n    text: this.props.defaultValue\n  };\n\n  setText = (e: React.ChangeEvent<HTMLInputElement>) => {\n    this.setState({\n      text: e.target.value\n    });\n  };\n\n  clear = () => {\n    this.setState({\n      text: \'\'\n    });\n  };\n\n  render() {\n    const {defaultValue, ...restProps} = this.props;\n    return (\n      <Input\n        value={this.state.text}\n        onChange={this.setText}\n        onClear={this.clear}\n        {...restProps}\n      />\n    );\n  }\n}\nconst Inputs = () => {\n  const height = useContext(ControlsHeightContext);\n  return (\n    <form className="inputs">\n      <Input label="Labeled input"/>\n      <Input name="login" label="Label and hint" placeholder="Hint"/>\n      <Input label="Label and value" defaultValue="Default value"/>\n      <ClearableInput label="Clearable input" defaultValue="Default value"/>\n      <ClearableInput\n        placeholder="Hint"\n        label="Disabled clearable input"\n        defaultValue="Default value"\n        disabled\n      />\n      <Input label="Input with icon" icon={height === ControlsHeight.S ? searchSIcon : searchIcon} defaultValue="Default value"/>\n      <Input name="login" label="Primary label" labelType={LabelType.FORM} placeholder="Hint"/>\n      <ClearableInput placeholder="Hint" defaultValue="Borderless input" borderless/>\n      <Input label="Disabled input" disabled defaultValue="Default value"/>\n      <Input\n        label="Invalid input"\n        error="Error description that wraps over lines because of being really long"\n      />\n      <Input label="Error without description" error=""/>\n      <Input label="Short input" size={Size.S}/>\n      <Input label="Long input" size={Size.L}/>\n      <Input label="Autogrowing textarea" multiline defaultValue={\'First line\\nSecond line\'}/>\n    </form>\n  );\n};\nexport const basic = () => <Inputs/>;\n\nbasic.storyName = \'basic\';\n\nbasic.parameters = {\n  storyStyles: `\n<style>\n  .inputs {\n    display: flex;\n    flex-flow: column wrap;\n    max-height: 100vh;\n    margin-top: 8px;\n    background: var(--ring-content-background-color);\n  }\n\n  .inputs > div {\n    margin: 0 16px 8px;\n  }\n\n  .dark.dark {\n    margin: 0 -16px;\n    padding: 8px 16px;\n  }\n</style>`\n};\n\nexport const heightS = () => (\n  <ControlsHeightContext.Provider value={ControlsHeight.S}>\n    <Inputs/>\n  </ControlsHeightContext.Provider>\n);\nheightS.parameters = basic.parameters;\n\nfunction SelectAll() {\n  const ref = useRef<HTMLInputElement>(null);\n\n  function select() {\n    if (ref.current != null) {\n      ref.current.select();\n    }\n  }\n\n  return (\n    <>\n      <Input defaultValue="Value" inputRef={ref} label="Label"/>\n      <Button style={{marginTop: 4}} data-test-select onClick={select}>Select all</Button>\n    </>\n  );\n}\n\nexport const selectAll = () => <SelectAll/>;\n\nselectAll.parameters = {\n  hermione: {\n    actions: [\n      {type: \'click\', selector: \'[data-test-select]\'},\n      {type: \'capture\', selector: \'#storybook-root\'}\n    ]\n  }\n};\n',locationsMap:{basic:{startLoc:{col:21,line:81},endLoc:{col:36,line:81},startBody:{col:21,line:81},endBody:{col:36,line:81}},"height-s":{startLoc:{col:23,line:107},endLoc:{col:1,line:111},startBody:{col:23,line:107},endBody:{col:1,line:111}},"select-all":{startLoc:{col:25,line:131},endLoc:{col:43,line:131},startBody:{col:25,line:131},endBody:{col:43,line:131}}}},notes:"Text input fields of varying size.",zeplinLink:"https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc70ab2b23a8ca449004"}};class ClearableInput extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent{state={text:this.props.defaultValue};setText=e=>{this.setState({text:e.target.value})};clear=()=>{this.setState({text:""})};render(){const{defaultValue,...restProps}=this.props;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_input__WEBPACK_IMPORTED_MODULE_3__.cp,_extends({value:this.state.text,onChange:this.setText,onClear:this.clear},restProps))}}const Inputs=()=>{const height=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_global_controls_height__WEBPACK_IMPORTED_MODULE_4__.Ce);return react__WEBPACK_IMPORTED_MODULE_0__.createElement("form",{className:"inputs"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_input__WEBPACK_IMPORTED_MODULE_3__.cp,{label:"Labeled input"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_input__WEBPACK_IMPORTED_MODULE_3__.cp,{name:"login",label:"Label and hint",placeholder:"Hint"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_input__WEBPACK_IMPORTED_MODULE_3__.cp,{label:"Label and value",defaultValue:"Default value"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(ClearableInput,{label:"Clearable input",defaultValue:"Default value"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(ClearableInput,{placeholder:"Hint",label:"Disabled clearable input",defaultValue:"Default value",disabled:!0}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_input__WEBPACK_IMPORTED_MODULE_3__.cp,{label:"Input with icon",icon:height===_global_controls_height__WEBPACK_IMPORTED_MODULE_4__.as.S?_jetbrains_icons_search_12px__WEBPACK_IMPORTED_MODULE_2___default():_jetbrains_icons_search__WEBPACK_IMPORTED_MODULE_1___default(),defaultValue:"Default value"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_input__WEBPACK_IMPORTED_MODULE_3__.cp,{name:"login",label:"Primary label",labelType:_control_label_control_label__WEBPACK_IMPORTED_MODULE_5__.O2.FORM,placeholder:"Hint"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(ClearableInput,{placeholder:"Hint",defaultValue:"Borderless input",borderless:!0}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_input__WEBPACK_IMPORTED_MODULE_3__.cp,{label:"Disabled input",disabled:!0,defaultValue:"Default value"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_input__WEBPACK_IMPORTED_MODULE_3__.cp,{label:"Invalid input",error:"Error description that wraps over lines because of being really long"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_input__WEBPACK_IMPORTED_MODULE_3__.cp,{label:"Error without description",error:""}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_input__WEBPACK_IMPORTED_MODULE_3__.cp,{label:"Short input",size:_input__WEBPACK_IMPORTED_MODULE_3__.yM.S}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_input__WEBPACK_IMPORTED_MODULE_3__.cp,{label:"Long input",size:_input__WEBPACK_IMPORTED_MODULE_3__.yM.L}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_input__WEBPACK_IMPORTED_MODULE_3__.cp,{label:"Autogrowing textarea",multiline:!0,defaultValue:"First line\nSecond line"}))},basic=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(Inputs,null);basic.storyName="basic",basic.parameters={storyStyles:"\n<style>\n  .inputs {\n    display: flex;\n    flex-flow: column wrap;\n    max-height: 100vh;\n    margin-top: 8px;\n    background: var(--ring-content-background-color);\n  }\n\n  .inputs > div {\n    margin: 0 16px 8px;\n  }\n\n  .dark.dark {\n    margin: 0 -16px;\n    padding: 8px 16px;\n  }\n</style>"};const heightS=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_global_controls_height__WEBPACK_IMPORTED_MODULE_4__.Ce.Provider,{value:_global_controls_height__WEBPACK_IMPORTED_MODULE_4__.as.S},react__WEBPACK_IMPORTED_MODULE_0__.createElement(Inputs,null));function SelectAll(){const ref=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_input__WEBPACK_IMPORTED_MODULE_3__.cp,{defaultValue:"Value",inputRef:ref,label:"Label"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_button_button__WEBPACK_IMPORTED_MODULE_6__.cp,{style:{marginTop:4},"data-test-select":!0,onClick:function select(){null!=ref.current&&ref.current.select()}},"Select all"))}heightS.parameters=basic.parameters;const selectAll=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(SelectAll,null);selectAll.parameters={hermione:{actions:[{type:"click",selector:"[data-test-select]"},{type:"capture",selector:"#storybook-root"}]}}},"./node_modules/util-deprecate/browser.js":(module,__unused_webpack_exports,__webpack_require__)=>{function config(name){try{if(!__webpack_require__.g.localStorage)return!1}catch(_){return!1}var val=__webpack_require__.g.localStorage[name];return null!=val&&"true"===String(val).toLowerCase()}module.exports=function deprecate(fn,msg){if(config("noDeprecation"))return fn;var warned=!1;return function deprecated(){if(!warned){if(config("throwDeprecation"))throw new Error(msg);config("traceDeprecation")?console.trace(msg):console.warn(msg),warned=!0}return fn.apply(this,arguments)}}}}]);