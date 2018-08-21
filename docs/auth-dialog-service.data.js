window.source = {
  "title": "Auth Dialog Service",
  "url": "auth-dialog-service.html",
  "type": "js",
  "content": "import React from 'react';\nimport {render} from 'react-dom';\n\nimport AuthDialog from '../auth-dialog/auth-dialog';\n\n/**\n * @name Auth Dialog Service\n * @tags Ring UI Language\n * @category Services\n * @framework React\n * @constructor\n * @description A wrapper for AuthDialog component. Allows showing confirmation dialog\n * without mounting AuthDialog component. Could be used outside React.\n * @example\n <example name=\"Auth Dialog Service\">\n <file name=\"index.html\" disable-auto-size>\n <div id=\"auth-dialog\"></div>\n </file>\n\n <file name=\"index.js\">\n import React from 'react';\n import {render} from 'react-dom';\n\n import Auth from '@jetbrains/ring-ui/components/auth/auth';\n import HTTP from '@jetbrains/ring-ui/components/http/http';\n import Button from '@jetbrains/ring-ui/components/button/button';\n import showAuthDialog from '@jetbrains/ring-ui/components/auth-dialog-service/auth-dialog-service';\n\n import hubConfig from '@ring-ui/docs/components/hub-config';\n\n const auth = new Auth(hubConfig);\n const http = new HTTP(auth, auth.getAPIPath());\n\n\n class AuthDialogDemo extends React.Component {\n       componentDidMount() {\n         auth.init();\n         http.get(`services/0-0-0-0-0?fields=name,iconUrl`).then(serviceDetails => {\n           this.setState({serviceDetails});\n           this.showAuthDialog();\n         })\n       }\n\n       showAuthDialog = () => {\n         const {serviceDetails} = this.state;\n         const errorMessage = \"Error message\"\n\n         showAuthDialog({serviceDetails, errorMessage}).\n           then(positive => console.info(positive ? 'Should authorize' : 'Should leave as is'));\n       }\n\n       render() {\n         return (\n           <div>\n             <Button onClick={this.showAuthDialog}>Show auth dialog</Button>\n           </div>\n         );\n      }\n     }\n\n render(<AuthDialogDemo/>, document.getElementById('auth-dialog'));\n </file>\n </example>\n */\n\nconst containerElement = document.createElement('div');\n\n/**\n * Renders AuthDialog into virtual node to skip maintaining container\n */\nfunction renderAuthDialog(props) {\n  render(<AuthDialog {...props}/>, containerElement);\n}\n\nexport default function showAuthDialog(props = {}) {\n  renderAuthDialog({\n    ...props,\n    show: true\n  });\n\n  return () => {\n    renderAuthDialog({show: false});\n  };\n}\n",
  "examples": [
    {
      "name": "Auth Dialog Service",
      "url": "examples/auth-dialog-service/auth-dialog-service.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"auth-dialog\"></div>\n",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\n\nimport Auth from '@jetbrains/ring-ui/components/auth/auth';\nimport HTTP from '@jetbrains/ring-ui/components/http/http';\nimport Button from '@jetbrains/ring-ui/components/button/button';\nimport showAuthDialog from '@jetbrains/ring-ui/components/auth-dialog-service/auth-dialog-service';\n\nimport hubConfig from '@ring-ui/docs/components/hub-config';\n\nconst auth = new Auth(hubConfig);\nconst http = new HTTP(auth, auth.getAPIPath());\n\n\nclass AuthDialogDemo extends React.Component {\n      componentDidMount() {\n        auth.init();\n        http.get(`services/0-0-0-0-0?fields=name,iconUrl`).then(serviceDetails => {\n          this.setState({serviceDetails});\n          this.showAuthDialog();\n        })\n      }\n\n      showAuthDialog = () => {\n        const {serviceDetails} = this.state;\n        const errorMessage = \"Error message\"\n\n        showAuthDialog({serviceDetails, errorMessage}).\n          then(positive => console.info(positive ? 'Should authorize' : 'Should leave as is'));\n      }\n\n      render() {\n        return (\n          <div>\n            <Button onClick={this.showAuthDialog}>Show auth dialog</Button>\n          </div>\n        );\n     }\n    }\n\nrender(<AuthDialogDemo/>, document.getElementById('auth-dialog'));\n",
          "showCode": true
        }
      ]
    }
  ],
  "description": "A wrapper for AuthDialog component. Allows showing confirmation dialog\nwithout mounting AuthDialog component. Could be used outside React.",
  "attrs": {
    "name": "Auth Dialog Service",
    "tags": "Ring UI Language",
    "category": "Services",
    "framework": "React",
    "constructor": "",
    "description": "A wrapper for AuthDialog component. Allows showing confirmation dialog\nwithout mounting AuthDialog component. Could be used outside React.",
    "example": " <example name=\"Auth Dialog Service\">\n <file name=\"index.html\" disable-auto-size>\n <div id=\"auth-dialog\"></div>\n </file>\n\n <file name=\"index.js\">\n import React from 'react';\n import {render} from 'react-dom';\n\n import Auth from '@jetbrains/ring-ui/components/auth/auth';\n import HTTP from '@jetbrains/ring-ui/components/http/http';\n import Button from '@jetbrains/ring-ui/components/button/button';\n import showAuthDialog from '@jetbrains/ring-ui/components/auth-dialog-service/auth-dialog-service';\n\n import hubConfig from '@ring-ui/docs/components/hub-config';\n\n const auth = new Auth(hubConfig);\n const http = new HTTP(auth, auth.getAPIPath());\n\n\n class AuthDialogDemo extends React.Component {\n       componentDidMount() {\n         auth.init();\n         http.get(`services/0-0-0-0-0?fields=name,iconUrl`).then(serviceDetails => {\n           this.setState({serviceDetails});\n           this.showAuthDialog();\n         })\n       }\n\n       showAuthDialog = () => {\n         const {serviceDetails} = this.state;\n         const errorMessage = \"Error message\"\n\n         showAuthDialog({serviceDetails, errorMessage}).\n           then(positive => console.info(positive ? 'Should authorize' : 'Should leave as is'));\n       }\n\n       render() {\n         return (\n           <div>\n             <Button onClick={this.showAuthDialog}>Show auth dialog</Button>\n           </div>\n         );\n      }\n     }\n\n render(<AuthDialogDemo/>, document.getElementById('auth-dialog'));\n </file>\n </example>"
  }
};