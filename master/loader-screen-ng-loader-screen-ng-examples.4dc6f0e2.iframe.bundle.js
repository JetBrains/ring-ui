(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[366],{"./.storybook/angular-decorator.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__,i:()=>APP_NAME});var angular__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/angular/index.js"),angular__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("@storybook/preview-api");const APP_NAME="ring-ui.story.app",angularDecorator=story=>{const node=document.createElement("div");node.innerHTML=story();const app=angular__WEBPACK_IMPORTED_MODULE_0___default().bootstrap(node,[APP_NAME],{strictDi:!0});return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>()=>{app.get("$rootScope").$destroy(),node.innerHTML=""})),node},__WEBPACK_DEFAULT_EXPORT__=()=>angularDecorator},"./src/loader-screen-ng/loader-screen-ng.examples.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:()=>basic,default:()=>loader_screen_ng_examples});var angular=__webpack_require__("./node_modules/angular/index.js"),angular_default=__webpack_require__.n(angular),angular_decorator=__webpack_require__("./.storybook/angular-decorator.js"),loader_ng=__webpack_require__("./src/loader-ng/loader-ng.js"),loader_screen=__webpack_require__("./src/loader-screen/loader-screen.css"),loader_screen_default=__webpack_require__.n(loader_screen);const angularModule=angular_default().module("Ring.loader-screen",[loader_ng.Z]);angularModule.service("loaderScreen",["$timeout","$rootScope",function service($timeout,$rootScope){var _this=this;let showLoader,showLoaderPromise,initialLoading=!1,loadingFailed=!1;this.startLoading=function(){showLoaderPromise||(showLoaderPromise=$timeout((()=>{_this.setVisible(!0)}),arguments.length>0&&void 0!==arguments[0]?arguments[0]:100))},this.stopLoading=()=>{showLoaderPromise&&($timeout.cancel(showLoaderPromise),showLoaderPromise=null),this.setVisible(!1)},this.startInitialLoading=()=>{initialLoading=!0,this.setVisible(!0)},this.stopInitialLoading=()=>{initialLoading=!1,this.setVisible(!1)},$rootScope.isInitialLoading=()=>initialLoading,$rootScope.isLoaderVisible=()=>showLoader,$rootScope.isLoadingFailed=()=>loadingFailed,this.failInitialLoading=error=>{this.stopInitialLoading(),loadingFailed=!0,$rootScope.error=error},this.setVisible=visible=>{showLoader=visible},$rootScope.$on("$routeChangeSuccess",(()=>{this.stopInitialLoading()})),$rootScope.$on("$routeChangeError",((event,current,previous,rejection)=>{rejection&&(rejection.silent||rejection.authRedirect)||this.failInitialLoading(rejection)}))}]),angularModule.directive("rgLoaderScreen",(function rgLoaderScreenDirective(){return{restrict:"A",scope:{message:"@rgLoaderScreen"},template:`\n<div class="${loader_screen_default().loaderScreen}" ng-if="$root.isLoaderVisible()">\n  <rg-loader class="${loader_screen_default().loader}"\n    message="{{$root.isInitialLoading() ? message : ''}}"></rg-loader>\n</div>\n    `}}));const loader_screen_ng=angularModule.name;const loader_screen_ng_examples={title:"Legacy Angular/Loader Screen Ng",decorators:[(0,angular_decorator.Z)()],parameters:{storySource:{source:"import angular from 'angular';\n\nimport angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';\n\nimport LoaderScreen from './loader-screen-ng';\n\nexport default {\n  title: 'Legacy Angular/Loader Screen Ng',\n  decorators: [angularDecorator()],\n\n  parameters: {\n    notes: 'Provides an Angular wrapper for Loader Screen.',\n    hermione: {skip: true}\n  }\n};\n\nexport const basic = () => {\n  angular.module(APP_NAME, [LoaderScreen]).run(loaderScreen => {\n    loaderScreen.setVisible(true);\n    loaderScreen.startInitialLoading();\n  });\n\n  return `\n      <div>\n        <div rg-loader-screen=\"Loading...\"></div>\n      </div>\n    `;\n};\n\nbasic.storyName = 'Loader Screen Ng';\n",locationsMap:{basic:{startLoc:{col:21,line:17},endLoc:{col:1,line:28},startBody:{col:21,line:17},endBody:{col:1,line:28}}}},notes:"Provides an Angular wrapper for Loader Screen.",hermione:{skip:!0}}},basic=()=>(angular_default().module(angular_decorator.i,[loader_screen_ng]).run(["loaderScreen",loaderScreen=>{loaderScreen.setVisible(!0),loaderScreen.startInitialLoading()}]),'\n      <div>\n        <div rg-loader-screen="Loading..."></div>\n      </div>\n    ');basic.storyName="Loader Screen Ng"},"./src/global/ring-angular-component.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>RingAngularComponent});class RingAngularComponent{static get controller(){return this}$inject={};constructor(){for(var _this$constructor$$in,_len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++)args[_key]=arguments[_key];(null!==(_this$constructor$$in=this.constructor.$inject)&&void 0!==_this$constructor$$in?_this$constructor$$in:[]).forEach(((injectName,i)=>{this.$inject[injectName]=args[i]}))}}},"./src/loader-ng/loader-ng.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var angular__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/angular/index.js"),angular__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__),_global_ring_angular_component__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/global/ring-angular-component.js"),_loader_loader_core__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/loader/loader__core.ts");const angularModule=angular__WEBPACK_IMPORTED_MODULE_0___default().module("Ring.loader",[]);class RgLoaderComponent extends _global_ring_angular_component__WEBPACK_IMPORTED_MODULE_1__.Z{static bindings={message:"@"};constructor(){super(...arguments);const{$element}=this.$inject;this.loader=new _loader_loader_core__WEBPACK_IMPORTED_MODULE_2__.Z($element[0],{message:this.message})}$onDestroy(){this.loader.destroy()}$onChanges(changes){this.loader.updateMessage(changes.message.currentValue)}}RgLoaderComponent.$inject=["$element"],angularModule.component("rgLoader",RgLoaderComponent);const __WEBPACK_DEFAULT_EXPORT__=angularModule.name},"./src/loader/loader__core.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>LoaderCore});var _global_dom__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/global/dom.ts"),_loader_css__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/loader/loader.css"),_loader_css__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_loader_css__WEBPACK_IMPORTED_MODULE_0__);class Particle{radius;x;y;color;decay;life;constructor(_ref){let{x,y,radius,color}=_ref;this.radius=radius,this.x=x,this.y=y,this.color=color,this.decay=.01,this.life=1}step(){this.life-=this.decay}isAlive(){return this.life>=0}draw(ctx){const alpha=this.life>=0?this.life:0;ctx.fillStyle=`rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`,ctx.beginPath(),ctx.arc(this.x+this.radius,this.y+this.radius,this.radius,0,2*Math.PI),ctx.fill()}}function deterministic(){return.5}class LoaderCore{static defaultProps={size:64,stop:!1,deterministic:!1,colors:[{r:215,g:60,b:234},{r:145,g:53,b:224},{r:88,g:72,b:224},{r:37,g:183,b:255},{r:89,g:189,b:0},{r:251,g:172,b:2},{r:227,g:37,b:129}]};static calculateGradient(startColor,stopColor,position){const calculateChannelValue=(a,b)=>a+Math.round((b-a)*position);return{r:calculateChannelValue(startColor.r,stopColor.r),g:calculateChannelValue(startColor.g,stopColor.g),b:calculateChannelValue(startColor.b,stopColor.b)}}props;canvas;textNode;ctx;height;width;particles;baseSpeed;colorIndex;maxRadius;minRadius;colorChangeTick;x;y;radius;hSpeed;vSpeed;radiusSpeed;tick;isRunning;constructor(containerNode,props){this.props=Object.assign({},LoaderCore.defaultProps,props),this.canvas=document.createElement("canvas"),this.canvas.dataset.test="ring-loader",this.canvas.classList.add(_loader_css__WEBPACK_IMPORTED_MODULE_0___default().canvas),this.textNode=document.createElement("div"),this.textNode.dataset.test="ring-loader-text",this.textNode.classList.add(_loader_css__WEBPACK_IMPORTED_MODULE_0___default().text),this.textNode.textContent=this.props.message?this.props.message:"",containerNode.appendChild(this.canvas),containerNode.appendChild(this.textNode);const pixelRatio=LoaderCore.getPixelRatio(),canvasSize=this.props.size*pixelRatio;this.canvas.width=canvasSize,this.canvas.height=canvasSize,this.canvas.style.width=`${this.props.size}px`,this.canvas.style.height=`${this.props.size}px`,this.ctx=this.canvas.getContext("2d"),this.ctx?.scale(pixelRatio,pixelRatio),this.height=this.props.size,this.width=this.props.size,this.particles=[],this.baseSpeed=1,this.colorIndex=0,this.maxRadius=10,this.minRadius=6,this.colorChangeTick=40,this.x=0,this.y=0,this.radius=8,this.hSpeed=1.5,this.vSpeed=.5,this.radiusSpeed=.05,this.tick=0,this.prepareInitialState(100),this.isRunning=!this.props.stop,this.isRunning?this.startAnimation():this.draw()}static getPixelRatio(){return(0,_global_dom__WEBPACK_IMPORTED_MODULE_1__.mX)()}prepareInitialState(ticks){for(let i=0;i<ticks;i++)this.step()}handleLimits(coord,radius,speed,limit){const randomizedSpeedChange=(this.props.deterministic?deterministic:Math.random)()-this.baseSpeed/2;return coord+2*radius+this.baseSpeed>=limit?-(this.baseSpeed+randomizedSpeedChange):coord<=this.baseSpeed?this.baseSpeed+randomizedSpeedChange:speed}calculateNextCoordinates(){this.x+=this.hSpeed,this.y+=this.vSpeed,this.hSpeed=this.handleLimits(this.x,this.radius,this.hSpeed,this.width),this.vSpeed=this.handleLimits(this.y,this.radius,this.vSpeed,this.height)}calculateNextRadius(){this.radius+=this.radiusSpeed,(this.radius>this.maxRadius||this.radius<this.minRadius)&&(this.radiusSpeed=-this.radiusSpeed)}getNextColor(){const colors=this.props.colors,currentColor=colors[this.colorIndex],nextColor=colors[this.colorIndex+1]||colors[0];return LoaderCore.calculateGradient(currentColor,nextColor,this.tick/this.colorChangeTick)}nextTick(){this.tick++,this.tick>this.colorChangeTick&&(this.tick=0,this.colorIndex++,this.colorIndex>this.props.colors.length-1&&(this.colorIndex=0))}step(){this.nextTick(),this.calculateNextCoordinates(),this.calculateNextRadius(),this.particles.forEach((particle=>particle.step())),this.particles.push(new Particle({x:this.x,y:this.y,radius:this.radius,color:this.getNextColor()}))}removeDeadParticles(){this.particles=this.particles.filter((it=>it.isAlive()))}draw(){const ctx=this.ctx;null!=ctx&&(ctx.clearRect(0,0,this.width,this.height),this.removeDeadParticles(),this.particles.forEach((particle=>particle.draw(ctx))))}loop(){this.step(),this.draw(),this.isRunning&&window.requestAnimationFrame((()=>this.loop()))}updateMessage(text){this.textNode.textContent=text||""}stopAnimation(){this.isRunning=!1,this.canvas.classList.remove(_loader_css__WEBPACK_IMPORTED_MODULE_0___default().animate)}startAnimation(){this.isRunning=!0,this.canvas.classList.add(_loader_css__WEBPACK_IMPORTED_MODULE_0___default().animate),this.loop()}destroy(){this.isRunning=!1}}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/loader-screen/loader-screen.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_2__.default),___CSS_LOADER_EXPORT___.push([module.id,'.loaderScreen_b0c0 {\n  position: absolute;\n\n  width: 100%;\n  height: 100%;\n\n  text-align: center;\n  vertical-align: middle;\n}\n\n.loaderScreen_b0c0::before {\n    display: inline-block;\n\n    height: 100%;\n\n    content: "";\n\n    vertical-align: middle;\n  }\n\n.loader_aabf {\n  display: inline-block;\n}\n\n.loaderWithoutSpacing_f4b9 canvas {\n  margin: 0;\n}\n',"",{version:3,sources:["webpack://./src/loader-screen/loader-screen.css"],names:[],mappings:"AAEA;EACE,kBAAkB;;EAElB,WAAW;EACX,YAAY;;EAEZ,kBAAkB;EAClB,sBAAsB;AAWxB;;AATE;IACE,qBAAqB;;IAErB,YAAY;;IAEZ,WAAW;;IAEX,sBAAsB;EACxB;;AAGF;EACE,qBAAqB;AACvB;;AAEA;EACE,SAAS;AACX",sourcesContent:['@import "../global/variables.css";\n\n.loaderScreen {\n  position: absolute;\n\n  width: 100%;\n  height: 100%;\n\n  text-align: center;\n  vertical-align: middle;\n\n  &::before {\n    display: inline-block;\n\n    height: 100%;\n\n    content: "";\n\n    vertical-align: middle;\n  }\n}\n\n.loader {\n  display: inline-block;\n}\n\n.loaderWithoutSpacing canvas {\n  margin: 0;\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={loaderScreen:"loaderScreen_b0c0",loader:"loader_aabf",loaderWithoutSpacing:"loaderWithoutSpacing_f4b9"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/loader/loader.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/global/global.css"),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/global/variables.css"),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_variables_css__WEBPACK_IMPORTED_MODULE_3__.default),___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default,"",!0),___CSS_LOADER_EXPORT___.push([module.id,"@keyframes rotation-keyframes_d87b {\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n.canvas_b4b4 {\n  display: block;\n\n  margin: 16px auto;\n\n  pointer-events: none;\n}\n\n.animate_f7ea {\n  animation: rotation-keyframes_d87b 36s linear infinite;\n}\n\n.text_fd63 {\n  text-align: center;\n\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}\n","",{version:3,sources:["webpack://./src/loader/loader.css"],names:[],mappings:"AAIA;EACE;IACE,yBAAyB;EAC3B;AACF;;AAEA;EACE,cAAc;;EAEd,iBAA2B;;EAE3B,oBAAoB;AACtB;;AAEA;EACE,sDAAiD;AACnD;;AAEA;EACE,kBAAkB;;EAElB,oCAAoC;EACpC,gCAAgC;EAChC,oCAAoC;AACtC",sourcesContent:['@import "../global/variables.css";\n\n@value unit from "../global/global.css";\n\n@keyframes rotation-keyframes {\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n.canvas {\n  display: block;\n\n  margin: calc(unit * 2) auto;\n\n  pointer-events: none;\n}\n\n.animate {\n  animation: rotation-keyframes 36s linear infinite;\n}\n\n.text {\n  text-align: center;\n\n  font-family: var(--ring-font-family);\n  font-size: var(--ring-font-size);\n  line-height: var(--ring-line-height);\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={unit:`${_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_global_global_css__WEBPACK_IMPORTED_MODULE_2__.default.locals.unit}`,canvas:"canvas_b4b4",animate:"animate_f7ea","rotation-keyframes":"rotation-keyframes_d87b",text:"text_fd63"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/loader-screen/loader-screen.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/loader-screen/loader-screen.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}},"./src/loader/loader.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/loader/loader.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}}}]);