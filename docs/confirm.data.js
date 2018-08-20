window.source = {
  "title": "Confirm",
  "url": "confirm.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\n\nimport Dialog from '../dialog/dialog';\nimport Button from '../button/button';\nimport {Content, Header} from '../island/island';\nimport Panel from '../panel/panel';\n\nimport styles from './confirm.css';\n\n/**\n * @name Confirm\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description A component that shows a confirmation dialog.\n * @example-file ./confirm.examples.html\n */\n\nexport default class Confirm extends PureComponent {\n  static propTypes = {\n    className: PropTypes.string,\n    text: PropTypes.string,\n    description: PropTypes.string,\n\n    show: PropTypes.bool,\n    rejectOnEsc: PropTypes.bool,\n    inProgress: PropTypes.bool,\n    cancelIsDefault: PropTypes.bool,\n    confirmLabel: PropTypes.string,\n    rejectLabel: PropTypes.string,\n\n    onConfirm: PropTypes.func,\n    onReject: PropTypes.func\n  };\n\n  static defaultProps = {\n    text: null,\n    description: null,\n    show: false,\n    rejectOnEsc: true,\n    inProgress: false,\n    cancelIsDefault: false,\n    confirmLabel: 'OK',\n    rejectLabel: 'Cancel',\n    onConfirm: () => {},\n    onReject: () => {}\n  };\n\n  onEscPress = () => {\n    if (this.props.rejectOnEsc) {\n      this.props.onReject();\n    }\n  };\n\n  render() {\n    const {\n      show,\n      className,\n      inProgress,\n      cancelIsDefault,\n      text,\n      description,\n      confirmLabel,\n      rejectLabel,\n      onConfirm,\n      onReject\n    } = this.props;\n\n    return (\n      <Dialog\n        className={className}\n        onEscPress={this.onEscPress}\n        show={show}\n        trapFocus\n      >\n        {text && <Header>{text}</Header>}\n        <Content>\n          {description && <div className={styles.description}>{description}</div>}\n        </Content>\n        <Panel>\n          <Button\n            data-test=\"confirm-ok-button\"\n            primary={!cancelIsDefault}\n            loader={inProgress}\n            disabled={inProgress}\n            onClick={onConfirm}\n          >\n            {confirmLabel}\n          </Button>\n          <Button\n            data-test=\"confirm-reject-button\"\n            onClick={onReject}\n            disabled={inProgress}\n            primary={cancelIsDefault}\n          >\n            {rejectLabel}\n          </Button>\n        </Panel>\n      </Dialog>\n    );\n  }\n}\n\n",
  "examples": [
    {
      "name": "Confirm",
      "url": "examples/confirm/confirm.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"confirm\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbutton {\n  margin-right: 8px !important;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\nimport Confirm from '@jetbrains/ring-ui/components/confirm/confirm';\nimport Button from '@jetbrains/ring-ui/components/button/button';\n\nclass ConfirmDemo extends React.Component {\n  state = {\n    confirm: {\n      show: true,\n      text: 'Do you really wish to proceed?',\n      description: 'A description of an action that is about to take place.',\n      inProgress: false,\n      onConfirm: () => {},\n      onReject: () => {}\n    }\n  };\n\n  componentDidMount() {\n    this.showConfirm();\n  }\n\n  hideConfirm = () => {\n    this.setState({confirm: {show: false}});\n  }\n\n  showConfirm = () => {\n    return new Promise((resolve, reject) => {\n      this.setState({\n        confirm: {\n          show: true,\n          text: 'Do you really wish to proceed?',\n          description: 'A description of an action that is about to take place.',\n          onConfirm: () => this.hideConfirm() || resolve(),\n          onReject: () => this.hideConfirm() || reject()\n        }\n      });\n    }).\n      then(() => console.info('Confirmed')).\n      catch(() => console.warn('Rejected'));\n  }\n\n  showWithAnotherText = () => {\n    return new Promise((resolve, reject) => {\n      this.setState({\n        confirm: {\n          show: true,\n          text: 'There is another question',\n          onConfirm: () => this.hideConfirm() || resolve(),\n          onReject: () => this.hideConfirm() || reject()\n        }\n      });\n    }).\n      then(() => console.info('Confirmed')).\n      catch(() => console.warn('Rejected'));\n  }\n\n  render() {\n    return (\n    <div>\n      <Button onClick={this.showConfirm}>Show confirm</Button>\n      <Button onClick={this.showWithAnotherText}>Show another message</Button>\n      <Confirm\n        show={this.state.confirm.show}\n        text={this.state.confirm.text}\n        description={this.state.confirm.description}\n        inProgress={this.state.inProgress}\n        confirmLabel=\"OK\"\n        rejectLabel=\"Cancel\"\n        onConfirm={this.state.confirm.onConfirm}\n        onReject={this.state.confirm.onReject}\n      />\n    </div>\n    );\n  }\n }\n\nrender(<ConfirmDemo/>, document.getElementById('confirm'));\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "A component that shows a confirmation dialog.",
  "attrs": {
    "name": "Confirm",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "A component that shows a confirmation dialog.",
    "example-file": "./confirm.examples.html"
  }
};