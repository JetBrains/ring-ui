"use strict";(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[2558],{"./node_modules/batch-processor/src/batch-processor.js":(module,__unused_webpack_exports,__webpack_require__)=>{var utils=__webpack_require__("./node_modules/batch-processor/src/utils.js");function Batch(){var batch={},size=0,topLevel=0,bottomLevel=0;return{add:function add(level,fn){fn||(fn=level,level=0),level>topLevel?topLevel=level:level<bottomLevel&&(bottomLevel=level),batch[level]||(batch[level]=[]),batch[level].push(fn),size++},process:function process(){for(var level=bottomLevel;level<=topLevel;level++)for(var fns=batch[level],i=0;i<fns.length;i++){(0,fns[i])()}},size:function getSize(){return size}}}module.exports=function batchProcessorMaker(options){var reporter=(options=options||{}).reporter,asyncProcess=utils.getOption(options,"async",!0),autoProcess=utils.getOption(options,"auto",!0);autoProcess&&!asyncProcess&&(reporter&&reporter.warn("Invalid options combination. auto=true and async=false is invalid. Setting async=true."),asyncProcess=!0);var asyncFrameHandler,batch=Batch(),isProcessing=!1;function processBatch(){for(isProcessing=!0;batch.size();){var processingBatch=batch;batch=Batch(),processingBatch.process()}isProcessing=!1}function processBatchAsync(){asyncFrameHandler=function requestFrame(callback){return fn=callback,setTimeout(fn,0);var fn}(processBatch)}return{add:function addFunction(level,fn){!isProcessing&&autoProcess&&asyncProcess&&0===batch.size()&&processBatchAsync(),batch.add(level,fn)},force:function forceProcessBatch(localAsyncProcess){isProcessing||(void 0===localAsyncProcess&&(localAsyncProcess=asyncProcess),asyncFrameHandler&&(!function cancelFrame(listener){return clearTimeout(listener)}(asyncFrameHandler),asyncFrameHandler=null),localAsyncProcess?processBatchAsync():processBatch())}}}},"./node_modules/batch-processor/src/utils.js":module=>{(module.exports={}).getOption=function getOption(options,name,defaultValue){var value=options[name];if(null==value&&void 0!==defaultValue)return defaultValue;return value}},"./node_modules/element-resize-detector/src/browser-detector.js":module=>{var detector=module.exports={};detector.isIE=function(version){return!!function isAnyIeVersion(){var agent=navigator.userAgent.toLowerCase();return-1!==agent.indexOf("msie")||-1!==agent.indexOf("trident")||-1!==agent.indexOf(" edge/")}()&&(!version||version===function(){var v=3,div=document.createElement("div"),all=div.getElementsByTagName("i");do{div.innerHTML="\x3c!--[if gt IE "+ ++v+"]><i></i><![endif]--\x3e"}while(all[0]);return v>4?v:undefined}())},detector.isLegacyOpera=function(){return!!window.opera}},"./node_modules/element-resize-detector/src/collection-utils.js":module=>{(module.exports={}).forEach=function(collection,callback){for(var i=0;i<collection.length;i++){var result=callback(collection[i]);if(result)return result}}},"./node_modules/element-resize-detector/src/detection-strategy/object.js":(module,__unused_webpack_exports,__webpack_require__)=>{var browserDetector=__webpack_require__("./node_modules/element-resize-detector/src/browser-detector.js");module.exports=function(options){var reporter=(options=options||{}).reporter,batchProcessor=options.batchProcessor,getState=options.stateHandler.getState;if(!reporter)throw new Error("Missing required dependency: reporter.");function buildCssTextString(rules){var seperator=options.important?" !important; ":"; ";return(rules.join(seperator)+seperator).trim()}function getObject(element){return getState(element).object}return{makeDetectable:function makeDetectable(options,element,callback){callback||(callback=element,element=options,options=null),(options=options||{}).debug,browserDetector.isIE(8)?callback(element):function injectObject(element,callback){var OBJECT_STYLE=buildCssTextString(["display: block","position: absolute","top: 0","left: 0","width: 100%","height: 100%","border: none","padding: 0","margin: 0","opacity: 0","z-index: -1000","pointer-events: none"]),positionCheckPerformed=!1,style=window.getComputedStyle(element),width=element.offsetWidth,height=element.offsetHeight;function mutateDom(){function alterPositionStyles(){if("static"===style.position){element.style.setProperty("position","relative",options.important?"important":"");var removeRelativeStyles=function(reporter,element,style,property){var value=style[property];"auto"!==value&&"0"!==function getNumericalValue(value){return value.replace(/[^-\d\.]/g,"")}(value)&&(reporter.warn("An element that is positioned static has style."+property+"="+value+" which is ignored due to the static positioning. The element will need to be positioned relative, so the style."+property+" will be set to 0. Element: ",element),element.style.setProperty(property,"0",options.important?"important":""))};removeRelativeStyles(reporter,element,style,"top"),removeRelativeStyles(reporter,element,style,"right"),removeRelativeStyles(reporter,element,style,"bottom"),removeRelativeStyles(reporter,element,style,"left")}}""!==style.position&&(alterPositionStyles(),positionCheckPerformed=!0);var object=document.createElement("object");object.style.cssText=OBJECT_STYLE,object.tabIndex=-1,object.type="text/html",object.setAttribute("aria-hidden","true"),object.onload=function onObjectLoad(){positionCheckPerformed||alterPositionStyles(),function getDocument(element,callback){if(!element.contentDocument){var state=getState(element);return state.checkForObjectDocumentTimeoutId&&window.clearTimeout(state.checkForObjectDocumentTimeoutId),void(state.checkForObjectDocumentTimeoutId=setTimeout((function checkForObjectDocument(){state.checkForObjectDocumentTimeoutId=0,getDocument(element,callback)}),100))}callback(element.contentDocument)}(this,(function onObjectDocumentReady(objectDocument){callback(element)}))},browserDetector.isIE()||(object.data="about:blank"),getState(element)&&(element.appendChild(object),getState(element).object=object,browserDetector.isIE()&&(object.data="about:blank"))}getState(element).startSize={width,height},batchProcessor?batchProcessor.add(mutateDom):mutateDom()}(element,callback)},addListener:function addListener(element,listener){function listenerProxy(){listener(element)}if(browserDetector.isIE(8))getState(element).object={proxy:listenerProxy},element.attachEvent("onresize",listenerProxy);else{var object=getObject(element);if(!object)throw new Error("Element is not detectable by this strategy.");object.contentDocument.defaultView.addEventListener("resize",listenerProxy)}},uninstall:function uninstall(element){if(getState(element)){var object=getObject(element);object&&(browserDetector.isIE(8)?element.detachEvent("onresize",object.proxy):element.removeChild(object),getState(element).checkForObjectDocumentTimeoutId&&window.clearTimeout(getState(element).checkForObjectDocumentTimeoutId),delete getState(element).object)}}}}},"./node_modules/element-resize-detector/src/detection-strategy/scroll.js":(module,__unused_webpack_exports,__webpack_require__)=>{var forEach=__webpack_require__("./node_modules/element-resize-detector/src/collection-utils.js").forEach;module.exports=function(options){var reporter=(options=options||{}).reporter,batchProcessor=options.batchProcessor,getState=options.stateHandler.getState,idHandler=(options.stateHandler.hasState,options.idHandler);if(!batchProcessor)throw new Error("Missing required dependency: batchProcessor");if(!reporter)throw new Error("Missing required dependency: reporter.");var scrollbarSizes=function getScrollbarSizes(){var child=document.createElement("div");child.style.cssText=buildCssTextString(["position: absolute","width: 1000px","height: 1000px","visibility: hidden","margin: 0","padding: 0"]);var container=document.createElement("div");container.style.cssText=buildCssTextString(["position: absolute","width: 500px","height: 500px","overflow: scroll","visibility: none","top: -1500px","left: -1500px","visibility: hidden","margin: 0","padding: 0"]),container.appendChild(child),document.body.insertBefore(container,document.body.firstChild);var widthSize=500-container.clientWidth,heightSize=500-container.clientHeight;return document.body.removeChild(container),{width:widthSize,height:heightSize}}();function initDocument(targetDocument){!function injectScrollStyle(targetDocument,styleId,containerClass){function injectStyle(style,method){method=method||function(element){targetDocument.head.appendChild(element)};var styleElement=targetDocument.createElement("style");return styleElement.innerHTML=style,styleElement.id=styleId,method(styleElement),styleElement}if(!targetDocument.getElementById(styleId)){var containerAnimationClass=containerClass+"_animation",containerAnimationActiveClass=containerClass+"_animation_active",style="/* Created by the element-resize-detector library. */\n";style+="."+containerClass+" > div::-webkit-scrollbar { "+buildCssTextString(["display: none"])+" }\n\n",style+="."+containerAnimationActiveClass+" { "+buildCssTextString(["-webkit-animation-duration: 0.1s","animation-duration: 0.1s","-webkit-animation-name: "+containerAnimationClass,"animation-name: "+containerAnimationClass])+" }\n",style+="@-webkit-keyframes "+containerAnimationClass+" { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }\n",injectStyle(style+="@keyframes "+containerAnimationClass+" { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }")}}(targetDocument,"erd_scroll_detection_scrollbar_style","erd_scroll_detection_container")}function buildCssTextString(rules){var seperator=options.important?" !important; ":"; ";return(rules.join(seperator)+seperator).trim()}function addEvent(el,name,cb){if(el.addEventListener)el.addEventListener(name,cb);else{if(!el.attachEvent)return reporter.error("[scroll] Don't know how to add event listeners.");el.attachEvent("on"+name,cb)}}function removeEvent(el,name,cb){if(el.removeEventListener)el.removeEventListener(name,cb);else{if(!el.detachEvent)return reporter.error("[scroll] Don't know how to remove event listeners.");el.detachEvent("on"+name,cb)}}function getExpandElement(element){return getState(element).container.childNodes[0].childNodes[0].childNodes[0]}function getShrinkElement(element){return getState(element).container.childNodes[0].childNodes[0].childNodes[1]}return initDocument(window.document),{makeDetectable:function makeDetectable(options,element,callback){function debug(){if(options.debug){var args=Array.prototype.slice.call(arguments);if(args.unshift(idHandler.get(element),"Scroll: "),reporter.log.apply)reporter.log.apply(null,args);else for(var i=0;i<args.length;i++)reporter.log(args[i])}}function isUnrendered(element){var container=getState(element).container.childNodes[0],style=window.getComputedStyle(container);return!style.width||-1===style.width.indexOf("px")}function getStyle(){var elementStyle=window.getComputedStyle(element),style={};return style.position=elementStyle.position,style.width=element.offsetWidth,style.height=element.offsetHeight,style.top=elementStyle.top,style.right=elementStyle.right,style.bottom=elementStyle.bottom,style.left=elementStyle.left,style.widthCSS=elementStyle.width,style.heightCSS=elementStyle.height,style}function storeStyle(){if(debug("storeStyle invoked."),getState(element)){var style=getStyle();getState(element).style=style}else debug("Aborting because element has been uninstalled")}function storeCurrentSize(element,width,height){getState(element).lastWidth=width,getState(element).lastHeight=height}function getWidthOffset(){return 2*scrollbarSizes.width+1}function getHeightOffset(){return 2*scrollbarSizes.height+1}function getExpandWidth(width){return width+10+getWidthOffset()}function getExpandHeight(height){return height+10+getHeightOffset()}function positionScrollbars(element,width,height){var expand=getExpandElement(element),shrink=getShrinkElement(element),expandWidth=getExpandWidth(width),expandHeight=getExpandHeight(height),shrinkWidth=function getShrinkWidth(width){return 2*width+getWidthOffset()}(width),shrinkHeight=function getShrinkHeight(height){return 2*height+getHeightOffset()}(height);expand.scrollLeft=expandWidth,expand.scrollTop=expandHeight,shrink.scrollLeft=shrinkWidth,shrink.scrollTop=shrinkHeight}function injectContainerElement(){var container=getState(element).container;if(!container){(container=document.createElement("div")).className="erd_scroll_detection_container",container.style.cssText=buildCssTextString(["visibility: hidden","display: inline","width: 0px","height: 0px","z-index: -1","overflow: hidden","margin: 0","padding: 0"]),getState(element).container=container,function addAnimationClass(element){element.className+=" erd_scroll_detection_container_animation_active"}(container),element.appendChild(container);var onAnimationStart=function(){getState(element).onRendered&&getState(element).onRendered()};addEvent(container,"animationstart",onAnimationStart),getState(element).onAnimationStart=onAnimationStart}return container}function injectScrollElements(){if(debug("Injecting elements"),getState(element)){!function alterPositionStyles(){var style=getState(element).style;if("static"===style.position){element.style.setProperty("position","relative",options.important?"important":"");var removeRelativeStyles=function(reporter,element,style,property){var value=style[property];"auto"!==value&&"0"!==function getNumericalValue(value){return value.replace(/[^-\d\.]/g,"")}(value)&&(reporter.warn("An element that is positioned static has style."+property+"="+value+" which is ignored due to the static positioning. The element will need to be positioned relative, so the style."+property+" will be set to 0. Element: ",element),element.style[property]=0)};removeRelativeStyles(reporter,element,style,"top"),removeRelativeStyles(reporter,element,style,"right"),removeRelativeStyles(reporter,element,style,"bottom"),removeRelativeStyles(reporter,element,style,"left")}}();var rootContainer=getState(element).container;rootContainer||(rootContainer=injectContainerElement());var scrollbarWidth=scrollbarSizes.width,scrollbarHeight=scrollbarSizes.height,containerContainerStyle=buildCssTextString(["position: absolute","flex: none","overflow: hidden","z-index: -1","visibility: hidden","width: 100%","height: 100%","left: 0px","top: 0px"]),containerStyle=buildCssTextString(["position: absolute","flex: none","overflow: hidden","z-index: -1","visibility: hidden"].concat(function getLeftTopBottomRightCssText(left,top,bottom,right){return["left: "+(left=left?left+"px":"0"),"top: "+(top=top?top+"px":"0"),"right: "+(right=right?right+"px":"0"),"bottom: "+(bottom=bottom?bottom+"px":"0")]}(-(1+scrollbarWidth),-(1+scrollbarHeight),-scrollbarHeight,-scrollbarWidth))),expandStyle=buildCssTextString(["position: absolute","flex: none","overflow: scroll","z-index: -1","visibility: hidden","width: 100%","height: 100%"]),shrinkStyle=buildCssTextString(["position: absolute","flex: none","overflow: scroll","z-index: -1","visibility: hidden","width: 100%","height: 100%"]),expandChildStyle=buildCssTextString(["position: absolute","left: 0","top: 0"]),shrinkChildStyle=buildCssTextString(["position: absolute","width: 200%","height: 200%"]),containerContainer=document.createElement("div"),container=document.createElement("div"),expand=document.createElement("div"),expandChild=document.createElement("div"),shrink=document.createElement("div"),shrinkChild=document.createElement("div");containerContainer.dir="ltr",containerContainer.style.cssText=containerContainerStyle,containerContainer.className="erd_scroll_detection_container",container.className="erd_scroll_detection_container",container.style.cssText=containerStyle,expand.style.cssText=expandStyle,expandChild.style.cssText=expandChildStyle,shrink.style.cssText=shrinkStyle,shrinkChild.style.cssText=shrinkChildStyle,expand.appendChild(expandChild),shrink.appendChild(shrinkChild),container.appendChild(expand),container.appendChild(shrink),containerContainer.appendChild(container),rootContainer.appendChild(containerContainer),addEvent(expand,"scroll",onExpandScroll),addEvent(shrink,"scroll",onShrinkScroll),getState(element).onExpandScroll=onExpandScroll,getState(element).onShrinkScroll=onShrinkScroll}else debug("Aborting because element has been uninstalled");function onExpandScroll(){var state=getState(element);state&&state.onExpand?state.onExpand():debug("Aborting expand scroll handler: element has been uninstalled")}function onShrinkScroll(){var state=getState(element);state&&state.onShrink?state.onShrink():debug("Aborting shrink scroll handler: element has been uninstalled")}}function registerListenersAndPositionElements(){function updateChildSizes(element,width,height){var expandChild=function getExpandChildElement(element){return getExpandElement(element).childNodes[0]}(element),expandWidth=getExpandWidth(width),expandHeight=getExpandHeight(height);expandChild.style.setProperty("width",expandWidth+"px",options.important?"important":""),expandChild.style.setProperty("height",expandHeight+"px",options.important?"important":"")}function updateDetectorElements(done){var width=element.offsetWidth,height=element.offsetHeight,sizeChanged=width!==getState(element).lastWidth||height!==getState(element).lastHeight;debug("Storing current size",width,height),storeCurrentSize(element,width,height),batchProcessor.add(0,(function performUpdateChildSizes(){if(sizeChanged)if(getState(element))if(areElementsInjected()){if(options.debug){var w=element.offsetWidth,h=element.offsetHeight;w===width&&h===height||reporter.warn(idHandler.get(element),"Scroll: Size changed before updating detector elements.")}updateChildSizes(element,width,height)}else debug("Aborting because element container has not been initialized");else debug("Aborting because element has been uninstalled")})),batchProcessor.add(1,(function updateScrollbars(){getState(element)?areElementsInjected()?positionScrollbars(element,width,height):debug("Aborting because element container has not been initialized"):debug("Aborting because element has been uninstalled")})),sizeChanged&&done&&batchProcessor.add(2,(function(){getState(element)?areElementsInjected()?done():debug("Aborting because element container has not been initialized"):debug("Aborting because element has been uninstalled")}))}function areElementsInjected(){return!!getState(element).container}function notifyListenersIfNeeded(){debug("notifyListenersIfNeeded invoked");var state=getState(element);return function isFirstNotify(){return void 0===getState(element).lastNotifiedWidth}()&&state.lastWidth===state.startSize.width&&state.lastHeight===state.startSize.height?debug("Not notifying: Size is the same as the start size, and there has been no notification yet."):state.lastWidth===state.lastNotifiedWidth&&state.lastHeight===state.lastNotifiedHeight?debug("Not notifying: Size already notified"):(debug("Current size not notified, notifying..."),state.lastNotifiedWidth=state.lastWidth,state.lastNotifiedHeight=state.lastHeight,void forEach(getState(element).listeners,(function(listener){listener(element)})))}function handleScroll(){debug("Scroll detected."),isUnrendered(element)?debug("Scroll event fired while unrendered. Ignoring..."):updateDetectorElements(notifyListenersIfNeeded)}if(debug("registerListenersAndPositionElements invoked."),getState(element)){getState(element).onRendered=function handleRender(){if(debug("startanimation triggered."),isUnrendered(element))debug("Ignoring since element is still unrendered...");else{debug("Element rendered.");var expand=getExpandElement(element),shrink=getShrinkElement(element);0!==expand.scrollLeft&&0!==expand.scrollTop&&0!==shrink.scrollLeft&&0!==shrink.scrollTop||(debug("Scrollbars out of sync. Updating detector elements..."),updateDetectorElements(notifyListenersIfNeeded))}},getState(element).onExpand=handleScroll,getState(element).onShrink=handleScroll;var style=getState(element).style;updateChildSizes(element,style.width,style.height)}else debug("Aborting because element has been uninstalled")}function finalizeDomMutation(){if(debug("finalizeDomMutation invoked."),getState(element)){var style=getState(element).style;storeCurrentSize(element,style.width,style.height),positionScrollbars(element,style.width,style.height)}else debug("Aborting because element has been uninstalled")}function ready(){callback(element)}function install(){debug("Installing..."),function initListeners(){getState(element).listeners=[]}(),function storeStartSize(){var style=getStyle();getState(element).startSize={width:style.width,height:style.height},debug("Element start size",getState(element).startSize)}(),batchProcessor.add(0,storeStyle),batchProcessor.add(1,injectScrollElements),batchProcessor.add(2,registerListenersAndPositionElements),batchProcessor.add(3,finalizeDomMutation),batchProcessor.add(4,ready)}callback||(callback=element,element=options,options=null),options=options||{},debug("Making detectable..."),!function isDetached(element){return!function isInDocument(element){var isInShadowRoot=element.getRootNode&&element.getRootNode().contains(element);return element===element.ownerDocument.body||element.ownerDocument.body.contains(element)||isInShadowRoot}(element)||null===window.getComputedStyle(element)}(element)?install():(debug("Element is detached"),injectContainerElement(),debug("Waiting until element is attached..."),getState(element).onRendered=function(){debug("Element is now attached"),install()})},addListener:function addListener(element,listener){if(!getState(element).listeners.push)throw new Error("Cannot add listener to an element that is not detectable.");getState(element).listeners.push(listener)},uninstall:function uninstall(element){var state=getState(element);state&&(state.onExpandScroll&&removeEvent(getExpandElement(element),"scroll",state.onExpandScroll),state.onShrinkScroll&&removeEvent(getShrinkElement(element),"scroll",state.onShrinkScroll),state.onAnimationStart&&removeEvent(state.container,"animationstart",state.onAnimationStart),state.container&&element.removeChild(state.container))},initDocument}}},"./node_modules/element-resize-detector/src/element-resize-detector.js":(module,__unused_webpack_exports,__webpack_require__)=>{var forEach=__webpack_require__("./node_modules/element-resize-detector/src/collection-utils.js").forEach,elementUtilsMaker=__webpack_require__("./node_modules/element-resize-detector/src/element-utils.js"),listenerHandlerMaker=__webpack_require__("./node_modules/element-resize-detector/src/listener-handler.js"),idGeneratorMaker=__webpack_require__("./node_modules/element-resize-detector/src/id-generator.js"),idHandlerMaker=__webpack_require__("./node_modules/element-resize-detector/src/id-handler.js"),reporterMaker=__webpack_require__("./node_modules/element-resize-detector/src/reporter.js"),browserDetector=__webpack_require__("./node_modules/element-resize-detector/src/browser-detector.js"),batchProcessorMaker=__webpack_require__("./node_modules/batch-processor/src/batch-processor.js"),stateHandler=__webpack_require__("./node_modules/element-resize-detector/src/state-handler.js"),objectStrategyMaker=__webpack_require__("./node_modules/element-resize-detector/src/detection-strategy/object.js"),scrollStrategyMaker=__webpack_require__("./node_modules/element-resize-detector/src/detection-strategy/scroll.js");function isCollection(obj){return Array.isArray(obj)||void 0!==obj.length}function toArray(collection){if(Array.isArray(collection))return collection;var array=[];return forEach(collection,(function(obj){array.push(obj)})),array}function isElement(obj){return obj&&1===obj.nodeType}function getOption(options,name,defaultValue){var value=options[name];return null==value&&void 0!==defaultValue?defaultValue:value}module.exports=function(options){var idHandler;if((options=options||{}).idHandler)idHandler={get:function(element){return options.idHandler.get(element,!0)},set:options.idHandler.set};else{var idGenerator=idGeneratorMaker(),defaultIdHandler=idHandlerMaker({idGenerator,stateHandler});idHandler=defaultIdHandler}var reporter=options.reporter;reporter||(reporter=reporterMaker(!1===reporter));var batchProcessor=getOption(options,"batchProcessor",batchProcessorMaker({reporter})),globalOptions={};globalOptions.callOnAdd=!!getOption(options,"callOnAdd",!0),globalOptions.debug=!!getOption(options,"debug",!1);var detectionStrategy,eventListenerHandler=listenerHandlerMaker(idHandler),elementUtils=elementUtilsMaker({stateHandler}),desiredStrategy=getOption(options,"strategy","object"),importantCssRules=getOption(options,"important",!1),strategyOptions={reporter,batchProcessor,stateHandler,idHandler,important:importantCssRules};if("scroll"===desiredStrategy&&(browserDetector.isLegacyOpera()?(reporter.warn("Scroll strategy is not supported on legacy Opera. Changing to object strategy."),desiredStrategy="object"):browserDetector.isIE(9)&&(reporter.warn("Scroll strategy is not supported on IE9. Changing to object strategy."),desiredStrategy="object")),"scroll"===desiredStrategy)detectionStrategy=scrollStrategyMaker(strategyOptions);else{if("object"!==desiredStrategy)throw new Error("Invalid strategy name: "+desiredStrategy);detectionStrategy=objectStrategyMaker(strategyOptions)}var onReadyCallbacks={};return{listenTo:function listenTo(options,elements,listener){function onResizeCallback(element){var listeners=eventListenerHandler.get(element);forEach(listeners,(function callListenerProxy(listener){listener(element)}))}function addListener(callOnAdd,element,listener){eventListenerHandler.add(element,listener),callOnAdd&&listener(element)}if(listener||(listener=elements,elements=options,options={}),!elements)throw new Error("At least one element required.");if(!listener)throw new Error("Listener required.");if(isElement(elements))elements=[elements];else{if(!isCollection(elements))return reporter.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");elements=toArray(elements)}var elementsReady=0,callOnAdd=getOption(options,"callOnAdd",globalOptions.callOnAdd),onReadyCallback=getOption(options,"onReady",(function noop(){})),debug=getOption(options,"debug",globalOptions.debug);forEach(elements,(function attachListenerToElement(element){stateHandler.getState(element)||(stateHandler.initState(element),idHandler.set(element));var id=idHandler.get(element);if(debug&&reporter.log("Attaching listener to element",id,element),!elementUtils.isDetectable(element))return debug&&reporter.log(id,"Not detectable."),elementUtils.isBusy(element)?(debug&&reporter.log(id,"System busy making it detectable"),addListener(callOnAdd,element,listener),onReadyCallbacks[id]=onReadyCallbacks[id]||[],void onReadyCallbacks[id].push((function onReady(){++elementsReady===elements.length&&onReadyCallback()}))):(debug&&reporter.log(id,"Making detectable..."),elementUtils.markBusy(element,!0),detectionStrategy.makeDetectable({debug,important:importantCssRules},element,(function onElementDetectable(element){if(debug&&reporter.log(id,"onElementDetectable"),stateHandler.getState(element)){elementUtils.markAsDetectable(element),elementUtils.markBusy(element,!1),detectionStrategy.addListener(element,onResizeCallback),addListener(callOnAdd,element,listener);var state=stateHandler.getState(element);if(state&&state.startSize){var width=element.offsetWidth,height=element.offsetHeight;state.startSize.width===width&&state.startSize.height===height||onResizeCallback(element)}onReadyCallbacks[id]&&forEach(onReadyCallbacks[id],(function(callback){callback()}))}else debug&&reporter.log(id,"Element uninstalled before being detectable.");delete onReadyCallbacks[id],++elementsReady===elements.length&&onReadyCallback()})));debug&&reporter.log(id,"Already detecable, adding listener."),addListener(callOnAdd,element,listener),elementsReady++})),elementsReady===elements.length&&onReadyCallback()},removeListener:eventListenerHandler.removeListener,removeAllListeners:eventListenerHandler.removeAllListeners,uninstall:function uninstall(elements){if(!elements)return reporter.error("At least one element is required.");if(isElement(elements))elements=[elements];else{if(!isCollection(elements))return reporter.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");elements=toArray(elements)}forEach(elements,(function(element){eventListenerHandler.removeAllListeners(element),detectionStrategy.uninstall(element),stateHandler.cleanState(element)}))},initDocument:function initDocument(targetDocument){detectionStrategy.initDocument&&detectionStrategy.initDocument(targetDocument)}}}},"./node_modules/element-resize-detector/src/element-utils.js":module=>{module.exports=function(options){var getState=options.stateHandler.getState;return{isDetectable:function isDetectable(element){var state=getState(element);return state&&!!state.isDetectable},markAsDetectable:function markAsDetectable(element){getState(element).isDetectable=!0},isBusy:function isBusy(element){return!!getState(element).busy},markBusy:function markBusy(element,busy){getState(element).busy=!!busy}}}},"./node_modules/element-resize-detector/src/id-generator.js":module=>{module.exports=function(){var idCount=1;return{generate:function generate(){return idCount++}}}},"./node_modules/element-resize-detector/src/id-handler.js":module=>{module.exports=function(options){var idGenerator=options.idGenerator,getState=options.stateHandler.getState;return{get:function getId(element){var state=getState(element);return state&&void 0!==state.id?state.id:null},set:function setId(element){var state=getState(element);if(!state)throw new Error("setId required the element to have a resize detection state.");var id=idGenerator.generate();return state.id=id,id}}}},"./node_modules/element-resize-detector/src/listener-handler.js":module=>{module.exports=function(idHandler){var eventListeners={};function getListeners(element){var id=idHandler.get(element);return void 0===id?[]:eventListeners[id]||[]}return{get:getListeners,add:function addListener(element,listener){var id=idHandler.get(element);eventListeners[id]||(eventListeners[id]=[]),eventListeners[id].push(listener)},removeListener:function removeListener(element,listener){for(var listeners=getListeners(element),i=0,len=listeners.length;i<len;++i)if(listeners[i]===listener){listeners.splice(i,1);break}},removeAllListeners:function removeAllListeners(element){var listeners=getListeners(element);listeners&&(listeners.length=0)}}}},"./node_modules/element-resize-detector/src/reporter.js":module=>{module.exports=function(quiet){function noop(){}var reporter={log:noop,warn:noop,error:noop};if(!quiet&&window.console){var attachFunction=function(reporter,name){reporter[name]=function reporterProxy(){var f=console[name];if(f.apply)f.apply(console,arguments);else for(var i=0;i<arguments.length;i++)f(arguments[i])}};attachFunction(reporter,"log"),attachFunction(reporter,"warn"),attachFunction(reporter,"error")}return reporter}},"./node_modules/element-resize-detector/src/state-handler.js":module=>{function getState(element){return element._erd}module.exports={initState:function initState(element){return element._erd={},getState(element)},getState,cleanState:function cleanState(element){delete element._erd}}}}]);