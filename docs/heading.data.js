window.source = {
  "title": "Heading",
  "url": "heading.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\nimport deprecate from 'util-deprecate';\n\nimport styles from './heading.css';\n\n/**\n * @name Heading\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description A component for rendering h1-h5 tags.\n * @example\n  <example name=\"Headings 1 to 5\">\n    <file name=\"index.html\">\n      <div id=\"heading\"></div>\n    </file>\n    <file name=\"index.css\">\n      h1, h2 {\n        &::after {\n          content: 'Heading';\n          display: block;\n          position: absolute;\n          color: #DDD;\n          z-index: -1;\n        }\n      }\n\n      h3, h4 {\n        & + div::before {\n          content: 'Lorem ipsum';\n          display: block;\n          position: absolute;\n          color: #CCC;\n          z-index: -1;\n          transform: translateY(-100%);\n        }\n      }\n    </file>\n    <file name=\"index.js\">\n      import React, {Component} from 'react';\n      import {render} from 'react-dom';\n      import Heading, {H1, H2, H3, H4} from '@jetbrains/ring-ui/components/heading/heading';\n      const container = document.getElementById('heading');\n      const lorem = <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>;\n      const demo = (\n        <div>\n          <Heading level={Heading.Levels.H1}>Heading 1</Heading>\n          {lorem}\n          <H1 caps>Heading 1 caps</H1>\n          {lorem}\n          <H2>Heading 2</H2>\n          {lorem}\n          <H3>Heading 3</H3>\n          {lorem}\n          <H4>Heading 4</H4>\n          {lorem}\n        </div>\n      );\n      render(demo, container);\n    </file>\n  </example>\n */\n\nconst Levels = {\n  H1: 1,\n  H2: 2,\n  H3: 3,\n  H4: 4\n};\n\nconst fallbackHeading = deprecate(\n  () => 'h3',\n  'Headings of level 5 and higher are replaced with h3'\n);\n\nexport default class Heading extends PureComponent {\n  static Levels = Levels;\n\n  static propTypes = {\n    children: PropTypes.node,\n    className: PropTypes.string,\n    level: PropTypes.number\n  };\n\n  static defaultProps = {\n    level: Levels.H1\n  };\n\n  render() {\n    const {children, className, level, ...restProps} = this.props;\n    const classes = classNames(styles.heading, className);\n\n    const Tag = level <= Levels.H4 ? `h${level}` : fallbackHeading();\n\n    return (\n      <Tag\n        {...restProps}\n        className={classes}\n      >\n        {children}\n      </Tag>\n    );\n  }\n}\n\nfunction makeHeading(level, useCaps) {\n  return class H extends PureComponent { //eslint-disable-line react/no-multi-comp\n    static propTypes = {\n      children: PropTypes.node,\n      className: PropTypes.string,\n      // use only for short h1 headers, no longer than three words\n      caps: PropTypes.bool\n    };\n\n    render() {\n      const {className, caps, ...restProps} = this.props;\n\n      const classes = classNames(className, {\n        [styles.caps]: useCaps && caps\n      });\n\n      return (\n        <Heading\n          {...restProps}\n          level={level}\n          className={classes}\n        />\n      );\n    }\n  };\n}\n\nconst H1 = makeHeading(Levels.H1, true);\nconst H2 = makeHeading(Levels.H2);\nconst H3 = makeHeading(Levels.H3);\nconst H4 = makeHeading(Levels.H4);\n\nexport {H1, H2, H3, H4};\n",
  "examples": [
    {
      "name": "Headings 1 to 5",
      "url": "examples/heading/headings-1-to-5.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"heading\"></div>\n    ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nh1, h2 {\n  &::after {\n    content: 'Heading';\n    display: block;\n    position: absolute;\n    color: #DDD;\n    z-index: -1;\n  }\n}\n\nh3, h4 {\n  & + div::before {\n    content: 'Lorem ipsum';\n    display: block;\n    position: absolute;\n    color: #CCC;\n    z-index: -1;\n    transform: translateY(-100%);\n  }\n}\n    ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component} from 'react';\nimport {render} from 'react-dom';\nimport Heading, {H1, H2, H3, H4} from '@jetbrains/ring-ui/components/heading/heading';\nconst container = document.getElementById('heading');\nconst lorem = <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>;\nconst demo = (\n  <div>\n    <Heading level={Heading.Levels.H1}>Heading 1</Heading>\n    {lorem}\n    <H1 caps>Heading 1 caps</H1>\n    {lorem}\n    <H2>Heading 2</H2>\n    {lorem}\n    <H3>Heading 3</H3>\n    {lorem}\n    <H4>Heading 4</H4>\n    {lorem}\n  </div>\n);\nrender(demo, container);\n    ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "A component for rendering h1-h5 tags.",
  "attrs": {
    "name": "Heading",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "A component for rendering h1-h5 tags.",
    "example": "  <example name=\"Headings 1 to 5\">\n    <file name=\"index.html\">\n      <div id=\"heading\"></div>\n    </file>\n    <file name=\"index.css\">\n      h1, h2 {\n        &::after {\n          content: 'Heading';\n          display: block;\n          position: absolute;\n          color: #DDD;\n          z-index: -1;\n        }\n      }\n\n      h3, h4 {\n        & + div::before {\n          content: 'Lorem ipsum';\n          display: block;\n          position: absolute;\n          color: #CCC;\n          z-index: -1;\n          transform: translateY(-100%);\n        }\n      }\n    </file>\n    <file name=\"index.js\">\n      import React, {Component} from 'react';\n      import {render} from 'react-dom';\n      import Heading, {H1, H2, H3, H4} from '@jetbrains/ring-ui/components/heading/heading';\n      const container = document.getElementById('heading');\n      const lorem = <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>;\n      const demo = (\n        <div>\n          <Heading level={Heading.Levels.H1}>Heading 1</Heading>\n          {lorem}\n          <H1 caps>Heading 1 caps</H1>\n          {lorem}\n          <H2>Heading 2</H2>\n          {lorem}\n          <H3>Heading 3</H3>\n          {lorem}\n          <H4>Heading 4</H4>\n          {lorem}\n        </div>\n      );\n      render(demo, container);\n    </file>\n  </example>"
  }
};