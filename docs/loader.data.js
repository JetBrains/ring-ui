window.source = {
  "title": "Loader",
  "url": "loader.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\n\nimport dataTests from '../global/data-tests';\n\nimport LoaderCore from './loader__core';\n\n/**\n * @name Loader\n * @category Components\n * @tags Ring UI Language\n * @constructor\n * @description Displays a large animated loader and an (optional) text. Use cases: while the site is loading, during major actions.\n * @extends {ReactComponent}\n * @example\n    <example name=\"Loader\">\n     <file name=\"index.html\">\n       <div id=\"loader1\" class=\"loader-container\"></div>\n       <div id=\"loader2\" class=\"loader-container loader-container_black\"></div>\n     </file>\n\n     <file name=\"index.js\" webpack=\"true\">\n       import React from 'react';\n       import {render} from 'react-dom';\n       import Loader from '@jetbrains/ring-ui/components/loader/loader';\n\n       render(<Loader message=\"Loading...\"/>, document.getElementById('loader1'));\n\n       render(<Loader message=\"Loading...\"/>, document.getElementById('loader2'));\n     </file>\n     <file name=\"index.css\">\n       body {\n          margin: 0;\n       }\n\n       :global(.loader-container) {\n         padding: 32px;\n       }\n       :global(.loader-container_black) {\n         background-color: black;\n       }\n\n       :global(.loader-container_black) {\n         color: #FFF;\n       }\n     </file>\n    </example>\n */\n\nexport default class Loader extends PureComponent {\n  static propTypes = {\n    className: PropTypes.string,\n    size: PropTypes.number,\n    colors: PropTypes.array,\n    message: PropTypes.string,\n    'data-test': PropTypes.string\n  };\n\n  componentWillUnmount() {\n    this.loader.destroy();\n  }\n\n  initLoader = el => {\n    if (el) {\n      this.loader = new LoaderCore(el, this.props);\n    }\n  };\n\n  render() {\n    const {message, size, colors, 'data-test': dataTest, ...restProps} = this.props; // eslint-disable-line no-unused-vars\n    return (\n      <div\n        data-test={dataTests('ring-loader', dataTest)}\n        {...restProps}\n        ref={this.initLoader}\n      />\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "Loader",
      "url": "examples/loader/loader.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"loader1\" class=\"loader-container\"></div>\n<div id=\"loader2\" class=\"loader-container loader-container_black\"></div>\n     ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Loader from '@jetbrains/ring-ui/components/loader/loader';\n\nrender(<Loader message=\"Loading...\"/>, document.getElementById('loader1'));\n\nrender(<Loader message=\"Loading...\"/>, document.getElementById('loader2'));\n     ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n   margin: 0;\n}\n\n:global(.loader-container) {\n  padding: 32px;\n}\n:global(.loader-container_black) {\n  background-color: black;\n}\n\n:global(.loader-container_black) {\n  color: #FFF;\n}\n     ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a large animated loader and an (optional) text. Use cases: while the site is loading, during major actions.",
  "attrs": {
    "name": "Loader",
    "category": "Components",
    "tags": "Ring UI Language",
    "constructor": "",
    "description": "Displays a large animated loader and an (optional) text. Use cases: while the site is loading, during major actions.",
    "extends": "{ReactComponent}",
    "example": "    <example name=\"Loader\">\n     <file name=\"index.html\">\n       <div id=\"loader1\" class=\"loader-container\"></div>\n       <div id=\"loader2\" class=\"loader-container loader-container_black\"></div>\n     </file>\n\n     <file name=\"index.js\" webpack=\"true\">\n       import React from 'react';\n       import {render} from 'react-dom';\n       import Loader from '@jetbrains/ring-ui/components/loader/loader';\n\n       render(<Loader message=\"Loading...\"/>, document.getElementById('loader1'));\n\n       render(<Loader message=\"Loading...\"/>, document.getElementById('loader2'));\n     </file>\n     <file name=\"index.css\">\n       body {\n          margin: 0;\n       }\n\n       :global(.loader-container) {\n         padding: 32px;\n       }\n       :global(.loader-container_black) {\n         background-color: black;\n       }\n\n       :global(.loader-container_black) {\n         color: #FFF;\n       }\n     </file>\n    </example>"
  }
};