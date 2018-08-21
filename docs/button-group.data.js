window.source = {
  "title": "Button Group",
  "url": "button-group.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport Caption from './caption';\nimport styles from './button-group.css';\n\n/**\n * @name Button Group\n * @tags Ring UI Language\n * @category Components\n * @constructor\n * @description Allows to group several buttons.\n * @extends {ReactComponent}\n * @example-file ./button-group.examples.html\n */\nexport default class ButtonGroup extends PureComponent {\n  static propTypes = {\n    children: PropTypes.node,\n    className: PropTypes.string\n  }\n\n  render() {\n    const {className} = this.props;\n    const classes = classNames(styles.buttonGroup, className);\n\n    return (\n      <div\n        {...this.props}\n        className={classes}\n      />\n    );\n  }\n}\n\nexport {Caption};\n",
  "examples": [
    {
      "name": "Button Group",
      "url": "examples/button-group/button-group.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"button-groups\">\n  <p>\n    <span id=\"button-group\"></span>\n  </p>\n  <p>\n    <span id=\"button-group-with-caption\"></span>\n  </p>\n  <p>\n    <span id=\"button-group-wrapped\"></span>\n  </p>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Button from '@jetbrains/ring-ui/components/button/button';\nimport ButtonGroup, {Caption} from '@jetbrains/ring-ui/components/button-group/button-group';\n\nrender(\n<ButtonGroup>\n  <Button>1st button</Button>\n  <Button>2nd button</Button>\n  <Button>3rd button</Button>\n</ButtonGroup>\n,\ndocument.getElementById('button-group'));\n\nrender(\n<ButtonGroup>\n  <Caption>Side:</Caption>\n  <Button>Left</Button>\n  <Button>Right</Button>\n</ButtonGroup>\n, document.getElementById('button-group-with-caption'));\n\nrender(\n<ButtonGroup>\n  <span><Button>1st button</Button></span>\n  <span><Button>2nd button</Button></span>\n  <Button>3rd button</Button>\n</ButtonGroup>\n, document.getElementById('button-group-wrapped')\n);\n\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Allows to group several buttons.",
  "attrs": {
    "name": "Button Group",
    "tags": "Ring UI Language",
    "category": "Components",
    "constructor": "",
    "description": "Allows to group several buttons.",
    "extends": "{ReactComponent}",
    "example-file": "./button-group.examples.html"
  }
};