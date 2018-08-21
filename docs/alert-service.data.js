window.source = {
  "title": "Alert Service",
  "url": "alert-service.html",
  "type": "js",
  "content": "import React from 'react';\nimport {render} from 'react-dom';\n\nimport getUID from '../global/get-uid';\n\nimport Alert, {ANIMATION_TIME, Container as AlertContainer} from '../alert/alert';\n\n/**\n * @name Alert Service\n * @category Services\n * @tags Ring UI Language\n * @description Service for managing a stack of alerts.\n * @example-file ./alert-service.examples.html\n */\n\nclass AlertService {\n  defaultTimeout = 0;\n  // This alerts are stored in inverse order (last shown is first in array)\n  showingAlerts = [];\n  containerElement = document.createElement('div');\n\n  _getShowingAlerts() {\n    return [...this.showingAlerts];\n  }\n\n  renderAlertContainer(alerts) {\n    if (alerts.length === 0) {\n      return <span/>;\n    }\n\n    return (\n      <AlertContainer>\n        {alerts.map(alert => {\n          const {message, key, ...rest} = alert;\n          return (\n            <Alert\n              key={key}\n              {...rest}\n            >{message}</Alert>\n          );\n        })}\n      </AlertContainer>\n    );\n  }\n\n  /**\n   * Renders alert container into virtual node to skip maintaining container\n   */\n  renderAlerts() {\n    render(this.renderAlertContainer(this.showingAlerts), this.containerElement);\n  }\n\n  findSameAlert(message, type) {\n    return this.showingAlerts.filter(it => it.type === type && it.message === message)[0];\n  }\n\n  startAlertClosing(alert) {\n    alert.isClosing = true;\n    this.renderAlerts();\n  }\n\n  remove(key) {\n    const alertToClose = this.showingAlerts.filter(alert => alert.key === key)[0];\n    if (!alertToClose) {\n      return;\n    }\n    this.startAlertClosing(alertToClose);\n  }\n\n  removeWithoutAnimation(key) {\n    this.showingAlerts = this.showingAlerts.filter(alert => alert.key !== key);\n    this.renderAlerts();\n  }\n\n  stopShakingWhenAnimationDone(shakingAlert) {\n    setTimeout(() => {\n      shakingAlert.showWithAnimation = false;\n      shakingAlert.isShaking = false;\n      this.renderAlerts();\n    }, ANIMATION_TIME);\n  }\n\n  addAlert(message, type, timeout = this.defaultTimeout, restOptions = {}) {\n    const sameAlert = this.findSameAlert(message, type);\n    if (sameAlert) {\n      sameAlert.isShaking = true;\n      this.renderAlerts();\n      this.stopShakingWhenAnimationDone(sameAlert);\n      return sameAlert.key;\n    }\n\n    const alert = {\n      key: getUID('alert-service-'),\n      message,\n      type,\n      timeout,\n      isClosing: false,\n      onCloseRequest: () => this.startAlertClosing(alert),\n      onClose: () => this.removeWithoutAnimation(alert.key),\n      ...restOptions\n    };\n\n    this.showingAlerts = [alert, ...this.showingAlerts];\n    this.renderAlerts();\n    return alert.key;\n  }\n\n  setDefaultTimeout(timeout) {\n    this.defaultTimeout = timeout;\n  }\n\n  error(message, timeout) {\n    return this.addAlert(message, Alert.Type.ERROR, timeout);\n  }\n\n  message(message, timeout) {\n    return this.addAlert(message, Alert.Type.MESSAGE, timeout);\n  }\n\n  warning(message, timeout) {\n    return this.addAlert(message, Alert.Type.WARNING, timeout);\n  }\n\n  successMessage(message, timeout) {\n    return this.addAlert(message, Alert.Type.SUCCESS, timeout);\n  }\n\n  loadingMessage(message, timeout) {\n    return this.addAlert(message, Alert.Type.LOADING, timeout);\n  }\n}\n\nconst alertService = new AlertService();\nexport default alertService;\n",
  "examples": [
    {
      "name": "Alert Service",
      "url": "examples/alert-service/alert-service.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"alert-service\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbutton {\n  margin-right: 8px !important;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\nimport Button from '@jetbrains/ring-ui/components/button/button';\nimport alert from '@jetbrains/ring-ui/components/alert-service/alert-service';\n\nclass AlertServiceDemo extends React.Component {\n  componentDidMount () {\n    setTimeout(() => {\n      alert.message('A initial message', 5000);\n      alert.error('Error message');\n    }, 100);\n  }\n\n  showError = () => {\n    this.lastKey = alert.error('Something wrong happened');\n  }\n\n  showRandomWarning = () => {\n    this.lastKey = alert.warning(`Warning! Something bad is going to happen (${Math.random()})`, 30000);\n  }\n\n  showMessage = () => {\n    this.lastKey = alert.message('This is just a message', 5000);\n  }\n\n  removeLastAlert = () => {\n    alert.remove(this.lastKey);\n  }\n\n  render() {\n    return (\n      <div>\n        <Button onClick={this.showError}>Show error</Button>\n        <Button onClick={this.showMessage} primary>Show message</Button>\n        <Button onClick={this.showRandomWarning}>Show warning</Button>\n        <Button onClick={this.removeLastAlert}>Remove last alert</Button>\n      </div>\n    );\n  }\n}\n\nrender(<AlertServiceDemo/>, document.getElementById('alert-service'));\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Service for managing a stack of alerts.",
  "attrs": {
    "name": "Alert Service",
    "category": "Services",
    "tags": "Ring UI Language",
    "description": "Service for managing a stack of alerts.",
    "example-file": "./alert-service.examples.html"
  }
};