window.source = {
  "title": "Loader Screen",
  "url": "loader-screen.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport classNames from 'classnames';\nimport PropTypes from 'prop-types';\n\nimport Loader from '../loader/loader';\n\nimport styles from './loader-screen.css';\n\n/**\n * @name Loader Screen\n * @category Components\n * @tags Ring UI Language\n * @constructor\n * @description Displays a large animated loader and an (optional) text. Use cases: while the site is loading, during major actions.\n * @extends {ReactComponent}\n * @example\n    <example name=\"Loader Screen\">\n     <file name=\"index.html\" disable-auto-size>\n       <div id=\"loader-screen\"></div>\n     </file>\n\n     <file name=\"index.js\" webpack=\"true\">\n       import React from 'react';\n       import {render} from 'react-dom';\n       import LoaderScreen from '@jetbrains/ring-ui/components/loader-screen/loader-screen';\n\n       render(\n         <LoaderScreen/>,\n         document.getElementById('loader-screen')\n       );\n     </file>\n   </example>\n   <example name=\"Loader Screen with a message\">\n     <file name=\"index.html\" disable-auto-size>\n       <div id=\"loader-screen\"></div>\n     </file>\n\n     <file name=\"index.js\" webpack=\"true\">\n       import React from 'react';\n       import {render} from 'react-dom';\n       import LoaderScreen from '@jetbrains/ring-ui/components/loader-screen/loader-screen';\n\n       render(\n         <LoaderScreen message=\"Loading...\"/>,\n         document.getElementById('loader-screen')\n       );\n     </file>\n   </example>\n */\nexport default class LoaderScreen extends PureComponent {\n  static propTypes = {\n    className: PropTypes.string,\n    containerClassName: PropTypes.string,\n    message: PropTypes.string\n  };\n\n  render() {\n    const {message, className, containerClassName, ...restProps} = this.props;\n\n    const containerClasses = classNames(containerClassName, styles.loaderScreen);\n\n    const loaderClasses = classNames(className, styles.loader, {\n      [styles.loaderWithoutSpacing]: !message\n    });\n\n    return (\n      <div className={containerClasses}>\n        <Loader\n          {...restProps}\n          message={message}\n          className={loaderClasses}\n        />\n      </div>\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "Loader Screen",
      "url": "examples/loader-screen/loader-screen.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"loader-screen\"></div>\n     ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport LoaderScreen from '@jetbrains/ring-ui/components/loader-screen/loader-screen';\n\nrender(\n  <LoaderScreen/>,\n  document.getElementById('loader-screen')\n);\n     ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Loader Screen with a message",
      "url": "examples/loader-screen/loader-screen-with-a-message.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"loader-screen\"></div>\n     ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport LoaderScreen from '@jetbrains/ring-ui/components/loader-screen/loader-screen';\n\nrender(\n  <LoaderScreen message=\"Loading...\"/>,\n  document.getElementById('loader-screen')\n);\n     ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a large animated loader and an (optional) text. Use cases: while the site is loading, during major actions.",
  "attrs": {
    "name": "Loader Screen",
    "category": "Components",
    "tags": "Ring UI Language",
    "constructor": "",
    "description": "Displays a large animated loader and an (optional) text. Use cases: while the site is loading, during major actions.",
    "extends": "{ReactComponent}",
    "example": "    <example name=\"Loader Screen\">\n     <file name=\"index.html\" disable-auto-size>\n       <div id=\"loader-screen\"></div>\n     </file>\n\n     <file name=\"index.js\" webpack=\"true\">\n       import React from 'react';\n       import {render} from 'react-dom';\n       import LoaderScreen from '@jetbrains/ring-ui/components/loader-screen/loader-screen';\n\n       render(\n         <LoaderScreen/>,\n         document.getElementById('loader-screen')\n       );\n     </file>\n   </example>\n   <example name=\"Loader Screen with a message\">\n     <file name=\"index.html\" disable-auto-size>\n       <div id=\"loader-screen\"></div>\n     </file>\n\n     <file name=\"index.js\" webpack=\"true\">\n       import React from 'react';\n       import {render} from 'react-dom';\n       import LoaderScreen from '@jetbrains/ring-ui/components/loader-screen/loader-screen';\n\n       render(\n         <LoaderScreen message=\"Loading...\"/>,\n         document.getElementById('loader-screen')\n       );\n     </file>\n   </example>"
  }
};