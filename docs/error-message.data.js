window.source = {
  "title": "Error Message",
  "url": "error-message.html",
  "type": "js",
  "content": "import React, {Component} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport Icon from '../icon';\nimport {Color, Size} from '../icon/icon__constants';\n\nimport styles from './error-message.css';\n\n\n/**\n * @name Error Message\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description Displays an error message centered both vertically and horizontally inside the parent container.\n * @example-file ./error-message.examples.html\n */\n\nexport default class ErrorMessage extends Component {\n  static propTypes = {\n    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),\n    code: PropTypes.string,\n    message: PropTypes.string,\n    description: PropTypes.string,\n    children: PropTypes.node,\n    className: PropTypes.string\n  };\n\n\n  render() {\n    const {className, icon, code, message, description, children} = this.props;\n    const classes = classNames(styles.errorMessage, className);\n\n    return (\n      <div className={classes}>\n        {icon && (\n          <Icon\n            className={styles.icon}\n            glyph={icon}\n            size={Size.Size64}\n            color={Color.GRAY}\n          />\n        )}\n        <div className={styles.content}>\n          <div className={styles.title}>\n            {code && `${code}:`} {message}\n          </div>\n          {description && (\n            <div className={styles.description}>\n              {description}\n            </div>\n          )}\n          {children}\n        </div>\n      </div>\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "Error Message",
      "url": "examples/error-message/error-message.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"error-message\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.parent) {\nheight: 450px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport ErrorMessage from '@jetbrains/ring-ui/components/error-message/error-message';\nimport Link from '@jetbrains/ring-ui/components/link/link';\nimport {FrownIcon} from '@jetbrains/ring-ui/components/icon';\n\n\nconst renderErrorMessageDemo = () => (\n<div className='parent'>\n  <ErrorMessage\n    icon={FrownIcon}\n    code=\"Disconnected\"\n    message=\"no answer from server.\"\n    description=\"Please try again soon.\"\n  >\n    <Link href=\"/\">Go to the home page</Link>\n  </ErrorMessage>\n</div>\n);\n\nrender(renderErrorMessageDemo(), document.getElementById('error-message'));\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays an error message centered both vertically and horizontally inside the parent container.",
  "attrs": {
    "name": "Error Message",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "Displays an error message centered both vertically and horizontally inside the parent container.",
    "example-file": "./error-message.examples.html"
  }
};