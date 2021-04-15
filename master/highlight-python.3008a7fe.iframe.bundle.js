(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[316],{30308:module=>{function lookahead(re){return function concat(...args){return args.map((x=>function source(re){return re?"string"==typeof re?re:re.source:null}(x))).join("")}("(?=",re,")")}module.exports=function python(hljs){const KEYWORDS={$pattern:/[A-Za-z]\w+|__\w+__/,keyword:["and","as","assert","async","await","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","nonlocal|10","not","or","pass","raise","return","try","while","with","yield"],built_in:["__import__","abs","all","any","ascii","bin","bool","breakpoint","bytearray","bytes","callable","chr","classmethod","compile","complex","delattr","dict","dir","divmod","enumerate","eval","exec","filter","float","format","frozenset","getattr","globals","hasattr","hash","help","hex","id","input","int","isinstance","issubclass","iter","len","list","locals","map","max","memoryview","min","next","object","oct","open","ord","pow","print","property","range","repr","reversed","round","set","setattr","slice","sorted","staticmethod","str","sum","super","tuple","type","vars","zip"],literal:["__debug__","Ellipsis","False","None","NotImplemented","True"],type:["Any","Callable","Coroutine","Dict","List","Literal","Generic","Optional","Sequence","Set","Tuple","Type","Union"]},PROMPT={className:"meta",begin:/^(>>>|\.\.\.) /},SUBST={className:"subst",begin:/\{/,end:/\}/,keywords:KEYWORDS,illegal:/#/},LITERAL_BRACKET={begin:/\{\{/,relevance:0},STRING={className:"string",contains:[hljs.BACKSLASH_ESCAPE],variants:[{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,end:/'''/,contains:[hljs.BACKSLASH_ESCAPE,PROMPT],relevance:10},{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,end:/"""/,contains:[hljs.BACKSLASH_ESCAPE,PROMPT],relevance:10},{begin:/([fF][rR]|[rR][fF]|[fF])'''/,end:/'''/,contains:[hljs.BACKSLASH_ESCAPE,PROMPT,LITERAL_BRACKET,SUBST]},{begin:/([fF][rR]|[rR][fF]|[fF])"""/,end:/"""/,contains:[hljs.BACKSLASH_ESCAPE,PROMPT,LITERAL_BRACKET,SUBST]},{begin:/([uU]|[rR])'/,end:/'/,relevance:10},{begin:/([uU]|[rR])"/,end:/"/,relevance:10},{begin:/([bB]|[bB][rR]|[rR][bB])'/,end:/'/},{begin:/([bB]|[bB][rR]|[rR][bB])"/,end:/"/},{begin:/([fF][rR]|[rR][fF]|[fF])'/,end:/'/,contains:[hljs.BACKSLASH_ESCAPE,LITERAL_BRACKET,SUBST]},{begin:/([fF][rR]|[rR][fF]|[fF])"/,end:/"/,contains:[hljs.BACKSLASH_ESCAPE,LITERAL_BRACKET,SUBST]},hljs.APOS_STRING_MODE,hljs.QUOTE_STRING_MODE]},digitpart="[0-9](_?[0-9])*",pointfloat=`(\\b(${digitpart}))?\\.(${digitpart})|\\b(${digitpart})\\.`,NUMBER={className:"number",relevance:0,variants:[{begin:`(\\b(${digitpart})|(${pointfloat}))[eE][+-]?(${digitpart})[jJ]?\\b`},{begin:`(${pointfloat})[jJ]?`},{begin:"\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?\\b"},{begin:"\\b0[bB](_?[01])+[lL]?\\b"},{begin:"\\b0[oO](_?[0-7])+[lL]?\\b"},{begin:"\\b0[xX](_?[0-9a-fA-F])+[lL]?\\b"},{begin:`\\b(${digitpart})[jJ]\\b`}]},COMMENT_TYPE={className:"comment",begin:lookahead(/# type:/),end:/$/,keywords:KEYWORDS,contains:[{begin:/# type:/},{begin:/#/,end:/\b\B/,endsWithParent:!0}]},PARAMS={className:"params",variants:[{className:"",begin:/\(\s*\)/,skip:!0},{begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:KEYWORDS,contains:["self",PROMPT,NUMBER,STRING,hljs.HASH_COMMENT_MODE]}]};return SUBST.contains=[STRING,NUMBER,PROMPT],{name:"Python",aliases:["py","gyp","ipython"],keywords:KEYWORDS,illegal:/(<\/|->|\?)|=>/,contains:[PROMPT,NUMBER,{begin:/\bself\b/},{beginKeywords:"if",relevance:0},STRING,COMMENT_TYPE,hljs.HASH_COMMENT_MODE,{variants:[{className:"function",beginKeywords:"def"},{className:"class",beginKeywords:"class"}],end:/:/,illegal:/[${=;\n,]/,contains:[hljs.UNDERSCORE_TITLE_MODE,PARAMS,{begin:/->/,endsWithParent:!0,keywords:KEYWORDS}]},{className:"meta",begin:/^[\t ]*@/,end:/(?=#)|$/,contains:[NUMBER,PARAMS,STRING]}]}}}}]);
//# sourceMappingURL=highlight-python.3008a7fe.iframe.bundle.js.map