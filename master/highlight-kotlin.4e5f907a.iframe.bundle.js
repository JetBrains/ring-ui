(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[3885],{"./node_modules/highlight.js/lib/languages/kotlin.js":module=>{var frac="\\.([0-9](_*[0-9])*)",hexDigits="[0-9a-fA-F](_*[0-9a-fA-F])*",NUMERIC={className:"number",variants:[{begin:`(\\b([0-9](_*[0-9])*)((${frac})|\\.)?|(${frac}))[eE][+-]?([0-9](_*[0-9])*)[fFdD]?\\b`},{begin:`\\b([0-9](_*[0-9])*)((${frac})[fFdD]?\\b|\\.([fFdD]\\b)?)`},{begin:`(${frac})[fFdD]?\\b`},{begin:"\\b([0-9](_*[0-9])*)[fFdD]\\b"},{begin:`\\b0[xX]((${hexDigits})\\.?|(${hexDigits})?\\.(${hexDigits}))[pP][+-]?([0-9](_*[0-9])*)[fFdD]?\\b`},{begin:"\\b(0|[1-9](_*[0-9])*)[lL]?\\b"},{begin:`\\b0[xX](${hexDigits})[lL]?\\b`},{begin:"\\b0(_*[0-7])*[lL]?\\b"},{begin:"\\b0[bB][01](_*[01])*[lL]?\\b"}],relevance:0};module.exports=function kotlin(hljs){const KEYWORDS={keyword:"abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",built_in:"Byte Short Char Int Long Boolean Float Double Void Unit Nothing",literal:"true false null"},LABEL={className:"symbol",begin:hljs.UNDERSCORE_IDENT_RE+"@"},SUBST={className:"subst",begin:/\$\{/,end:/\}/,contains:[hljs.C_NUMBER_MODE]},VARIABLE={className:"variable",begin:"\\$"+hljs.UNDERSCORE_IDENT_RE},STRING={className:"string",variants:[{begin:'"""',end:'"""(?=[^"])',contains:[VARIABLE,SUBST]},{begin:"'",end:"'",illegal:/\n/,contains:[hljs.BACKSLASH_ESCAPE]},{begin:'"',end:'"',illegal:/\n/,contains:[hljs.BACKSLASH_ESCAPE,VARIABLE,SUBST]}]};SUBST.contains.push(STRING);const ANNOTATION_USE_SITE={className:"meta",begin:"@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*"+hljs.UNDERSCORE_IDENT_RE+")?"},ANNOTATION={className:"meta",begin:"@"+hljs.UNDERSCORE_IDENT_RE,contains:[{begin:/\(/,end:/\)/,contains:[hljs.inherit(STRING,{className:"meta-string"})]}]},KOTLIN_NUMBER_MODE=NUMERIC,KOTLIN_NESTED_COMMENT=hljs.COMMENT("/\\*","\\*/",{contains:[hljs.C_BLOCK_COMMENT_MODE]}),KOTLIN_PAREN_TYPE={variants:[{className:"type",begin:hljs.UNDERSCORE_IDENT_RE},{begin:/\(/,end:/\)/,contains:[]}]},KOTLIN_PAREN_TYPE2=KOTLIN_PAREN_TYPE;return KOTLIN_PAREN_TYPE2.variants[1].contains=[KOTLIN_PAREN_TYPE],KOTLIN_PAREN_TYPE.variants[1].contains=[KOTLIN_PAREN_TYPE2],{name:"Kotlin",aliases:["kt","kts"],keywords:KEYWORDS,contains:[hljs.COMMENT("/\\*\\*","\\*/",{relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"}]}),hljs.C_LINE_COMMENT_MODE,KOTLIN_NESTED_COMMENT,{className:"keyword",begin:/\b(break|continue|return|this)\b/,starts:{contains:[{className:"symbol",begin:/@\w+/}]}},LABEL,ANNOTATION_USE_SITE,ANNOTATION,{className:"function",beginKeywords:"fun",end:"[(]|$",returnBegin:!0,excludeEnd:!0,keywords:KEYWORDS,relevance:5,contains:[{begin:hljs.UNDERSCORE_IDENT_RE+"\\s*\\(",returnBegin:!0,relevance:0,contains:[hljs.UNDERSCORE_TITLE_MODE]},{className:"type",begin:/</,end:/>/,keywords:"reified",relevance:0},{className:"params",begin:/\(/,end:/\)/,endsParent:!0,keywords:KEYWORDS,relevance:0,contains:[{begin:/:/,end:/[=,\/]/,endsWithParent:!0,contains:[KOTLIN_PAREN_TYPE,hljs.C_LINE_COMMENT_MODE,KOTLIN_NESTED_COMMENT],relevance:0},hljs.C_LINE_COMMENT_MODE,KOTLIN_NESTED_COMMENT,ANNOTATION_USE_SITE,ANNOTATION,STRING,hljs.C_NUMBER_MODE]},KOTLIN_NESTED_COMMENT]},{className:"class",beginKeywords:"class interface trait",end:/[:\{(]|$/,excludeEnd:!0,illegal:"extends implements",contains:[{beginKeywords:"public protected internal private constructor"},hljs.UNDERSCORE_TITLE_MODE,{className:"type",begin:/</,end:/>/,excludeBegin:!0,excludeEnd:!0,relevance:0},{className:"type",begin:/[,:]\s*/,end:/[<\(,]|$/,excludeBegin:!0,returnEnd:!0},ANNOTATION_USE_SITE,ANNOTATION]},STRING,{className:"meta",begin:"^#!/usr/bin/env",end:"$",illegal:"\n"},KOTLIN_NUMBER_MODE]}}}}]);