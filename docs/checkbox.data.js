window.source = {
  "title": "Checkbox",
  "url": "checkbox.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport {CheckmarkIcon} from '../icon';\n\nimport styles from './checkbox.css';\n\n/**\n * @name Checkbox\n * @category Components\n * @tags Ring UI Language\n * @constructor\n * @extends {ReactComponent}\n * @example-file ./checkbox.examples.html\n */\nexport default class Checkbox extends PureComponent {\n\n  static propTypes = {\n    name: PropTypes.string,\n    label: PropTypes.string,\n    className: PropTypes.string,\n    defaultChecked: PropTypes.bool,\n    checked: PropTypes.bool,\n    disabled: PropTypes.bool,\n    onChange: PropTypes.func,\n    children: PropTypes.node\n  };\n\n  inputRef = el => {\n    this.input = el;\n  };\n\n  render() {\n    const {children, label, ...restProps} = this.props;\n\n    const classes = classNames(\n      styles.input,\n      this.props.className\n    );\n\n    return (\n      <label\n        className={styles.checkbox}\n        data-test=\"ring-checkbox\"\n      >\n        <input\n          {...restProps}\n          ref={this.inputRef}\n          type=\"checkbox\"\n          className={classes}\n        />\n        <span className={styles.cell}>\n          <CheckmarkIcon\n            className={styles.icon}\n            size={CheckmarkIcon.Size.Size14}\n          />\n        </span>\n        <span className={styles.label}>{label || children}</span>\n      </label>\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "Checkbox",
      "url": "examples/checkbox/checkbox.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<h1>Base Examples</h1>\n<div id=\"checkbox-base\">\n  <span id=\"checkbox\"></span>\n  <span id=\"checkbox-selected\"></span>\n</div>\n\n<h1>Disabled checkboxes</h1>\n<div id=\"checkbox-base\">\n  <span id=\"checkbox-disabled\"></span>\n  <span id=\"checkbox-disabled-selected\"></span>\n</div>\n\n<h1>Examples with outer styles</h1>\n<div id=\"checkbox-additional\">\n  <div style=\"line-height: 60px\">\n    <span id=\"checkbox-in-large-line-height-div\"></span>\n    <span>This text should be aligned on same line with checkbox label</span>\n  </div>\n  <div style=\"line-height: 6px;\">\n    <span id=\"checkbox-in-small-line-height-div\"></span>\n    <span>This text should be aligned on same line with checkbox label</span>\n  </div>\n  <div style=\"line-height: 48px; font-size: 40px\">\n    <span id=\"checkbox-in-large-font-div\"></span>\n    <span>This text should be aligned on same line with checkbox label</span>\n  </div>\n  <div style=\"line-height: 6px; font-size: 4px\">\n    <span id=\"checkbox-in-small-font-div\"></span>\n    <span>This text should be aligned on same line with checkbox label</span>\n  </div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\nimport Checkbox from '@jetbrains/ring-ui/components/checkbox/checkbox';\n\nrender(<Checkbox />, document.getElementById('checkbox'));\n\nrender(\n  <Checkbox defaultChecked/>,\n  document.getElementById('checkbox-selected')\n);\n\nrender(\n  <Checkbox disabled/>,\n  document.getElementById('checkbox-disabled')\n);\n\nrender(\n  <Checkbox disabled defaultChecked/>,\n  document.getElementById('checkbox-disabled-selected')\n);\n\nrender(\n  <Checkbox\n    defaultChecked\n  >This checkbox is inside a div with large line-height.</Checkbox>,\n  document.getElementById('checkbox-in-large-line-height-div')\n);\n\nrender(\n  <Checkbox\n    defaultChecked\n  >This checkbox is inside a div with small line-height.</Checkbox>,\n  document.getElementById('checkbox-in-small-line-height-div')\n);\n\nrender(\n  <Checkbox\n    defaultChecked\n  >This checkbox is inside a div with large font-size.</Checkbox>,\n  document.getElementById('checkbox-in-large-font-div')\n);\n\nrender(\n  <Checkbox\n    defaultChecked\n  >This checkbox is inside a div with small font-size.</Checkbox>,\n  document.getElementById('checkbox-in-small-font-div')\n);\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "attrs": {
    "name": "Checkbox",
    "category": "Components",
    "tags": "Ring UI Language",
    "constructor": "",
    "extends": "{ReactComponent}",
    "example-file": "./checkbox.examples.html"
  }
};