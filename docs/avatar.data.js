window.source = {
  "title": "Avatar",
  "url": "avatar.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport {encodeURL, isDataURI, parseQueryString} from '../global/url';\nimport {getPixelRatio} from '../global/dom';\nimport global from '../global/global.css';\n\nimport styles from './avatar.css';\n\n/**\n * @name Avatar\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description Displays an avatar. In case of a loading error an empty square is displayed.\n * @example\n   <example name=\"Avatar\">\n     <file name=\"index.html\">\n       <div id=\"avatar\"></div>\n     </file>\n\n     <file name=\"index.css\">\n       :global(.avatar-demo) {\n         display: flex;\n         justify-content: space-between;\n         width: 200px;\n         margin-bottom: 16px;\n       }\n     </file>\n\n     <file name=\"index.js\">\n       import React, {Component} from 'react';\n       import {render} from 'react-dom';\n\n       import Avatar, {Size} from '@jetbrains/ring-ui/components/avatar/avatar';\n       import hubConfig from '@ring-ui/docs/components/hub-config';\n\n       const container = document.getElementById('avatar');\n\n       class AvatarDemo extends Component {\n         render() {\n           const url = `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`\n           const dataUri = `data:image/svg+xml,${encodeURIComponent('<svg viewBox=\"0 0 120 120\" xmlns=\"http://www.w3.org/2000/svg\">' +\n            '<rect x=\"0\" y=\"0\" height=\"120\" width=\"120\" fill=\"#00cc00\"/>' +\n           '</svg>')}`;\n\n           return (\n             <div>\n                {Object.keys(Size).map(size => (\n                  <div\n                    className=\"avatar-demo\"\n                    key={size}\n                  >\n                    <Avatar size={Size[size]} url={url} />\n                    <Avatar size={Size[size]} url={dataUri} round />\n                    <Avatar size={Size[size]} />\n                  </div>\n                ))}\n             </div>\n           );\n         }\n       }\n\n       render(<AvatarDemo />, container);\n     </file>\n   </example>\n */\n\nexport const Size = {\n  Size18: 18,\n  Size20: 20,\n  Size24: 24,\n  Size32: 32,\n  Size40: 40,\n  Size48: 48,\n  Size56: 56\n};\n\nexport default class Avatar extends PureComponent {\n  static propTypes = {\n    dpr: PropTypes.number,\n    className: PropTypes.string,\n    size: PropTypes.number,\n    style: PropTypes.object,\n    url: PropTypes.string,\n    round: PropTypes.bool\n  };\n\n  static defaultProps = {\n    dpr: getPixelRatio(),\n    size: Size.Size20,\n    style: {}\n  };\n\n  state = {\n    errorUrl: ''\n  };\n\n  handleError = () => {\n    this.setState({errorUrl: this.props.url});\n  };\n\n  handleSuccess = () => {\n    this.setState({errorUrl: ''});\n  };\n\n  render() {\n    const {size, url, dpr, style, round, ...restProps} = this.props;\n    const sizeString = `${size}px`;\n    const borderRadius = size <= Size.Size18 ? 'border-radius-small' : 'border-radius';\n    const styleObj = {\n      borderRadius: round ? '50%' : global[borderRadius],\n      height: sizeString,\n      width: sizeString,\n      ...style\n    };\n\n    if (!url || this.state.errorUrl === url) {\n      return (\n        <span\n          {...restProps}\n          className={classNames(styles.avatar, styles.empty, this.props.className)}\n          style={styleObj}\n        />\n      );\n    }\n\n    let src = url;\n    if (!isDataURI(url)) {\n      const [urlStart, query] = url.split('?');\n      const queryParams = {\n        ...parseQueryString(query),\n        dpr,\n        size\n      };\n\n      src = encodeURL(urlStart, queryParams);\n    }\n\n    return (\n      <img\n        {...restProps}\n        onError={this.handleError}\n        onLoad={this.handleSuccess}\n        className={classNames(styles.avatar, this.props.className)}\n        style={styleObj}\n        src={src}\n      />\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "Avatar",
      "url": "examples/avatar/avatar.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"avatar\"></div>\n     ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.avatar-demo) {\n  display: flex;\n  justify-content: space-between;\n  width: 200px;\n  margin-bottom: 16px;\n}\n     ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component} from 'react';\nimport {render} from 'react-dom';\n\nimport Avatar, {Size} from '@jetbrains/ring-ui/components/avatar/avatar';\nimport hubConfig from '@ring-ui/docs/components/hub-config';\n\nconst container = document.getElementById('avatar');\n\nclass AvatarDemo extends Component {\n  render() {\n    const url = `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`\n    const dataUri = `data:image/svg+xml,${encodeURIComponent('<svg viewBox=\"0 0 120 120\" xmlns=\"http://www.w3.org/2000/svg\">' +\n     '<rect x=\"0\" y=\"0\" height=\"120\" width=\"120\" fill=\"#00cc00\"/>' +\n    '</svg>')}`;\n\n    return (\n      <div>\n         {Object.keys(Size).map(size => (\n           <div\n             className=\"avatar-demo\"\n             key={size}\n           >\n             <Avatar size={Size[size]} url={url} />\n             <Avatar size={Size[size]} url={dataUri} round />\n             <Avatar size={Size[size]} />\n           </div>\n         ))}\n      </div>\n    );\n  }\n}\n\nrender(<AvatarDemo />, container);\n     ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays an avatar. In case of a loading error an empty square is displayed.",
  "attrs": {
    "name": "Avatar",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "Displays an avatar. In case of a loading error an empty square is displayed.",
    "example": "   <example name=\"Avatar\">\n     <file name=\"index.html\">\n       <div id=\"avatar\"></div>\n     </file>\n\n     <file name=\"index.css\">\n       :global(.avatar-demo) {\n         display: flex;\n         justify-content: space-between;\n         width: 200px;\n         margin-bottom: 16px;\n       }\n     </file>\n\n     <file name=\"index.js\">\n       import React, {Component} from 'react';\n       import {render} from 'react-dom';\n\n       import Avatar, {Size} from '@jetbrains/ring-ui/components/avatar/avatar';\n       import hubConfig from '@ring-ui/docs/components/hub-config';\n\n       const container = document.getElementById('avatar');\n\n       class AvatarDemo extends Component {\n         render() {\n           const url = `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`\n           const dataUri = `data:image/svg+xml,${encodeURIComponent('<svg viewBox=\"0 0 120 120\" xmlns=\"http://www.w3.org/2000/svg\">' +\n            '<rect x=\"0\" y=\"0\" height=\"120\" width=\"120\" fill=\"#00cc00\"/>' +\n           '</svg>')}`;\n\n           return (\n             <div>\n                {Object.keys(Size).map(size => (\n                  <div\n                    className=\"avatar-demo\"\n                    key={size}\n                  >\n                    <Avatar size={Size[size]} url={url} />\n                    <Avatar size={Size[size]} url={dataUri} round />\n                    <Avatar size={Size[size]} />\n                  </div>\n                ))}\n             </div>\n           );\n         }\n       }\n\n       render(<AvatarDemo />, container);\n     </file>\n   </example>"
  }
};