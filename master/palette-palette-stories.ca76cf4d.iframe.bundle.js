(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[1383],{"./.storybook/angular-decorator.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__,i:()=>APP_NAME});var angular__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/angular/index.js"),angular__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("@storybook/preview-api");const APP_NAME="ring-ui.story.app",angularDecorator=story=>{const node=document.createElement("div");node.innerHTML=story();const app=angular__WEBPACK_IMPORTED_MODULE_0___default().bootstrap(node,[APP_NAME],{strictDi:!0});return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>()=>{app.get("$rootScope").$destroy(),node.innerHTML=""})),node},__WEBPACK_DEFAULT_EXPORT__=()=>angularDecorator},"./src/palette/palette.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:()=>basic,default:()=>__WEBPACK_DEFAULT_EXPORT__});var angular__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/angular/index.js"),angular__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__),_storybook_angular_decorator__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./.storybook/angular-decorator.js");__webpack_require__("./src/palette/palette.css");const __WEBPACK_DEFAULT_EXPORT__={title:"Style-only/Color fields palette",decorators:[(0,_storybook_angular_decorator__WEBPACK_IMPORTED_MODULE_2__.Z)()],parameters:{storySource:{source:'import angular from \'angular\';\n\nimport angularDecorator, {APP_NAME} from \'../../.storybook/angular-decorator\';\n\nimport \'./palette.css\';\n\nexport default {\n  title: \'Style-only/Color fields palette\',\n  decorators: [angularDecorator()],\n\n  parameters: {\n    notes: \'Defines the color palette used for tags and custom fields.\',\n    hermione: {skip: true},\n    a11y: {options: {rules: {\'color-contrast\': {enabled: false}}}}\n  }\n};\n\nexport const basic = () => {\n  angular.module(APP_NAME, []).controller(\'TestCtrl\', function controller() {\n    const xrange = num => [...Array(num)].map((val, index) => index);\n\n    this.arr5 = xrange(5);\n    this.arr7 = xrange(7);\n  });\n\n  return `\n      <div ng-controller="TestCtrl as testCtrl">\n        <h4>ColorId</h4>\n        <div ng-repeat="i in testCtrl.arr5" class="example">\n          <div ng-repeat="j in testCtrl.arr7"\n            ng-init="colorId = i * 7 + j + 1"\n            ng-attr-class="ring-palette_color-{{colorId}}">\n            Color {{colorId}}\n          </div>\n        </div>\n        <h4>ToneId and BrightnessId</h4>\n        <div class="example" ng-repeat="toneId in testCtrl.arr7">\n          <div><b>Tone {{toneId}}:</b></div>\n          <div ng-repeat="brightnessId in testCtrl.arr5"\n            ng-attr-class="ring-palette_tone-{{toneId}}-{{brightnessId}}">\n            Brightness {{brightnessId}}\n          </div>\n        </div>\n      </div>\n    `;\n};\n\nbasic.storyName = \'Color fields palette\';\n\nbasic.parameters = {\n  storyStyles: `\n<style>\n  .example {\n    margin: 4px;\n  }\n\n  .example div {\n    width: 90px;\n    display: inline-block;\n  }\n</style>\n      `\n};\n',locationsMap:{basic:{startLoc:{col:21,line:18},endLoc:{col:1,line:46},startBody:{col:21,line:18},endBody:{col:1,line:46}}}},notes:"Defines the color palette used for tags and custom fields.",hermione:{skip:!0},a11y:{options:{rules:{"color-contrast":{enabled:!1}}}}}},basic=()=>(angular__WEBPACK_IMPORTED_MODULE_0___default().module(_storybook_angular_decorator__WEBPACK_IMPORTED_MODULE_2__.i,[]).controller("TestCtrl",(function controller(){const xrange=num=>[...Array(num)].map(((val,index)=>index));this.arr5=xrange(5),this.arr7=xrange(7)})),'\n      <div ng-controller="TestCtrl as testCtrl">\n        <h4>ColorId</h4>\n        <div ng-repeat="i in testCtrl.arr5" class="example">\n          <div ng-repeat="j in testCtrl.arr7"\n            ng-init="colorId = i * 7 + j + 1"\n            ng-attr-class="ring-palette_color-{{colorId}}">\n            Color {{colorId}}\n          </div>\n        </div>\n        <h4>ToneId and BrightnessId</h4>\n        <div class="example" ng-repeat="toneId in testCtrl.arr7">\n          <div><b>Tone {{toneId}}:</b></div>\n          <div ng-repeat="brightnessId in testCtrl.arr5"\n            ng-attr-class="ring-palette_tone-{{toneId}}-{{brightnessId}}">\n            Brightness {{brightnessId}}\n          </div>\n        </div>\n      </div>\n    ');basic.storyName="Color fields palette",basic.parameters={storyStyles:"\n<style>\n  .example {\n    margin: 4px;\n  }\n\n  .example div {\n    width: 90px;\n    display: inline-block;\n  }\n</style>\n      "}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/palette/palette.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,"/* stylelint-disable color-no-hex */\n\n.ring-palette_color-0 {\n  color: #444;\n  background-color: transparent;\n}\n\n.ring-palette_color-1,\n.ring-palette_tone-0-0 {\n  color: #888;\n  background-color: #e6e6e6;\n}\n\n.ring-palette_color-2,\n.ring-palette_tone-1-0 {\n  color: #4da400;\n  background-color: #e6f6cf;\n}\n\n.ring-palette_color-3,\n.ring-palette_tone-2-0 {\n  color: #45818e;\n  background-color: #d8f7f3;\n}\n\n.ring-palette_color-4,\n.ring-palette_tone-3-0 {\n  color: #3d85c6;\n  background-color: #e0f1fb;\n}\n\n.ring-palette_color-5,\n.ring-palette_tone-4-0 {\n  color: #dc5766;\n  background-color: #fce5f1;\n}\n\n.ring-palette_color-6,\n.ring-palette_tone-5-0 {\n  color: #b45f06;\n  background-color: #ffee9c;\n}\n\n.ring-palette_color-7,\n.ring-palette_tone-6-0 {\n  color: #b45f06;\n  background-color: #f7e9c1;\n}\n\n.ring-palette_color-8,\n.ring-palette_tone-0-1 {\n  color: #444;\n  background-color: #bababa;\n}\n\n.ring-palette_color-9,\n.ring-palette_tone-1-1 {\n  color: #444;\n  background-color: #b7e281;\n}\n\n.ring-palette_color-10,\n.ring-palette_tone-2-1 {\n  color: #444;\n  background-color: #92e1d5;\n}\n\n.ring-palette_color-11,\n.ring-palette_tone-3-1 {\n  color: #444;\n  background-color: #a6e0fc;\n}\n\n.ring-palette_color-12,\n.ring-palette_tone-4-1 {\n  color: #444;\n  background-color: #ffc8ea;\n}\n\n.ring-palette_color-13,\n.ring-palette_tone-5-1 {\n  color: #444;\n  background-color: #fed74a;\n}\n\n.ring-palette_color-14,\n.ring-palette_tone-6-1 {\n  color: #444;\n  background-color: #e0c378;\n}\n\n.ring-palette_color-15,\n.ring-palette_tone-0-2 {\n  color: #fff;\n  background-color: #878787;\n}\n\n.ring-palette_color-16,\n.ring-palette_tone-1-2 {\n  color: #fff;\n  background-color: #7dbd36;\n}\n\n.ring-palette_color-17,\n.ring-palette_tone-2-2 {\n  color: #fff;\n  background-color: #25beb2;\n}\n\n.ring-palette_color-18,\n.ring-palette_tone-3-2 {\n  color: #fff;\n  background-color: #42a3df;\n}\n\n.ring-palette_color-19,\n.ring-palette_tone-4-2 {\n  color: #fff;\n  background-color: #ff7bc3;\n}\n\n.ring-palette_color-20,\n.ring-palette_tone-5-2 {\n  color: #fff;\n  background-color: #ff7123;\n}\n\n.ring-palette_color-21,\n.ring-palette_tone-6-2 {\n  color: #fff;\n  background-color: #ce6700;\n}\n\n.ring-palette_color-22,\n.ring-palette_tone-0-3 {\n  color: #fff;\n  background-color: #4d4d4d;\n}\n\n.ring-palette_color-23,\n.ring-palette_tone-1-3 {\n  color: #fff;\n  background-color: #409600;\n}\n\n.ring-palette_color-24,\n.ring-palette_tone-2-3 {\n  color: #fff;\n  background-color: #2f9890;\n}\n\n.ring-palette_color-25,\n.ring-palette_tone-3-3 {\n  color: #fff;\n  background-color: #0070e4;\n}\n\n.ring-palette_color-26,\n.ring-palette_tone-4-3 {\n  color: #fff;\n  background-color: #dc0083;\n}\n\n.ring-palette_color-27,\n.ring-palette_tone-5-3 {\n  color: #fff;\n  background-color: #e30000;\n}\n\n.ring-palette_color-28,\n.ring-palette_tone-6-3 {\n  color: #fff;\n  background-color: #8d5100;\n}\n\n.ring-palette_color-29,\n.ring-palette_tone-0-4 {\n  color: #fff;\n  background-color: #1a1a1a;\n}\n\n.ring-palette_color-30,\n.ring-palette_tone-1-4 {\n  color: #fff;\n  background-color: #246512;\n}\n\n.ring-palette_color-31,\n.ring-palette_tone-2-4 {\n  color: #fff;\n  background-color: #00665e;\n}\n\n.ring-palette_color-32,\n.ring-palette_tone-3-4 {\n  color: #fff;\n  background-color: #0050a1;\n}\n\n.ring-palette_color-33,\n.ring-palette_tone-4-4 {\n  color: #fff;\n  background-color: #900052;\n}\n\n.ring-palette_color-34,\n.ring-palette_tone-5-4 {\n  color: #fff;\n  background-color: #8e1600;\n}\n\n.ring-palette_color-35,\n.ring-palette_tone-6-4 {\n  color: #fff;\n  background-color: #553000;\n}\n","",{version:3,sources:["webpack://./src/palette/palette.css"],names:[],mappings:"AAAA,mCAAmC;;AAEnC;EACE,WAAW;EACX,6BAA6B;AAC/B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,cAAc;EACd,yBAAyB;AAC3B;;AAEA;;EAEE,cAAc;EACd,yBAAyB;AAC3B;;AAEA;;EAEE,cAAc;EACd,yBAAyB;AAC3B;;AAEA;;EAEE,cAAc;EACd,yBAAyB;AAC3B;;AAEA;;EAEE,cAAc;EACd,yBAAyB;AAC3B;;AAEA;;EAEE,cAAc;EACd,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B;;AAEA;;EAEE,WAAW;EACX,yBAAyB;AAC3B",sourcesContent:["/* stylelint-disable color-no-hex */\n\n:global(.ring-palette_color-0) {\n  color: #444;\n  background-color: transparent;\n}\n\n:global(.ring-palette_color-1),\n:global(.ring-palette_tone-0-0) {\n  color: #888;\n  background-color: #e6e6e6;\n}\n\n:global(.ring-palette_color-2),\n:global(.ring-palette_tone-1-0) {\n  color: #4da400;\n  background-color: #e6f6cf;\n}\n\n:global(.ring-palette_color-3),\n:global(.ring-palette_tone-2-0) {\n  color: #45818e;\n  background-color: #d8f7f3;\n}\n\n:global(.ring-palette_color-4),\n:global(.ring-palette_tone-3-0) {\n  color: #3d85c6;\n  background-color: #e0f1fb;\n}\n\n:global(.ring-palette_color-5),\n:global(.ring-palette_tone-4-0) {\n  color: #dc5766;\n  background-color: #fce5f1;\n}\n\n:global(.ring-palette_color-6),\n:global(.ring-palette_tone-5-0) {\n  color: #b45f06;\n  background-color: #ffee9c;\n}\n\n:global(.ring-palette_color-7),\n:global(.ring-palette_tone-6-0) {\n  color: #b45f06;\n  background-color: #f7e9c1;\n}\n\n:global(.ring-palette_color-8),\n:global(.ring-palette_tone-0-1) {\n  color: #444;\n  background-color: #bababa;\n}\n\n:global(.ring-palette_color-9),\n:global(.ring-palette_tone-1-1) {\n  color: #444;\n  background-color: #b7e281;\n}\n\n:global(.ring-palette_color-10),\n:global(.ring-palette_tone-2-1) {\n  color: #444;\n  background-color: #92e1d5;\n}\n\n:global(.ring-palette_color-11),\n:global(.ring-palette_tone-3-1) {\n  color: #444;\n  background-color: #a6e0fc;\n}\n\n:global(.ring-palette_color-12),\n:global(.ring-palette_tone-4-1) {\n  color: #444;\n  background-color: #ffc8ea;\n}\n\n:global(.ring-palette_color-13),\n:global(.ring-palette_tone-5-1) {\n  color: #444;\n  background-color: #fed74a;\n}\n\n:global(.ring-palette_color-14),\n:global(.ring-palette_tone-6-1) {\n  color: #444;\n  background-color: #e0c378;\n}\n\n:global(.ring-palette_color-15),\n:global(.ring-palette_tone-0-2) {\n  color: #fff;\n  background-color: #878787;\n}\n\n:global(.ring-palette_color-16),\n:global(.ring-palette_tone-1-2) {\n  color: #fff;\n  background-color: #7dbd36;\n}\n\n:global(.ring-palette_color-17),\n:global(.ring-palette_tone-2-2) {\n  color: #fff;\n  background-color: #25beb2;\n}\n\n:global(.ring-palette_color-18),\n:global(.ring-palette_tone-3-2) {\n  color: #fff;\n  background-color: #42a3df;\n}\n\n:global(.ring-palette_color-19),\n:global(.ring-palette_tone-4-2) {\n  color: #fff;\n  background-color: #ff7bc3;\n}\n\n:global(.ring-palette_color-20),\n:global(.ring-palette_tone-5-2) {\n  color: #fff;\n  background-color: #ff7123;\n}\n\n:global(.ring-palette_color-21),\n:global(.ring-palette_tone-6-2) {\n  color: #fff;\n  background-color: #ce6700;\n}\n\n:global(.ring-palette_color-22),\n:global(.ring-palette_tone-0-3) {\n  color: #fff;\n  background-color: #4d4d4d;\n}\n\n:global(.ring-palette_color-23),\n:global(.ring-palette_tone-1-3) {\n  color: #fff;\n  background-color: #409600;\n}\n\n:global(.ring-palette_color-24),\n:global(.ring-palette_tone-2-3) {\n  color: #fff;\n  background-color: #2f9890;\n}\n\n:global(.ring-palette_color-25),\n:global(.ring-palette_tone-3-3) {\n  color: #fff;\n  background-color: #0070e4;\n}\n\n:global(.ring-palette_color-26),\n:global(.ring-palette_tone-4-3) {\n  color: #fff;\n  background-color: #dc0083;\n}\n\n:global(.ring-palette_color-27),\n:global(.ring-palette_tone-5-3) {\n  color: #fff;\n  background-color: #e30000;\n}\n\n:global(.ring-palette_color-28),\n:global(.ring-palette_tone-6-3) {\n  color: #fff;\n  background-color: #8d5100;\n}\n\n:global(.ring-palette_color-29),\n:global(.ring-palette_tone-0-4) {\n  color: #fff;\n  background-color: #1a1a1a;\n}\n\n:global(.ring-palette_color-30),\n:global(.ring-palette_tone-1-4) {\n  color: #fff;\n  background-color: #246512;\n}\n\n:global(.ring-palette_color-31),\n:global(.ring-palette_tone-2-4) {\n  color: #fff;\n  background-color: #00665e;\n}\n\n:global(.ring-palette_color-32),\n:global(.ring-palette_tone-3-4) {\n  color: #fff;\n  background-color: #0050a1;\n}\n\n:global(.ring-palette_color-33),\n:global(.ring-palette_tone-4-4) {\n  color: #fff;\n  background-color: #900052;\n}\n\n:global(.ring-palette_color-34),\n:global(.ring-palette_tone-5-4) {\n  color: #fff;\n  background-color: #8e1600;\n}\n\n:global(.ring-palette_color-35),\n:global(.ring-palette_tone-6-4) {\n  color: #fff;\n  background-color: #553000;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./src/palette/palette.css":(module,__unused_webpack_exports,__webpack_require__)=>{var API=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),domAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),insertFn=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),setAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),styleTagTransformFn=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[0].use[2]!./src/palette/palette.css");content=content.__esModule?content.default:content;var options={};options.styleTagTransform=styleTagTransformFn,options.setAttributes=setAttributes,options.insert=insertFn.bind(null,"head"),options.domAPI=domAPI,options.insertStyleElement=insertStyleElement;API(content,options);module.exports=content&&content.locals||{}}}]);