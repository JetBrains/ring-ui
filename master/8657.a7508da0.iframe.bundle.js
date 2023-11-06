/*! For license information please see 8657.a7508da0.iframe.bundle.js.LICENSE.txt */
"use strict";(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[8657],{"./node_modules/react-is/cjs/react-is.production.min.js":(__unused_webpack_module,exports)=>{var b=60103,c=60106,d=60107,e=60108,f=60114,g=60109,h=60110,k=60112,l=60113,m=60120,n=60115,p=60116,q=60121,r=60122,u=60117,v=60129,w=60131;if("function"==typeof Symbol&&Symbol.for){var x=Symbol.for;b=x("react.element"),c=x("react.portal"),d=x("react.fragment"),e=x("react.strict_mode"),f=x("react.profiler"),g=x("react.provider"),h=x("react.context"),k=x("react.forward_ref"),l=x("react.suspense"),m=x("react.suspense_list"),n=x("react.memo"),p=x("react.lazy"),q=x("react.block"),r=x("react.server.block"),u=x("react.fundamental"),v=x("react.debug_trace_mode"),w=x("react.legacy_hidden")}function y(a){if("object"==typeof a&&null!==a){var t=a.$$typeof;switch(t){case b:switch(a=a.type){case d:case f:case e:case l:case m:return a;default:switch(a=a&&a.$$typeof){case h:case k:case p:case n:case g:return a;default:return t}}case c:return t}}}exports.isForwardRef=function(a){return y(a)===k}},"./node_modules/react-is/index.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/react-is/cjs/react-is.production.min.js")},"./node_modules/react-waypoint/es/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{h:()=>Waypoint});var setPrototypeOf=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");var CAN_USE_DOM=!("undefined"==typeof window||!window.document||!window.document.createElement);var memoized=void 0;function canUsePassiveEventListeners(){return void 0===memoized&&(memoized=function testPassiveEventListeners(){if(!CAN_USE_DOM)return!1;if(!window.addEventListener||!window.removeEventListener||!Object.defineProperty)return!1;var supportsPassiveOption=!1;try{var opts=Object.defineProperty({},"passive",{get:function get(){supportsPassiveOption=!0}}),noop=function noop(){};window.addEventListener("testPassiveEventSupport",noop,opts),window.removeEventListener("testPassiveEventSupport",noop,opts)}catch(e){}return supportsPassiveOption}()),memoized}function ensureCanMutateNextEventHandlers(eventHandlers){eventHandlers.handlers===eventHandlers.nextHandlers&&(eventHandlers.nextHandlers=eventHandlers.handlers.slice())}function TargetEventHandlers(target){this.target=target,this.events={}}TargetEventHandlers.prototype.getEventHandlers=function getEventHandlers(eventName,options){var key=String(eventName)+" "+String(function eventOptionsKey(normalizedEventOptions){return normalizedEventOptions?!0===normalizedEventOptions?100:(normalizedEventOptions.capture<<0)+(normalizedEventOptions.passive<<1)+(normalizedEventOptions.once<<2):0}(options));return this.events[key]||(this.events[key]={handlers:[],handleEvent:void 0},this.events[key].nextHandlers=this.events[key].handlers),this.events[key]},TargetEventHandlers.prototype.handleEvent=function handleEvent(eventName,options,event){var eventHandlers=this.getEventHandlers(eventName,options);eventHandlers.handlers=eventHandlers.nextHandlers,eventHandlers.handlers.forEach((function(handler){handler&&handler(event)}))},TargetEventHandlers.prototype.add=function add(eventName,listener,options){var _this=this,eventHandlers=this.getEventHandlers(eventName,options);ensureCanMutateNextEventHandlers(eventHandlers),0===eventHandlers.nextHandlers.length&&(eventHandlers.handleEvent=this.handleEvent.bind(this,eventName,options),this.target.addEventListener(eventName,eventHandlers.handleEvent,options)),eventHandlers.nextHandlers.push(listener);var isSubscribed=!0;return function unsubscribe(){if(isSubscribed){isSubscribed=!1,ensureCanMutateNextEventHandlers(eventHandlers);var index=eventHandlers.nextHandlers.indexOf(listener);eventHandlers.nextHandlers.splice(index,1),0===eventHandlers.nextHandlers.length&&(_this.target&&_this.target.removeEventListener(eventName,eventHandlers.handleEvent,options),eventHandlers.handleEvent=void 0)}}};function addEventListener(target,eventName,listener,options){target.__consolidated_events_handlers__||(target.__consolidated_events_handlers__=new TargetEventHandlers(target));var normalizedEventOptions=function normalizeEventOptions(eventOptions){if(eventOptions)return canUsePassiveEventListeners()?eventOptions:!!eventOptions.capture}(options);return target.__consolidated_events_handlers__.add(eventName,listener,normalizedEventOptions)}var react=__webpack_require__("./node_modules/react/index.js"),react_is=__webpack_require__("./node_modules/react-is/index.js");function computeOffsetPixels(offset,contextHeight){var pixelOffset=function parseOffsetAsPixels(str){return!isNaN(parseFloat(str))&&isFinite(str)?parseFloat(str):"px"===str.slice(-2)?parseFloat(str.slice(0,-2)):void 0}(offset);if("number"==typeof pixelOffset)return pixelOffset;var percentOffset=function parseOffsetAsPercentage(str){if("%"===str.slice(-1))return parseFloat(str.slice(0,-1))/100}(offset);return"number"==typeof percentOffset?percentOffset*contextHeight:void 0}var ABOVE="above",INSIDE="inside",BELOW="below",INVISIBLE="invisible";function isDOMElement(Component){return"string"==typeof Component.type}var timeout;var timeoutQueue=[];function onNextTick(cb){timeoutQueue.push(cb),timeout||(timeout=setTimeout((function(){var item;for(timeout=null;item=timeoutQueue.shift();)item()}),0));var isSubscribed=!0;return function unsubscribe(){if(isSubscribed){isSubscribed=!1;var index=timeoutQueue.indexOf(cb);-1!==index&&(timeoutQueue.splice(index,1),!timeoutQueue.length&&timeout&&(clearTimeout(timeout),timeout=null))}}}var hasWindow="undefined"!=typeof window,defaultProps={debug:!1,scrollableAncestor:void 0,children:void 0,topOffset:"0px",bottomOffset:"0px",horizontal:!1,onEnter:function onEnter(){},onLeave:function onLeave(){},onPositionChange:function onPositionChange(){},fireOnRapidScroll:!0},Waypoint=function(_React$PureComponent){function Waypoint(props){var _this;return(_this=_React$PureComponent.call(this,props)||this).refElement=function(e){_this._ref=e},_this}!function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype),subClass.prototype.constructor=subClass,(0,setPrototypeOf.Z)(subClass,superClass)}(Waypoint,_React$PureComponent);var _proto=Waypoint.prototype;return _proto.componentDidMount=function componentDidMount(){var _this2=this;hasWindow&&(this.cancelOnNextTick=onNextTick((function(){_this2.cancelOnNextTick=null;var _this2$props=_this2.props,children=_this2$props.children;_this2$props.debug;!function ensureRefIsProvidedByChild(children,ref){if(children&&!isDOMElement(children)&&!ref)throw new Error("<Waypoint> needs a DOM element to compute boundaries. The child you passed is neither a DOM element (e.g. <div>) nor does it use the innerRef prop.\n\nSee https://goo.gl/LrBNgw for more info.")}(children,_this2._ref),_this2._handleScroll=_this2._handleScroll.bind(_this2),_this2.scrollableAncestor=_this2._findScrollableAncestor(),_this2.scrollEventListenerUnsubscribe=addEventListener(_this2.scrollableAncestor,"scroll",_this2._handleScroll,{passive:!0}),_this2.resizeEventListenerUnsubscribe=addEventListener(window,"resize",_this2._handleScroll,{passive:!0}),_this2._handleScroll(null)})))},_proto.componentDidUpdate=function componentDidUpdate(){var _this3=this;hasWindow&&this.scrollableAncestor&&(this.cancelOnNextTick||(this.cancelOnNextTick=onNextTick((function(){_this3.cancelOnNextTick=null,_this3._handleScroll(null)}))))},_proto.componentWillUnmount=function componentWillUnmount(){hasWindow&&(this.scrollEventListenerUnsubscribe&&this.scrollEventListenerUnsubscribe(),this.resizeEventListenerUnsubscribe&&this.resizeEventListenerUnsubscribe(),this.cancelOnNextTick&&this.cancelOnNextTick())},_proto._findScrollableAncestor=function _findScrollableAncestor(){var _this$props=this.props,horizontal=_this$props.horizontal,scrollableAncestor=_this$props.scrollableAncestor;if(scrollableAncestor)return function resolveScrollableAncestorProp(scrollableAncestor){return"window"===scrollableAncestor?__webpack_require__.g.window:scrollableAncestor}(scrollableAncestor);for(var node=this._ref;node.parentNode;){if((node=node.parentNode)===document.body)return window;var style=window.getComputedStyle(node),overflow=(horizontal?style.getPropertyValue("overflow-x"):style.getPropertyValue("overflow-y"))||style.getPropertyValue("overflow");if("auto"===overflow||"scroll"===overflow||"overlay"===overflow)return node}return window},_proto._handleScroll=function _handleScroll(event){if(this._ref){var bounds=this._getBounds(),currentPosition=function getCurrentPosition(bounds){return bounds.viewportBottom-bounds.viewportTop==0?INVISIBLE:bounds.viewportTop<=bounds.waypointTop&&bounds.waypointTop<=bounds.viewportBottom||bounds.viewportTop<=bounds.waypointBottom&&bounds.waypointBottom<=bounds.viewportBottom||bounds.waypointTop<=bounds.viewportTop&&bounds.viewportBottom<=bounds.waypointBottom?INSIDE:bounds.viewportBottom<bounds.waypointTop?BELOW:bounds.waypointTop<bounds.viewportTop?ABOVE:INVISIBLE}(bounds),previousPosition=this._previousPosition,_this$props2=this.props,onPositionChange=(_this$props2.debug,_this$props2.onPositionChange),onEnter=_this$props2.onEnter,onLeave=_this$props2.onLeave,fireOnRapidScroll=_this$props2.fireOnRapidScroll;if(this._previousPosition=currentPosition,previousPosition!==currentPosition){var callbackArg={currentPosition,previousPosition,event,waypointTop:bounds.waypointTop,waypointBottom:bounds.waypointBottom,viewportTop:bounds.viewportTop,viewportBottom:bounds.viewportBottom};onPositionChange.call(this,callbackArg),currentPosition===INSIDE?onEnter.call(this,callbackArg):previousPosition===INSIDE&&onLeave.call(this,callbackArg),fireOnRapidScroll&&(previousPosition===BELOW&&currentPosition===ABOVE||previousPosition===ABOVE&&currentPosition===BELOW)&&(onEnter.call(this,{currentPosition:INSIDE,previousPosition,event,waypointTop:bounds.waypointTop,waypointBottom:bounds.waypointBottom,viewportTop:bounds.viewportTop,viewportBottom:bounds.viewportBottom}),onLeave.call(this,{currentPosition,previousPosition:INSIDE,event,waypointTop:bounds.waypointTop,waypointBottom:bounds.waypointBottom,viewportTop:bounds.viewportTop,viewportBottom:bounds.viewportBottom}))}}},_proto._getBounds=function _getBounds(){var contextHeight,contextScrollTop,_this$props3=this.props,horizontal=_this$props3.horizontal,_this$_ref$getBoundin=(_this$props3.debug,this._ref.getBoundingClientRect()),left=_this$_ref$getBoundin.left,top=_this$_ref$getBoundin.top,right=_this$_ref$getBoundin.right,bottom=_this$_ref$getBoundin.bottom,waypointTop=horizontal?left:top,waypointBottom=horizontal?right:bottom;this.scrollableAncestor===window?(contextHeight=horizontal?window.innerWidth:window.innerHeight,contextScrollTop=0):(contextHeight=horizontal?this.scrollableAncestor.offsetWidth:this.scrollableAncestor.offsetHeight,contextScrollTop=horizontal?this.scrollableAncestor.getBoundingClientRect().left:this.scrollableAncestor.getBoundingClientRect().top);var _this$props4=this.props,bottomOffset=_this$props4.bottomOffset;return{waypointTop,waypointBottom,viewportTop:contextScrollTop+computeOffsetPixels(_this$props4.topOffset,contextHeight),viewportBottom:contextScrollTop+contextHeight-computeOffsetPixels(bottomOffset,contextHeight)}},_proto.render=function render(){var _this4=this,children=this.props.children;if(!children)return react.createElement("span",{ref:this.refElement,style:{fontSize:0}});if(isDOMElement(children)||(0,react_is.isForwardRef)(children)){return react.cloneElement(children,{ref:function ref(node){_this4.refElement(node),children.ref&&("function"==typeof children.ref?children.ref(node):children.ref.current=node)}})}return react.cloneElement(children,{innerRef:this.refElement})},Waypoint}(react.PureComponent);Waypoint.above=ABOVE,Waypoint.below=BELOW,Waypoint.inside=INSIDE,Waypoint.invisible=INVISIBLE,Waypoint.defaultProps=defaultProps,Waypoint.displayName="Waypoint"}}]);