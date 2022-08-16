(self.webpackChunk_jetbrains_ring_ui=self.webpackChunk_jetbrains_ring_ui||[]).push([[5301],{"./node_modules/highlight.js/lib/languages/xquery.js":module=>{module.exports=function xquery(_hljs){return{name:"XQuery",aliases:["xpath","xq"],case_insensitive:!1,illegal:/(proc)|(abstract)|(extends)|(until)|(#)/,keywords:{$pattern:/[a-zA-Z$][a-zA-Z0-9_:-]*/,keyword:"module schema namespace boundary-space preserve no-preserve strip default collation base-uri ordering context decimal-format decimal-separator copy-namespaces empty-sequence except exponent-separator external grouping-separator inherit no-inherit lax minus-sign per-mille percent schema-attribute schema-element strict unordered zero-digit declare import option function validate variable for at in let where order group by return if then else tumbling sliding window start when only end previous next stable ascending descending allowing empty greatest least some every satisfies switch case typeswitch try catch and or to union intersect instance of treat as castable cast map array delete insert into replace value rename copy modify update",type:"item document-node node attribute document element comment namespace namespace-node processing-instruction text construction xs:anyAtomicType xs:untypedAtomic xs:duration xs:time xs:decimal xs:float xs:double xs:gYearMonth xs:gYear xs:gMonthDay xs:gMonth xs:gDay xs:boolean xs:base64Binary xs:hexBinary xs:anyURI xs:QName xs:NOTATION xs:dateTime xs:dateTimeStamp xs:date xs:string xs:normalizedString xs:token xs:language xs:NMTOKEN xs:Name xs:NCName xs:ID xs:IDREF xs:ENTITY xs:integer xs:nonPositiveInteger xs:negativeInteger xs:long xs:int xs:short xs:byte xs:nonNegativeInteger xs:unisignedLong xs:unsignedInt xs:unsignedShort xs:unsignedByte xs:positiveInteger xs:yearMonthDuration xs:dayTimeDuration",literal:"eq ne lt le gt ge is self:: child:: descendant:: descendant-or-self:: attribute:: following:: following-sibling:: parent:: ancestor:: ancestor-or-self:: preceding:: preceding-sibling:: NaN"},contains:[{className:"variable",begin:/[$][\w\-:]+/},{className:"built_in",variants:[{begin:/\barray:/,end:/(?:append|filter|flatten|fold-(?:left|right)|for-each(?:-pair)?|get|head|insert-before|join|put|remove|reverse|size|sort|subarray|tail)\b/},{begin:/\bmap:/,end:/(?:contains|entry|find|for-each|get|keys|merge|put|remove|size)\b/},{begin:/\bmath:/,end:/(?:a(?:cos|sin|tan[2]?)|cos|exp(?:10)?|log(?:10)?|pi|pow|sin|sqrt|tan)\b/},{begin:/\bop:/,end:/\(/,excludeEnd:!0},{begin:/\bfn:/,end:/\(/,excludeEnd:!0},{begin:/[^</$:'"-]\b(?:abs|accumulator-(?:after|before)|adjust-(?:date(?:Time)?|time)-to-timezone|analyze-string|apply|available-(?:environment-variables|system-properties)|avg|base-uri|boolean|ceiling|codepoints?-(?:equal|to-string)|collation-key|collection|compare|concat|contains(?:-token)?|copy-of|count|current(?:-)?(?:date(?:Time)?|time|group(?:ing-key)?|output-uri|merge-(?:group|key))?data|dateTime|days?-from-(?:date(?:Time)?|duration)|deep-equal|default-(?:collation|language)|distinct-values|document(?:-uri)?|doc(?:-available)?|element-(?:available|with-id)|empty|encode-for-uri|ends-with|environment-variable|error|escape-html-uri|exactly-one|exists|false|filter|floor|fold-(?:left|right)|for-each(?:-pair)?|format-(?:date(?:Time)?|time|integer|number)|function-(?:arity|available|lookup|name)|generate-id|has-children|head|hours-from-(?:dateTime|duration|time)|id(?:ref)?|implicit-timezone|in-scope-prefixes|index-of|innermost|insert-before|iri-to-uri|json-(?:doc|to-xml)|key|lang|last|load-xquery-module|local-name(?:-from-QName)?|(?:lower|upper)-case|matches|max|minutes-from-(?:dateTime|duration|time)|min|months?-from-(?:date(?:Time)?|duration)|name(?:space-uri-?(?:for-prefix|from-QName)?)?|nilled|node-name|normalize-(?:space|unicode)|not|number|one-or-more|outermost|parse-(?:ietf-date|json)|path|position|(?:prefix-from-)?QName|random-number-generator|regex-group|remove|replace|resolve-(?:QName|uri)|reverse|root|round(?:-half-to-even)?|seconds-from-(?:dateTime|duration|time)|snapshot|sort|starts-with|static-base-uri|stream-available|string-?(?:join|length|to-codepoints)?|subsequence|substring-?(?:after|before)?|sum|system-property|tail|timezone-from-(?:date(?:Time)?|time)|tokenize|trace|trans(?:form|late)|true|type-available|unordered|unparsed-(?:entity|text)?-?(?:public-id|uri|available|lines)?|uri-collection|xml-to-json|years?-from-(?:date(?:Time)?|duration)|zero-or-one)\b/},{begin:/\blocal:/,end:/\(/,excludeEnd:!0},{begin:/\bzip:/,end:/(?:zip-file|(?:xml|html|text|binary)-entry| (?:update-)?entries)\b/},{begin:/\b(?:util|db|functx|app|xdmp|xmldb):/,end:/\(/,excludeEnd:!0}]},{className:"string",variants:[{begin:/"/,end:/"/,contains:[{begin:/""/,relevance:0}]},{begin:/'/,end:/'/,contains:[{begin:/''/,relevance:0}]}]},{className:"number",begin:/(\b0[0-7_]+)|(\b0x[0-9a-fA-F_]+)|(\b[1-9][0-9_]*(\.[0-9_]+)?)|[0_]\b/,relevance:0},{className:"comment",begin:/\(:/,end:/:\)/,relevance:10,contains:[{className:"doctag",begin:/@\w+/}]},{className:"meta",begin:/%[\w\-:]+/},{className:"title",begin:/\bxquery version "[13]\.[01]"\s?(?:encoding ".+")?/,end:/;/},{beginKeywords:"element attribute comment document processing-instruction",end:/\{/,excludeEnd:!0},{begin:/<([\w._:-]+)(\s+\S*=('|").*('|"))?>/,end:/(\/[\w._:-]+>)/,subLanguage:"xml",contains:[{begin:/\{/,end:/\}/,subLanguage:"xquery"},"self"]}]}}}}]);