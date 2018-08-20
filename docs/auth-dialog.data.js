window.source = {
  "title": "Auth Dialog",
  "url": "auth-dialog.html",
  "type": "js",
  "content": "import React, {Component} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport Dialog from '../dialog/dialog';\nimport Button from '../button/button';\n\nimport styles from './auth-dialog.css';\n\n/**\n * @name Auth Dialog\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description A component that shows an authentication dialog.\n * @example-file ./auth-dialog.examples.html\n */\n\nexport default class AuthDialog extends Component {\n  static propTypes = {\n    className: PropTypes.string,\n    title: PropTypes.string,\n    errorMessage: PropTypes.string,\n    serviceImage: PropTypes.string,\n    serviceName: PropTypes.string,\n    loginCaption: PropTypes.string,\n    loginToCaption: PropTypes.string,\n\n    show: PropTypes.bool,\n    cancelOnEsc: PropTypes.bool,\n    confirmLabel: PropTypes.string,\n    cancelLabel: PropTypes.string,\n\n    onConfirm: PropTypes.func,\n    onCancel: PropTypes.func\n  };\n\n  static defaultProps = {\n    loginCaption: 'Log in',\n    loginToCaption: 'Log in to %serviceName%',\n    show: false,\n    cancelOnEsc: true,\n    confirmLabel: 'Log in',\n    cancelLabel: 'Remain a guest',\n    onConfirm: () => {},\n    onCancel: () => {}\n  };\n\n  onEscPress = () => {\n    if (this.props.cancelOnEsc) {\n      this.props.onCancel();\n    }\n  };\n\n  render() {\n    const {\n      show,\n      className,\n      errorMessage,\n      serviceImage,\n      serviceName,\n      loginCaption,\n      loginToCaption,\n      confirmLabel,\n      cancelLabel,\n      onConfirm,\n      onCancel\n    } = this.props;\n\n    const defaultTitle = serviceName ? loginToCaption : loginCaption;\n    const title = (this.props.title || defaultTitle).replace('%serviceName%', serviceName);\n\n    return (\n      <Dialog\n        data-test=\"ring-auth-dialog\"\n        className={className}\n        contentClassName={classNames(className, styles.dialog)}\n        onEscPress={this.onEscPress}\n        show={show}\n        trapFocus\n      >\n        <div className={styles.content}>\n          {serviceImage && (\n            <img\n              className={styles.logo}\n              src={serviceImage}\n            />\n          )}\n          <div className={styles.title}>{title}</div>\n          {errorMessage && (\n            <div className={styles.error}>{errorMessage}</div>\n          )}\n          <Button\n            primary\n            className={styles.firstButton}\n            data-test=\"auth-dialog-confirm-button\"\n            onClick={onConfirm}\n          >\n            {confirmLabel}\n          </Button>\n          <Button\n            className={styles.button}\n            data-test=\"auth-dialog-cancel-button\"\n            onClick={onCancel}\n          >\n            {cancelLabel}\n          </Button>\n        </div>\n      </Dialog>\n    );\n  }\n}\n\n",
  "examples": [
    {
      "name": "Auth Dialog",
      "url": "examples/auth-dialog/auth-dialog.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"auth-dialog\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\nimport AuthDialog from '@jetbrains/ring-ui/components/auth-dialog/auth-dialog';\nimport Button from '@jetbrains/ring-ui/components/button/button';\nimport youtrackLogo from '!file-loader?publicPath=../../!@jetbrains/logos/youtrack/youtrack.svg';\n\nclass AuthDialogDemo extends React.Component {\n  state = {\n    confirm: {\n      show: true,\n      onConfirm: () => {},\n      onReject: () => {}\n    }\n  };\n\n  componentDidMount() {\n    this.showAuthDialog();\n  }\n\n  hideAuthDialog = () => {\n    this.setState({confirm: {show: false}});\n  }\n\n  showAuthDialog = () => {\n    return new Promise((resolve, reject) => {\n      this.setState({\n        confirm: {\n          show: true,\n          errorMessage: 'Authorization is required',\n          serviceName: 'YouTrack',\nonConfirm: () => this.hideAuthDialog() || resolve(),\n          onCancel: () => this.hideAuthDialog() || reject()\n        }\n      });\n    }).\n      then(() => console.info('Confirmed')).\n      catch(() => console.warn('Rejected'));\n  }\n\n  render() {\n    return (\n    <div>\n      <div>\n        <Button onClick={this.showAuthDialog}>Show dialog</Button>\n      </div>\n      <AuthDialog\n        {...this.state.confirm}\n        serviceImage={youtrackLogo}\n        confirmLabel=\"Log in\"\n        cancelLabel=\"Stay a guest\"\n      />\n    </div>\n    );\n  }\n }\n\nrender(<AuthDialogDemo/>, document.getElementById('auth-dialog'));\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "A component that shows an authentication dialog.",
  "attrs": {
    "name": "Auth Dialog",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "A component that shows an authentication dialog.",
    "example-file": "./auth-dialog.examples.html"
  }
};