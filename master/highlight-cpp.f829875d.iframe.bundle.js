(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[1112],{74006:module=>{function optional(re){return concat("(",re,")?")}function concat(...args){return args.map((x=>function source(re){return re?"string"==typeof re?re:re.source:null}(x))).join("")}module.exports=function cpp(hljs){const C_LINE_COMMENT_MODE=hljs.COMMENT("//","$",{contains:[{begin:/\\\n/}]}),FUNCTION_TYPE_RE="(decltype\\(auto\\)|"+optional("[a-zA-Z_]\\w*::")+"[a-zA-Z_]\\w*"+optional("<[^<>]+>")+")",CPP_PRIMITIVE_TYPES={className:"keyword",begin:"\\b[a-z\\d_]*_t\\b"},STRINGS={className:"string",variants:[{begin:'(u8?|U|L)?"',end:'"',illegal:"\\n",contains:[hljs.BACKSLASH_ESCAPE]},{begin:"(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",end:"'",illegal:"."},hljs.END_SAME_AS_BEGIN({begin:/(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,end:/\)([^()\\ ]{0,16})"/})]},NUMBERS={className:"number",variants:[{begin:"\\b(0b[01']+)"},{begin:"(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)"},{begin:"(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"}],relevance:0},PREPROCESSOR={className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{"meta-keyword":"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"},contains:[{begin:/\\\n/,relevance:0},hljs.inherit(STRINGS,{className:"meta-string"}),{className:"meta-string",begin:/<.*?>/},C_LINE_COMMENT_MODE,hljs.C_BLOCK_COMMENT_MODE]},TITLE_MODE={className:"title",begin:optional("[a-zA-Z_]\\w*::")+hljs.IDENT_RE,relevance:0},FUNCTION_TITLE=optional("[a-zA-Z_]\\w*::")+hljs.IDENT_RE+"\\s*\\(",CPP_KEYWORDS={keyword:"int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",built_in:"_Bool _Complex _Imaginary",_relevance_hints:["asin","atan2","atan","calloc","ceil","cosh","cos","exit","exp","fabs","floor","fmod","fprintf","fputs","free","frexp","auto_ptr","deque","list","queue","stack","vector","map","set","pair","bitset","multiset","multimap","unordered_set","fscanf","future","isalnum","isalpha","iscntrl","isdigit","isgraph","islower","isprint","ispunct","isspace","isupper","isxdigit","tolower","toupper","labs","ldexp","log10","log","malloc","realloc","memchr","memcmp","memcpy","memset","modf","pow","printf","putchar","puts","scanf","sinh","sin","snprintf","sprintf","sqrt","sscanf","strcat","strchr","strcmp","strcpy","strcspn","strlen","strncat","strncmp","strncpy","strpbrk","strrchr","strspn","strstr","tanh","tan","unordered_map","unordered_multiset","unordered_multimap","priority_queue","make_pair","array","shared_ptr","abort","terminate","abs","acos","vfprintf","vprintf","vsprintf","endl","initializer_list","unique_ptr","complex","imaginary","std","string","wstring","cin","cout","cerr","clog","stdin","stdout","stderr","stringstream","istringstream","ostringstream"],literal:"true false nullptr NULL"},FUNCTION_DISPATCH={className:"function.dispatch",relevance:0,keywords:CPP_KEYWORDS,begin:concat(/\b/,/(?!decltype)/,/(?!if)/,/(?!for)/,/(?!while)/,hljs.IDENT_RE,(re=/\s*\(/,concat("(?=",re,")")))};var re;const EXPRESSION_CONTAINS=[FUNCTION_DISPATCH,PREPROCESSOR,CPP_PRIMITIVE_TYPES,C_LINE_COMMENT_MODE,hljs.C_BLOCK_COMMENT_MODE,NUMBERS,STRINGS],EXPRESSION_CONTEXT={variants:[{begin:/=/,end:/;/},{begin:/\(/,end:/\)/},{beginKeywords:"new throw return else",end:/;/}],keywords:CPP_KEYWORDS,contains:EXPRESSION_CONTAINS.concat([{begin:/\(/,end:/\)/,keywords:CPP_KEYWORDS,contains:EXPRESSION_CONTAINS.concat(["self"]),relevance:0}]),relevance:0},FUNCTION_DECLARATION={className:"function",begin:"("+FUNCTION_TYPE_RE+"[\\*&\\s]+)+"+FUNCTION_TITLE,returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:CPP_KEYWORDS,illegal:/[^\w\s\*&:<>.]/,contains:[{begin:"decltype\\(auto\\)",keywords:CPP_KEYWORDS,relevance:0},{begin:FUNCTION_TITLE,returnBegin:!0,contains:[TITLE_MODE],relevance:0},{begin:/::/,relevance:0},{begin:/:/,endsWithParent:!0,contains:[STRINGS,NUMBERS]},{className:"params",begin:/\(/,end:/\)/,keywords:CPP_KEYWORDS,relevance:0,contains:[C_LINE_COMMENT_MODE,hljs.C_BLOCK_COMMENT_MODE,STRINGS,NUMBERS,CPP_PRIMITIVE_TYPES,{begin:/\(/,end:/\)/,keywords:CPP_KEYWORDS,relevance:0,contains:["self",C_LINE_COMMENT_MODE,hljs.C_BLOCK_COMMENT_MODE,STRINGS,NUMBERS,CPP_PRIMITIVE_TYPES]}]},CPP_PRIMITIVE_TYPES,C_LINE_COMMENT_MODE,hljs.C_BLOCK_COMMENT_MODE,PREPROCESSOR]};return{name:"C++",aliases:["cc","c++","h++","hpp","hh","hxx","cxx"],keywords:CPP_KEYWORDS,illegal:"</",classNameAliases:{"function.dispatch":"built_in"},contains:[].concat(EXPRESSION_CONTEXT,FUNCTION_DECLARATION,FUNCTION_DISPATCH,EXPRESSION_CONTAINS,[PREPROCESSOR,{begin:"\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",end:">",keywords:CPP_KEYWORDS,contains:["self",CPP_PRIMITIVE_TYPES]},{begin:hljs.IDENT_RE+"::",keywords:CPP_KEYWORDS},{className:"class",beginKeywords:"enum class struct union",end:/[{;:<>=]/,contains:[{beginKeywords:"final class struct"},hljs.TITLE_MODE]}]),exports:{preprocessor:PREPROCESSOR,strings:STRINGS,keywords:CPP_KEYWORDS}}}}}]);
//# sourceMappingURL=highlight-cpp.f829875d.iframe.bundle.js.map