(()=>{"use strict";var deferred,leafPrototypes,getProto,inProgress,__webpack_modules__={},__webpack_module_cache__={};function __webpack_require__(moduleId){var cachedModule=__webpack_module_cache__[moduleId];if(void 0!==cachedModule)return cachedModule.exports;var module=__webpack_module_cache__[moduleId]={id:moduleId,loaded:!1,exports:{}};return __webpack_modules__[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}__webpack_require__.m=__webpack_modules__,deferred=[],__webpack_require__.O=(result,chunkIds,fn,priority)=>{if(!chunkIds){var notFulfilled=1/0;for(i=0;i<deferred.length;i++){chunkIds=deferred[i][0],fn=deferred[i][1],priority=deferred[i][2];for(var fulfilled=!0,j=0;j<chunkIds.length;j++)(!1&priority||notFulfilled>=priority)&&Object.keys(__webpack_require__.O).every((key=>__webpack_require__.O[key](chunkIds[j])))?chunkIds.splice(j--,1):(fulfilled=!1,priority<notFulfilled&&(notFulfilled=priority));if(fulfilled){deferred.splice(i--,1);var r=fn();void 0!==r&&(result=r)}}return result}priority=priority||0;for(var i=deferred.length;i>0&&deferred[i-1][2]>priority;i--)deferred[i]=deferred[i-1];deferred[i]=[chunkIds,fn,priority]},__webpack_require__.n=module=>{var getter=module&&module.__esModule?()=>module.default:()=>module;return __webpack_require__.d(getter,{a:getter}),getter},getProto=Object.getPrototypeOf?obj=>Object.getPrototypeOf(obj):obj=>obj.__proto__,__webpack_require__.t=function(value,mode){if(1&mode&&(value=this(value)),8&mode)return value;if("object"==typeof value&&value){if(4&mode&&value.__esModule)return value;if(16&mode&&"function"==typeof value.then)return value}var ns=Object.create(null);__webpack_require__.r(ns);var def={};leafPrototypes=leafPrototypes||[null,getProto({}),getProto([]),getProto(getProto)];for(var current=2&mode&&value;"object"==typeof current&&!~leafPrototypes.indexOf(current);current=getProto(current))Object.getOwnPropertyNames(current).forEach((key=>def[key]=()=>value[key]));return def.default=()=>value,__webpack_require__.d(ns,def),ns},__webpack_require__.d=(exports,definition)=>{for(var key in definition)__webpack_require__.o(definition,key)&&!__webpack_require__.o(exports,key)&&Object.defineProperty(exports,key,{enumerable:!0,get:definition[key]})},__webpack_require__.f={},__webpack_require__.e=chunkId=>Promise.all(Object.keys(__webpack_require__.f).reduce(((promises,key)=>(__webpack_require__.f[key](chunkId,promises),promises)),[])),__webpack_require__.u=chunkId=>(({89:"highlight-sas",127:"highlight-processing",174:"collapse-collapse-stories",182:"error-bubble-error-bubble-stories",192:"popup-menu-popup-menu-stories",250:"highlight-ada",276:"highlight-go",293:"highlight-julia-repl",302:"auth-dialog-auth-dialog-stories",342:"group-group-stories",358:"highlight-stan",410:"caret-caret-stories",450:"highlight-clojure",462:"highlight-jboss-cli",510:"highlight-cal",515:"highlight-applescript",529:"highlight-reasonml",637:"highlight-mojolicious",714:"highlight-livecodeserver",762:"panel-panel-stories",778:"highlight-n1ql",826:"highlight-elm",827:"highlight-protobuf",830:"loader-screen-loader-screen-stories",833:"highlight-coq",875:"tags-input-tag-input-stories",908:"highlight-node-repl",960:"highlight-vhdl",982:"error-message-error-message-stories",990:"highlight-1c",1001:"highlight-xml",1068:"highlight-r",1074:"alert-service-alert-service-stories",1079:"highlight-q",1110:"loader-loader-stories",1173:"highlight-armasm",1175:"highlight-elixir",1192:"highlight-ini",1251:"highlight-ldif",1258:"highlight-arcade",1367:"highlight-axapta",1382:"highlight-irpf90",1443:"highlight-tcl",1446:"tab-trap-tab-trap-stories",1517:"highlight-awk",1530:"heading-heading-stories",1570:"pager-pager-stories",1609:"global-dom-stories",1647:"highlight-crmsh",1685:"highlight-less",1703:"highlight-yaml",1812:"auth-auth-stories",1863:"highlight-diff",1909:"highlight-ruleslanguage",1940:"highlight-dockerfile",1993:"highlight-perl",1998:"code-code-stories",2068:"highlight-vala",2094:"highlight-scss",2102:"highlight-haxe",2234:"input-input-stories",2262:"text-text-stories",2284:"highlight-aspectj",2358:"highlight-subunit",2370:"highlight-java",2417:"highlight-markdown",2446:"scrollable-section-scrollable-section-stories",2479:"highlight-dsconfig",2495:"highlight-flix",2588:"highlight-lasso",2601:"highlight-monkey",2643:"highlight-cos",2680:"highlight-roboconf",2718:"date-picker-date-picker-stories",2730:"highlight-gams",2774:"highlight-makefile",2793:"highlight-php-template",2809:"highlight-ocaml",2888:"highlight-mel",2890:"breadcrumbs-breadcrumbs-stories",2906:"highlight-arduino",2934:"editable-heading-editable-heading-stories",2954:"dropdown-menu-dropdown-menu-stories",2974:"popup-popup-stories",3019:"highlight-gradle",3020:"highlight-angelscript",3268:"highlight-apache",3277:"highlight-gauss",3284:"highlight-sqf",3291:"highlight-ebnf",3358:"old-browsers-message-old-browsers-message-stories",3366:"analytics-analytics-stories",3400:"highlight-json",3526:"island-island-stories",3560:"highlight-verilog",3632:"highlight-stylus",3686:"highlight-gcode",3697:"highlight-dart",3734:"highlight-php",3750:"highlight-nim",3777:"highlight-properties",3883:"highlight-maxima",3885:"highlight-kotlin",3895:"highlight-abnf",3902:"tag-tag-stories",3926:"highlight-nginx",3948:"highlight-pf",3950:"highlight-xl",3986:"highlight-sml",4014:"avatar-avatar-stories",4026:"highlight-ruby",4138:"highlight-pony",4139:"highlight-swift",4181:"welcome-stories",4200:"highlight-python",4215:"highlight-golo",4258:"dropdown-dropdown-stories",4320:"i18n-i18n-stories",4352:"input-size-input-size-stories",4370:"header-header-stories",4382:"highlight-python-repl",4396:"highlight-bash",4403:"highlight-hy",4436:"highlight-fsharp",4504:"form-form-stories",4508:"highlight-avrasm",4588:"highlight-qml",4684:"highlight-csp",4695:"highlight-css",4728:"select-select-stories",4746:"tooltip-tooltip-stories",4778:"highlight-scilab",4854:"footer-footer-stories",4864:"highlight-crystal",4915:"highlight-erb",4974:"highlight-sql_more",5102:"highlight-accesslog",5106:"loader-inline-loader-inline-stories",5118:"button-set-button-set-stories",5128:"highlight-lua",5153:"highlight-clean",5156:"highlight-puppet",5178:"highlight-latex",5190:"contenteditable-contenteditable-stories",5272:"highlight-gherkin",5314:"global-theme-stories",5317:"highlight-c",5326:"slider-slider-stories",5372:"highlight-mipsasm",5381:"highlight-tap",5403:"highlight-openscad",5411:"highlight-plaintext",5442:"markdown-markdown-stories",5468:"highlight-inform7",5480:"highlight-fortran",5483:"highlight-dns",5517:"highlight-julia",5531:"highlight-erlang-repl",5590:"alert-alert-stories",5666:"checkbox-checkbox-stories",5678:"highlight-leaf",5682:"highlight-mathematica",5779:"highlight-prolog",5823:"highlight-scheme",5834:"highlight-parser3",5846:"table-table-stories",5856:"highlight-haml",5886:"progress-bar-progress-bar-stories",5930:"highlight-smali",6095:"highlight-javascript",6107:"highlight-nix",6173:"highlight-stata",6182:"confirm-service-confirm-service-stories",6236:"tabs-tabs-stories",6290:"radio-radio-stories",6293:"highlight-dts",6384:"button-group-button-group-stories",6423:"highlight-mizar",6460:"grid-grid-stories",6506:"highlight-xquery",6588:"highlight-isbl",6595:"highlight-brainfuck",6622:"highlight-delphi",6631:"highlight-asciidoc",6655:"highlight-vbscript-html",6659:"highlight-excel",6684:"button-toolbar-button-toolbar-stories",6763:"highlight-hsp",6768:"highlight-dos",6775:"highlight-htmlbars",6835:"table-simple-table-stories",6836:"highlight-rust",6894:"highlight-handlebars",6900:"highlight-zephir",6905:"highlight-profile",6906:"highlight-haskell",7009:"highlight-mercury",7060:"dialog-dialog-stories",7156:"highlight-basic",7198:"tags-list-tags-list-stories",7290:"highlight-lisp",7341:"highlight-actionscript",7381:"highlight-smalltalk",7391:"highlight-oxygene",7457:"highlight-taggerscript",7458:"highlight-http",7486:"highlight-gml",7508:"list-list-stories",7539:"highlight-pgsql",7549:"highlight-llvm",7635:"highlight-vbnet",7803:"highlight-routeros",7833:"highlight-powershell",7854:"data-list-data-list-stories",7861:"highlight-autohotkey",7879:"highlight-typescript",7881:"highlight-twig",7914:"confirm-confirm-stories",8016:"button-button-stories",8022:"storage-storage-stories",8046:"message-message-stories",8106:"highlight-purebasic",8116:"highlight-groovy",8144:"highlight-shell",8156:"toggle-toggle-stories",8172:"highlight-autoit",8184:"query-assist-query-assist-stories",8206:"clipboard-clipboard-stories",8222:"highlight-glsl",8235:"highlight-thrift",8301:"highlight-rib",8323:"highlight-erlang",8445:"icon-icon-stories",8510:"highlight-sql",8515:"highlight-fix",8603:"highlight-lsl",8653:"highlight-x86asm",8712:"http-http-stories",8755:"highlight-step21",8767:"highlight-cmake",8784:"highlight-clojure-repl",8800:"highlight-scala",8835:"highlight-django",8839:"highlight-vbscript",8936:"user-agreement-user-agreement-stories",9114:"highlight-d",9130:"highlight-capnproto",9135:"highlight-c-like",9158:"user-card-user-card-stories",9230:"highlight-vim",9261:"highlight-cpp",9266:"highlight-objectivec",9320:"highlight-bnf",9332:"highlight-moonscript",9338:"highlight-ceylon",9408:"content-layout-content-layout-stories",9495:"highlight-csharp",9531:"highlight-nsis",9540:"link-link-stories",9602:"highlight-dust",9610:"global-variables-stories",9617:"highlight-matlab",9643:"highlight-coffeescript",9665:"highlight-rsl",9861:"highlight-livescript",9918:"highlight-tp",9986:"auth-dialog-service-auth-dialog-service-stories"}[chunkId]||chunkId)+"."+{64:"8a9e5734",89:"04b07e8f",127:"4abfad0c",174:"8008adb0",182:"540803fa",192:"07411c09",250:"3a1fe101",276:"77dbb1d1",293:"c99337a6",302:"49ef7248",342:"d95d9db5",358:"44657e3c",410:"8b8c423c",450:"dc2fa74b",462:"41485f1b",510:"ffa2d652",515:"3b36946e",529:"aa21ae5e",637:"0ecb8abd",714:"1d755049",762:"5c1dddda",778:"5378a2a8",826:"45c7df23",827:"e1adfbc9",830:"549cdc24",833:"9e264421",875:"27f17e8f",908:"02de78df",960:"7450845a",982:"2a27e0a5",990:"c28b9c7d",1001:"da6d0c7f",1068:"b81885ab",1074:"d7d881f1",1079:"e575ea1f",1110:"348b2bc7",1173:"4b688b3e",1175:"6e0236e5",1192:"36857b8a",1251:"24b30db0",1258:"51ae1261",1367:"1281339e",1382:"cc012669",1443:"3523cf1e",1446:"1e4df9b6",1517:"df526477",1530:"229c8781",1570:"61a11b5a",1609:"cd320af8",1647:"e7ffb3ae",1685:"5875b128",1703:"71c262c8",1812:"223fc7d1",1863:"2190a8f2",1909:"ca615910",1940:"d3ffd0be",1972:"6ffe8c3e",1993:"48e538d0",1998:"24f633a1",2068:"d966411f",2094:"bbca7e0e",2102:"3a2ab0c4",2139:"e1aa3dc5",2176:"dbf4d43f",2234:"a3a97af1",2262:"9c3f966a",2284:"cf5800e2",2358:"53954fa9",2370:"f21bb951",2417:"300949f4",2433:"61b2d7c6",2446:"67b5894f",2479:"598c9346",2495:"0503e819",2558:"92e96e29",2588:"8cd264e7",2601:"320a79fd",2643:"68dbe47e",2680:"51a1b9bf",2718:"8953f4a8",2730:"b21b449e",2741:"3828275c",2774:"ceafe09d",2793:"875c64eb",2809:"a72c977f",2888:"5dbcfab0",2890:"fdc17c83",2906:"1e0a2cec",2934:"907f85ce",2954:"2268c79c",2974:"a9198715",3019:"ed9ad524",3020:"a5ba81da",3058:"100fcf9e",3258:"f5f02b70",3268:"a20ae47d",3277:"4bf289e3",3284:"ca38f8fd",3291:"ace7b60d",3302:"c982dcb0",3358:"3b827e38",3366:"5437f47d",3400:"f99147c4",3526:"0fb6a58e",3560:"196ef982",3632:"f9e192c4",3686:"42b896c0",3697:"716a6c72",3734:"5838c5ac",3750:"07fdb8f8",3777:"300abc13",3864:"8febab3d",3883:"d73c49dc",3885:"a050d4e2",3895:"1cda579c",3902:"8ea859cb",3926:"2acd57b2",3948:"f470a713",3950:"03278685",3986:"aa41f0c8",4014:"9a54fdc3",4026:"c06c101d",4138:"006181cf",4139:"4938578e",4181:"7e45bf8c",4184:"2380f94a",4200:"a551b597",4215:"f23779a3",4258:"0f2bf953",4320:"cd92a2e5",4352:"5a352cdd",4370:"756ca777",4382:"b71cab77",4396:"4726a236",4403:"239454f4",4436:"f2f69ea4",4489:"e0506cdf",4504:"92c85442",4508:"36757aa5",4588:"52644ddb",4684:"54c2d3bf",4695:"fb3c2b8b",4728:"6f9a8894",4746:"247c7a56",4778:"f4d43465",4854:"03661fd8",4864:"e318d8e2",4915:"35810b95",4974:"0f1dd934",5102:"03e94adc",5106:"af5cc7dd",5118:"388716df",5128:"122beb91",5153:"188be09c",5156:"207de14a",5174:"1a87328c",5178:"baaa6a0a",5190:"584b1f6f",5272:"e18660f1",5314:"f18047e2",5317:"17a37737",5326:"67139c45",5372:"edfdd7fd",5381:"f33c1cca",5403:"3e45de1d",5411:"e0284787",5439:"71094419",5442:"35480a36",5468:"d759a0d8",5480:"75a96f00",5483:"b2940c3f",5517:"274ff462",5531:"44b870c5",5590:"1c19e8ac",5666:"70610e52",5678:"f616f432",5682:"7d6971d4",5779:"38f5ac63",5823:"6562ebc1",5834:"89d63b96",5846:"5b061fd3",5848:"edf362f4",5856:"8e40f947",5886:"26b6a986",5908:"834b7c8c",5930:"4a9a64d6",5981:"5ae821f6",6095:"e7ebe6cf",6107:"6aa8e4fb",6173:"9bcfcbd1",6182:"7665ad69",6222:"0c78fea6",6236:"a3f574cc",6290:"3bf5b4c6",6293:"b3e394c7",6384:"42b020d6",6386:"5275ece4",6423:"f59873ab",6460:"cee67ce9",6506:"824b8fd9",6588:"ccf756c2",6595:"cc2b1c1f",6622:"f751ae97",6624:"2e270109",6631:"34f53410",6655:"8333f1c4",6659:"c405e274",6684:"ab31af03",6763:"0055bbef",6768:"83908ba1",6771:"f98e8791",6775:"eb77fb12",6835:"f1830025",6836:"06780d2a",6894:"90bb692a",6900:"ee51ecec",6905:"7c954038",6906:"f8da7684",7009:"840e54a3",7060:"906c107b",7156:"1ec0047b",7198:"cd64e0a6",7290:"dcfd5801",7341:"b567ca50",7381:"effc5bd5",7391:"12414850",7457:"1eafda93",7458:"63959461",7486:"bfb7a9d8",7508:"8d3f263a",7539:"f39b6148",7549:"feef3710",7635:"7da18610",7803:"9fd30601",7811:"dd24ba04",7833:"f058ee25",7849:"053e3784",7854:"807c1ec6",7861:"e03d42c7",7879:"a0cec486",7881:"686bd30c",7914:"d78ed17f",8016:"28d51a12",8022:"515f7d3a",8046:"30113643",8083:"8e132ccc",8106:"2f6abfe5",8116:"2befeb86",8144:"3225da4f",8156:"ae0cbe9b",8172:"6258c5d7",8184:"9f90edce",8206:"1be7c54f",8222:"7effc5d6",8235:"51b18698",8301:"c4740202",8323:"fb020bfa",8445:"501c8380",8505:"f389e63a",8510:"059d5e2d",8515:"e793d4ba",8603:"7fd1a22d",8609:"cc697462",8613:"92e2ad88",8653:"f187d6d1",8712:"a45b3875",8755:"055a5582",8767:"36022979",8784:"a88d4335",8800:"257a6775",8835:"17bb6c78",8839:"ac6cc734",8936:"2924e598",9114:"33c7f4d0",9130:"7287bc51",9135:"70185d22",9151:"81c74c82",9158:"63966125",9167:"2b6f573c",9230:"7b61ff7d",9261:"3a0fdbfd",9266:"e43f9a08",9320:"ba59c4ae",9332:"8912d94b",9338:"4b7d0e20",9406:"91ed2940",9408:"ca6cf4e2",9486:"c63e09b0",9495:"681f42ac",9523:"4e27ff0e",9531:"5bcf39ec",9540:"b3a86198",9602:"02818cb8",9610:"1cad999a",9617:"68569afc",9643:"c9c9ef44",9665:"e7dc29e9",9750:"7de0cb3a",9787:"0198d4c9",9861:"254ad280",9918:"f0967bbc",9986:"a42b7315"}[chunkId]+".iframe.bundle.js"),__webpack_require__.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),__webpack_require__.o=(obj,prop)=>Object.prototype.hasOwnProperty.call(obj,prop),inProgress={},__webpack_require__.l=(url,done,key,chunkId)=>{if(inProgress[url])inProgress[url].push(done);else{var script,needAttach;if(void 0!==key)for(var scripts=document.getElementsByTagName("script"),i=0;i<scripts.length;i++){var s=scripts[i];if(s.getAttribute("src")==url||s.getAttribute("data-webpack")=="@jetbrains/ring-ui:"+key){script=s;break}}script||(needAttach=!0,(script=document.createElement("script")).charset="utf-8",script.timeout=120,__webpack_require__.nc&&script.setAttribute("nonce",__webpack_require__.nc),script.setAttribute("data-webpack","@jetbrains/ring-ui:"+key),script.src=url),inProgress[url]=[done];var onScriptComplete=(prev,event)=>{script.onerror=script.onload=null,clearTimeout(timeout);var doneFns=inProgress[url];if(delete inProgress[url],script.parentNode&&script.parentNode.removeChild(script),doneFns&&doneFns.forEach((fn=>fn(event))),prev)return prev(event)},timeout=setTimeout(onScriptComplete.bind(null,void 0,{type:"timeout",target:script}),12e4);script.onerror=onScriptComplete.bind(null,script.onerror),script.onload=onScriptComplete.bind(null,script.onload),needAttach&&document.head.appendChild(script)}},__webpack_require__.r=exports=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(exports,"__esModule",{value:!0})},__webpack_require__.nmd=module=>(module.paths=[],module.children||(module.children=[]),module),__webpack_require__.p="",(()=>{var installedChunks={5354:0};__webpack_require__.f.j=(chunkId,promises)=>{var installedChunkData=__webpack_require__.o(installedChunks,chunkId)?installedChunks[chunkId]:void 0;if(0!==installedChunkData)if(installedChunkData)promises.push(installedChunkData[2]);else if(5354!=chunkId){var promise=new Promise(((resolve,reject)=>installedChunkData=installedChunks[chunkId]=[resolve,reject]));promises.push(installedChunkData[2]=promise);var url=__webpack_require__.p+__webpack_require__.u(chunkId),error=new Error;__webpack_require__.l(url,(event=>{if(__webpack_require__.o(installedChunks,chunkId)&&(0!==(installedChunkData=installedChunks[chunkId])&&(installedChunks[chunkId]=void 0),installedChunkData)){var errorType=event&&("load"===event.type?"missing":event.type),realSrc=event&&event.target&&event.target.src;error.message="Loading chunk "+chunkId+" failed.\n("+errorType+": "+realSrc+")",error.name="ChunkLoadError",error.type=errorType,error.request=realSrc,installedChunkData[1](error)}}),"chunk-"+chunkId,chunkId)}else installedChunks[chunkId]=0},__webpack_require__.O.j=chunkId=>0===installedChunks[chunkId];var webpackJsonpCallback=(parentChunkLoadingFunction,data)=>{var moduleId,chunkId,chunkIds=data[0],moreModules=data[1],runtime=data[2],i=0;if(chunkIds.some((id=>0!==installedChunks[id]))){for(moduleId in moreModules)__webpack_require__.o(moreModules,moduleId)&&(__webpack_require__.m[moduleId]=moreModules[moduleId]);if(runtime)var result=runtime(__webpack_require__)}for(parentChunkLoadingFunction&&parentChunkLoadingFunction(data);i<chunkIds.length;i++)chunkId=chunkIds[i],__webpack_require__.o(installedChunks,chunkId)&&installedChunks[chunkId]&&installedChunks[chunkId][0](),installedChunks[chunkId]=0;return __webpack_require__.O(result)},chunkLoadingGlobal=self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[];chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null,0)),chunkLoadingGlobal.push=webpackJsonpCallback.bind(null,chunkLoadingGlobal.push.bind(chunkLoadingGlobal))})(),__webpack_require__.nc=void 0})();