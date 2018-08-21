window.source = {
  "title": "Line",
  "url": "line.html",
  "type": "scss",
  "content": "@import \"../global/global\";\n\n/**\n * @name Line\n * @category Style-only\n * @description Draws a horizontal separator.\n * @example\n   <example name=\"Line\">\n     <file type=\"html\">\n       <div>Before</div>\n       <div class=\"ring-line\"></div>\n       <div>After</div>\n     </file>\n     <file type=\"js\">\n       import '@jetbrains/ring-ui/components/line/line.scss';\n     </file>\n   </example>\n */\n\n.ring-line {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background-color: #D8D8D8;\n\n  &_separated {\n    margin: $ring-unit*2 0;\n  }\n\n  &_table {\n    background-color: #BEBEBE;\n  }\n}\n\n",
  "examples": [
    {
      "name": "Line",
      "url": "examples/line/line.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div>Before</div>\n<div class=\"ring-line\"></div>\n<div>After</div>\n     ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport '@jetbrains/ring-ui/components/line/line.scss';\n     ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Draws a horizontal separator.",
  "attrs": {
    "name": "Line",
    "category": "Style-only",
    "description": "Draws a horizontal separator.",
    "example": "   <example name=\"Line\">\n     <file type=\"html\">\n       <div>Before</div>\n       <div class=\"ring-line\"></div>\n       <div>After</div>\n     </file>\n     <file type=\"js\">\n       import '@jetbrains/ring-ui/components/line/line.scss';\n     </file>\n   </example>"
  }
};