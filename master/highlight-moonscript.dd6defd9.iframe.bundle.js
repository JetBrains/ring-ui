(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[9332],{"./node_modules/highlight.js/lib/languages/moonscript.js":module=>{module.exports=function moonscript(hljs){const KEYWORDS={keyword:"if then not for in while do return else elseif break continue switch and or unless when class extends super local import export from using",literal:"true false nil",built_in:"_G _VERSION assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall coroutine debug io math os package string table"},JS_IDENT_RE="[A-Za-z$_][0-9A-Za-z$_]*",SUBST={className:"subst",begin:/#\{/,end:/\}/,keywords:KEYWORDS},EXPRESSIONS=[hljs.inherit(hljs.C_NUMBER_MODE,{starts:{end:"(\\s*/)?",relevance:0}}),{className:"string",variants:[{begin:/'/,end:/'/,contains:[hljs.BACKSLASH_ESCAPE]},{begin:/"/,end:/"/,contains:[hljs.BACKSLASH_ESCAPE,SUBST]}]},{className:"built_in",begin:"@__"+hljs.IDENT_RE},{begin:"@"+hljs.IDENT_RE},{begin:hljs.IDENT_RE+"\\\\"+hljs.IDENT_RE}];SUBST.contains=EXPRESSIONS;const TITLE=hljs.inherit(hljs.TITLE_MODE,{begin:JS_IDENT_RE}),PARAMS={className:"params",begin:"\\([^\\(]",returnBegin:!0,contains:[{begin:/\(/,end:/\)/,keywords:KEYWORDS,contains:["self"].concat(EXPRESSIONS)}]};return{name:"MoonScript",aliases:["moon"],keywords:KEYWORDS,illegal:/\/\*/,contains:EXPRESSIONS.concat([hljs.COMMENT("--","$"),{className:"function",begin:"^\\s*"+JS_IDENT_RE+"\\s*=\\s*(\\(.*\\)\\s*)?\\B[-=]>",end:"[-=]>",returnBegin:!0,contains:[TITLE,PARAMS]},{begin:/[\(,:=]\s*/,relevance:0,contains:[{className:"function",begin:"(\\(.*\\)\\s*)?\\B[-=]>",end:"[-=]>",returnBegin:!0,contains:[PARAMS]}]},{className:"class",beginKeywords:"class",end:"$",illegal:/[:="\[\]]/,contains:[{beginKeywords:"extends",endsWithParent:!0,illegal:/[:="\[\]]/,contains:[TITLE]},TITLE]},{className:"name",begin:JS_IDENT_RE+":",end:":",returnBegin:!0,returnEnd:!0,relevance:0}])}}}}]);