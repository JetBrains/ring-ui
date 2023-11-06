(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[4807],{"./node_modules/highlight.js/lib/languages/bash.js":module=>{function concat(...args){return args.map((x=>function source(re){return re?"string"==typeof re?re:re.source:null}(x))).join("")}module.exports=function bash(hljs){const VAR={},BRACED_VAR={begin:/\$\{/,end:/\}/,contains:["self",{begin:/:-/,contains:[VAR]}]};Object.assign(VAR,{className:"variable",variants:[{begin:concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},BRACED_VAR]});const SUBST={className:"subst",begin:/\$\(/,end:/\)/,contains:[hljs.BACKSLASH_ESCAPE]},HERE_DOC={begin:/<<-?\s*(?=\w+)/,starts:{contains:[hljs.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:"string"})]}},QUOTE_STRING={className:"string",begin:/"/,end:/"/,contains:[hljs.BACKSLASH_ESCAPE,VAR,SUBST]};SUBST.contains.push(QUOTE_STRING);const ARITHMETIC={begin:/\$\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},hljs.NUMBER_MODE,VAR]},KNOWN_SHEBANG=hljs.SHEBANG({binary:`(${["fish","bash","zsh","sh","csh","ksh","tcsh","dash","scsh"].join("|")})`,relevance:10}),FUNCTION={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[hljs.inherit(hljs.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0};return{name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z._-]+\b/,keyword:"if then else elif fi for while in do done case esac function",literal:"true false",built_in:"break cd continue eval exec exit export getopts hash pwd readonly return shift test times trap umask unset alias bind builtin caller command declare echo enable help let local logout mapfile printf read readarray source type typeset ulimit unalias set shopt autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate fc fg float functions getcap getln history integer jobs kill limit log noglob popd print pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof zpty zregexparse zsocket zstyle ztcp"},contains:[KNOWN_SHEBANG,hljs.SHEBANG(),FUNCTION,ARITHMETIC,hljs.HASH_COMMENT_MODE,HERE_DOC,QUOTE_STRING,{className:"",begin:/\\"/},{className:"string",begin:/'/,end:/'/},VAR]}}}}]);