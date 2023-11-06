"use strict";(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[4815],{"./.storybook/angular-decorator.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__,i:()=>APP_NAME});var angular__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/angular/index.js"),angular__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("@storybook/preview-api");const APP_NAME="ring-ui.story.app",angularDecorator=story=>{const node=document.createElement("div");node.innerHTML=story();const app=angular__WEBPACK_IMPORTED_MODULE_0___default().bootstrap(node,[APP_NAME],{strictDi:!0});return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>()=>{app.get("$rootScope").$destroy(),node.innerHTML=""})),node},__WEBPACK_DEFAULT_EXPORT__=()=>angularDecorator},"./src/user-card-ng/user-card-ng.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:()=>basic,default:()=>user_card_ng_stories,loadOnHover:()=>loadOnHover});var angular=__webpack_require__("./node_modules/angular/index.js"),angular_default=__webpack_require__.n(angular),angular_decorator=__webpack_require__("./.storybook/angular-decorator.js"),hub_config=__webpack_require__("./.storybook/hub-config.ts"),auth_auth=__webpack_require__("./src/auth/auth.ts"),hub_source_user=__webpack_require__("./src/hub-source/hub-source__user.ts"),avatar_example_datauri=__webpack_require__("./src/avatar/avatar-example-datauri.tsx"),angular_component_factory=__webpack_require__("./src/global/angular-component-factory.js"),smart_user_card_tooltip=__webpack_require__("./src/user-card/smart-user-card-tooltip.tsx"),tooltip=__webpack_require__("./src/user-card/tooltip.tsx");const angularModule=angular_default().module("Ring.user-card",[]);angularModule.component("rgUserCardTooltip",(0,angular_component_factory.f)(tooltip.Z,"UserCardTooltip")).component("rgSmartUserCardTooltip",(0,angular_component_factory.f)(smart_user_card_tooltip.Z,"SmartUserCardTooltip"));const user_card_ng=angularModule.name;const user_card_ng_stories={title:"Legacy Angular/User Card Ng",decorators:[(0,angular_decorator.Z)()],parameters:{storySource:{source:"import angular from 'angular';\n\nimport angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';\n\nimport hubConfig from '../../.storybook/hub-config';\n\nimport Auth from '../auth/auth';\nimport {createHubUserCardSource} from '../hub-source/hub-source__user';\n\nimport {avatarDataUri} from '../avatar/avatar-example-datauri';\n\nimport UserCardNG from './user-card-ng';\n\nexport default {\n  title: 'Legacy Angular/User Card Ng',\n  decorators: [angularDecorator()],\n\n  parameters: {\n    notes: 'Provides an Angular wrapper for User Card.',\n    hermione: {skip: true}\n  }\n};\n\nexport const basic = () => {\n  angular.module(APP_NAME, [UserCardNG]).controller('ExampleCtrl', function ctrl() {\n    this.user = {\n      login: 'testuser',\n      name: 'Test User',\n      email: 'testuser@mail.com',\n      avatarUrl: avatarDataUri,\n      href: `${hubConfig.serverUri}/users/0`\n    };\n  });\n\n  return `\n      <div ng-controller=\"ExampleCtrl as ctrl\">\n        <rg-user-card-tooltip user=\"ctrl.user\">\n          Hover me to see {{ctrl.user.name}}'s card\n        </rg-user-card-tooltip>\n      </div>\n    `;\n};\n\nbasic.storyName = 'basic';\n\nexport const loadOnHover = () => {\n  angular.module(APP_NAME, [UserCardNG]).controller('ExampleCtrl', function ctrl() {\n    const auth = new Auth(hubConfig);\n\n    this.userSource = async () => {\n      await auth.init();\n      const userSource = createHubUserCardSource(auth, auth.user.id);\n      return userSource();\n    };\n  });\n\n  return `\n      <div ng-controller=\"ExampleCtrl as ctrl\">\n        <rg-smart-user-card-tooltip user-data-source=\"ctrl.userSource\">\n          Hover me to see current user's card\n        </rg-smart-user-card-tooltip>\n      </div>\n    `;\n};\n\nloadOnHover.storyName = 'load on hover';\n",locationsMap:{basic:{startLoc:{col:21,line:24},endLoc:{col:1,line:42},startBody:{col:21,line:24},endBody:{col:1,line:42}},"load-on-hover":{startLoc:{col:27,line:46},endLoc:{col:1,line:64},startBody:{col:27,line:46},endBody:{col:1,line:64}}}},notes:"Provides an Angular wrapper for User Card.",hermione:{skip:!0}}},basic=()=>(angular_default().module(angular_decorator.i,[user_card_ng]).controller("ExampleCtrl",(function ctrl(){this.user={login:"testuser",name:"Test User",email:"testuser@mail.com",avatarUrl:avatar_example_datauri.x,href:`${hub_config.Z.serverUri}/users/0`}})),'\n      <div ng-controller="ExampleCtrl as ctrl">\n        <rg-user-card-tooltip user="ctrl.user">\n          Hover me to see {{ctrl.user.name}}\'s card\n        </rg-user-card-tooltip>\n      </div>\n    ');basic.storyName="basic";const loadOnHover=()=>(angular_default().module(angular_decorator.i,[user_card_ng]).controller("ExampleCtrl",(function ctrl(){const auth=new auth_auth.ZP(hub_config.Z);this.userSource=async()=>{await auth.init();return(0,hub_source_user.B)(auth,auth.user.id)()}})),'\n      <div ng-controller="ExampleCtrl as ctrl">\n        <rg-smart-user-card-tooltip user-data-source="ctrl.userSource">\n          Hover me to see current user\'s card\n        </rg-smart-user-card-tooltip>\n      </div>\n    ');loadOnHover.storyName="load on hover"},"./src/global/angular-component-factory.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{f:()=>createAngularComponent,Z:()=>angular_component_factory});var angular=__webpack_require__("./node_modules/angular/index.js"),angular_default=__webpack_require__.n(angular),react=__webpack_require__("./node_modules/react/index.js"),react_render_adapter=__webpack_require__("./src/global/react-render-adapter.ts"),ring_angular_component=__webpack_require__("./src/global/ring-angular-component.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types);class Renderer extends react.Component{static propTypes={className:prop_types_default().string,nodes:prop_types_default().oneOfType([prop_types_default().array,prop_types_default().object])};componentDidMount(){const{node}=this,{nodes}=this.props;node&&nodes&&nodes.length&&Array.from(this.props.nodes).forEach((nodeToRender=>node.appendChild(nodeToRender)))}node;nodeRef=node=>{this.node=node};render(){const{className}=this.props;return react.createElement("div",{className,ref:this.nodeRef})}}function createAngularComponent(Component){const propKeys=Object.keys(Component.propTypes),bindings={};propKeys.forEach((key=>{bindings[key]="<"}));class AngularComponent extends ring_angular_component.Z{static bindings=bindings;static transclude=!0;$postLink(){const{$transclude}=this.$inject;$transclude((clone=>{this.container=document.createElement("div");for(let i=0;i<clone.length;i++)this.container.appendChild(clone[i]);this.render()}))}$onChanges(){this.container&&this.render()}$onDestroy(){(0,react_render_adapter.uy)(this.$inject.$element[0])}render(){var _this=this;const{$scope,$element:{0:container}}=this.$inject,props={};propKeys.forEach((key=>{void 0!==this[key]&&("function"==typeof this[key]?props[key]=function(){const ret=_this[key](...arguments);return $scope.$applyAsync(),ret}:props[key]=this[key])}));const hasInnerContent=this.container.hasChildNodes();(0,react_render_adapter.sY)(react.createElement(Component,props,hasInnerContent?react.createElement(Renderer,{nodes:this.container.childNodes}):null),container)}}return AngularComponent.$inject=["$scope","$element","$transclude"],AngularComponent}Renderer.__docgenInfo={description:"",methods:[{name:"nodeRef",docblock:null,modifiers:[],params:[{name:"node",type:{name:"union",raw:"HTMLElement | null",elements:[{name:"HTMLElement"},{name:"null"}]}}],returns:null}],displayName:"Renderer",props:{className:{type:{name:"string"},required:!1,description:"",tsType:{name:"union",raw:"string | undefined",elements:[{name:"string"},{name:"undefined"}]}},nodes:{type:{name:"union",value:[{name:"array"},{name:"object"}]},required:!0,description:"",tsType:{name:"union",raw:"readonly Node[] | NodeList",elements:[{name:"unknown"},{name:"NodeList"}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/global/react-dom-renderer.tsx"]={name:"Renderer",docgenInfo:Renderer.__docgenInfo,path:"src/global/react-dom-renderer.tsx"});const angular_component_factory=function angularComponentFactory(Component,name){const angularModuleName=`Ring.${name[0].toLowerCase()+name.slice(1)}`;return angular_default().module(angularModuleName,[]).component(function getAngularComponentName(name){return`rg${name}`}(name),createAngularComponent(Component))}},"./src/global/ring-angular-component.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>RingAngularComponent});class RingAngularComponent{static get controller(){return this}$inject={};constructor(){for(var _this$constructor$$in,_len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++)args[_key]=arguments[_key];(null!==(_this$constructor$$in=this.constructor.$inject)&&void 0!==_this$constructor$$in?_this$constructor$$in:[]).forEach(((injectName,i)=>{this.$inject[injectName]=args[i]}))}}}}]);