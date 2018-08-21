window.source = {
  "title": "Button Set",
  "url": "button-set.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport classNames from 'classnames';\nimport PropTypes from 'prop-types';\n\nimport styles from './button-set.css';\n\n/**\n * @name Button Set\n * @category Components\n * @tags Ring UI Language\n * @constructor\n * @description Allows to group several buttons and ensures that margins between them are consistent.\n * @extends {ReactComponent}\n * @example-file ./button-set.examples.html\n */\nexport default class ButtonSet extends PureComponent {\n  static propTypes = {\n    children: PropTypes.node,\n    className: PropTypes.string\n  };\n\n  render() {\n    const classes = classNames(styles.buttonSet, this.props.className);\n    return (\n      <div\n        {...this.props}\n        className={classes}\n      >\n        {this.props.children}\n      </div>\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "Button Set",
      "url": "examples/button-set/button-set.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div>\n  <p>\n    <span id=\"button-set\"></span>\n  </p>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Button from '@jetbrains/ring-ui/components/button/button';\nimport ButtonSet from '@jetbrains/ring-ui/components/button-set/button-set';\n\nrender(\n  <ButtonSet>\n    <Button>1st button</Button>\n    <Button>2nd button</Button>\n    <Button>3rd button</Button>\n  </ButtonSet>\n  , document.getElementById('button-set')\n);\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Allows to group several buttons and ensures that margins between them are consistent.",
  "attrs": {
    "name": "Button Set",
    "category": "Components",
    "tags": "Ring UI Language",
    "constructor": "",
    "description": "Allows to group several buttons and ensures that margins between them are consistent.",
    "extends": "{ReactComponent}",
    "example-file": "./button-set.examples.html"
  }
};