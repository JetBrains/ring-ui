(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[6576],{36632:module=>{const TAGS=["a","abbr","address","article","aside","audio","b","blockquote","body","button","canvas","caption","cite","code","dd","del","details","dfn","div","dl","dt","em","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","html","i","iframe","img","input","ins","kbd","label","legend","li","main","mark","menu","nav","object","ol","p","q","quote","samp","section","span","strong","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","ul","var","video"],MEDIA_FEATURES=["any-hover","any-pointer","aspect-ratio","color","color-gamut","color-index","device-aspect-ratio","device-height","device-width","display-mode","forced-colors","grid","height","hover","inverted-colors","monochrome","orientation","overflow-block","overflow-inline","pointer","prefers-color-scheme","prefers-contrast","prefers-reduced-motion","prefers-reduced-transparency","resolution","scan","scripting","update","width","min-width","max-width","min-height","max-height"],PSEUDO_CLASSES=["active","any-link","blank","checked","current","default","defined","dir","disabled","drop","empty","enabled","first","first-child","first-of-type","fullscreen","future","focus","focus-visible","focus-within","has","host","host-context","hover","indeterminate","in-range","invalid","is","lang","last-child","last-of-type","left","link","local-link","not","nth-child","nth-col","nth-last-child","nth-last-col","nth-last-of-type","nth-of-type","only-child","only-of-type","optional","out-of-range","past","placeholder-shown","read-only","read-write","required","right","root","scope","target","target-within","user-invalid","valid","visited","where"],PSEUDO_ELEMENTS=["after","backdrop","before","cue","cue-region","first-letter","first-line","grammar-error","marker","part","placeholder","selection","slotted","spelling-error"],ATTRIBUTES=["align-content","align-items","align-self","animation","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-timing-function","auto","backface-visibility","background","background-attachment","background-clip","background-color","background-image","background-origin","background-position","background-repeat","background-size","border","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-decoration-break","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","clear","clip","clip-path","color","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","content","counter-increment","counter-reset","cursor","direction","display","empty-cells","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-size","font-size-adjust","font-smoothing","font-stretch","font-style","font-variant","font-variant-ligatures","font-variation-settings","font-weight","height","hyphens","icon","image-orientation","image-rendering","image-resolution","ime-mode","inherit","initial","justify-content","left","letter-spacing","line-height","list-style","list-style-image","list-style-position","list-style-type","margin","margin-bottom","margin-left","margin-right","margin-top","marks","mask","max-height","max-width","min-height","min-width","nav-down","nav-index","nav-left","nav-right","nav-up","none","normal","object-fit","object-position","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-wrap","overflow-x","overflow-y","padding","padding-bottom","padding-left","padding-right","padding-top","page-break-after","page-break-before","page-break-inside","perspective","perspective-origin","pointer-events","position","quotes","resize","right","src","tab-size","table-layout","text-align","text-align-last","text-decoration","text-decoration-color","text-decoration-line","text-decoration-style","text-indent","text-overflow","text-rendering","text-shadow","text-transform","text-underline-position","top","transform","transform-origin","transform-style","transition","transition-delay","transition-duration","transition-property","transition-timing-function","unicode-bidi","vertical-align","visibility","white-space","widows","width","word-break","word-spacing","word-wrap","z-index"].reverse();module.exports=function scss(hljs){const modes=(hljs=>({IMPORTANT:{className:"meta",begin:"!important"},HEXCOLOR:{className:"number",begin:"#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"},ATTRIBUTE_SELECTOR_MODE:{className:"selector-attr",begin:/\[/,end:/\]/,illegal:"$",contains:[hljs.APOS_STRING_MODE,hljs.QUOTE_STRING_MODE]}}))(hljs),PSEUDO_ELEMENTS$1=PSEUDO_ELEMENTS,PSEUDO_CLASSES$1=PSEUDO_CLASSES,VARIABLE={className:"variable",begin:"(\\$[a-zA-Z-][a-zA-Z0-9_-]*)\\b"};return{name:"SCSS",case_insensitive:!0,illegal:"[=/|']",contains:[hljs.C_LINE_COMMENT_MODE,hljs.C_BLOCK_COMMENT_MODE,{className:"selector-id",begin:"#[A-Za-z0-9_-]+",relevance:0},{className:"selector-class",begin:"\\.[A-Za-z0-9_-]+",relevance:0},modes.ATTRIBUTE_SELECTOR_MODE,{className:"selector-tag",begin:"\\b("+TAGS.join("|")+")\\b",relevance:0},{className:"selector-pseudo",begin:":("+PSEUDO_CLASSES$1.join("|")+")"},{className:"selector-pseudo",begin:"::("+PSEUDO_ELEMENTS$1.join("|")+")"},VARIABLE,{begin:/\(/,end:/\)/,contains:[hljs.CSS_NUMBER_MODE]},{className:"attribute",begin:"\\b("+ATTRIBUTES.join("|")+")\\b"},{begin:"\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b"},{begin:":",end:";",contains:[VARIABLE,modes.HEXCOLOR,hljs.CSS_NUMBER_MODE,hljs.QUOTE_STRING_MODE,hljs.APOS_STRING_MODE,modes.IMPORTANT]},{begin:"@(page|font-face)",lexemes:"@[a-z-]+",keywords:"@page @font-face"},{begin:"@",end:"[{;]",returnBegin:!0,keywords:{$pattern:/[a-z-]+/,keyword:"and or not only",attribute:MEDIA_FEATURES.join(" ")},contains:[{begin:"@[a-z-]+",className:"keyword"},{begin:/[a-z-]+(?=:)/,className:"attribute"},VARIABLE,hljs.QUOTE_STRING_MODE,hljs.APOS_STRING_MODE,modes.HEXCOLOR,hljs.CSS_NUMBER_MODE]}]}}}}]);
//# sourceMappingURL=highlight-scss.dfee4b01.iframe.bundle.js.map