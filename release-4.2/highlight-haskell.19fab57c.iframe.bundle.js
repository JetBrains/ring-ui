(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[7429],{"./node_modules/highlight.js/lib/languages/haskell.js":module=>{module.exports=function haskell(hljs){const COMMENT={variants:[hljs.COMMENT("--","$"),hljs.COMMENT(/\{-/,/-\}/,{contains:["self"]})]},PRAGMA={className:"meta",begin:/\{-#/,end:/#-\}/},PREPROCESSOR={className:"meta",begin:"^#",end:"$"},CONSTRUCTOR={className:"type",begin:"\\b[A-Z][\\w']*",relevance:0},LIST={begin:"\\(",end:"\\)",illegal:'"',contains:[PRAGMA,PREPROCESSOR,{className:"type",begin:"\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?"},hljs.inherit(hljs.TITLE_MODE,{begin:"[_a-z][\\w']*"}),COMMENT]};return{name:"Haskell",aliases:["hs"],keywords:"let in if then else case of where do module import hiding qualified type data newtype deriving class instance as default infix infixl infixr foreign export ccall stdcall cplusplus jvm dotnet safe unsafe family forall mdo proc rec",contains:[{beginKeywords:"module",end:"where",keywords:"module where",contains:[LIST,COMMENT],illegal:"\\W\\.|;"},{begin:"\\bimport\\b",end:"$",keywords:"import qualified as hiding",contains:[LIST,COMMENT],illegal:"\\W\\.|;"},{className:"class",begin:"^(\\s*)?(class|instance)\\b",end:"where",keywords:"class family instance where",contains:[CONSTRUCTOR,LIST,COMMENT]},{className:"class",begin:"\\b(data|(new)?type)\\b",end:"$",keywords:"data family type newtype deriving",contains:[PRAGMA,CONSTRUCTOR,LIST,{begin:/\{/,end:/\}/,contains:LIST.contains},COMMENT]},{beginKeywords:"default",end:"$",contains:[CONSTRUCTOR,LIST,COMMENT]},{beginKeywords:"infix infixl infixr",end:"$",contains:[hljs.C_NUMBER_MODE,COMMENT]},{begin:"\\bforeign\\b",end:"$",keywords:"foreign import export ccall stdcall cplusplus jvm dotnet safe unsafe",contains:[CONSTRUCTOR,hljs.QUOTE_STRING_MODE,COMMENT]},{className:"meta",begin:"#!\\/usr\\/bin\\/env runhaskell",end:"$"},PRAGMA,PREPROCESSOR,hljs.QUOTE_STRING_MODE,hljs.C_NUMBER_MODE,CONSTRUCTOR,hljs.inherit(hljs.TITLE_MODE,{begin:"^[_a-z][\\w']*"}),COMMENT,{begin:"->|<-"}]}}}}]);