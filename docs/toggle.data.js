window.source = {
  "title": "Toggle",
  "url": "toggle.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport styles from './toggle.css';\n\n/**\n  * @name Toggle\n  * @category Components\n  * @tags Ring UI Language\n  * @framework React\n  * @constructor\n  * @description Visual toggle wrapper around checkbox.\n  * @example-file ./toggle.examples.html\n  */\n\nexport default class Toggle extends PureComponent {\n  static propTypes = {\n    children: PropTypes.node,\n    name: PropTypes.string,\n    className: PropTypes.string,\n    title: PropTypes.string,\n    defaultChecked: PropTypes.bool,\n    checked: PropTypes.bool,\n    disabled: PropTypes.bool,\n    pale: PropTypes.bool,\n    onChange: PropTypes.func,\n    onTransitionEnd: PropTypes.func\n  };\n\n  render() {\n    const {className, children, disabled, pale, title, onTransitionEnd, ...restProps} = this.props;\n\n    const classes = classNames(\n      className,\n      styles.toggle,\n      disabled && styles.disabled\n    );\n\n    return (\n      <label className={classes} title={title}>\n        <span className={styles.switchWrapper}>\n          <input\n            {...restProps}\n            type=\"checkbox\"\n            disabled={disabled}\n            className={styles.input}\n          />\n\n          <span\n            className={classNames(styles.switch, pale && styles.paleSwitch)}\n            onTransitionEnd={onTransitionEnd}\n          />\n        </span>\n\n        {children && <span className={styles.label}>{children}</span>}\n      </label>\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "Toggle",
      "url": "examples/toggle/toggle.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"toggle\">\n  <div>\n    <div>Unchecked by default</div>\n    <div id=\"toggle-unchecked\"/>\n  </div>\n\n  <div>\n    <div>Checked by default</div>\n    <div id=\"toggle-checked\"/>\n  </div>\n\n  <div>\n    <div>Disabled unchecked</div>\n    <div id=\"toggle-unchecked-disabled\"/>\n  </div>\n\n  <div>\n    <div>Disabled checked</div>\n    <div id=\"toggle-checked-disabled\"/>\n  </div>\n\n  <div>\n    <div>Pale unchecked by default</div>\n    <div id=\"pale-toggle-unchecked\"/>\n  </div>\n\n  <div>\n    <div>Pale checked by default</div>\n    <div id=\"pale-toggle-checked\"/>\n  </div>\n\n  <div>\n    <div>Pale disabled unchecked</div>\n    <div id=\"pale-toggle-unchecked-disabled\"/>\n  </div>\n\n  <div>\n    <div>Pale disabled checked</div>\n    <div id=\"pale-toggle-checked-disabled\"/>\n  </div>\n\n  <div>\n    <div>With label</div>\n    <div id=\"with-label\"/>\n  </div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\nimport Toggle from '@jetbrains/ring-ui/components/toggle/toggle';\n\nrender(\n  <Toggle/>,\n  document.getElementById('toggle-unchecked')\n);\n\nrender(\n  <Toggle defaultChecked/>,\n  document.getElementById('toggle-checked')\n);\n\nrender(\n  <Toggle disabled/>,\n  document.getElementById('toggle-unchecked-disabled')\n);\n\nrender(\n  <Toggle disabled defaultChecked/>,\n  document.getElementById('toggle-checked-disabled')\n);\n\nrender(\n  <Toggle pale/>,\n  document.getElementById('pale-toggle-unchecked')\n);\n\nrender(\n  <Toggle pale defaultChecked/>,\n  document.getElementById('pale-toggle-checked')\n);\n\nrender(\n  <Toggle pale disabled/>,\n  document.getElementById('pale-toggle-unchecked-disabled')\n);\n\nrender(\n  <Toggle pale disabled defaultChecked/>,\n  document.getElementById('pale-toggle-checked-disabled')\n);\n\nrender(\n  <Toggle>Label</Toggle>,\n  document.getElementById('with-label')\n);\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Visual toggle wrapper around checkbox.",
  "attrs": {
    "name": "Toggle",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "Visual toggle wrapper around checkbox.",
    "example-file": "./toggle.examples.html"
  }
};