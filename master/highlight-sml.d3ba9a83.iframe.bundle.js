(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[3986],{"./node_modules/highlight.js/lib/languages/sml.js":module=>{module.exports=function sml(hljs){return{name:"SML (Standard ML)",aliases:["ml"],keywords:{$pattern:"[a-z_]\\w*!?",keyword:"abstype and andalso as case datatype do else end eqtype exception fn fun functor handle if in include infix infixr let local nonfix of op open orelse raise rec sharing sig signature struct structure then type val with withtype where while",built_in:"array bool char exn int list option order real ref string substring vector unit word",literal:"true false NONE SOME LESS EQUAL GREATER nil"},illegal:/\/\/|>>/,contains:[{className:"literal",begin:/\[(\|\|)?\]|\(\)/,relevance:0},hljs.COMMENT("\\(\\*","\\*\\)",{contains:["self"]}),{className:"symbol",begin:"'[A-Za-z_](?!')[\\w']*"},{className:"type",begin:"`[A-Z][\\w']*"},{className:"type",begin:"\\b[A-Z][\\w']*",relevance:0},{begin:"[a-z_]\\w*'[\\w']*"},hljs.inherit(hljs.APOS_STRING_MODE,{className:"string",relevance:0}),hljs.inherit(hljs.QUOTE_STRING_MODE,{illegal:null}),{className:"number",begin:"\\b(0[xX][a-fA-F0-9_]+[Lln]?|0[oO][0-7_]+[Lln]?|0[bB][01_]+[Lln]?|[0-9][0-9_]*([Lln]|(\\.[0-9_]*)?([eE][-+]?[0-9_]+)?)?)",relevance:0},{begin:/[-=]>/}]}}}}]);