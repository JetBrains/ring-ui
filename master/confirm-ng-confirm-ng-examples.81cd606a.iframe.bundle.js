"use strict";(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[1401],{"./.storybook/angular-decorator.js":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{i:function(){return APP_NAME}});var angular__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/angular/index.js"),angular__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__),_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("@storybook/preview-api");const APP_NAME="ring-ui.story.app",angularDecorator=story=>{const node=document.createElement("div");node.innerHTML=story();const app=angular__WEBPACK_IMPORTED_MODULE_0___default().bootstrap(node,[APP_NAME],{strictDi:!0});return(0,_storybook_preview_api__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>()=>{app.get("$rootScope").$destroy(),node.innerHTML=""})),node};__webpack_exports__.Z=()=>angularDecorator},"./src/confirm-ng/confirm-ng.examples.js":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{basic:function(){return basic},default:function(){return confirm_ng_examples}});var angular=__webpack_require__("./node_modules/angular/index.js"),angular_default=__webpack_require__.n(angular),angular_decorator=__webpack_require__("./.storybook/angular-decorator.js"),confirm_service=__webpack_require__("./src/confirm-service/confirm-service.tsx"),message_bundle_ng=__webpack_require__("./src/message-bundle-ng/message-bundle-ng.js");const angularModule=angular_default().module("Ring.confirm",[message_bundle_ng.Z]);angularModule.service("confirm",["$q","RingMessageBundle",function service($q,RingMessageBundle){return function showConfirm(message,description,actionTitle,cancelTitle,cancelIsDefault,actionFn){return $q.when((0,confirm_service.ZP)({text:message,description:description,confirmLabel:actionTitle||RingMessageBundle.confirmation_ok(),rejectLabel:cancelTitle||RingMessageBundle.confirmation_cancel(),cancelIsDefault:cancelIsDefault,onBeforeConfirm:actionFn}))}}]);var confirm_ng=angularModule.name,confirm_ng_examples={title:"Legacy Angular/Confirm Ng",decorators:[(0,angular_decorator.Z)()],parameters:{storySource:{source:"import angular from 'angular';\n\nimport angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';\n\nimport {hideConfirm} from '../confirm-service/confirm-service';\n\nimport ConfirmNG from './confirm-ng';\n\nexport default {\n  title: 'Legacy Angular/Confirm Ng',\n  decorators: [angularDecorator()],\n\n  parameters: {\n    notes: 'Displays a confirmation prompt.',\n    hermione: {captureSelector: '*[data-test~=ring-dialog]'},\n    a11y: {element: '#storybook-root,*[data-test~=ring-dialog]'}\n  }\n};\n\nexport const basic = ({onConfirm, onCancel}) => {\n  angular.\n    module(APP_NAME, [ConfirmNG]).\n    controller('TestCtrl', function controller($scope, confirm) {\n      confirm(\n        'Do you really wish to proceed?',\n        'A description of an action that is about to take place.'\n      ).\n        then(onConfirm).\n        catch(onCancel);\n\n      $scope.$on('$destroy', hideConfirm);\n    });\n\n  return `\n      <div>\n        <div rg-dialog></div>\n        <div ng-controller=\"TestCtrl\"></div>\n      </div>\n    `;\n};\n\nbasic.storyName = 'Confirm Ng';\nbasic.argTypes = {onConfirm: {}, onCancel: {}};\n",locationsMap:{basic:{startLoc:{col:21,line:20},endLoc:{col:1,line:40},startBody:{col:21,line:20},endBody:{col:1,line:40}}}},notes:"Displays a confirmation prompt.",hermione:{captureSelector:"*[data-test~=ring-dialog]"},a11y:{element:"#storybook-root,*[data-test~=ring-dialog]"}}};const basic=_ref=>{let{onConfirm:onConfirm,onCancel:onCancel}=_ref;return angular_default().module(angular_decorator.i,[confirm_ng]).controller("TestCtrl",["$scope","confirm",function controller($scope,confirm){confirm("Do you really wish to proceed?","A description of an action that is about to take place.").then(onConfirm).catch(onCancel),$scope.$on("$destroy",confirm_service.Vn)}]),'\n      <div>\n        <div rg-dialog></div>\n        <div ng-controller="TestCtrl"></div>\n      </div>\n    '};basic.storyName="Confirm Ng",basic.argTypes={onConfirm:{},onCancel:{}}},"./src/message-bundle-ng/message-bundle-ng.js":function(__unused_webpack_module,__webpack_exports__,__webpack_require__){var angular__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/angular/index.js");const angularModule=__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__)().module("Ring.message-bundle",[]);angularModule.factory("ringI18n",(function emptyI18n(){return str=>str})),angularModule.service("RingMessageBundle",["ringI18n",function RingMessageBundle(ringI18n){const i18n=ringI18n;this.form_required=()=>i18n("Value is required"),this.form_invalid=()=>i18n("Value is invalid"),this.form_url=()=>i18n("Should be a valid URL"),this.form_email=()=>i18n("Should be a valid email"),this.form_number=()=>i18n("Should be a number"),this.form_maxlength=()=>i18n("Is too long"),this.form_minlength=()=>i18n("Is too short"),this.form_pattern=()=>i18n("Doesn't match the pattern"),this.form_equalvalue=()=>i18n("Is not the same"),this.form_unique=()=>i18n("Is not unique"),this.form_max=()=>i18n("Is out of range"),this.form_min=()=>i18n("Is out of range"),this.form_save=()=>i18n("Save"),this.form_saved=()=>i18n("Saved"),this.form_cancel=()=>i18n("Cancel"),this.avatareditor_nosupport=()=>i18n("Sorry, your browser doesn't support File API"),this.avatareditor_noselected=()=>i18n("No image file was selected"),this.avatareditor_delete=()=>i18n("Delete Image"),this.avatareditor_add=()=>i18n("Add Image"),this.errorpage_seriouslywrong=()=>i18n("Oh-oh... Something went seriously wrong."),this.errorpage_offline=()=>i18n("There's nothing we can do: The server seems to be offline."),this.errorpage_disconnected=()=>i18n("Disconnected"),this.errorpage_disconnectedmsg=()=>i18n("No, no one's there."),this.errorpage_401=()=>i18n("Authorization required"),this.errorpage_401msg=()=>i18n("You have requested access to a page that requires authorization, but the request is missing valid authentication credentials. It can also mean that your account has been banned."),this.errorpage_403=()=>i18n("Woah, you can't touch this!"),this.errorpage_403msg=()=>i18n("Unfortunately, you are not allowed to access the page you've requested. It seems you don't have sufficient permissions."),this.errorpage_404=()=>i18n("Nope, can't find it!"),this.errorpage_404msg=()=>i18n("Despite our best efforts, there's nothing here to show you with the URL you requested. Most likely the URL is invalid or you don't have permissions to access the page."),this.errorpage_500=()=>i18n("Oh-oh... Something went seriously wrong"),this.errorpage_500msg=()=>i18n("Despite our best efforts, the server is not working properly."),this.select_options_not_found=()=>i18n("No options found"),this.select_loading=()=>i18n("Loading..."),this.select_label=()=>i18n("Select an option"),this.previous_page=()=>i18n("previous"),this.next_page=()=>i18n("next page"),this.first_page=()=>i18n("First page"),this.last_page=()=>i18n("Last page"),this.items_per_page=()=>i18n("per page"),this.confirmation_ok=()=>i18n("Ok"),this.confirmation_cancel=()=>i18n("Cancel")}]),__webpack_exports__.Z=angularModule.name}}]);