(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[2828],{"./node_modules/highlight.js/lib/languages/lua.js":module=>{module.exports=function lua(hljs){const LONG_BRACKETS={begin:"\\[=*\\[",end:"\\]=*\\]",contains:["self"]},COMMENTS=[hljs.COMMENT("--(?!\\[=*\\[)","$"),hljs.COMMENT("--\\[=*\\[","\\]=*\\]",{contains:[LONG_BRACKETS],relevance:10})];return{name:"Lua",keywords:{$pattern:hljs.UNDERSCORE_IDENT_RE,literal:"true false nil",keyword:"and break do else elseif end for goto if in local not or repeat return then until while",built_in:"_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove"},contains:COMMENTS.concat([{className:"function",beginKeywords:"function",end:"\\)",contains:[hljs.inherit(hljs.TITLE_MODE,{begin:"([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"}),{className:"params",begin:"\\(",endsWithParent:!0,contains:COMMENTS}].concat(COMMENTS)},hljs.C_NUMBER_MODE,hljs.APOS_STRING_MODE,hljs.QUOTE_STRING_MODE,{className:"string",begin:"\\[=*\\[",end:"\\]=*\\]",contains:[LONG_BRACKETS],relevance:5}])}}}}]);