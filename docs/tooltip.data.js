window.source = {
  "title": "Tooltip",
  "url": "tooltip.html",
  "type": "js",
  "content": "import React, {Component} from 'react';\nimport PropTypes from 'prop-types';\n\nimport Popup from '../popup/popup';\nimport {Listeners} from '../global/dom';\n\nimport styles from './tooltip.css';\n\n/**\n * @name Tooltip\n * @category Components\n * @tags Ring UI Language\n * @constructor\n * @description Displays a tooltip.\n * @extends {ReactComponent}\n * @example\n   <example name=\"Tooltip\">\n     <file name=\"index.html\" disable-auto-size>\n       <div id=\"tooltip\"></div>\n     </file>\n\n     <file name=\"index.js\">\n       import React from 'react';\n       import {render} from 'react-dom';\n\n       import Tooltip from '@jetbrains/ring-ui/components/tooltip/tooltip';\n       import Button from '@jetbrains/ring-ui/components/button/button';\n\n       const buttonWithTooltip = (\n         <Tooltip title=\"Explanation\">\n           <Button>Button that requires an explanation</Button>\n         </Tooltip>\n       );\n\n       render(buttonWithTooltip, document.getElementById('tooltip'));\n     </file>\n   </example>\n */\nexport default class Tooltip extends Component {\n  static PopupProps = Popup.PopupProps;\n\n  static propTypes = {\n    delay: PropTypes.number,\n    popupProps: PropTypes.object,\n    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),\n    children: PropTypes.node\n  };\n\n  static defaultProps = {\n    title: '',\n    popupProps: {}\n  };\n\n  state = {showPopup: false};\n\n  componentDidMount() {\n    if (this.props.title) {\n      this.addListeners();\n    }\n  }\n\n  componentDidUpdate(prevProps) {\n    if (!prevProps.title && this.props.title) {\n      this.addListeners();\n    } else if (prevProps.title && !this.props.title) {\n      this.listeners.removeAll();\n    }\n  }\n\n  componentWillUnmount() {\n    this.listeners.removeAll();\n  }\n\n  listeners = new Listeners();\n  containerRef = el => {\n    this.containerNode = el;\n  };\n\n  showPopup = () => {\n    const {delay, title} = this.props;\n\n    if (!title) {\n      return;\n    }\n\n    const showPopup = () => {\n      this.setState({showPopup: true});\n    };\n\n    if (delay) {\n      this.timeout = setTimeout(showPopup, delay);\n    } else {\n      showPopup();\n    }\n  };\n\n  hidePopup = () => {\n    clearTimeout(this.timeout);\n    this.setState({showPopup: false});\n  };\n\n  addListeners() {\n    this.listeners.add(this.containerNode, 'mouseover', this.showPopup);\n    this.listeners.add(this.containerNode, 'mouseout', this.hidePopup);\n    this.listeners.add(document, 'scroll', this.hidePopup);\n  }\n\n  popupRef = el => {\n    this.popup = el;\n  };\n\n  render() {\n    const {children, title, delay, popupProps, ...restProps} = this.props; // eslint-disable-line no-unused-vars\n\n    return (\n      <span {...restProps} ref={this.containerRef}>\n        {children}\n        <Popup\n          hidden={!this.state.showPopup}\n          onCloseAttempt={this.hidePopup}\n          maxHeight={400}\n          className={styles.tooltip}\n          attached={false}\n          top={4}\n          dontCloseOnAnchorClick\n          ref={this.popupRef}\n          {...popupProps}\n        >{title}</Popup>\n      </span>\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "Tooltip",
      "url": "examples/tooltip/tooltip.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"tooltip\"></div>\n     ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\n\nimport Tooltip from '@jetbrains/ring-ui/components/tooltip/tooltip';\nimport Button from '@jetbrains/ring-ui/components/button/button';\n\nconst buttonWithTooltip = (\n  <Tooltip title=\"Explanation\">\n    <Button>Button that requires an explanation</Button>\n  </Tooltip>\n);\n\nrender(buttonWithTooltip, document.getElementById('tooltip'));\n     ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a tooltip.",
  "attrs": {
    "name": "Tooltip",
    "category": "Components",
    "tags": "Ring UI Language",
    "constructor": "",
    "description": "Displays a tooltip.",
    "extends": "{ReactComponent}",
    "example": "   <example name=\"Tooltip\">\n     <file name=\"index.html\" disable-auto-size>\n       <div id=\"tooltip\"></div>\n     </file>\n\n     <file name=\"index.js\">\n       import React from 'react';\n       import {render} from 'react-dom';\n\n       import Tooltip from '@jetbrains/ring-ui/components/tooltip/tooltip';\n       import Button from '@jetbrains/ring-ui/components/button/button';\n\n       const buttonWithTooltip = (\n         <Tooltip title=\"Explanation\">\n           <Button>Button that requires an explanation</Button>\n         </Tooltip>\n       );\n\n       render(buttonWithTooltip, document.getElementById('tooltip'));\n     </file>\n   </example>"
  }
};