window.source = {
  "title": "Badge",
  "url": "badge.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport dataTests from '../global/data-tests';\n\nimport style from './badge.css';\n\n/**\n * @name Badge\n * @category Components\n * @tags Ring UI Language\n * @constructor\n * @description Displays a badge.\n * @extends {PureComponent}\n * @example-file ./badge.examples.html\n */\nexport default class Badge extends PureComponent {\n  static propTypes = {\n    gray: PropTypes.bool,\n    valid: PropTypes.bool,\n    invalid: PropTypes.bool,\n    disabled: PropTypes.bool,\n    className: PropTypes.string,\n    children: PropTypes.node,\n    'data-test': PropTypes.string\n  };\n\n  render() {\n    const {\n      // Modifiers\n      gray,\n      valid,\n      invalid,\n      disabled,\n\n      // Props\n      className,\n      children,\n      'data-test': dataTest,\n      ...props\n    } = this.props;\n\n    const classes = classNames(\n      style.badge,\n      className,\n      {\n        [style.gray]: gray,\n        [style.valid]: valid,\n        [style.invalid]: invalid,\n        [style.disabled]: disabled\n      }\n    );\n\n    return (\n      <span\n        {...props}\n        data-test={dataTests('ring-badge', dataTest)}\n        className={classes}\n      >\n        {children}\n      </span>\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "Badge",
      "url": "examples/badge/badge.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"badges\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport Badge from '@jetbrains/ring-ui/components/badge/badge';\nimport Group from '@jetbrains/ring-ui/components/group/group';\n\nconst renderBadgeDemo = () => (\n  <Group>\n    <Badge>simple</Badge>\n    <Badge gray>gray</Badge>\n    <Badge valid>valid</Badge>\n    <Badge invalid>invalid</Badge>\n    <Badge disabled>disabled</Badge>\n  </Group>\n);\n\nrender(renderBadgeDemo(), document.getElementById('badges'));\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a badge.",
  "attrs": {
    "name": "Badge",
    "category": "Components",
    "tags": "Ring UI Language",
    "constructor": "",
    "description": "Displays a badge.",
    "extends": "{PureComponent}",
    "example-file": "./badge.examples.html"
  }
};