window.source = {
  "title": "Tags List",
  "url": "tags-list.html",
  "type": "js",
  "content": "import React, {Component} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport Tag from '../tag/tag';\n\nfunction noop() {}\n\n/**\n * @name Tags List\n * @category Components\n * @tags Ring UI Language\n * @constructor\n * @description Displays a list of tags.\n * @extends {ReactComponent}\n * @example-file ./tags-list.examples.html\n */\n\nexport default class TagsList extends Component {\n  static propTypes = {\n    children: PropTypes.node,\n    tags: PropTypes.array,\n    customTagComponent: (props, propName, componentName) => {\n      if (props[propName] && !props[propName].prototype instanceof Component) {\n        return new Error(`Invalid prop ${propName} supplied to ${componentName}. Validation failed.`);\n      }\n      return null;\n    },\n    activeIndex: PropTypes.number,\n    canNotBeEmpty: PropTypes.bool,\n    disabled: PropTypes.bool,\n    handleClick: PropTypes.func,\n    handleRemove: PropTypes.func,\n    className: PropTypes.string,\n    tagClassName: PropTypes.string\n  };\n\n  static defaultProps = {\n    customTagComponent: null,\n    canNotBeEmpty: false,\n    disabled: false,\n    handleClick: noop,\n    handleRemove: noop\n  };\n\n  renderTag(tag, focusTag) {\n    const TagComponent = this.props.customTagComponent || Tag;\n    const readOnly = this.props.disabled || tag.readOnly ||\n      (this.props.canNotBeEmpty && this.props.tags.length === 1);\n\n    const {tagClassName} = this.props;\n\n    return (\n      <TagComponent\n        {...tag}\n        readOnly={readOnly}\n        disabled={this.props.disabled || tag.disabled}\n        focused={focusTag}\n        onClick={this.props.handleClick(tag)}\n        onRemove={this.props.handleRemove(tag)}\n        className={tagClassName}\n      >{tag.label}</TagComponent>);\n  }\n\n  render() {\n    const {\n      children, className, customTagComponent, canNotBeEmpty, handleClick, tagClassName, handleRemove, tags, activeIndex, // eslint-disable-line no-unused-vars, max-len\n      ...props\n    } = this.props;\n    const classes = classNames(\n      'ring-js-shortcuts',\n      className\n    );\n\n    const tagsList = (this.props.tags || []).map(\n      (tag, index) => this.renderTag(tag, this.props.activeIndex === index)\n    );\n\n    return (\n      <div\n        data-test=\"ring-tags-list\"\n        className={classes}\n        {...props}\n      >\n        {tagsList}\n        {children}\n      </div>);\n  }\n}\n",
  "examples": [
    {
      "name": "Tags List",
      "url": "examples/tags-list/tags-list.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {createElement} from 'react';\nimport {render} from 'react-dom';\nimport TagsList from '@jetbrains/ring-ui/components/tags-list/tags-list';\n\nvar props = {\n  className: 'test-additional-class',\n  tags: [\n    {key: 'test1', label: 'test1'},\n    {key: 'test2', label: 'test2'}\n  ]\n};\n\nrender(\n<TagsList\n  className={props.className}\n  tags={props.tags}\n/>,\ndocument.getElementById('demo')\n)\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Tags List with icons",
      "url": "examples/tags-list/tags-list-with-icons.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {createElement} from 'react';\nimport {render} from 'react-dom';\nimport TagsList from '@jetbrains/ring-ui/components/tags-list/tags-list';\nimport {CheckmarkIcon} from '@jetbrains/ring-ui/components/icon';\n\nvar props = {\n  tags: [\n    {key: 'test1', label: 'test1', rgTagIcon: CheckmarkIcon},\n    {key: 'test2', label: 'test2'}\n  ]\n};\n\nrender(\n<TagsList\n  tags={props.tags}\n/>,\ndocument.getElementById('demo')\n)\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Disabled Tags List",
      "url": "examples/tags-list/disabled-tags-list.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {createElement} from 'react';\nimport {render} from 'react-dom';\nimport TagsList from '@jetbrains/ring-ui/components/tags-list/tags-list';\n\nvar props = {\n  disabled: true,\n  tags: [\n    {key: 'test1', label: 'test1'},\n    {key: 'test2', label: 'test2'}\n  ]\n};\n\nrender(\n<TagsList\n  disabled={props.disabled}\n  tags={props.tags}\n/>\n,\ndocument.getElementById('demo')\n);\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a list of tags.",
  "attrs": {
    "name": "Tags List",
    "category": "Components",
    "tags": "Ring UI Language",
    "constructor": "",
    "description": "Displays a list of tags.",
    "extends": "{ReactComponent}",
    "example-file": "./tags-list.examples.html"
  }
};