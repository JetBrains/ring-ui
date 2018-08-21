window.source = {
  "title": "Island",
  "url": "island.html",
  "type": "js",
  "content": "import React, {Component} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport adaptiveIslandHOC from '../island/adaptive-island-hoc';\nimport dataTests from '../global/data-tests';\n\nimport styles from './island.css';\n\n/**\n * @name Island\n * @name Island\n * @category Components\n * @tags Ring UI Language\n * @description Displays an island.\n * @example-file ./island.examples.html\n */\n\nexport default class Island extends Component {\n  static propTypes = {\n    children: PropTypes.node,\n    className: PropTypes.string,\n    narrow: PropTypes.bool,\n    withoutPaddings: PropTypes.bool,\n    'data-test': PropTypes.string\n  };\n\n  render() {\n    // eslint-disable-next-line max-len\n    const {children, className, narrow, withoutPaddings, 'data-test': dataTest, ...restProps} = this.props;\n    const classes = classNames(styles.island, className, {\n      [styles.narrowIsland]: narrow,\n      [styles.withoutPaddings]: withoutPaddings\n    });\n\n    return (\n      <div\n        {...restProps}\n        className={classes}\n        data-test={dataTests('ring-island', dataTest)}\n      >\n        {children}\n      </div>\n    );\n  }\n}\n\nexport const AdaptiveIsland = adaptiveIslandHOC(Island);\n\nexport {default as Header} from './header';\nexport {default as Content} from './content';\n",
  "examples": [
    {
      "name": "Island",
      "url": "examples/island/island.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"island\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\nimport Island, {Header, Content} from '@jetbrains/ring-ui/components/island/island';\n\nconst renderIslandDemo = () => (\n  <Island>\n    <Header border>Title</Header>\n    <Content>Content</Content>\n  </Island>\n);\n\nrender(renderIslandDemo(), document.getElementById('island'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Island with scroll",
      "url": "examples/island/island-with-scroll.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"island\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.limited-island) {\n  height: 200px;\n  width: 200px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\nimport Island, {Header, Content} from '@jetbrains/ring-ui/components/island/island';\n\nconst renderIslandDemo = () => (\n<Island className=\"limited-island\" narrow>\n  <Header border>Title</Header>\n  <Content fade>\n    Lorem Ipsum is simply dummy text of the printing and typesetting\n    industry. Lorem Ipsum has been the industry's standard dummy text ever\n    since the 1500s, when an unknown printer took a galley of type and\n    scrambled it to make a type specimen book. It has survived not only five\n    centuries, but also the leap into electronic typesetting, remaining\n    essentially unchanged.\n  </Content>\n</Island>\n);\n\nrender(renderIslandDemo(), document.getElementById('island'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Adaptive island with resizeable header",
      "url": "examples/island/adaptive-island-with-resizeable-header.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"island\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.limited-island) {\n  height: 200px;\n  width: 200px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\nimport {AdaptiveIsland, Header, Content, HeaderResizer} from '@jetbrains/ring-ui/components/island/island';\n\nconst renderIslandDemo = () => (\n<AdaptiveIsland className=\"limited-island\" narrow>\n  <Header>Title</Header>\n  <Content fade>\n    Lorem Ipsum is simply dummy text of the printing and typesetting\n    industry. Lorem Ipsum has been the industry's standard dummy text ever\n    since the 1500s, when an unknown printer took a galley of type and\n    scrambled it to make a type specimen book. It has survived not only five\n    centuries, but also the leap into electronic typesetting, remaining\n    essentially unchanged.\n  </Content>\n</AdaptiveIsland>\n);\n\nrender(renderIslandDemo(), document.getElementById('island'));\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays an island.",
  "attrs": {
    "name": "Island",
    "category": "Components",
    "tags": "Ring UI Language",
    "description": "Displays an island.",
    "example-file": "./island.examples.html"
  }
};