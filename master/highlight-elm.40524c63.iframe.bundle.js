(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[9848],{58259:module=>{module.exports=function elm(hljs){const COMMENT={variants:[hljs.COMMENT("--","$"),hljs.COMMENT(/\{-/,/-\}/,{contains:["self"]})]},CONSTRUCTOR={className:"type",begin:"\\b[A-Z][\\w']*",relevance:0},LIST={begin:"\\(",end:"\\)",illegal:'"',contains:[{className:"type",begin:"\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?"},COMMENT]};return{name:"Elm",keywords:"let in if then else case of where module import exposing type alias as infix infixl infixr port effect command subscription",contains:[{beginKeywords:"port effect module",end:"exposing",keywords:"port effect module where command subscription exposing",contains:[LIST,COMMENT],illegal:"\\W\\.|;"},{begin:"import",end:"$",keywords:"import as exposing",contains:[LIST,COMMENT],illegal:"\\W\\.|;"},{begin:"type",end:"$",keywords:"type alias",contains:[CONSTRUCTOR,LIST,{begin:/\{/,end:/\}/,contains:LIST.contains},COMMENT]},{beginKeywords:"infix infixl infixr",end:"$",contains:[hljs.C_NUMBER_MODE,COMMENT]},{begin:"port",end:"$",keywords:"port",contains:[COMMENT]},{className:"string",begin:"'\\\\?.",end:"'",illegal:"."},hljs.QUOTE_STRING_MODE,hljs.C_NUMBER_MODE,CONSTRUCTOR,hljs.inherit(hljs.TITLE_MODE,{begin:"^[_a-z][\\w']*"}),COMMENT,{begin:"->|<-"}],illegal:/;/}}}}]);
//# sourceMappingURL=highlight-elm.40524c63.iframe.bundle.js.map