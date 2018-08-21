window.source = {
  "title": "Dropdown",
  "url": "dropdown.html",
  "type": "js",
  "content": "import React, {cloneElement, Component} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport dataTests from '../global/data-tests';\n\nimport Anchor from './anchor';\nimport styles from './dropdown.css';\n\n/**\n * @name Dropdown\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description A stateful popup with a clickable anchor.\n * @example-file ./dropdown.examples.html\n */\n\nexport default class Dropdown extends Component {\n  static propTypes = {\n    anchor: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,\n    children: PropTypes.element.isRequired,\n    initShown: PropTypes.bool,\n    className: PropTypes.string,\n    activeClassName: PropTypes.string,\n    clickMode: PropTypes.bool,\n    hoverMode: PropTypes.bool,\n    hoverShowTimeOut: PropTypes.number,\n    hoverHideTimeOut: PropTypes.number,\n    onShow: PropTypes.func,\n    onHide: PropTypes.func,\n    onMouseEnter: PropTypes.func,\n    onMouseLeave: PropTypes.func,\n    'data-test': PropTypes.string\n  };\n\n  static defaultProps = {\n    initShown: false,\n    clickMode: true,\n    hoverMode: false,\n    hoverShowTimeOut: 300,\n    hoverHideTimeOut: 600,\n    onShow: () => {},\n    onHide: () => {},\n    onMouseEnter: () => {},\n    onMouseLeave: () => {}\n  };\n\n  state = {\n    show: this.props.initShown,\n    pinned: false\n  };\n\n  onClick = () => {\n    const {show, pinned} = this.state;\n    let nextPinned = pinned;\n\n    if (this.props.hoverMode) {\n      if (!pinned) {\n        nextPinned = true;\n\n        if (show) {\n          this.setState({pinned: true});\n          return;\n        }\n      } else {\n        nextPinned = false;\n      }\n    }\n\n    this._toggle(!show, nextPinned);\n  };\n\n  onChildCloseAttempt = () => {\n    let nextPinned = this.state.pinned;\n    if (this.props.hoverMode) {\n      nextPinned = false;\n    }\n\n    this._toggle(false, nextPinned);\n  };\n\n  onMouseEnter = event => {\n    this._clearTimer();\n    this.props.onMouseEnter(event);\n\n    this.hoverTimer = setTimeout(() => {\n      if (!this.state.show) {\n        this._toggle(true);\n      }\n    }, this.props.hoverShowTimeOut);\n  };\n\n  onMouseLeave = event => {\n    this.props.onMouseLeave(event);\n    if (this.state.pinned) {\n      return;\n    }\n\n    this._clearTimer();\n\n    this.hoverTimer = setTimeout(() => {\n      if (this.state.show) {\n        this._toggle(false);\n      }\n    }, this.props.hoverHideTimeOut);\n  };\n\n  onContextMenu = () => {\n    if (!this.state.pinned) {\n      this.setState({pinned: true});\n    }\n  };\n\n  toggle(show = !this.state.show) {\n    this._toggle(show);\n  }\n\n  _toggle(show, pinned = this.state.pinned) {\n    this.setState({show, pinned}, () => (show ? this.props.onShow() : this.props.onHide()));\n  }\n\n  _clearTimer() {\n    if (this.hoverTimer) {\n      clearTimeout(this.hoverTimer);\n      this.hoverTimer = null;\n    }\n  }\n\n  render() {\n    const {show, pinned} = this.state;\n    const {\n      initShown, onShow, onHide, hoverShowTimeOut, hoverHideTimeOut, // eslint-disable-line no-unused-vars\n      children, anchor, className, activeClassName, hoverMode, clickMode, 'data-test': dataTest,\n      ...restProps\n    } = this.props;\n\n    const classes = classNames(styles.dropdown, className, {\n      [activeClassName]: activeClassName != null && show\n    });\n\n    let anchorElement;\n\n    switch (typeof anchor) {\n      case 'string':\n        anchorElement = (<Anchor>{anchor}</Anchor>);\n        break;\n      case 'function':\n        anchorElement = anchor({active: show, pinned});\n        break;\n\n      default:\n        anchorElement = anchor;\n    }\n\n    return (\n      <div\n        data-test={dataTests('ring-dropdown', dataTest)}\n        {...restProps}\n        onClick={clickMode ? this.onClick : undefined}\n        onMouseEnter={hoverMode ? this.onMouseEnter : undefined}\n        onMouseLeave={hoverMode ? this.onMouseLeave : undefined}\n        onContextMenu={hoverMode ? this.onContextMenu : undefined}\n        className={classes}\n      >\n        {anchorElement}\n        {cloneElement(children, {\n          hidden: !show,\n          onCloseAttempt: this.onChildCloseAttempt,\n          dontCloseOnAnchorClick: true\n        })}\n      </div>\n    );\n  }\n}\n\nexport {Anchor};\n",
  "examples": [
    {
      "name": "Dropdown",
      "url": "examples/dropdown/dropdown.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"dropdown\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport Dropdown from '@jetbrains/ring-ui/components/dropdown/dropdown';\nimport Popup from '@jetbrains/ring-ui/components/popup/popup';\n\nconst container = document.getElementById('dropdown');\nconst dropdown = (\n<Dropdown\n  anchor=\"Click me\"\n>\n  <Popup>Popup content</Popup>\n</Dropdown>\n);\n\nrender(dropdown, container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Dropdown with custom anchor and popup",
      "url": "examples/dropdown/dropdown-with-custom-anchor-and-popup.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"dropdown\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport Dropdown from '@jetbrains/ring-ui/components/dropdown/dropdown';\nimport Button from '@jetbrains/ring-ui/components/button/button';\nimport PopupMenu from '@jetbrains/ring-ui/components/popup-menu/popup-menu';\n\nconst container = document.getElementById('dropdown');\nconst actions = ['Cut', 'Copy', 'Paste'];\nconst dropdown = (\n  <Dropdown\n    anchor={<Button delayed>Edit</Button>}\n    >\n    <PopupMenu\n      closeOnSelect\n      data={actions.map(label => ({label}))}\n    />\n  </Dropdown>\n);\n\nrender(dropdown, container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Dropdown with activeClassName",
      "url": "examples/dropdown/dropdown-with-active-class-name.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"dropdown\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n@value gray-color, link-hover-color from \"../global/global.css\";\n:global(.chevron) svg {\n  transition: transform 0.3s ease-out;\n  transform-origin: 50% 40%;\n  transform: rotate(0deg);\n}\n\n:global(.rotated) svg {\n  transform: rotate(180deg);\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport Dropdown from '@jetbrains/ring-ui/components/dropdown/dropdown';\nimport Popup from '@jetbrains/ring-ui/components/popup/popup';\nimport Button from '@jetbrains/ring-ui/components/button/button';\nimport {ChevronDownIcon} from '@jetbrains/ring-ui/components/icon';\n\nconst container = document.getElementById('dropdown');\nconst dropdown = (\n  <Dropdown\n    className=\"chevron\"\n    activeClassName=\"rotated\"\n    anchor={<Button icon={ChevronDownIcon}/>}\n  >\n    <Popup>Popup content</Popup>\n  </Dropdown>\n);\n\nrender(dropdown, container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Dropdown with hover mode",
      "url": "examples/dropdown/dropdown-with-hover-mode.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"dropdown\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport Dropdown from '@jetbrains/ring-ui/components/dropdown/dropdown';\nimport Popup from '@jetbrains/ring-ui/components/popup/popup';\n\nconst container = document.getElementById('dropdown');\nconst dropdown = (\n<Dropdown\n  anchor=\"Hover over me\"\n  hoverMode\n>\n  <Popup>\n    <div>Outer popup</div>\n    <Popup>Inner popup</Popup>\n  </Popup>\n</Dropdown>\n);\n\nrender(dropdown, container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Dropdown with hover mode and disabled click mode",
      "url": "examples/dropdown/dropdown-with-hover-mode-and-disabled-click-mode.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"dropdown\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport Dropdown from '@jetbrains/ring-ui/components/dropdown/dropdown';\nimport Popup from '@jetbrains/ring-ui/components/popup/popup';\nimport Link from '@jetbrains/ring-ui/components/link/link';\n\nconst container = document.getElementById('dropdown');\nconst dropdown = (\n<Dropdown\n  anchor={<Link href=\"#hash\">Hover over me</Link>}\n  clickMode={false}\n  hoverMode\n>\n  <Popup>Popup content</Popup>\n</Dropdown>\n);\n\nrender(dropdown, container);\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "A stateful popup with a clickable anchor.",
  "attrs": {
    "name": "Dropdown",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "A stateful popup with a clickable anchor.",
    "example-file": "./dropdown.examples.html"
  }
};