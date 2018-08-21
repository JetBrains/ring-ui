window.source = {
  "title": "Loader Inline",
  "url": "loader-inline.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport classNames from 'classnames';\nimport PropTypes from 'prop-types';\n\nimport Theme from '../global/theme';\nimport dataTests from '../global/data-tests';\n\nimport styles from './loader-inline.css';\nimport injectStyles from './inject-styles';\n\n/**\n * @name Loader Inline\n * @category Components\n * @tags Ring UI Language\n * @constructor\n * @description Displays a small animated loader, shown inline with text. Use case: contextual loading animation.\n * @extends {ReactComponent}\n * @example-file ./loader-inline.examples.html\n */\n\nexport default class LoaderInline extends PureComponent {\n  static Theme = Theme;\n  static propTypes = {\n    theme: PropTypes.oneOf(Object.values(Theme)),\n    className: PropTypes.string,\n    'data-test': PropTypes.string\n  };\n\n  static defaultProps = {\n    theme: Theme.LIGHT\n  };\n\n  componentDidMount() {\n    injectStyles();\n  }\n\n  render() {\n    const {className, theme, 'data-test': dataTest, ...restProps} = this.props;\n\n    const classes = classNames(\n      styles.loader,\n      className,\n      `${styles.loader}_${theme}`\n    );\n\n    return (\n      <div\n        {...restProps}\n        data-test={dataTests('ring-loader-inline', dataTest)}\n        className={classes}\n      />\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "Inline loader",
      "url": "examples/loader-inline/inline-loader.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<span>some text on top</span>\n<div>before <span id=\"loader-inline\"></span> Some text after</div>\n<div>some text under loader</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Loader from '@jetbrains/ring-ui/components/loader-inline/loader-inline';\n\nrender(<Loader/>, document.getElementById('loader-inline'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Inline loader on black background",
      "url": "examples/loader-inline/inline-loader-on-black-background.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div class=\"container\">\n  <span>some text on top</span>\n  <div>before <span id=\"loader-inline\"></span> Some text after</div>\n  <div>some text under loader</div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  background-color: #000;\n}\n\n:global(.container) {\n  color: #fff;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Loader from '@jetbrains/ring-ui/components/loader-inline/loader-inline';\n\nrender(<Loader theme={Loader.Theme.DARK} />, document.getElementById('loader-inline'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Inline loader on custom background",
      "url": "examples/loader-inline/inline-loader-on-custom-background.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div class=\"container\">\n  <span>some text on top</span>\n  <div>before <span id=\"loader-inline\"></span> Some text after</div>\n  <div>some text under loader</div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  background-color: #E5F4FF;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Loader from '@jetbrains/ring-ui/components/loader-inline/loader-inline';\n\nrender(<Loader className=\"loader\" />, document.getElementById('loader-inline'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Inline loader without React",
      "url": "examples/loader-inline/inline-loader-without-react.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div class=\"ring-loader-inline\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport injectStyles from '@jetbrains/ring-ui/components/loader-inline/inject-styles';\n\ninjectStyles();\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a small animated loader, shown inline with text. Use case: contextual loading animation.",
  "attrs": {
    "name": "Loader Inline",
    "category": "Components",
    "tags": "Ring UI Language",
    "constructor": "",
    "description": "Displays a small animated loader, shown inline with text. Use case: contextual loading animation.",
    "extends": "{ReactComponent}",
    "example-file": "./loader-inline.examples.html"
  }
};