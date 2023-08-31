"use strict";(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[9061],{"./.storybook/angular-decorator.js":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{i:function(){return APP_NAME}});var angular__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/angular/index.js"),angular__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("@storybook/preview-api");const APP_NAME="ring-ui.story.app",angularDecorator=story=>{const node=document.createElement("div");node.innerHTML=story();const app=angular__WEBPACK_IMPORTED_MODULE_0___default().bootstrap(node,[APP_NAME],{strictDi:!0});return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>()=>{app.get("$rootScope").$destroy(),node.innerHTML=""})),node};__webpack_exports__.Z=()=>angularDecorator},"./src/tags-input-ng/tags-input-ng.stories.js":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:function(){return basic},default:function(){return tags_input_ng_stories}});var angular=__webpack_require__("./node_modules/angular/index.js"),angular_default=__webpack_require__.n(angular),angular_decorator=__webpack_require__("./.storybook/angular-decorator.js"),angular_component_factory=__webpack_require__("./src/global/angular-component-factory.js"),tags_input=__webpack_require__("./src/tags-input/tags-input.tsx"),tags_input_ng=(0,angular_component_factory.Z)(tags_input.Z,"TagsInput").name,tags_input_ng_stories={title:"Legacy Angular/Tags Input Ng",decorators:[(0,angular_decorator.Z)()],parameters:{storySource:{source:"import angular from 'angular';\n\nimport angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';\n\nimport TagsInputNG from './tags-input-ng';\n\nexport default {\n  title: 'Legacy Angular/Tags Input Ng',\n  decorators: [angularDecorator()],\n\n  parameters: {\n    notes: 'Provides an Angular wrapper for Tags Input.'\n  }\n};\n\nexport const basic = ({onAddTag, onRemoveTag}) => {\n  angular.module(APP_NAME, [TagsInputNG]).controller('ExampleCtrl', function ctrl($q) {\n    this.tags = [{key: 'test1', label: 'test1'}, {key: 'test2', label: 'test2'}];\n\n    this.dataSource = () =>\n      $q.when([{key: 'test3', label: 'test3'}, {key: 'test4', label: 'test4'}]);\n\n    this.onAddTag = onAddTag;\n\n    this.removeTag = onRemoveTag;\n  });\n  return `\n      <div ng-controller=\"ExampleCtrl as ctrl\">\n        <rg-tags-input\n          tags=\"ctrl.tags\"\n          x-data-source=\"ctrl.dataSource\"\n          placeholder=\"'Type something'\"\n          on-add-tag=\"ctrl.onAddTag\"\n          on-remove-tag=\"ctrl.removeTag\"\n        ></rg-tags-input>\n      </div>\n    `;\n};\n\nbasic.storyName = 'Tags Input Ng';\nbasic.argTypes = {onAddTag: {}, onRemoveTag: {}};\n",locationsMap:{basic:{startLoc:{col:21,line:16},endLoc:{col:1,line:38},startBody:{col:21,line:16},endBody:{col:1,line:38}}}},notes:"Provides an Angular wrapper for Tags Input."}};const basic=_ref=>{let{onAddTag:onAddTag,onRemoveTag:onRemoveTag}=_ref;return angular_default().module(angular_decorator.i,[tags_input_ng]).controller("ExampleCtrl",["$q",function ctrl($q){this.tags=[{key:"test1",label:"test1"},{key:"test2",label:"test2"}],this.dataSource=()=>$q.when([{key:"test3",label:"test3"},{key:"test4",label:"test4"}]),this.onAddTag=onAddTag,this.removeTag=onRemoveTag}]),'\n      <div ng-controller="ExampleCtrl as ctrl">\n        <rg-tags-input\n          tags="ctrl.tags"\n          x-data-source="ctrl.dataSource"\n          placeholder="\'Type something\'"\n          on-add-tag="ctrl.onAddTag"\n          on-remove-tag="ctrl.removeTag"\n        ></rg-tags-input>\n      </div>\n    '};basic.storyName="Tags Input Ng",basic.argTypes={onAddTag:{},onRemoveTag:{}}},"./src/global/angular-component-factory.js":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{f:function(){return createAngularComponent},Z:function(){return angular_component_factory}});var angular=__webpack_require__("./node_modules/angular/index.js"),angular_default=__webpack_require__.n(angular),react=__webpack_require__("./node_modules/react/index.js"),react_render_adapter=__webpack_require__("./src/global/react-render-adapter.ts"),ring_angular_component=__webpack_require__("./src/global/ring-angular-component.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types);class Renderer extends react.Component{static propTypes={className:prop_types_default().string,nodes:prop_types_default().oneOfType([prop_types_default().array,prop_types_default().object])};componentDidMount(){const{node:node}=this,{nodes:nodes}=this.props;node&&nodes&&nodes.length&&Array.from(this.props.nodes).forEach((nodeToRender=>node.appendChild(nodeToRender)))}node;nodeRef=node=>{this.node=node};render(){const{className:className}=this.props;return react.createElement("div",{className:className,ref:this.nodeRef})}}function createAngularComponent(Component){const propKeys=Object.keys(Component.propTypes),bindings={};propKeys.forEach((key=>{bindings[key]="<"}));class AngularComponent extends ring_angular_component.Z{static bindings=bindings;static transclude=!0;$postLink(){const{$transclude:$transclude}=this.$inject;$transclude((clone=>{this.container=document.createElement("div");for(let i=0;i<clone.length;i++)this.container.appendChild(clone[i]);this.render()}))}$onChanges(){this.container&&this.render()}$onDestroy(){(0,react_render_adapter.uy)(this.$inject.$element[0])}render(){var _this=this;const{$scope:$scope,$element:{0:container}}=this.$inject,props={};propKeys.forEach((key=>{void 0!==this[key]&&("function"==typeof this[key]?props[key]=function(){const ret=_this[key](...arguments);return $scope.$applyAsync(),ret}:props[key]=this[key])}));const hasInnerContent=this.container.hasChildNodes();(0,react_render_adapter.sY)(react.createElement(Component,props,hasInnerContent?react.createElement(Renderer,{nodes:this.container.childNodes}):null),container)}}return AngularComponent.$inject=["$scope","$element","$transclude"],AngularComponent}Renderer.__docgenInfo={description:"",methods:[{name:"nodeRef",docblock:null,modifiers:[],params:[{name:"node",type:{name:"union",raw:"HTMLElement | null",elements:[{name:"HTMLElement"},{name:"null"}]}}],returns:null}],displayName:"Renderer",props:{className:{type:{name:"string"},required:!1,description:"",tsType:{name:"union",raw:"string | undefined",elements:[{name:"string"},{name:"undefined"}]}},nodes:{type:{name:"union",value:[{name:"array"},{name:"object"}]},required:!0,description:"",tsType:{name:"union",raw:"readonly Node[] | NodeList",elements:[{name:"unknown"},{name:"NodeList"}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/global/react-dom-renderer.tsx"]={name:"Renderer",docgenInfo:Renderer.__docgenInfo,path:"src/global/react-dom-renderer.tsx"});var angular_component_factory=function angularComponentFactory(Component,name){const angularModuleName=`Ring.${name[0].toLowerCase()+name.slice(1)}`;return angular_default().module(angularModuleName,[]).component(function getAngularComponentName(name){return`rg${name}`}(name),createAngularComponent(Component))}},"./src/global/ring-angular-component.js":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{Z:function(){return RingAngularComponent}});class RingAngularComponent{static get controller(){return this}$inject={};constructor(){for(var _this$constructor$$in,_len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++)args[_key]=arguments[_key];(null!==(_this$constructor$$in=this.constructor.$inject)&&void 0!==_this$constructor$$in?_this$constructor$$in:[]).forEach(((injectName,i)=>{this.$inject[injectName]=args[i]}))}}}}]);