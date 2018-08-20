window.source = {
  "title": "Group",
  "url": "group.html",
  "type": "js",
  "content": "import React, {Component} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport styles from './group.css';\n\n/**\n * @name Group\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description Places inner components with fixed spacing between them.\n * @example\n   <example name=\"Group\">\n     <file name=\"index.html\">\n       <div id=\"group\"></div>\n     </file>\n\n     <file name=\"index.js\">\n       import React, {Component} from 'react';\n       import {render} from 'react-dom';\n\n       import Link from '@jetbrains/ring-ui/components/link/link';\n       import Badge from '@jetbrains/ring-ui/components/badge/badge';\n       import Group from '@jetbrains/ring-ui/components/group/group';\n\n       const container = document.getElementById('group');\n       class GroupDemo extends Component {\n         render() {\n           return (\n             <Group>\n               <Badge valid>Badge</Badge>\n               <span>Text</span>\n               <Link>Link</Link>\n             </Group>\n           );\n         }\n       }\n\n       render(<GroupDemo />, container);\n     </file>\n   </example>\n */\n\nexport default class Group extends Component {\n  static propTypes = {\n    children: PropTypes.node,\n    className: PropTypes.string\n  };\n\n  render() {\n    const {children, className, ...restProps} = this.props;\n    const classes = classNames(styles.group, className);\n\n    return (\n      <span\n        {...restProps}\n        className={classes}\n      >\n        {children}\n      </span>\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "Group",
      "url": "examples/group/group.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"group\"></div>\n     ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component} from 'react';\nimport {render} from 'react-dom';\n\nimport Link from '@jetbrains/ring-ui/components/link/link';\nimport Badge from '@jetbrains/ring-ui/components/badge/badge';\nimport Group from '@jetbrains/ring-ui/components/group/group';\n\nconst container = document.getElementById('group');\nclass GroupDemo extends Component {\n  render() {\n    return (\n      <Group>\n        <Badge valid>Badge</Badge>\n        <span>Text</span>\n        <Link>Link</Link>\n      </Group>\n    );\n  }\n}\n\nrender(<GroupDemo />, container);\n     ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Places inner components with fixed spacing between them.",
  "attrs": {
    "name": "Group",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "Places inner components with fixed spacing between them.",
    "example": "   <example name=\"Group\">\n     <file name=\"index.html\">\n       <div id=\"group\"></div>\n     </file>\n\n     <file name=\"index.js\">\n       import React, {Component} from 'react';\n       import {render} from 'react-dom';\n\n       import Link from '@jetbrains/ring-ui/components/link/link';\n       import Badge from '@jetbrains/ring-ui/components/badge/badge';\n       import Group from '@jetbrains/ring-ui/components/group/group';\n\n       const container = document.getElementById('group');\n       class GroupDemo extends Component {\n         render() {\n           return (\n             <Group>\n               <Badge valid>Badge</Badge>\n               <span>Text</span>\n               <Link>Link</Link>\n             </Group>\n           );\n         }\n       }\n\n       render(<GroupDemo />, container);\n     </file>\n   </example>"
  }
};