(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[4454],{42387:module=>{module.exports=function nginx(hljs){const VAR={className:"variable",variants:[{begin:/\$\d+/},{begin:/\$\{/,end:/\}/},{begin:/[$@]/+hljs.UNDERSCORE_IDENT_RE}]},DEFAULT={endsWithParent:!0,keywords:{$pattern:"[a-z/_]+",literal:"on off yes no true false none blocked debug info notice warn error crit select break last permanent redirect kqueue rtsig epoll poll /dev/poll"},relevance:0,illegal:"=>",contains:[hljs.HASH_COMMENT_MODE,{className:"string",contains:[hljs.BACKSLASH_ESCAPE,VAR],variants:[{begin:/"/,end:/"/},{begin:/'/,end:/'/}]},{begin:"([a-z]+):/",end:"\\s",endsWithParent:!0,excludeEnd:!0,contains:[VAR]},{className:"regexp",contains:[hljs.BACKSLASH_ESCAPE,VAR],variants:[{begin:"\\s\\^",end:"\\s|\\{|;",returnEnd:!0},{begin:"~\\*?\\s+",end:"\\s|\\{|;",returnEnd:!0},{begin:"\\*(\\.[a-z\\-]+)+"},{begin:"([a-z\\-]+\\.)+\\*"}]},{className:"number",begin:"\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b"},{className:"number",begin:"\\b\\d+[kKmMgGdshdwy]*\\b",relevance:0},VAR]};return{name:"Nginx config",aliases:["nginxconf"],contains:[hljs.HASH_COMMENT_MODE,{begin:hljs.UNDERSCORE_IDENT_RE+"\\s+\\{",returnBegin:!0,end:/\{/,contains:[{className:"section",begin:hljs.UNDERSCORE_IDENT_RE}],relevance:0},{begin:hljs.UNDERSCORE_IDENT_RE+"\\s",end:";|\\{",returnBegin:!0,contains:[{className:"attribute",begin:hljs.UNDERSCORE_IDENT_RE,starts:DEFAULT}],relevance:0}],illegal:"[^\\s\\}]"}}}}]);
//# sourceMappingURL=highlight-nginx.d130241f.iframe.bundle.js.map