try{
(()=>{var bo=Object.create;var U=Object.defineProperty;var ho=Object.getOwnPropertyDescriptor;var vo=Object.getOwnPropertyNames;var yo=Object.getPrototypeOf,xo=Object.prototype.hasOwnProperty;var z=(r,e)=>()=>(r&&(e=r(r=0)),e);var f=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports),To=(r,e)=>{for(var o in e)U(r,o,{get:e[o],enumerable:!0})},Ae=(r,e,o,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of vo(e))!xo.call(r,a)&&a!==o&&U(r,a,{get:()=>e[a],enumerable:!(s=ho(e,a))||s.enumerable});return r};var k=(r,e,o)=>(o=r!=null?bo(yo(r)):{},Ae(e||!r||!r.__esModule?U(o,"default",{value:r,enumerable:!0}):o,r)),Eo=r=>Ae(U({},"__esModule",{value:!0}),r);var t=z(()=>{});var n=z(()=>{});var i=z(()=>{});var Le={};To(Le,{Children:()=>So,Component:()=>Co,Fragment:()=>Oo,Profiler:()=>ko,PureComponent:()=>se,StrictMode:()=>Po,Suspense:()=>Ro,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:()=>Mo,cloneElement:()=>Ao,createContext:()=>G,createElement:()=>Fo,createFactory:()=>Lo,createRef:()=>Ho,default:()=>wo,forwardRef:()=>L,isValidElement:()=>Do,lazy:()=>Io,memo:()=>Bo,startTransition:()=>No,unstable_act:()=>jo,useCallback:()=>ae,useContext:()=>ce,useDebugValue:()=>qo,useDeferredValue:()=>Wo,useEffect:()=>I,useId:()=>Go,useImperativeHandle:()=>ue,useInsertionEffect:()=>Ko,useLayoutEffect:()=>Uo,useMemo:()=>Y,useReducer:()=>zo,useRef:()=>B,useState:()=>pe,useSyncExternalStore:()=>Vo,useTransition:()=>Yo,version:()=>$o});var wo,So,Co,Oo,ko,se,Po,Ro,Mo,Ao,G,Fo,Lo,Ho,L,Do,Io,Bo,No,jo,ae,ce,qo,Wo,I,Go,ue,Ko,Uo,Y,zo,B,pe,Vo,Yo,$o,N=z(()=>{t();n();i();wo=__REACT__,{Children:So,Component:Co,Fragment:Oo,Profiler:ko,PureComponent:se,StrictMode:Po,Suspense:Ro,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:Mo,cloneElement:Ao,createContext:G,createElement:Fo,createFactory:Lo,createRef:Ho,forwardRef:L,isValidElement:Do,lazy:Io,memo:Bo,startTransition:No,unstable_act:jo,useCallback:ae,useContext:ce,useDebugValue:qo,useDeferredValue:Wo,useEffect:I,useId:Go,useImperativeHandle:ue,useInsertionEffect:Ko,useLayoutEffect:Uo,useMemo:Y,useReducer:zo,useRef:B,useState:pe,useSyncExternalStore:Vo,useTransition:Yo,version:$o}=__REACT__});var le=f((En,$)=>{t();n();i();(function(){"use strict";var r={}.hasOwnProperty;function e(){for(var a="",c=0;c<arguments.length;c++){var d=arguments[c];d&&(a=s(a,o(d)))}return a}function o(a){if(typeof a=="string"||typeof a=="number")return a;if(typeof a!="object")return"";if(Array.isArray(a))return e.apply(null,a);if(a.toString!==Object.prototype.toString&&!a.toString.toString().includes("[native code]"))return a.toString();var c="";for(var d in a)r.call(a,d)&&a[d]&&(c=s(c,d));return c}function s(a,c){return c?a?a+" "+c:a+c:a}typeof $<"u"&&$.exports?(e.default=e,$.exports=e):typeof define=="function"&&typeof define.amd=="object"&&define.amd?define("classnames",[],function(){return e}):window.classNames=e})()});var De=f(X=>{"use strict";t();n();i();var Xo=(N(),Eo(Le)),Jo=Symbol.for("react.element"),Zo=Symbol.for("react.fragment"),Qo=Object.prototype.hasOwnProperty,et=Xo.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,rt={key:!0,ref:!0,__self:!0,__source:!0};function He(r,e,o){var s,a={},c=null,d=null;o!==void 0&&(c=""+o),e.key!==void 0&&(c=""+e.key),e.ref!==void 0&&(d=e.ref);for(s in e)Qo.call(e,s)&&!rt.hasOwnProperty(s)&&(a[s]=e[s]);if(r&&r.defaultProps)for(s in e=r.defaultProps,e)a[s]===void 0&&(a[s]=e[s]);return{$$typeof:Jo,type:r,key:c,ref:d,props:a,_owner:et.current}}X.Fragment=Zo;X.jsx=He;X.jsxs=He});var A=f((zn,Ie)=>{"use strict";t();n();i();Ie.exports=De()});var Ke=f((vi,Ge)=>{"use strict";t();n();i();Ge.exports=function(r,e,o){var s=this;return r=r instanceof Array?r:[r],s.bindMultiple(r,e,o),s}});var ze=f((Ei,Ue)=>{"use strict";t();n();i();Ue.exports=function(r,e,o){for(var s=this,a=0;a<r.length;++a)s.bindSingle(r[a],e,o)}});var Ye=f((Ci,Ve)=>{"use strict";t();n();i();Ve.exports=function(r,e){var o=this;return o.bind(r,function(){},e)}});var Xe=f((Ri,$e)=>{"use strict";t();n();i();$e.exports=function(r,e){var o=this;return o.directMap[r+":"+e]&&o.directMap[r+":"+e]({},r),this}});var Ze=f((Li,Je)=>{"use strict";t();n();i();Je.exports=function(){var r=this;return r.callbacks={},r.directMap={},this}});var er=f((Bi,Qe)=>{"use strict";t();n();i();Qe.exports=function(r,e){if((" "+e.className+" ").indexOf(" combokeys ")>-1)return!1;var o=e.tagName.toLowerCase();return o==="input"||o==="select"||o==="textarea"||e.isContentEditable}});var Q=f((Wi,rr)=>{"use strict";t();n();i();rr.exports=function(r){return r==="shift"||r==="ctrl"||r==="alt"||r==="meta"}});var tr=f((zi,or)=>{"use strict";t();n();i();or.exports=function(r,e,o){var s=this,a,c,d={},g=0,m=!1,y,b;for(a=s.getMatches(r,e,o),c=0;c<a.length;++c)a[c].seq&&(g=Math.max(g,a[c].level));for(c=0;c<a.length;++c){if(a[c].seq){if(a[c].level!==g)continue;m=!0,d[a[c].seq]=1,s.fireCallback(a[c].callback,o,a[c].combo,a[c].seq);continue}m||s.fireCallback(a[c].callback,o,a[c].combo)}b=o.type==="keypress"&&s.ignoreNextKeypress,y=Q(),o.type===s.nextExpectedAction&&!y(r)&&!b&&s.resetSequences(d),s.ignoreNextKeypress=m&&o.type==="keydown"}});var be=f((Xi,ee)=>{t();n();i();ee.exports=nr;ee.exports.on=nr;ee.exports.off=at;function nr(r,e,o,s){return!r.addEventListener&&(e="on"+e),(r.addEventListener||r.attachEvent).call(r,e,o,s),o}function at(r,e,o,s){return!r.removeEventListener&&(e="on"+e),(r.removeEventListener||r.detachEvent).call(r,e,o,s),o}});var he=f((es,re)=>{"use strict";t();n();i();re.exports={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",173:"minus",187:"plus",189:"minus",224:"meta"};for(P=1;P<20;++P)re.exports[111+P]="f"+P;var P;for(P=0;P<=9;++P)re.exports[P+96]=P});var sr=f((ns,ir)=>{"use strict";t();n();i();ir.exports={106:"*",107:"plus",109:"minus",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"}});var ve=f((cs,ar)=>{"use strict";t();n();i();ar.exports=function(r){var e,o;if(e=he(),o=sr(),r.type==="keypress"){var s=String.fromCharCode(r.which);return r.shiftKey||(s=s.toLowerCase()),s}return e[r.which]!==void 0?e[r.which]:o[r.which]!==void 0?o[r.which]:String.fromCharCode(r.which).toLowerCase()}});var ur=f((ds,cr)=>{"use strict";t();n();i();cr.exports=function(r){var e=[];return r.shiftKey&&e.push("shift"),r.altKey&&e.push("alt"),r.ctrlKey&&e.push("ctrl"),r.metaKey&&e.push("meta"),e}});var lr=f((bs,pr)=>{"use strict";t();n();i();pr.exports=function(r){var e=this,o,s;typeof r.which!="number"&&(r.which=r.keyCode),o=ve();var a=o(r);if(a!==void 0){if(r.type==="keyup"&&e.ignoreNextKeyup===a){e.ignoreNextKeyup=!1;return}s=ur(),e.handleKey(a,s(r),r)}}});var gr=f((xs,dr)=>{"use strict";t();n();i();dr.exports=function(){var r=this,e=be(),o=r.element;r.eventHandler=lr().bind(r),e(o,"keypress",r.eventHandler),e(o,"keydown",r.eventHandler),e(o,"keyup",r.eventHandler)}});var mr=f((ws,fr)=>{"use strict";t();n();i();fr.exports=function(r,e,o,s,a){var c=this;c.directMap[r+":"+o]=e,r=r.replace(/\s+/g," ");var d=r.split(" "),g;if(d.length>1){c.bindSequence(r,d,e,o);return}g=c.getKeyInfo(r,o),c.callbacks[g.key]=c.callbacks[g.key]||[],c.getMatches(g.key,g.modifiers,{type:g.action},s,r,a),c.callbacks[g.key][s?"unshift":"push"]({callback:e,modifiers:g.modifiers,action:g.action,seq:s,level:a,combo:r})}});var hr=f((ks,br)=>{"use strict";t();n();i();br.exports=function(r){return r==="+"?["+"]:r.split("+")}});var yr=f((As,vr)=>{"use strict";t();n();i();vr.exports={option:"alt",command:"meta",return:"enter",escape:"esc",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"}});var Tr=f((Ds,xr)=>{"use strict";t();n();i();xr.exports={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"}});var _r=f((js,Er)=>{"use strict";t();n();i();Er.exports=function(r,e){var o=this,s,a,c,d,g=[],m,y,b;for(s=hr(),a=s(r),m=yr(),y=Tr(),b=Q(),d=0;d<a.length;++d)c=a[d],m[c]&&(c=m[c]),e&&e!=="keypress"&&y[c]&&(c=y[c],g.push("shift")),b(c)&&g.push(c);return e=o.pickBestAction(c,g,e),{key:c,modifiers:g,action:e}}});var Sr=f((Ks,wr)=>{"use strict";t();n();i();wr.exports=function(r,e,o){var s=this;return o||(o=s.getReverseMap()[r]?"keydown":"keypress"),o==="keypress"&&e.length&&(o="keydown"),o}});var Or=f((Ys,Cr)=>{"use strict";t();n();i();Cr.exports=function(){var r=this,e=r.constructor,o;if(!e.REVERSE_MAP){e.REVERSE_MAP={},o=he();for(var s in o)s>95&&s<112||o.hasOwnProperty(s)&&(e.REVERSE_MAP[o[s]]=s)}return e.REVERSE_MAP}});var Pr=f((Zs,kr)=>{"use strict";t();n();i();kr.exports=function(r,e){return r.sort().join(",")===e.sort().join(",")}});var Mr=f((oa,Rr)=>{"use strict";t();n();i();Rr.exports=function(r,e,o,s,a,c){var d=this,g,m,y=[],b=o.type,T,S;if(b==="keypress"&&!(o.code&&o.code.slice(0,5)==="Arrow")){var F=d.callbacks["any-character"]||[];F.forEach(function(K){y.push(K)})}if(!d.callbacks[r])return y;for(T=Q(),b==="keyup"&&T(r)&&(e=[r]),g=0;g<d.callbacks[r].length;++g)if(m=d.callbacks[r][g],!(!s&&m.seq&&d.sequenceLevels[m.seq]!==m.level)&&b===m.action&&(S=Pr(),b==="keypress"&&!o.metaKey&&!o.ctrlKey||S(e,m.modifiers))){var H=!s&&m.combo===a,D=s&&m.seq===s&&m.level===c;(H||D)&&d.callbacks[r].splice(g,1),y.push(m)}return y}});var Fr=f((sa,Ar)=>{"use strict";t();n();i();Ar.exports=function(r){var e=this;r=r||{};var o=!1,s;for(s in e.sequenceLevels){if(r[s]){o=!0;continue}e.sequenceLevels[s]=0}o||(e.nextExpectedAction=!1)}});var Hr=f((pa,Lr)=>{"use strict";t();n();i();Lr.exports=function(r){if(r.preventDefault){r.preventDefault();return}r.returnValue=!1}});var Ir=f((fa,Dr)=>{"use strict";t();n();i();Dr.exports=function(r){if(r.stopPropagation){r.stopPropagation();return}r.cancelBubble=!0}});var Nr=f((va,Br)=>{"use strict";t();n();i();Br.exports=function(r,e,o,s){var a=this,c,d;a.stopCallback(e,e.target||e.srcElement,o,s)||r(e,o)===!1&&(c=Hr(),c(e),d=Ir(),d(e))}});var qr=f((Ea,jr)=>{"use strict";t();n();i();jr.exports=function(r,e,o,s){var a=this;a.sequenceLevels[r]=0;function c(b){return function(){a.nextExpectedAction=b,++a.sequenceLevels[r],a.resetSequenceTimer()}}function d(b){var T;a.fireCallback(o,b,r),s!=="keyup"&&(T=ve(),a.ignoreNextKeyup=T(b)),setTimeout(function(){a.resetSequences()},10)}for(var g=0;g<e.length;++g){var m=g+1===e.length,y=m?d:c(s||a.getKeyInfo(e[g+1]).action);a.bindSingle(e[g],y,s,r,g)}}});var Gr=f((Ca,Wr)=>{"use strict";t();n();i();Wr.exports=function(){var r=this;clearTimeout(r.resetTimer),r.resetTimer=setTimeout(function(){r.resetSequences()},1e3)}});var Ur=f((Ra,Kr)=>{t();n();i();var ye=be().off;Kr.exports=function(){var r=this,e=r.element;ye(e,"keypress",r.eventHandler),ye(e,"keydown",r.eventHandler),ye(e,"keyup",r.eventHandler)}});var Vr=f((La,zr)=>{"use strict";t();n();i();zr.exports=function(){var r=this;r.instances.forEach(function(e){e.reset()})}});var Yr=f((Ba,v)=>{"use strict";t();n();i();v.exports=function(r,e){var o=this,s=o.constructor;return o.options=Object.assign({storeInstancesGlobally:!0},e||{}),o.callbacks={},o.directMap={},o.sequenceLevels={},o.resetTimer=null,o.ignoreNextKeyup=!1,o.ignoreNextKeypress=!1,o.nextExpectedAction=!1,o.element=r,o.addEvents(),o.options.storeInstancesGlobally&&s.instances.push(o),o};v.exports.prototype.bind=Ke();v.exports.prototype.bindMultiple=ze();v.exports.prototype.unbind=Ye();v.exports.prototype.trigger=Xe();v.exports.prototype.reset=Ze();v.exports.prototype.stopCallback=er();v.exports.prototype.handleKey=tr();v.exports.prototype.addEvents=gr();v.exports.prototype.bindSingle=mr();v.exports.prototype.getKeyInfo=_r();v.exports.prototype.pickBestAction=Sr();v.exports.prototype.getReverseMap=Or();v.exports.prototype.getMatches=Mr();v.exports.prototype.resetSequences=Fr();v.exports.prototype.fireCallback=Nr();v.exports.prototype.bindSequence=qr();v.exports.prototype.resetSequenceTimer=Gr();v.exports.prototype.detach=Ur();v.exports.instances=[];v.exports.reset=Vr();v.exports.REVERSE_MAP=null});var Xr=f((E,$r)=>{"use strict";t();n();i();var Te=E&&E.__assign||function(){return Te=Object.assign||function(r){for(var e,o=1,s=arguments.length;o<s;o++){e=arguments[o];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(r[a]=e[a])}return r},Te.apply(this,arguments)};Object.defineProperty(E,"__esModule",{value:!0});E.RecognizedBrowser=E.Device=E.OS=E.Browser=void 0;var h;(function(r){r.Firefox="firefox",r.Chrome="chrome",r.InternetExplorer="ie",r.Safari="safari",r.Edge="edge",r.Android="com.android.browser",r.Opera="opera",r.OperaMini="opera.mini",r.Blackberry="blackberry",r.Iceweasel="iceweasel",r.Yandex="yandex",r.SeaMonkey="seamonkey"})(h||(E.Browser=h={}));var x;(function(r){r.Linux="linux",r.MacOS="macos",r.Windows="windows",r.iOS="ios",r.OpenBSD="openbsd",r.ChromeOS="chromeos",r.Android="android",r.FirefoxOS="firefoxos",r.WindowsPhone="windows.phone",r.WindowsMobile="windows.mobile",r.BlackberryOS="blackberryos"})(x||(E.OS=x={}));var w;(function(r){r.iPad="ipad",r.iPhone="iphone",r.Lumia="lumia",r.HTC="htc",r.Nexus="nexus",r.GalaxyNexus="galaxy.nexus",r.Nokia="nokia",r.Galaxy="galaxy",r.XBox="xbox",r.Blackberry="blackberry"})(w||(E.Device=w={}));var ct=[[/msie ([\.\_\d]+)/,h.InternetExplorer],[/trident\/.*?rv:([\.\_\d]+)/,h.InternetExplorer],[/firefox\/([\.\_\d]+)/,h.Firefox],[/fxios\/([\.\_\d]+)/,h.Firefox],[/chrome\/([\.\_\d]+)/,h.Chrome],[/version\/([\.\_\d]+).*?safari/,h.Safari],[/mobile safari ([\.\_\d]+)/,h.Safari],[/android.*?version\/([\.\_\d]+).*?safari/,h.Android],[/crios\/([\.\_\d]+).*?safari/,h.Chrome],[/opera/,h.Opera],[/opera\/([\.\_\d]+)/,h.Opera],[/opera ([\.\_\d]+)/,h.Opera],[/opera mini.*?version\/([\.\_\d]+)/,h.OperaMini],[/opr\/([\.\_\d]+)/,h.Opera],[/opios\/([a-z\.\_\d]+)/,h.Opera],[/blackberry/,h.Blackberry],[/blackberry.*?version\/([\.\_\d]+)/,h.Blackberry],[/bb\d+.*?version\/([\.\_\d]+)/,h.Blackberry],[/rim.*?version\/([\.\_\d]+)/,h.Blackberry],[/iceweasel\/([\.\_\d]+)/,h.Iceweasel],[/edge\/([\.\d]+)/,h.Edge],[/edg\/([\.\d]+)/,h.Edge],[/yabrowser\/([\.\d]+)/,h.Yandex],[/seamonkey\/([\.\d]+)/,h.SeaMonkey]],ut=[[/cros\s*\S+\s*([\.\_\d]+)/,x.ChromeOS],[/linux ()([a-z\.\_\d]+)/,x.Linux],[/mac os x/,x.MacOS],[/mac os x.*?([\.\_\d]+)/,x.MacOS],[/os ([\.\_\d]+) like mac os/,x.iOS],[/openbsd ()([a-z\.\_\d]+)/,x.OpenBSD],[/android/,x.Android],[/android ([a-z\.\_\d]+);/,x.Android],[/mozilla\/[a-z\.\_\d]+ \((?:mobile)|(?:tablet)/,x.FirefoxOS],[/windows\s*(?:nt)?\s*([\.\_\d]+)/,x.Windows],[/windows phone.*?([\.\_\d]+)/,x.WindowsPhone],[/windows mobile/,x.WindowsMobile],[/blackberry/,x.BlackberryOS],[/bb\d+/,x.BlackberryOS],[/rim.*?os\s*([\.\_\d]+)/,x.BlackberryOS]],pt=[[/ipad/,w.iPad],[/iphone/,w.iPhone],[/lumia/,w.Lumia],[/htc/,w.HTC],[/nexus/,w.Nexus],[/galaxy nexus/,w.GalaxyNexus],[/nokia/,w.Nokia],[/ gt\-/,w.Galaxy],[/ sm\-/,w.Galaxy],[/xbox/,w.XBox],[/(?:bb\d+)|(?:blackberry)|(?: rim )/,w.Blackberry]],Ee="Unknown",j={name:Ee,version:[],versionString:Ee};function lt(r){return r.split(/[\._]/).map(function(e){return parseInt(e)}).filter(function(e){return!isNaN(e)})}function xe(r,e){var o=Te({},j);return r.forEach(function(s){var a=s[0],c=s[1],d=e.match(a);d&&(o.name=c,d[2]?(o.versionString=d[2],o.version=[]):d[1]?(o.versionString=d[1].replace(/_/g,"."),o.version=lt(d[1])):(o.versionString=Ee,o.version=[]))}),o}var _e=typeof window<"u",we=function(){function r(){this.os=j,this.device=j,this.browser=j}return r.prototype.sniff=function(e){var o=_e?navigator.userAgent:"",s=(e||o).toLowerCase();return this.os=xe(ut,s),this.device=xe(pt,s),this.browser=xe(ct,s),this},r}();E.default=we;E.RecognizedBrowser={os:j,browser:j,device:j};_e&&(oe=new we().sniff(navigator.userAgent),E.RecognizedBrowser.os=oe.os,E.RecognizedBrowser.device=oe.device,E.RecognizedBrowser.browser=oe.browser);var oe;_e&&typeof $r>"u"&&(window.Sniffr=new we,window.Sniffr.sniff(navigator.userAgent))});t();n();i();t();n();i();t();n();i();var Ht=__STORYBOOK_API__,{ActiveTabs:Dt,Consumer:It,ManagerContext:Bt,Provider:Nt,RequestResponseError:jt,addons:Fe,combineParameters:qt,controlOrMetaKey:Wt,controlOrMetaSymbol:Gt,eventMatchesShortcut:Kt,eventToShortcut:Ut,experimental_requestResponse:zt,isMacLike:Vt,isShortcutTaken:Yt,keyToSymbol:$t,merge:Xt,mockChannel:Jt,optionOrAltSymbol:Zt,shortcutMatchesShortcut:Qt,shortcutToHumanString:en,types:rn,useAddonState:on,useArgTypes:tn,useArgs:nn,useChannel:sn,useGlobalTypes:an,useGlobals:cn,useParameter:un,useSharedState:pn,useStoryPrepared:ln,useStorybookApi:dn,useStorybookState:gn}=__STORYBOOK_API__;var V={};t();n();i();N();var ke=k(le());t();n();i();var Cn=__REACT_DOM__,{__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:On,createPortal:de,createRoot:kn,findDOMNode:Pn,flushSync:Rn,hydrate:Mn,hydrateRoot:An,render:Fn,unmountComponentAtNode:Ln,unstable_batchedUpdates:Hn,unstable_renderSubtreeIntoContainer:Dn,version:In}=__REACT_DOM__;t();n();i();N();var ge=k(A()),J=G(void 0),fe=L(function({id:e,children:o,...s},a){let c=(0,ge.jsx)("div",{...s,"data-portaltarget":e,ref:a,children:typeof o!="function"&&o});return(0,ge.jsx)(J.Provider,{value:e,children:typeof o=="function"?o(c):c})});t();n();i();N();var yt=k(le());t();n();i();var me={};function ot(){return(Date.now()*Math.random()).toString(36).substring(0,4)}var tt=ot();function Z(r){if(!r)throw Error('Argument "name" is required in getUID()');me[r]||(me[r]=0);let e=String(me[r]++);return`${r}${e}-${tt}`}t();n();i();t();n();i();var nt=window.getComputedStyle.bind(window);function Be(r){return r===document?!0:r instanceof Node&&document.documentElement.contains(r.parentNode)}var it={top:0,right:0,bottom:0,left:0,width:0,height:0};function Ne(r){if(r instanceof Range||r!=null&&Be(r)){let{top:e,right:o,bottom:s,left:a,width:c,height:d}=r.getBoundingClientRect();return{top:e,right:o,bottom:s,left:a,width:c,height:d}}else return Object.assign({},it)}function je(){return window.innerHeight}function st(){return window.innerWidth}function qe(r){let{top:e,bottom:o,left:s,right:a}=Ne(r);return!(o<0||a<0||je()-e<0||st()-s<0)}var We=r=>(e,o="")=>{o.split(/\s+/g).filter(s=>!!s).forEach(s=>e[r](s))},di=We("add"),gi=We("remove");t();n();i();N();t();n();i();var eo=k(Yr());t();n();i();var Jr=k(Xr()),Zr=new Jr.default;Zr.sniff();var Qr=Zr;var Se=class{ALLOW_SHORTCUTS_SELECTOR=".ring-js-shortcuts";ROOT_SCOPE={scopeId:"ROOT",options:{}};_scopes={};_scopeChain=[];combokeys=new eo.default(document.documentElement);trigger=e=>this.combokeys.trigger(e);constructor(){this.setFilter(),this.setScope()}_dispatcher=(e,o)=>{let s;for(let a=this._scopeChain.length-1;a>=0;a--){let c=this._scopeChain[a];if(s=this._scopes[c.scopeId],s&&o!=null&&s[o]){let d=s[o](e,o,c.scopeId);if(d!==!0)return d}if(c.options.modal)return!0}};bind(e){if(!(e instanceof Object)||typeof e.handler!="function")throw new Error("Shortcut handler should exist");if(e.scope||(e.scope=this.ROOT_SCOPE.scopeId),Array.isArray(e.key)){for(let s=0;s<e.key.length;s++)this.bind(Object.assign({},e,{key:e.key[s]}));return}if(typeof e.key!="string")throw new Error("Shortcut key should exist");let o=this._scopes[e.scope];o||(o=this._scopes[e.scope]={}),o[e.key]=e.handler,this.combokeys.bind(e.key,this._dispatcher,this._getKeyboardEventType(e))}bindMap(e,o){if(!(e instanceof Object))throw new Error("Shortcuts map shouldn't be empty");for(let s in e)e.hasOwnProperty(s)&&this.bind(Object.assign({},o||{},{key:s,handler:e[s]}))}unbindScope(e){this._scopes[e]=null}getScope(){return this._scopeChain.slice(1)}hasScope(e){return this.indexOfScope(e)!==-1}pushScope(e,o={}){if(e){let s=this.indexOfScope(e);s!==-1&&this._scopeChain.splice(s,1),this._scopeChain.push(this.wrapScope(e,o))}}popScope(e){if(e){let o=this.indexOfScope(e);if(o!==-1)return this._scopeChain.splice(o,this._scopeChain.length-1)}}spliceScope(e){if(e){let o=this.indexOfScope(e);o!==-1&&this._scopeChain.splice(o,1)}}setScope(e){if(e){let o;if(typeof e=="string"||!Array.isArray(e)&&typeof e=="object"&&e!==null?o=[e]:o=e,!Array.isArray(o))return;let s=o.map(a=>typeof a=="string"?this.wrapScope(a):a);this._scopeChain=[this.ROOT_SCOPE].concat(s)}else this._scopeChain=[this.ROOT_SCOPE]}wrapScope(e,o={}){return{scopeId:e,options:o}}hasKey(e,o){return!!this._scopes[o]?.[e]}_defaultFilter=(e,o,s)=>{if(o===document||!(o instanceof HTMLElement)||s==null||o.matches(this.ALLOW_SHORTCUTS_SELECTOR)||(o.dataset.enabledShortcuts!=null?o.dataset.enabledShortcuts.split(",").includes(s):o.closest(this.ALLOW_SHORTCUTS_SELECTOR)!=null))return!1;let a=o.contentEditable,c=a==="true"||a==="plaintext-only";return o.matches("input:not([type=checkbox]),select,textarea")||c};_getKeyboardEventType(e){return!e.type&&Qr.os.name==="windows"&&typeof e.key=="string"&&e.key.match(/ctrl/i)&&e.key.match(/shift/i)&&e.key.match(/[0-9]/)?"keyup":e.type}setFilter(e){this.combokeys.stopCallback=typeof e=="function"?e:this._defaultFilter}indexOfScope(e){return this._scopeChain.findIndex(o=>o.scopeId===e)}reset(){this._scopes={},this.setScope(),this.combokeys.reset()}},dt=new Se;t();n();i();t();n();i();N();var ro={};var q=k(A()),ft="input, button, select, textarea, a[href], *[tabindex]:not([data-trap-button]):not([data-scrollable-container])",vc=L(function({children:e,trapDisabled:o=!1,autoFocusFirst:s=!0,focusBackOnClose:a=!0,focusBackOnExit:c=!1,...d},g){let m=B(null),y=B(null),b=B(null),T=B(!1),S=B(!1);b.current===null&&(b.current=document.activeElement),ue(g,()=>({node:m.current}),[]);let F=ae(()=>K(!0),[]),H=()=>K(!1);I(()=>(S.current=!0,()=>{S.current=!1}),[]),I(()=>{if(s)F();else if(!o){let C=b.current&&m.current?.contains(b.current),O=m.current?.contains(document.activeElement);(!m.current||!C&&!O)&&(T.current=!0,y.current?.focus())}return()=>{a&&D()}},[s,o,a,F]);function D(){let C=b.current;C instanceof HTMLElement&&C.focus&&qe(C)&&(S.current||C.focus({preventScroll:!0}))}function K(C=!0){let O=m.current;if(!O)return;let ie=[...O.querySelectorAll(ft)].filter(mo=>mo.tabIndex>=0),Me=C?ie[0]:ie[ie.length-1];Me&&Me.focus()}function go(C){if(!T.current)if(c){let O=C.nativeEvent.relatedTarget;O!=null&&m.current!=null&&O instanceof Element&&m.current.contains(O)&&D()}else H()}function fo(C){if(!T.current)return;T.current=!1;let O=C.nativeEvent.relatedTarget;O&&(O instanceof Element&&m.current?.contains(O)||H())}return o?(0,q.jsx)("div",{ref:m,...d,children:e}):(0,q.jsxs)("div",{ref:m,...d,children:[(0,q.jsx)("div",{tabIndex:0,ref:y,className:ro.trapButton,onFocus:go,onBlur:fo,"data-trap-button":!0}),e,(0,q.jsx)("div",{tabIndex:0,onFocus:c?D:F,"data-trap-button":!0})]})});t();n();i();t();n();i();var to=k(A());var oo=r=>typeof r=="string"?document.querySelector(`[data-portaltarget=${r}]`):r;var te={};var R=k(A()),no=(s=>(s.AUTO="auto",s.LIGHT="light",s.DARK="dark",s))(no||{}),Tt=G({theme:"light"}),Oe="ring-ui-theme-dark",Ce=window.matchMedia("(prefers-color-scheme: dark)");function io(){let[r,e]=pe(Ce.matches);return I(()=>{let o=s=>e(s.matches);return Ce.addEventListener("change",o),()=>Ce.removeEventListener("change",o)},[]),r?"dark":"light"}function Et(r){let e=io(),o=r==="auto"?e:r;return(0,ke.default)({[te.dark]:o==="dark",[Oe]:o==="dark",[V.light]:o==="light"})}function Pe(r,e){r==="dark"?(e.classList.remove(V.light),e.classList.add(te.dark),e.classList.add(Oe)):(e.classList.remove(te.dark),e.classList.remove(Oe),e.classList.add(V.light))}var _t=L(function(e,o){return(0,R.jsx)("div",{...e,ref:o})}),Su=L(function({theme:e="auto",className:o,passToPopups:s,children:a,WrapperComponent:c=_t,target:d,...g},m){let y=io(),b=e==="auto"?y:e,T=Y(()=>Z("popups-with-theme-"),[]),S=Y(()=>({theme:b}),[b]);I(()=>{d!=null&&Pe(b,d)},[b,d]);let F=Et(e),H=ce(J);return(0,R.jsx)(Tt.Provider,{value:S,children:(0,R.jsx)(c,{ref:m,className:d!=null?void 0:(0,ke.default)(o,F),...g,children:s?(0,R.jsx)(fe,{id:T,children:D=>(0,R.jsxs)(R.Fragment,{children:[a,de((0,R.jsx)("div",{className:F,children:D}),H&&oo(H)||document.body)]})}):a})})}),so=no;t();n();i();t();n();i();t();n();i();t();n();i();var _=function(){return _=Object.assign||function(e){for(var o,s=1,a=arguments.length;s<a;s++){o=arguments[s];for(var c in o)Object.prototype.hasOwnProperty.call(o,c)&&(e[c]=o[c])}return e},_.apply(this,arguments)};t();n();i();t();n();i();t();n();i();function ao(r){return r.toLowerCase()}var wt=[/([a-z0-9])([A-Z])/g,/([A-Z])([A-Z][a-z])/g],St=/[^A-Z0-9]+/gi;function W(r,e){e===void 0&&(e={});for(var o=e.splitRegexp,s=o===void 0?wt:o,a=e.stripRegexp,c=a===void 0?St:a,d=e.transform,g=d===void 0?ao:d,m=e.delimiter,y=m===void 0?" ":m,b=co(co(r,s,"$1\0$2"),c,"\0"),T=0,S=b.length;b.charAt(T)==="\0";)T++;for(;b.charAt(S-1)==="\0";)S--;return b.slice(T,S).split("\0").map(g).join(y)}function co(r,e,o){return e instanceof RegExp?r.replace(e,o):e.reduce(function(s,a){return s.replace(a,o)},r)}t();n();i();t();n();i();t();n();i();t();n();i();t();n();i();function ne(r,e){return e===void 0&&(e={}),W(r,_({delimiter:"."},e))}t();n();i();t();n();i();function uo(r,e){return e===void 0&&(e={}),ne(r,_({delimiter:"-"},e))}t();n();i();t();n();i();t();n();i();t();n();i();var Cl=__STORYBOOK_THEMING__,{CacheProvider:Ol,ClassNames:kl,Global:Pl,ThemeProvider:Rl,background:Ml,color:Al,convert:Fl,create:po,createCache:Ll,createGlobal:Hl,createReset:Dl,css:Il,darken:Bl,ensure:Nl,ignoreSsrWarning:jl,isPropValid:ql,jsx:Wl,keyframes:Gl,lighten:Kl,styled:Ul,themes:zl,typography:Vl,useTheme:Yl,withTheme:$l}=__STORYBOOK_THEMING__;var Re=window.matchMedia("(prefers-color-scheme: dark)"),M=window.Proxy?new Proxy({},{get:(r,e)=>getComputedStyle(document.documentElement).getPropertyValue(`--ring-${uo(e)}`).trim()}):{},Ot=M.textColor!=null,lo=po({base:Re.matches?"dark":"light",brandTitle:"JetBrains Ring UI",...Ot?{colorSecondary:M.mainColor,appBorderColor:M.lineColor,appBorderRadius:parseInt(M.borderRadius,10),fontBase:M.fontFamily,fontCode:M.fontFamilyMonospace,barTextColor:M.secondaryColor,barSelectedColor:M.mainColor,inputBorder:M.bordersColor,inputTextColor:M.textColor}:{}});Re.matches&&Pe(so.DARK,document.documentElement);Fe.setConfig({theme:lo});})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }
