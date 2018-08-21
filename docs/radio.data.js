window.source = {
  "title": "Radio",
  "url": "radio.html",
  "type": "js",
  "content": "import React, {Component} from 'react';\nimport PropTypes from 'prop-types';\n\nimport getUID from '../global/get-uid';\n\nimport RadioItem, {RadioContext} from './radio__item';\n\n/**\n * @name Radio\n * @category Components\n * @tags Ring UI Language\n * @constructor\n * @description Displays a radio button. Adopted from [react-radio-group](https://github.com/chenglou/react-radio-group).\n * @example-file ./radio.examples.html\n */\n\nexport default class Radio extends Component {\n  static Item = RadioItem;\n\n  static propTypes = {\n    name: PropTypes.string,\n    disabled: PropTypes.bool,\n    value: PropTypes.oneOfType([\n      PropTypes.string,\n      PropTypes.number,\n      PropTypes.bool\n    ]),\n    onChange: PropTypes.func,\n    children: PropTypes.node.isRequired\n  };\n\n  uid = getUID('ring-radio-');\n\n  render() {\n    return (\n      <RadioContext.Provider value={{name: this.uid, ...this.props}}>\n        {this.props.children}\n      </RadioContext.Provider>\n    );\n  }\n}\n\n",
  "examples": [
    {
      "name": "Controlled",
      "url": "examples/radio/controlled.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"container\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React, {Fragment} from 'react';\nimport {withState} from 'recompose';\n\nimport Radio from '@jetbrains/ring-ui/components/radio/radio';\n\nconst container = document.getElementById('container');\nconst RadioExample = withState('value', 'onChange', 'one')(props => (\n  <Fragment>\n    Selected: {props.value}\n    <Radio {...props}>\n      <Radio.Item value=\"one\">One</Radio.Item>\n      <Radio.Item value=\"two\">Two</Radio.Item>\n      <Radio.Item value=\"three\">Three</Radio.Item>\n    </Radio>\n  </Fragment>\n));\nrender(<RadioExample/>, container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Uncontrolled",
      "url": "examples/radio/uncontrolled.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"container\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React, {Fragment} from 'react';\n\nimport Radio from '@jetbrains/ring-ui/components/radio/radio';\n\nconst container = document.getElementById('container');\nconst RadioExample = () => (\n  <Radio>\n    <Radio.Item value=\"one\" defaultChecked>One</Radio.Item>\n    <Radio.Item value=\"two\">Two</Radio.Item>\n    <Radio.Item value=\"three\">Three</Radio.Item>\n  </Radio>\n);\nrender(<RadioExample/>, container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Disabled",
      "url": "examples/radio/disabled.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"container\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React, {Fragment} from 'react';\n\nimport Radio from '@jetbrains/ring-ui/components/radio/radio';\nimport RadioItem from '@jetbrains/ring-ui/components/radio/radio__item';\n\nconst container = document.getElementById('container');\nconst RadioExample = () => (\n  <Radio disabled>\n    <Radio.Item value=\"one\" defaultChecked>One</Radio.Item>\n    <Radio.Item value=\"two\">Two</Radio.Item>\n    <Radio.Item value=\"three\">Three</Radio.Item>\n  </Radio>\n);\nrender(<RadioExample/>, container);\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a radio button. Adopted from [react-radio-group](https://github.com/chenglou/react-radio-group).",
  "attrs": {
    "name": "Radio",
    "category": "Components",
    "tags": "Ring UI Language",
    "constructor": "",
    "description": "Displays a radio button. Adopted from [react-radio-group](https://github.com/chenglou/react-radio-group).",
    "example-file": "./radio.examples.html"
  }
};