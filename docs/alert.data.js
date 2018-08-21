window.source = {
  "title": "Alert",
  "url": "alert.html",
  "type": "js",
  "content": "import 'dom4';\nimport React, {PureComponent} from 'react';\nimport classNames from 'classnames';\nimport PropTypes from 'prop-types';\n\nimport {\n  ExceptionIcon,\n  CheckmarkIcon,\n  WarningIcon,\n  CloseIcon\n} from '../icon';\nimport Loader from '../loader-inline/loader-inline';\nimport {getRect} from '../global/dom';\nimport dataTests from '../global/data-tests';\n\nimport styles from './alert.css';\n\nexport const ANIMATION_TIME = 500;\n\n/**\n * @name Alert\n * @category Components\n * @tags Ring UI Language\n * @description Use **Alert** to display contextual notifications. If you want to display a stack of notifications, use **Alerts** instead.\n */\n\n/**\n * List of available alert types.\n * @enum {string}\n */\nconst Type = {\n  ERROR: 'error',\n  MESSAGE: 'message',\n  SUCCESS: 'success',\n  WARNING: 'warning',\n  LOADING: 'loading'\n};\n\n/**\n * Lookup table of alert type to icon modifier.\n * @type {Object.<Type, string>}\n */\nconst TypeToIcon = {\n  [Type.ERROR]: ExceptionIcon,\n  [Type.SUCCESS]: CheckmarkIcon,\n  [Type.WARNING]: WarningIcon\n};\n\n/**\n * Lookup table of alert type to icon color.\n * @type {Object.<Type, Icon.Color>}\n */\nconst TypeToIconColor = {\n  [Type.ERROR]: ExceptionIcon.Color.RED,\n  [Type.SUCCESS]: CheckmarkIcon.Color.GREEN,\n  [Type.WARNING]: WarningIcon.Color.WHITE\n};\n\n/**\n * @constructor\n * @name Alert\n * @extends {ReactComponent}\n * @example-file ./alert.examples.html\n */\n// eslint-disable-next-line react/no-deprecated\nexport default class Alert extends PureComponent {\n  static Type = Type;\n\n  static propTypes = {\n    timeout: PropTypes.number,\n    onCloseRequest: PropTypes.func,\n    onClose: PropTypes.func,\n    isShaking: PropTypes.bool,\n    isClosing: PropTypes.bool,\n    inline: PropTypes.bool,\n    showWithAnimation: PropTypes.bool,\n    closeable: PropTypes.bool,\n    type: PropTypes.oneOf(Object.values(Type)),\n\n    children: PropTypes.node,\n    className: PropTypes.string,\n    'data-test': PropTypes.string\n  };\n\n  /** @override */\n  static defaultProps = {\n    /** @type {boolean} */\n    closeable: true,\n    showWithAnimation: true,\n    type: Type.MESSAGE,\n    /**\n     * Whether an alert is rendered inside an {@code Alerts} container\n     * or standalone.\n     * @type {boolean}\n     */\n    inline: true,\n    isClosing: false,\n    isShaking: false,\n    timeout: 0,\n    onClose: () => {},\n    /**\n     * Fires when alert starts closing if timeout is out or user clicks \"Close\" button\n     * @type {?function(SyntheticMouseEvent):undefined}\n     */\n    onCloseRequest: () => {}\n  };\n\n  state = {\n    height: null\n  };\n\n  componentDidMount() {\n    if (this.props.timeout > 0) {\n      this.hideTimeout = setTimeout(this.closeRequest, this.props.timeout);\n    }\n  }\n\n  componentWillReceiveProps(newProps) {\n    if (newProps.isClosing) {\n      this._close();\n    }\n  }\n\n  componentWillUnmount() {\n    clearTimeout(this.hideTimeout);\n  }\n\n  closeRequest = (...args) => {\n    const height = getRect(this.node).height;\n    this.setState({height});\n    return this.props.onCloseRequest(...args);\n  };\n\n  _close() {\n    setTimeout(() => {\n      this.props.onClose();\n    }, ANIMATION_TIME);\n  }\n\n  /**\n   * @param {SyntheticEvent} evt\n   * @private\n   */\n  _handleCaptionsLinksClick = evt => {\n    if (evt.target.matches('a')) {\n      this.closeRequest(evt);\n    }\n  };\n\n  /**\n   * @private\n   */\n  _getCaption() {\n    return (\n      <span\n        className={styles.caption}\n        onClick={this._handleCaptionsLinksClick}\n      >\n        {this.props.children}\n      </span>\n    );\n  }\n\n  /**\n   * @private\n   * @return {XML|string}\n   */\n  _getIcon() {\n    const Icon = TypeToIcon[this.props.type];\n\n    if (Icon) {\n      return (\n        <Icon\n          className={styles.icon}\n          color={TypeToIconColor[this.props.type] || Icon.Color.DEFAULT}\n          size={Icon.Size.Size16}\n        />\n      );\n    } else if (this.props.type === Type.LOADING) {\n      return (\n        <Loader className={styles.loader} theme={Loader.Theme.DARK}/>\n      );\n    }\n\n    return '';\n  }\n\n  storeAlertRef = node => {\n    this.node = node;\n  };\n\n  render() {\n    const {type, inline, isClosing, isShaking,\n      showWithAnimation, className, 'data-test': dataTest} = this.props;\n\n    const classes = classNames(className, {\n      [styles.alert]: true,\n      [styles.animationOpen]: showWithAnimation,\n      [styles.error]: type === 'error',\n      [styles.alertInline]: inline,\n      [styles.animationClosing]: isClosing,\n      [styles.animationShaking]: isShaking\n    });\n\n    const style = this.state.height ? {marginBottom: -this.state.height} : null;\n\n    return (\n      <div\n        className={classes}\n        data-test={dataTests('alert', dataTest)}\n        data-test-type={type}\n        style={style}\n        ref={this.storeAlertRef}\n      >\n        {this._getIcon()}\n        {this._getCaption()}\n        {\n          this.props.closeable\n            ? (\n              <button\n                type=\"button\"\n                className={styles.close}\n                data-test=\"alert-close\"\n                onClick={this.closeRequest}\n              >\n                <CloseIcon\n                  size={CloseIcon.Size.Size16}\n                />\n              </button>\n            )\n            : ''\n        }\n      </div>\n    );\n  }\n}\n\nexport {default as Container} from './container';\n",
  "examples": [
    {
      "name": "Alert",
      "url": "examples/alert/alert.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"alert\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Alert from '@jetbrains/ring-ui/components/alert/alert';\n\nclass AlertDemo extends React.Component {\n   state = {\n     show: true,\n     isClosing: false\n   };\n\n   onClose = () => {\n     this.setState({show: false});\n   }\n\n   onCloseRequest = () => {\n     this.setState({isClosing: true});\n   }\n\n   render() {\n     const {show, isClosing} = this.state;\n     if (!show) {\n       return null;\n     }\n\n     return <Alert\n         type={Alert.Type.SUCCESS}\n         onClose={this.onClose}\n         showWithAnimation={false}\n         onCloseRequest={this.onCloseRequest}\n         isClosing={isClosing}\n       >\n         Sample alert\n       </Alert>;\n   }\n}\n\nrender(<AlertDemo/>, document.querySelector('#alert'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Alert Container",
      "url": "examples/alert/alert-container.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"alert-container\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\nimport Button from '@jetbrains/ring-ui/components/button/button';\nimport Alert, {Container} from '@jetbrains/ring-ui/components/alert/alert';\n\nclass AlertContainerDemo extends React.Component {\n  state = {\n    alerts: [\n      {type: Alert.Type.WARNING, key: 1, message: 'Test warning', isClosing: false},\n      {type: Alert.Type.LOADING, key: 2, message: 'Test loading', isClosing: false},\n      {type: Alert.Type.MESSAGE, key: 3, message: 'Test message', isClosing: false}\n    ]\n  };\n\n  yetAnotherMessage = () => {\n    this.setState({\n      alerts: [{\n          type: Alert.Type.MESSAGE,\n          key: Date.now(),\n          message: 'Another message at ' + new Date()\n        },\n        ...this.state.alerts\n      ]\n    });\n  }\n\n  onCloseAlert = (closedAlert) => {\n    this.setState({\n      alerts: this.state.alerts.filter(alert => alert !== closedAlert)\n    });\n  }\n\n  onCloseAlertClick = (alert) => {\n    const alertToClose = this.state.alerts.filter(it => alert.key === it.key)[0]\n    alertToClose.isClosing = true;\n    this.setState({alerts: [...this.state.alerts]});\n  }\n\n  render() {\n    return (\n      <div>\n        <Button onClick={this.yetAnotherMessage}>Create another message</Button>\n\n        <Container>\n          {this.state.alerts.map(alert => {\n            const {message, ...rest} = alert;\n            return (\n              <Alert\n                {...rest}\n                onCloseRequest={() => this.onCloseAlertClick(alert)}\n                onClose={() => this.onCloseAlert(alert)}\n              >\n                {message}\n              </Alert>\n            );\n          })}\n        </Container>\n      </div>\n    );\n  }\n}\n\nrender(<AlertContainerDemo/>, document.getElementById('alert-container'));\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Use **Alert** to display contextual notifications. If you want to display a stack of notifications, use **Alerts** instead.",
  "attrs": {
    "name": "Alert",
    "category": "Components",
    "tags": "Ring UI Language",
    "description": "Use **Alert** to display contextual notifications. If you want to display a stack of notifications, use **Alerts** instead."
  }
};