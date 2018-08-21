window.source = {
  "title": "Confirm Service",
  "url": "confirm-service.html",
  "type": "js",
  "content": "import React from 'react';\nimport {render} from 'react-dom';\n\nimport Confirm from '../confirm/confirm';\n\n/**\n * @name Confirm Service\n * @category Services\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description A wrapper for Confirm component. Allows showing confirmation dialog\n * without mounting Confirm component. Could be used outside React.\n * @example\n <example name=\"Confirm Service\">\n <file name=\"index.html\" disable-auto-size>\n <div id=\"confirm\"></div>\n </file>\n\n <file name=\"index.css\">\n   button {\n     margin-right: 8px !important;\n   }\n </file>\n\n <file name=\"index.js\">\n import {render} from 'react-dom';\n import React from 'react';\n import confirm from '@jetbrains/ring-ui/components/confirm-service/confirm-service';\n import Button from '@jetbrains/ring-ui/components/button/button';\n\n class ConfirmDemo extends React.Component {\n        componentDidMount() {\n          this.showConfirm();\n        }\n\n        showConfirm = () => {\n          return confirm({text: 'Do you really wish to proceed?'}).\n            then(() => console.info('Confirmed')).\n            catch(() => console.warn('Rejected'));\n        }\n\n        showWithAnotherText = () => {\n          return confirm({\n            text: 'There is another confirmation',\n            description: 'Confirmation description',\n            confirmLabel: 'OK',\n            rejectLabel: 'Cancel',\n            cancelIsDefault: true,\n            onBeforeConfirm: () => new Promise(resolve => setTimeout(resolve, 1000))\n          }).\n            then(() => console.info('Confirmed')).\n            catch(() => console.warn('Rejected'));\n        }\n\n        render() {\n          return (\n            <div>\n              <Button onClick={this.showConfirm}>Show confirm</Button>\n              <Button onClick={this.showWithAnotherText}>Show another message</Button>\n            </div>\n          );\n        }\n       }\n\n render(<ConfirmDemo/>, document.getElementById('confirm'));\n </file>\n </example>\n */\n\nexport const containerElement = document.createElement('div');\n\n/**\n * Renders Confirm into virtual node to skip maintaining container\n */\nfunction renderConfirm(props) {\n  render(<Confirm {...props}/>, containerElement);\n}\n\nexport default function confirm({\n  text,\n  description,\n  confirmLabel = 'OK',\n  rejectLabel = 'Cancel',\n  cancelIsDefault,\n  onBeforeConfirm\n}) {\n  return new Promise((resolve, reject) => {\n    const props = {\n      text,\n      description,\n      confirmLabel,\n      rejectLabel,\n      cancelIsDefault,\n      show: true,\n\n      onConfirm: () => {\n        if (onBeforeConfirm) {\n          renderConfirm({...props, inProgress: true});\n          return Promise.resolve(onBeforeConfirm()).\n            then(() => {\n              renderConfirm({show: false});\n              resolve();\n            }).\n            catch(err => {\n              renderConfirm({show: false});\n              reject(err);\n            });\n        }\n        renderConfirm({show: false});\n        return resolve();\n      },\n\n      onReject: () => {\n        renderConfirm({show: false});\n        reject(new Error('Confirm(@jetbrains/ring-ui): null exception'));\n      }\n    };\n\n    renderConfirm(props);\n  });\n}\n\nexport function hideConfirm() {\n  renderConfirm({show: false});\n}\n",
  "examples": [
    {
      "name": "Confirm Service",
      "url": "examples/confirm-service/confirm-service.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"confirm\"></div>\n",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbutton {\n  margin-right: 8px !important;\n}\n ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\nimport confirm from '@jetbrains/ring-ui/components/confirm-service/confirm-service';\nimport Button from '@jetbrains/ring-ui/components/button/button';\n\nclass ConfirmDemo extends React.Component {\n       componentDidMount() {\n         this.showConfirm();\n       }\n\n       showConfirm = () => {\n         return confirm({text: 'Do you really wish to proceed?'}).\n           then(() => console.info('Confirmed')).\n           catch(() => console.warn('Rejected'));\n       }\n\n       showWithAnotherText = () => {\n         return confirm({\n           text: 'There is another confirmation',\n           description: 'Confirmation description',\n           confirmLabel: 'OK',\n           rejectLabel: 'Cancel',\n           cancelIsDefault: true,\n           onBeforeConfirm: () => new Promise(resolve => setTimeout(resolve, 1000))\n         }).\n           then(() => console.info('Confirmed')).\n           catch(() => console.warn('Rejected'));\n       }\n\n       render() {\n         return (\n           <div>\n             <Button onClick={this.showConfirm}>Show confirm</Button>\n             <Button onClick={this.showWithAnotherText}>Show another message</Button>\n           </div>\n         );\n       }\n      }\n\nrender(<ConfirmDemo/>, document.getElementById('confirm'));\n",
          "showCode": true
        }
      ]
    }
  ],
  "description": "A wrapper for Confirm component. Allows showing confirmation dialog\nwithout mounting Confirm component. Could be used outside React.",
  "attrs": {
    "name": "Confirm Service",
    "category": "Services",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "A wrapper for Confirm component. Allows showing confirmation dialog\nwithout mounting Confirm component. Could be used outside React.",
    "example": " <example name=\"Confirm Service\">\n <file name=\"index.html\" disable-auto-size>\n <div id=\"confirm\"></div>\n </file>\n\n <file name=\"index.css\">\n   button {\n     margin-right: 8px !important;\n   }\n </file>\n\n <file name=\"index.js\">\n import {render} from 'react-dom';\n import React from 'react';\n import confirm from '@jetbrains/ring-ui/components/confirm-service/confirm-service';\n import Button from '@jetbrains/ring-ui/components/button/button';\n\n class ConfirmDemo extends React.Component {\n        componentDidMount() {\n          this.showConfirm();\n        }\n\n        showConfirm = () => {\n          return confirm({text: 'Do you really wish to proceed?'}).\n            then(() => console.info('Confirmed')).\n            catch(() => console.warn('Rejected'));\n        }\n\n        showWithAnotherText = () => {\n          return confirm({\n            text: 'There is another confirmation',\n            description: 'Confirmation description',\n            confirmLabel: 'OK',\n            rejectLabel: 'Cancel',\n            cancelIsDefault: true,\n            onBeforeConfirm: () => new Promise(resolve => setTimeout(resolve, 1000))\n          }).\n            then(() => console.info('Confirmed')).\n            catch(() => console.warn('Rejected'));\n        }\n\n        render() {\n          return (\n            <div>\n              <Button onClick={this.showConfirm}>Show confirm</Button>\n              <Button onClick={this.showWithAnotherText}>Show another message</Button>\n            </div>\n          );\n        }\n       }\n\n render(<ConfirmDemo/>, document.getElementById('confirm'));\n </file>\n </example>"
  }
};