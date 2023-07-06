(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[5207],{"./node_modules/highlight.js/lib/languages/perl.js":module=>{function source(re){return re?"string"==typeof re?re:re.source:null}function concat(...args){return args.map((x=>source(x))).join("")}function either(...args){return"("+args.map((x=>source(x))).join("|")+")"}module.exports=function perl(hljs){const REGEX_MODIFIERS=/[dualxmsipngr]{0,12}/,PERL_KEYWORDS={$pattern:/[\w.]+/,keyword:["abs","accept","alarm","and","atan2","bind","binmode","bless","break","caller","chdir","chmod","chomp","chop","chown","chr","chroot","close","closedir","connect","continue","cos","crypt","dbmclose","dbmopen","defined","delete","die","do","dump","each","else","elsif","endgrent","endhostent","endnetent","endprotoent","endpwent","endservent","eof","eval","exec","exists","exit","exp","fcntl","fileno","flock","for","foreach","fork","format","formline","getc","getgrent","getgrgid","getgrnam","gethostbyaddr","gethostbyname","gethostent","getlogin","getnetbyaddr","getnetbyname","getnetent","getpeername","getpgrp","getpriority","getprotobyname","getprotobynumber","getprotoent","getpwent","getpwnam","getpwuid","getservbyname","getservbyport","getservent","getsockname","getsockopt","given","glob","gmtime","goto","grep","gt","hex","if","index","int","ioctl","join","keys","kill","last","lc","lcfirst","length","link","listen","local","localtime","log","lstat","lt","ma","map","mkdir","msgctl","msgget","msgrcv","msgsnd","my","ne","next","no","not","oct","open","opendir","or","ord","our","pack","package","pipe","pop","pos","print","printf","prototype","push","q|0","qq","quotemeta","qw","qx","rand","read","readdir","readline","readlink","readpipe","recv","redo","ref","rename","require","reset","return","reverse","rewinddir","rindex","rmdir","say","scalar","seek","seekdir","select","semctl","semget","semop","send","setgrent","sethostent","setnetent","setpgrp","setpriority","setprotoent","setpwent","setservent","setsockopt","shift","shmctl","shmget","shmread","shmwrite","shutdown","sin","sleep","socket","socketpair","sort","splice","split","sprintf","sqrt","srand","stat","state","study","sub","substr","symlink","syscall","sysopen","sysread","sysseek","system","syswrite","tell","telldir","tie","tied","time","times","tr","truncate","uc","ucfirst","umask","undef","unless","unlink","unpack","unshift","untie","until","use","utime","values","vec","wait","waitpid","wantarray","warn","when","while","write","x|0","xor","y|0"].join(" ")},SUBST={className:"subst",begin:"[$@]\\{",end:"\\}",keywords:PERL_KEYWORDS},METHOD={begin:/->\{/,end:/\}/},VAR={variants:[{begin:/\$\d/},{begin:concat(/[$%@](\^\w\b|#\w+(::\w+)*|\{\w+\}|\w+(::\w*)*)/,"(?![A-Za-z])(?![@$%])")},{begin:/[$%@][^\s\w{]/,relevance:0}]},STRING_CONTAINS=[hljs.BACKSLASH_ESCAPE,SUBST,VAR],REGEX_DELIMS=[/!/,/\//,/\|/,/\?/,/'/,/"/,/#/],PAIRED_DOUBLE_RE=(prefix,open,close="\\1")=>{const middle="\\1"===close?close:concat(close,open);return concat(concat("(?:",prefix,")"),open,/(?:\\.|[^\\\/])*?/,middle,/(?:\\.|[^\\\/])*?/,close,REGEX_MODIFIERS)},PAIRED_RE=(prefix,open,close)=>concat(concat("(?:",prefix,")"),open,/(?:\\.|[^\\\/])*?/,close,REGEX_MODIFIERS),PERL_DEFAULT_CONTAINS=[VAR,hljs.HASH_COMMENT_MODE,hljs.COMMENT(/^=\w/,/=cut/,{endsWithParent:!0}),METHOD,{className:"string",contains:STRING_CONTAINS,variants:[{begin:"q[qwxr]?\\s*\\(",end:"\\)",relevance:5},{begin:"q[qwxr]?\\s*\\[",end:"\\]",relevance:5},{begin:"q[qwxr]?\\s*\\{",end:"\\}",relevance:5},{begin:"q[qwxr]?\\s*\\|",end:"\\|",relevance:5},{begin:"q[qwxr]?\\s*<",end:">",relevance:5},{begin:"qw\\s+q",end:"q",relevance:5},{begin:"'",end:"'",contains:[hljs.BACKSLASH_ESCAPE]},{begin:'"',end:'"'},{begin:"`",end:"`",contains:[hljs.BACKSLASH_ESCAPE]},{begin:/\{\w+\}/,relevance:0},{begin:"-?\\w+\\s*=>",relevance:0}]},{className:"number",begin:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",relevance:0},{begin:"(\\/\\/|"+hljs.RE_STARTERS_RE+"|\\b(split|return|print|reverse|grep)\\b)\\s*",keywords:"split return print reverse grep",relevance:0,contains:[hljs.HASH_COMMENT_MODE,{className:"regexp",variants:[{begin:PAIRED_DOUBLE_RE("s|tr|y",either(...REGEX_DELIMS))},{begin:PAIRED_DOUBLE_RE("s|tr|y","\\(","\\)")},{begin:PAIRED_DOUBLE_RE("s|tr|y","\\[","\\]")},{begin:PAIRED_DOUBLE_RE("s|tr|y","\\{","\\}")}],relevance:2},{className:"regexp",variants:[{begin:/(m|qr)\/\//,relevance:0},{begin:PAIRED_RE("(?:m|qr)?",/\//,/\//)},{begin:PAIRED_RE("m|qr",either(...REGEX_DELIMS),/\1/)},{begin:PAIRED_RE("m|qr",/\(/,/\)/)},{begin:PAIRED_RE("m|qr",/\[/,/\]/)},{begin:PAIRED_RE("m|qr",/\{/,/\}/)}]}]},{className:"function",beginKeywords:"sub",end:"(\\s*\\(.*?\\))?[;{]",excludeEnd:!0,relevance:5,contains:[hljs.TITLE_MODE]},{begin:"-\\w\\b",relevance:0},{begin:"^__DATA__$",end:"^__END__$",subLanguage:"mojolicious",contains:[{begin:"^@@.*",end:"$",className:"comment"}]}];return SUBST.contains=PERL_DEFAULT_CONTAINS,METHOD.contains=PERL_DEFAULT_CONTAINS,{name:"Perl",aliases:["pl","pm"],keywords:PERL_KEYWORDS,contains:PERL_DEFAULT_CONTAINS}}}}]);