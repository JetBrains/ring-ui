window.source = {
  "title": "Code",
  "url": "code.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport normalizeIndent from '../global/normalize-indent';\nimport trivialTemplateTag from '../global/trivial-template-tag';\n\nimport highlight from './highlight';\nimport styles from './code.css';\n\nfunction noop() {}\n\n/**\n * @name Code\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description Shows a block of code. By default highlights following languages: _cpp, xml, bash, clojure, coffeescript, cs, css, markdown, dockerfile, elixir, elm, ruby, erlang, glsl, go, gradle, groovy, handlebars, haskell, ava, javascript, json, kotlin, less, livescript, lua, makefile, perl, php, powershell, python, r, rust, scala, scss, shell, sql, swift, yaml, twig, typescript_.\n * But it's possible to enable support for  other languages manually:\n * ```\n * import {highlight} from '@jetbrains/ring-ui/components/code/code'\n * import 1c from 'highlight.js/lib/languages/1c';\n * highlight.registerLanguage('1c', 1c);\n * ```\n * @example-file ./code.examples.html\n */\n\nexport default class Code extends PureComponent {\n  static propTypes = {\n    className: PropTypes.string,\n    code: PropTypes.string.isRequired,\n    inline: PropTypes.bool,\n    language: PropTypes.string,\n    replacer: PropTypes.func\n  };\n\n  static defaultProps = {\n    inline: false,\n    replacer: noop\n  };\n\n  componentDidMount() {\n    this.highlight();\n  }\n\n  componentDidUpdate() {\n    this.highlight();\n  }\n\n  highlight() {\n    if (!this.props.inline) {\n      highlight.highlightBlock(this.code);\n    }\n    this.props.replacer(this.code);\n  }\n\n  codeRef = el => {\n    this.code = el;\n  };\n\n  render() {\n    const {code, className, inline, language} = this.props;\n\n    const Tag = inline ? 'span' : 'pre';\n    const classes = classNames(styles.code, className, language, {\n      [styles.inline]: inline\n    });\n\n    return (\n      <Tag className={classes}>\n        <code ref={this.codeRef}>{normalizeIndent(code)}</code>\n      </Tag>\n    );\n  }\n}\n\nconst code = trivialTemplateTag(source => <Code code={source}/>);\n\nexport {code, highlight};\n",
  "examples": [
    {
      "name": "Code",
      "url": "examples/code/code.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"code\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\n\nimport Code from '@jetbrains/ring-ui/components/code/code';\n\nconst container = document.getElementById('code');\nconst demo = (\n  <Code\n    code={`\n      import React, {Component} from 'react';\n      import ChildComponent from './child-component';\n\n      const MyComponent = () => (\n        <div className=\"class\">\n          <ChildComponent prop=\"value\" />\n        </div>\n      );\n    `}\n  />\n);\n\nrender(demo, container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Code as tagged template",
      "url": "examples/code/code-as-tagged-template.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"code\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\n\nimport {code} from '@jetbrains/ring-ui/components/code/code';\n\nconst container = document.getElementById('code');\nconst demo = code`\n  import React from 'react';\n  import {code} from '@jetbrains/ring-ui/components/code/code';\n\n  const el = code\\`some('js')\\`;\n`;\n\nrender(demo, container);\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Shows a block of code. By default highlights following languages: _cpp, xml, bash, clojure, coffeescript, cs, css, markdown, dockerfile, elixir, elm, ruby, erlang, glsl, go, gradle, groovy, handlebars, haskell, ava, javascript, json, kotlin, less, livescript, lua, makefile, perl, php, powershell, python, r, rust, scala, scss, shell, sql, swift, yaml, twig, typescript_.\nBut it's possible to enable support for  other languages manually:\n```\nimport {highlight} from '@jetbrains/ring-ui/components/code/code'\nimport 1c from 'highlight.js/lib/languages/1c';\nhighlight.registerLanguage('1c', 1c);\n```",
  "attrs": {
    "name": "Code",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "Shows a block of code. By default highlights following languages: _cpp, xml, bash, clojure, coffeescript, cs, css, markdown, dockerfile, elixir, elm, ruby, erlang, glsl, go, gradle, groovy, handlebars, haskell, ava, javascript, json, kotlin, less, livescript, lua, makefile, perl, php, powershell, python, r, rust, scala, scss, shell, sql, swift, yaml, twig, typescript_.\nBut it's possible to enable support for  other languages manually:\n```\nimport {highlight} from '@jetbrains/ring-ui/components/code/code'\nimport 1c from 'highlight.js/lib/languages/1c';\nhighlight.registerLanguage('1c', 1c);\n```",
    "example-file": "./code.examples.html"
  }
};