(globalThis.webpackChunk_jetbrains_ring_ui=globalThis.webpackChunk_jetbrains_ring_ui||[]).push([[7549],{"./node_modules/highlight.js/lib/languages/llvm.js":module=>{function concat(...args){return args.map((x=>function source(re){return re?"string"==typeof re?re:re.source:null}(x))).join("")}module.exports=function llvm(hljs){const IDENT_RE=/([-a-zA-Z$._][\w$.-]*)/,VARIABLE={className:"variable",variants:[{begin:concat(/%/,IDENT_RE)},{begin:/%\d+/},{begin:/#\d+/}]},FUNCTION={className:"title",variants:[{begin:concat(/@/,IDENT_RE)},{begin:/@\d+/},{begin:concat(/!/,IDENT_RE)},{begin:concat(/!\d+/,IDENT_RE)},{begin:/!\d+/}]};return{name:"LLVM IR",keywords:"begin end true false declare define global constant private linker_private internal available_externally linkonce linkonce_odr weak weak_odr appending dllimport dllexport common default hidden protected extern_weak external thread_local zeroinitializer undef null to tail target triple datalayout volatile nuw nsw nnan ninf nsz arcp fast exact inbounds align addrspace section alias module asm sideeffect gc dbg linker_private_weak attributes blockaddress initialexec localdynamic localexec prefix unnamed_addr ccc fastcc coldcc x86_stdcallcc x86_fastcallcc arm_apcscc arm_aapcscc arm_aapcs_vfpcc ptx_device ptx_kernel intel_ocl_bicc msp430_intrcc spir_func spir_kernel x86_64_sysvcc x86_64_win64cc x86_thiscallcc cc c signext zeroext inreg sret nounwind noreturn noalias nocapture byval nest readnone readonly inlinehint noinline alwaysinline optsize ssp sspreq noredzone noimplicitfloat naked builtin cold nobuiltin noduplicate nonlazybind optnone returns_twice sanitize_address sanitize_memory sanitize_thread sspstrong uwtable returned type opaque eq ne slt sgt sle sge ult ugt ule uge oeq one olt ogt ole oge ord uno ueq une x acq_rel acquire alignstack atomic catch cleanup filter inteldialect max min monotonic nand personality release seq_cst singlethread umax umin unordered xchg add fadd sub fsub mul fmul udiv sdiv fdiv urem srem frem shl lshr ashr and or xor icmp fcmp phi call trunc zext sext fptrunc fpext uitofp sitofp fptoui fptosi inttoptr ptrtoint bitcast addrspacecast select va_arg ret br switch invoke unwind unreachable indirectbr landingpad resume malloc alloca free load store getelementptr extractelement insertelement shufflevector getresult extractvalue insertvalue atomicrmw cmpxchg fence argmemonly double",contains:[{className:"type",begin:/\bi\d+(?=\s|\b)/},hljs.COMMENT(/;\s*$/,null,{relevance:0}),hljs.COMMENT(/;/,/$/),hljs.QUOTE_STRING_MODE,{className:"string",variants:[{begin:/"/,end:/[^\\]"/}]},FUNCTION,{className:"punctuation",relevance:0,begin:/,/},{className:"operator",relevance:0,begin:/=/},VARIABLE,{className:"symbol",variants:[{begin:/^\s*[a-z]+:/}],relevance:0},{className:"number",variants:[{begin:/0[xX][a-fA-F0-9]+/},{begin:/-?\d+(?:[.]\d+)?(?:[eE][-+]?\d+(?:[.]\d+)?)?/}],relevance:0}]}}}}]);