window.source = {
  "title": "TabTrap",
  "url": "tab-trap.html",
  "type": "js",
  "content": "import React, {Component} from 'react';\nimport PropTypes from 'prop-types';\n\nimport styles from './tab-trap.css';\n\nexport const FOCUSEABLE_ELEMENTS = 'input, button:not([data-trap-button]), select, textarea, a[href], *[tabindex]';\n\n/**\n * @name TabTrap\n * @category Components\n * @tags Ring UI Language\n * @description Disallows tabbing out of a designated area.\n * @example-file ./tab-trap.examples.html\n */\n\nexport default class TabTrap extends Component {\n  static propTypes = {\n    children: PropTypes.node.isRequired,\n    trapDisabled: PropTypes.bool,\n    autoFocusFirst: PropTypes.bool,\n    focusBackOnClose: PropTypes.bool\n  };\n\n  static defaultProps = {\n    trapDisabled: false,\n    autoFocusFirst: true,\n    focusBackOnClose: true\n  };\n\n  componentDidMount() {\n    this.previousFocusedNode = document.activeElement;\n\n    if (this.props.autoFocusFirst) {\n      this.focusFirst();\n    } else {\n      this.trapWithoutFocus = true;\n      this.trapButtonNode.focus();\n    }\n  }\n\n  componentWillUnmount() {\n    this.restoreFocus();\n  }\n\n  restoreFocus() {\n    if (!this.props.focusBackOnClose) {\n      return;\n    }\n    const {previousFocusedNode} = this;\n    if (previousFocusedNode && previousFocusedNode.focus) {\n      previousFocusedNode.focus();\n    }\n  }\n\n  containerRef = node => {\n    if (!node) {\n      return;\n    }\n    this.node = node;\n  };\n\n  focusElement = (first = true) => {\n    const {node} = this;\n    if (!node) {\n      return;\n    }\n\n    const tabbables = [...node.querySelectorAll(FOCUSEABLE_ELEMENTS)].\n      filter(item => item.tabIndex >= 0);\n\n    const toBeFocused = first ? tabbables[0] : tabbables[tabbables.length - 1];\n\n    if (toBeFocused) {\n      toBeFocused.focus();\n    }\n  };\n\n  focusFirst = () => this.focusElement(true);\n\n  focusLast = () => this.focusElement(false);\n\n  focusLastIfEnabled = () => {\n    if (this.trapWithoutFocus) {\n      return;\n    }\n    this.focusLast();\n  };\n\n  handleBlurIfWithoutFocus = event => {\n    if (!this.trapWithoutFocus) {\n      return;\n    }\n    this.trapWithoutFocus = false;\n\n    const newFocused = event.nativeEvent.relatedTarget;\n    if (!newFocused) {\n      return;\n    }\n\n    if (this.node.contains(newFocused)) {\n      return;\n    }\n\n    this.focusLast();\n  };\n\n  trapButtonRef = node => {\n    if (!node) {\n      return;\n    }\n\n    this.trapButtonNode = node;\n  };\n\n  render() {\n    // eslint-disable-next-line no-unused-vars\n    const {children, trapDisabled, autoFocusFirst, focusBackOnClose, ...restProps} = this.props;\n\n    if (trapDisabled) {\n      return (\n        <div\n          ref={this.containerRef}\n          {...restProps}\n        >\n          {children}\n        </div>\n      );\n    }\n\n    return (\n      <div\n        ref={this.containerRef}\n        {...restProps}\n      >\n        <button\n          type=\"button\"\n          ref={this.trapButtonRef}\n          className={styles.trapButton}\n          onFocus={this.focusLastIfEnabled}\n          onBlur={this.handleBlurIfWithoutFocus}\n          data-trap-button\n        />\n        {children}\n        <button\n          type=\"button\"\n          className={styles.trapButton}\n          onFocus={this.focusFirst}\n          data-trap-button\n        />\n      </div>\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "TabTrap",
      "url": "examples/tab-trap/tab-trap.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"tab-trap\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport TabTrap from '@jetbrains/ring-ui/components/tab-trap/tab-trap';\nimport Input from '@jetbrains/ring-ui/components/input/input';\nimport Button from '@jetbrains/ring-ui/components/button/button';\nimport Link from '@jetbrains/ring-ui/components/link/link';\nimport Group from '@jetbrains/ring-ui/components/group/group';\n\nconst renderDemo = () => (\n<div>\n  <Button>Outside of trap</Button>\n\n  <h4>Trap start</h4>\n  <TabTrap>\n    <Input placeholder=\"inside trap\" autoFocus/>\n    <Group>\n      <Button>\n        Test\n      </Button>\n      <Link href=\"#\">Test link</Link>\n    </Group>\n  </TabTrap>\n\n  <h4>Trap end</h4>\n\n  <Button>Outside of trap</Button>\n</div>\n);\n\nrender(renderDemo(), document.getElementById('tab-trap'));\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Disallows tabbing out of a designated area.",
  "attrs": {
    "name": "TabTrap",
    "category": "Components",
    "tags": "Ring UI Language",
    "description": "Disallows tabbing out of a designated area.",
    "example-file": "./tab-trap.examples.html"
  }
};