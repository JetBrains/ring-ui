window.source = {
  "title": "ContentEditable",
  "url": "contenteditable.html",
  "type": "js",
  "content": "/**\n * @name ContentEditable\n * @category Components\n * @description Provides a ContentEditable component.\n */\n\nimport React, {Component} from 'react';\nimport PropTypes from 'prop-types';\nimport {render} from 'react-dom';\n\nfunction noop() {}\n\n/**\n * @name ContentEditable\n * @constructor\n * @extends {ReactComponent}\n * @example\n   <example name=\"ContentEditable\">\n     <file name=\"index.html\">\n       <div id='contenteditable'></div>\n       <div id='contenteditable-disabled' style=\"padding-top: 16px;\"></div>\n     </file>\n\n     <file name=\"index.js\" webpack=\"true\">\n       import '@jetbrains/ring-ui/components/input/input.scss';\n       import {render} from 'react-dom';\n       import React from 'react';\n\n       import ContentEditable from '@jetbrains/ring-ui/components/contenteditable/contenteditable';\n\n       render(\n         <ContentEditable className=\"ring-input\">\n           <span>text <b>bold text</b> text</span>\n         </ContentEditable>,\n         document.getElementById('contenteditable')\n       );\n\n       render(\n         <ContentEditable className=\"ring-input\" disabled={true}>\n           <span>text <b>bold text</b> text</span>\n         </ContentEditable>,\n         document.getElementById('contenteditable-disabled')\n       );\n     </file>\n   </example>\n */\n// eslint-disable-next-line react/no-deprecated\nexport default class ContentEditable extends Component {\n  /** @override */\n  static propTypes = {\n    disabled: PropTypes.bool,\n    componentDidUpdate: PropTypes.func,\n    onComponentUpdate: PropTypes.func,\n    className: PropTypes.string,\n    children: PropTypes.node\n  };\n\n  static defaultProps = {\n    disabled: false,\n    tabIndex: 0,\n    onInput: noop,\n    onComponentUpdate: noop\n  };\n\n  state = {__html: ''};\n\n  componentWillMount() {\n    this.renderStatic(this.props);\n  }\n\n  componentWillReceiveProps(nextProps) {\n    this.renderStatic(nextProps);\n  }\n\n  shouldComponentUpdate(nextProps, nextState) {\n    return nextProps.disabled !== this.props.disabled ||\n      nextState.__html !== this.state.__html;\n  }\n\n  componentDidUpdate(prevProps, prevState) {\n    this.props.onComponentUpdate(prevProps, prevState);\n  }\n\n  onRender = node => {\n    this.setState({__html: node ? node.innerHTML : ''});\n  };\n\n  renderStatic(nextProps) {\n    if (!nextProps.children) {\n      this.setState({__html: ''});\n    }\n\n    render(<i ref={this.onRender}>{nextProps.children}</i>, document.createElement('i'));\n  }\n\n  render() {\n    const {children, onComponentUpdate, ...props} = this.props; // eslint-disable-line no-unused-vars\n\n    return (\n      <div\n        {...props}\n        contentEditable={!this.props.disabled}\n        dangerouslySetInnerHTML={this.state}\n      />\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "ContentEditable",
      "url": "examples/contenteditable/content-editable.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id='contenteditable'></div>\n<div id='contenteditable-disabled' style=\"padding-top: 16px;\"></div>\n     ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport '@jetbrains/ring-ui/components/input/input.scss';\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport ContentEditable from '@jetbrains/ring-ui/components/contenteditable/contenteditable';\n\nrender(\n  <ContentEditable className=\"ring-input\">\n    <span>text <b>bold text</b> text</span>\n  </ContentEditable>,\n  document.getElementById('contenteditable')\n);\n\nrender(\n  <ContentEditable className=\"ring-input\" disabled={true}>\n    <span>text <b>bold text</b> text</span>\n  </ContentEditable>,\n  document.getElementById('contenteditable-disabled')\n);\n     ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides a ContentEditable component.",
  "attrs": {
    "name": "ContentEditable",
    "category": "Components",
    "description": "Provides a ContentEditable component."
  }
};