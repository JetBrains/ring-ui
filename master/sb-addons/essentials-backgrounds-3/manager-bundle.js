try{
(()=>{var te=Object.create;var F=Object.defineProperty;var re=Object.getOwnPropertyDescriptor;var ne=Object.getOwnPropertyNames;var oe=Object.getPrototypeOf,ie=Object.prototype.hasOwnProperty;var x=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,s)=>(typeof require<"u"?require:t)[s]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')});var B=(e,t)=>()=>(e&&(t=e(e=0)),t);var ae=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var se=(e,t,s,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of ne(t))!ie.call(e,i)&&i!==s&&F(e,i,{get:()=>t[i],enumerable:!(o=re(t,i))||o.enumerable});return e};var le=(e,t,s)=>(s=e!=null?te(oe(e)):{},se(t||!e||!e.__esModule?F(s,"default",{value:e,enumerable:!0}):s,e));var d=B(()=>{});var m=B(()=>{});var p=B(()=>{});var $=ae((V,G)=>{d();m();p();(function(e){if(typeof V=="object"&&typeof G<"u")G.exports=e();else if(typeof define=="function"&&define.amd)define([],e);else{var t;typeof window<"u"||typeof window<"u"?t=window:typeof self<"u"?t=self:t=this,t.memoizerific=e()}})(function(){var e,t,s;return function o(i,g,l){function n(a,h){if(!g[a]){if(!i[a]){var c=typeof x=="function"&&x;if(!h&&c)return c(a,!0);if(r)return r(a,!0);var y=new Error("Cannot find module '"+a+"'");throw y.code="MODULE_NOT_FOUND",y}var f=g[a]={exports:{}};i[a][0].call(f.exports,function(b){var _=i[a][1][b];return n(_||b)},f,f.exports,o,i,g,l)}return g[a].exports}for(var r=typeof x=="function"&&x,u=0;u<l.length;u++)n(l[u]);return n}({1:[function(o,i,g){i.exports=function(l){if(typeof Map!="function"||l){var n=o("./similar");return new n}else return new Map}},{"./similar":2}],2:[function(o,i,g){function l(){return this.list=[],this.lastItem=void 0,this.size=0,this}l.prototype.get=function(n){var r;if(this.lastItem&&this.isEqual(this.lastItem.key,n))return this.lastItem.val;if(r=this.indexOf(n),r>=0)return this.lastItem=this.list[r],this.list[r].val},l.prototype.set=function(n,r){var u;return this.lastItem&&this.isEqual(this.lastItem.key,n)?(this.lastItem.val=r,this):(u=this.indexOf(n),u>=0?(this.lastItem=this.list[u],this.list[u].val=r,this):(this.lastItem={key:n,val:r},this.list.push(this.lastItem),this.size++,this))},l.prototype.delete=function(n){var r;if(this.lastItem&&this.isEqual(this.lastItem.key,n)&&(this.lastItem=void 0),r=this.indexOf(n),r>=0)return this.size--,this.list.splice(r,1)[0]},l.prototype.has=function(n){var r;return this.lastItem&&this.isEqual(this.lastItem.key,n)?!0:(r=this.indexOf(n),r>=0?(this.lastItem=this.list[r],!0):!1)},l.prototype.forEach=function(n,r){var u;for(u=0;u<this.size;u++)n.call(r||this,this.list[u].val,this.list[u].key,this)},l.prototype.indexOf=function(n){var r;for(r=0;r<this.size;r++)if(this.isEqual(this.list[r].key,n))return r;return-1},l.prototype.isEqual=function(n,r){return n===r||n!==n&&r!==r},i.exports=l},{}],3:[function(o,i,g){var l=o("map-or-similar");i.exports=function(a){var h=new l(!1),c=[];return function(y){var f=function(){var b=h,_,A,I=arguments.length-1,R=Array(I+1),C=!0,E;if((f.numArgs||f.numArgs===0)&&f.numArgs!==I+1)throw new Error("Memoizerific functions should always be called with the same number of arguments");for(E=0;E<I;E++){if(R[E]={cacheItem:b,arg:arguments[E]},b.has(arguments[E])){b=b.get(arguments[E]);continue}C=!1,_=new l(!1),b.set(arguments[E],_),b=_}return C&&(b.has(arguments[I])?A=b.get(arguments[I]):C=!1),C||(A=y.apply(null,arguments),b.set(arguments[I],A)),a>0&&(R[I]={cacheItem:b,arg:arguments[I]},C?n(c,R):c.push(R),c.length>a&&r(c.shift())),f.wasMemoized=C,f.numArgs=I+1,A};return f.limit=a,f.wasMemoized=!1,f.cache=h,f.lru=c,f}};function n(a,h){var c=a.length,y=h.length,f,b,_;for(b=0;b<c;b++){for(f=!0,_=0;_<y;_++)if(!u(a[b][_].arg,h[_].arg)){f=!1;break}if(f)break}a.push(a.splice(b,1)[0])}function r(a){var h=a.length,c=a[h-1],y,f;for(c.cacheItem.delete(c.arg),f=h-2;f>=0&&(c=a[f],y=c.cacheItem.get(c.arg),!y||!y.size);f--)c.cacheItem.delete(c.arg)}function u(a,h){return a===h||a!==a&&h!==h}},{"map-or-similar":1}]},{},[3])(3)})});d();m();p();d();m();p();d();m();p();d();m();p();var T=__REACT__,{Children:Oe,Component:Se,Fragment:w,Profiler:Ie,PureComponent:Ee,StrictMode:ke,Suspense:Ce,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:xe,cloneElement:Ae,createContext:Re,createElement:Be,createFactory:we,createRef:Le,forwardRef:Me,isValidElement:Pe,lazy:Ne,memo:L,startTransition:Ge,unstable_act:De,useCallback:K,useContext:ze,useDebugValue:qe,useDeferredValue:He,useEffect:Fe,useId:Ke,useImperativeHandle:Ye,useInsertionEffect:We,useLayoutEffect:Ue,useMemo:Y,useReducer:Ve,useRef:$e,useState:W,useSyncExternalStore:je,useTransition:Ze,version:Je}=__REACT__;d();m();p();var rt=__STORYBOOK_API__,{ActiveTabs:nt,Consumer:ot,ManagerContext:it,Provider:at,addons:M,combineParameters:st,controlOrMetaKey:lt,controlOrMetaSymbol:ut,eventMatchesShortcut:ct,eventToShortcut:ft,isMacLike:dt,isShortcutTaken:mt,keyToSymbol:pt,merge:ht,mockChannel:gt,optionOrAltSymbol:bt,shortcutMatchesShortcut:yt,shortcutToHumanString:_t,types:U,useAddonState:Tt,useArgTypes:vt,useArgs:Ot,useChannel:St,useGlobalTypes:It,useGlobals:P,useParameter:N,useSharedState:Et,useStoryPrepared:kt,useStorybookApi:Ct,useStorybookState:xt}=__STORYBOOK_API__;var H=le($());d();m();p();var Gt=__STORYBOOK_CLIENT_LOGGER__,{deprecate:Dt,logger:D,once:zt,pretty:qt}=__STORYBOOK_CLIENT_LOGGER__;d();m();p();var Wt=__STORYBOOK_COMPONENTS__,{A:Ut,ActionBar:Vt,AddonPanel:$t,Badge:jt,Bar:Zt,Blockquote:Jt,Button:Qt,ClipboardCode:Xt,Code:er,DL:tr,Div:rr,DocumentWrapper:nr,EmptyTabContent:or,ErrorFormatter:ir,FlexBar:ar,Form:sr,H1:lr,H2:ur,H3:cr,H4:fr,H5:dr,H6:mr,HR:pr,IconButton:z,IconButtonSkeleton:hr,Icons:q,Img:gr,LI:br,Link:yr,ListItem:_r,Loader:Tr,OL:vr,P:Or,Placeholder:Sr,Pre:Ir,ResetWrapper:Er,ScrollArea:kr,Separator:Cr,Spaced:xr,Span:Ar,StorybookIcon:Rr,StorybookLogo:Br,Symbols:wr,SyntaxHighlighter:Lr,TT:Mr,TabBar:Pr,TabButton:Nr,TabWrapper:Gr,Table:Dr,Tabs:zr,TabsState:qr,TooltipLinkList:j,TooltipMessage:Hr,TooltipNote:Fr,UL:Kr,WithTooltip:Z,WithTooltipPure:Yr,Zoom:Wr,codeCommon:Ur,components:Vr,createCopyToClipboardFunction:$r,getStoryHref:jr,icons:Zr,interleaveSeparators:Jr,nameSpaceClassNames:Qr,resetComponents:Xr,withReset:en}=__STORYBOOK_COMPONENTS__;d();m();p();var an=__STORYBOOK_THEMING__,{CacheProvider:sn,ClassNames:ln,Global:un,ThemeProvider:cn,background:fn,color:dn,convert:mn,create:pn,createCache:hn,createGlobal:gn,createReset:bn,css:yn,darken:_n,ensure:Tn,ignoreSsrWarning:vn,isPropValid:On,jsx:Sn,keyframes:In,lighten:En,styled:J,themes:kn,typography:Cn,useTheme:xn,withTheme:An}=__STORYBOOK_THEMING__;d();m();p();var Mn=(()=>{let e;return typeof window<"u"?e=window:typeof globalThis<"u"?e=globalThis:typeof window<"u"?e=window:typeof self<"u"?e=self:e={},e})();d();m();p();function Q(e){for(var t=[],s=1;s<arguments.length;s++)t[s-1]=arguments[s];var o=Array.from(typeof e=="string"?[e]:e);o[o.length-1]=o[o.length-1].replace(/\r?\n([\t ]*)$/,"");var i=o.reduce(function(n,r){var u=r.match(/\n([\t ]+|(?!\s).)/g);return u?n.concat(u.map(function(a){var h,c;return(c=(h=a.match(/[\t ]/g))===null||h===void 0?void 0:h.length)!==null&&c!==void 0?c:0})):n},[]);if(i.length){var g=new RegExp(`
[	 ]{`+Math.min.apply(Math,i)+"}","g");o=o.map(function(n){return n.replace(g,`
`)})}o[0]=o[0].replace(/^\r?\n/,"");var l=o[0];return t.forEach(function(n,r){var u=l.match(/(?:^|\n)( *)$/),a=u?u[1]:"",h=n;typeof n=="string"&&n.includes(`
`)&&(h=String(n).split(`
`).map(function(c,y){return y===0?c:""+a+c}).join(`
`)),l+=h+o[r+1]}),l}var X="storybook/background",k="backgrounds",ue=J.span(({background:e})=>({borderRadius:"1rem",display:"block",height:"1rem",width:"1rem",background:e}),({theme:e})=>({boxShadow:`${e.appBorderColor} 0 0 0 1px inset`})),ce=(e,t=[],s)=>{if(e==="transparent")return"transparent";if(t.find(i=>i.value===e))return e;let o=t.find(i=>i.name===s);if(o)return o.value;if(s){let i=t.map(g=>g.name).join(", ");D.warn(Q`
        Backgrounds Addon: could not find the default color "${s}".
        These are the available colors for your story based on your configuration:
        ${i}.
      `)}return"transparent"},ee=(0,H.default)(1e3)((e,t,s,o,i,g)=>({id:e||t,title:t,onClick:()=>{i({selected:s,name:t})},value:s,right:o?T.createElement(ue,{background:s}):void 0,active:g})),fe=(0,H.default)(10)((e,t,s)=>{let o=e.map(({name:i,value:g})=>ee(null,i,g,!0,s,g===t));return t!=="transparent"?[ee("reset","Clear background","transparent",null,s,!1),...o]:o}),de={default:null,disable:!0,values:[]},me=L(function(){let e=N(k,de),[t,s]=W(!1),[o,i]=P(),g=o[k]?.value,l=Y(()=>ce(g,e.values,e.default),[e,g]);Array.isArray(e)&&D.warn("Addon Backgrounds api has changed in Storybook 6.0. Please refer to the migration guide: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md");let n=K(r=>{i({[k]:{...o[k],value:r}})},[e,o,i]);return e.disable?null:T.createElement(w,null,T.createElement(Z,{placement:"top",closeOnOutsideClick:!0,tooltip:({onHide:r})=>T.createElement(j,{links:fe(e.values,l,({selected:u})=>{l!==u&&n(u),r()})}),onVisibleChange:s},T.createElement(z,{key:"background",title:"Change the background of the preview",active:l!=="transparent"||t},T.createElement(q,{icon:"photo"}))))}),pe=L(function(){let[e,t]=P(),{grid:s}=N(k,{grid:{disable:!1}});if(s?.disable)return null;let o=e[k]?.grid||!1;return T.createElement(z,{key:"background",active:o,title:"Apply a grid to the preview",onClick:()=>t({[k]:{...e[k],grid:!o}})},T.createElement(q,{icon:"grid"}))});M.register(X,()=>{M.add(X,{title:"Backgrounds",type:U.TOOL,match:({viewMode:e})=>!!(e&&e.match(/^(story|docs)$/)),render:()=>T.createElement(w,null,T.createElement(me,null),T.createElement(pe,null))})});})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }
