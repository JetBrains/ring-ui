(()=>{"use strict";var deferred,leafPrototypes,getProto,inProgress,__webpack_modules__={},__webpack_module_cache__={};function __webpack_require__(moduleId){var cachedModule=__webpack_module_cache__[moduleId];if(void 0!==cachedModule)return cachedModule.exports;var module=__webpack_module_cache__[moduleId]={id:moduleId,loaded:!1,exports:{}};return __webpack_modules__[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}__webpack_require__.m=__webpack_modules__,deferred=[],__webpack_require__.O=(result,chunkIds,fn,priority)=>{if(!chunkIds){var notFulfilled=1/0;for(i=0;i<deferred.length;i++){for(var[chunkIds,fn,priority]=deferred[i],fulfilled=!0,j=0;j<chunkIds.length;j++)(!1&priority||notFulfilled>=priority)&&Object.keys(__webpack_require__.O).every((key=>__webpack_require__.O[key](chunkIds[j])))?chunkIds.splice(j--,1):(fulfilled=!1,priority<notFulfilled&&(notFulfilled=priority));if(fulfilled){deferred.splice(i--,1);var r=fn();void 0!==r&&(result=r)}}return result}priority=priority||0;for(var i=deferred.length;i>0&&deferred[i-1][2]>priority;i--)deferred[i]=deferred[i-1];deferred[i]=[chunkIds,fn,priority]},__webpack_require__.n=module=>{var getter=module&&module.__esModule?()=>module.default:()=>module;return __webpack_require__.d(getter,{a:getter}),getter},getProto=Object.getPrototypeOf?obj=>Object.getPrototypeOf(obj):obj=>obj.__proto__,__webpack_require__.t=function(value,mode){if(1&mode&&(value=this(value)),8&mode)return value;if("object"==typeof value&&value){if(4&mode&&value.__esModule)return value;if(16&mode&&"function"==typeof value.then)return value}var ns=Object.create(null);__webpack_require__.r(ns);var def={};leafPrototypes=leafPrototypes||[null,getProto({}),getProto([]),getProto(getProto)];for(var current=2&mode&&value;"object"==typeof current&&!~leafPrototypes.indexOf(current);current=getProto(current))Object.getOwnPropertyNames(current).forEach((key=>def[key]=()=>value[key]));return def.default=()=>value,__webpack_require__.d(ns,def),ns},__webpack_require__.d=(exports,definition)=>{for(var key in definition)__webpack_require__.o(definition,key)&&!__webpack_require__.o(exports,key)&&Object.defineProperty(exports,key,{enumerable:!0,get:definition[key]})},__webpack_require__.f={},__webpack_require__.e=chunkId=>Promise.all(Object.keys(__webpack_require__.f).reduce(((promises,key)=>(__webpack_require__.f[key](chunkId,promises),promises)),[])),__webpack_require__.u=chunkId=>(({17:"highlight-brainfuck",105:"highlight-julia",224:"highlight-vhdl",298:"highlight-haml",316:"highlight-python",367:"highlight-glsl",499:"highlight-clojure-repl",560:"highlight-tp",600:"highlight-ldif",695:"highlight-ada",857:"highlight-nsis",866:"highlight-twig",898:"highlight-tap",990:"highlight-ebnf",1112:"highlight-cpp",1188:"highlight-mathematica",1209:"highlight-scilab",1216:"highlight-ceylon",1291:"highlight-arcade",1302:"highlight-erlang-repl",1303:"highlight-step21",1423:"highlight-java",1495:"highlight-nix",1509:"highlight-moonscript",1513:"highlight-gauss",1534:"highlight-less",1606:"highlight-oxygene",1628:"highlight-makefile",1905:"highlight-livecodeserver",1923:"highlight-go",1926:"highlight-ini",2006:"highlight-django",2013:"highlight-dart",2228:"highlight-pf",2287:"highlight-llvm",2314:"highlight-rust",2438:"highlight-hy",2483:"highlight-routeros",2548:"highlight-subunit",2582:"highlight-mel",2828:"highlight-lua",2886:"highlight-css",2908:"highlight-vbnet",2951:"highlight-excel",3060:"highlight-monkey",3062:"highlight-coq",3101:"highlight-lisp",3129:"highlight-latex",3142:"highlight-applescript",3185:"highlight-axapta",3260:"highlight-prolog",3273:"highlight-matlab",3321:"highlight-powershell",3323:"highlight-c",3353:"highlight-lasso",3395:"highlight-properties",3434:"highlight-taggerscript",3478:"highlight-x86asm",3601:"highlight-stylus",3625:"highlight-ocaml",3657:"highlight-gams",3722:"highlight-q",3861:"highlight-ruleslanguage",3892:"highlight-dsconfig",3905:"highlight-actionscript",3944:"highlight-node-repl",3960:"highlight-diff",4052:"highlight-autohotkey",4068:"highlight-rsl",4069:"highlight-protobuf",4077:"highlight-c-like",4146:"highlight-objectivec",4217:"highlight-clojure",4284:"highlight-handlebars",4301:"highlight-inform7",4307:"highlight-plaintext",4390:"highlight-sas",4454:"highlight-nginx",4521:"highlight-golo",4625:"highlight-fix",4642:"highlight-dns",4656:"highlight-pgsql",4722:"highlight-vbscript-html",4739:"highlight-tcl",4760:"highlight-apache",4770:"highlight-parser3",4807:"highlight-bash",4817:"highlight-avrasm",4910:"highlight-mercury",4952:"highlight-asciidoc",4978:"highlight-php",4991:"highlight-processing",5065:"highlight-zephir",5067:"highlight-csp",5106:"highlight-crmsh",5120:"highlight-delphi",5142:"highlight-smali",5165:"highlight-rib",5207:"highlight-perl",5241:"highlight-scala",5291:"highlight-flix",5301:"highlight-xquery",5318:"highlight-gherkin",5336:"highlight-sqf",5361:"highlight-cmake",5373:"highlight-puppet",5434:"highlight-1c",5450:"highlight-d",5465:"highlight-vbscript",5477:"highlight-verilog",5572:"highlight-vim",5671:"highlight-leaf",5949:"highlight-http",6064:"highlight-haxe",6086:"highlight-purebasic",6140:"highlight-awk",6168:"highlight-jboss-cli",6294:"highlight-bnf",6434:"highlight-sql_more",6450:"highlight-sql",6473:"highlight-json",6559:"highlight-swift",6576:"highlight-scss",6589:"highlight-erb",6615:"highlight-clean",6633:"highlight-abnf",6679:"highlight-gml",6836:"highlight-gcode",6881:"highlight-aspectj",7196:"highlight-cos",7262:"highlight-php-template",7372:"highlight-erlang",7399:"highlight-vala",7429:"highlight-haskell",7446:"highlight-markdown",7449:"highlight-kotlin",7483:"highlight-arduino",7500:"highlight-mipsasm",7522:"highlight-r",7578:"highlight-reasonml",7655:"highlight-csharp",7665:"highlight-dts",7703:"highlight-isbl",7723:"highlight-stan",7769:"highlight-fsharp",7812:"highlight-coffeescript",8011:"highlight-irpf90",8015:"highlight-ruby",8039:"highlight-typescript",8104:"highlight-pony",8121:"highlight-openscad",8158:"highlight-dust",8186:"highlight-python-repl",8199:"highlight-sml",8236:"highlight-mizar",8257:"highlight-lsl",8262:"highlight-stata",8316:"highlight-smalltalk",8319:"highlight-yaml",8346:"highlight-basic",8390:"highlight-scheme",8430:"highlight-mojolicious",8442:"highlight-autoit",8478:"highlight-armasm",8644:"highlight-dockerfile",8670:"highlight-groovy",8721:"highlight-maxima",8741:"highlight-elixir",8867:"highlight-xl",8958:"highlight-thrift",8975:"highlight-qml",9037:"highlight-nim",9049:"highlight-cal",9101:"highlight-accesslog",9152:"highlight-angelscript",9160:"highlight-fortran",9192:"highlight-n1ql",9201:"highlight-capnproto",9308:"highlight-dos",9471:"highlight-livescript",9552:"highlight-htmlbars",9677:"highlight-hsp",9717:"highlight-crystal",9762:"highlight-shell",9832:"highlight-julia-repl",9848:"highlight-elm",9878:"highlight-roboconf",9900:"highlight-gradle",9940:"highlight-profile"}[chunkId]||chunkId)+"."+{17:"337788d9",105:"5679a8d4",224:"11cd8d75",298:"4b332be0",316:"e80e4a16",343:"9d23c0d0",367:"2c36219f",499:"a5b5b9da",560:"770850e8",600:"35cfc24d",695:"fe5ff912",857:"b8fd6111",866:"20608eae",898:"7f814f85",990:"0e509d8d",1112:"75c83e1f",1188:"e521ca4e",1209:"9ac85419",1216:"3bbb5767",1291:"7935e186",1302:"b3f211a0",1303:"73059e8f",1423:"5afd0381",1495:"c29e013e",1509:"b2c8ccad",1513:"f665c4c2",1534:"0e583dd6",1594:"a5993c6c",1606:"6a34eb0d",1628:"e26b0cfe",1905:"7b1da821",1923:"8af85eee",1926:"5bf5c11d",2006:"7393eb49",2013:"d67ab15b",2228:"746ba18e",2287:"8a6c10fd",2314:"a7b76ec9",2438:"e0fbb6f7",2483:"93f7c5c5",2548:"7a92bbb4",2582:"e042d8f8",2828:"78856273",2886:"4e57e6f1",2908:"da5df98e",2951:"91520a3f",2962:"80f9de27",3060:"15724414",3062:"d49bd24a",3101:"0c175daa",3129:"ddbdd604",3142:"158cf167",3185:"04a495b9",3260:"17afbb6d",3273:"169a5399",3321:"1dc6a06a",3323:"427931c7",3353:"cf588d0b",3395:"c9f81584",3434:"a7ee8b8c",3478:"68cc0f66",3601:"9b9e60d9",3625:"1c2d4cc6",3657:"fd2be2f3",3722:"999fd906",3861:"fcbba081",3892:"9702c41f",3905:"26318a38",3944:"a514557d",3960:"376edd60",4052:"ce7e414a",4068:"d58445cd",4069:"b12dc5ef",4077:"ddf7fbff",4146:"02fa3d63",4217:"d3329eb8",4284:"2a9a2351",4301:"531c0022",4307:"1b8a3af9",4390:"e2260a5e",4454:"3c5574b2",4521:"0e8be69c",4625:"ac42ef90",4642:"9fcbd486",4651:"6e60ff7b",4656:"cdd7b2c2",4722:"d1aa2abb",4739:"59f49887",4760:"bf956c06",4770:"f6f8600f",4807:"10975403",4817:"2d974f9b",4910:"b9e38c3e",4952:"b45eadea",4978:"6be20b7c",4991:"190cb0ca",5065:"78a64edd",5067:"c6e9d73b",5106:"b1c68ea8",5120:"673e2eb7",5142:"7e5e640b",5165:"f7b174bb",5207:"acb15afd",5241:"0c4ba91f",5291:"59b08085",5301:"bf375f0a",5318:"5e83f20e",5336:"d4f69cd4",5361:"8d304131",5373:"f73727d2",5434:"f5d9f779",5450:"b3e7d54b",5465:"d89568bd",5477:"ff435b7f",5572:"6de1e2d1",5671:"768ea327",5949:"ceb5df26",6064:"0a28cd3a",6086:"235e04c5",6140:"d5e789c2",6168:"838aa8f1",6294:"9587c8cb",6434:"f9015ac4",6450:"87434127",6473:"13a83cc1",6559:"0243f309",6576:"c9441f46",6589:"b1154ac7",6615:"cf96148b",6633:"93f8d795",6679:"2007eb74",6836:"3a6e3a20",6881:"6db0a254",7196:"55ddda12",7247:"d604d27e",7262:"df2cbf71",7286:"0a023c44",7372:"73a858d9",7399:"fc50fb16",7429:"a4ce7b1f",7446:"a87c7fb7",7449:"f12c6935",7483:"44718f78",7500:"b00c6b3a",7522:"a2abf656",7578:"600ea4b5",7655:"27469807",7665:"da2fa2e2",7703:"c8ded8ef",7723:"7ef2f146",7769:"d7383baf",7812:"c1ad3f6d",8011:"2f2ef80a",8015:"b9bcc8f4",8039:"3e71d58b",8104:"86cd6c0c",8121:"453dbb98",8158:"6ef1df54",8186:"fb386eb5",8199:"988be97e",8236:"4d8735f8",8257:"0845d602",8262:"43f82a86",8316:"164ca439",8319:"8c6a756c",8346:"f099dde1",8390:"3eca58c2",8430:"d2b51734",8442:"3d9661c6",8478:"a0f1fa50",8644:"e6c9851f",8670:"5b5d5aeb",8690:"7bfac7ad",8721:"10429921",8741:"7872fd2a",8867:"22b02971",8958:"b22ba805",8975:"86710243",9037:"7c3d04b1",9049:"debaff1b",9101:"02729e60",9115:"968297fc",9152:"64619020",9160:"48febe69",9192:"c12ca61f",9201:"e4381c23",9308:"c734a390",9424:"468e84cd",9471:"b34338e1",9552:"a79d1476",9677:"0a706372",9717:"3c29f97a",9762:"0400ccd5",9832:"b7bd1d2b",9848:"3b59c5c0",9878:"10db1ca7",9900:"fcb58f56",9940:"fa997b88"}[chunkId]+".iframe.bundle.js"),__webpack_require__.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),__webpack_require__.hmd=module=>((module=Object.create(module)).children||(module.children=[]),Object.defineProperty(module,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+module.id)}}),module),__webpack_require__.o=(obj,prop)=>Object.prototype.hasOwnProperty.call(obj,prop),inProgress={},__webpack_require__.l=(url,done,key,chunkId)=>{if(inProgress[url])inProgress[url].push(done);else{var script,needAttach;if(void 0!==key)for(var scripts=document.getElementsByTagName("script"),i=0;i<scripts.length;i++){var s=scripts[i];if(s.getAttribute("src")==url||s.getAttribute("data-webpack")=="@jetbrains/ring-ui:"+key){script=s;break}}script||(needAttach=!0,(script=document.createElement("script")).charset="utf-8",script.timeout=120,__webpack_require__.nc&&script.setAttribute("nonce",__webpack_require__.nc),script.setAttribute("data-webpack","@jetbrains/ring-ui:"+key),script.src=url),inProgress[url]=[done];var onScriptComplete=(prev,event)=>{script.onerror=script.onload=null,clearTimeout(timeout);var doneFns=inProgress[url];if(delete inProgress[url],script.parentNode&&script.parentNode.removeChild(script),doneFns&&doneFns.forEach((fn=>fn(event))),prev)return prev(event)},timeout=setTimeout(onScriptComplete.bind(null,void 0,{type:"timeout",target:script}),12e4);script.onerror=onScriptComplete.bind(null,script.onerror),script.onload=onScriptComplete.bind(null,script.onload),needAttach&&document.head.appendChild(script)}},__webpack_require__.r=exports=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(exports,"__esModule",{value:!0})},__webpack_require__.nmd=module=>(module.paths=[],module.children||(module.children=[]),module),__webpack_require__.p="",(()=>{__webpack_require__.b=document.baseURI||self.location.href;var installedChunks={6552:0};__webpack_require__.f.j=(chunkId,promises)=>{var installedChunkData=__webpack_require__.o(installedChunks,chunkId)?installedChunks[chunkId]:void 0;if(0!==installedChunkData)if(installedChunkData)promises.push(installedChunkData[2]);else if(6552!=chunkId){var promise=new Promise(((resolve,reject)=>installedChunkData=installedChunks[chunkId]=[resolve,reject]));promises.push(installedChunkData[2]=promise);var url=__webpack_require__.p+__webpack_require__.u(chunkId),error=new Error;__webpack_require__.l(url,(event=>{if(__webpack_require__.o(installedChunks,chunkId)&&(0!==(installedChunkData=installedChunks[chunkId])&&(installedChunks[chunkId]=void 0),installedChunkData)){var errorType=event&&("load"===event.type?"missing":event.type),realSrc=event&&event.target&&event.target.src;error.message="Loading chunk "+chunkId+" failed.\n("+errorType+": "+realSrc+")",error.name="ChunkLoadError",error.type=errorType,error.request=realSrc,installedChunkData[1](error)}}),"chunk-"+chunkId,chunkId)}else installedChunks[chunkId]=0},__webpack_require__.O.j=chunkId=>0===installedChunks[chunkId];var webpackJsonpCallback=(parentChunkLoadingFunction,data)=>{var moduleId,chunkId,[chunkIds,moreModules,runtime]=data,i=0;if(chunkIds.some((id=>0!==installedChunks[id]))){for(moduleId in moreModules)__webpack_require__.o(moreModules,moduleId)&&(__webpack_require__.m[moduleId]=moreModules[moduleId]);if(runtime)var result=runtime(__webpack_require__)}for(parentChunkLoadingFunction&&parentChunkLoadingFunction(data);i<chunkIds.length;i++)chunkId=chunkIds[i],__webpack_require__.o(installedChunks,chunkId)&&installedChunks[chunkId]&&installedChunks[chunkId][0](),installedChunks[chunkId]=0;return __webpack_require__.O(result)},chunkLoadingGlobal=globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[];chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null,0)),chunkLoadingGlobal.push=webpackJsonpCallback.bind(null,chunkLoadingGlobal.push.bind(chunkLoadingGlobal))})(),__webpack_require__.nc=void 0})();