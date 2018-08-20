window.source = {
  "title": "Panel",
  "url": "panel.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport styles from './panel.css';\n\n/**\n * @name Panel\n * @category Components\n * @tags Ring UI Language\n * @constructor\n * @description Displays a button panel.\n * @extends {ReactComponent}\n * @example\n   <example name=\"Panel\">\n     <file name=\"index.html\">\n       <div id=\"panel\"></div>\n     </file>\n\n     <file name=\"index.js\" webpack=\"true\">\n       import React from 'react';\n       import {render} from 'react-dom';\n       import Panel from '@jetbrains/ring-ui/components/panel/panel';\n       import Button from '@jetbrains/ring-ui/components/button/button';\n\n       render(\n         (\n           <Panel>\n             <Button blue>{'Apply changes'}</Button>\n             <Button>{'Cancel'}</Button>\n           </Panel>\n         ),\n         document.getElementById('panel')\n       );\n     </file>\n   </example>\n */\nexport default class Panel extends PureComponent {\n  static propTypes = {\n    className: PropTypes.string,\n    children: PropTypes.node\n  };\n\n  render() {\n    const {className, children, ...props} = this.props;\n    const classes = classNames(styles.panel, className);\n    return (\n      <div\n        {...props}\n        className={classes}\n      >\n        {children}\n      </div>\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "Panel",
      "url": "examples/panel/panel.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"panel\"></div>\n     ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Panel from '@jetbrains/ring-ui/components/panel/panel';\nimport Button from '@jetbrains/ring-ui/components/button/button';\n\nrender(\n  (\n    <Panel>\n      <Button blue>{'Apply changes'}</Button>\n      <Button>{'Cancel'}</Button>\n    </Panel>\n  ),\n  document.getElementById('panel')\n);\n     ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a button panel.",
  "attrs": {
    "name": "Panel",
    "category": "Components",
    "tags": "Ring UI Language",
    "constructor": "",
    "description": "Displays a button panel.",
    "extends": "{ReactComponent}",
    "example": "   <example name=\"Panel\">\n     <file name=\"index.html\">\n       <div id=\"panel\"></div>\n     </file>\n\n     <file name=\"index.js\" webpack=\"true\">\n       import React from 'react';\n       import {render} from 'react-dom';\n       import Panel from '@jetbrains/ring-ui/components/panel/panel';\n       import Button from '@jetbrains/ring-ui/components/button/button';\n\n       render(\n         (\n           <Panel>\n             <Button blue>{'Apply changes'}</Button>\n             <Button>{'Cancel'}</Button>\n           </Panel>\n         ),\n         document.getElementById('panel')\n       );\n     </file>\n   </example>"
  }
};