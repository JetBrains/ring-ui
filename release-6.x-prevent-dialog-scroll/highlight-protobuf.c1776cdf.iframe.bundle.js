(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[827],{"./node_modules/highlight.js/lib/languages/protobuf.js":module=>{module.exports=function protobuf(hljs){return{name:"Protocol Buffers",keywords:{keyword:"package import option optional required repeated group oneof",built_in:"double float int32 int64 uint32 uint64 sint32 sint64 fixed32 fixed64 sfixed32 sfixed64 bool string bytes",literal:"true false"},contains:[hljs.QUOTE_STRING_MODE,hljs.NUMBER_MODE,hljs.C_LINE_COMMENT_MODE,hljs.C_BLOCK_COMMENT_MODE,{className:"class",beginKeywords:"message enum service",end:/\{/,illegal:/\n/,contains:[hljs.inherit(hljs.TITLE_MODE,{starts:{endsWithParent:!0,excludeEnd:!0}})]},{className:"function",beginKeywords:"rpc",end:/[{;]/,excludeEnd:!0,keywords:"rpc returns"},{begin:/^\s*[A-Z_]+(?=\s*=[^\n]+;$)/}]}}}}]);