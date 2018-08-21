window.source = {
  "title": "Button Toolbar",
  "url": "button-toolbar.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport styles from './button-toolbar.css';\n\n/**\n * @name Button Toolbar\n * @tags Ring UI Language\n * @category Components\n * @framework React\n * @constructor\n * @extends {ReactComponent}\n * @description Displays a toolbar with several buttons.\n * @example\n  <example name=\"Button Toolbar\">\n    <file name=\"index.html\">\n      <div id=\"button-toolbar\"></div>\n    </file>\n    <file name=\"index.js\" webpack=\"true\">\n      import React from 'react';\n      import {render} from 'react-dom';\n\n      import Button from '@jetbrains/ring-ui/components/button/button';\n      import ButtonGroup from '@jetbrains/ring-ui/components/button-group/button-group';\n      import ButtonToolbar from '@jetbrains/ring-ui/components/button-toolbar/button-toolbar';\n\n      const container = document.getElementById('button-toolbar');\n\n      const buttonToolbarDemo = (\n        <ButtonToolbar>\n          <Button primary delayed>Run</Button>\n          <ButtonGroup>\n            <Button>Button one</Button>\n            <Button>Button two</Button>\n            <Button disabled=\"disabled\">Button three</Button>\n          </ButtonGroup>\n          <Button>Another action</Button>\n        </ButtonToolbar>\n      );\n\n      render(buttonToolbarDemo, container);\n    </file>\n  </example>\n*/\n\nexport default class ButtonToolbar extends PureComponent {\n  static propTypes = {\n    children: PropTypes.node,\n    className: PropTypes.string\n  };\n\n  render() {\n    const {className} = this.props;\n    const classes = classNames(styles.buttonToolbar, className);\n\n    return (\n      <div\n        {...this.props}\n        className={classes}\n      />\n    );\n  }\n}\n\n",
  "examples": [
    {
      "name": "Button Toolbar",
      "url": "examples/button-toolbar/button-toolbar.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"button-toolbar\"></div>\n    ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\n\nimport Button from '@jetbrains/ring-ui/components/button/button';\nimport ButtonGroup from '@jetbrains/ring-ui/components/button-group/button-group';\nimport ButtonToolbar from '@jetbrains/ring-ui/components/button-toolbar/button-toolbar';\n\nconst container = document.getElementById('button-toolbar');\n\nconst buttonToolbarDemo = (\n  <ButtonToolbar>\n    <Button primary delayed>Run</Button>\n    <ButtonGroup>\n      <Button>Button one</Button>\n      <Button>Button two</Button>\n      <Button disabled=\"disabled\">Button three</Button>\n    </ButtonGroup>\n    <Button>Another action</Button>\n  </ButtonToolbar>\n);\n\nrender(buttonToolbarDemo, container);\n    ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a toolbar with several buttons.",
  "attrs": {
    "name": "Button Toolbar",
    "tags": "Ring UI Language",
    "category": "Components",
    "framework": "React",
    "constructor": "",
    "extends": "{ReactComponent}",
    "description": "Displays a toolbar with several buttons.",
    "example": "  <example name=\"Button Toolbar\">\n    <file name=\"index.html\">\n      <div id=\"button-toolbar\"></div>\n    </file>\n    <file name=\"index.js\" webpack=\"true\">\n      import React from 'react';\n      import {render} from 'react-dom';\n\n      import Button from '@jetbrains/ring-ui/components/button/button';\n      import ButtonGroup from '@jetbrains/ring-ui/components/button-group/button-group';\n      import ButtonToolbar from '@jetbrains/ring-ui/components/button-toolbar/button-toolbar';\n\n      const container = document.getElementById('button-toolbar');\n\n      const buttonToolbarDemo = (\n        <ButtonToolbar>\n          <Button primary delayed>Run</Button>\n          <ButtonGroup>\n            <Button>Button one</Button>\n            <Button>Button two</Button>\n            <Button disabled=\"disabled\">Button three</Button>\n          </ButtonGroup>\n          <Button>Another action</Button>\n        </ButtonToolbar>\n      );\n\n      render(buttonToolbarDemo, container);\n    </file>\n  </example>"
  }
};