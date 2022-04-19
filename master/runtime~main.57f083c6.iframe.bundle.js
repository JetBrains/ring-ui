(()=>{"use strict";var deferred,leafPrototypes,getProto,inProgress,__webpack_modules__={},__webpack_module_cache__={};function __webpack_require__(moduleId){var cachedModule=__webpack_module_cache__[moduleId];if(void 0!==cachedModule)return cachedModule.exports;var module=__webpack_module_cache__[moduleId]={id:moduleId,loaded:!1,exports:{}};return __webpack_modules__[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}__webpack_require__.m=__webpack_modules__,deferred=[],__webpack_require__.O=(result,chunkIds,fn,priority)=>{if(!chunkIds){var notFulfilled=1/0;for(i=0;i<deferred.length;i++){chunkIds=deferred[i][0],fn=deferred[i][1],priority=deferred[i][2];for(var fulfilled=!0,j=0;j<chunkIds.length;j++)(!1&priority||notFulfilled>=priority)&&Object.keys(__webpack_require__.O).every((key=>__webpack_require__.O[key](chunkIds[j])))?chunkIds.splice(j--,1):(fulfilled=!1,priority<notFulfilled&&(notFulfilled=priority));if(fulfilled){deferred.splice(i--,1);var r=fn();void 0!==r&&(result=r)}}return result}priority=priority||0;for(var i=deferred.length;i>0&&deferred[i-1][2]>priority;i--)deferred[i]=deferred[i-1];deferred[i]=[chunkIds,fn,priority]},__webpack_require__.n=module=>{var getter=module&&module.__esModule?()=>module.default:()=>module;return __webpack_require__.d(getter,{a:getter}),getter},getProto=Object.getPrototypeOf?obj=>Object.getPrototypeOf(obj):obj=>obj.__proto__,__webpack_require__.t=function(value,mode){if(1&mode&&(value=this(value)),8&mode)return value;if("object"==typeof value&&value){if(4&mode&&value.__esModule)return value;if(16&mode&&"function"==typeof value.then)return value}var ns=Object.create(null);__webpack_require__.r(ns);var def={};leafPrototypes=leafPrototypes||[null,getProto({}),getProto([]),getProto(getProto)];for(var current=2&mode&&value;"object"==typeof current&&!~leafPrototypes.indexOf(current);current=getProto(current))Object.getOwnPropertyNames(current).forEach((key=>def[key]=()=>value[key]));return def.default=()=>value,__webpack_require__.d(ns,def),ns},__webpack_require__.d=(exports,definition)=>{for(var key in definition)__webpack_require__.o(definition,key)&&!__webpack_require__.o(exports,key)&&Object.defineProperty(exports,key,{enumerable:!0,get:definition[key]})},__webpack_require__.f={},__webpack_require__.e=chunkId=>Promise.all(Object.keys(__webpack_require__.f).reduce(((promises,key)=>(__webpack_require__.f[key](chunkId,promises),promises)),[])),__webpack_require__.u=chunkId=>(({17:"highlight-brainfuck",105:"highlight-julia",224:"highlight-vhdl",298:"highlight-haml",316:"highlight-python",367:"highlight-glsl",499:"highlight-clojure-repl",560:"highlight-tp",600:"highlight-ldif",695:"highlight-ada",857:"highlight-nsis",866:"highlight-twig",898:"highlight-tap",990:"highlight-ebnf",1112:"highlight-cpp",1188:"highlight-mathematica",1209:"highlight-scilab",1216:"highlight-ceylon",1291:"highlight-arcade",1302:"highlight-erlang-repl",1303:"highlight-step21",1423:"highlight-java",1495:"highlight-nix",1509:"highlight-moonscript",1513:"highlight-gauss",1534:"highlight-less",1606:"highlight-oxygene",1628:"highlight-makefile",1905:"highlight-livecodeserver",1923:"highlight-go",1926:"highlight-ini",2006:"highlight-django",2013:"highlight-dart",2228:"highlight-pf",2287:"highlight-llvm",2314:"highlight-rust",2438:"highlight-hy",2483:"highlight-routeros",2548:"highlight-subunit",2582:"highlight-mel",2828:"highlight-lua",2886:"highlight-css",2908:"highlight-vbnet",2951:"highlight-excel",3060:"highlight-monkey",3062:"highlight-coq",3101:"highlight-lisp",3129:"highlight-latex",3142:"highlight-applescript",3185:"highlight-axapta",3260:"highlight-prolog",3273:"highlight-matlab",3321:"highlight-powershell",3323:"highlight-c",3353:"highlight-lasso",3395:"highlight-properties",3434:"highlight-taggerscript",3478:"highlight-x86asm",3601:"highlight-stylus",3625:"highlight-ocaml",3657:"highlight-gams",3722:"highlight-q",3861:"highlight-ruleslanguage",3892:"highlight-dsconfig",3905:"highlight-actionscript",3944:"highlight-node-repl",3960:"highlight-diff",4052:"highlight-autohotkey",4068:"highlight-rsl",4069:"highlight-protobuf",4077:"highlight-c-like",4146:"highlight-objectivec",4217:"highlight-clojure",4284:"highlight-handlebars",4301:"highlight-inform7",4307:"highlight-plaintext",4390:"highlight-sas",4454:"highlight-nginx",4521:"highlight-golo",4625:"highlight-fix",4642:"highlight-dns",4656:"highlight-pgsql",4722:"highlight-vbscript-html",4739:"highlight-tcl",4760:"highlight-apache",4770:"highlight-parser3",4807:"highlight-bash",4817:"highlight-avrasm",4910:"highlight-mercury",4952:"highlight-asciidoc",4978:"highlight-php",4991:"highlight-processing",5065:"highlight-zephir",5067:"highlight-csp",5106:"highlight-crmsh",5120:"highlight-delphi",5142:"highlight-smali",5165:"highlight-rib",5207:"highlight-perl",5241:"highlight-scala",5291:"highlight-flix",5301:"highlight-xquery",5318:"highlight-gherkin",5336:"highlight-sqf",5361:"highlight-cmake",5373:"highlight-puppet",5434:"highlight-1c",5450:"highlight-d",5465:"highlight-vbscript",5477:"highlight-verilog",5572:"highlight-vim",5671:"highlight-leaf",5949:"highlight-http",6064:"highlight-haxe",6086:"highlight-purebasic",6140:"highlight-awk",6168:"highlight-jboss-cli",6294:"highlight-bnf",6434:"highlight-sql_more",6450:"highlight-sql",6473:"highlight-json",6559:"highlight-swift",6576:"highlight-scss",6589:"highlight-erb",6615:"highlight-clean",6633:"highlight-abnf",6679:"highlight-gml",6836:"highlight-gcode",6881:"highlight-aspectj",7196:"highlight-cos",7262:"highlight-php-template",7372:"highlight-erlang",7399:"highlight-vala",7429:"highlight-haskell",7446:"highlight-markdown",7449:"highlight-kotlin",7483:"highlight-arduino",7500:"highlight-mipsasm",7522:"highlight-r",7578:"highlight-reasonml",7655:"highlight-csharp",7665:"highlight-dts",7703:"highlight-isbl",7723:"highlight-stan",7769:"highlight-fsharp",7812:"highlight-coffeescript",8011:"highlight-irpf90",8015:"highlight-ruby",8039:"highlight-typescript",8104:"highlight-pony",8121:"highlight-openscad",8158:"highlight-dust",8186:"highlight-python-repl",8199:"highlight-sml",8236:"highlight-mizar",8257:"highlight-lsl",8262:"highlight-stata",8316:"highlight-smalltalk",8319:"highlight-yaml",8346:"highlight-basic",8390:"highlight-scheme",8430:"highlight-mojolicious",8442:"highlight-autoit",8478:"highlight-armasm",8644:"highlight-dockerfile",8670:"highlight-groovy",8721:"highlight-maxima",8741:"highlight-elixir",8867:"highlight-xl",8958:"highlight-thrift",8975:"highlight-qml",9037:"highlight-nim",9049:"highlight-cal",9101:"highlight-accesslog",9152:"highlight-angelscript",9160:"highlight-fortran",9192:"highlight-n1ql",9201:"highlight-capnproto",9308:"highlight-dos",9471:"highlight-livescript",9552:"highlight-htmlbars",9677:"highlight-hsp",9717:"highlight-crystal",9762:"highlight-shell",9832:"highlight-julia-repl",9848:"highlight-elm",9878:"highlight-roboconf",9900:"highlight-gradle",9940:"highlight-profile"}[chunkId]||chunkId)+"."+{17:"33acb171",27:"1b1afa16",105:"f015beeb",224:"a8123b02",298:"241bc6e4",316:"0e0310b4",367:"d803d485",407:"a81cc03b",499:"8b72f3a5",560:"c8acb666",600:"aadc99eb",695:"497c4c1f",857:"81c8ecc4",866:"79c4beb3",898:"32216ffe",990:"5e3e1482",1112:"b59c5a78",1177:"4dc57245",1188:"f5169e95",1209:"217d6825",1216:"3bf7f56b",1291:"784c0f37",1302:"d9aa4c1f",1303:"921ae12a",1423:"369c858e",1495:"b4232b49",1509:"152515cf",1513:"5d9767b2",1534:"afedaf1d",1606:"de030ccd",1628:"590482e1",1905:"6497f2bf",1923:"df35e953",1926:"dea33457",2006:"f516b8aa",2013:"ea0d7f85",2228:"ba18d49f",2287:"f20f2f23",2314:"b9ee3629",2438:"063d0c85",2483:"6a60a08b",2548:"40caeffd",2582:"84231d82",2802:"e83414e3",2828:"a5b3e697",2886:"5ebe6400",2898:"9845b07e",2908:"91bc9a41",2951:"78f3cf1a",3060:"93bb2e4f",3062:"b1ea83b9",3101:"c57d8235",3129:"9c71601a",3142:"b136d3c5",3185:"4c6afe9e",3260:"ef2af1bf",3273:"84b71c2d",3321:"133b56b1",3323:"72799031",3340:"b332df9a",3353:"27f8462a",3395:"c243c5c8",3434:"7685a68d",3478:"2aeacb4d",3601:"6bdfbead",3625:"df4240f0",3657:"255b68dd",3722:"981acf64",3861:"5decd352",3892:"985ad994",3905:"1fd0c588",3944:"eb8f0ae3",3960:"321b4cb7",4052:"ceae2639",4068:"289edcc7",4069:"e23c50d6",4077:"3b8e8fa4",4146:"46ee4a42",4217:"aaed6baa",4284:"4d950eea",4301:"2f97c8d0",4307:"35daa874",4390:"5503f28a",4454:"d6c54b79",4521:"720ba91e",4625:"87e48e05",4642:"22b0f001",4656:"138c335a",4722:"ed132e5d",4739:"20d9c75a",4760:"273a5a24",4770:"ab9193b1",4807:"a9a72dc2",4817:"c01971d0",4910:"e4434e8e",4952:"3f178cee",4978:"a3b296a0",4991:"36790ccf",5065:"0d176a21",5067:"6e6b9f85",5106:"ab94bfaf",5120:"56e62bbe",5142:"a9d02dad",5165:"72448962",5207:"ffe67203",5241:"6ee1e27b",5291:"f2a310c8",5301:"355348e8",5318:"eb34d39d",5336:"ac59a406",5361:"985adc4d",5373:"7309a899",5434:"2724f931",5450:"230b3d61",5465:"7f69ca79",5477:"38f60381",5572:"5fb69af9",5671:"28d29765",5949:"78b6cf48",6064:"77b4bb7c",6086:"3e083869",6140:"f251f8ce",6168:"12b47f46",6294:"fcf5957b",6434:"67c7096f",6450:"2acc05d8",6473:"2817e34a",6559:"6f10bfc4",6576:"ffe88af7",6589:"f9d61c35",6615:"437461ab",6633:"f52f53f3",6679:"205bac3b",6701:"6b0b88be",6836:"43eabc89",6881:"d445b49e",7196:"923bdcb8",7262:"9f300d91",7372:"40f811b8",7399:"8127c48c",7429:"19fab57c",7446:"9c1c255b",7449:"06ae4ffd",7483:"419bf2c2",7500:"995640d3",7522:"28c2a35a",7578:"fb4e2a20",7655:"6a08d43e",7665:"f7104264",7703:"4ca2e684",7723:"5486fcaa",7769:"e4ffbcc9",7812:"3c13a2f0",8011:"f70f55a5",8015:"a9dbfc96",8039:"5078fe69",8104:"cfe2f4d0",8121:"23892b8b",8158:"623a525a",8186:"4a255a1f",8199:"16be7d34",8236:"d5a9fc4c",8257:"45bde4f0",8262:"ba50c2ec",8316:"6a4d7ce7",8319:"68df4e8f",8346:"485d2779",8390:"def4034c",8430:"6634c896",8442:"028a1954",8478:"a4f4aecb",8644:"f399adc3",8670:"96aadff7",8690:"3ed723d7",8721:"420a189c",8741:"0e06be3c",8867:"0dab90c9",8958:"e02e0bf5",8975:"d29c30d2",9037:"04a5787c",9042:"2983b89e",9049:"ae3b5c80",9101:"463de7b5",9115:"89080618",9152:"3d7a808f",9160:"48c67315",9192:"2f5ad2d2",9201:"bda6df45",9308:"fe2345eb",9471:"5e558e38",9552:"48ffd8bd",9677:"5e15e8ea",9717:"9bfeb33f",9762:"85fb5adb",9832:"a70b20a5",9848:"1bde1d3b",9878:"d609cff9",9900:"2ebb1a9f",9940:"9ca94526"}[chunkId]+".iframe.bundle.js"),__webpack_require__.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),__webpack_require__.hmd=module=>((module=Object.create(module)).children||(module.children=[]),Object.defineProperty(module,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+module.id)}}),module),__webpack_require__.o=(obj,prop)=>Object.prototype.hasOwnProperty.call(obj,prop),inProgress={},__webpack_require__.l=(url,done,key,chunkId)=>{if(inProgress[url])inProgress[url].push(done);else{var script,needAttach;if(void 0!==key)for(var scripts=document.getElementsByTagName("script"),i=0;i<scripts.length;i++){var s=scripts[i];if(s.getAttribute("src")==url||s.getAttribute("data-webpack")=="@jetbrains/ring-ui:"+key){script=s;break}}script||(needAttach=!0,(script=document.createElement("script")).charset="utf-8",script.timeout=120,__webpack_require__.nc&&script.setAttribute("nonce",__webpack_require__.nc),script.setAttribute("data-webpack","@jetbrains/ring-ui:"+key),script.src=url),inProgress[url]=[done];var onScriptComplete=(prev,event)=>{script.onerror=script.onload=null,clearTimeout(timeout);var doneFns=inProgress[url];if(delete inProgress[url],script.parentNode&&script.parentNode.removeChild(script),doneFns&&doneFns.forEach((fn=>fn(event))),prev)return prev(event)},timeout=setTimeout(onScriptComplete.bind(null,void 0,{type:"timeout",target:script}),12e4);script.onerror=onScriptComplete.bind(null,script.onerror),script.onload=onScriptComplete.bind(null,script.onload),needAttach&&document.head.appendChild(script)}},__webpack_require__.r=exports=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(exports,"__esModule",{value:!0})},__webpack_require__.nmd=module=>(module.paths=[],module.children||(module.children=[]),module),__webpack_require__.p="",(()=>{__webpack_require__.b=document.baseURI||self.location.href;var installedChunks={6552:0};__webpack_require__.f.j=(chunkId,promises)=>{var installedChunkData=__webpack_require__.o(installedChunks,chunkId)?installedChunks[chunkId]:void 0;if(0!==installedChunkData)if(installedChunkData)promises.push(installedChunkData[2]);else if(6552!=chunkId){var promise=new Promise(((resolve,reject)=>installedChunkData=installedChunks[chunkId]=[resolve,reject]));promises.push(installedChunkData[2]=promise);var url=__webpack_require__.p+__webpack_require__.u(chunkId),error=new Error;__webpack_require__.l(url,(event=>{if(__webpack_require__.o(installedChunks,chunkId)&&(0!==(installedChunkData=installedChunks[chunkId])&&(installedChunks[chunkId]=void 0),installedChunkData)){var errorType=event&&("load"===event.type?"missing":event.type),realSrc=event&&event.target&&event.target.src;error.message="Loading chunk "+chunkId+" failed.\n("+errorType+": "+realSrc+")",error.name="ChunkLoadError",error.type=errorType,error.request=realSrc,installedChunkData[1](error)}}),"chunk-"+chunkId,chunkId)}else installedChunks[chunkId]=0},__webpack_require__.O.j=chunkId=>0===installedChunks[chunkId];var webpackJsonpCallback=(parentChunkLoadingFunction,data)=>{var moduleId,chunkId,chunkIds=data[0],moreModules=data[1],runtime=data[2],i=0;if(chunkIds.some((id=>0!==installedChunks[id]))){for(moduleId in moreModules)__webpack_require__.o(moreModules,moduleId)&&(__webpack_require__.m[moduleId]=moreModules[moduleId]);if(runtime)var result=runtime(__webpack_require__)}for(parentChunkLoadingFunction&&parentChunkLoadingFunction(data);i<chunkIds.length;i++)chunkId=chunkIds[i],__webpack_require__.o(installedChunks,chunkId)&&installedChunks[chunkId]&&installedChunks[chunkId][0](),installedChunks[chunkId]=0;return __webpack_require__.O(result)},chunkLoadingGlobal=self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[];chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null,0)),chunkLoadingGlobal.push=webpackJsonpCallback.bind(null,chunkLoadingGlobal.push.bind(chunkLoadingGlobal))})()})();