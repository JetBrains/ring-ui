window.source = {
  "title": "Markdown",
  "url": "markdown.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport ReactMarkdown from 'react-markdown';\nimport classNames from 'classnames';\nimport RemarkBreaks from 'remark-breaks';\n\nimport normalizeIndent from '../global/normalize-indent';\nimport trivialTemplateTag from '../global/trivial-template-tag';\n\nimport Code from './code';\nimport Link from './link';\nimport Heading from './heading';\nimport styles from './markdown.css';\n\n/**\n  * @name Markdown\n  * @category Components\n  * @tags Ring UI Language\n  * @framework React\n  * @constructor\n  * @description Renders Markdown.\n  * @example-file ./markdown.examples.html\n*/\n\nexport default class Markdown extends PureComponent {\n  static propTypes = {\n    inline: PropTypes.bool,\n    source: PropTypes.string,\n    className: PropTypes.string,\n    renderers: PropTypes.object\n  };\n\n  render() {\n    const {className, renderers, inline, source, ...restProps} = this.props;\n\n    const classes = classNames(className, {\n      [styles.markdown]: !inline,\n      [styles.inline]: inline\n    });\n\n    return (\n      <ReactMarkdown\n        className={classes}\n        source={normalizeIndent(source)}\n        plugins={[RemarkBreaks]}\n        renderers={{\n          link: Link,\n          linkReference: Link,\n          code: Code,\n          inlineCode: Code,\n          heading: Heading,\n          ...renderers\n        }}\n        {...restProps}\n      />\n    );\n  }\n}\n\nconst md = trivialTemplateTag(source => <Markdown {...{source}}/>);\n\nexport {md};\n",
  "examples": [
    {
      "name": "Markdown",
      "url": "examples/markdown/markdown.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"markdown\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\n\nimport Markdown from '@jetbrains/ring-ui/components/markdown/markdown';\n\nconst demo = (\n  <Markdown\n    source={`\n      # Header\n\n      _Various_ types of **highlighting**\n\n      [Link](/)\n\n      [Link with definition][definition]\n\n      [definition]: /\n\n      > Blockquote\n      >\n      > Second line\n\n      Unordered list:\n\n      * List\n      * List\n\n      Ordered list:\n\n      1. One\n      2. Two\n\n      Horizontal line\n\n      ---\n      Some \\`inline(code)\\` inside text\n\n      ## Block code\n      \\`\\`\\`js\n      import React, {Component} from 'react';\n      import ChildComponent from './child-component';\n\n      const MyComponent = () => (\n        <div className=\"class\">\n          <ChildComponent prop=\"value\" />\n        </div>\n      );\n      \\`\\`\\`\n    `}\n  />\n);\nrender(demo, document.getElementById('markdown'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Markdown as tagged template",
      "url": "examples/markdown/markdown-as-tagged-template.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"markdown\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\n\nimport {md} from '@jetbrains/ring-ui/components/markdown/markdown';\n\nconst demo = md`\n  # Header\n\n  _Various_ types of **highlighting**\n\n  [Link](/)\n\n  [Link with definition][definition]\n\n  [definition]: /\n\n  > Blockquote\n  >\n  > Second line\n\n  Unordered list:\n\n  * List\n  * List\n\n  Ordered list:\n\n  1. One\n  2. Two\n\n  Horizontal line\n\n  ---\n  Some \\`inline(code)\\` inside text\n\n  ## Block code\n  \\`\\`\\`js\n  import React from 'react';\n\n  import {md} from '@jetbrains/ring-ui/components/markdown/markdown';\n\n  const MarkdownHeader = ({children}) => md\\`#\\${children}\\`;\n  \\`\\`\\`\n`;\nrender(demo, document.getElementById('markdown'));\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Renders Markdown.",
  "attrs": {
    "name": "Markdown",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "Renders Markdown.",
    "example-file": "./markdown.examples.html"
  }
};